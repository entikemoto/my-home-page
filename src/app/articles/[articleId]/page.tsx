import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getArticle, getAdjacentArticles, getRelatedArticles, _resetCache } from '@/lib/articles';
import { tagToSlug } from '@/lib/tag-slug';
import { absoluteUrl } from '@/lib/site';
import MarkdownBody, { headingsOf, parseBody } from '@/components/MarkdownBody';
import ChannelLinks from '@/components/ChannelLinks';
import ArticleCard from '@/components/ArticleCard';
import { articleKindLabel, formatDateJa } from '@/lib/article-labels';

// ビルド時にキャッシュをリセット（HMR での二重読み込み対策）
if (process.env.NODE_ENV === 'development') {
  _resetCache();
}

type Props = { params: Promise<{ articleId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleId } = await params;
  const article = getArticle(articleId);
  if (!article) return {};

  const description = article.todayPoint || article.summary;
  const url = absoluteUrl(`/articles/${article.articleId}`);
  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      url,
      publishedTime: article.publishedAt,
      tags: article.tags,
    },
    twitter: { card: 'summary_large_image', title: article.title, description },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { articleId } = await params;
  const article = getArticle(articleId);
  if (!article) notFound();

  const blocks = parseBody(article.body, article.format === 'digest');
  const headings = headingsOf(blocks).filter((h) => h.level === 2 || h.level === 3);
  const showToc = headings.length >= 3;
  const { newer, older } = getAdjacentArticles(article.articleId);
  const related = getRelatedArticles(article.articleId, 3);

  return (
    <main className="px-6 lg:px-8">
      <article className="mx-auto max-w-[42rem] py-14 lg:py-20">
        {/* ─── 見出し ─── */}
        <header className="mb-10">
          <p className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-[0.12em] text-gray-500">
            <span className="text-amber-700">{articleKindLabel(article)}</span>
            <span aria-hidden className="text-gray-300">/</span>
            <time dateTime={article.publishedAt}>{formatDateJa(article.publishedAt)}</time>
            {article.format === 'digest' && article.sourceName && (
              <>
                <span aria-hidden className="text-gray-300">/</span>
                <span>{article.sourceName}</span>
              </>
            )}
          </p>

          <h1 className="font-serif text-[1.7rem] lg:text-[2.35rem] font-bold leading-[1.35] tracking-tight text-gray-900">
            {article.title}
          </h1>

          {article.todayPoint && (
            <p className="mt-6 border-l-2 border-amber-700 pl-5 text-[1.02rem] leading-[1.95] text-gray-800">
              {article.todayPoint}
            </p>
          )}

          {article.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/articles/tag/${tagToSlug(tag)}`}
                    className="inline-block bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7">
            <ChannelLinks
              xUrl={article.xUrl}
              noteUrl={article.noteArticleUrl}
              sourceUrl={article.originalSourceUrl}
              sourceName={article.sourceName}
            />
          </div>
        </header>

        {article.coverImage && (
          <figure className="relative mb-10 aspect-[1200/630] w-full overflow-hidden bg-gray-100">
            <Image src={article.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" priority />
          </figure>
        )}

        {/* ─── 目次 ─── */}
        {showToc && (
          <nav aria-label="目次" className="mb-10 border border-gray-100 bg-gray-50/60 px-6 py-5">
            <p className="mb-3 text-[10px] tracking-[0.35em] text-gray-400 uppercase">Contents</p>
            <ol className="space-y-1.5 text-sm">
              {headings.map((h) => (
                <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                  <a href={`#${h.id}`} className="text-gray-700 hover:text-amber-700 transition-colors">
                    {h.content}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* ─── 本文 ─── */}
        <div className="font-sans text-[1.02rem] leading-[2] text-gray-800 [&_p]:tracking-[0.01em]">
          <MarkdownBody body={article.body} dropLeadingBlockquote={article.format === 'digest'} />
        </div>

        {/* ─── 出典・導線 ─── */}
        <footer className="mt-14 border-t border-gray-200 pt-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="mb-3 text-[10px] tracking-[0.35em] text-gray-400 uppercase">この記事を読める場所</p>
              <ChannelLinks
                xUrl={article.xUrl}
                noteUrl={article.noteArticleUrl}
                sourceUrl={article.originalSourceUrl}
                sourceName={article.sourceName}
                size="sm"
              />
            </div>
            {article.originalSourceUrl && (
              <p className="max-w-full text-xs leading-relaxed text-gray-500">
                <span className="mr-2 tracking-wide text-gray-400">出典</span>
                <a
                  href={article.originalSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all underline underline-offset-4 hover:text-gray-900 transition-colors"
                >
                  {article.originalSourceUrl}
                </a>
              </p>
            )}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-gray-400">
            ※ 本記事は AI ニュースの解説を目的としており、医療上の診断・治療の助言ではありません。
          </p>
        </footer>
      </article>

      {/* ─── 前後の記事 ─── */}
      {(newer || older) && (
        <nav aria-label="前後の記事" className="mx-auto max-w-[42rem] border-t border-gray-100 py-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              {newer && (
                <Link href={`/articles/${newer.articleId}`} className="group block">
                  <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">← 新しい記事</span>
                  <span className="mt-1 block font-serif text-sm font-bold leading-snug text-gray-800 group-hover:text-amber-700 transition-colors">
                    {newer.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="sm:text-right">
              {older && (
                <Link href={`/articles/${older.articleId}`} className="group block">
                  <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">古い記事 →</span>
                  <span className="mt-1 block font-serif text-sm font-bold leading-snug text-gray-800 group-hover:text-amber-700 transition-colors">
                    {older.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* ─── 関連記事 ─── */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-14 -mx-6 lg:-mx-8 px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="mb-2 text-[10px] tracking-[0.4em] text-gray-400 uppercase">Related</p>
            <h2 className="mb-8 font-serif text-xl font-bold text-gray-900">関連する記事</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.articleId} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
