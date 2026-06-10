---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-05-05"
summary: "- 変わったこと: v2.1.128 で `/mcp` にツール数表示・`--plugin-dir` が .zip 対応。Opus 4.7 の `xhigh` effort を CLAUDE.md に追記（事前承認済みステップ3完了）。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: v2.1.128 で `/mcp` にツール数表示・`--plugin-dir` が .zip 対応。Opus 4.7 の `xhigh` effort を CLAUDE.md に追記（事前承認済みステップ3完了）。
- **いままでとの違い**: なし（記録のみ）。
- **メリット**: `xhigh` を `/harden` 等の設計スキル実行時に明示的に使えるようになった。

- 実行時バージョン: **v2.1.128**（前回 v2.1.126 から自動更新済）
- 調査範囲: v2.1.127〜v2.1.128（GitHub Releases 直接取得）

#### 自動適用された改善（ユーザー操作不要）

- **`/color` 引数なしでランダムセッションカラー設定**（v2.1.128）— UI 改善
- **`/mcp` にツール数表示**（v2.1.128）— 接続済み MCP のツール数とゼロツールサーバーの警告表示
- **`--plugin-dir` が .zip プラグインアーカイブ対応**（v2.1.128）— プラグイン配布が容易に
- **`--channels` が console 認証（API キー）でも利用可能に**（v2.1.128）— `channelsEnabled: true` が必要

#### 適用した変更

- `~/.claude/CLAUDE.md` に `xhigh` effort ルールを追記（Opus 4.7 解放後の事前承認済みステップ3完了）
- `docs/last_changelog_check.md` の最終チェック日を `2026-05-05` に更新

#### 不要と判定

- `--channels` console 認証（v2.1.128）— 当 Vault では `--channels` を未使用
- `.zip` plugin dir（v2.1.128）— プラグインのローカル配布ニーズなし

#### 追加対応（2026-05-05 同日）

- **GitHub MCP 認証完了**: `gh auth token` から `GITHUB_PERSONAL_ACCESS_TOKEN` を `~/.claude.json` に設定。`search_repositories` で動作確認済み
- **Semgrep MCP 移行完了**: `uvx semgrep-mcp@0.9.0`（非推奨）→ `semgrep mcp`（semgrep v1.157.0）に更新

#### 次回の最優先候補

- **`/ultrareview` を試す**（繰越）— 開発プロジェクトのブランチレビューで使ってみる
- **Push notification の有効化**（繰越、手動設定が必要）
- **`claude project purge` の archive ワークフロー組み込み検討**（繰越）
- **Semgrep MCP の動作確認**（次回: 実プロジェクトでセキュリティスキャンを実行して確認）
- **Hook → MCP tool 直接呼び出し設計**（Semgrep 動作確認後）

---
