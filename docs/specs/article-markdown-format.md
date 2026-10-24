# 仕様: Markdown 記事（post 形式）

> 作成: 2026-10-24。要件: `docs/requirements/01-hp-renewal-2026-10.md`。合格基準: `evals/project.eval.md` EV-004〜006。
> 書き手は VaultPublisher（`~/Development/vault-publisher` の `hp_client`）。読み手は本リポジトリの `src/lib/articles.ts`。

## 動作

- `content/articles/<articleId>.md` を 1 記事 1 ファイルで置く。`articleId` はファイル名（拡張子なし）
- `articleId` の形: `YYYY-MM-DD-<ascii-slug>-<hash8>`（Dev Log と同じ規則。slug はタイトルの ASCII 化、4 文字未満なら `post`。hash はタイトルの sha256 先頭 8 桁）
- frontmatter（YAML）:

| 項目 | 必須 | 意味 |
|---|---|---|
| `title` | 必須 | 記事タイトル |
| `publishedAt` | 必須 | ISO 8601（例 `2026-10-24T09:00:00+09:00`） |
| `xUrl` | 任意 | X の Article 投稿 URL |
| `noteUrl` | 任意 | note の記事 URL |
| `sourceUrl` | 任意 | 元ニュースの URL（あれば「元記事」として表示） |
| `sourceName` | 任意 | 元媒体名。無ければ `X` |
| `tags` | 任意 | 文字列の配列 |
| `summary` | 任意 | 無ければ本文の最初の段落（120 字）を使う |
| `coverImage` | 任意 | サイト内パス（`/images/articles/...`）。`/` 始まり以外はエラー |
| `category` | 任意 | 無ければ `post` |
| `sourceProject` | 任意 | 生成元（`ai-news` など。表示しない） |

- 本文は軽量 Markdown（`src/lib/essay-markdown.ts` が解釈する範囲: 見出し・段落・リスト・引用・コード・水平線・**太字**・リンク）
- 読み込み結果は `HpArticle`（`format: 'post'`, `edition: 'standalone'`, `orderInEdition: 0`）に正規化し、旧 JSON 記事と同じ一覧・検索・タグ・月別に混在する

## 例外

- `title` 欠落・本文空・URL 形式不正・`coverImage` が `/` 始まりでない → ビルドエラー（黙って落とさない。旧 JSON の契約違反と同じ扱い）
- 同じ日に複数記事があってよい（旧 JSON の「日付＋便＋順序」での重複排除は post 形式に適用しない）

## 守る条件

- VaultPublisher は**新規ファイルの追加だけ**を行う。既存ファイルの変更・削除はしない（配信装置の安全弁を維持）
- 旧 JSON 記事の読み込みと検証は変えない

## やらないこと（範囲外）

- note からの取り込み（`import:note`）を新形式に変換すること
- 旧 JSON 記事の Markdown への変換

## 確定事項と仮定

- 確定: HP には全文を載せる（2026-10-24 オーナー決定）
- 仮定: `articleId` の規則は Dev Log と同じ。オーナーから別案があれば変更可（要件書 §5）

## 似た既存機能

- `content/essays/*.md`（`src/lib/essays.ts`）: 同じく frontmatter + Markdown。エッセイは手書き・本リポジトリに直接コミットする運用で、配信装置を通らない点が異なる
- `content/dev-diary/*.md`: Vault から同期スクリプトが生成する。slug の規則をここから借りた
