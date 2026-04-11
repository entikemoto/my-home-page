---
title: "初回 Tool Audit 実行"
date: "2026-02-23"
summary: "- 変わったこと: 各ツールの直近リリースの話題を洗い、Gemini の API キー更新を最優先の対応にした。"
tags:
  - "claude-code"
  - "workflow"
  - "tool-audit"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: audit
---

### この回の要点（先に読む）

- **変わったこと**: 各ツールの直近リリースの話題を洗い、Gemini の API キー更新を最優先の対応にした。
- **いままでとの違い**: ツールが増えると、どこが詰まりか分かりにくい。
- **メリット**: 「まず認証と接続」を直す優先順位が明確になった。

調査方法: Claude Code Web検索（Gemini API キー期限切れのため代替）

#### 発見した変更
- Claude Code v2.1.49: background agents の Ctrl+C 修正、パフォーマンス改善、並列ファイル操作修正
- Codex CLI: GPT-5.3-Codex-Spark（1000 tok/s 高速モデル）リリース、Plan mode TUI
- Cursor v2.5.20: Merkle tree インデックス共有、long-running agents テスト中
- Gemini CLI: Gemini 3.1 Pro プレビュー（2/20）、v0.30.0-preview（SDK Package、カスタムスキル）

#### 対応
- 即適用: Gemini API キー更新が必要（緊急）
- 検討（次回再評価）: Codex-Spark 活用、Gemini 3.1 Pro（GA後）、Gemini SDK Package
- 不要: その他（自動で恩恵を受けているか、スキルに影響なし）

#### 注意
- Gemini API キーが頻繁に期限切れになる問題を調査中
- 次回チェック目安: 2026-03-25
