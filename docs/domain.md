# My Home Page — ドメイン設計書

## 1. サービス定義

**My Home Page** は「個人ブランドサイト兼 AI 解説記事蓄積基盤」である。

- 毎日作成する AI ニュース解説記事を、1本ずつ独立して掲載・検索できるようにする
- 医療 AI 起業準備中の個人ブランドを伝える公式サイトとして機能させる
- 「ニュースメディア」ではなく「個人が運営するナレッジ蓄積型ブランドサイト」と定義する

## 2. コアエンティティ

### Article（個別記事）

最重要エンティティ。1本の AI ニュース解説を表す。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✅ | YYYYMMDD-連番-kebab-title |
| title | string | ✅ | 記事タイトル |
| publishedAt | string | ✅ | ISO 8601 |
| sourceUrl | string | ✅ | 元ニュース URL |
| summary | string | ✅ | 200字以内の要約 |
| commentary | string | ✅ | MDX 形式の解説 |
| tags | string[] | ✅ | タグ配列（空配列可） |
| category | Category | ✅ | 大分類 |
| dispatch | Dispatch? | - | 配信グループ（朝/夜） |
| draft | boolean | ✅ | 非公開フラグ |

### Category（カテゴリー）

`ai-news` | `medical-ai` | `column` | `profile`

将来追加可能。追加時はこのファイルと `docs/glossary.md` を更新する。

### Dispatch（配信グループ）

1日の記事を朝便（morning, 1〜3本）・夜便（evening, 1〜3本）に分類するメタデータ。
URL や正本の主キーには使わない。

## 3. ドメイン不変条件

1. Article は必ず `sourceUrl` を持つ（引用要件の遵守）
2. Article の `id` はリポジトリ内で一意
3. `draft: true` の Article は本番環境で非公開
4. HP は個別記事の正本。他媒体との重複掲載時は canonical を設定する

## 4. コンテンツ配信モデル

```
CortexFlow2.0（記事生成）
    ↓ 個別記事データ（MDX）
My Home Page（正本・永続化）
    ↓ まとめ（朝3本/夜3本）
note（配信）
    ↓ スニペット
X / Slack（既存チャネル）
```

**HP は受け取った個別記事データをそのまま掲載する。note 用まとめは CortexFlow2.0 側で生成する。**

## 5. ページ構成（MVP）

| パス | 内容 |
|------|------|
| `/` | トップ（最新記事 + プロフィール紹介） |
| `/articles` | 記事一覧（最新順） |
| `/articles/[id]` | 個別記事詳細 |
| `/tags/[tag]` | タグ別記事一覧 |
| `/categories/[category]` | カテゴリー別記事一覧 |
| `/archive/[year]/[month]` | 日付アーカイブ |
| `/search` | 検索結果ページ |
| `/about` | プロフィール |
| `/vision` | 医療 AI 領域での構想・ビジョン |

## 6. 将来の拡張ポイント

- `category: 'project'` で実績・プロジェクトページを追加
- `category: 'talk'` で講演・登壇情報を追加
- アクセス解析導入時にプライバシーポリシーページを追加
- 記事数増加後に Pagefind から外部検索サービスへ移行
