import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    '医師・MBA・医学博士。医療法人ヒューマン理事長。医療×AIで起業を目指す池本武志のプロフィール。',
};

export default function AboutPage() {
  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="py-24 lg:py-32 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] text-teal-600 uppercase mb-6">
                ● 自己紹介
              </p>
              <h1 className="font-serif text-[clamp(3.5rem,8vw,6rem)] font-black text-gray-900 leading-tight mb-6">
                池本 武志
              </h1>
              <p className="text-gray-500 text-base mb-8 leading-relaxed">
                医師 / MBA / 医学博士<br />
                医療法人ヒューマン 理事長 / 元 防衛医官
              </p>
              <p className="text-gray-700 leading-relaxed max-w-lg text-sm">
                診察室の課題は、現場にいる医師にしか見えない。
                その課題を技術で解くには、エンジニアの力が要る。
                それを事業にするには、Bizの視点が不可欠だ。
                三者が本音で対話し、医療現場発のイノベーションを起こす。
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-72 h-72 rounded-full bg-gray-100 flex items-center justify-center text-gray-200">
                <svg width="96" height="96" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Vision ─── */}
      <section className="bg-gray-50 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="w-16 h-px bg-gray-300" />
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">ビジョン</span>
            <div className="w-16 h-px bg-gray-300" />
          </div>
          <p className="font-serif text-xl lg:text-3xl font-bold text-gray-900 leading-relaxed mb-10">
            「診察室の現実と最先端AIを結び、<br />
            医師が主導する医療イノベーションを実現する。」
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto text-sm">
            医師×MBAの複眼で、医療AIの&ldquo;今&rdquo;と&ldquo;次&rdquo;を読み解く。
            毎朝・毎夜の解説記事を通じて、医師・エンジニア・ビジネスパーソンが
            医療の未来を共創できる場をつくる。
          </p>
        </div>
      </section>

      {/* ─── Profile ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="font-serif text-2xl font-bold mb-12 pb-4 border-b border-gray-100">
            プロフィール
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <dl className="space-y-6">
              <div className="grid grid-cols-[8rem_1fr] gap-4">
                <dt className="text-xs text-gray-400 pt-0.5 tracking-wide">現職</dt>
                <dd className="text-sm text-gray-700">医療法人ヒューマン 理事長</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-4">
                <dt className="text-xs text-gray-400 pt-0.5 tracking-wide">学位・資格</dt>
                <dd className="text-sm text-gray-700">
                  医師免許<br />
                  医学博士（低酸素脳症研究）<br />
                  MBA（BBT大学院 2024）
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-4">
                <dt className="text-xs text-gray-400 pt-0.5 tracking-wide">経歴</dt>
                <dd className="text-sm text-gray-700">
                  防衛医科大学校 卒業<br />
                  元 防衛医官
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-4">
                <dt className="text-xs text-gray-400 pt-0.5 tracking-wide">専門・関心</dt>
                <dd className="text-sm text-gray-700">
                  脳神経内科・救急・低酸素脳症<br />
                  生成AI・医療AI起業・Web開発
                </dd>
              </div>
            </dl>

            <div>
              <h3 className="font-serif text-lg font-bold mb-5 text-gray-900">
                このサイトについて
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                医師×MBAの複眼で、医療AIの&ldquo;今&rdquo;と&ldquo;次&rdquo;を読み解きます。
              </p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex gap-3">
                  <span className="text-teal-500 shrink-0 mt-0.5">●</span>
                  <span>医療AI最前線レポート — 海外含む主要ニュースを即日解説</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal-500 shrink-0 mt-0.5">●</span>
                  <span>AI論文解説 — 臨床応用の観点から読み解く</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal-500 shrink-0 mt-0.5">●</span>
                  <span>医療×AI起業動向 — スタートアップ・規制・資金調達の最新情報</span>
                </li>
              </ul>
              <Link
                href="/articles"
                className="text-sm text-gray-700 underline underline-offset-4 hover:text-gray-500 transition-colors"
              >
                記事一覧へ →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Media ─── */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="font-serif text-2xl font-bold mb-12">発信媒体</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-l-2 border-teal-400 pl-5">
              <a
                href="https://note.com/entikemoto"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gray-900 hover:text-teal-600 transition-colors block mb-2 text-sm"
              >
                note
              </a>
              <p className="text-xs text-gray-500 leading-relaxed">
                朝便・夜便の3本まとめ記事（購読者向けまとめ配信）
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <a
                href="https://x.com/Ikemoto1966"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gray-900 hover:text-teal-600 transition-colors block mb-2 text-sm"
              >
                X
              </a>
              <p className="text-xs text-gray-500 leading-relaxed">
                速報・一言コメント・HP記事の告知
              </p>
            </div>
            <div className="border-l-2 border-gray-200 pl-5">
              <p className="font-bold text-gray-700 mb-2 text-sm">Slack</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                medai-co-lab — 医師・エンジニア・Bizが集う医療AI共創コミュニティ
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <Link
                href="/articles"
                className="font-bold text-gray-900 hover:text-teal-600 transition-colors block mb-2 text-sm"
              >
                このHP
              </Link>
              <p className="text-xs text-gray-500 leading-relaxed">
                個別記事の正本。1本ずつ検索・タグ・月別で探せる
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Disclaimer ─── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <p className="text-xs text-gray-400 leading-relaxed">
          ※ 当サイトの記事は情報提供・解説を目的としており、医療上の診断・治療の助言ではありません。
          個別の医療判断については、必ず担当医にご相談ください。
        </p>
      </div>
    </main>
  );
}
