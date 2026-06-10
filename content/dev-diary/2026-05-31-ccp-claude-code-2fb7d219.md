---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-05-31"
summary: "- 変わったこと: Claude Code v2.1.158（2026-05-30） が最新。Bedrock/Vertex/Foundry向けに Auto mode が Opus 4.7/4.8 で有効化。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: **Claude Code v2.1.158（2026-05-30）** が最新。Bedrock/Vertex/Foundry向けに Auto mode が Opus 4.7/4.8 で有効化。
- **このVaultへの影響**: なし（サブスク利用のためエンタープライズAPI環境向け変更は対象外）。

- 実行時バージョン: **v2.1.158**（v2.1.157 → 自動更新済み）
- 調査範囲: v2.1.158（GitHub Releases 直接取得）

#### 発見した新機能と対応

- **Auto mode on Bedrock/Vertex/Foundry（Opus 4.7/4.8）**: 不要 — `CLAUDE_CODE_ENABLE_AUTO_MODE=1` で有効化。サブスク利用のため対象外

#### 適用した変更

- `docs/last_changelog_check.md` の最終チェック日を `2026-05-31` に更新（記録のみ）

#### 次回の最優先候補（繰越）

- **Dynamic Workflows を試す** — Research Preview のまま継続。本番前に実験
- **`claude plugin init` vs `/new-skill` の住み分け整理**
- **Push notification の有効化** — モバイルアプリ（claude.ai iOS/Android）で確認
- **Hook → MCP tool 直接呼び出し設計** — Semgrep 廃止後の他MCP応用

---
