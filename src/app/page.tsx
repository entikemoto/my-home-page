import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

export default function HomePage() {
  const latestArticles = getArticles().slice(0, 6);

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* ─── ヒーロー ─── */}
      <section className="mb-12">
        <h1 className="text-2xl font-bold mb-2">池本の医療AI日記</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          医師×MBAの視点から、医療AIの今と未来をお届けします。
          <br />
          毎朝・毎夜3本、1本ずつ個別記事として公開。
        </p>
      </section>

      {/* ─── 最新記事 ─── */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-lg font-bold">最新記事</h2>
          <Link href="/articles" className="text-sm text-gray-400 hover:underline">
            すべて見る →
          </Link>
        </div>

        {latestArticles.length === 0 ? (
          <p className="text-gray-400 text-sm">まだ記事がありません。</p>
        ) : (
          latestArticles.map((article) => (
            <ArticleCard key={article.articleId} article={article} />
          ))
        )}
      </section>

      {/* ─── About 導線 ─── */}
      <section className="border rounded-lg px-6 py-5">
        <p className="text-sm font-semibold mb-1">池本 武志</p>
        <p className="text-sm text-gray-500 mb-3">
          医師&nbsp;|&nbsp;MBA&nbsp;|&nbsp;医学博士（低酸素脳症研究）<br />
          医療法人ヒューマン 理事長 / 元防衛医官
        </p>
        <p className="text-sm text-gray-600 mb-4">
          医療×AIで現場発イノベーションを共創。
          医師・エンジニア・Bizが医療の未来を再設計する。
        </p>
        <Link
          href="/about"
          className="text-sm underline hover:text-gray-800"
        >
          詳しく見る →
        </Link>
      </section>
    </main>
  );
}
