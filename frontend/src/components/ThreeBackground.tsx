import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, Center, Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingCube({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 2) * 0.5;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed) * 2;
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * speed) * 2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
}

function AnimatedLogo() {
  const logoRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (logoRef.current) {
      logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Center position={[0, 0, 0]}>
      <group ref={logoRef}>
        <mesh position={[-1.5, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.5, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ec4899" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Center>
  );
}

export default function ThreeBackground() {
  const cubes = useMemo(() => [
    { position: [-4, 2, -2] as [number, number, number], color: '#3b82f6', speed: 0.01 },
    { position: [4, -1, -3] as [number, number, number], color: '#8b5cf6', speed: 0.015 },
    { position: [-3, -2, -4] as [number, number, number], color: '#ec4899', speed: 0.008 },
    { position: [3, 3, -2] as [number, number, number], color: '#10b981', speed: 0.012 },
  ], []);

  const spheres = useMemo(() => [
    { position: [-5, 0, -5] as [number, number, number], color: '#f59e0b', speed: 0.005 },
    { position: [5, 2, -6] as [number, number, number], color: '#ef4444', speed: 0.007 },
    { position: [0, -3, -4] as [number, number, number], color: '#06b6d4', speed: 0.009 },
  ], []);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <AnimatedLogo />
        
        {cubes.map((cube, index) => (
          <FloatingCube key={`cube-${index}`} {...cube} />
        ))}
        
        {spheres.map((sphere, index) => (
          <FloatingSphere key={`sphere-${index}`} {...sphere} />
        ))}
      </Canvas>
    </div>
  );
}
