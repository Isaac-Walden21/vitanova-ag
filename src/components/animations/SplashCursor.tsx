"use client";

/* ── Fluid simulation cursor effect (from ReactBits) ── */
/* Renders a fixed full-screen WebGL canvas with fluid dynamics */

import { useEffect, useRef, useCallback } from "react";

function getWebGLContext(canvas: HTMLCanvasElement) {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };
  const gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
  const isWebGL2 = !!gl;
  const actualGl = gl || (canvas.getContext("webgl", params) as WebGLRenderingContext);
  if (!actualGl) return null;

  let halfFloat: { HALF_FLOAT_OES: number } | null = null;
  let supportLinearFiltering: OES_texture_float_linear | null = null;
  if (isWebGL2) {
    (actualGl as WebGL2RenderingContext).getExtension("EXT_color_buffer_float");
    supportLinearFiltering = actualGl.getExtension("OES_texture_float_linear");
  } else {
    halfFloat = actualGl.getExtension("OES_texture_half_float");
    supportLinearFiltering = actualGl.getExtension("OES_texture_half_float_linear");
  }
  actualGl.clearColor(0, 0, 0, 0);

  const halfFloatTexType = isWebGL2
    ? (actualGl as WebGL2RenderingContext).HALF_FLOAT
    : halfFloat
      ? halfFloat.HALF_FLOAT_OES
      : 0;

  let formatRGBA: { internalFormat: number; format: number };
  let formatRG: { internalFormat: number; format: number };
  let formatR: { internalFormat: number; format: number };

  if (isWebGL2) {
    const gl2 = actualGl as WebGL2RenderingContext;
    formatRGBA = getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloatTexType);
    formatR = getSupportedFormat(gl2, gl2.R16F, gl2.RED, halfFloatTexType);
  } else {
    formatRGBA = getSupportedFormat(actualGl, actualGl.RGBA, actualGl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(actualGl, actualGl.RGBA, actualGl.RGBA, halfFloatTexType);
    formatR = getSupportedFormat(actualGl, actualGl.RGBA, actualGl.RGBA, halfFloatTexType);
  }

  return {
    gl: actualGl,
    ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering },
  };
}

function getSupportedFormat(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  internalFormat: number,
  format: number,
  type: number
) {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    if (gl instanceof WebGL2RenderingContext) {
      return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
    }
  }
  return { internalFormat, format };
}

function supportRenderTextureFormat(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  internalFormat: number,
  format: number,
  type: number
) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.deleteTexture(texture);
  gl.deleteFramebuffer(fbo);
  return status === gl.FRAMEBUFFER_COMPLETE;
}

export default function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const splat = useCallback((x: number, y: number, dx: number, dy: number) => {
    // placeholder for splat function set up in useEffect
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = getWebGLContext(canvas);
    if (!ctx) return;

    const { gl, ext } = ctx;

    function resizeCanvas() {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    // Simplified fluid-like effect using basic WebGL
    const vertexShader = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;

      void main() {
        vec2 uv = vUv;
        vec2 mouse = uMouse / uResolution;
        float dist = length(uv - mouse);
        float ripple = sin(dist * 30.0 - uTime * 3.0) * exp(-dist * 5.0) * 0.15;

        vec3 col1 = vec3(0.176, 0.314, 0.086); // forest green
        vec3 col2 = vec3(0.486, 0.604, 0.431); // sage
        vec3 col3 = vec3(0.769, 0.663, 0.302); // wheat

        vec3 color = mix(col1, col2, uv.y + ripple);
        color = mix(color, col3, ripple * 2.0 + 0.02);

        float alpha = smoothstep(0.5, 0.0, dist) * 0.12 + ripple * 0.3;
        alpha = max(0.0, alpha);

        gl_FragColor = vec4(color * alpha, alpha);
      }
    `;

    function createShader(type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertexShader);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uResolution = gl.getUniformLocation(program, "uResolution");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let mouseX = 0;
    let mouseY = 0;
    let animId = 0;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = canvas!.height - e.clientY;
    }

    function render(time: number) {
      resizeCanvas();
      gl.viewport(0, 0, canvas!.width, canvas!.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, time * 0.001);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }

    window.addEventListener("mousemove", onMouseMove);
    resizeCanvas();
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}
