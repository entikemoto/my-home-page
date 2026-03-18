# docs/ インデックス（まずここ）

この `docs/` は「会話履歴に頼らず、AIと人が同じ前提で作業する」ための拠点です。

## 何が "正(SSOT)" か

- **不変のルール**: `CLAUDE.md` / `.cursor/rules/*`
- **可変の現在地**: `docs/project-status.md`
- **不変の履歴（検証・意思決定）**: `docs/logs/*`

## まず更新するファイル

- **`docs/project-status.md`**: いまのPhase / Next Actions / Blockers を更新
- **`docs/development-progress.md`**: 開発進捗、現在作業中の部品、完了状況

## ファイル一覧

| ファイル | 内容 | 状態 |
|---------|------|------|
| `_INDEX.md` | このファイル。ドキュメント一覧 | ✓ |
| `project-status.md` | プロジェクト状態・Phase・Next Actions | ✓ |
| `architecture.md` | システム構成・ページ設計・ディレクトリ構造 | ✓ |
| `business-and-system-overview.md` | 業務プロセス・部品定義・依存関係 | テンプレート |
| `development-progress.md` | 開発進捗・部品完了状況 | テンプレート |
| `domain.md` | 目的・ユーザー・ユースケース・制約 | テンプレート |
| `api-contract.md` | APIのI/O例（主にRSS・Pagefind） | テンプレート |
| `glossary.md` | 用語の定義（表記ゆれ防止） | テンプレート |
| `security-checklist.md` | セキュリティチェックリスト | テンプレート |
| `docs/logs/` | 重要な検証・意思決定ログ | 随時追加 |

## ログの残し方

- 重要な検証/判断をしたら `docs/logs/YYYY-MM-DD_*.md` を追加
- テンプレ: `docs/logs/YYYY-MM-DD_template.md`

## ルール

- SSOT（真実の単一ソース）はファイル。口頭やチャットで共有した情報はここに書き直す
- `business-and-system-overview.md` と `development-progress.md` は開発セッション開始時に必ず参照する
- このディレクトリのファイルは Claude Code が自動更新する（部品完了時など）
