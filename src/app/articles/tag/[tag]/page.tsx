import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticlesByTag, getAllTags } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

type Props = { params: Promise<{ tag: string }> };

export async function generateStaticParams(): Promise<{ tag: string }[]> {
  return getAllTags().map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `タグ: ${decoded}`,
    description: `"${decoded}" タグの記事一覧`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const articles = getArticlesByTag(decoded);

  if (articles.length === 0) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-2">
        <Link href="/articles" className="text-sm text-gray-400 hover:underline">
          ← 記事一覧
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-1">
        タグ: <span className="font-normal">{decoded}</span>
      </h1>
      <p className="text-sm text-gray-500 mb-8">{articles.length}件</p>

      {articles.map((article) => (
        <ArticleCard key={article.articleId} article={article} />
      ))}
    </main>
  );
}
