---
title: "第10回 Tool Audit"
date: "2026-05-05"
summary: "- 変わったこと: Claude Code が v2.1.110 → v2.1.128 に更新（+18バージョン）。Gemini CLI が v0.38.1 のまま v0.40.1 に2バージョン遅れている。"
tags:
  - "claude-code"
  - "workflow"
  - "tool-audit"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: audit
---

### この回の要点（先に読む）

- **変わったこと**: Claude Code が v2.1.110 → v2.1.128 に更新（+18バージョン）。Gemini CLI が v0.38.1 のまま v0.40.1 に2バージョン遅れている。
- **いままでとの違い**: Opus 4.7 はすでに CLAUDE.md に反映済みだったが、`xhigh` effort の活用ルールが未追記だったため今回追加した。
- **メリット**: Gemini CLI 更新で ripgrep オフライン対応・YOLO モード保護が得られる。

調査方法: GitHub Releases API 直接取得（Gemini CLI リサーチは今回失敗、GitHub API で代替）

#### ツールバージョン（確認済み）
- Claude Code: v2.1.110 → **v2.1.128**（自動更新済み）
- Codex CLI: v0.118.0（npm 変化なし / Rust alpha v0.129.0-alpha.6 別トラック）
- Gemini CLI: v0.38.1（**要更新 → v0.40.1** 安定版が出ている）
- Cursor: 未確認（実機なし）

#### 発見・対応した変更

**Claude Code v2.1.111〜v2.1.128（4/16〜5/4）**

主な機能追加（自動適用済み）:
- **Opus 4.7 `xhigh` effort**（v2.1.111）: `high` と `max` の中間推論深度。設計タスクで活用 → CLAUDE.md に追記（事前承認済み）
- **CLI がネイティブバイナリ起動に**（v2.1.113）: 起動高速化。Glob/Grep が bfs/ugrep に置換（v2.1.117）
- **`/resume` 67% 高速化・MCP 起動並列化**（v2.1.116, 117）: 大規模セッション対応
- **vim visual mode（v/V）**（v2.1.118）: テキスト選択・演算子に対応
- **`/cost` + `/stats` → `/usage` 統合**（v2.1.118）: 既存呼び出しはショートカットとして残存
- **`/config` 設定が `~/.claude/settings.json` に永続化**（v2.1.119）: テーマ・editor mode 等が再起動後も保持
- **PostToolUse hook の `updatedToolOutput` が全ツール対応**（v2.1.121）: 従来 MCP のみ
- **`alwaysLoad` MCP オプション**（v2.1.121）: tool-search deferral をスキップ
- **`/skills` フィルタ検索**（v2.1.121）: 長いスキルリストで検索可能
- **`/resume <PR URL>` 対応**（v2.1.122）: PR URL からセッション再開
- **`claude project purge [path]`**（v2.1.126）: プロジェクト全 state を削除（`--dry-run` あり）
- **`/mcp` にツール数表示**（v2.1.128）: 接続済みサーバーのツール数とゼロ警告
- **`--plugin-dir` が .zip 対応**（v2.1.128）: プラグインアーカイブをそのまま読み込める

**Codex CLI（npm: v0.118.0 変化なし）**
- Rust 版（別トラック）v0.128.0（4/30）で大型機能追加:
  - **Persisted `/goal` ワークフロー**: 目標を永続保存・一時停止・再開・クリア
  - **`codex update` コマンド**: 自動アップデート
  - **MultiAgentV2 設定**: スレッド上限・待機時間・depth 制御を明示化
  - **外部エージェントセッションインポート**: 他ツールセッションを Codex に取込
  - **パーミッションプロファイル拡張**: サンドボックス CLI 選択・cwd 制御
- npm パッケージは Rust 版と乖離しているため、今後の方向性を注意

**Gemini CLI（v0.38.1 → 要 v0.40.1 更新）**
- v0.40.0（4/28）の主な変更:
  - **ripgrep バイナリをバンドル**: オフライン環境でもコード検索が動作
  - **YOLO モード強制ダウングレード防止**: ヘッドレスモードでの安全性向上
  - **ワークスペーストラスト（ヘッドレス）**: 信頼済み環境での .env 読み込み改善
  - **スキル抽出改善**: 繰り返し動作から自動スキル抽出
  - **GitHub カラーブラインドテーマ**: アクセシビリティ向上
  - OpenSSL 3.x エラーリトライ、スラッシュコマンド IDE リスナー修正
- v0.40.1（4/30）: バグフィックスパッチ

**Cursor**: 実機なし、情報なし

#### 今回の対応

- **即適用済み**: `~/.claude/CLAUDE.md` に `xhigh` effort ルールを追記（Opus 4.7 解放の事前承認済みステップ3）
- **即適用済み**: `docs/last_changelog_check.md` に v2.1.128 エントリを追加（ステップ4）

#### 次回の提案（ユーザー承認が必要）

- [x] **Gemini CLI 更新**: v0.38.1 → **v0.40.1** 完了（2026-05-05）
- [ ] **`/methods-audit` 前倒しを検討**: Codex CLI Rust 版の方向性変化（npm 乖離）と Gemini CLI 2バージョン遅れで methodsの前提が古くなっている可能性

#### ハルシネーション記録

- Gemini CLI リサーチが今回失敗（exit 1）→ GitHub API 直接確認で代替。品質面では問題なし

#### 次回チェック目安: 2026-06-05

---
