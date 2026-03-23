import React from 'react';
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
  | { type: 'blockquote'; lines: string[] }
  | { type: 'hr' }
  | { type: 'paragraph'; content: string };

/**
 * インラインマークダウンを React ノードに変換する。
 * 対応: **bold**, [[WikiLink]], [text](url)
 */
function renderInline(text: string): React.ReactNode {
  const pattern = /(\*\*[^*]+\*\*|\[\[[^\]]+\]\]|\[[^\]]*\]\([^)]+\))/g;
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('[[') && part.endsWith(']]')) {
      return <span key={i}>{part.slice(2, -2)}</span>;
    }
    const linkMatch = part.match(/^\[([^\]]*)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1].replace(/^>\s*/, '');
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-gray-900 transition-colors"
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

/** Markdown 風ブロック化 */
function bodyToBlocks(body: string): BodyBlock[] {
  const blocks = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.flatMap((block): BodyBlock[] => {
    if (block === '---') {
      return [{ type: 'hr' }];
    }

    // ### heading\n本文 のように1つの改行でつながっている場合を分離する
    if (block.startsWith('### ') || block.startsWith('## ')) {
      const firstNewline = block.indexOf('\n');
      if (firstNewline === -1) {
        const prefix = block.startsWith('### ') ? '### ' : '## ';
        return [{ type: 'heading', content: block.replace(new RegExp(`^${prefix.trim()}\\s+`), '').trim() }];
      }
      const headingLine = block.slice(0, firstNewline);
      const rest = block.slice(firstNewline + 1).trim();
      const prefix = headingLine.startsWith('### ') ? /^###\s+/ : /^##\s+/;
      const result: BodyBlock[] = [{ type: 'heading', content: headingLine.replace(prefix, '').trim() }];
      if (rest) result.push(...bodyToBlocks(rest));
      return result;
    }

    // blockquote: 全行が > で始まるブロック
    const lines = block.split('\n');
    if (lines.every((l) => l.startsWith('>'))) {
      const stripped = lines.map((l) => l.replace(/^>\s?/, '')).filter(Boolean);
      return [{ type: 'blockquote', lines: stripped }];
    }

    const trimmedLines = lines.map((l) => l.trim()).filter(Boolean);
    if (trimmedLines.length > 0 && trimmedLines.every((l) => l.startsWith('- '))) {
      return [{ type: 'list', items: trimmedLines.map((l) => l.replace(/^- /, '').trim()) }];
    }

    return [{ type: 'paragraph', content: block }];
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
        {blocks.map((block, i) =>
          block.type === 'hr' ? (
            <hr key={i} className="border-gray-100" />
          ) : block.type === 'heading' ? (
            <h2 key={i} className="font-serif text-xl font-bold text-gray-900 pt-3">
              {renderInline(block.content)}
            </h2>
          ) : block.type === 'blockquote' ? null : block.type === 'list' ? (
            <ul key={i} className="list-disc pl-6 space-y-2">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          ) : (
            <p key={i}>{renderInline(block.content)}</p>
          ),
        )}
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
