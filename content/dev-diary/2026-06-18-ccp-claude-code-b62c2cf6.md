---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-06-18"
summary: "- 変わったこと: v2.1.171〜v2.1.179（8バージョン）を確認。`Tool(param:value)` 権限構文（v2.1.178）が追加、サブエージェントが自分のサブエージェントを生成可能（5階層まで、v2.1.172）。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: v2.1.171〜v2.1.179（8バージョン）を確認。**`Tool(param:value)` 権限構文**（v2.1.178）が追加、**サブエージェントが自分のサブエージェントを生成可能**（5階層まで、v2.1.172）。
- **このVaultへの影響**: `Tool(param:value)` でモデル別の権限制御が可能になった（例: `Agent(model:opus)` でOpusサブエージェントを許可/拒否）。Agent Teams 運用の細粒度制御に有用。

- 実行時バージョン: **v2.1.179**（v2.1.174 → `claude update` で更新済み）
- 調査範囲: v2.1.171〜v2.1.179（GitHub Releases 直接取得）
- モデル更新: なし（Fable 5 / Opus 4.8 / Sonnet 4.6 / Haiku 4.5 据え置き）→ `/methods-audit` 前倒しトリガー非該当

#### 発見した新機能と対応

- **`Tool(param:value)` 権限構文**（v2.1.178）: 検討 — ツールの入力パラメータで権限マッチが可能。`Agent(model:opus)` でOpusサブエージェントを制御。`*` ワイルドカード対応。CLAUDE.md の Agent Teams 運用ルールに組み込める候補
- **サブエージェントが5階層まで孫エージェントを生成可能**（v2.1.172）: 確認のみ — 複雑なオーケストレーションが可能に。CortexFlow の workflow 設計に将来活用できる。現行運用への影響なし
- **ネストした `.claude/skills/` ディレクトリの自動ロード**（v2.1.178）: 確認のみ — 作業ディレクトリ配下の nested skills が自動有効化。名前衝突時は `<dir>:<name>` 形式。プロジェクト固有スキルの配置設計に影響
- **セッションタイトルが会話言語で生成**（v2.1.176）: 自動適用 — 日本語会話なら日本語タイトルが生成される。手動対応不要
- **mid-stream 接続断の partial response 保持**（v2.1.179）: 自動適用 — 接続が切れても途中まで返した内容が消えなくなった。長時間処理の信頼性向上
- **`enforceAvailableModels` managed setting**（v2.1.175）: 不要 — チーム管理機能。個人利用のため対象外
- **`footerLinksRegexes` setting**（v2.1.176）: 不要 — 個人設定の範囲
- **Bedrock credential caching 改善**（v2.1.176）: 不要 — Bedrock 未使用
- **WSL2 / Windows Terminal バグ修正**（v2.1.179）: 不要 — macOS 環境

#### 適用した変更

- Claude Code を **v2.1.174 → v2.1.179** に更新（`claude update`）
- `docs/last_changelog_check.md` の最終チェック日を `2026-06-18` に更新

#### 繰越タスク（変化なし）

- **`/methods-audit` 前倒し実行** — Fable 5 が最上位モデルになったため `methods/` 全体のモデル参照を更新要（前回繰越）
- **Dynamic Workflows を試す** — `ultracode` で起動可能（前回繰越）
- **Push notification の有効化**（手動設定が必要、前回繰越）
- **Hook → MCP tool 直接呼び出し設計**（前回繰越）

---
