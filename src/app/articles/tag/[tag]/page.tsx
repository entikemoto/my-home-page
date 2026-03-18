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
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <div className="mb-6">
        <Link href="/articles" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← 記事一覧
        </Link>
      </div>
      <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
        タグ: <span className="font-normal text-gray-500">{decoded}</span>
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
