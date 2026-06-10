---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-05-01"
summary: "- 変わったこと: 4 バージョン分（v2.1.121, v2.1.122, v2.1.123, v2.1.126）を確認したが、即適用必須の手動変更はなし。重要な改善（メモリリーク修正・Read tool malware警告削除・各種 OAuth fix）はバージョンアップで自動取り込み済。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: 4 バージョン分（v2.1.121, v2.1.122, v2.1.123, v2.1.126）を確認したが、即適用必須の手動変更はなし。重要な改善（メモリリーク修正・Read tool malware警告削除・各種 OAuth fix）はバージョンアップで自動取り込み済。
- **いままでとの違い**: なし（記録のみの更新）。
- **メリット**: 「変更点を把握して、何もしないと判断した」ことを明示的に残すことで、次回チェック時に同じ調査を繰り返さずに済む。

- 実行時バージョン: **v2.1.126**（前回 v2.1.119 から自動更新済）
- 調査範囲: v2.1.121〜v2.1.126（GitHub Releases 直接取得）
- モデル更新: なし（Opus 4.7 / Sonnet 4.6 / Haiku 4.5 据え置き）→ `/methods-audit` 前倒しトリガー非該当

#### 自動適用された改善（ユーザー操作不要）

- **Read tool: 個別ファイル malware警告の削除**（v2.1.126）— 誤検知による「これは malware ではない」コメンタリーが減る
- **`--dangerously-skip-permissions` のスコープ拡張**（v2.1.126）— `.claude/`, `.git/`, `.vscode/`, shell config までバイパス。当 Vault では未使用のため影響なし
- **`/skills` フィルタ検索ボックス**（v2.1.121）— UI 改善
- **PostToolUse hooks が `hookSpecificOutput.updatedToolOutput` で全ツールの出力を書き換え可能に**（v2.1.121）— 従来は MCP 限定
- **メモリリーク修正多数**（v2.1.121）— 画像処理・`/usage`・長時間ツール
- **`/resume` の対セッション堅牢化**（v2.1.121）— 破損行スキップで起動失敗を防止
- **画像 paste 自動ダウンスケール**（v2.1.126）— 2000px 超の画像でセッションが壊れない
- **OAuth 各種 fix**（v2.1.121, v2.1.123, v2.1.126）— 401 ループ・リフレッシュトークン消失・タイムアウト改善

#### 検討事項として保留

- **`/resume <PR URL>`**（v2.1.122）— GitHub/GitLab/Bitbucket の PR URL からセッション再開可能。GitHub MCP 認証完了後に運用ルール化を検討
- **`claude project purge [path]`**（v2.1.126）— プロジェクト凍結時のクリーンアップ手順に追加候補。`--dry-run` あり。`archive/` 移動と組み合わせるか要検討
- **`alwaysLoad` MCP オプション**（v2.1.121）— Semgrep/GitHub MCP を tool-search 経由せず常時ロード可能。MCP 動作確認後に検討
- **`PostToolUse` hook の `updatedToolOutput` 全ツール対応**（v2.1.121）— gitleaks/pip-audit の検出文言整形に使えるが、現行は exit code ブロック方式で十分

#### 不要と判定

- Bedrock service tier（v2.1.122）、PowerShell 関連 fixes（v2.1.126）、Vertex AI mTLS（v2.1.121）、Voice mode 改善（v2.1.121, v2.1.122）、`claude_code.skill_activated` OTel event（v2.1.126）、`/model` ピッカーのゲートウェイ対応（v2.1.126）、VS Code voice dictation（v2.1.121）— 利用環境外 / テレメトリ未取得

#### 適用した変更

- `docs/last_changelog_check.md` の最終チェック日を `2026-05-01` に更新（記録のみ）

#### 次回の最優先候補

- **GitHub MCP の OAuth 認証完了**（前回からの繰越）
- **Semgrep MCP の動作確認**（前回からの繰越）→ 完了後、Hook → MCP tool 直接呼び出しの設計検討に進む
- **`/ultrareview` を試す**（前回からの繰越）— 開発プロジェクトのブランチレビューで使ってみる
- **Push notification の有効化**（前回からの繰越、手動設定が必要）
- **`/resume <PR URL>` の運用検討**（今回の追加）— GitHub MCP 認証完了とセットで活用できるか検討
- **`claude project purge` の archive ワークフロー組み込み検討**（今回の追加）
