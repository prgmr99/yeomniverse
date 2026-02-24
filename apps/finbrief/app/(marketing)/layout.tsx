import LiquidEtherIsland from '@/components/backgrounds/LiquidEtherIsland';
import Header from '@/components/Header';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Fixed Background - CSS gradient shows immediately, WebGL replaces after hydration */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          willChange: 'transform',
          background:
            'linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #90E0EF 100%)',
        }}
      >
        <LiquidEtherIsland />
      </div>
      <Header />
      {children}
    </>
  );
}
