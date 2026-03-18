# API コントラクト

## 概要

My Home Page は静的サイト（SSG）であり、ランタイム API は持たない。
コンテンツはビルド時にファイルシステムから読み込む。

## TypeScript インターフェース

```typescript
// types/article.ts

export type Category = 'ai-news' | 'medical-ai' | 'column' | 'profile';

export interface Dispatch {
  timing: 'morning' | 'evening';
  date: string;    // YYYY-MM-DD
  index: number;   // 1〜3
}

export interface Article {
  id: string;          // 例: "20260318-001-gpt5-release"
  title: string;
  publishedAt: string; // ISO 8601
  sourceUrl: string;   // 元ニュース URL（必須）
  summary: string;     // 200字以内推奨
  commentary: string;  // MDX 本文
  tags: string[];
  category: Category;
  dispatch?: Dispatch;
  draft: boolean;
}

// 一覧表示用（本文省略）
export type ArticleMeta = Omit<Article, 'commentary'>;
```

## コンテンツ取得関数

```typescript
// lib/articles.ts

/** 全記事を最新順で取得（draft は本番環境では除外） */
export async function getAllArticles(): Promise<ArticleMeta[]>

/** ID で1記事を取得 */
export async function getArticleById(id: string): Promise<Article | null>

/** タグで絞り込み */
export async function getArticlesByTag(tag: string): Promise<ArticleMeta[]>

/** カテゴリーで絞り込み */
export async function getArticlesByCategory(category: Category): Promise<ArticleMeta[]>

/** 年月で絞り込み（アーカイブ用） */
export async function getArticlesByMonth(year: number, month: number): Promise<ArticleMeta[]>

/** 全タグと件数を取得 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]>
```

## ファイル構造

```
content/
  articles/
    2026/
      03/
        20260318-001-gpt5-release.mdx
        20260318-002-anthropic-update.mdx
      04/
        ...
```

## フロントマター仕様

```yaml
---
id: "20260318-001-gpt5-release"           # 必須: YYYYMMDD-連番-kebab-title
title: "GPT-5リリース：何が変わったか"      # 必須
publishedAt: "2026-03-18T06:00:00+09:00"  # 必須: ISO 8601
sourceUrl: "https://openai.com/blog/gpt-5" # 必須
summary: "OpenAI が GPT-5 を公開。..."     # 必須: 200字以内推奨
tags: ["GPT-5", "OpenAI", "LLM"]          # 必須（空配列可）
category: "ai-news"                        # 必須: 規定値のみ
dispatch:                                   # 任意
  timing: "morning"
  date: "2026-03-18"
  index: 1
draft: false                               # 必須
---

（ここから MDX 本文 = commentary）
```

## バリデーションルール

ビルド時に以下を検証し、違反があればエラーを出して公開を阻止する。

| ルール | エラーメッセージ例 |
|--------|------------------|
| `id` が一意 | `Duplicate article id: 20260318-001-xxx` |
| `sourceUrl` が有効な URL | `[20260318-001] sourceUrl is required and must be a valid URL` |
| `category` が規定値 | `[20260318-001] Invalid category: "xxx"` |
| `publishedAt` が ISO 8601 | `[20260318-001] Invalid publishedAt format` |

## 検索インターフェース（初期: Pagefind）

```typescript
// 検索は Pagefind がビルド時に生成するインデックスを使う
// クライアントサイドで動作し、サーバーエンドポイント不要

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  url: string;
  tags: string[];
  publishedAt: string;
}
```

検索対象: `title`, `summary`, `tags`（`commentary` はオプション）

## RSS フィード

- エンドポイント: `/feed.xml`
- 形式: RSS 2.0
- 件数: 最新 30 件
- 生成: ビルド時に静的ファイルとして出力
