# アーキテクチャ設計書（技術スタックと採用理由）

> 目的：エンジニアが「何の技術を、何のために、なぜ選んだか」を数分で把握できるようにする。
> 出典：`CLAUDE.md` の Tech Stack・Key Constraints、`docs/business-and-system-overview.md` の機能要件・非機能要件。推測は含めない。

## 0. Status
- Status: APPROVED

---

## 1. 技術スタック一覧

| レイヤー | 技術 | その役割 | 採用理由 |
|---|---|---|---|
| Core | Next.js 15+ (App Router) | 静的サイト生成・ページ構成・ビルド最適化 | `service-overview.md` 「パフォーマンス: LCP 2.5秒未満」「静的構成」から SSG の採用が必須。App Router は Next.js 最新の標準ルーティング |
| 言語・型 | TypeScript | 型安全・開発効率・保守性確保 | 個別記事ページ・一覧・タグ・アーカイブなど複数ページで同じデータ型を共有するため、型チェックで実装ミスを事前検出 |
| スタイリング | Tailwind CSS | UI 実装・カスタマイズ・動作削減 | `CLAUDE.md` 「動き控えめ、読みやすさ優先」に合致。ユーティリティファーストで細かいカスタマイズに対応しやすく、バンドルサイズを最小化 |
| コンテンツ形式 | Markdown / MDX | 記事本文・ブランドページ管理 | CortexFlow2.0 の出力形式が Markdown。MDX を採用することで、将来的に記事内にインタラクティブコンポーネントを埋め込める拡張性を確保 |
| 検索・インデックス | Pagefind | 静的サイト内の全文検索 | サーバーサイド検索エンジン（Elasticsearch 等）を持たずに検索機能を実現。ビルド後 HTML をインデックス化し、クライアント側での軽量検索を実現 |
| RSS・Feed | 標準 RSS 形式 | フィード購読・配信 | 長期に渡る記事蓄積を活かし、読者が購読リーダーで自動追跡できる環境を提供。SEO・外部連携の価値向上 |
| OGP・Meta | Next.js Metadata API | SNS 共有・検索結果表示の最適化 | 個別記事ページを X / note で共有されたとき、タイトル・要約・画像が自動展開される。読者流入を最大化 |
| 配信基盤 | GitHub + Vercel | ソース管理・CI/CD・ホスティング | デプロイ自動化（Git push → Vercel build → 公開）。静的サイトなのでホスティングコスト最小化。CDN 経由で高速配信 |
| テスト | Vitest + Playwright | ユニット・統合テスト・UI テスト | 記事一覧・詳細表示・タグフィルタ・検索など読者向け機能が期待通り動くことを担保。Lighthouse 90点以上の基準も自動化 |
| Lint・フォーマット | ESLint + Prettier | コード品質・スタイル統一 | チーム開発時（将来的に他の開発者が参画する場合）の保守性確保。CI で自動チェック |

---

## 2. 外部連携先と認証方式

| 連携先 | 用途 | 認証 | 採用理由/制約 |
|---|---|---|---|
| CortexFlow2.0（同ホスト） | 個別記事データ取得（JSON） | ファイルシステムアクセス | 記事データは CortexFlow の出力物（`output/digest/hp_articles/*.json`）を読む。ローカル Vault 環境で実行時のみ再生成可能 |
| note（外部） | まとめ記事リンク | 手動 URL 記載 | HP の記事詳細ページから note のまとめ記事へのリンク。リンク切れを避けるため手動管理 |
| X・Slack（外部） | 読者流入・導線 | 手動 URL 記載 | Footer と About ページ内に各媒体へのリンク。自動連携は行わない（著者が手動制御） |
| Vercel Deploy Hooks（CI/CD） | note 投稿後 HP 自動反映 | Webhook URL（環境変数） | CortexFlow2.0 が note 投稿後に Hook 叩く → Vercel が新記事を検知してビルド・デプロイ（Phase 2 で実装予定） |

---

## 3. システムの設計原則

### 3.1 静的サイト構成の採用
- **サーバーサイドの攻撃面を最小化**（`CLAUDE.md` Key Constraints）
- **スケーラビリティ**: ユーザー数増加・記事蓄積に伴うコスト増加がない
- **可用性**: CDN キャッシュにより障害耐性が高い

### 3.2 データの正本管理
- **HP = 個別記事の正本**（`service-overview.md` 情報設計の原則）
- note は朝便・夜便のまとめ記事、X / Slack は配信導線
- 記事を後から探しやすくすることを最優先（`service-overview.md` 成功指標）

### 3.3 コンテンツ・データの管理
- **記事データ形式**: JSON（構造化）+ Markdown（本文）
- **CortexFlow との連携**: HP は CortexFlow の出力を読む（article data contract）
- **変更・拡張**: 新しいメタデータ項目は `docs/business-and-system-overview.md` に記載後、`src/types/article.ts` に反映

---

## 4. データフロー

```
[CortexFlow2.0] 
    ↓ (JSON出力: hp_articles/*.json + note投稿)
[Vercel Deploy Hook] （note投稿後に自動トリガー）
    ↓
[Next.js SSG Build] (generateStaticParams で全ページ事前生成)
    ↓
[Vercel Static Hosting] (CDN配信)
    ↓
[Pagefind Index] （ビルド時に検索インデックス生成）
```

---

## 5. ページ構成

| URL | ページ | 説明 | 対応部品（business-and-system-overview.md） |
|-----|--------|------|----|
| `/` | トップ | 最新記事一覧 + 自己紹介 | ③ / ④ / ⑤ |
| `/articles` | 記事一覧 | 全記事を日付降順・キーワード検索 | ④ 一覧・アーカイブ導線 |
| `/articles/[slug]` | 記事詳細 | 個別記事（タイトル・本文・タグ・OGP） | ③ 個別記事表示 |
| `/tags/[tag]` | タグ一覧 | タグで絞り込み | ④ 一覧・アーカイブ導線 |
| `/categories/[cat]` | カテゴリー一覧 | カテゴリーで絞り込み | ④ 一覧・アーカイブ導線 |
| `/archive/[year]/[month]` | アーカイブ | 月別一覧 | ④ 一覧・アーカイブ導線 |
| `/search` | 検索 | Pagefind 検索（タイトル・本文・タグ対応） | ④ 一覧・アーカイブ導線 |
| `/about` | About | 経歴・発信テーマ・媒体導線 | ⑤ ブランドページ群 |
| `/vision` | Vision | 医療AIで目指すこと | ⑤ ブランドページ群 |
| `/feed.xml` | RSS | フィード | ④ 一覧・アーカイブ導線 |

---

## 6. Directory Structure Map

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

## 7. 技術的判断メモ

| 判断 | 理由 | 対応ドキュメント |
|------|------|-----------------|
| **静的生成優先** | Next.js の SSG を使い、ランタイム DB を持たない。スケーラビリティ・可用性を確保 | `service-overview.md` §7 制約・非機能要件 |
| **Pagefind** | ビルド後 HTML をインデックス化。サーバーレス検索で運用コスト最小化 | `docs/business-flow.md` A3 一覧・タグ・日付 |
| **MDX形式** | 将来的にインタラクティブコンポーネントを埋め込める拡張性を確保 | `service-overview.md` §8 技術スタック |
| **canonical タグ** | HP を正本とし、note には canonical を付与する方針。二重コンテンツペナルティを回避 | `service-overview.md` §7 制約・非機能要件 |
| **CortexFlow 連携** | 記事データ形式は `docs/business-and-system-overview.md` §4〜5 の Article Data Contract に準拠 | `docs/business-and-system-overview.md` |

---

## 関連ドキュメント
- `docs/business-flow.md` — 業務フロー・自動化範囲（Before/After）
- `docs/business-and-system-overview.md` — 仕様書：部品分解・依存関係・データ設計
- `docs/service-overview.md` — サービス概要（要件定義・対象ユーザー・KPI）
- `CLAUDE.md` — 技術スタック（本書の一次ソース）
