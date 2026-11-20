import { useEffect, useRef } from "react";

/**
 * Cinematic backdrop: the lit edge of a dark sphere under a slow teal aurora,
 * rendered as one full-screen fragment shader. The light drifts on its own,
 * leans toward the pointer and rises as the visitor scrolls the host section.
 *
 * Decorative only (aria-hidden). The CSS poster behind the canvas
 * (`.cy-horizon`) is the first paint and the fallback: reduced motion,
 * low-end devices and browsers without WebGL keep the still frame.
 */
const VERTEX = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAGMENT = `
precision highp float;
uniform vec2 uR;
uniform float uT;
uniform vec2 uM;
uniform float uS;
uniform float uI;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float a=.5,v=0.;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uR)/uR.y;
  float R=2.6;
  vec2 c=vec2(0.,-R-.27+uS*.2);
  vec2 q=uv-c;
  float d=length(q)-R;
  float la=.3*sin(uT*.07)+uM.x*.55;
  vec2 ld=normalize(vec2(sin(la),cos(la)));
  float facing=pow(clamp(dot(normalize(q),ld),0.,1.),26.);
  vec3 teal=vec3(.098,.78,.753);
  vec3 deep=vec3(.02,.17,.18);
  vec3 white=vec3(.86,.98,.97);
  vec3 col=vec3(.0196,.0235,.0275);
  float alt=max(d,0.);
  float warp=fbm(uv*1.2+uT*.015);
  float f=fbm(vec2(uv.x*1.4+uT*.02,uv.y*2.6-uT*.035)+warp*1.5);
  float glow=.3+.7*facing+uS*.35;
  col+=deep*f*exp(-alt*2.1)*glow*1.5*uI;
  col+=teal*pow(f,3.)*exp(-alt*3.4)*.42*glow*uI;
  float rays=pow(n(vec2(atan(q.x,q.y)*46.,uT*.12)),4.);
  col+=teal*rays*exp(-alt*5.5)*.16*facing*uI;
  col+=teal*exp(-alt*24.)*(.22+1.7*facing)*uI;
  col+=mix(teal,white,clamp(facing*1.5,0.,1.))*exp(-alt*150.)*(.2+2.4*facing)*uI;
  if(d<0.){
    float edge=exp(d*13.);
    vec3 body=vec3(.008,.01,.012)+deep*edge*.42*(.25+facing);
    body+=teal*exp(d*70.)*.3*facing;
    body+=deep*fbm(q*3.+uT*.01)*edge*.14;
    col=body*uI+vec3(.006,.007,.008);
  }else{
    float st=h(floor(gl_FragCoord.xy/2.5));
    float tw=.5+.5*sin(uT*1.4+st*90.);
    col+=vec3(.72,.86,.9)*step(.9976,st)*tw*.6*smoothstep(0.,.3,alt);
  }
  vec2 hp=c+ld*R;
  float streak=exp(-abs(uv.y-hp.y)*80.)*exp(-abs(uv.x-hp.x)*1.5);
  col+=mix(teal,white,.55)*streak*.55*uI;
  col*=1.-.32*dot(uv*vec2(.55,1.),uv*vec2(.55,1.));
  col+=(h(gl_FragCoord.xy+uT)-.5)*.022;
  gl_FragColor=vec4(max(col,0.),1.);
}`;

export function Horizon({ intensity = 1 }: { intensity?: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.classList.contains("cx-low-perf")) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    // Software rendering would run the shader on the main thread: keep the poster.
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(program, "uR");
    const uT = gl.getUniformLocation(program, "uT");
    const uM = gl.getUniformLocation(program, "uM");
    const uS = gl.getUniformLocation(program, "uS");
    const uI = gl.getUniformLocation(program, "uI");

    const compact = window.innerWidth < 720;
    const scale = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.5) * (compact ? 0.8 : 1);
    const pointer = { x: 0, tx: 0 };
    let raf = 0;
    let running = false;
    let shown = false;
    let last = 0;
    let frames = 0;
    let budget = 0;
    let previous = 0;
    let abandoned = false;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(rect.width * scale));
      canvas.height = Math.max(2, Math.round(rect.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      // Frame budget: a device that cannot hold ~22fps here goes back to the poster.
      if (previous && frames < 24) {
        frames += 1;
        budget += now - previous;
        if (frames === 24 && budget / 24 > 45) {
          abandoned = true;
          stop();
          delete canvas.dataset.ready;
          return;
        }
      }
      previous = now;
      if (compact && now - last < 32) return;
      last = now;
      const rect = host.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, now / 1000);
      gl.uniform2f(uM, pointer.x, 0);
      gl.uniform1f(uS, progress);
      gl.uniform1f(uI, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.dataset.ready = "true";
      }
    };

    const start = () => {
      if (running || abandoned) return;
      previous = 0;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const onPointer = (event: PointerEvent) => {
      pointer.tx = event.clientX / Math.max(1, window.innerWidth) - 0.5;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const io = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()));

    const begin = () => {
      resize();
      io.observe(host);
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    };
    // After first paint, so the still poster is what the visitor sees first.
    const boot = window.setTimeout(() => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(begin, { timeout: 1200 });
      else begin();
    }, 500);

    return () => {
      window.clearTimeout(boot);
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [intensity]);

  return (
    <div ref={hostRef} className="cy-horizon" aria-hidden="true">
      <canvas ref={canvasRef} className="cy-horizon__canvas" aria-hidden="true" />
    </div>
  );
}
