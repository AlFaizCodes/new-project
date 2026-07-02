'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Particle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
}

export const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xedeef5);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x9fff00, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create particles
    const particleGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const particleMaterial = new THREE.MeshPhongMaterial({
      color: 0x9fff00,
      emissive: 0x9fff00,
      shininess: 100,
    });

    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      const mesh = new THREE.Mesh(particleGeometry, particleMaterial);
      mesh.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );

      particles.push({
        mesh,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.2,
      });

      scene.add(mesh);
    }
    particlesRef.current = particles;

    // Draw lines between nearby particles
    const lines = new THREE.Group();
    scene.add(lines);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update particles
      particles.forEach((particle) => {
        particle.mesh.position.x += particle.vx;
        particle.mesh.position.y += particle.vy;
        particle.mesh.position.z += particle.vz;

        // Bounce off boundaries
        const boundSize = 50;
        if (Math.abs(particle.mesh.position.x) > boundSize)
          particle.vx *= -1;
        if (Math.abs(particle.mesh.position.y) > boundSize)
          particle.vy *= -1;
        if (Math.abs(particle.mesh.position.z) > boundSize)
          particle.vz *= -1;

        particle.mesh.rotation.x += 0.01;
        particle.mesh.rotation.y += 0.01;
      });

      // Clear old lines
      lines.clear();

      // Draw new lines
      const lineGeometry = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = particles[i].mesh.position.distanceTo(
            particles[j].mesh.position
          );
          if (dist < 15) {
            points.push(particles[i].mesh.position);
            points.push(particles[j].mesh.position);
          }
        }
      }

      lineGeometry.setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x9fff00,
        opacity: 0.2,
        transparent: true,
      });
      const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
      lines.add(lineSegments);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ background: '#EDEEF5' }}
    />
  );
};
