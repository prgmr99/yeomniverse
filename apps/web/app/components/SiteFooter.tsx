import Link from 'next/link';
import { SERVICES } from '@/lib/services';
import { CONTACT_EMAIL, GITHUB_URL } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-[#070910] px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-bold text-white">Yeomniverse</p>
          <p className="mt-3 text-sm leading-relaxed text-white/50">
            작은 도구를 하나씩 만들어 모아두는 곳입니다.
          </p>
        </div>

        <nav aria-label="서비스">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            서비스
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="사이트 정보">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            사이트
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/writing"
                className="text-white/60 transition-colors hover:text-white"
              >
                글
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-white/60 transition-colors hover:text-white"
              >
                소개
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-white/60 transition-colors hover:text-white"
              >
                문의
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-white/60 transition-colors hover:text-white"
              >
                개인정보처리방침
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-white/60 transition-colors hover:text-white"
              >
                이용약관
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            연락
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-white/60 transition-colors hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={GITHUB_URL}
                className="text-white/60 transition-colors hover:text-white"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/5 pt-6 text-xs text-white/35">
        <p>
          &copy; {new Date().getFullYear()} Yeomniverse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
