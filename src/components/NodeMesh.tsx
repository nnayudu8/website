/**
 * NodeMesh Component
 * Creates an interactive neural network visualization with animated pulses
 * Features:
 * - Dynamic node placement in clusters
 * - Animated pulse propagation
 * - Hub nodes with special properties
 * - Responsive canvas sizing
 * - Interactive pulse triggering
 */

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

/**
 * Interface for a pulse traveling between nodes
 * @property progress - Progress along the path (0 to 1)
 * @property startNode - Index of the starting node
 * @property nextNode - Index of the destination node
 * @property age - Time alive in seconds
 */
interface Pulse {
  progress: number; // 0 to 1
  startNode: number;
  nextNode: number;
  age: number; // Time alive in seconds
}

/**
 * Interface for a node in the neural network
 * @property x - X coordinate position
 * @property y - Y coordinate position
 * @property neighbors - Array of indices of connected nodes
 * @property pulses - Array of active pulses on this node
 * @property isHub - Whether this is a hub node
 * @property pulseState - Current pulse animation state (0 to 1)
 */
interface Node {
  x: number;
  y: number;
  neighbors: number[];
  pulses: Pulse[];
  isHub?: boolean;
  pulseState?: number; // 0 to 1 for pulse animation
}

/**
 * Props for the NodeMesh component
 * @property position - Optional position to trigger pulses from
 */
interface NodeMeshProps {
  position?: { x: number; y: number };
}

// Visual styling constants
const NODE_COLOR = '#2c374a';      // Regular node color
const HUB_COLOR = '#4fa3ff';       // Hub node color (brighter)
const LINE_COLOR = 'rgba(100, 100, 100, 0.2)';  // Connection line color (lighter)
const DOT_RADIUS = 3.5;            // Regular node size
const HUB_RADIUS = 5.5;            // Hub node size (larger)
const ORB_RADIUS = 4;              // Size of traveling pulse orbs
const ORB_SPEED = 200;             // Speed of pulse movement (pixels/second)
const ORB_LIFETIME = 1.0;          // How long pulses live (seconds)
const ORB_COLOR = 'rgba(255, 255, 255, 0.9)'; // Pulse orb color
const NODE_COUNT = 20;             // Total number of nodes
const CLUSTERS = 4;                // Number of node clusters
const CLUSTER_RADIUS = 420;        // Size of each cluster

/**
 * Generates a neural network layout with nodes arranged in clusters
 * Creates a visually appealing network with hub nodes and connections
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Array of nodes with positions and connections
 */
function getNeuralNetwork(width: number, height: number): Node[] {
  // Place clusters in an asymmetric pattern
  const clusters: { x: number; y: number }[] = [];
  
  // Adjust cluster positions for a more natural, balanced layout
  clusters.push({
    x: width * 0.15,  // Far left
    y: height * 0.35  // Upper left
  });
  clusters.push({
    x: width * 0.75,  // Right
    y: height * 0.25  // Upper right
  });
  clusters.push({
    x: width * 0.35,  // Center left
    y: height * 0.65  // Lower left
  });
  clusters.push({
    x: width * 0.65,  // Center right
    y: height * 0.65  // Lower right
  });

  // Place nodes in fixed positions within clusters
  const nodes: Node[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const cluster = clusters[Math.floor(i / (NODE_COUNT / CLUSTERS))];
    const angle = (2 * Math.PI * (i % (NODE_COUNT / CLUSTERS))) / (NODE_COUNT / CLUSTERS);
    const radius = CLUSTER_RADIUS * (0.4 + 0.6 * Math.sin(i * 0.5));
    
    // Calculate base position
    const x = cluster.x + radius * Math.cos(angle);
    const y = cluster.y + radius * Math.sin(angle);
    
    // For upper clusters, extend some nodes towards top middle
    const clusterIndex = Math.floor(i / (NODE_COUNT / CLUSTERS));
    if (clusterIndex <= 1 && y < cluster.y) { // Upper clusters, upper portion
      const centerPull = 0.8; // Pull more towards center
      const newX = x + (width * 0.5 - x) * centerPull;
      const newY = y - (height * 0.05); // Keep height adjustment small
      
      nodes.push({
        x: newX,
        y: newY,
        neighbors: [],
        pulses: []
      });
    } else {
      nodes.push({
        x,
        y,
        neighbors: [],
        pulses: []
      });
    }
  }

  // Pick fewer hub nodes
  const hubIndices = new Set<number>();
  while (hubIndices.size < Math.max(2, Math.floor(NODE_COUNT / 10))) {
    hubIndices.add(Math.floor(Math.random() * NODE_COUNT));
  }
  nodes.forEach((node, i) => { node.isHub = hubIndices.has(i); });

  // Connect nodes: each node connects to nearby nodes
  // Hub nodes get more connections for visual hierarchy
  for (let i = 0; i < nodes.length; i++) {
    // Increase connections for better network connectivity
    const nConnections = nodes[i].isHub ? 4 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2);
    const dists = nodes
      .map((n, j) => ({ j, dist: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
      .filter(({ dist }) => dist > 0.1)
      .sort((a, b) => a.dist - b.dist);
    let added = 0;
    for (let k = 0; k < dists.length && added < nConnections; k++) {
      const ni = dists[k].j;
      if (!nodes[i].neighbors.includes(ni)) {
        nodes[i].neighbors.push(ni);
        nodes[ni].neighbors.push(i); // bidirectional
        added++;
      }
    }
  }
  return nodes;
}

/**
 * Interface for the NodeMesh component's ref handle
 * Allows external components to trigger pulses
 */
export interface NodeMeshHandle {
  triggerPulse: () => void;
}

/**
 * NodeMesh component that creates an interactive neural network visualization
 * with animated pulses traveling between nodes
 */
const NodeMesh = forwardRef<NodeMeshHandle, NodeMeshProps>(({ position }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [, setRerender] = useState(0);
  const currentPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Update position when it changes
  useEffect(() => {
    if (position) {
      currentPositionRef.current = position;
    }
  }, [position]);

  // Set up canvas size
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        setDimensions({ width, height });
        console.log('Canvas size set:', width, height);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate neural network nodes
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    nodesRef.current = getNeuralNetwork(dimensions.width, dimensions.height);
    setRerender((r) => r + 1); // force rerender
    console.log('Nodes generated:', nodesRef.current.length);
  }, [dimensions]);

  // Force a pulse on mount for debug
  useEffect(() => {
    if (nodesRef.current.length) {
      nodesRef.current[0].pulses.push({ progress: 0, startNode: 0, nextNode: 0, age: 0 });
      setRerender(r => r + 1);
      console.log('Pulse forced on mount');
    }
  }, [dimensions]);

  // Find closest node to a position
  const findClosestNode = (x: number, y: number): number => {
    if (!nodesRef.current.length) return 0;
    
    let closestNode = 0;
    let minDist = Infinity;
    
    nodesRef.current.forEach((node, idx) => {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist < minDist) {
        minDist = dist;
        closestNode = idx;
      }
    });
    
    return closestNode;
  };

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || nodesRef.current.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw lines
      ctx.strokeStyle = LINE_COLOR;
      ctx.lineWidth = 1.2;
      nodesRef.current.forEach((node, i) => {
        node.neighbors.forEach((ni) => {
          if (ni > i) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodesRef.current[ni].x, nodesRef.current[ni].y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes and orbs
      let needsRerender = false;
      nodesRef.current.forEach((node) => {
        // Draw all orbs for this node
        for (let p = 0; p < node.pulses.length; p++) {
          const pulse = node.pulses[p];
          const startNode = nodesRef.current[pulse.startNode];
          const nextNode = nodesRef.current[pulse.nextNode];

          // Calculate distance between nodes
          const dx = nextNode.x - startNode.x;
          const dy = nextNode.y - startNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Update age and progress
          pulse.age += deltaTime;
          const progressIncrement = (ORB_SPEED * deltaTime) / distance;
          pulse.progress += progressIncrement;

          // Calculate orb position along the line
          const x = startNode.x + dx * pulse.progress;
          const y = startNode.y + dy * pulse.progress;

          // Calculate opacity based on age
          const opacity = Math.max(0, 1 - (pulse.age / ORB_LIFETIME));

          // Draw orb
          ctx.beginPath();
          ctx.arc(x, y, ORB_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = ORB_COLOR.replace('0.9', opacity.toString());
          ctx.fill();

          if (pulse.progress >= 1 || pulse.age >= ORB_LIFETIME) {
            node.pulses.splice(p, 1);
            p--;
          } else {
            needsRerender = true;
          }
        }

        // Draw node with pulse effect if active
        ctx.beginPath();
        const radius = node.isHub ? HUB_RADIUS : DOT_RADIUS;
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        
        if (node.pulseState !== undefined) {
          // Update pulse state with breathing timing
          node.pulseState = Math.min(1, node.pulseState + deltaTime * 0.65);
          
          // Create a breathing effect with smooth easing
          const breatheProgress = node.pulseState;
          let normalizedProgress;
          
          if (breatheProgress < 0.5) {
            // Breathe in phase (0-50%)
            normalizedProgress = breatheProgress / 0.5;
          } else {
            // Breathe out phase (50-100%)
            normalizedProgress = 1 - ((breatheProgress - 0.5) / 0.5);
          }
          
          // Use smooth easing for the breathing effect
          const easeProgress = Math.sin(normalizedProgress * Math.PI * 0.5);
          // Use HUB_RADIUS as base for pulse scale for all nodes, but with reduced scale
          const pulseScale = 1 + easeProgress * (HUB_RADIUS / radius) * 0.8;
          const pulseOpacity = easeProgress * 0.7;
          
          // Draw pulse ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * pulseScale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
          ctx.fill();
          
          // Draw node with white color during pulse
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        } else {
          ctx.fillStyle = node.isHub ? HUB_COLOR : NODE_COLOR;
        }
        ctx.fill();
      });

      if (needsRerender) setRerender((r) => r + 1);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  // Expose triggerPulse to parent
  useImperativeHandle(ref, () => ({
    triggerPulse: () => {
      if (!nodesRef.current.length) return;
      
      // Use current position or fall back to random node
      const startNodeIdx = currentPositionRef.current 
        ? findClosestNode(currentPositionRef.current.x, currentPositionRef.current.y)
        : Math.floor(Math.random() * nodesRef.current.length);
      
      const startNode = nodesRef.current[startNodeIdx];
      
      // Start pulse animation
      startNode.pulseState = 0;
      
      // Create pulses to all neighbors after the pulse has completely disappeared
      setTimeout(() => {
        startNode.neighbors.forEach(neighborIdx => {
          const pulse: Pulse = {
            progress: 0,
            startNode: startNodeIdx,
            nextNode: neighborIdx,
            age: 0
          };
          startNode.pulses.push(pulse);
        });
        startNode.pulseState = undefined; // Reset pulse state
        setRerender((r) => r + 1);
      }, 1000); // Reduced from 1500ms to 1000ms for nearly instantaneous transition
      
      setRerender((r) => r + 1);
    }
  }), []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{
        zIndex: 1,
        background: 'transparent',
        pointerEvents: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
});

NodeMesh.displayName = 'NodeMesh';

export default NodeMesh; 