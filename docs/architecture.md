# Architecture

## System Overview

個人ブランドサイト兼AIニュース解説記事の検索・蓄積基盤。
Next.js 15+ (App Router) による静的サイト生成。DBを持たず、コンテンツは MDX ファイルで管理する。

## データフロー

```
[CortexFlow] → (MDXファイル出力) → [content/articles/]
                                           ↓
                                   [Next.js Build]
                                    (generateStaticParams)
                                           ↓
                               [Vercel Static Hosting]
                                           ↓
                               [Pagefind Index（検索）]
```

## ページ構成

| URL | ページ | 説明 |
|-----|--------|------|
| `/` | トップ | 最新記事一覧 + 自己紹介 |
| `/articles` | 記事一覧 | 全記事を日付降順 |
| `/articles/[slug]` | 記事詳細 | 個別記事 |
| `/tags/[tag]` | タグ一覧 | タグで絞り込み |
| `/categories/[cat]` | カテゴリー一覧 | カテゴリーで絞り込み |
| `/archive/[year]/[month]` | アーカイブ | 月別一覧 |
| `/search` | 検索 | Pagefind 検索 |
| `/about` | About | 経歴・発信テーマ |
| `/vision` | Vision | 医療AIで目指すこと |
| `/feed.xml` | RSS | フィード |

## Directory Structure Map

```text
.
├── app/                    # Next.js App Router
│   ├── articles/
│   │   ├── page.tsx        # 記事一覧
│   │   └── [slug]/
│   │       └── page.tsx    # 記事詳細
│   ├── tags/[tag]/page.tsx
│   ├── categories/[cat]/page.tsx
│   ├── archive/[year]/[month]/page.tsx
│   ├── search/page.tsx
│   ├── about/page.tsx
│   ├── vision/page.tsx
│   ├── layout.tsx
│   └── feed.xml/route.ts   # RSS Route Handler
├── content/
│   └── articles/           # MDXファイル置き場（CortexFlowから受け取る）
├── src/
│   ├── components/
│   │   ├── layout/         # Header, Footer, Navigation
│   │   └── article/        # ArticleCard, ArticleList, TagBadge
│   ├── lib/
│   │   └── articles.ts     # 記事取得ロジック
│   └── types/
│       └── article.ts      # 記事型定義
├── docs/                   # 設計文書
├── public/
└── CLAUDE.md
```

## 技術的判断メモ

- **静的生成優先**: Next.js の SSG を使い、ランタイムDBを持たない
- **Pagefind**: ビルド後のHTMLをインデックス化。サーバー不要で検索を実現
- **MDX**: 将来的にインタラクティブコンポーネントを埋め込める拡張性を確保
- **canonical**: HP を正本とし、note には canonical を付与する方針
- **CortexFlow連携**: 出力形式は `tech-stack.mdc` の記事スキーマに準拠（詳細は未確定）
