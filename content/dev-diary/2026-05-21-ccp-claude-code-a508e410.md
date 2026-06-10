---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-05-21"
summary: "- 変わったこと: v2.1.141〜v2.1.146（6バージョン）を確認。Fast mode が Opus 4.6 → Opus 4.7 にデフォルト変更（v2.1.142）、`/simplify` が `/code-review` に改名（v2.1.146）。実機を v2.1.144 → v2.1.146 に更新。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: v2.1.141〜v2.1.146（6バージョン）を確認。**Fast mode が Opus 4.6 → Opus 4.7 にデフォルト変更**（v2.1.142）、`/simplify` が `/code-review` に改名（v2.1.146）。実機を v2.1.144 → v2.1.146 に更新。
- **いままでとの違い**: Fast mode の裏側モデルが上位に変わったため、`methods/` のモデル前提を再確認する必要が出てきた。
- **メリット**: Fast mode が Opus 4.7 になり、設計判断系も速い体験で扱える。`/code-review` は effort level 引数対応で粒度調整可能。

- 実行時バージョン: **v2.1.146**（v2.1.144 から `claude install latest` で更新）
- 調査範囲: v2.1.141〜v2.1.146（GitHub Releases 直接取得）
- モデル更新: **Fast mode 提供モデル変更（4.6 → 4.7）** → `/methods-audit` 前倒しトリガー該当

#### 発見した新機能と対応

- **Fast mode = Opus 4.7 デフォルト**（v2.1.142）: 即適用 — 実機更新で自動取り込み。`CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1` で旧仕様固定可。`/methods-audit` 前倒し実行を推奨
- **`/simplify` → `/code-review` 改名**（v2.1.146）: 確認のみ — effort level 引数対応（例: `/code-review high`）。Vault 内に `/simplify` 明示参照があれば置換
- **`claude agents --json`**（v2.1.145）: 検討 — 全セッションを JSON 出力可。launchd CortexFlow の状態取得に応用候補
- **Stop hook block cap（8回）**（v2.1.143）: 自動適用 — `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` で上書き可
- **`/goal` evaluator 修正**（v2.1.143）: 自動適用 — bg shell/subagent 動作中は fire しなくなった。`/goal` 試行時の信頼性向上
- **Rewind "Summarize up to here"**（v2.1.141）: 検討 — 部分要約でコンテキスト圧縮。長セッション運用での候補
- **`/model` セッション限定化**（v2.1.144）: 確認のみ — デフォルト動作がセッション限定に。`d` キーで永続デフォルト化
- **`terminalSequence` hook 出力**（v2.1.141）: 検討 — hook がデスクトップ通知を直接出せる。既存 `osascript` 通知の置換候補

#### 自動適用された改善（ユーザー操作不要）

- **MCP pagination 修正**（v2.1.144, v2.1.146）— tools/resources/prompts のページ2以降が落ちていたバグ
- **Read tool PARTIAL view**（v2.1.145）— トークン上限超過時にハードエラーではなく部分表示
- **起動時 75秒ハング修正**（v2.1.144）— captive portal/VPN 環境
- **MCP servers tools/list ページング修正**（v2.1.144）— サイレントなツール欠落を防止
- **Background session の MCP/設定保持改善**（v2.1.143）— `/bg` 後も `--mcp-config` 等が引き継がれる
- **worktree cleanup の `rm -rf` フォールバック廃止**（v2.1.143）— gitignored ファイルの保護

#### 不要と判定

- PowerShell ツール改善（v2.1.143, v2.1.146）、Windows Terminal 関連修正、Bedrock/Vertex/Foundry 関連修正、Plugin marketplace 関連、`/feedback` 機能拡張、VSCode 関連修正 — 利用環境外 / 未使用機能

#### 適用した変更

- 実機を **v2.1.144 → v2.1.146** に更新（`claude install latest`）
- `docs/last_changelog_check.md` の最終チェック日を `2026-05-21` に更新

#### 次回の最優先候補

- **`/methods-audit` の前倒し実行** — Fast mode = Opus 4.7 が `methods/` のモデル前提に影響する可能性
- **`claude agents --json` の launchd CortexFlow 連携検討** — 状態取得を JSON 化できれば監視ダッシュボード化が容易
- **Push notification の有効化**（繰越、モバイルアプリで確認）
- **Hook → MCP tool 直接呼び出し設計**（繰越）

---
