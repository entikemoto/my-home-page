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
  standalone: 'note記事',
};

type BodyBlock =
  | { type: 'heading'; content: string }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; content: string };

/** 簡易的な Markdown 風レンダリング用ブロック化 */
function bodyToBlocks(body: string): BodyBlock[] {
  const blocks = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);

    if (block.startsWith('### ')) {
      return { type: 'heading', content: block.replace(/^###\s+/, '').trim() };
    }

    if (block.startsWith('## ')) {
      return { type: 'heading', content: block.replace(/^##\s+/, '').trim() };
    }

    if (lines.length > 0 && lines.every((line) => line.startsWith('- '))) {
      return { type: 'list', items: lines.map((line) => line.replace(/^- /, '').trim()) };
    }

    return { type: 'paragraph', content: block };
  });
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
  const blocks = bodyToBlocks(article.body);
  const articleMetaLabel =
    article.edition === 'standalone' ? editionLabel : `${editionLabel} ${article.orderInEdition}本目`;

  return (
    <main className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5 text-xs text-gray-400 tracking-wide">
          <time dateTime={article.publishedAt}>{dateLabel}</time>
          <span>·</span>
          <span>{articleMetaLabel}</span>
          <span>·</span>
          <span>{article.sourceName}</span>
          {article.category && (
            <>
              <span>·</span>
              <span className="text-teal-600 uppercase">{article.category}</span>
            </>
          )}
        </div>

        <h1 className="font-serif text-2xl lg:text-4xl font-bold leading-tight mb-6 text-gray-900">
          {article.title}
        </h1>

        {/* タグ */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-0.5 text-xs bg-gray-100 text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <hr className="border-gray-100 mb-10" />

      {/* 本文 */}
      <article className="space-y-5 text-base leading-[1.9] text-gray-700">
        {blocks.map((block, i) => (
          block.type === 'heading' ? (
            <h2 key={i} className="font-serif text-xl font-bold text-gray-900 pt-3">
              {block.content}
            </h2>
          ) : block.type === 'list' ? (
            <ul key={i} className="list-disc pl-6 space-y-2">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p key={i}>{block.content}</p>
          )
        ))}
      </article>

      <hr className="border-gray-100 mt-12 mb-8" />

      {/* フッター：出典・導線 */}
      <footer className="space-y-3 text-sm text-gray-500">
        <p>
          <span className="text-gray-400 text-xs tracking-wide uppercase mr-2">元記事</span>
          <a
            href={article.originalSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-gray-700 break-all transition-colors"
          >
            {article.originalSourceUrl}
          </a>
        </p>

        {article.noteArticleUrl && (
          <p>
            <span className="text-gray-400 text-xs tracking-wide uppercase mr-2">note</span>
            <a
              href={article.noteArticleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-gray-700 transition-colors"
            >
              {article.edition === 'standalone' ? 'noteで読む' : '3本まとめ記事で読む'}
            </a>
          </p>
        )}

        <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
          ※ 本記事はAIニュースの解説を目的としており、医療上の診断・治療の助言ではありません。
        </p>
      </footer>
    </main>
  );
}
