import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text3D, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// List of available fonts and weights
const fonts = [
  { name: 'helvetiker', weights: ['regular', 'bold'] },
  { name: 'optimer', weights: ['regular', 'bold'] },
  { name: 'gentilis', weights: ['regular', 'bold'] },
  { name: 'droid_sans', weights: ['regular', 'bold'] },
  { name: 'droid_serif', weights: ['regular', 'bold'] },
];

// Helper to get the correct font file path
function getFontPath(font: string, weight: string) {
  if (font.startsWith('droid')) {
    return `/fonts/droid/${font}_${weight}.typeface.json`;
  }
  return `/fonts/${font}_${weight}.typeface.json`;
}

// Spinning 3D NN group
function SpinningNN({ fontPath, color, bevel, text, size = 4 }: { fontPath: string, color: string, bevel: boolean, text: string, size?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Normal slow rotation
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font={fontPath}
          size={size}
          height={size * 0.25}
          curveSegments={4}
          bevelEnabled={bevel}
          bevelThickness={0.2}
          bevelSize={0.15}
          bevelSegments={8}
        >
          {text}
          <meshStandardMaterial ref={materialRef} color={color} metalness={0.4} roughness={0.1} />
        </Text3D>
      </Center>
    </group>
  );
}

interface Letter3DContainerProps {
  className?: string;
  size?: number;
}

export default function Letter3DContainer({ className = '', size = 4 }: Letter3DContainerProps) {
  const text = "NN";
  const fontIndex = 1; // optimer
  const weightIndex = 1; // bold
  const color = "#ffffff"; // pure white
  const bevel = true;

  const currentFont = fonts[fontIndex];
  const currentWeight = currentFont.weights[weightIndex];
  const fontPath = getFontPath(currentFont.name, currentWeight);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <Canvas camera={{ position: [0, 10, 18], fov: 30 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[0, 10, 10]} intensity={1.2} />
        <directionalLight position={[0, -10, -10]} intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={0.9} />
        <pointLight position={[-10, -10, -10]} intensity={0.9} />
        <SpinningNN fontPath={fontPath} color={color} bevel={bevel} text={text} size={size} />
        <OrbitControls
          target={[0, 0, 0]}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
} 