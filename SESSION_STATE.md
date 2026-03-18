# SESSION_STATE — 20260317_MyHomePage

> 最終更新: 2026-03-18

## 現在フェーズ

**Phase 4: コンテンツ仕上げ → デプロイ**

## 決定済み事項

### 企画方針
- **サイトの位置づけ**: 個人ブランドサイト兼、AI解説記事の検索・蓄積基盤
- **主目的**: note記事内の3本を、HPでは1本ずつ個別に見せて探しやすくする
- **媒体方針**: HPは個別記事の正本、noteは朝便/夜便のまとめ、XとSlackは既存運用維持
- **UIコンセプト**: 人物（医師）が主役の個人ブランドサイト。ニュースサイトではない
- **ブランドタグライン**: "Beyond Medicine. Beyond Imagination."

### 技術スタック（確定）
- Next.js 16.1.7 (App Router) + TypeScript + Tailwind CSS
- フォント: Noto Serif JP（知的・学術的な雰囲気）
- 検索: Pagefind（未実装）
- デプロイ: GitHub + Vercel

### デザイン（確定）
- アクセントカラー: **amber-700**（ティールから変更済み）
- カラー: ホワイト・グレー・ブラック (#0c0c0c)・amber-700
- レイアウト: max-w-7xl（ホームページ・記事一覧）、max-w-3xl（記事本文）
- h1/h2: letter-spacing: -0.02em

### 人物情報（確定）
- 名前: 池本毅
- 肩書き: 医師　MBA　AIビルダー（全ページ統一済み）
- note: https://note.com/entikemoto
- X: https://x.com/Ikemoto1966
- Slack: medai-co-lab（招待URL未取得）

### 記事データ契約（確定）
- CortexFlow2.0 の出力形式: JSON 配列（`content/articles/*.json`）
- `articleId`: `{date}_{edition}_{n}`（例: `2026-03-18_morning_1`）
- データソースは `HP_ARTICLES_DIR` 環境変数で切り替え可能

## 現在の状態

| 部品 | 状態 |
|------|------|
| ① 記事データ契約 | ✅ 完了 |
| ② 記事取り込み層 | ✅ 完了（Vitest 11件パス） |
| ③ 個別記事表示 | ✅ 完了 |
| ④ 一覧・アーカイブ導線 | ✅ 完了 |
| ⑤ ブランドページ群 | ✅ 完了 |
| ⑥ 媒体導線 | ✅ 完了 |
| UI リデザイン（luxury brand style） | ✅ 完了 |
| Publications ページ | ✅ 完了（書籍説明文は仮） |
| Lab ページ | ✅ 完了（Slack URL 未設定） |
| About ページ原稿 | 🔲 未完了（原稿待ち） |

## 実装済みルート

| URL | 内容 |
|-----|------|
| `/` | Brand Statement → Hero（名前+見出し） → 記事グリッド → Mission+Vision → CTA |
| `/articles` | 記事一覧（カードグリッド3列） |
| `/articles/[articleId]` | 個別記事（SSG） |
| `/articles/tag/[tag]` | タグ絞り込み（SSG） |
| `/articles/archive/[year]/[month]` | 月別アーカイブ（SSG） |
| `/publications` | Kindle本 6冊（3テーマ×日英ペア） |
| `/lab` | 医療AI共創ラボ紹介 |
| `/about` | プロフィール・Vision・発信媒体 |

## 次のアクション（優先順）

1. **書籍説明文の確定** — Publications ページの仮テキストをユーザー確認後に更新
2. **About ページ原稿** — 以下をユーザーが執筆
   - このサイトを訪れた人へのメッセージ（2〜3文）
   - 医師→AI/テックへの転換点エピソード（3〜5文）
3. **Slack 招待URL** — 取得できたら `/lab` の CTA に追加
4. **GitHub push** — リポジトリを作成して push
5. **Vercel デプロイ** — デプロイ後に本番 URL を確認
6. **HP_ARTICLES_DIR 連携** — CortexFlow2.0 の出力先に接続

## 関連プロジェクト

- `projects/20260222_CortexFlow2.0` — HP向け個別記事データ供給元
