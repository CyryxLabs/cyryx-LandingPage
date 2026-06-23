import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

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
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>

      {/* Teal halo ring around the base */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.95, 0]}>
        <torusGeometry args={[0.95, 0.012, 16, 96]} />
        <meshStandardMaterial
          color="#00E6D0"
          emissive="#00E6D0"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>

      {/* Soft underlight disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.99, 0]}>
        <ringGeometry args={[0.4, 1.6, 64]} />
        <meshBasicMaterial
          color="#00E6D0"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          toneMapped={false}
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
        size={0.012}
        color="#7ff5e6"
        transparent
        opacity={0.55}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

export function MonolithScene({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className={className} aria-hidden />;
  }

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.1, 5.6], fov: 32 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.12} />
          <directionalLight position={[3, 4, 5]} intensity={0.55} color="#a8c4c8" />
          <pointLight position={[-2.8, -1.6, 2.4]} intensity={3.2} distance={9} decay={1.6} color="#00E6D0" />
          <pointLight position={[2.4, 2.6, 1.8]} intensity={1.4} distance={8} decay={1.8} color="#5fb4b8" />
          <pointLight position={[0, -2.4, 2]} intensity={1.8} distance={6} decay={1.8} color="#00E6D0" />

          <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.45}>
            <Monolith />
          </Float>

          <OrbitDust />

          <Stars
            radius={50}
            depth={30}
            count={1200}
            factor={2.4}
            saturation={0}
            fade
            speed={0.4}
          />

          <Environment preset="night" background={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}