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
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-2">
        <Link href="/articles" className="text-sm text-gray-400 hover:underline">
          ← 記事一覧
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-1">
        {y}年{m}月の記事
      </h1>
      <p className="text-sm text-gray-500 mb-8">{articles.length}件</p>

      {articles.map((article) => (
        <ArticleCard key={article.articleId} article={article} />
      ))}
    </main>
  );
}
