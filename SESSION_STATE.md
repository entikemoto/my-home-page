# SESSION_STATE — 20260317_MyHomePage

> 最終更新: 2026-03-18

## 現在フェーズ

**Phase 1: データ契約と取り込み**

## 決定済み事項

### 企画方針
- **サイトの位置づけ**: 個人ブランドサイト兼、AI解説記事の検索・蓄積基盤
- **主目的**: note記事内の3本を、HPでは1本ずつ個別に見せて探しやすくする
- **媒体方針**: HPは個別記事の正本、noteは朝便/夜便のまとめ、XとSlackは既存運用維持

### ① 記事データ契約（完了）
- CortexFlow2.0 の出力形式: JSON 配列（`output/digest/hp_articles/*.json`）
- `articleId`: `{date}_{edition}_{n}`（例: `2026-03-18_morning_1`）
- `publishedAt`: UTC midnight ISO 形式
- `noteArticleUrl`: 空文字列スタート、note 公開後に自動パッチされる
- 全必須フィールド: `articleId`, `title`, `publishedAt`, `edition`, `orderInEdition`, `originalSourceUrl`, `sourceName`, `summary`, `body`, `tags`, `category`, `noteArticleUrl`

### 技術スタック（確定）
- Next.js 15+ (App Router) + TypeScript + Tailwind CSS
- 検索: Pagefind（静的検索）
- デプロイ: GitHub + Vercel

## 現在の状態
- 土台ファイル一式（CLAUDE.md、docs/、.cursor/rules/、.claude/）は整備済み
- Next.js アプリ本体は未初期化（`public/` の SVG のみ残存）
- ① 記事データ契約: APPROVED・確定済み
- ② 記事取り込み層: 着手許可済み、Next.js 初期化待ち

## 未確定事項（次セッションで決める）

- [ ] Next.js を `20260317_MyHomePage/` 内に直接作成してよいか（ユーザー確認待ち）

## 次のアクション（優先順）

1. **Next.js 初期化の場所確認** → ユーザーに Yes/No を確認
2. **Next.js 初期化** — `npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --use-npm`
3. **② 記事取り込み層の実装**
   - `src/lib/articles.ts`: `HpArticle` 型 + `getArticles()` / `getArticle(id)` / `getArticlesByTag(tag)`
   - Vitest でユニットテスト
4. ② 完了後: ③ 個別記事表示・④ 一覧アーカイブ導線

## 関連プロジェクト

- `projects/20260222_CortexFlow2.0` — HP向け個別記事データ供給元（実装済み、commit `9486843`）
