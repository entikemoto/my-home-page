import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="group">
          <p className="text-base font-bold tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors font-serif">
            池本 武志
          </p>
          <p className="text-xs text-gray-400">医師 / 医療AI研究家</p>
        </Link>
        <nav className="flex gap-8 text-sm text-gray-500">
          <Link href="/articles" className="hover:text-gray-900 transition-colors">
            記事
          </Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
