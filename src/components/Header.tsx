'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/articles', label: 'Articles' },
  { href: '/essays', label: 'Essays' },
  { href: '/dev-diary', label: 'Dev Log' },
  { href: '/talks', label: 'Talks' },
  { href: '/publications', label: 'Publications' },
  { href: '/lab', label: 'Lab' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="group" onClick={() => setMenuOpen(false)}>
          <p className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors font-serif">
            Takeshi Ikemoto
          </p>
          <p className="text-[10px] tracking-[0.3em] text-gray-400">医療 × 経営 × テクノロジー</p>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-4 lg:gap-6 text-sm text-gray-500">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-gray-900 transition-colors tracking-wide">
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
          aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
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

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-6 py-3 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
