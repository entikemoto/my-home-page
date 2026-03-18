# SESSION_STATE — 20260317_MyHomePage

> 最終更新: 2026-03-18

## 現在フェーズ

**Phase 4: デプロイ・本番化**

## 決定済み事項

### 企画方針
- **サイトの位置づけ**: 個人ブランドサイト兼、AI解説記事の検索・蓄積基盤
- **主目的**: note記事内の3本を、HPでは1本ずつ個別に見せて探しやすくする
- **媒体方針**: HPは個別記事の正本、noteは朝便/夜便のまとめ、XとSlackは既存運用維持
- **UIコンセプト**: 人物（医師）が主役の個人ブランドサイト。ニュースサイトではない

### 技術スタック（確定）
- Next.js 16.1.7 (App Router) + TypeScript + Tailwind CSS
- フォント: Noto Serif JP（知的・学術的な雰囲気）
- 検索: Pagefind（未実装）
- デプロイ: GitHub + Vercel

### デザイン（確定）
- 参考: はじめ研究所（hajime-institute）スタイル
- カラー: ホワイト・グレー・ダークネイビー（#1a3357）・ティール（アクセント）
- レイアウト: max-w-7xl（ホームページ・記事一覧）、max-w-3xl（記事本文）

### 記事データ契約（確定）
- CortexFlow2.0 の出力形式: JSON 配列（`content/articles/*.json`）
- `articleId`: `{date}_{edition}_{n}`（例: `2026-03-18_morning_1`）
- `publishedAt`: ISO 8601 形式
- 全必須フィールド: `articleId`, `title`, `publishedAt`, `edition`, `orderInEdition`, `originalSourceUrl`, `sourceName`, `summary`, `body`, `tags`, `category`, `noteArticleUrl`
- データソースは `HP_ARTICLES_DIR` 環境変数で切り替え可能

### 発信媒体（確定）
- note: https://note.com/entikemoto
- X: https://x.com/Ikemoto1966
- Slack: medai-co-lab（招待URL未取得）

## 現在の状態

| 部品 | 状態 |
|------|------|
| ① 記事データ契約 | ✅ 完了 |
| ② 記事取り込み層 | ✅ 完了（Vitest 11件パス） |
| ③ 個別記事表示 | ✅ 完了 |
| ④ 一覧・アーカイブ導線 | ✅ 完了 |
| ⑤ ブランドページ群 | ✅ 完了 |
| ⑥ 媒体導線 | ✅ 完了 |
| UI リデザイン | ✅ 完了（個人ブランドサイトスタイル） |

- GitHub: https://github.com/entikemoto/my-home-page（push 予定）
- Vercel: 未デプロイ

## 実装済みルート

| URL | 内容 |
|-----|------|
| `/` | トップページ（6セクション：Hero / DarkMission / 記事グリッド / Profile / Vision / CTA） |
| `/about` | 2カラムヒーロー / Vision引用 / プロフィール詳細 / 発信媒体 |
| `/articles` | 記事一覧（カードグリッド3列＋タグ/月別サイドバー） |
| `/articles/[articleId]` | 個別記事（SSG） |
| `/articles/tag/[tag]` | タグ絞り込み（SSG） |
| `/articles/archive/[year]/[month]` | 月別アーカイブ（SSG） |

## 次のアクション（優先順）

1. **git commit + push** — 今回の UI リデザインをリモートに反映
2. **Vercel デプロイ** — https://vercel.com で `my-home-page` を選択 → デプロイ（設定デフォルトでOK）
3. **写真の差し替え** — About・Home の丸いプレースホルダーに実際の写真を配置
4. **CortexFlow2.0 連携** — 記事JSONを `content/articles/` にコピーして `git push`
5. **Slack 招待URL** — 取得できたら Footer・About にリンクを追加
6. **Pagefind 検索**（任意）— ビルド後インデックス生成

## 関連プロジェクト

- `projects/20260222_CortexFlow2.0` — HP向け個別記事データ供給元
