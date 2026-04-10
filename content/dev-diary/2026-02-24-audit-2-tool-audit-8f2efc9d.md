---
title: "第2回 Tool Audit"
date: "2026-02-24"
summary: "調査方法: Gemini CLI + Claude Code Web検索（クロスチェック）"
tags:
  - claude-code
  - workflow
  - tool-audit
  - dev-env-log
vault_hp_sync: true
vault_sync_source: audit
---

調査方法: Gemini CLI + Claude Code Web検索（クロスチェック）

#### ツールバージョン（確認済み）
- Claude Code: v2.1.50（最新）
- Codex CLI: v0.50.0 → **v0.104.0 にアップデート**（Rust 版）
- Gemini CLI: v0.29.5（最新）
- Cursor: 継続更新

#### 対応した変更
- **Codex CLI アップデート**: bun で v0.50.0 → v0.104.0 に更新。Rust リライト版、gpt-5.3-codex モデル使用
- **Gemini CLI 認証修正**: API キー → OAuth（oauth-personal）に切り替え。期限切れ問題を根本解決
- **Gemini モデル指定修正**: 全スキル・CLAUDE.md から `-m gemini-3-flash` を削除し、デフォルトモデル（Gemini 3 系）に統一。対象: CLAUDE.md, skills/gemini, skills/changelog, skills/harden, skills/tool-audit, templates/gemini-research

#### 検討（次回再評価）
- Gemini CLI の Plan Mode（/plan）を /harden のリサーチフェーズで活用するか
- Codex CLI の MCP 対応をツール連携で活用するか

#### 次回チェック目安: 2026-03-26
