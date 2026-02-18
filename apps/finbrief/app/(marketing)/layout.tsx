'use client';

import { LiquidEther } from '@/components/backgrounds';
import Header from '@/components/Header';

const LIQUID_ETHER_COLORS = ['#0077B6', '#00B4D8', '#90E0EF'];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Fixed Background */}
      <div className="fixed inset-0 -z-10" style={{ willChange: 'transform' }}>
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
      </div>
      <Header />
      {children}
    </>
  );
}
