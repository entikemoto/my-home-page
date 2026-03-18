import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold hover:opacity-70 transition-opacity">
          池本の医療AI日記
        </Link>
        <nav className="flex gap-5 text-sm text-gray-500">
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
