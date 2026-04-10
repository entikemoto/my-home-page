---
title: "第8回 Tool Audit"
date: "2026-04-03"
summary: "調査方法: Gemini CLI + Haiku サブエージェント（GitHub リリースページ直接確認）+ 実機バージョン確認"
tags:
  - claude-code
  - workflow
  - tool-audit
  - dev-env-log
vault_hp_sync: true
vault_sync_source: audit
---

調査方法: Gemini CLI + Haiku サブエージェント（GitHub リリースページ直接確認）+ 実機バージョン確認

#### ツールバージョン（確認済み）
- Claude Code: v2.1.84（native）/ v2.1.91（npm）— **新ターミナルで `claude update` 実行が必要**
- Codex CLI: v0.116.0 → **v0.118.0 に更新完了**（`bun install -g @openai/codex`）
- Gemini CLI: v0.35.1 → v0.36.0 — **手動で `sudo npm update -g @google/gemini-cli` が必要**
- Cursor: 未確認（実機なし）

#### 発見・対応した変更

**Claude Code v2.1.84〜v2.1.91**
- `TaskCreated` フック追加（v2.1.84）: タスク作成時に発火する新フック
- `PreToolUse` の `"defer"` 権限（v2.1.89）: フックが権限判断を遅延できる
- `PermissionDenied` フック追加（v2.1.89）: auto mode の拒否時に発火
- `/powerup` コマンド（v2.1.90）: インタラクティブレッスン
- MCP ツール結果の永続化上限 500K（v2.1.91）
- `disableSkillShellExecution` 設定追加（v2.1.91）

**Codex CLI v0.118.0（3/31）**
- Windows サンドボックス（OS レベル egress ルール）
- `codex exec` がプロンプト + stdin ワークフロー対応
→ **更新完了**（`bun install -g @openai/codex`）

**Gemini CLI v0.36.0（4/1）**
- Git worktree 統合（並列セッション対応）
- サブエージェント機能・マルチレジストリ対応
- Windows サンドボックス
→ **手動更新が必要**（sudo npm update）

#### ハルシネーション記録（Gemini CLI 今回）
- v2.1.88 ソースマップ漏洩: 公式 changelog に記載なし
- Parallel Tool Execution GA: v0.36.0 では未確認
- GPT-5.3-Codex 廃止: 公式記載なし
- Cursor 3.0 メジャーリリース: 未確認

#### 今回対応なし（次回再評価）
- `TaskCreated` フック活用: タスク作成ログへの活用を検討
- `PermissionDenied` フック活用: auto mode の拒否ログ・リトライ
- Gemini CLI worktree 統合: 並列リサーチ委譲時の活用

#### 次回チェック目安: 2026-05-03

---
