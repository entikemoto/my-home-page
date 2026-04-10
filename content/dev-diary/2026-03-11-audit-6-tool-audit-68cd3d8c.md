---
title: "第6回 Tool Audit"
date: "2026-03-11"
summary: "- 変わったこと: AI の報告したバージョンと実機のズレを再確認し、GPT-5.4（Codex）の動作と Gemini のモデル切り替えの恩恵を記録した。"
tags:
  - claude-code
  - workflow
  - tool-audit
  - dev-env-log
vault_hp_sync: true
vault_sync_source: audit
---

### この回の要点（先に読む）

- **変わったこと**: AI の報告したバージョンと実機のズレを再確認し、GPT-5.4（Codex）の動作と Gemini のモデル切り替えの恩恵を記録した。
- **いままでとの違い**: 調査ツールが提示する番号をそのまま信じると誤認しやすい。
- **メリット**: 「実機で確認」を優先する運用が定着しやすい。

調査方法: Gemini CLI + 実機バージョン確認 + GPT-5.4 動作テスト

#### ツールバージョン（確認済み）
- Claude Code: v2.1.72（前回 v2.1.71）
- Codex CLI: v0.111.0（変更なし）
- Gemini CLI: v0.32.1（変更なし）
- Cursor: 未確認（実機なし）

#### 発見・対応

**Gemini CLI のバージョン誤報（v0.113.1, v0.32.2）を確認**
- Gemini が Codex v0.113.1、Gemini v0.32.2 と報告したが、`bun update` / `gemini --version` で否定
- 過去の誤報パターン（第4回: v0.30.0誤報等）と一致。引き続き実機確認を優先

**GPT-5.4 動作確認 ✓**
- `codex exec --skip-git-repo-check -m gpt-5.4 "..."` が v0.111.0 で正常動作
- エスカレーションラダー L2/L3（今回 CLAUDE.md に追加）の実動作を実証
- Gemini CLI sudo 更新は対話端末が必要なため手動実行が必要（`sudo npm update -g @google/gemini-cli`）

**Gemini 3.1 Pro（3/9更新）の恩恵**
- v0.32.1 のまま自動的に最新モデルへ切り替え済み（CLI バージョンと独立）

#### 今回対応なし（次回再評価）
- HTTP Hooks（Claude Code v2.1.72）: 現行 shell script フックが正常動作中のため保留
- Codex CLI Permission Hardening: v0.113.1 未確認につき次回
- `/loop` コマンドによる定期監査自動化: 検討余地あり

#### 次回チェック目安: 2026-04-10

---
