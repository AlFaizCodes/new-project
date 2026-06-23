"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField({ count = 200 }) {
  const mesh = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#0075de"),
      new THREE.Color("#d6b6f6"),
      new THREE.Color("#2a9d99"),
      new THREE.Color("#62aef0"),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.6} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function FloatingHelix() {
  const group = useRef<THREE.Group>(null);

  const { points } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 60; i++) {
      const t = i / 60;
      const angle = t * Math.PI * 6;
      const r = 1.2;
      pts.push(new THREE.Vector3(Math.cos(angle) * r, (t - 0.5) * 4, Math.sin(angle) * r));
    }
    return { points: pts };
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.3;
  });

  return (
    <group ref={group}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#0075de" opacity={0.3} transparent />
      </line>
      {points.filter((_, i) => i % 4 === 0).map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#d6b6f6" : "#62aef0"} />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeBackground({ variant = "particles" }: { variant?: "particles" | "helix" | "both" }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.5} />
        {(variant === "particles" || variant === "both") && <ParticleField count={300} />}
        {(variant === "helix" || variant === "both") && <FloatingHelix />}
      </Canvas>
    </div>
  );
}
