import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text3D, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Available fonts and their weights for the 3D text
 */
const FONTS = [
  { name: 'helvetiker', weights: ['regular', 'bold'] },
  { name: 'optimer', weights: ['regular', 'bold'] },
  { name: 'gentilis', weights: ['regular', 'bold'] },
  { name: 'droid_sans', weights: ['regular', 'bold'] },
  { name: 'droid_serif', weights: ['regular', 'bold'] },
] as const;

/**
 * Constants for the 3D text configuration
 */
const TEXT_CONFIG = {
  DEFAULT_SIZE: 4,
  ROTATION_SPEED: 0.01,
  BEVEL: {
    THICKNESS: 0.2,
    SIZE: 0.15,
    SEGMENTS: 8
  },
  MATERIAL: {
    METALNESS: 0.4,
    ROUGHNESS: 0.1
  },
  CAMERA: {
    POSITION: [0, 10, 18],
    FOV: 30
  },
  LIGHTS: {
    AMBIENT: { INTENSITY: 0.9 },
    DIRECTIONAL: { INTENSITY: 1.2 },
    POINT: { INTENSITY: 0.9 }
  }
} as const;

/**
 * Helper to get the correct font file path based on font name and weight
 */
function getFontPath(font: string, weight: string): string {
  if (font.startsWith('droid')) {
    return `/fonts/droid/${font}_${weight}.typeface.json`;
  }
  return `/fonts/${font}_${weight}.typeface.json`;
}

/**
 * Props for the SpinningNN component
 */
interface SpinningNNProps {
  fontPath: string;
  color: string;
  bevel: boolean;
  text: string;
  size?: number;
}

/**
 * SpinningNN component that renders a 3D text with continuous rotation
 */
function SpinningNN({ fontPath, color, bevel, text, size = TEXT_CONFIG.DEFAULT_SIZE }: SpinningNNProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += TEXT_CONFIG.ROTATION_SPEED;
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
          bevelThickness={TEXT_CONFIG.BEVEL.THICKNESS}
          bevelSize={TEXT_CONFIG.BEVEL.SIZE}
          bevelSegments={TEXT_CONFIG.BEVEL.SEGMENTS}
        >
          {text}
          <meshStandardMaterial 
            ref={materialRef} 
            color={color} 
            metalness={TEXT_CONFIG.MATERIAL.METALNESS} 
            roughness={TEXT_CONFIG.MATERIAL.ROUGHNESS} 
          />
        </Text3D>
      </Center>
    </group>
  );
}

/**
 * Props for the Letter3DContainer component
 */
interface Letter3DContainerProps {
  className?: string;
  size?: number;
}

/**
 * Letter3DContainer component that creates a 3D scene with spinning text
 * using Three.js and React Three Fiber
 */
export default function Letter3DContainer({ className = '', size = TEXT_CONFIG.DEFAULT_SIZE }: Letter3DContainerProps) {
  const text = "NN";
  const fontIndex = 1; // optimer
  const weightIndex = 1; // bold
  const color = "#ffffff";
  const bevel = true;

  const currentFont = FONTS[fontIndex];
  const currentWeight = currentFont.weights[weightIndex];
  const fontPath = getFontPath(currentFont.name, currentWeight);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <Canvas camera={{ position: TEXT_CONFIG.CAMERA.POSITION, fov: TEXT_CONFIG.CAMERA.FOV }}>
        <ambientLight intensity={TEXT_CONFIG.LIGHTS.AMBIENT.INTENSITY} />
        <directionalLight position={[0, 10, 10]} intensity={TEXT_CONFIG.LIGHTS.DIRECTIONAL.INTENSITY} />
        <directionalLight position={[0, -10, -10]} intensity={TEXT_CONFIG.LIGHTS.DIRECTIONAL.INTENSITY} />
        <pointLight position={[10, 10, 10]} intensity={TEXT_CONFIG.LIGHTS.POINT.INTENSITY} />
        <pointLight position={[-10, -10, -10]} intensity={TEXT_CONFIG.LIGHTS.POINT.INTENSITY} />
        <SpinningNN 
          fontPath={fontPath} 
          color={color} 
          bevel={bevel} 
          text={text} 
          size={size} 
        />
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