import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="group">
          <p className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors font-serif">
            Takeshi Ikemoto
          </p>
          <p className="text-[10px] tracking-[0.3em] text-gray-400">医療 × 経営 × テクノロジー</p>
        </Link>
        <nav className="flex gap-4 lg:gap-6 text-xs sm:text-sm text-gray-500">
          <Link href="/articles" className="hover:text-gray-900 transition-colors tracking-wide">
            Articles
          </Link>
          <Link href="/essays" className="hover:text-gray-900 transition-colors tracking-wide">
            Essays
          </Link>
          <Link href="/dev-diary" className="hover:text-gray-900 transition-colors tracking-wide">
            Dev Log
          </Link>
          <Link href="/talks" className="hover:text-gray-900 transition-colors tracking-wide">
            Talks
          </Link>
          <Link href="/publications" className="hover:text-gray-900 transition-colors tracking-wide">
            Publications
          </Link>
          <Link href="/lab" className="hover:text-gray-900 transition-colors tracking-wide">
            Lab
          </Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors tracking-wide">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
