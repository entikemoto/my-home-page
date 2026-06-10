---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-04-24"
summary: "- 変わったこと: 7 バージョン分（v2.1.113〜v2.1.119）を確認したが、即適用が必要な手動変更はなし。重要な security 改善（Bash deny の強化、危険削除パスの追加など）はバージョンアップで自動適用済。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: 7 バージョン分（v2.1.113〜v2.1.119）を確認したが、即適用が必要な手動変更はなし。重要な security 改善（Bash deny の強化、危険削除パスの追加など）はバージョンアップで自動適用済。
- **いままでとの違い**: なし（記録のみの更新）。
- **メリット**: 「変更点を把握して、何もしないと判断した」ことを明示的に残すことで、次回チェック時に同じ調査を繰り返さずに済む。

- 実行時バージョン: **v2.1.119**（前回 v2.1.112 から自動更新済）
- 調査範囲: v2.1.113〜v2.1.119（GitHub Releases 直接取得）
- モデル更新: なし（Opus 4.7 / Sonnet 4.6 / Haiku 4.5 据え置き）→ `/methods-audit` 前倒しトリガー非該当

#### 自動適用された改善（ユーザー操作不要）

- **`Bash(find:*)` allow rule から `find -exec`/`-delete` が除外**（v2.1.113）— セキュリティ強化
- **macOS `/private/{etc,var,tmp,home}` を危険削除パスに追加**（v2.1.113）— `Bash(rm:*)` allow rule の補強
- **Bash deny rule が `env`/`sudo`/`watch`/`ionice`/`setsid` ラッパーをマッチ**（v2.1.113）— 既存 deny の強化（`Bash(sudo:*)` deny がより堅牢に）
- **CLI がネイティブバイナリ起動に切替**（v2.1.113）— 起動高速化、Glob/Grep が `bfs`/`ugrep` に置換（v2.1.117）
- **`/cost` と `/stats` が `/usage` に統合**（v2.1.118）— 既存呼び出しは shortcut として残存
- **`/resume` 大規模セッション最大 67% 高速化**（v2.1.116）
- **MCP startup 並列化**（v2.1.117, v2.1.119）— 起動時間短縮

#### 検討事項として保留

- **Hook → MCP tool 直接呼び出し**（`type: "mcp_tool"`、v2.1.118）
  - PostToolUse(Edit) で Semgrep MCP を自動起動するなど、セキュリティスキャンの自動化が可能
  - 現状は GitHub MCP の OAuth 認証も未完。MCP 整備が一段落したタイミングで設計検討する
- **PostToolUse hook の `duration_ms`**（v2.1.119）
  - tool 実行時間の telemetry 取得が可能だが、現状計測ニーズが薄いため見送り
- **`sandbox.network.deniedDomains`**（v2.1.113）
  - FirstPrinciple の `allowed_webfetch_domains` と相補的に明示 deny を追加できるが、当面は不要

#### 不要と判定

- vim visual mode（v2.1.118）、custom themes（v2.1.118）、WSL inheritance（v2.1.118）、PowerShell tool（v2.1.119）、`prUrlTemplate`（v2.1.119）、Auto mode `$defaults` 構文（v2.1.118）、`/loop` Esc cancel（v2.1.113）— UI / Windows / 未使用機能向け

#### 適用した変更

- `docs/last_changelog_check.md` の最終チェック日を `2026-04-24` に更新（記録のみ）

#### 次回の最優先候補

- **GitHub MCP の OAuth 認証完了**（前回からの繰越）
- **Semgrep MCP の動作確認**（前回からの繰越）→ 完了後、Hook → MCP tool 直接呼び出しの設計検討に進む
- **`/ultrareview` を試す**（前回からの繰越）— 開発プロジェクトのブランチレビューで使ってみる
- **Push notification の有効化**（前回からの繰越、手動設定が必要）

---
