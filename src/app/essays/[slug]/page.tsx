import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getEssay, getEssays, _resetEssayCache } from '@/lib/essays';

if (process.env.NODE_ENV === 'development') {
  _resetEssayCache();
}

// ---------------------------------------------------------------------------
// 静的パス生成
// ---------------------------------------------------------------------------

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getEssays().map((e) => ({ slug: e.slug }));
}

// ---------------------------------------------------------------------------
// メタデータ
// ---------------------------------------------------------------------------

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) return {};

  return {
    title: essay.title,
    description: essay.summary,
    openGraph: {
      title: essay.title,
      description: essay.summary,
      type: 'article',
      publishedTime: essay.publishedAt,
    },
  };
}

// ---------------------------------------------------------------------------
// Markdown レンダラー
// ---------------------------------------------------------------------------

type BodyBlock =
  | { type: 'heading'; level: 2 | 3; content: string }
  | { type: 'list'; items: string[] }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'code'; content: string }
  | { type: 'hr' }
  | { type: 'paragraph'; content: string };

function renderInline(text: string): React.ReactNode {
  const pattern = /(\*\*[^*]+\*\*|\[\[[^\]]+\]\]|\[[^\]]*\]\([^)]+\)|`[^`]+`)/g;
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-700">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('[[') && part.endsWith(']]')) {
      return <span key={i}>{part.slice(2, -2)}</span>;
    }
    const linkMatch = part.match(/^\[([^\]]*)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-gray-900 transition-colors">
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

function bodyToBlocks(body: string): BodyBlock[] {
  const lines = body.split('\n');
  const blocks: BodyBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // コードブロック
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', content: codeLines.join('\n') });
      i++;
      continue;
    }

    // 見出し
    if (line.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, content: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, content: line.slice(3).trim() });
      i++;
      continue;
    }

    // HR
    if (line.trim() === '---') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // 空行
    if (line.trim() === '') {
      i++;
      continue;
    }

    // リスト
    if (line.trimStart().startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
        items.push(lines[i].replace(/^\s*-\s/, '').trim());
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // ブロッククォート
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'blockquote', lines: quoteLines });
      continue;
    }

    // 段落（連続する行をまとめる）
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('>') &&
      !lines[i].trimStart().startsWith('- ') &&
      lines[i].trim() !== '---'
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', content: paraLines.join(' ') });
    }
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// ページ本体
// ---------------------------------------------------------------------------

const SOURCE_LABEL: Record<string, string> = {
  'ai-assisted': 'AI初稿 → 本人執筆',
  'human-written': '本人執筆',
};

export default async function EssayPage({ params }: Props) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();

  const publishedDate = new Date(essay.publishedAt);
  const dateLabel = publishedDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const blocks = bodyToBlocks(essay.body);

  return (
    <main className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5 text-xs text-gray-400 tracking-wide">
          <span className="text-teal-600 uppercase tracking-[0.2em]">Essay</span>
          <span>·</span>
          <time dateTime={essay.publishedAt}>{dateLabel}</time>
          <span>·</span>
          <span>{SOURCE_LABEL[essay.source]}</span>
        </div>

        <h1 className="font-serif text-2xl lg:text-4xl font-bold leading-tight mb-6 text-gray-900">
          {essay.title}
        </h1>

        {essay.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {essay.tags.map((tag) => (
              <span key={tag} className="px-3 py-0.5 text-xs bg-gray-100 text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <hr className="border-gray-100 mb-10" />

      {/* 本文 */}
      <article className="space-y-5 text-base leading-[1.9] text-gray-700">
        {blocks.map((block, i) => {
          if (block.type === 'hr') return <hr key={i} className="border-gray-100" />;
          if (block.type === 'heading') {
            const Tag = block.level === 2 ? 'h2' : 'h3';
            const cls = block.level === 2
              ? 'font-serif text-xl font-bold text-gray-900 pt-3'
              : 'font-serif text-lg font-bold text-gray-900 pt-2';
            return <Tag key={i} className={cls}>{renderInline(block.content)}</Tag>;
          }
          if (block.type === 'code') {
            return (
              <pre key={i} className="bg-gray-50 border border-gray-100 p-4 overflow-x-auto text-sm font-mono text-gray-700">
                <code>{block.content}</code>
              </pre>
            );
          }
          if (block.type === 'blockquote') {
            return (
              <blockquote key={i} className="border-l-2 border-gray-200 pl-4 text-gray-500 italic space-y-1">
                {block.lines.map((l, j) => <p key={j}>{renderInline(l)}</p>)}
              </blockquote>
            );
          }
          if (block.type === 'list') {
            return (
              <ul key={i} className="list-disc pl-6 space-y-2">
                {block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
              </ul>
            );
          }
          return <p key={i}>{renderInline(block.content)}</p>;
        })}
      </article>

      <hr className="border-gray-100 mt-12 mb-8" />

      {/* フッター */}
      <footer className="space-y-3 text-sm text-gray-500">
        {essay.noteUrl && (
          <p>
            <span className="text-gray-400 text-xs tracking-wide uppercase mr-2">note</span>
            <a href={essay.noteUrl} target="_blank" rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-gray-700 transition-colors">
              noteでも読む
            </a>
          </p>
        )}
        <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
          ※ 本記事は個人の見解であり、医療上の診断・治療の助言ではありません。
        </p>
      </footer>
    </main>
  );
}
