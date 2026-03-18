import Link from 'next/link';
import type { HpArticleMeta } from '@/types/article';

const EDITION_LABEL: Record<string, string> = {
  morning: '朝便',
  evening: '夜便',
  standalone: 'note',
};

const CATEGORY_LABEL: Record<string, string> = {
  'deep-dive': 'AI Deep Dive',
  feature: 'note記事',
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
  const categoryLabel = CATEGORY_LABEL[article.category] ?? article.category;
  const topLabel =
    article.edition === 'standalone'
      ? categoryLabel || editionLabel
      : `${editionLabel} ${article.orderInEdition}本目`;
  const bottomLabel =
    article.edition === 'standalone'
      ? 'note単独記事'
      : 'AI Daily Digest から抽出';

  return (
    <article className="bg-white border-l-2 border-l-transparent border border-gray-100 hover:border-l-amber-700 hover:border-gray-200 transition-all duration-200 flex flex-col">
      <div className="px-5 pt-5 pb-1">
        <span className="text-[10px] text-amber-700 tracking-[0.3em] uppercase">
          {topLabel}
        </span>
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
          <div className="flex flex-col gap-1">
            <time dateTime={article.publishedAt}>{dateLabel}</time>
            <span>{bottomLabel}</span>
          </div>
          <span>{article.sourceName}</span>
        </div>
      </div>
    </article>
  );
}
