# Project Status

> このファイルは **プロジェクトの「現在地」(State)** を管理します。  
> 会話履歴に頼らず、まずここを更新・参照してください。

## Summary

- **プロジェクト名**: My Home Page
- **Phase**: **Phase 5 — X 中心の書庫化と UI 刷新（2026-10-24 着手・プレビュー確認待ち）**
- **Last updated**: 2026-10-24
- **High-level goal**: 個人ブランドサイト兼、AI 解説記事の検索・蓄積基盤。
  X の Article として投稿した解説記事（note にも同じ内容）を、HP に全文で 1 本ずつ保存し、探せる書庫にする。

### 2026-10-24 の現在地（刷新・ブランチ `feat/hp-renewal-2026-10`）

| 観測 | 実測 | 根拠 |
|---|---|---|
| 記事の流入 | 2026-06-25 で停止していた（配信装置の HP 係が一覧 1 行追記のみ） | `content/articles/` 最新日付・vault-publisher learnings 2026-10-24 |
| 対処 | Markdown 記事形式（post）を追加。配信装置 `hp_client.publish_article` が記事 md を 1 本新規追加＋一覧 1 行 | `docs/specs/article-markdown-format.md`・vault-publisher `tests/test_clients.py::TestHpArticlePublish` |
| 過去記事 | 375 本に X 投稿 URL を付与（記事生成側の配信記録から） | `content/articles/x-links.json` |
| UI | 記事ページ（X/note 導線・目次・前後・関連）・一覧（24 件ずつ）・トップ・フッターを刷新。明朝・英語ナビ・トップの濃緑帯は従来どおり（オーナー判断）。タイトル上の種別ラベル（AI Daily Digest 朝便／note 記事）と旧要約の挨拶文は表示から外した | `src/app/`・`src/components/`・`src/lib/articles.ts` |
| 認知の土台 | sitemap / robots / feed.xml / 記事ごとの OGP 画像 | EV-006 |
| 依存 | next 16.4.3（critical 2 件・high 1 件を解消。main に push 済み・Vercel success 10/24 07:05） | `4fb64e6` |
| テスト | 6 files / 35 tests（vitest）・`npm run build` exit 0（30 ルート） | `npm test` |

**次のアクション（Phase 5）**

1. オーナーが Vercel プレビュー URL で新 UI を確認し、PR をマージ（マージで本番反映）
2. 配信装置の変更（vault-publisher ブランチ `feat/hp-article-publish`）を Fugu レビューのうえ main へ
3. 初回の実記事 1 本を配信装置経由で流し、HP に記事ページが出ることと Vercel success を確認（EV-004 の本番実測）
4. 要件書 §2 の後回し: Pagefind・アクセス計測（Vercel Analytics の有効化はダッシュボード操作）・カスタムドメイン・英語版

> 以下は 2026-08-17 時点の記録（歴史的参照）。

> **2026-08-17 の訂正**: このファイルは 2026-03-18 の「Phase 1・アプリ実装は未着手」のまま
> 5 か月放置されていた。実際には Phase 4 まで到達し本番稼働している。以下は実物の測定値。

### 実測（2026-08-17 時点）

| 観測 | 実測値 | 根拠 |
|---|---|---|
| 実装 | Next.js App Router で 9 セクション稼働（about / articles / dev-diary / essays / lab / posts / publications / talks / youtube） | `src/app/` |
| 記事データ | 219 件 | `content/articles/` |
| テスト | 2 files / 16 tests pass | `npm test`（vitest） |
| 取り込み経路 | `npm run import:note`（prebuild で自動実行）・`npm run sync:dev-log` | `package.json` |
| デプロイ | Vercel（`.vercel/project.json` あり）。本番化は 2026-07-05 に完了 | vault `SESSION_STATE.md` |
| 直近の実作業 | 2026-08-08 の分業型移行（第9号）・eval 台帳新設。2026-08-17 に BP点検対応 | `git log` |

## Current Objectives

- [x] ① 記事データ契約 〜 ④ 一覧アーカイブ導線（Phase 1〜3）
- [x] Phase 4 デプロイ・本番化（2026-07-05 完了。`/posts` 公開・PR #1）
- [ ] EV-001（`npm run build` のローカル実行）の実測を確定する — 現在「保留」のまま
- [ ] EV-002（`/dev-log` 経由の日誌が新パス `content/` に着地する）を次回実行時に確認する
- [ ] `deep_dive` 記事の生成側（CortexFlow 2.0）が `edition` を設定していない可能性の確認（vault SESSION_STATE の残課題）

## Next Actions (Top 5)

1. eval の実測を埋める（EV-001 / EV-002 がどちらも未確定のままでは、合否ゲートとして機能しない）
2. `deep_dive` の `edition` 未設定疑いを生成側で確認する（2026-06-24 に本番が edition:null で全滅した事故の再発源）
3. `docs/known-issues.md` の「ローカル `next build` が 17 ルート以上で静的生成停止」を、
   環境問題として確定するか回避策を入れるか決める
4. 未追跡ファイル（`src/app/articles/*.code-workspace` 等）の要否を判断して追跡 or 削除する
5. 状態文書の正本を一本化する（下記「状態文書の正本」参照）

## Blockers / Risks

- **ローカル `next build` が完走しない**（17 ルート以上で静的生成が停止）。
  検証は「vitest + tsc + Vercel プレビュー」で行う運用。`docs/known-issues.md` に記録済み
- 記事の `edition` 欠落が本番表示を全滅させた前例がある（2026-06-24〜07-05）。生成側の契約が守られているかは HP 側からは見えない

## 状態文書の正本（2026-08-17 整理）

3 か所に現在地の記述があり、互いに矛盾していた:

| 場所 | 記載 | 状態 |
|---|---|---|
| `docs/project-status.md`（このファイル） | Phase 1・2026-03-18 | **本ファイルで訂正済み。コード側の現在地はここを正本とする** |
| vault `docs/development-progress.md` | Phase 4・2026-04-11 | 部品単位の進捗マップ。日付が古い（vault 側で更新が必要） |
| vault `SESSION_STATE.md` | Phase 4 完了・2026-07-05 | 企画・決定事項の正本 |

**運用**: コード側の「現在どこまで動いているか」は本ファイル、企画・決定事項は vault 側 `SESSION_STATE.md`。
食い違ったら `git log` と現物（`src/app/`・テスト結果）の実測を正とする。

## Operational Commands

```bash
npm run dev            # 開発サーバ
npm test               # vitest（2 files / 16 tests）
npm run lint           # eslint
npm run import:note    # note 記事の取り込み（prebuild で自動実行）
npm run sync:dev-log   # 開発日誌の同期
npm run build          # 本番ビルド（ローカルは静的生成が停滞する既知問題あり）
```

## Recent Logs

- 2026-03-18: `service-overview.md` を現在の方針に合わせて修正・承認
- 2026-03-18: 暴走再発防止のガードを `methods` とプロジェクトに追加
- 2026-03-18: 方針から外れた Next.js 実装・ビルド生成物を削除し、設計土台のみ残す状態へ戻した
- 2026-03-18: `business-and-system-overview.md` を現在方針で承認し、`development-progress.md` を整合させた
- 2026-03-18: CortexFlow2.0 の HP向け出力形式を確認。① 記事データ契約を確定。Phase 1 へ移行
