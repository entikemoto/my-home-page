---
title: "第3回 Tool Audit"
date: "2026-02-25"
summary: "調査方法: Gemini CLI + 実機テスト（env var 検証）"
tags:
  - claude-code
  - workflow
  - tool-audit
  - dev-env-log
vault_hp_sync: true
vault_sync_source: audit
---

調査方法: Gemini CLI + 実機テスト（env var 検証）

#### ツールバージョン（確認済み）
- Claude Code: v2.1.56
- Codex CLI: v0.104.0（変更なし）
- Gemini CLI: v0.29.5（変更なし）
- Cursor: v2.6.2

#### 重要検証: Agent Teams フック env var
- **結論: 未実装（v2.1.56 時点）**
- TeammateIdle フックは発火するが、`CLAUDE_TEAM_NAME` / `CLAUDE_TEAMMATE_NAME` / `CLAUDE_TASK_ID` は注入されない
- 実際に注入される変数: `CLAUDE_CODE_ENTRYPOINT`, `CLAUDE_PROJECT_DIR`, `CLAUDE_CODE_SSE_PORT`, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`, `CLAUDE_CODE_SUBAGENT_MODEL` のみ
- Gemini がサポート済みと報告したが**ハルシネーション**（バージョン番号も不正確だった）
- 次回 /tool-audit で再チェックすること（ユーザー依頼）

#### 発見・対応した変更
- **Gemini CLI `/plan` コマンド**: 実行前に計画を出力して承認を待つモード。検討: `/harden` スキルへの組み込み
- **Codex CLI `codex trace`**: 意思決定パスの可視化 TUI。検討: codex スキルに追記
- **Cursor v2.6.2 SKILL.md 対応**: Cursor エージェントが SKILL.md を自動認識。検討: プロジェクトテンプレートへの反映

#### 今回対応なし（次回再評価）
- Gemini 3.1 Pro プレビュー（GA後に評価）
- Cursor バックグラウンドサブエージェント（用途外）

#### 次回チェック目安: 2026-03-25（Agent Teams env var サポートを必ず確認）

## 履歴
