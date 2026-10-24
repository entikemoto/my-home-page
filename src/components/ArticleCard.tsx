import Link from 'next/link';
import Image from 'next/image';
import type { HpArticleMeta } from '@/types/article';
import { formatDateJa } from '@/lib/article-labels';

type Props = {
  article: HpArticleMeta;
  /** 一覧の先頭など、大きく見せたいとき */
  featured?: boolean;
};

function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-3 w-3" fill="currentColor">
      <path d="M18.244 2H21.5l-7.52 8.59L22.8 22h-6.93l-5.42-7.08L4.26 22H1l8.04-9.19L.6 2h7.1l4.9 6.48L18.24 2Zm-1.21 18h1.8L7.03 3.9H5.1L17.03 20Z" />
    </svg>
  );
}

export default function ArticleCard({ article, featured = false }: Props) {
  const lead = article.todayPoint || article.summary;
  const href = `/articles/${article.articleId}`;

  return (
    <article
      className={`group relative flex flex-col border border-gray-100 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-[0_1px_0_0_rgba(0,0,0,0.04)] ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {article.coverImage && (
        <div className={`relative overflow-hidden bg-gray-100 ${featured ? 'aspect-[1200/630] md:w-1/2 md:aspect-auto' : 'aspect-[1200/630]'}`}>
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col px-5 pt-5 pb-4">
        <h2 className={`font-serif font-bold leading-snug text-gray-900 ${featured ? 'text-xl lg:text-2xl' : 'text-base'}`}>
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-amber-800 transition-colors">
            {article.title}
          </Link>
        </h2>

        {lead && (
          <p className={`mt-3 text-sm leading-relaxed text-gray-500 ${featured ? 'line-clamp-4' : 'line-clamp-2'}`}>
            {lead}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-gray-400">
          <time dateTime={article.publishedAt}>{formatDateJa(article.publishedAt, 'short')}</time>
          <span className="flex items-center gap-2">
            {article.xUrl && (
              <span className="inline-flex items-center gap-1 text-gray-500" title="X で読めます">
                <XGlyph />
              </span>
            )}
            {article.noteArticleUrl && <span className="text-gray-500">note</span>}
            {article.format === 'digest' && article.sourceName && (
              <span className="truncate max-w-[9rem]">{article.sourceName}</span>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
