import { Footer } from '@hyo/ui';

export default function HyoTierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center bg-stone-200 min-h-screen">
      <div className="w-full max-w-[480px] min-h-screen bg-paper text-ink shadow-2xl relative overflow-x-hidden">
        {children}
        <Footer />
      </div>
    </div>
  );
}
