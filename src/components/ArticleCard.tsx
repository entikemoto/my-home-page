import Link from 'next/link';
import type { HpArticleMeta } from '@/types/article';

const EDITION_LABEL: Record<string, string> = {
  morning: '朝便',
  evening: '夜便',
};

type Props = { article: HpArticleMeta };

export default function ArticleCard({ article }: Props) {
  const date = new Date(article.publishedAt);
  const dateLabel = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const editionLabel = EDITION_LABEL[article.edition] ?? article.edition;

  return (
    <article className="bg-white border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
      <div className="px-5 pt-5 pb-1">
        {article.category ? (
          <span className="text-xs text-teal-600 tracking-wide uppercase">
            {article.category}
          </span>
        ) : (
          <span className="text-xs text-gray-300 tracking-wide uppercase">
            {editionLabel}
          </span>
        )}
      </div>

      <div className="px-5 py-4 flex-1 flex flex-col">
        <h2 className="font-serif text-base font-bold leading-snug mb-3 flex-1">
          <Link
            href={`/articles/${article.articleId}`}
            className="hover:text-gray-500 transition-colors"
          >
            {article.title}
          </Link>
        </h2>

        {article.summary && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {article.summary}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
          <time dateTime={article.publishedAt}>{dateLabel}</time>
          <span>{article.sourceName}</span>
        </div>
      </div>
    </article>
  );
}
