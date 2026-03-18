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
    <article className="border-b py-5">
      <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
        <time dateTime={article.publishedAt}>{dateLabel}</time>
        <span>·</span>
        <span>{editionLabel} {article.orderInEdition}本目</span>
        <span>·</span>
        <span>{article.sourceName}</span>
      </div>

      <h2 className="text-lg font-semibold leading-snug mb-2">
        <Link
          href={`/articles/${article.articleId}`}
          className="hover:underline"
        >
          {article.title}
        </Link>
      </h2>

      {article.summary && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {article.summary}
        </p>
      )}

      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/articles/tag/${encodeURIComponent(tag)}`}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
