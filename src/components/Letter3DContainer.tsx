/**
 * Letter3DContainer Component
 * Creates a 3D animated text container using Three.js
 * Features:
 * - 3D text rendering with custom fonts
 * - Continuous rotation animation
 * - Customizable size and styling
 * - Interactive orbit controls
 */

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text3D, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Available fonts and their weights for the 3D text
 * Each font has a name and available weights
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
 * Defines default values for size, rotation, bevel, materials, and lighting
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
 * @param font - Name of the font
 * @param weight - Weight of the font
 * @returns Path to the font file
 */
function getFontPath(font: string, weight: string): string {
  if (font.startsWith('droid')) {
    return `/fonts/droid/${font}_${weight}.typeface.json`;
  }
  return `/fonts/${font}_${weight}.typeface.json`;
}

/**
 * Props for the SpinningNN component
 * @property fontPath - Path to the font file
 * @property color - Color of the 3D text
 * @property bevel - Whether to apply bevel effect
 * @property text - Text to display
 * @property size - Size of the text
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
 * Uses Three.js for 3D rendering and animation
 */
function SpinningNN({ fontPath, color, bevel, text, size = TEXT_CONFIG.DEFAULT_SIZE }: SpinningNNProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Update rotation on each frame
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
 * @property className - Additional CSS classes
 * @property size - Size of the 3D text
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
  // Configuration for the 3D text
  const text = "NN";
  const fontIndex = 1; // optimer
  const weightIndex = 1; // bold
  const color = "#ffffff";
  const bevel = true;

  // Get the font path based on selected font and weight
  const currentFont = FONTS[fontIndex];
  const currentWeight = currentFont.weights[weightIndex];
  const fontPath = getFontPath(currentFont.name, currentWeight);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <Canvas camera={{ position: TEXT_CONFIG.CAMERA.POSITION, fov: TEXT_CONFIG.CAMERA.FOV }}>
        {/* Ambient light for overall scene illumination */}
        <ambientLight intensity={TEXT_CONFIG.LIGHTS.AMBIENT.INTENSITY} />
        
        {/* Directional lights for depth and shadows */}
        <directionalLight position={[0, 10, 10]} intensity={TEXT_CONFIG.LIGHTS.DIRECTIONAL.INTENSITY} />
        <directionalLight position={[0, -10, -10]} intensity={TEXT_CONFIG.LIGHTS.DIRECTIONAL.INTENSITY} />
        
        {/* Point lights for additional highlights */}
        <pointLight position={[10, 10, 10]} intensity={TEXT_CONFIG.LIGHTS.POINT.INTENSITY} />
        <pointLight position={[-10, -10, -10]} intensity={TEXT_CONFIG.LIGHTS.POINT.INTENSITY} />
        
        {/* Main 3D text component */}
        <SpinningNN 
          fontPath={fontPath} 
          color={color} 
          bevel={bevel} 
          text={text} 
          size={size} 
        />
        
        {/* Orbit controls for interactive viewing */}
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