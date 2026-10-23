import Link from 'next/link';
import { SOCIAL } from '@/lib/site';

const siteLinks = [
  { href: '/articles', label: '記事' },
  { href: '/essays', label: 'エッセイ' },
  { href: '/dev-diary', label: '開発記録' },
  { href: '/posts', label: '発信一覧' },
  { href: '/talks', label: '登壇' },
  { href: '/publications', label: '著書' },
  { href: '/youtube', label: 'YouTube' },
  { href: '/lab', label: '医療AI共創ラボ' },
  { href: '/about', label: 'プロフィール' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr_1.4fr]">
          {/* Brand */}
          <div>
            <p className="mb-2 font-serif text-lg font-bold text-gray-900">Takeshi Ikemoto</p>
            <p className="text-xs tracking-[0.2em] text-gray-400">医療 × 経営 × テクノロジー</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-500">
              医師・MBA・AIビルダー 池本毅。AI ニュースを臨床の眼で読み解く解説記事を、1 本ずつ探せる形で蓄積しています。
            </p>
          </div>

          {/* Site */}
          <div>
            <p className="mb-4 text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">サイト</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
              {siteLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-gray-900">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Channels */}
          <div>
            <p className="mb-4 text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">読める場所</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href={SOCIAL.x} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 transition-colors hover:text-amber-700">
                  X {SOCIAL.xHandle}
                </a>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">解説記事を X 記事として配信。最初に出るのはここ</p>
              </li>
              <li>
                <a href={SOCIAL.note} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 transition-colors hover:text-amber-700">
                  note
                </a>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">同じ記事を note でも公開。過去の朝便・夜便も</p>
              </li>
              <li>
                <Link href="/articles" className="font-medium text-gray-900 transition-colors hover:text-amber-700">
                  このサイト
                </Link>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                  全文を 1 本ずつ保存。タグ・月別・検索で探せる書庫。
                  <a href="/feed.xml" className="ml-1 underline underline-offset-2 hover:text-gray-900">RSS</a>
                </p>
              </li>
              <li>
                <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 transition-colors hover:text-amber-700">
                  YouTube
                </a>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">いびき・睡眠時無呼吸チャンネル（いけもと耳鼻咽喉科クリニック監修）</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs leading-relaxed text-gray-400">
            © {new Date().getFullYear()} Takeshi Ikemoto ／
            当サイトの記事は情報提供を目的としており、医療上の診断・治療の助言ではありません。
          </p>
        </div>
      </div>
    </footer>
  );
}
