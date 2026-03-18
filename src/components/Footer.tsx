import Link from 'next/link';

const MEDIA = [
  {
    label: 'note',
    href: 'https://note.com/entikemoto',
    description: '朝便・夜便 まとめ記事',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/Ikemoto1966',
    description: '速報・一言コメント',
  },
] as const;

export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6">
          {/* 媒体リンク */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              発信媒体
            </p>
            <ul className="space-y-2">
              {MEDIA.map(({ label, href, description }) => (
                <li key={label} className="flex items-baseline gap-2 text-sm">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {label}
                  </a>
                  <span className="text-gray-400 text-xs">{description}</span>
                </li>
              ))}
              <li className="flex items-baseline gap-2 text-sm">
                <span className="font-medium text-gray-600">Slack</span>
                <span className="text-gray-400 text-xs">
                  medai-co-lab — 医療AI共創コミュニティ
                </span>
              </li>
            </ul>
          </div>

          {/* サイトナビ */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              サイト
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/articles" className="hover:underline text-gray-600">
                  記事一覧
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline text-gray-600">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} 池本 武志 — 本サイトの記事は情報提供・解説を目的としており、医療上の診断・治療の助言ではありません。
        </p>
      </div>
    </footer>
  );
}
