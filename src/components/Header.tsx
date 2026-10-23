'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SOCIAL } from '@/lib/site';

/**
 * 主導線は 5 つに絞る（以前は英語ラベル 9 項目）。
 * 発信一覧（/posts）・YouTube・Lab はフッターから辿れる。
 */
const navLinks = [
  { href: '/articles', label: '記事' },
  { href: '/essays', label: 'エッセイ' },
  { href: '/dev-diary', label: '開発記録' },
  { href: '/talks', label: '登壇・著書' },
  { href: '/about', label: 'プロフィール' },
];

function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5" fill="currentColor">
      <path d="M18.244 2H21.5l-7.52 8.59L22.8 22h-6.93l-5.42-7.08L4.26 22H1l8.04-9.19L.6 2h7.1l4.9 6.48L18.24 2Zm-1.21 18h1.8L7.03 3.9H5.1L17.03 20Z" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" className="group" onClick={() => setMenuOpen(false)}>
          <p className="font-serif text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-gray-600">
            Takeshi Ikemoto
          </p>
          <p className="text-[10px] tracking-[0.3em] text-gray-400">医療 × 経営 × テクノロジー</p>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex lg:gap-8">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="tracking-wide transition-colors hover:text-gray-900">
              {label}
            </Link>
          ))}
          <a
            href={SOCIAL.x}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-900 px-3 py-1.5 text-xs tracking-[0.12em] text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
          >
            <XGlyph />
            <span>フォロー</span>
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="p-2 text-gray-500 transition-colors hover:text-gray-900 md:hidden"
          aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="17" y2="6" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="14" x2="17" y2="14" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white md:hidden">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-6 py-3.5 text-sm tracking-wide text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-4 border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
            <a href={SOCIAL.x} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-gray-900">
              <XGlyph /> X
            </a>
            <a href={SOCIAL.note} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
              note
            </a>
            <Link href="/posts" className="hover:text-gray-900" onClick={() => setMenuOpen(false)}>
              発信一覧
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
