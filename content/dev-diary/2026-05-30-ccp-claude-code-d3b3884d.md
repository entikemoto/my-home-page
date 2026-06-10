---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-05-30"
summary: "- 変わったこと: Claude Code v2.1.157（2026-05-29） が最新。v2.1.154 で Opus 4.8 正式統合、v2.1.157 で `.claude/skills` 自動ロードが追加。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: **Claude Code v2.1.157（2026-05-29）** が最新。v2.1.154 で Opus 4.8 正式統合、v2.1.157 で `.claude/skills` 自動ロードが追加。
- **最重要発見**: `opusplan` プリセットが **v2.1.157 から Opus 4.8 にマッピング変更**（バイナリ `R0()` 関数解析で確認。firstParty = claude.ai Pro/Max ユーザー対象）。
- **Fast mode 料金誤記を修正**: 前回 "3倍安価" と記録していたが、公式は "2x standard rate for 2.5x speed" ($10/$50 per Mトークン)。

- 実行時バージョン: **v2.1.157**（v2.1.152 → `claude install latest` で更新）
- 調査範囲: v2.1.153〜v2.1.157 + バイナリ解析

#### 発見した新機能と対応

- **`opusplan` → Opus 4.8 マッピング確認**（v2.1.157）: 🔴 バイナリ確認済み — `R0()` で firstParty ユーザーは `MO().opus48` を返すコードを確認。`opusplan` + Plan mode = Opus 4.8（claude.ai Pro/Max）
- **`.claude/skills` 自動ロード**（v2.1.157）: 検討 — マーケットプレイス不要でプロジェクト内スキルが自動有効化。既存プロジェクトの `.claude/skills/` は影響なし（設計通り動作）
- **`claude plugin init <name>`**（v2.1.157）: 検討 — `/new-skill` スキルとの住み分け整理後に採用検討
- **Dynamic Workflows**（v2.1.154 Research Preview）: 検討 — `/workflows` で大規模マルチエージェント。Research Preview のため本番運用は先送り
- **Fast mode on Opus 4.8**（v2.1.154）: 確認のみ — "2x the standard rate for 2.5x the speed"（$10/$50 per Mトークン）。`cost-optimization/SKILL.md` 誤記を修正済み
- **Lean system prompt**（v2.1.154）: 確認のみ — Opus 4.8 以降がデフォルト有効。opusplan 経由で Opus 4.8 を使う場合も適用

#### 適用した変更

- Claude Code を **v2.1.152 → v2.1.157** に更新（`claude install latest`）
- `~/.claude/skills/cost-optimization/SKILL.md`: Fast mode 料金誤記修正（"3倍安価" → "2x standard rate / 2.5x speed / $10/$50"）
- `docs/last_methods_audit.md`: opusplan 宿題クローズ + スナップショット更新（v2.1.157）
- `docs/last_changelog_check.md` の最終チェック日を `2026-05-30` に更新

#### 次回の最優先候補

- **Dynamic Workflows を試す** — `/workflows` で CortexFlow の高度自動化を実験（Research Preview 卒業後）
- **`claude plugin init` vs `/new-skill` の住み分け整理**
- **Push notification の有効化**（繰越、手動設定が必要）
- **Hook → MCP tool 直接呼び出し設計**（繰越）

---
