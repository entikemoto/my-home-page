---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-04-16"
summary: "- 変わったこと: PreCompact hook にコンパクションブロック機能を追加、セキュリティレビュー自律呼び出しルールを CLAUDE.md に追加、Push notification と /recap を便利コマンド表に追記した。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: PreCompact hook にコンパクションブロック機能を追加、セキュリティレビュー自律呼び出しルールを CLAUDE.md に追加、Push notification と /recap を便利コマンド表に追記した。
- **いままでとの違い**: 保存が失敗したままコンパクションが走ってしまうリスクがあった。セキュリティレビューも手動呼び出し頼みだった。
- **メリット**: セッション引き継ぎの信頼性が上がり、セキュリティチェックが自動化される。

- 実行時バージョン: **v2.1.110**（前回 v2.1.101 から更新済み）
- 調査範囲: v2.1.102〜v2.1.110（GitHub Releases 直接取得）
- サブスク利用のため `ENABLE_PROMPT_CACHING_1H` は対象外

#### 発見した新機能と対応

- **PreCompact hook コンパクションブロック（exit 2）**: v2.1.105 — 判定: 即適用 — 対応: `auto-save-session.sh` に exit 2 分岐を追加
- **Skill ツールで built-in slash commands を自律呼び出し**: v2.1.108 — 判定: 即適用 — 対応: `CLAUDE.md` §5 にセキュリティレビュー自律呼び出しルールを追記
- **PushNotification ツール**: v2.1.110 — 判定: 検討 — 対応: `CLAUDE.md` 便利なコマンド表に追記（Remote Control 設定が必要）
- **`/recap` コマンド**: v2.1.108 — 判定: 検討 — 対応: `CLAUDE.md` 便利なコマンド表に追記
- **`ENABLE_PROMPT_CACHING_1H`**: v2.1.108 — 判定: 不要 — 対応: サブスク利用のため対象外
- **`/tui fullscreen`**: v2.1.110 — 判定: 不要 — 対応: UI の好みの問題

#### 適用した変更

- `_tools/hooks/auto-save-session.sh` — PreCompact 書き込み失敗時に exit 2 でコンパクションをブロック
- `CLAUDE.md` §5 コア原則 — セキュリティレビュー自律呼び出しルールを追記
- `CLAUDE.md` 便利なコマンド表 — PushNotification ツール・/recap を追記

#### 次回の最優先候補

- **Push notification の有効化** — Claude.ai Settings → Remote Control → "Push when Claude decides" をオンにする（手動設定）
- **Monitor ツールの実運用** — 長時間の待機や監視タスクで Monitor ツールを使ってみる
- hooks の `if` 条件フィルタを `.claude/settings.json` に適用（継続）
