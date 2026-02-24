'use client';

import dynamic from 'next/dynamic';

const LIQUID_ETHER_COLORS = ['#0077B6', '#00B4D8', '#90E0EF'];

// Dynamic import inside client component to defer WebGL loading after hydration
const LiquidEther = dynamic(() => import('./LiquidEther'), { ssr: false });

export default function LiquidEtherIsland() {
  return (
    <LiquidEther
      colors={LIQUID_ETHER_COLORS}
      resolution={0.35}
      autoDemo={true}
      autoSpeed={0.3}
      autoIntensity={1.5}
      mouseForce={15}
      cursorSize={80}
      disableInteraction={true}
      iterationsPoisson={16}
      iterationsViscous={16}
    />
  );
}
