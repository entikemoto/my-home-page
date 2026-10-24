import Link from 'next/link';
import Image from 'next/image';
import { getArticles } from '@/lib/articles';
import { getEssays } from '@/lib/essays';
import { getDevDiaryEntries } from '@/lib/dev-diary';
import { getLatestYouTubeVideos, getThumbnailUrl, getVideoUrl } from '@/lib/youtube';
import ArticleCard from '@/components/ArticleCard';
import { formatDateJa } from '@/lib/article-labels';
import { SOCIAL } from '@/lib/site';

/**
 * トップページ（2026-10-24 刷新）
 * 方針: 「人物が主役」は維持しつつ、最新記事を最初の画面の直後に置く。
 * 以前は ブランド文 → 92vh のヒーロー → 記事 → エッセイ → 開発記録 → YouTube → Mission → CTA と長く、
 * 記事に辿り着くまでに 2 画面スクロールが必要だった。
 */

function XGlyph({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2H21.5l-7.52 8.59L22.8 22h-6.93l-5.42-7.08L4.26 22H1l8.04-9.19L.6 2h7.1l4.9 6.48L18.24 2Zm-1.21 18h1.8L7.03 3.9H5.1L17.03 20Z" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, href, linkLabel = 'すべて見る' }: { eyebrow: string; title: string; href: string; linkLabel?: string }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <div>
        <p className="mb-2 text-[10px] tracking-[0.4em] text-gray-400 uppercase">{eyebrow}</p>
        <h2 className="font-serif text-2xl font-bold text-gray-900 lg:text-3xl">{title}</h2>
      </div>
      <Link href={href} className="shrink-0 text-xs tracking-[0.15em] text-gray-500 transition-colors hover:text-gray-900">
        {linkLabel} →
      </Link>
    </div>
  );
}

export default function HomePage() {
  const articles = getArticles();
  const [featured, ...rest] = articles.slice(0, 7);
  const latestEssays = getEssays().slice(0, 3);
  const latestDevLogs = getDevDiaryEntries().slice(0, 3);
  const latestVideos = getLatestYouTubeVideos(3);
  const latestDate = featured ? formatDateJa(featured.publishedAt) : null;

  return (
    <main>
      {/* ─── Brand Statement（元の形。2026-10-24 オーナー判断で維持） ─── */}
      <section className="bg-[#14261F] text-white py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-serif text-[clamp(1.8rem,4.5vw,3.5rem)] font-black tracking-tight text-[#F7F4EC] mb-5">
            Beyond Medicine. Beyond Imagination.
          </h2>
          <p className="text-[#C2CEC7] text-sm lg:text-base leading-relaxed">
            医療を越え、想像を越えて。
            <br />
            人とAIの叡智で、「次の医療」を創り出す。
          </p>
        </div>
      </section>

      {/* ─── Hero（名前・肩書・一言・導線） ─── */}
      <section className="border-b border-gray-100">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-12 lg:py-24">
          <div>
            <p className="mb-5 text-[10px] tracking-[0.5em] text-gray-400 uppercase">Takeshi Ikemoto</p>
            <h1 className="font-serif text-[2.6rem] font-black leading-[1.15] tracking-tight text-gray-900 lg:text-[3.6rem]">
              医師だから見える、
              <br />
              医療AIの現実。
            </h1>
            <p className="mt-6 max-w-md text-[0.95rem] leading-[1.9] text-gray-600">
              池本毅。医師・MBA・AIビルダー。
              診察室で見えた問いを手がかりに、毎日の AI ニュースを臨床の眼で読み解き、
              「次の医療」を構想しています。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/articles"
                className="inline-flex items-center bg-[#14261F] px-7 py-3 text-xs tracking-[0.15em] text-white transition-colors hover:bg-[#1D342B]"
              >
                解説記事を読む
              </Link>
              <a
                href={SOCIAL.x}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-300 px-7 py-3 text-xs tracking-[0.15em] text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
              >
                <XGlyph /> X でフォロー
              </a>
            </div>
          </div>

          {/* 右: 最新記事を大きく 1 本 */}
          {featured && (
            <div className="lg:justify-self-end lg:w-full">
              <p className="mb-3 flex items-center gap-3 text-[10px] tracking-[0.35em] text-gray-400 uppercase">
                <span className="h-px w-6 bg-amber-700" />
                Latest {latestDate && <span className="normal-case tracking-normal text-gray-400">{latestDate}</span>}
              </p>
              <ArticleCard article={featured} featured={false} />
            </div>
          )}
        </div>
      </section>

      {/* ─── 最新の解説記事 ─── */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <SectionHeading eyebrow="Articles" title="最新の解説記事" href="/articles" />
          {rest.length === 0 ? (
            <p className="text-sm text-gray-400">まだ記事がありません。</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <ArticleCard key={a.articleId} article={a} />
              ))}
            </div>
          )}
          <p className="mt-10 text-xs leading-relaxed text-gray-500">
            記事は X に投稿したものと同じ内容を全文で保存しています。X・note でも読めます。
          </p>
        </div>
      </section>

      {/* ─── エッセイ ／ 開発記録（2 列のリスト） ─── */}
      {(latestEssays.length > 0 || latestDevLogs.length > 0) && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
            {latestEssays.length > 0 && (
              <div>
                <SectionHeading eyebrow="Essays" title="エッセイ" href="/essays" />
                <ul className="divide-y divide-gray-100 border-t border-gray-100">
                  {latestEssays.map((e) => (
                    <li key={e.slug} className="py-5">
                      <Link href={`/essays/${e.slug}`} className="group block">
                        <time dateTime={e.publishedAt} className="text-xs text-gray-400">
                          {formatDateJa(e.publishedAt, 'short')}
                        </time>
                        <p className="mt-1 font-serif text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-amber-800">
                          {e.title}
                        </p>
                        {e.summary && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-500">{e.summary}</p>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {latestDevLogs.length > 0 && (
              <div>
                <SectionHeading eyebrow="Dev Log" title="開発記録" href="/dev-diary" />
                <ul className="divide-y divide-gray-100 border-t border-gray-100">
                  {latestDevLogs.map((d) => (
                    <li key={d.slug} className="py-5">
                      <Link href={`/dev-diary/${d.slug}`} className="group block">
                        <time dateTime={d.date} className="text-xs text-gray-400">
                          {formatDateJa(`${d.date}T00:00:00+09:00`, 'short')}
                        </time>
                        <p className="mt-1 font-serif text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-amber-800">
                          {d.title}
                        </p>
                        {d.summary && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-500">{d.summary}</p>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Mission ─── */}
      <section className="bg-[#14261F] py-16 text-white lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div>
            <p className="mb-5 text-[10px] tracking-[0.4em] text-[#C2CEC7] uppercase">Mission</p>
            <h2 className="font-serif text-3xl font-black leading-[1.2] text-[#F7F4EC] lg:text-4xl">
              診察室で見えた問いを、
              <br />
              AIで世界に問う。
            </h2>
            <div className="my-8 h-px w-8 bg-[#D9A86A]" />
            <p className="max-w-md text-sm leading-[1.9] text-[#C2CEC7]">
              医師にしか見えない課題がある。AIにしか解けない問いがある。
              その接点に立って、毎日のAIニュースを臨床の眼で読み解く。
              将来の医療AI起業に向け、医師・エンジニア・ビジネスパーソンが集える場をつくる。
            </p>
            <Link href="/about" className="mt-8 inline-block text-xs tracking-[0.15em] text-[#E3EADF] transition-colors hover:text-white">
              プロフィールを見る →
            </Link>
          </div>
          <div className="flex flex-col justify-center border-l border-[#3F5A50] lg:pl-16">
            <span className="mb-2 select-none font-serif text-6xl leading-none text-[#3F5A50]">&ldquo;</span>
            <p className="font-serif text-xl font-bold leading-relaxed text-[#F7F4EC] lg:text-2xl">
              診察室の現実と最先端AIを結び、
              <br />
              医師が主導する医療イノベーションを実現する。
            </p>
            <p className="mt-6 text-xs tracking-[0.2em] text-[#C2CEC7]">池本毅</p>
          </div>
        </div>
      </section>

      {/* ─── YouTube（クリニックの専門チャンネル・控えめに） ─── */}
      {latestVideos.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <SectionHeading eyebrow="YouTube" title="いびき・睡眠時無呼吸チャンネル" href="/youtube" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {latestVideos.map((video) => (
                <a
                  key={video.id}
                  href={getVideoUrl(video.videoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border border-gray-100 bg-white transition-all duration-200 hover:border-gray-300"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <Image
                      src={getThumbnailUrl(video.videoId)}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="px-5 py-4">
                    <p className="font-serif text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-amber-800">
                      {video.title}
                    </p>
                    <time dateTime={video.publishedAt} className="mt-2 block text-xs text-gray-400">
                      {formatDateJa(video.publishedAt, 'short')}
                    </time>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Follow ─── */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-5 text-[10px] tracking-[0.5em] text-gray-400 uppercase">Follow</p>
          <h2 className="font-serif text-2xl font-bold leading-relaxed text-gray-900 lg:text-3xl">
            AI の最前線を、一緒に追いかけませんか。
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            解説記事は X に投稿し、同じ内容を note とこのサイトに保存しています。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={SOCIAL.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 px-7 py-3 text-xs tracking-[0.2em] text-white transition-colors hover:bg-gray-700"
            >
              <XGlyph /> X でフォロー
            </a>
            <a
              href={SOCIAL.note}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-gray-300 px-7 py-3 text-xs tracking-[0.2em] text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
            >
              note で読む
            </a>
            <a
              href="/feed.xml"
              className="inline-flex items-center border border-gray-300 px-7 py-3 text-xs tracking-[0.2em] text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
            >
              RSS
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
