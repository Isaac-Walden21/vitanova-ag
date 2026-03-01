"use client";

import { useEffect, useRef } from "react";
import { Renderer, Transform, Vec3, Color, Polyline } from "ogl";

interface RibbonsProps {
  colors?: string[];
  baseSpring?: number;
  baseFriction?: number;
  baseThickness?: number;
  offsetFactor?: number;
  maxAge?: number;
  pointCount?: number;
  speedMultiplier?: number;
  backgroundColor?: number[];
}

export default function Ribbons({
  colors = ["#7C9A6E", "#C4A94D", "#2D5016"],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 20,
  offsetFactor = 0.05,
  maxAge = 500,
  pointCount = 50,
  speedMultiplier = 0.6,
  backgroundColor = [0, 0, 0, 0],
}: RibbonsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: window.devicePixelRatio || 2, alpha: true });
    const gl = renderer.gl;
    gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
    gl.canvas.style.position = "absolute";
    gl.canvas.style.top = "0";
    gl.canvas.style.left = "0";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const scene = new Transform();

    const vertex = `
      precision highp float;
      attribute vec3 position;
      attribute vec3 next;
      attribute vec3 prev;
      attribute vec2 uv;
      attribute float side;
      uniform vec2 uResolution;
      uniform float uDPR;
      uniform float uThickness;
      varying vec2 vUV;
      vec4 getPosition() {
        vec4 current = vec4(position, 1.0);
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        vec2 nextScreen = next.xy * aspect;
        vec2 prevScreen = prev.xy * aspect;
        vec2 tangent = normalize(nextScreen - prevScreen);
        vec2 normal = vec2(-tangent.y, tangent.x);
        normal /= aspect;
        normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
        float dist = length(nextScreen - prevScreen);
        normal *= smoothstep(0.0, 0.02, dist);
        float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
        float pixelWidth = current.w * pixelWidthRatio;
        normal *= pixelWidth * uThickness;
        current.xy -= normal * side;
        return current;
      }
      void main() {
        vUV = uv;
        gl_Position = getPosition();
      }
    `;

    const fragment = `
      precision highp float;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUV;
      void main() {
        float fade = 1.0 - smoothstep(0.0, 1.0, vUV.y);
        gl_FragColor = vec4(uColor, uOpacity * fade * 0.6);
      }
    `;

    interface Line {
      spring: number;
      friction: number;
      mouseVelocity: Vec3;
      mouseOffset: Vec3;
      points: Vec3[];
      polyline: Polyline;
    }

    const lines: Line[] = [];
    const center = (colors.length - 1) / 2;

    colors.forEach((color, index) => {
      const spring = baseSpring + (Math.random() - 0.5) * 0.05;
      const friction = baseFriction + (Math.random() - 0.5) * 0.05;
      const thickness = baseThickness + (Math.random() - 0.5) * 3;
      const mouseOffset = new Vec3(
        (index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.1,
        0
      );
      const points: Vec3[] = [];
      for (let i = 0; i < pointCount; i++) points.push(new Vec3());

      const polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color(color) },
          uThickness: { value: thickness },
          uOpacity: { value: 1.0 },
        },
      });
      polyline.mesh.setParent(scene);
      lines.push({ spring, friction, mouseVelocity: new Vec3(), mouseOffset, points, polyline });
    });

    function resize() {
      renderer.setSize(container!.clientWidth, container!.clientHeight);
      lines.forEach((l) => l.polyline.resize());
    }
    window.addEventListener("resize", resize);
    resize();

    const mouse = new Vec3();
    function updateMouse(e: MouseEvent | TouchEvent) {
      const rect = container!.getBoundingClientRect();
      let x: number, y: number;
      if ("changedTouches" in e) {
        x = e.changedTouches[0].clientX - rect.left;
        y = e.changedTouches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      mouse.set((x / rect.width) * 2 - 1, (y / rect.height) * -2 + 1, 0);
    }
    container.addEventListener("mousemove", updateMouse as EventListener);
    container.addEventListener("touchmove", updateMouse as EventListener);

    const tmp = new Vec3();
    let frameId: number;

    function update(t: number) {
      frameId = requestAnimationFrame(update);
      lines.forEach((line) => {
        tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
        line.mouseVelocity.add(tmp).multiply(line.friction);
        line.points[0].add(line.mouseVelocity);
        for (let i = 1; i < line.points.length; i++) {
          const segmentDelay = maxAge / (line.points.length - 1);
          const alpha = Math.min(1, (16 * speedMultiplier) / segmentDelay);
          line.points[i].lerp(line.points[i - 1], alpha);
        }
        line.polyline.updateGeometry();
      });
      renderer.render({ scene });
    }
    frameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", updateMouse as EventListener);
      container.removeEventListener("touchmove", updateMouse as EventListener);
      cancelAnimationFrame(frameId);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
    };
  }, [colors, baseSpring, baseFriction, baseThickness, offsetFactor, maxAge, pointCount, speedMultiplier, backgroundColor]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
}
