'use client';

import { useMemo, useState } from 'react';
import type { HpArticleMeta } from '@/types/article';
import ArticleCard from '@/components/ArticleCard';

/**
 * 記事一覧の絞り込みと段階表示。
 * - 検索対象はメタ情報（タイトル・要約・タグ・媒体名）だけ。本文は送らない
 *   （2026-10-24 以前は 439 記事の本文 1.2MB をブラウザに送り、一覧ページが 4MB になっていた）
 * - 初期表示は PAGE 件。「もっと見る」で増やす（以前は全件を一度に描画し、縦 36,000px になっていた）
 */

const PAGE = 24;

type Props = {
  articles: HpArticleMeta[];
};

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('ja-JP');
}

export default function ArticleSearch({ articles }: Props) {
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return articles;
    return articles.filter((a) =>
      [a.title, a.summary, a.todayPoint ?? '', a.sourceName, a.tags.join(' ')].some((v) =>
        normalize(v).includes(q),
      ),
    );
  }, [articles, query]);

  const visible = filtered.slice(0, shown);
  const remaining = filtered.length - visible.length;

  return (
    <section>
      <div className="mb-8">
        <label htmlFor="article-search" className="sr-only">
          キーワード検索
        </label>
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="9" cy="9" r="6" />
            <line x1="13.5" y1="13.5" x2="18" y2="18" />
          </svg>
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(PAGE);
            }}
            placeholder="タイトル・要約・タグで探す（例: 医療AI、OpenAI）"
            className="w-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#14261F]"
          />
        </div>
        <p className="mt-3 text-xs text-gray-500">
          {query ? `「${query}」の検索結果 ${filtered.length} 件` : `全 ${articles.length} 件`}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">該当する記事がありません。</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((a, i) => (
            <ArticleCard key={a.articleId} article={a} featured={!query && i === 0} />
          ))}
        </div>
      )}

      {remaining > 0 && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="border border-gray-900 px-8 py-3 text-xs tracking-[0.2em] text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
          >
            さらに {Math.min(PAGE, remaining)} 件を表示（残り {remaining} 件）
          </button>
        </div>
      )}
    </section>
  );
}
