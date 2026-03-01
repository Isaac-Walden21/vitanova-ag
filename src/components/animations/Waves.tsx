"use client";

import { useRef, useEffect } from "react";

/* ── Perlin noise (built-in, no deps) ── */
class Grad {
  x: number; y: number; z: number;
  constructor(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z; }
  dot2(x: number, y: number) { return this.x * x + this.y * y; }
}

class Noise {
  grad3: Grad[];
  p: number[];
  perm: number[];
  gradP: Grad[];

  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
      new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
      new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1),
    ];
    this.p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }

  seed(seed: number) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;
    for (let i = 0; i < 256; i++) {
      const v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }

  fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(a: number, b: number, t: number) { return (1 - t) * a + t * b; }

  perlin2(x: number, y: number) {
    let X = Math.floor(x), Y = Math.floor(y);
    x -= X; y -= Y; X &= 255; Y &= 255;
    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
    const u = this.fade(x);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
  }
}

interface WavesProps {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  className?: string;
}

export default function Waves({
  lineColor = "rgba(45, 80, 22, 0.15)",
  backgroundColor = "transparent",
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 10,
  yGap = 32,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 100,
  className = "",
}: WavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise = new Noise(Math.random());
    let bounding = container.getBoundingClientRect();
    const mouse = { x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false };
    let lines: Array<Array<{ x: number; y: number; wave: { x: number; y: number }; cursor: { x: number; y: number; vx: number; vy: number } }>> = [];
    let frameId: number;

    function setSize() {
      bounding = container!.getBoundingClientRect();
      canvas!.width = bounding.width;
      canvas!.height = bounding.height;
    }

    function setLines() {
      lines = [];
      const oW = bounding.width + 200;
      const oH = bounding.height + 30;
      const totalLines = Math.ceil(oW / xGap);
      const totalPoints = Math.ceil(oH / yGap);
      const xStart = (bounding.width - xGap * totalLines) / 2;
      const yStart = (bounding.height - yGap * totalPoints) / 2;
      for (let i = 0; i <= totalLines; i++) {
        const pts: typeof lines[0] = [];
        for (let j = 0; j <= totalPoints; j++) {
          pts.push({ x: xStart + xGap * i, y: yStart + yGap * j, wave: { x: 0, y: 0 }, cursor: { x: 0, y: 0, vx: 0, vy: 0 } });
        }
        lines.push(pts);
      }
    }

    function tick(t: number) {
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      mouse.v = Math.hypot(dx, dy);
      mouse.vs += (mouse.v - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);

      lines.forEach((pts) => {
        pts.forEach((p) => {
          const move = noise.perlin2((p.x + t * waveSpeedX) * 0.002, (p.y + t * waveSpeedY) * 0.0015) * 12;
          p.wave.x = Math.cos(move) * waveAmpX;
          p.wave.y = Math.sin(move) * waveAmpY;
          const ddx = p.x - mouse.sx;
          const ddy = p.y - mouse.sy;
          const dist = Math.hypot(ddx, ddy);
          const l = Math.max(175, mouse.vs);
          if (dist < l) {
            const s = 1 - dist / l;
            const f = Math.cos(dist * 0.001) * s;
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
          }
          p.cursor.vx += -p.cursor.x * tension;
          p.cursor.vy += -p.cursor.y * tension;
          p.cursor.vx *= friction;
          p.cursor.vy *= friction;
          p.cursor.x += p.cursor.vx * 2;
          p.cursor.y += p.cursor.vy * 2;
          p.cursor.x = Math.min(maxCursorMove, Math.max(-maxCursorMove, p.cursor.x));
          p.cursor.y = Math.min(maxCursorMove, Math.max(-maxCursorMove, p.cursor.y));
        });
      });

      ctx!.clearRect(0, 0, bounding.width, bounding.height);
      ctx!.beginPath();
      ctx!.strokeStyle = lineColor;
      lines.forEach((points) => {
        const first = points[0];
        ctx!.moveTo(first.x + first.wave.x, first.y + first.wave.y);
        points.forEach((p, idx) => {
          const isLast = idx === points.length - 1;
          const px = p.x + p.wave.x + (isLast ? 0 : p.cursor.x);
          const py = p.y + p.wave.y + (isLast ? 0 : p.cursor.y);
          ctx!.lineTo(px, py);
        });
      });
      ctx!.stroke();

      frameId = requestAnimationFrame(tick);
    }

    function updateMouse(x: number, y: number) {
      mouse.x = x - bounding.left;
      mouse.y = y - bounding.top;
      if (!mouse.set) {
        mouse.sx = mouse.x; mouse.sy = mouse.y;
        mouse.lx = mouse.x; mouse.ly = mouse.y;
        mouse.set = true;
      }
    }

    function onMouseMove(e: MouseEvent) { updateMouse(e.clientX, e.clientY); }
    function onTouchMove(e: TouchEvent) { updateMouse(e.touches[0].clientX, e.touches[0].clientY); }
    function onResize() { setSize(); setLines(); }

    setSize();
    setLines();
    frameId = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(frameId);
    };
  }, [lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, xGap, yGap, friction, tension, maxCursorMove]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        overflow: "hidden", backgroundColor, pointerEvents: "none",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
