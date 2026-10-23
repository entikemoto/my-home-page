import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getAllTags } from '@/lib/articles';
import { tagToSlug } from '@/lib/tag-slug';
import ArticleSearch from '@/components/ArticleSearch';

export const metadata: Metadata = {
  title: '記事一覧',
  description: 'AI ニュースを臨床の眼で読み解く解説記事の書庫。タグ・月別・キーワードで探せます。',
};

export default function ArticlesPage() {
  const articles = getArticles();
  const tags = getAllTags().slice(0, 24);

  const months = [
    ...new Set(
      articles.map((a) => {
        const d = new Date(a.publishedAt);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      }),
    ),
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-14 lg:px-12 lg:py-20">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-[10px] tracking-[0.4em] text-gray-400 uppercase">Articles</p>
        <h1 className="font-serif text-3xl font-bold text-gray-900 lg:text-4xl">解説記事</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          AI ニュースを医師の眼で読み解いた解説を、1 本ずつ全文で保存しています。
          X と note で配信した記事と同じ内容です。タグ・月別・キーワードで過去の記事を探せます。
        </p>
      </header>

      {/* タグ（モバイルでは横スクロール） */}
      {tags.length > 0 && (
        <div className="-mx-6 mb-10 overflow-x-auto px-6 lg:hidden">
          <ul className="flex w-max gap-2 pb-1">
            {tags.slice(0, 12).map(({ tag, count }) => (
              <li key={tag}>
                <Link
                  href={`/articles/tag/${tagToSlug(tag)}`}
                  className="inline-block whitespace-nowrap border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
                >
                  {tag} <span className="text-gray-400">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-14">
        <div className="min-w-0 flex-1">
          {articles.length === 0 ? (
            <p className="text-gray-400">まだ記事がありません。</p>
          ) : (
            <ArticleSearch articles={articles} />
          )}
        </div>

        {/* サイドバー */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-24 space-y-10">
            {tags.length > 0 && (
              <section>
                <h2 className="mb-4 text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">タグ</h2>
                <ul className="space-y-1.5">
                  {tags.map(({ tag, count }) => (
                    <li key={tag}>
                      <Link
                        href={`/articles/tag/${tagToSlug(tag)}`}
                        className="flex justify-between text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        <span className="truncate">{tag}</span>
                        <span className="ml-2 text-gray-400">{count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {months.length > 0 && (
              <section>
                <h2 className="mb-4 text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">月別</h2>
                <ul className="space-y-1.5">
                  {months.map((ym) => {
                    const [y, m] = ym.split('/');
                    return (
                      <li key={ym}>
                        <Link
                          href={`/articles/archive/${y}/${m}`}
                          className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                        >
                          {y}年{parseInt(m, 10)}月
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <section className="border-t border-gray-100 pt-6 text-xs leading-relaxed text-gray-500">
              <p>
                新着は X と note でも読めます。
                <a href="/feed.xml" className="ml-1 underline underline-offset-2 hover:text-gray-900">RSS</a>
              </p>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
