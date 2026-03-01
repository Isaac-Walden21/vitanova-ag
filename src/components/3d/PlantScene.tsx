"use client";

import { useRef, useMemo, createContext, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useMotionValueEvent } from "framer-motion";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Shared scroll progress — every sub-component reads per-frame      */
/* ------------------------------------------------------------------ */

const ProgressCtx = createContext<React.RefObject<number>>({ current: 0 });
function useProgress() {
  return useContext(ProgressCtx);
}

/* ------------------------------------------------------------------ */
/*  Custom leaf geometry — tapered, arched, drooping corn leaf         */
/* ------------------------------------------------------------------ */

function createLeafGeometry(length: number, width: number, segments = 20, widthSegs = 5) {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    // Taper — widest ~30% from base, narrows to tip
    const envelope = Math.sin(t * Math.PI) * (1 - t * 0.4);
    const halfW = (width / 2) * Math.max(envelope, 0.02);

    // Midrib arch then droop
    const arch = Math.sin(t * Math.PI * 0.45) * length * 0.18;
    const droop = t * t * length * -0.25;
    const y = arch + droop;
    const x = t * length;

    for (let j = 0; j <= widthSegs; j++) {
      const s = j / widthSegs;
      const across = (s - 0.5) * 2; // -1→1

      // Cross-section V-curve from midrib
      const crossDip = -Math.abs(across) * halfW * 0.18;
      // Subtle longitudinal wave
      const wave = Math.sin(t * Math.PI * 2.5 + across) * 0.015 * t;

      positions.push(x, y + crossDip + wave, across * halfW);
      normals.push(0, 1, 0);
      uvs.push(t, s);
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < widthSegs; j++) {
      const a = i * (widthSegs + 1) + j;
      const b = a + widthSegs + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setIndex(indices);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

/* ------------------------------------------------------------------ */
/*  Stalk — segmented tube with taper and node bumps                  */
/* ------------------------------------------------------------------ */

function Stalk() {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useProgress();

  const geometry = useMemo(() => {
    const height = 7;
    const segs = 60;
    const radial = 10;
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Node positions (where leaves attach)
    const nodes = [0.12, 0.22, 0.34, 0.46, 0.56, 0.66, 0.76];

    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const y = t * height - 3;

      // Radius tapers from ~0.09 at base to ~0.04 at top
      let radius = 0.09 - t * 0.05;

      // Bump at each node
      for (const n of nodes) {
        const dist = Math.abs(t - n);
        if (dist < 0.015) {
          radius += 0.015 * (1 - dist / 0.015);
        }
      }

      // Subtle organic sway
      const swayX = Math.sin(t * Math.PI * 1.5) * 0.06;
      const swayZ = Math.cos(t * Math.PI * 2.3) * 0.03;

      for (let j = 0; j <= radial; j++) {
        const angle = (j / radial) * Math.PI * 2;
        const nx = Math.cos(angle);
        const nz = Math.sin(angle);

        positions.push(swayX + nx * radius, y, swayZ + nz * radius);
        normals.push(nx, 0, nz);
        uvs.push(j / radial, t);
      }
    }

    for (let i = 0; i < segs; i++) {
      for (let j = 0; j < radial; j++) {
        const a = i * (radial + 1) + j;
        const b = a + radial + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setIndex(indices);
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = progressRef.current ?? 0;
    const grow = Math.max(0.001, p);
    meshRef.current.scale.set(1, grow, 1);
    meshRef.current.position.y = -3 + (1 - grow) * -3;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color="#4A8033"
        roughness={0.75}
        metalness={0.0}
        clearcoat={0.05}
        clearcoatRoughness={0.6}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Corn Leaf — realistic curved leaf with translucency               */
/* ------------------------------------------------------------------ */

function CornLeaf({
  yPos,
  angle,
  tilt = 0,
  appearAt,
  length = 2.2,
  width = 0.28,
}: {
  yPos: number;
  angle: number;
  tilt?: number;
  appearAt: number;
  length?: number;
  width?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const progressRef = useProgress();

  const geometry = useMemo(() => createLeafGeometry(length, width), [length, width]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = progressRef.current ?? 0;
    const leafP = Math.max(0, Math.min(1, (p - appearAt) / 0.12));
    const target = leafP;

    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, target, delta * 3);
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, target, delta * 3);
    ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, target, delta * 3);

    // Gentle wind sway
    const sway = Math.sin(Date.now() * 0.0007 + yPos * 3) * 0.015;
    ref.current.rotation.x = tilt + sway;
  });

  return (
    <group ref={ref} position={[0, yPos, 0]} rotation={[tilt, angle, 0]} scale={0}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#3E7D28"
          roughness={0.55}
          metalness={0.0}
          side={THREE.DoubleSide}
          transmission={0.08}
          thickness={0.3}
          clearcoat={0.08}
          clearcoatRoughness={0.5}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Root system — branching underground tubes                         */
/* ------------------------------------------------------------------ */

function Roots() {
  const ref = useRef<THREE.Group>(null);
  const progressRef = useProgress();

  const rootData = useMemo(() => {
    const roots: THREE.CatmullRomCurve3[] = [];
    // Primary roots — radiate outward
    const primaryAngles = [0, 0.9, 1.7, 2.5, 3.4, 4.2, 5.1, 5.8];
    for (const a of primaryAngles) {
      const dx = Math.cos(a);
      const dz = Math.sin(a);
      const depth = 0.8 + Math.random() * 0.6;
      const spread = 0.6 + Math.random() * 0.5;
      roots.push(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -3, 0),
          new THREE.Vector3(dx * spread * 0.3, -3 - depth * 0.4, dz * spread * 0.3),
          new THREE.Vector3(dx * spread * 0.7, -3 - depth * 0.7, dz * spread * 0.7),
          new THREE.Vector3(dx * spread, -3 - depth, dz * spread),
        ])
      );
    }
    // A few secondary branches
    for (let i = 0; i < 5; i++) {
      const a = Math.random() * Math.PI * 2;
      const dx = Math.cos(a);
      const dz = Math.sin(a);
      roots.push(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(dx * 0.2, -3.2, dz * 0.2),
          new THREE.Vector3(dx * 0.5, -3.5 - Math.random() * 0.3, dz * 0.5),
          new THREE.Vector3(dx * 0.8, -3.8 - Math.random() * 0.4, dz * 0.8),
        ])
      );
    }
    return roots;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = progressRef.current ?? 0;
    const s = Math.min(1, p / 0.12);
    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, s, delta * 3);
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, s, delta * 3);
    ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, s, delta * 3);
  });

  return (
    <group ref={ref} scale={0}>
      {rootData.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 12, i < 8 ? 0.018 : 0.008, 5, false]} />
          <meshPhysicalMaterial color="#6B4930" roughness={0.9} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Ear of corn — husk-wrapped with silk threads                      */
/* ------------------------------------------------------------------ */

function EarOfCorn() {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useProgress();

  // Husk leaves
  const huskGeometries = useMemo(() => {
    const husks: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 4; i++) {
      const geo = createLeafGeometry(0.5, 0.18, 10, 3);
      husks.push(geo);
    }
    return husks;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const p = progressRef.current ?? 0;
    const earP = Math.max(0, (p - 0.65) / 0.2);
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, earP, delta * 3);
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} position={[0.12, 0.6, 0.05]} rotation={[0, 0, 0.25]} scale={0}>
      {/* Core cob */}
      <mesh>
        <cylinderGeometry args={[0.06, 0.08, 0.55, 12]} />
        <meshPhysicalMaterial color="#D4A843" roughness={0.5} metalness={0} />
      </mesh>
      {/* Kernel bumps — rows of small spheres around the cob */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => {
          const angle = (row / 8) * Math.PI * 2;
          const y = (col / 10) * 0.45 - 0.2;
          const r = 0.065;
          return (
            <mesh
              key={`${row}-${col}`}
              position={[Math.cos(angle) * r, y, Math.sin(angle) * r]}
              scale={0.018}
            >
              <sphereGeometry args={[1, 4, 4]} />
              <meshPhysicalMaterial color="#E8C44A" roughness={0.4} />
            </mesh>
          );
        })
      )}
      {/* Husk leaves wrapping */}
      {huskGeometries.map((geo, i) => (
        <mesh
          key={i}
          geometry={geo}
          position={[0, -0.2, 0]}
          rotation={[0.3, (i / 4) * Math.PI * 2, -0.2]}
        >
          <meshPhysicalMaterial
            color="#8BAF6E"
            roughness={0.6}
            side={THREE.DoubleSide}
            transmission={0.05}
            thickness={0.2}
          />
        </mesh>
      ))}
      {/* Silk threads at top */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.25, 0),
          new THREE.Vector3(
            Math.cos(a) * 0.08,
            0.35 + Math.random() * 0.1,
            Math.sin(a) * 0.08
          ),
          new THREE.Vector3(
            Math.cos(a) * 0.15,
            0.3 + Math.random() * 0.15,
            Math.sin(a) * 0.15
          ),
        ]);
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 6, 0.003, 3, false]} />
            <meshPhysicalMaterial color="#C8955A" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Tassel — branching filaments at the plant top                     */
/* ------------------------------------------------------------------ */

function Tassel() {
  const ref = useRef<THREE.Group>(null);
  const progressRef = useProgress();

  const filaments = useMemo(() => {
    const curves: THREE.CatmullRomCurve3[] = [];
    // Central spike
    curves.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.01, 0.2, 0),
        new THREE.Vector3(-0.01, 0.4, 0.01),
      ])
    );
    // Branching filaments
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + Math.random() * 0.3;
      const spread = 0.12 + Math.random() * 0.1;
      const h = 0.15 + Math.random() * 0.2;
      curves.push(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.05 + Math.random() * 0.1, 0),
          new THREE.Vector3(Math.cos(a) * spread * 0.5, h * 0.7, Math.sin(a) * spread * 0.5),
          new THREE.Vector3(
            Math.cos(a) * spread,
            h - 0.05,
            Math.sin(a) * spread
          ),
        ])
      );
    }
    return curves;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = progressRef.current ?? 0;
    const topY = p * 4 - 3;
    ref.current.position.y = topY;

    const tasselP = Math.max(0, (p - 0.82) / 0.15);
    const s = THREE.MathUtils.lerp(ref.current.scale.x, tasselP, delta * 3);
    ref.current.scale.set(s, s, s);
  });

  return (
    <group ref={ref} scale={0}>
      {filaments.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 8, i === 0 ? 0.008 : 0.004, 4, false]} />
          <meshPhysicalMaterial
            color={i === 0 ? "#A08840" : "#C4A24D"}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Soil ground plane                                                  */
/* ------------------------------------------------------------------ */

function Soil() {
  return (
    <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[3, 32]} />
      <meshPhysicalMaterial
        color="#7A6040"
        roughness={1}
        metalness={0}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Full plant assembly                                               */
/* ------------------------------------------------------------------ */

function Plant() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.12;
  });

  // Leaves arranged in alternating phyllotaxis (like real corn)
  const leaves = useMemo(
    () => [
      { yPos: -1.8, angle: 0.3, appearAt: 0.08, length: 1.4, width: 0.2, tilt: -0.05 },
      { yPos: -1.2, angle: Math.PI * 0.55, appearAt: 0.15, length: 1.8, width: 0.25, tilt: -0.03 },
      { yPos: -0.5, angle: Math.PI * 1.1, appearAt: 0.22, length: 2.2, width: 0.3, tilt: 0 },
      { yPos: 0.1, angle: Math.PI * 0.05, appearAt: 0.3, length: 2.5, width: 0.32, tilt: 0.02 },
      { yPos: 0.65, angle: Math.PI * 0.6, appearAt: 0.38, length: 2.4, width: 0.3, tilt: 0.03 },
      { yPos: 1.1, angle: Math.PI * 1.15, appearAt: 0.46, length: 2.1, width: 0.28, tilt: 0.05 },
      { yPos: 1.55, angle: Math.PI * 0.15, appearAt: 0.54, length: 1.7, width: 0.24, tilt: 0.08 },
      { yPos: 1.9, angle: Math.PI * 0.7, appearAt: 0.62, length: 1.3, width: 0.2, tilt: 0.1 },
    ],
    []
  );

  return (
    <group ref={ref}>
      <Soil />
      <Roots />
      <Stalk />
      {leaves.map((props, i) => (
        <CornLeaf key={i} {...props} />
      ))}
      <EarOfCorn />
      <Tassel />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Camera rig — pans up as plant grows                               */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useProgress();
  const smooth = useRef(0);

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0;
    smooth.current = THREE.MathUtils.lerp(smooth.current, p, delta * 4);
    if (groupRef.current) {
      groupRef.current.position.y = -smooth.current * 2.0;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Key light — warm sun */}
      <directionalLight position={[5, 10, 5]} intensity={2} color="#FFF8E7" />
      {/* Fill — cooler sky bounce */}
      <directionalLight position={[-4, 6, -3]} intensity={0.6} color="#B8CCE0" />
      {/* Rim / back light */}
      <directionalLight position={[0, 4, -6]} intensity={0.8} color="#FFE8C0" />
      <ambientLight intensity={0.35} />

      <Plant />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported wrapper — bridges Framer Motion MotionValue → R3F        */
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
        camera={{ position: [0, 0.5, 5.5], fov: 40 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.1;
        }}
      >
        <Environment preset="forest" background={false} />
        <CameraRig />
      </Canvas>
    </ProgressCtx.Provider>
  );
}
