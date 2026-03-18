import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticlesByMonth, getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

type Props = { params: Promise<{ year: string; month: string }> };

export async function generateStaticParams(): Promise<{ year: string; month: string }[]> {
  const articles = getArticles();
  const seen = new Set<string>();
  const params: { year: string; month: string }[] = [];

  for (const a of articles) {
    const d = new Date(a.publishedAt);
    const year = String(d.getFullYear());
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const key = `${year}/${month}`;
    if (!seen.has(key)) {
      seen.add(key);
      params.push({ year, month });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, month } = await params;
  return {
    title: `${year}年${parseInt(month)}月の記事`,
    description: `${year}年${parseInt(month)}月に公開した記事の一覧`,
  };
}

export default async function MonthlyArchivePage({ params }: Props) {
  const { year, month } = await params;
  const y = parseInt(year);
  const m = parseInt(month);

  if (isNaN(y) || isNaN(m)) notFound();

  const articles = getArticlesByMonth(y, m);
  if (articles.length === 0) notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <div className="mb-6">
        <Link href="/articles" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← 記事一覧
        </Link>
      </div>
      <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
        {y}年{m}月の記事
      </h1>
      <p className="text-sm text-gray-400 mb-12">{articles.length}件</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.articleId} article={article} />
        ))}
      </div>
    </main>
  );
}
