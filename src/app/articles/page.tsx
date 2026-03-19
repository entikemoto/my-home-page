import type { Metadata } from 'next';
import { getArticles, getArticlesWithBody, getAllTags } from '@/lib/articles';
import ArticleSearch from '@/components/ArticleSearch';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '記事一覧',
  description: '毎日のAIニュース解説記事の一覧。タグや月別で絞り込めます。',
};

export default function ArticlesPage() {
  const articles = getArticles();
  const searchableArticles = getArticlesWithBody();
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
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2 text-gray-900">記事一覧</h1>
      <p className="text-sm text-gray-400 mb-3">{articles.length}件</p>
      <p className="text-sm text-gray-500 leading-relaxed mb-12">
        AI Daily Digest は 1本ずつに分解して掲載し、単独で公開した note 記事もあわせて収録しています。
      </p>

      <div className="flex gap-12">
        {/* 記事グリッド */}
        <div className="flex-1 min-w-0">
          {articles.length === 0 ? (
            <p className="text-gray-400">まだ記事がありません。</p>
          ) : (
            <ArticleSearch articles={searchableArticles} />
          )}
        </div>

        {/* サイドバー */}
        <aside className="w-48 shrink-0 hidden lg:block">
          {/* タグ一覧 */}
          {tags.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                タグ
              </h2>
              <div className="flex flex-col gap-1.5">
                {tags.map(({ tag, count }) => (
                  <Link
                    key={tag}
                    href={`/articles/tag/${tag}`}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex justify-between"
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
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                月別
              </h2>
              <div className="flex flex-col gap-1.5">
                {months.map((ym) => {
                  const [y, m] = ym.split('/');
                  return (
                    <Link
                      key={ym}
                      href={`/articles/archive/${y}/${m}`}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
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
