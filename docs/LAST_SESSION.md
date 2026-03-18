# LAST_SESSION

> 保存日時: 2026-03-18 14:50

## 作業したプロジェクト
- `projects/20260317_MyHomePage` — Next.js ホームページ MVP 全6部品を実装・GitHub push 完了

## 完了した作業
- Next.js 16.1.7 初期化（App Router + TypeScript + Tailwind + src/ 構造）
- ② 記事取り込み層: `src/types/article.ts`（HpArticle型）+ `src/lib/articles.ts`（6種クエリ）+ Vitest 11件テスト全パス
- ③ 個別記事表示: `/articles/[articleId]`（SSG・OGP・出典URL・医療免責）
- ④ 一覧・アーカイブ導線: `/articles`（全件一覧+タグ/月別サイドバー）、`/articles/tag/[tag]`、`/articles/archive/[year]/[month]`
- ⑤ ブランドページ: `/about`（Vision/Profile/発信媒体）+ トップページ + グローバルナビ `Header`
- ⑥ 媒体導線: `Footer`（note/X/Slackリンク）全ページ共通
- バグ修正: `[articleId]` と `[year]` の動的ルート衝突 → 月別を `/articles/archive/` に移動
- GitHub リポジトリ作成・push: https://github.com/entikemoto/my-home-page

## 未完了・次のアクション
1. **Vercel デプロイ** — https://vercel.com で `my-home-page` リポジトリを選択しデプロイ（設定デフォルトのまま）
2. **CortexFlow2.0 連携** — 記事JSONを `content/articles/` にコピーして `git push` → Vercel が自動ビルド（A案: 手動push）
3. **独自ドメイン設定**（任意）— Vercel の Settings > Domains でドメインを設定
4. **Slack 招待URL取得** — `medai-co-lab` の招待リンクが取れたら About・Footer にリンクを追加

## メモ
- 記事データソースは `HP_ARTICLES_DIR` 環境変数で切り替え可能（デフォルト: `content/articles/`）
- フィクスチャ記事 2本が `content/articles/2026-03-18_morning.json` にある（テスト兼サンプル）
- Slack は招待URLがないため現在はテキスト表示のみ
- 開発サーバーが起動中（`http://localhost:3000`）。確認後は `pkill -f "next dev"` で停止
- `tsconfig.tsbuildinfo` は `.gitignore` への追加を検討（ビルドキャッシュ）
