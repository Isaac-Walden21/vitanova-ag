"use client";

import { useRef, useMemo, createContext, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMotionValueEvent } from "framer-motion";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Shared progress ref — every sub-component reads this per-frame    */
/* ------------------------------------------------------------------ */

const ProgressCtx = createContext<React.RefObject<number>>({ current: 0 });
function useProgress() {
  return useContext(ProgressCtx);
}

/* ------------------------------------------------------------------ */
/*  Stem — curved tube that extends upward                            */
/* ------------------------------------------------------------------ */

function Stem() {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useProgress();

  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const sway = Math.sin(t * Math.PI * 2) * 0.12;
      pts.push(new THREE.Vector3(sway, t * 6 - 2.5, 0));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 64, 0.08, 8, false),
    [curve]
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const p = progressRef.current ?? 0;
    const growY = Math.max(0.01, p);
    meshRef.current.scale.set(1, growY, 1);
    meshRef.current.position.y = -2.5 + (1 - growY) * -2.5;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#3D6B2F" roughness={0.8} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Leaf — unfurls at a given scroll threshold                        */
/* ------------------------------------------------------------------ */

function Leaf({
  yPos,
  side,
  appearAt,
  size = 1,
}: {
  yPos: number;
  side: "left" | "right";
  appearAt: number;
  size?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const progressRef = useProgress();
  const sign = side === "left" ? -1 : 1;

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.quadraticCurveTo(0.6 * sign, 0.3, 0.9 * sign, 0);
    s.quadraticCurveTo(0.6 * sign, -0.15, 0, 0);
    return s;
  }, [sign]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = progressRef.current ?? 0;
    const leafProgress = Math.max(0, Math.min(1, (p - appearAt) / 0.15));
    const target = leafProgress * size;

    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, target, delta * 4);
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, target, delta * 4);
    ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, target, delta * 4);

    ref.current.rotation.z = sign * (0.3 + Math.sin(Date.now() * 0.001 + yPos) * 0.05);
  });

  return (
    <group ref={ref} position={[0.1 * sign, yPos, 0]} scale={0}>
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="#4A7C3F" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Roots — spread below soil line                                    */
/* ------------------------------------------------------------------ */

function Roots() {
  const ref = useRef<THREE.Group>(null);
  const progressRef = useProgress();

  const rootCurves = useMemo(() => {
    const angles = [-0.8, -0.3, 0.2, 0.7];
    return angles.map((angle) =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -2.5, 0),
        new THREE.Vector3(angle * 0.6, -3.0, angle * 0.3),
        new THREE.Vector3(angle * 1.2, -3.6, angle * 0.5),
      ])
    );
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = progressRef.current ?? 0;
    const rootScale = Math.min(1, p / 0.15);
    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, rootScale, delta * 3);
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, rootScale, delta * 3);
    ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, rootScale, delta * 3);
  });

  return (
    <group ref={ref} scale={0}>
      {rootCurves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 16, 0.03, 6, false]} />
          <meshStandardMaterial color="#5C3D2E" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Ear of corn + tassel — appears late in growth                     */
/* ------------------------------------------------------------------ */

function EarOfCorn() {
  const earRef = useRef<THREE.Mesh>(null);
  const tasselRef = useRef<THREE.Group>(null);
  const progressRef = useProgress();

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0;

    // Ear appears at 70%
    if (earRef.current) {
      const earProgress = Math.max(0, (p - 0.7) / 0.2);
      const s = THREE.MathUtils.lerp(earRef.current.scale.x, earProgress, delta * 3);
      earRef.current.scale.set(s, s, s);
    }

    // Tassel at 85%
    if (tasselRef.current) {
      const tasselProgress = Math.max(0, (p - 0.85) / 0.15);
      const s = THREE.MathUtils.lerp(tasselRef.current.scale.x, tasselProgress, delta * 3);
      tasselRef.current.scale.set(s, s, s);
      tasselRef.current.position.y = p * 3.5 - 2.5;
    }
  });

  return (
    <>
      <mesh ref={earRef} position={[0.25, 1.4, 0]} scale={0} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.12, 0.6, 8]} />
        <meshStandardMaterial color="#C4A94D" roughness={0.6} />
      </mesh>

      <group ref={tasselRef} scale={0}>
        {[0, 0.4, 0.8, 1.2, 1.6].map((rot) => (
          <mesh key={rot} rotation={[0.4, rot * Math.PI, 0.2]}>
            <cylinderGeometry args={[0.01, 0.005, 0.4, 4]} />
            <meshStandardMaterial color="#B89A3D" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Full plant assembly                                               */
/* ------------------------------------------------------------------ */

function Plant() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={ref}>
      {/* Soil plane */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#8B6F47" roughness={1} transparent opacity={0.3} />
      </mesh>

      <Roots />
      <Stem />

      <Leaf yPos={-1.5} side="right" appearAt={0.1} size={0.7} />
      <Leaf yPos={-0.5} side="left" appearAt={0.2} size={0.9} />
      <Leaf yPos={0.3} side="right" appearAt={0.3} size={1.1} />
      <Leaf yPos={1.0} side="left" appearAt={0.4} size={1.2} />
      <Leaf yPos={1.7} side="right" appearAt={0.5} size={1.0} />
      <Leaf yPos={2.3} side="left" appearAt={0.6} size={0.8} />

      <EarOfCorn />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Camera rig — pans up as plant grows                               */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useProgress();
  const smoothProgress = useRef(0);

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0;
    smoothProgress.current = THREE.MathUtils.lerp(smoothProgress.current, p, delta * 5);
    if (groupRef.current) {
      groupRef.current.position.y = -smoothProgress.current * 1.5;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} color="#A3B899" />
      <Plant />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported component — bridges Framer Motion → R3F                  */
/* ------------------------------------------------------------------ */

export default function PlantScene({
  scrollProgress,
}: {
  scrollProgress: import("framer-motion").MotionValue<number>;
}) {
  const progressRef = useRef(0);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    progressRef.current = v;
  });

  return (
    <ProgressCtx.Provider value={progressRef}>
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraRig />
      </Canvas>
    </ProgressCtx.Provider>
  );
}
