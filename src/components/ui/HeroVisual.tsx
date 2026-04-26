"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

function DataParticles({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      temp.set([x, y, z], i * 3);
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={mesh} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function OrbitingNodes() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={group}>
      {[0, 1, 2, 3].map((i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[Math.cos((i * Math.PI) / 2) * 3, Math.sin((i * Math.PI) / 2) * 1, Math.sin((i * Math.PI) / 2) * 3]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#60a5fa" : "#1e40af"}
              emissive={i % 2 === 0 ? "#2563eb" : "#1e3a8a"}
              emissiveIntensity={2}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function HeroVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 bg-slate-950">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <DataParticles count={3000} />
        <OrbitingNodes />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
    </div>
  );
}
