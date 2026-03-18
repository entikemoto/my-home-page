'use client';

import { useMemo, useState } from 'react';
import type { HpArticle } from '@/types/article';
import ArticleCard from '@/components/ArticleCard';

type Props = {
  articles: HpArticle[];
};

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('ja-JP');
}

export default function ArticleSearch({ articles }: Props) {
  const [query, setQuery] = useState('');

  const filteredArticles = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return articles;
    }

    return articles.filter((article) => {
      const haystacks = [
        article.title,
        article.summary,
        article.body,
        article.sourceName,
        article.tags.join(' '),
      ];

      return haystacks.some((value) => normalize(value).includes(normalizedQuery));
    });
  }, [articles, query]);

  return (
    <section>
      <div className="mb-8">
        <label htmlFor="article-search" className="block text-xs font-semibold text-gray-500 mb-2">
          キーワード検索
        </label>
        <input
          id="article-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="タイトル・要約・本文・タグ・媒体名で検索"
          className="w-full rounded-none border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#14261F]"
        />
        <p className="mt-3 text-sm text-gray-500">
          {query ? `検索結果 ${filteredArticles.length}件` : `全${articles.length}件を表示`}
        </p>
      </div>

      {filteredArticles.length === 0 ? (
        <p className="text-gray-400">該当する記事がありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.articleId} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
