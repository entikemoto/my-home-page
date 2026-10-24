import React from 'react';
import { bodyToBlocks, type BodyBlock } from '@/lib/essay-markdown';

/**
 * 記事・エッセイ共通の本文レンダラー。
 * 解釈する記法は src/lib/essay-markdown.ts に限る（見出し・段落・リスト・引用・コード・水平線・**太字**・`code`・リンク・[[WikiLink]]）。
 */

export function renderInline(text: string): React.ReactNode {
  const pattern = /(\*\*[^*]+\*\*|\[\[[^\]]+\]\]|\[[^\]]*\]\([^)]+\)|`[^`]+`)/g;
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-gray-100 px-1.5 py-0.5 text-[0.9em] font-mono text-gray-700">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('[[') && part.endsWith(']]')) {
      return <span key={i}>{part.slice(2, -2)}</span>;
    }
    const linkMatch = part.match(/^\[([^\]]*)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1].replace(/^>\s*/, '') || linkMatch[2];
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-gray-300 underline-offset-4 hover:text-gray-900 hover:decoration-gray-700 transition-colors break-words"
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

/** 本文中の見出し（目次用） */
export function headingsOf(blocks: BodyBlock[]): { id: string; content: string; level: 2 | 3 }[] {
  return blocks
    .map((b, i) => (b.type === 'heading' ? { id: `h-${i}`, content: b.content, level: b.level } : null))
    .filter((h): h is { id: string; content: string; level: 2 | 3 } => h !== null);
}

type Props = {
  body: string;
  /** 先頭が引用（旧 digest 記事の出典行）なら落とす。出典は見出し側に出すため */
  dropLeadingBlockquote?: boolean;
  /** 本文中の見出しに id を振る（目次のリンク先） */
  headingIds?: boolean;
};

export function parseBody(body: string, dropLeadingBlockquote = false): BodyBlock[] {
  const blocks = bodyToBlocks(body);
  if (dropLeadingBlockquote && blocks[0]?.type === 'blockquote') {
    return blocks.slice(1);
  }
  return blocks;
}

export default function MarkdownBody({ body, dropLeadingBlockquote = false, headingIds = true }: Props) {
  const blocks = parseBody(body, dropLeadingBlockquote);
  const lastIndex = blocks.length - 1;

  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        if (block.type === 'hr') return <hr key={i} className="my-10 border-gray-200" />;
        if (block.type === 'heading') {
          const id = headingIds ? `h-${i}` : undefined;
          if (block.level === 2) {
            return (
              <h2 key={i} id={id} className="font-serif text-xl lg:text-[1.45rem] font-bold text-gray-900 leading-snug mt-12 mb-5 scroll-mt-24">
                {renderInline(block.content)}
              </h2>
            );
          }
          return (
            <h3 key={i} id={id} className="font-serif text-lg font-bold text-gray-900 leading-snug mt-9 mb-4 scroll-mt-24">
              {renderInline(block.content)}
            </h3>
          );
        }
        if (block.type === 'code') {
          return (
            <pre key={i} className="my-6 overflow-x-auto bg-gray-50 border border-gray-100 p-4 text-sm font-mono leading-relaxed text-gray-700">
              <code>{block.content}</code>
            </pre>
          );
        }
        if (block.type === 'blockquote') {
          return (
            <blockquote key={i} className="my-7 border-l-2 border-amber-700/60 pl-5 text-gray-600 space-y-2">
              {block.lines.map((l, j) => (
                <p key={j}>{renderInline(l)}</p>
              ))}
            </blockquote>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="my-6 space-y-2.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span aria-hidden className="mt-[0.85em] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700/70" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className={i === lastIndex ? 'mb-0' : 'mb-6'}>
            {renderInline(block.content)}
          </p>
        );
      })}
    </div>
  );
}
