import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 mt-8 border-t border-stone-300 text-center text-stone-500 text-xs">
      <div className="flex justify-center space-x-4 mb-4">
        <Link href="/terms" className="hover:text-stone-800 transition-colors">
          이용약관
        </Link>
        <span className="text-stone-300">|</span>
        <Link
          href="/privacy"
          className="hover:text-stone-800 transition-colors font-bold"
        >
          개인정보처리방침
        </Link>
        <span className="text-stone-300">|</span>
        <Link href="/about" className="hover:text-stone-800 transition-colors">
          서비스 소개
        </Link>
      </div>
      <p className="mb-2">
        본 서비스는 재미를 위한 심리테스트이며, <br />
        실제 결과와 다를 수 있습니다.
      </p>
      <p className="font-serif">
        &copy; {new Date().getFullYear()} Hyo-Tier Committee. All rights
        reserved.
      </p>
    </footer>
  );
}
