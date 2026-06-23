import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/** Lightweight WebGL availability probe. */
function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Dev-only FPS / DPR / render-state logger. */
function PerfLogger({ active }: { active: boolean }) {
  const last = useRef(performance.now());
  const frames = useRef(0);
  useFrame(({ gl }) => {
    frames.current++;
    const now = performance.now();
    if (now - last.current >= 1000) {
      // eslint-disable-next-line no-console
      console.debug(
        `[MonolithScene] fps=${frames.current} dpr=${gl.getPixelRatio().toFixed(2)} loop=${active ? "always" : "demand"}`,
      );
      frames.current = 0;
      last.current = now;
    }
  });
  return null;
}

/** Static premium fallback when WebGL is unavailable. */
function StaticMonolithFallback() {
  return (
    <div className="relative h-full w-full" aria-hidden>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(180px, 38%)",
          aspectRatio: "1 / 3.1",
          background:
            "linear-gradient(180deg,#0b1316 0%,#05080a 50%,#0b1316 100%)",
          border: "1px solid color-mix(in oklab, var(--silver) 16%, transparent)",
          borderRadius: "6px",
          boxShadow:
            "0 40px 80px -20px rgba(0,0,0,.6), 0 0 60px -10px color-mix(in oklab, var(--accent-glow) 30%, transparent)",
        }}
      >
        <div
          className="absolute left-1/2 top-[8%] h-[72%] -translate-x-1/2"
          style={{
            width: "3px",
            background:
              "linear-gradient(180deg,transparent,var(--accent-glow),transparent)",
            boxShadow: "0 0 14px 1px color-mix(in oklab,var(--accent-glow) 60%,transparent)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Cyryx 3D monolith — metallic teal-tinted slab that orbits to scroll,
 * crowned by a vertical glowing teal core. Used as the hero's anchor.
 */
function Monolith() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((_, dt) => {
    if (!group.current) return;
    const s = scrollY.current * 0.0015;
    group.current.rotation.y += dt * 0.18;
    group.current.rotation.y += (s - group.current.rotation.y * 0.0001) * 0.0; // noop hint
    group.current.rotation.x = -0.08 + Math.sin(s) * 0.05;
    group.current.position.y = -s * 0.6;
    if (core.current) {
      const m = core.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 2.4 + Math.sin(performance.now() * 0.002) * 0.6;
    }
  });

  return (
    <group ref={group}>
      {/* Monolith slab */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.15, 3.6, 0.32]} />
        <meshPhysicalMaterial
          color="#05080a"
          metalness={0.95}
          roughness={0.38}
          clearcoat={0.6}
          clearcoatRoughness={0.4}
          envMapIntensity={0.35}
          reflectivity={0.4}
        />
      </mesh>

      {/* Front engraved teal core line */}
      <mesh ref={core} position={[0, 0, 0.162]}>
        <boxGeometry args={[0.045, 2.6, 0.005]} />
        <meshStandardMaterial
          color="#00E6D0"
          emissive="#00E6D0"
          emissiveIntensity={1.6}
        />
      </mesh>

      {/* Teal halo ring around the base */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.95, 0]}>
        <torusGeometry args={[0.95, 0.012, 16, 96]} />
        <meshStandardMaterial
          color="#00E6D0"
          emissive="#00E6D0"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Soft underlight disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.99, 0]}>
        <ringGeometry args={[0.4, 1.6, 64]} />
        <meshBasicMaterial
          color="#00E6D0"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function OrbitDust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useRef<THREE.BufferGeometry>(null);

  if (!geo.current) {
    const positions = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const r = 2.4 + Math.random() * 2.4;
      const t = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.6;
      positions[i * 3] = Math.cos(t) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(t) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.current = g;
  }

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.04;
  });

  return (
    <points ref={ref} geometry={geo.current!}>
      <pointsMaterial
        size={0.014}
        color="#7ff5e6"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

export function MonolithScene({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mql.matches);
    setWebgl(detectWebGL());
    const host = hostRef.current;
    if (!host) return;
    // Lazy-mount the Canvas only when the slab scrolls into view.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMounted(true);
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  const dprCap: [number, number] = isMobile ? [1, 1.25] : [1, 1.75];
  const loopActive = !reduce && visible;
  const isDev = typeof import.meta !== "undefined" && (import.meta as any).env?.DEV;

  if (!webgl) {
    return (
      <div ref={hostRef} className={className} aria-hidden>
        <StaticMonolithFallback />
      </div>
    );
  }

  return (
    <div ref={hostRef} className={className} aria-hidden>
      {mounted && (
      <Canvas
        dpr={dprCap}
        frameloop={loopActive ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        camera={{ position: [0, 0.1, 5.6], fov: 32 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.18} />
          <directionalLight position={[3, 4, 5]} intensity={0.45} color="#a8c4c8" />
          <pointLight position={[-2.4, -1.2, 2.2]} intensity={0.7} distance={6} decay={2} color="#00E6D0" />
          <pointLight position={[2.2, 2.4, 1.6]} intensity={0.4} distance={6} decay={2} color="#5fb4b8" />

          {reduce ? (
            <Monolith />
          ) : (
            <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.45}>
              <Monolith />
            </Float>
          )}

          {!reduce && <OrbitDust />}
          {isDev && <PerfLogger active={loopActive} />}
        </Suspense>
      </Canvas>
      )}
      {!mounted && <StaticMonolithFallback />}
    </div>
  );
}