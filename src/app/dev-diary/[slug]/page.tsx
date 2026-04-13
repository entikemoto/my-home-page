import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDevDiaryEntry, getDevDiaryEntries, _resetDevDiaryCache } from '@/lib/dev-diary';

if (process.env.NODE_ENV === 'development') {
  _resetDevDiaryCache();
}

// ---------------------------------------------------------------------------
// 静的パス生成
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getDevDiaryEntries().map((entry) => ({ slug: entry.slug }));
}

// ---------------------------------------------------------------------------
// メタデータ
// ---------------------------------------------------------------------------

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDevDiaryEntry(slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.summary,
    openGraph: {
      title: entry.title,
      description: entry.summary,
      type: 'article',
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
  | { type: 'code'; lang: string; content: string }
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

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', lang, content: codeLines.join('\n') });
      i++;
      continue;
    }
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
    if (line.trim() === '---') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }
    if (line.trim() === '') {
      i++;
      continue;
    }
    if (line.trimStart().startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
        items.push(lines[i].replace(/^\s*-\s/, '').trim());
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'blockquote', lines: quoteLines });
      continue;
    }

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

export default async function DevDiaryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getDevDiaryEntry(slug);
  if (!entry) notFound();

  const date = new Date(entry.date);
  const dateLabel = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const blocks = bodyToBlocks(entry.body);

  return (
    <main className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5 text-xs text-gray-400 tracking-wide">
          <span className="uppercase tracking-[0.2em]">Dev Log</span>
          <span>·</span>
          <time dateTime={entry.date}>{dateLabel}</time>
          <span>·</span>
          <span>本人執筆</span>
        </div>

        <h1 className="font-serif text-2xl lg:text-4xl font-bold leading-tight mb-6 text-gray-900">
          {entry.title}
        </h1>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span key={tag} className="px-3 py-0.5 text-xs bg-gray-100 text-gray-500 font-mono">
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

      <footer className="text-xs text-gray-400">
        <Link href="/dev-diary" className="hover:text-gray-600 transition-colors">
          ← Dev Log 一覧
        </Link>
      </footer>
    </main>
  );
}
