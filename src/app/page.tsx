import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

export default function HomePage() {
  const latestArticles = getArticles().slice(0, 6);

  return (
    <main>
      {/* ─── Section 1: Hero ─── */}
      <section className="min-h-[88vh] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Description + CTA */}
            <div className="flex flex-col items-start gap-6 order-2 lg:order-1">
              <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
                医師 / MBA / 医学博士
              </p>
              <p className="text-base text-gray-600 leading-relaxed max-w-sm">
                医療現場で積み上げた臨床知と、AIの最前線。<br />
                その交差点から、医療の未来を描く。
              </p>
              <div className="flex gap-4 mt-2">
                <Link
                  href="/articles"
                  className="px-7 py-3 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-700 transition-colors"
                >
                  解説記事を読む
                </Link>
                <Link
                  href="/about"
                  className="px-7 py-3 border border-gray-300 text-gray-700 text-sm tracking-wide hover:border-gray-600 transition-colors"
                >
                  プロフィール
                </Link>
              </div>
            </div>

            {/* Right: Large headline */}
            <div className="text-right order-1 lg:order-2">
              <h1 className="font-serif leading-[1.05] tracking-tight">
                <span className="block text-xl lg:text-2xl font-semibold text-gray-400 mb-2">
                  医師だから
                </span>
                <span className="block text-[clamp(4.5rem,10vw,9rem)] font-black text-gray-900">
                  見える。
                </span>
                <span className="block text-[clamp(2rem,4.5vw,4rem)] font-bold text-gray-500 mt-2">
                  医療AIの現実。
                </span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Dark Mission ─── */}
      <section className="bg-gray-900 text-white py-24 lg:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-serif text-[clamp(2rem,5vw,3.75rem)] font-black leading-[1.15] text-white">
                診察室で見えた問いを、<br />
                AIで世界に問う。
              </h2>
            </div>
            <div className="lg:pt-3">
              <div className="w-10 h-0.5 bg-teal-400 mb-8" />
              <p className="text-gray-300 leading-relaxed mb-5">
                医師にしか見えない課題がある。AIにしか解けない問いがある。
                その接点に立って、毎日の医療AIニュースを臨床の眼で読み解く。
              </p>
              <p className="text-gray-500 leading-relaxed mb-10">
                将来の医療AI起業に向け、現場発のイノベーションを模索しながら、
                医師・エンジニア・ビジネスパーソンが集える場をつくる。
              </p>
              <Link
                href="/about"
                className="text-teal-400 text-sm tracking-wide hover:text-teal-300 transition-colors"
              >
                詳しく見る →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 3: Latest Articles ─── */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900">
              最新の医療AI解説記事
            </h2>
            <Link
              href="/articles"
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              すべて見る →
            </Link>
          </div>

          {latestArticles.length === 0 ? (
            <p className="text-gray-400 text-sm">まだ記事がありません。</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.articleId} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Section 4: Profile ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Profile image placeholder */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-56 h-56 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-xs tracking-[0.3em] text-teal-600 uppercase mb-5">
                ● 自己紹介
              </p>
              <h2 className="font-serif text-3xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                医師兼<br />医療AI研究家
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                防衛医科大学校を卒業後、防衛医官として勤務。現在は医療法人ヒューマン理事長として
                臨床に携わりながら、医学博士（低酸素脳症研究）・MBA（BBT大学院）の知見を活かし、
                医療×AIの実装を探求する。
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-sm">
                毎朝・毎夜、医療AI最前線のニュースを1本ずつ解説。現場医師の視点で、
                AIが臨床・医療経営にどう変革をもたらすかを問い続ける。
              </p>
              <Link
                href="/about"
                className="inline-block px-7 py-3 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-700 transition-colors"
              >
                プロフィールを見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 5: Vision ─── */}
      <section className="border-t border-gray-100 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="w-16 h-px bg-gray-200" />
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">ビジョン</span>
            <div className="w-16 h-px bg-gray-200" />
          </div>
          <p className="font-serif text-xl lg:text-3xl font-bold text-gray-900 leading-relaxed">
            「診察室の現実と最先端AIを結び、<br />
            医師が主導する医療イノベーションを実現する。」
          </p>
        </div>
      </section>

      {/* ─── Section 6: CTA ─── */}
      <section className="bg-[#1a3357] text-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl lg:text-4xl font-bold mb-6 leading-relaxed">
            医療AIの最前線を、<br />
            一緒に追いかけませんか？
          </h2>
          <p className="text-blue-200 mb-10 text-sm lg:text-base">
            毎日の解説記事を note で配信中。X でも随時更新しています。
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://note.com/entikemoto"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-gray-900 text-sm tracking-wide font-medium hover:bg-gray-100 transition-colors"
            >
              note で読む
            </a>
            <a
              href="https://x.com/Ikemoto1966"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-blue-300 text-blue-100 text-sm tracking-wide font-medium hover:border-white hover:text-white transition-colors"
            >
              X でフォロー
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
