---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-05-14"
summary: "- 変わったこと: v2.1.129〜v2.1.140（12バージョン）を確認。`/goal` コマンド・Agent view・hook `continueOnBlock` など注目機能が追加。`worktree.baseRef` のデフォルト動作が変わり、EnterWorktree が `origin/<default>` 起点に戻った。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: v2.1.129〜v2.1.140（12バージョン）を確認。`/goal` コマンド・Agent view・hook `continueOnBlock` など注目機能が追加。`worktree.baseRef` のデフォルト動作が変わり、EnterWorktree が `origin/<default>` 起点に戻った。
- **いままでとの違い**: 自走型タスク（`/goal`）と全セッション一覧（`claude agents`）が加わり、長時間の自動処理の監視がしやすくなった。
- **メリット**: CortexFlow 等の自動タスクに `/goal` を試す候補ができた。hook の `continueOnBlock` でセキュリティブロック時の Claude の自己修正が可能になった。

- 実行時バージョン: **v2.1.140**（前回 v2.1.128 から更新済）
- 調査範囲: v2.1.129〜v2.1.140（GitHub Releases 直接取得）
- モデル更新: なし（Opus 4.7 / Sonnet 4.6 / Haiku 4.5 据え置き）→ `/methods-audit` 前倒しトリガー非該当

#### 発見した新機能と対応

- **`/goal` コマンド**（v2.1.139）: 検討。完了条件を設定してClaudeが自走。CortexFlowのダイジェスト自動生成で試す候補。`/loop` との住み分けが必要
- **Agent view（`claude agents`）**（v2.1.139, Research Preview）: 検討。全セッション（実行中/待機/完了）を一覧表示。launchd 自動起動セッションの状態確認に活用できる可能性
- **hook `continueOnBlock`（PostToolUse）**（v2.1.139）: 検討。`true` にするとブロック理由をClaudeに返してターン継続。`gitleaks-precommit.sh`・`pip-audit-guard.sh` への適用候補
- **hook `args: string[]`（exec形式）**（v2.1.139）: 検討。シェルを介さず直接起動でクォート問題なし。既存hookスクリプトの堅牢化に使える
- **`worktree.baseRef` 設定**（v2.1.133）: 要確認。デフォルトが `fresh`（`origin/<default>`）に変更。v2.1.128 以降 local HEAD が起点だったが元に戻った。未プッシュコミットをworktreeに持ち込む場合は `"worktree": { "baseRef": "head" }` を追加する必要あり
- **`Skill(name *)` ワイルドカード修正**（v2.1.139）: 自動適用済み。prefix マッチとして正常動作するようになった
- **`/loop` 冗長 wakeup 修正**（v2.1.140）: 自動適用済み。既に通知するタスクへのポーリングを不要スケジュールしなくなった
- **コンパクション時のユーザー指示保護**（v2.1.139）: 自動適用済み
- **`CLAUDE_CODE_SESSION_ID` in Bash subprocess**（v2.1.132）: 不要。現行 hook 運用では不要
- **`settings.autoMode.hard_deny`**（v2.1.136）: 不要。auto mode 運用なし
- **API キー設定時の Remote Control・`/schedule` 無効化**（v2.1.139）: 確認のみ。当 Vault はサブスク利用のため影響なし

#### 適用した変更

- `docs/last_changelog_check.md` の最終チェック日を `2026-05-14` に更新（記録のみ）

#### 次回の最優先候補

- **`/goal` コマンドを試す** — CortexFlow のダイジェスト生成など「完了まで自走」タスクで実験。`/loop` との使い分けルールを整理してから
- **`continueOnBlock` の適用検討** — `gitleaks-precommit.sh`・`pip-audit-guard.sh` に `continueOnBlock: true` を追加してブロック理由をClaudeに返す
- **Push notification の有効化**（繰越）— モバイルアプリ（claude.ai iOS/Android）で確認
- **Hook → MCP tool 直接呼び出し設計**（繰越）— Semgrep 廃止後の他 MCP への応用検討

---
