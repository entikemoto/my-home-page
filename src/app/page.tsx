import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import { getEssays } from '@/lib/essays';
import { getDevDiaryEntries } from '@/lib/dev-diary';
import ArticleCard from '@/components/ArticleCard';

export default function HomePage() {
  const latestArticles = getArticles().slice(0, 3);
  const latestEssays = getEssays().slice(0, 2);
  const latestDevLogs = getDevDiaryEntries().slice(0, 3);

  return (
    <main>
      {/* ─── Brand Statement ─── */}
      <section className="bg-[#14261F] text-white py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-serif text-[clamp(1.8rem,4.5vw,3.5rem)] font-black tracking-tight text-[#F7F4EC] mb-5">
            Beyond Medicine. Beyond Imagination.
          </h2>
          <p className="text-[#C2CEC7] text-sm lg:text-base leading-relaxed">
            医療を越え、想像を越えて。<br />
            人とAIの叡智で、「次の医療」を創り出す。
          </p>
        </div>
      </section>

      {/* ─── Section 1: Hero ─── */}
      <section className="min-h-[92vh] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: Name + Title + CTA */}
            <div className="flex flex-col gap-12 order-2 lg:order-1">
              <div>
                <p className="text-[10px] tracking-[0.5em] text-gray-300 uppercase mb-6">
                  Takeshi Ikemoto
                </p>
                <p className="font-serif text-5xl lg:text-6xl font-black text-gray-900 leading-none mb-5">
                  池本毅
                </p>
                <p className="text-[10px] tracking-[0.4em] text-amber-700 uppercase border-l border-amber-700 pl-3">
                  医師　MBA　AIビルダー
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-8">
                  医療現場で積み上げた臨床知と、AIの最前線。<br />
                  その交差点から、医療の未来を描く。
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/articles"
                    className="px-7 py-3 bg-[#14261F] text-white text-xs tracking-[0.15em] hover:bg-[#1D342B] transition-colors"
                  >
                    解説記事を読む
                  </Link>
                  <Link
                    href="/about"
                    className="px-7 py-3 border border-gray-200 text-gray-600 text-xs tracking-[0.15em] hover:border-gray-900 hover:text-gray-900 transition-colors"
                  >
                    プロフィール
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Large Headline */}
            <div className="text-right order-1 lg:order-2">
              <h1 className="font-serif leading-none tracking-tight">
                <span className="block text-lg lg:text-xl font-light text-gray-300 mb-4 tracking-[0.2em]">
                  医師だから
                </span>
                <span className="block text-[clamp(5rem,11vw,9.5rem)] font-black text-gray-900">
                  見える。
                </span>
                <span className="block text-[clamp(1.8rem,4vw,3.5rem)] font-semibold text-gray-400 mt-4">
                  医療AIの現実。
                </span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Latest Articles ─── */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-3">Latest</p>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900">
                解説記事
              </h2>
            </div>
            <Link
              href="/articles"
              className="text-xs tracking-[0.15em] text-gray-400 hover:text-gray-900 transition-colors"
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

      {/* ─── Section 3: Latest Essays ─── */}
      {latestEssays.length > 0 && (
        <section className="bg-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-3">Essays</p>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900">
                  エッセイ
                </h2>
              </div>
              <Link
                href="/essays"
                className="text-xs tracking-[0.15em] text-gray-400 hover:text-gray-900 transition-colors"
              >
                すべて見る →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              {latestEssays.map((essay) => {
                const date = new Date(essay.publishedAt);
                const dateLabel = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
                return (
                  <article key={essay.slug} className="bg-white border-l-2 border-l-transparent border border-gray-100 hover:border-l-teal-600 hover:border-gray-200 transition-all duration-200 flex flex-col">
                    <div className="px-5 pt-5 pb-1 flex items-center justify-between">
                      <span className="text-[10px] text-teal-600 tracking-[0.3em] uppercase">Essay</span>
                      {essay.noteUrl && (
                        <a href={essay.noteUrl} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                          note ↗
                        </a>
                      )}
                    </div>
                    <div className="px-5 py-4 flex-1 flex flex-col">
                      <h3 className="font-serif text-base font-bold leading-snug mb-3 flex-1">
                        <Link href={`/essays/${essay.slug}`} className="hover:text-gray-500 transition-colors">
                          {essay.title}
                        </Link>
                      </h3>
                      {essay.summary && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{essay.summary}</p>
                      )}
                      <div className="text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
                        <time dateTime={essay.publishedAt}>{dateLabel}</time>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Section 4: Latest Dev Logs ─── */}
      {latestDevLogs.length > 0 && (
        <section className="bg-gray-50 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-3">Dev Log</p>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900">
                  開発記録
                </h2>
              </div>
              <Link
                href="/dev-diary"
                className="text-xs tracking-[0.15em] text-gray-400 hover:text-gray-900 transition-colors"
              >
                すべて見る →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestDevLogs.map((entry) => {
                const dateLabel = new Date(`${entry.date}T00:00:00Z`).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'UTC',
                });
                return (
                  <article key={entry.slug} className="bg-white border-l-2 border-l-transparent border border-gray-100 hover:border-l-gray-400 hover:border-gray-200 transition-all duration-200 flex flex-col">
                    <div className="px-5 pt-5 pb-1">
                      <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase">Dev Log</span>
                    </div>
                    <div className="px-5 py-4 flex-1 flex flex-col">
                      <h3 className="font-serif text-base font-bold leading-snug mb-3 flex-1">
                        <Link href={`/dev-diary/${entry.slug}`} className="hover:text-gray-500 transition-colors">
                          {entry.title}
                        </Link>
                      </h3>
                      {entry.summary && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{entry.summary}</p>
                      )}
                      <div className="mt-auto pt-4 border-t border-gray-50">
                        <time dateTime={entry.date} className="text-xs text-gray-400 block mb-2">{dateLabel}</time>
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 text-[10px] bg-gray-50 text-gray-400 font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Section 5: Mission + Vision ─── */}
      <section className="bg-white py-24 lg:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left: Mission */}
            <div className="flex flex-col justify-center">
              <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-6">Mission</p>
              <h2 className="font-serif text-3xl lg:text-5xl font-black text-gray-900 leading-[1.15] mb-8">
                診察室で見えた問いを、<br />
                AIで世界に問う。
              </h2>
              <div className="w-8 h-px bg-amber-700 mb-8" />
              <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-sm">
                医師にしか見えない課題がある。AIにしか解けない問いがある。
                その接点に立って、毎日のAIニュースを臨床の眼で読み解く。
              </p>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-10">
                将来の医療AI起業に向け、現場発のイノベーションを模索しながら、
                医師・エンジニア・ビジネスパーソンが集える場をつくる。
              </p>
              <Link
                href="/about"
                className="text-xs tracking-[0.15em] text-gray-700 hover:text-gray-400 transition-colors"
              >
                プロフィールを見る →
              </Link>
            </div>

            {/* Right: Vision Quote */}
            <div className="flex flex-col justify-center border-l border-gray-100 lg:pl-16">
              <span className="font-serif text-7xl text-gray-100 leading-none mb-2 select-none">&ldquo;</span>
              <p className="font-serif text-xl lg:text-2xl font-bold text-gray-800 leading-relaxed mb-8">
                診察室の現実と最先端AIを結び、<br />
                医師が主導する医療イノベーションを実現する。
              </p>
              <div className="flex items-center gap-4">
                <div className="w-6 h-px bg-gray-300" />
                <span className="text-xs text-gray-400 tracking-[0.2em]">池本毅</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 6: CTA ─── */}
      <section className="bg-[#14261F] text-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[10px] tracking-[0.5em] text-[#C2CEC7] uppercase mb-6">Follow</p>
          <h2 className="font-serif text-2xl lg:text-4xl font-bold mb-6 leading-relaxed text-[#F7F4EC]">
            AIの最前線を、<br />
            一緒に追いかけませんか？
          </h2>
          <p className="text-[#C2CEC7] mb-10 text-sm tracking-wide">
            毎日の解説記事を note で配信中。X でも随時更新。
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://note.com/entikemoto"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#E3EADF] text-[#14261F] text-xs tracking-[0.2em] font-medium hover:bg-[#F7F4EC] transition-colors"
            >
              note で読む
            </a>
            <a
              href="https://x.com/Ikemoto1966"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-[#3F5A50] text-[#C2CEC7] text-xs tracking-[0.2em] font-medium hover:border-[#E3EADF] hover:text-[#F7F4EC] transition-colors"
            >
              X でフォロー
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
