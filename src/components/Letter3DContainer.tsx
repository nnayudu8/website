import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text3D, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useResumeTransition } from './ResumeTransitionProvider';

const LOGO_FONT_PATH = '/fonts/optimer_bold.typeface.json';
const LOGO_COLOR = '#dddddd';

function SpinningNN({ fontPath, color, bevel, text, size = 4 }: { fontPath: string, color: string, bevel: boolean, text: string, size?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) {
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
          <meshStandardMaterial color={color}/>
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
  const { transitioning } = useResumeTransition();

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Stop the continuous WebGL loop while the transition owns the screen. */}
      <Canvas camera={{ position: [0, 10, 18], fov: 30 }} frameloop={transitioning ? 'demand' : 'always'}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[0, 10, 10]} intensity={1.2} />
        <directionalLight position={[0, -10, -10]} intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={0.9} />
        <pointLight position={[-10, -10, -10]} intensity={0.9} />
        <SpinningNN fontPath={LOGO_FONT_PATH} color={LOGO_COLOR} bevel text="NN" size={size} />
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
