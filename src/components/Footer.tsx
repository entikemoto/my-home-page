import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-serif font-bold text-gray-900 mb-3">池本 武志</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              医師・MBA・医学博士<br />
              医療法人ヒューマン 理事長<br />
              元 防衛医官
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              サイト
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/articles" className="hover:text-gray-900 transition-colors">
                  記事一覧
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-900 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Media */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              発信媒体
            </p>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <a
                  href="https://note.com/entikemoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  note — 朝便・夜便 まとめ記事
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/Ikemoto1966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  X — 速報・一言コメント
                </a>
              </li>
              <li className="text-gray-400">
                Slack — medai-co-lab（医療AI共創コミュニティ）
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} 池本 武志 —
            当サイトの記事は情報提供を目的としており、医療上の診断・治療の助言ではありません。
          </p>
        </div>
      </div>
    </footer>
  );
}
