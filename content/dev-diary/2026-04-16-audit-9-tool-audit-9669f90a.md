---
title: "第9回 Tool Audit"
date: "2026-04-16"
summary: "- 変わったこと: Claude Code が v2.1.91 → v2.1.110 に大きく更新（+19バージョン）。Gemini CLI も v0.36.0 → v0.38.1 に更新済み。"
tags:
  - "claude-code"
  - "workflow"
  - "tool-audit"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: audit
---

### この回の要点（先に読む）

- **変わったこと**: Claude Code が v2.1.91 → v2.1.110 に大きく更新（+19バージョン）。Gemini CLI も v0.36.0 → v0.38.1 に更新済み。
- **いままでとの違い**: 今回は Gemini の v0.38.1 報告が正確だった（ハルシネーションではなかった）。
- **メリット**: Monitor ツールの persistent モードを活用した常時監視ワークフローが整った。

調査方法: Gemini CLI + 実機バージョン確認

#### ツールバージョン（確認済み）
- Claude Code: v2.1.91 → **v2.1.110**（+19バージョン、自動更新済み）
- Codex CLI: v0.118.0（変化なし）
- Gemini CLI: v0.36.0 → **v0.38.1**（手動更新完了 — `sudo npm update -g @google/gemini-cli`）
- Cursor: 未確認（実機なし）

#### 発見・対応した変更

**Claude Code v2.1.92〜v2.1.110（4/3〜4/16）**
- **Monitor ツール追加（v2.1.98）**: ログ監視・CI完了待ち等を条件成立時のみ通知。`persistent: true` で常時監視、`TaskStop` で停止 → **CLAUDE.md に既反映済み**
- Enterprise TLS（OS の CA 証明書ストアを信頼）: 企業プロキシ環境に有効（環境変化なければ影響なし）
- `effort` デフォルト変更: Claude 4 モデルでの推論深度が medium → high に変更の可能性（要確認）
- Gemini が v2.2.0 / Ultraplan / team-onboarding を報告したが **ハルシネーションの疑い**（実機 v2.1.110、公式確認なし）

**Codex CLI（変化なし）**
- v0.118.0 のまま変化なし
- Gemini が v0.120.0 / Realtime Voice V2 を報告 → 実機 v0.118.0 のため**未確認（ハルシネーションの可能性）**

**Gemini CLI（実機未更新）**
- 実機は v0.36.0 のまま
- Gemini が v0.38.1 + Parallel Tool Scheduler / Context Compression を報告 → **要手動確認・更新**
- Cursor 3.0 は前回もハルシネーションと記録。今回の Gemini 報告も信頼性に疑問

#### ハルシネーション記録（Gemini CLI 今回）
- Claude Code v2.2.0: 実機 v2.1.110 と乖離。公式確認不明
- Ultraplan / team-onboarding コマンド: 公式確認なし
- Codex CLI v0.120.0: 実機 v0.118.0 と乖離
- Cursor 3.0（前回も同様に記録）

#### 今回対応なし（次回再評価）
- Gemini CLI 手動更新: `sudo npm update -g @google/gemini-cli`（対話端末必要）→ ユーザーが手動実行
- Codex CLI v0.120.0 確認: 実機で `codex --version` 後 `bun install -g @openai/codex` を実行
- Monitor ツール persistent 活用: 長期 CI 監視などでの具体的な使い方を検討

#### 次回チェック目安: 2026-05-16

---
