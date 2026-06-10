---
title: "第11回 Tool Audit"
date: "2026-06-03"
summary: "- 変わったこと: Codex CLI が v0.118 → v0.136 に大幅更新（`codex doctor`・`/archive`・named permissions 追加）。Gemini CLI が v0.40.1 → v0.45.0（Auto モード統合・edit 精度向上）。Claude Code は v2.1.161 で並列ツール呼び出しが改善。"
tags:
  - "claude-code"
  - "workflow"
  - "tool-audit"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: audit
---

### この回の要点（先に読む）

- **変わったこと**: Codex CLI が v0.118 → v0.136 に大幅更新（`codex doctor`・`/archive`・named permissions 追加）。Gemini CLI が v0.40.1 → v0.45.0（Auto モード統合・edit 精度向上）。Claude Code は v2.1.161 で並列ツール呼び出しが改善。
- **いままでとの違い**: Codex と Gemini が4〜5バージョン遅れていたため今回一括更新。
- **メリット**: Codex の `codex doctor` でデバッグ効率向上。Gemini の edit 精度向上でリサーチ品質が上がる。

調査方法: GitHub Releases API 直接取得（実機バージョン確認済み）

#### ツールバージョン（確認済み）
- Claude Code: v2.1.128 → **v2.1.161**（自動更新済み）
- Codex CLI: v0.118.0 → **v0.136.0**（`bun install -g @openai/codex` で更新完了）
- Gemini CLI: v0.40.1 → **v0.45.0** 推奨（`sudo npm update -g @google/gemini-cli` — ユーザーが手動実行）
- Cursor: 未確認（実機なし）

#### 発見・対応した変更

**Claude Code v2.1.158〜v2.1.161（5/30〜6/2）**
- **v2.1.160**: `acceptEdits` モードがビルドツール設定ファイル書き込み前に確認を求めるように（自動適用）
- **v2.1.160**: grep 後の Edit に別途 Read 不要に（自動適用）
- **v2.1.161**: 並列ツール呼び出しで Bash エラーが他ツールをキャンセルしなくなった（Dynamic Workflows 安定性向上。自動適用）
- **v2.1.161**: `claude agents` が fan-out 時に `done/total` を表示（確認のみ）
- v2.1.158〜159: Bedrock/Vertex 向け・内部改善（不要）

**Codex CLI（v0.118 → v0.136）**
- **v0.135**: `codex doctor` コマンド追加（環境・Git・端末の詳細診断）: 検討 — デバッグ時に有用
- **v0.135**: `/permissions` が named profiles に対応: 検討 — data-class 別権限設定との相性良し
- **v0.136**: `/archive` でセッションをアーカイブ・保護: 検討 — 長期プロジェクト管理に有用
- **v0.134**: 過去会話履歴のキーワード検索: 不要 — Vault 側で管理

**Gemini CLI（v0.40.1 → v0.45.0）**
- **v0.43.0**: edit ツールの精度向上（外科的編集）: 自動適用（更新後）
- **v0.44.0**: Auto モードが1つに統合: 自動適用（更新後）
- **v0.45.0**: A2A メタデータ公開・コンテキスト簡略化: 自動適用（更新後）

#### `/methods-audit` 前倒しトリガー判定
非該当（Opus 4.8 は 2026-05-29 の `/changelog` で処理済み。新モデル更新なし）

#### 今回の対応
- **完了**: Codex CLI v0.132.0 → v0.136.0（`bun install -g @openai/codex`）
- **ユーザー手動**: Gemini CLI v0.40.1 → v0.45.0（`sudo npm update -g @google/gemini-cli`）

#### 次回の提案（ユーザー承認が必要）
- **Gemini CLI 更新確認**: 次回セッションで `gemini --version` を確認
- **`codex doctor` を試す**: 実プロジェクト（richmanbtc 等）で診断実行
- **Dynamic Workflows 実験**: CortexFlow の高度自動化で `/workflows` を試す（繰越）
- **Push notification の有効化**（繰越）

#### 次回チェック目安: 2026-07-03

---
