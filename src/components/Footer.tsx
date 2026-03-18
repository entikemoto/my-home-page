import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-serif font-bold text-gray-900 mb-3">Takeshi Ikemoto</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              医療 × 経営 × テクノロジー
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
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/publications" className="hover:text-gray-900 transition-colors">
                  Publications
                </Link>
              </li>
              <li>
                <Link href="/lab" className="hover:text-gray-900 transition-colors">
                  Lab
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
              Publishing Channels
            </p>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <a
                  href="https://note.com/entikemoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  note
                </a>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  AI Daily Digest の朝版・夜版を中心に、そのほかの投稿も掲載
                </p>
              </li>
              <li>
                <a
                  href="https://x.com/Ikemoto1966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  X
                </a>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  note 更新の案内を中心に、短いコメントや補足を発信
                </p>
              </li>
              <li>
                <p className="text-gray-500">
                  Slack — medai-co-lab
                </p>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  医療AI共創コミュニティでの共有と対話
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Takeshi Ikemoto —
            当サイトの記事は情報提供を目的としており、医療上の診断・治療の助言ではありません。
          </p>
        </div>
      </div>
    </footer>
  );
}
