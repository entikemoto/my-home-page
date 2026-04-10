---
title: "第5回 Tool Audit"
date: "2026-03-08"
summary: "- 変わったこと: Codex と Gemini CLI を大きく更新し、CLAUDE.md の委譲ルール（軽い作業は Gemini に任せる等）を現行の CLI の能力に合わせて書いた。"
tags:
  - claude-code
  - workflow
  - tool-audit
  - dev-env-log
vault_hp_sync: true
vault_sync_source: audit
---

### この回の要点（先に読む）

- **変わったこと**: Codex と Gemini CLI を大きく更新し、CLAUDE.md の委譲ルール（軽い作業は Gemini に任せる等）を現行の CLI の能力に合わせて書いた。
- **いままでとの違い**: 古い CLI の前提のままだと、新しい並列実行やモデル切り替えの恩恵を活かしきれない。
- **メリット**: コストと速度のバランスを取りやすくなった。

調査方法: Gemini CLI + 実機バージョン確認

#### ツールバージョン（確認済み）
- Claude Code: v2.1.71（自動更新済み）
- Codex CLI: v0.104.0 → **v0.111.0 にアップデート**（bun）
- Gemini CLI: v0.29.5 → v0.32.1（要 sudo npm、ユーザーが手動実行）
- Cursor: v2.8.4（変更なし）

#### 発見・対応した変更
- **Codex CLI v0.111.0**: GPT-5.3-Codex-Spark（1000 tok/s）、1M コンテキスト実験的サポート。即適用（bun update）
- **Gemini CLI v0.32.1**: Gemini 3.1 Flash-Lite 統合、Dynamic Task Routing（Flash-Lite/Pro 自動選択）。即適用（sudo npm update）
- **CLAUDE.md 委譲ルール更新**: 高頻度・軽量タスクへの Gemini Dynamic Task Routing 活用を追記

#### 今回対応なし（次回再評価）
- Codex CLI 1M コンテキスト（GPT-5.4 実験的）: 大規模コードレビューでの活用検討
- Gemini CLI Quota Management フラグ: CortexFlow 大量生成時に検討
- Cursor v2.8.4 SKILL.md 強化（実機確認未）
- Agent Teams env var サポート（Claude Code）: 引き続き未実装か確認が必要

#### 次回チェック目安: 2026-04-07（Agent Teams env var サポートを必ず確認）
