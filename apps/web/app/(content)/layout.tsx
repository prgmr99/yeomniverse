import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import SiteFooter from '@/app/components/SiteFooter';

export default function ContentLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>

      <div className="relative z-20 min-h-screen bg-[#0b0e17]">
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Yeomniverse
            </Link>
            <Link
              href="/about"
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              소개
            </Link>
          </div>
        </header>

        <main id="main-content" className="mx-auto max-w-3xl px-6 py-14">
          {children}
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
