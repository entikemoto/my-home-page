---
title: "第7回 Tool Audit"
date: "2026-03-20"
summary: "調査方法: Gemini CLI + GitHub リリースページ直接確認 + 実機バージョン確認"
tags:
  - claude-code
  - workflow
  - tool-audit
  - dev-env-log
vault_hp_sync: true
vault_sync_source: audit
---

調査方法: Gemini CLI + GitHub リリースページ直接確認 + 実機バージョン確認

#### ツールバージョン（確認済み）
- Claude Code: v2.1.62（ローカル） / 最新 v2.1.80 — **要手動更新**（新ターミナルで `claude update`）
- Codex CLI: v0.111.0 → **v0.116.0 に更新完了**（`bun install -g @openai/codex`）
- Gemini CLI: v0.34.0（前回 v0.32.1 から更新済み）
- Cursor: 未確認（実機なし）

#### 発見・対応した変更

**Claude Code v2.1.73〜v2.1.80（3/11〜3/19）**
- `StopFailure` hook 追加（v2.1.78）: Stop 時のエラーハンドリング用新フック
- `/effort` コマンド追加（v2.1.76）: 推論深度を low/medium/high/auto で手動制御
- MCP elicitation サポート（v2.1.76）: MCP サーバーが対話入力を要求可能に
- Opus 4.6 出力上限 64k デフォルト / 128k max（v2.1.77）
- `modelOverrides` 設定（v2.1.73）: settings.json でモデルオーバーライド可能
- `-n/--name` フラグ（v2.1.76）: セッション名の手動設定
- プラグイン永続状態 `${CLAUDE_PLUGIN_DATA}`（v2.1.78）
- `--channels` MCP サポート、レートリミット表示（v2.1.80）
→ 更新は新ターミナルで `claude update` 必要（実行中セッションでは自己更新ブロック）

**Codex CLI v0.111.0 → v0.116.0（3/19）**
- `userpromptsubmit` hook 追加: プロンプト送信前の遮断・拡張が可能
- App-server TUI + デバイスコード ChatGPT サインイン
- Realtime sessions に最近スレッドコンテキスト注入
→ **更新完了**（`bun install -g @openai/codex`）

**Gemini CLI v0.34.0（3/17）**
- ループ検出＆リカバリー: 無限ループの自動解除
- gVisor sandboxing: AI 生成コードの安全実行
- v0.35.0-preview.1 で並列ツール実行が実験的導入
→ 前回 v0.32.1 から既に更新済み

#### ハルシネーション記録（Gemini CLI が誤報）
- Claude Code バージョン: v0.28.4 と報告（実際は v2.1.62 / 最新 v2.1.80）
- Codex CLI バージョン: v0.116.1.0 と報告（実際は v0.116.0）
- Gemini 無料クォータ制限 3/25: GitHub リリースで未確認 → 観察継続

#### 今回対応なし（次回再評価）
- StopFailure hook: 現行 Stop hook が正常動作中のため保留
- `userpromptsubmit` hook（Codex）: Prompt Injection 防御への活用検討
- Gemini CLI v0.35.0-preview.1 の並列ツール実行: GA 後に評価
- Gemini 無料クォータ変更（3/25）: 実際に制限が発動したら対応

#### 次回チェック目安: 2026-04-20

---
