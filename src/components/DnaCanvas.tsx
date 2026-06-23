"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Colors corresponding to the Notion / Sticker Palette
const NOTION_BLUE = new THREE.Color("#0075de");
const STICKER_PURPLE = new THREE.Color("#d6b6f6");
const STICKER_TEAL = new THREE.Color("#2a9d99");
const STICKER_SKY = new THREE.Color("#62aef0");
const GLOW_GREEN = new THREE.Color("#86efac"); // Soft neon green accent

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  size: number;
  life: number;
  maxLife: number;
}

// Particle System inside the Canvas
function ParticleSystem({ triggerMutation }: { triggerMutation: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const maxParticles = 300;

  // Store particles in a mutable ref for 60fps animation without React re-renders
  const particles = useRef<Particle[]>([]);

  // Initialize pool of inactive particles
  const particlePositions = useMemo(() => new Float32Array(maxParticles * 3), []);
  const particleColors = useMemo(() => new Float32Array(maxParticles * 3), []);

  useEffect(() => {
    if (triggerMutation === 0) return;

    // Trigger explosive particle mutation from the center or random DNA positions
    const burstCount = 120;
    const colorsPool = [NOTION_BLUE, STICKER_PURPLE, STICKER_TEAL, STICKER_SKY, GLOW_GREEN];

    for (let i = 0; i < burstCount; i++) {
      // Find a slot or overwrite oldest particle
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.1 + Math.random() * 0.35;
      const yDir = -0.5 + Math.random(); // vertical velocity
      
      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        yDir * 0.15,
        Math.sin(angle) * speed
      );

      const color = colorsPool[Math.floor(Math.random() * colorsPool.length)].clone();
      const life = 1.0 + Math.random() * 1.5;

      const p: Particle = {
        position: new THREE.Vector3(0, (Math.random() - 0.5) * 4, 0), // span along the helix vertical core
        velocity,
        color,
        size: 0.15 + Math.random() * 0.25,
        life,
        maxLife: life,
      };

      if (particles.current.length < maxParticles) {
        particles.current.push(p);
      } else {
        // Recycle the oldest particle
        particles.current[i % maxParticles] = p;
      }
    }
  }, [triggerMutation]);

  useFrame(() => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const colAttr = geo.attributes.color;
    const positions = posAttr.array as Float32Array;
    const colors = colAttr.array as Float32Array;

    particles.current.forEach((p, idx) => {
      // Physics updates
      p.position.add(p.velocity);
      p.velocity.multiplyScalar(0.95); // apply resistance
      p.life -= 0.016; // decay

      const i = idx * 3;
      if (p.life > 0) {
        positions[i] = p.position.x;
        positions[i + 1] = p.position.y;
        positions[i + 2] = p.position.z;

        const ratio = p.life / p.maxLife;
        colors[i] = p.color.r * ratio;
        colors[i + 1] = p.color.g * ratio;
        colors[i + 2] = p.color.b * ratio;
      } else {
        // Hide dead particles
        positions[i] = 9999;
        positions[i + 1] = 9999;
        positions[i + 2] = 9999;
      }
    });

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleColors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3D Scene containing the DNA double helix and camera lerping
interface SceneProps {
  scrollProgress: number;
  triggerMutation: number;
  dnaParameters: {
    creativity: number;
    logic: number;
    mutationRate: number;
  };
}

function DNAHelixScene({ scrollProgress, triggerMutation, dnaParameters }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  // Create coordinates for a double helix DNA wireframe
  const { strandA, strandB, rungs } = useMemo(() => {
    const pointsCount = 40;
    const radius = 1.6;
    const height = 10.0;
    const turns = 3.0;

    const sA: THREE.Vector3[] = [];
    const sB: THREE.Vector3[] = [];
    const rungsArr: [THREE.Vector3, THREE.Vector3][] = [];

    for (let i = 0; i < pointsCount; i++) {
      const t = i / (pointsCount - 1);
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;

      // Strand A
      const xA = Math.cos(angle) * radius;
      const zA = Math.sin(angle) * radius;
      const ptA = new THREE.Vector3(xA, y, zA);
      sA.push(ptA);

      // Strand B (offset by 180 degrees)
      const xB = Math.cos(angle + Math.PI) * radius;
      const zB = Math.sin(angle + Math.PI) * radius;
      const ptB = new THREE.Vector3(xB, y, zB);
      sB.push(ptB);

      // Connect matching nodes with rungs
      if (i % 2 === 0) {
        rungsArr.push([ptA, ptB]);
      }
    }

    return { strandA: sA, strandB: sB, rungs: rungsArr };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // 1. Subtle constant rotation + responsive mouse orbit influence
    const baseRotationY = state.clock.getElapsedTime() * 0.12;
    // Scale helix based on user control factors
    const creativityScale = 1.0 + dnaParameters.creativity * 0.5;
    
    groupRef.current.scale.set(creativityScale, 1.0, creativityScale);

    // Orbit offset based on pointer coordinates
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      baseRotationY + state.pointer.x * 0.4,
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      state.pointer.y * 0.3,
      0.08
    );

    // 2. Scroll-Driven Camera Positioning
    // At scrollProgress = 0 (top of page): Zoomed out, looking down at the center.
    // As we scroll (0.0 to 1.0): Camera orbits closer, zooms in, and tracks down.
    
    const isMobile = size.width < 768;
    const baseDistance = isMobile ? 8.5 : 6.0;

    // Set camera coordinates based on scroll progress
    const theta = scrollProgress * Math.PI * 1.8; // spiral camera orbit path
    const targetCamX = Math.sin(theta) * baseDistance;
    const targetCamY = (0.5 - scrollProgress * 1.8) * 6; // move camera down
    const targetCamZ = Math.cos(theta) * baseDistance + (1.0 - scrollProgress) * 3;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.05);

    // Focus point follows camera shifts to direct narrative attention
    const focusY = (0.2 - scrollProgress * 1.4) * 4;
    const targetLookAt = new THREE.Vector3(0, focusY, 0);
    
    // Smoothly apply lookAt interpolation
    const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position);
    currentLookAt.lerp(targetLookAt, 0.05);
    state.camera.lookAt(currentLookAt);
  });

  return (
    <group ref={groupRef}>
      {/* Helix Strand A Nodes */}
      {strandA.map((pos, idx) => {
        const isSelected = idx % 8 === 0;
        const color = isSelected ? STICKER_PURPLE : NOTION_BLUE;
        return (
          <mesh key={`sa-node-${idx}`} position={pos}>
            <sphereGeometry args={[isSelected ? 0.16 : 0.09, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}

      {/* Helix Strand B Nodes */}
      {strandB.map((pos, idx) => {
        const isSelected = idx % 8 === 4;
        const color = isSelected ? STICKER_TEAL : STICKER_SKY;
        return (
          <mesh key={`sb-node-${idx}`} position={pos}>
            <sphereGeometry args={[isSelected ? 0.16 : 0.09, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}

      {/* Connective Helix Wireframe Strands */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(strandA.flatMap((v) => [v.x, v.y, v.z])),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={NOTION_BLUE} linewidth={1} opacity={0.4} transparent />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(strandB.flatMap((v) => [v.x, v.y, v.z])),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={STICKER_SKY} linewidth={1} opacity={0.4} transparent />
      </line>

      {/* DNA Ladder Rungs */}
      {rungs.map(([ptA, ptB], idx) => (
        <line key={`rung-${idx}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([ptA.x, ptA.y, ptA.z, ptB.x, ptB.y, ptB.z]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={idx % 2 === 0 ? STICKER_PURPLE : STICKER_TEAL}
            linewidth={1}
            opacity={0.3}
            transparent
          />
        </line>
      ))}

      {/* Custom Particle System inside the helix structure */}
      <ParticleSystem triggerMutation={triggerMutation} />
    </group>
  );
}

interface DnaCanvasProps {
  triggerMutation: number;
  dnaParameters: {
    creativity: number;
    logic: number;
    mutationRate: number;
  };
}

export default function DnaCanvas({ triggerMutation, dnaParameters }: DnaCanvasProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial trigger
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#f6f5f4] transition-colors duration-300">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <DNAHelixScene
          scrollProgress={scrollProgress}
          triggerMutation={triggerMutation}
          dnaParameters={dnaParameters}
        />
      </Canvas>
    </div>
  );
}
