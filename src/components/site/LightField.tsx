import { useEffect, useRef } from "react";

/**
 * One field of flowing light behind the whole page (2026-11-15, after the
 * founder's "Relay" reference): a bundle of fine teal and silver strands that
 * sweeps across the screen, pinches to a bright point and opens again, with
 * a little dust in the air. Scrolling moves the bundle, so each section sits
 * on a different part of the same light.
 *
 * Cost is kept low on purpose: the canvas is drawn at a fraction of the
 * screen's resolution and scaled up (the strands are soft, so nothing is
 * lost), at most about 30 frames a second, only while it can be seen (not
 * behind the hero, not in a hidden tab). Reduced motion and low-end devices
 * get one still frame, and so do machines that draw WebGL without a graphics
 * card. Without WebGL the page keeps its plain dark ground.
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_scroll;

float hash(vec2 q) { return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.y;
  float aspect = u_res.x / u_res.y;
  float x = uv.x / aspect;
  float t = u_time;
  float s = u_scroll;

  // The bundle's centre line and the point where it pinches move with scroll.
  float cy = 0.52 + 0.24 * sin(x * 2.3 + s * 1.15 + 0.6) + 0.07 * sin(x * 5.1 - t * 0.07 + s * 0.4);
  float px = 0.62 + 0.22 * sin(s * 0.9 + 1.3);
  float pinch = exp(-pow((x - px) * 3.2, 2.0));
  float spread = mix(0.30, 0.012, pinch);

  vec3 teal = vec3(0.10, 0.78, 0.75);
  vec3 cool = vec3(0.55, 0.72, 0.86);
  vec3 col = vec3(0.0);

  for (int i = 0; i < 26; i++) {
    float fi = float(i);
    float k = fi / 25.0 - 0.5;
    float wob = 0.018 * sin(x * (6.0 + fi * 0.37) + t * (0.22 + fi * 0.011) + fi * 1.7) * (1.0 - pinch);
    float y = cy + k * spread + wob;
    float d = abs(uv.y - y);
    float core = exp(-d * d / 0.0000035);
    float halo = exp(-d * d / 0.00045) * 0.07;
    float pulse = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(x * 9.0 - t * (0.55 + fi * 0.02) + fi * 2.1), 3.0);
    float tint = fract(fi * 0.618);
    col += mix(teal, cool, step(0.72, tint)) * (core + halo) * pulse * (0.45 + 0.55 * tint);
  }

  // Glow where the strands meet.
  col += teal * exp(-pow((x - px) * 9.0, 2.0) - pow((uv.y - cy) * 16.0, 2.0)) * 0.35;

  // Dust.
  vec2 cell = floor(gl_FragCoord.xy / 3.0);
  float h = hash(cell);
  float twinkle = 0.5 + 0.5 * sin(t * 1.3 + h * 40.0);
  col += vec3(0.55, 0.8, 0.82) * step(0.9975, h) * twinkle * 0.6;

  // Edges fall away so text near them stays easy to read.
  float vign = smoothstep(0.0, 0.18, x) * smoothstep(1.0, 0.82, x);
  col *= 0.55 + 0.45 * vign;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function LightField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const options: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    };
    // Without a graphics card the browser draws WebGL on the processor, and a
    // moving field would make scrolling heavy: those machines get a still frame.
    const fast = canvas.getContext("webgl", { ...options, failIfMajorPerformanceCaveat: true });
    const gl = fast ?? canvas.getContext("webgl", options);
    if (!gl) return;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    const software = !fast || /swiftshader|llvmpipe|software|basic render/i.test(renderer);

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("LightField shader:", gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uScroll = gl.getUniformLocation(program, "u_scroll");

    let still =
      software ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("cx-low-perf");

    const resize = () => {
      const scale = window.innerWidth < 900 ? 0.42 : 0.5;
      const w = Math.max(1, Math.round(window.innerWidth * scale));
      const h = Math.max(1, Math.round(window.innerHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    let scroll = window.scrollY / Math.max(1, window.innerHeight);
    let target = scroll;
    const start = performance.now();
    const draw = (now: number) => {
      scroll += (target - scroll) * 0.08;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, still ? 12 : (now - start) / 1000);
      gl.uniform1f(uScroll, scroll * 0.55);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Not worth drawing while the hero still covers the screen.
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const covered = () =>
      hero ? hero.getBoundingClientRect().bottom > window.innerHeight * 0.98 : false;

    // If the machine cannot keep up (frames arriving slower than about 20 a
    // second while the field is drawn), it switches to the still frame.
    let frame = 0;
    let last = 0;
    let slow = 0;
    let drawn = 0;
    const loop = (now: number) => {
      if (document.hidden || covered()) {
        last = now;
        frame = requestAnimationFrame(loop);
        return;
      }
      const gap = now - last;
      if (drawn > 3 && gap > 50 && gap < 1000) slow += 1;
      else if (gap < 40) slow = Math.max(0, slow - 1);
      if (slow > 12) {
        still = true;
        drawStill();
        return;
      }
      frame = requestAnimationFrame(loop);
      if (gap < 32) return;
      last = now;
      draw(now);
      drawn += 1;
      canvas.dataset.on = "";
    };
    // A still field is redrawn only when scrolling stops.
    let settle = 0;
    const drawStill = () => {
      if (covered()) return;
      scroll = target;
      draw(performance.now());
      canvas.dataset.on = "";
    };
    const onScroll = () => {
      target = window.scrollY / Math.max(1, window.innerHeight);
      if (still) {
        window.clearTimeout(settle);
        settle = window.setTimeout(drawStill, 180);
      }
    };
    const onResize = () => {
      resize();
      if (still) draw(performance.now());
    };

    resize();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (still) {
      drawStill();
    } else {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="cy-field" aria-hidden="true" />;
}
