import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getArticle, getArticles, _resetCache } from '@/lib/articles';

// ビルド時にキャッシュをリセット（HMR での二重読み込み対策）
if (process.env.NODE_ENV === 'development') {
  _resetCache();
}

// ---------------------------------------------------------------------------
// 静的パス生成
// ---------------------------------------------------------------------------

export async function generateStaticParams(): Promise<{ articleId: string }[]> {
  return getArticles().map((a) => ({ articleId: a.articleId }));
}

// ---------------------------------------------------------------------------
// メタデータ
// ---------------------------------------------------------------------------

type Props = { params: Promise<{ articleId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleId } = await params;
  const article = getArticle(articleId);
  if (!article) return {};

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

// ---------------------------------------------------------------------------
// ページ本体
// ---------------------------------------------------------------------------

const EDITION_LABEL: Record<string, string> = {
  morning: '朝便',
  evening: '夜便',
};

/** body の二重改行を段落に変換する（Markdown ライブラリ不要） */
function bodyToParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function ArticlePage({ params }: Props) {
  const { articleId } = await params;
  const article = getArticle(articleId);

  if (!article) notFound();

  const publishedDate = new Date(article.publishedAt);
  const dateLabel = publishedDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const editionLabel = EDITION_LABEL[article.edition] ?? article.edition;
  const paragraphs = bodyToParagraphs(article.body);

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          <span>{dateLabel}</span>
          <span>·</span>
          <span>{editionLabel} {article.orderInEdition}本目</span>
          <span>·</span>
          <span>{article.sourceName}</span>
        </div>

        <h1 className="text-2xl font-bold leading-tight mb-4">
          {article.title}
        </h1>

        {/* タグ */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <hr className="mb-8" />

      {/* 本文 */}
      <article className="space-y-4 text-base leading-relaxed">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>

      <hr className="mt-10 mb-6" />

      {/* フッター：出典・導線 */}
      <footer className="space-y-3 text-sm text-gray-600">
        <p>
          <span className="font-medium">元記事：</span>
          <a
            href={article.originalSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-900 break-all"
          >
            {article.originalSourceUrl}
          </a>
        </p>

        {article.noteArticleUrl && (
          <p>
            <span className="font-medium">note のまとめ記事：</span>
            <a
              href={article.noteArticleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              note で読む
            </a>
          </p>
        )}

        <p className="text-xs text-gray-400 mt-4">
          ※ 本記事はAIニュースの解説を目的としており、医療上の診断・治療の助言ではありません。
        </p>
      </footer>
    </main>
  );
}
