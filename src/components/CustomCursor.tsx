'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.8 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [role="button"]')) {
        setHovering(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [role="button"]')) {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'var(--color-text)',
        }}
        animate={{ opacity: hovering ? 0 : visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]"
      />
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          border: '1.5px solid color-mix(in srgb, var(--color-text) 35%, transparent)',
        }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 1.6 : 1 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-[9999]"
      />
    </>
  );
}
