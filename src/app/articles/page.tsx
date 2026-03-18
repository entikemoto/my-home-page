import type { Metadata } from 'next';
import { getArticles, getAllTags } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '記事一覧',
  description: '毎日のAIニュース解説記事の一覧。タグや月別で絞り込めます。',
};

export default function ArticlesPage() {
  const articles = getArticles();
  const tags = getAllTags().slice(0, 20); // 上位20タグを表示

  // 月別アーカイブの生成
  const months = [
    ...new Set(
      articles.map((a) => {
        const d = new Date(a.publishedAt);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      }),
    ),
  ].slice(0, 12);

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">記事一覧</h1>
      <p className="text-sm text-gray-500 mb-8">{articles.length}件</p>

      <div className="flex gap-8">
        {/* 記事リスト */}
        <div className="flex-1 min-w-0">
          {articles.length === 0 ? (
            <p className="text-gray-400">まだ記事がありません。</p>
          ) : (
            articles.map((article) => (
              <ArticleCard key={article.articleId} article={article} />
            ))
          )}
        </div>

        {/* サイドバー */}
        <aside className="w-44 shrink-0 hidden sm:block">
          {/* タグ一覧 */}
          {tags.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                タグ
              </h2>
              <div className="flex flex-col gap-1">
                {tags.map(({ tag, count }) => (
                  <Link
                    key={tag}
                    href={`/articles/tag/${encodeURIComponent(tag)}`}
                    className="text-sm text-gray-600 hover:underline flex justify-between"
                  >
                    <span>{tag}</span>
                    <span className="text-gray-400">{count}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 月別アーカイブ */}
          {months.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                月別
              </h2>
              <div className="flex flex-col gap-1">
                {months.map((ym) => {
                  const [y, m] = ym.split('/');
                  return (
                    <Link
                      key={ym}
                      href={`/articles/archive/${y}/${m}`}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      {y}年{parseInt(m)}月
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
