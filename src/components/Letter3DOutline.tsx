import * as THREE from 'three';

export default function Letter3DOutline() {
  // Define points for a continuous N with connected corners
  const points = [
    new THREE.Vector3(-2, -2, 0), // bottom left
    new THREE.Vector3(-2, 2, 0),  // top left
    new THREE.Vector3(-1.7, 1.5, 0), // curve start
    new THREE.Vector3(1.7, -1.5, 0), // curve end
    new THREE.Vector3(2, -2, 0),  // bottom right
    new THREE.Vector3(2, 2, 0),   // top right
  ];

  // Create a smooth curve through the points
  const curve = new THREE.CatmullRomCurve3(points);

  return (
    <mesh>
      <tubeGeometry args={[curve, 100, 0.35, 16, false]} />
      <meshStandardMaterial color="#4ade80" metalness={0.2} roughness={0.3} />
    </mesh>
  );
} 