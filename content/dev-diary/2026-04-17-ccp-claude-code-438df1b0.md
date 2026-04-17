---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-04-17"
summary: "- 変わったこと: `/less-permission-prompts` スキルによる allowlist 分析を手動で実施し、`gemini`・`codex`・`claude`・`curl` など頻出コマンド 8 件を `settings.json` の allow リストに追加した。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: `/less-permission-prompts` スキルによる allowlist 分析を手動で実施し、`gemini`・`codex`・`claude`・`curl` など頻出コマンド 8 件を `settings.json` の allow リストに追加した。
- **いままでとの違い**: これらのコマンドはセッションごとに権限確認が発生していた。
- **メリット**: リサーチ・バージョン確認・通知など日常的な操作の確認ノイズが減る。

- 実行時バージョン: **v2.1.112**（前回 v2.1.110 から更新済み）
- 調査範囲: v2.1.111〜v2.1.112（GitHub Releases 直接取得）

#### 発見した新機能と対応

| 機能 | バージョン | 判定 | 対応 |
|------|-----------|------|------|
| `/less-permission-prompts` スキル | v2.1.111 | 即適用 | allowlist を手動分析して 8 件追加（下記） |
| `/ultrareview` | v2.1.111 | 検討 | 開発プロジェクトのレビュー時に試す候補 |
| Opus 4.7 + `xhigh` effort | v2.1.111 | 確認のみ | **このアカウントでは未開放**（2026-04-17 時点で `/model` ピッカーに 4.6 のみ表示）。段階的ロールアウト待ち |
| Auto mode 自動有効化 | v2.1.111 | 不要 | 既存運用への影響なし |
| 読み取り専用 glob コマンドが権限スキップ | v2.1.111 | 不要 | Claude Code が自動処理 |
| "Auto (match terminal)" テーマ | v2.1.111 | 不要 | 個人設定 |
| Opus 4.7 auto mode バグ修正 | v2.1.112 | 不要 | バグフィックスのみ |

#### 適用した変更

- `~/.claude/settings.json` allowlist に以下 8 件を追加:
  - `Bash(claude:*)` — バージョン確認・アップデート
  - `Bash(gemini:*)` — Gemini CLI リサーチ
  - `Bash(codex:*)` — Codex CLI レビュー
  - `Bash(curl:*)` — GitHub API など読み取り
  - `Bash(date:*)` — 日時確認
  - `Bash(which:*)` — コマンド存在確認
  - `Bash(open:*)` — ファイル・URL を macOS で開く
  - `Bash(osascript:*)` — macOS 通知（hooks で既に使用）

#### 次回の最優先候補

- **`/ultrareview` を試す** — 開発プロジェクト（richmanbtc 等）のブランチレビューで使ってみる
- **Push notification の有効化** — 継続（手動設定が必要）
- hooks の `if` 条件フィルタを `.claude/settings.json` に適用（継続）

---
