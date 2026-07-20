# PLAN — プロジェクト進捗・ゲート管理

> このファイルは、プロジェクトの「現在地」と「次のステップ」を一覧するための軽量なポインタです。
> 詳細な進捗情報・履歴・ブロッカーは下記のドキュメントが正本です。

## 主要な正本ドキュメント

| ドキュメント | 内容 | 最終更新 |
|---|---|---|
| **`docs/project-status.md`** | Phase・現在フェーズの定義・Next Actions・Blockers | 2026-03-18 |
| **`docs/development-progress.md`** | 部品ごとの進捗・作業履歴・マイルストーン | 2026-04-11 |

👉 **現在の状況を知りたい**: `docs/project-status.md` または `docs/development-progress.md` を参照してください

---

## 現在地（簡易版）

### 現在フェーズ
**Phase 4: デプロイ・本番化**

### 完了した部品
- ✅ ① 記事データ契約
- ✅ ② 記事取り込み層
- ✅ ③ 個別記事表示
- ✅ ④ 一覧・アーカイブ導線
- ✅ ⑤ ブランドページ群
- ✅ ⑥ 媒体導線

### 次の3アクション
1. **GitHub リポジトリに push する** → 実装完了した content・app・src/ を反映
2. **Vercel にデプロイする** → ステージング環境で動作確認
3. **HP_ARTICLES_DIR を CortexFlow2.0 の出力先に接続** → 記事自動同期を開始

### 決定ログ

| 日付 | 決定 | 理由 |
|------|------|------|
| 2026-04-11 | Vercel build 失敗の原因分析・過剰なSSG生成削減 | `articles/tag/[tag]` と `articles/[articleId]` の事前生成で時間超過。`dev-diary` を動的生成に戻す |
| 2026-03-18 | CortexFlow2.0 連携方式の確定 | 記事データは JSON 配列形式で受け取り、Next.js ビルド時に `lib/articles.ts` で整形・キャッシュ |
| 2026-03-18 | ブランドページ群の実装 | About / Vision ページでプロフィール・医療AI思想を表現。媒体導線（note・X・Slack）は Footer に統一 |

---

## ドキュメント整備状況

| ドキュメント | 状態 | 説明 |
|---|---|---|
| `docs/service-overview.md` | ✅ APPROVED | 要件定義・サービス概要 |
| `docs/business-flow.md` | ✅ APPROVED | 業務フロー・自動化範囲（新規作成） |
| `docs/business-and-system-overview.md` | ✅ APPROVED | 仕様書：部品分解・依存関係・データ設計 |
| `docs/architecture.md` | ✅ APPROVED | 技術スタックと採用理由（増強） |
| `CLAUDE.md` | ✅ 更新済み | 重要ドキュメント表を反映 |

---

## 関連ドキュメント

- [`docs/service-overview.md`](docs/service-overview.md) — 要件定義・サービス概要（APPROVED）
- [`docs/business-flow.md`](docs/business-flow.md) — 業務フロー・自動化範囲（Before/After）
- [`docs/business-and-system-overview.md`](docs/business-and-system-overview.md) — 仕様書（APPROVED）
- [`docs/architecture.md`](docs/architecture.md) — 技術スタックと採用理由
- [`CLAUDE.md`](CLAUDE.md) — プロジェクト指示書
