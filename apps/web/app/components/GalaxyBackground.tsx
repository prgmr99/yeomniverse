'use client';

import dynamic from 'next/dynamic';

const Galaxy = dynamic(() => import('@hyo/ui').then((mod) => mod.Galaxy), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

export default function GalaxyBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-black" aria-hidden="true">
      <Galaxy
        focal={[0.5, 0.5]}
        starSpeed={1}
        density={1}
        hueShift={140}
        speed={1.0}
        glowIntensity={0.3}
        saturation={0.0}
        mouseRepulsion={true}
        repulsionStrength={2}
        twinkleIntensity={0.3}
        rotationSpeed={0.05}
        autoCenterRepulsion={0}
        transparent={false}
        mouseInteraction={true}
      />
    </div>
  );
}
