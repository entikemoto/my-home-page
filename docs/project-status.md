# Project Status

> このファイルは **プロジェクトの「現在地」(State)** を管理します。  
> 会話履歴に頼らず、まずここを更新・参照してください。

## Summary

- **プロジェクト名**: My Home Page
- **Phase**: Phase 1 — データ契約と取り込み
- **Last updated**: 2026-03-18
- **High-level goal**: CortexFlow2.0 が出力した個別記事データを HP で読み込み、一覧・詳細表示に使える形へ整える。

## Current Objectives

- [x] サービス概要（ドメイン前提）の承認
- [x] 共通ルール・ドキュメントの生成
- [x] `full` による土台生成
- [x] `claude_orchestra_lite` の適用
- [x] 暴走再発防止のガード追加
- [x] `docs/business-and-system-overview.md` を、実プロジェクト内容で埋めて承認
- [x] `docs/development-progress.md` を、実際の部品とフェーズで更新
- [x] CortexFlow2.0 の HP向け出力形式を確認・① 記事データ契約を確定
- [ ] ② 記事取り込み層を実装する

## Next Actions (Top 5)

1. **② 記事取り込み層** の実装（ユーザーの明示許可後）
   - `output/digest/hp_articles/*.json` を読み込む TypeScript 関数
   - 一覧用データ整形・バリデーション
2. `⑤ ブランドページ群の情報設計` を詰める（並行可）
3. ② 完了後、③ 個別記事表示・④ 一覧アーカイブ導線へ進む

## Blockers / Risks

- ② `docs/` が揃えば実装開始可能（`続けてください` でも進む）

## Operational Commands

- まだアプリ実装は未着手のため、アプリ用コマンドは未定
- 先に `docs/business-and-system-overview.md` と `docs/development-progress.md` を整備する

## Recent Logs

- 2026-03-18: `service-overview.md` を現在の方針に合わせて修正・承認
- 2026-03-18: 暴走再発防止のガードを `methods` とプロジェクトに追加
- 2026-03-18: 方針から外れた Next.js 実装・ビルド生成物を削除し、設計土台のみ残す状態へ戻した
- 2026-03-18: `business-and-system-overview.md` を現在方針で承認し、`development-progress.md` を整合させた
- 2026-03-18: CortexFlow2.0 の HP向け出力形式を確認。① 記事データ契約を確定。Phase 1 へ移行
