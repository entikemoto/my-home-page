---
name: codex-consult
description: "Codex CLIへのレビュー・セキュリティ監査・DevOps相談。コードレビュー・脆弱性検出・ターミナル操作で精度が必要な場面で自動発火"
disable-model-invocation: false
---

# Codex 相談スキル

Codex CLI（レビュー・セキュリティ・DevOps）に相談します。

## いつ使うか

- コードレビュー：PR レビュー、リファクタリング提案、コード品質チェック
- セキュリティ監査：脆弱性検出、依存関係の安全性チェック、ゼロデイ分析
- ターミナル/DevOps：複雑なシェルスクリプト、CI/CD 構築、インフラ自動化
- デバッグ：原因が明確でない、最初の修正が失敗した（第2手段として）

**Quick Rule**: 「レビュー・監査・ターミナル操作で精度が必要」→ Codexに相談

### 使わない場面（Claude Code 自身が担当）

- 一次の設計判断・アーキテクチャ決定（まずは Claude Code の Plan mode + Opus で行う）
- 複雑な実装計画（plan mode で対応）
- 新機能設計・API設計

### 例外: セカンドオピニオン

以下の場面では、Codex 相談を使ってよい:
- `/harden` や Opus でレビューした後も設計判断に迷いが残る
- ルール・スキル・テンプレート・`CLAUDE.md` の責務分担を整理したい
- 設計原則の文言に曖昧さや運用破綻リスクがないか点検したい

Codex CLI 経由で GPT-5.4 が利用可能な場合のみ、追加のセカンドオピニオンを取る:
```bash
codex exec -m gpt-5.4 -C /path/to/project "Review this design decision. Focus on ambiguity, enforceability, hierarchy placement, operational failure modes, and missing exceptions: {設計質問を英語で}"
```

利用できない場合は、Codex CLI の標準モデルで代替する。

使わない場面:
- 小修正、定型実装、テスト修正
- 広い範囲の検索・探索だけが目的のとき
- Claude Code の Plan mode + Opus で一次設計案をまだ作っていないとき

## 実行手順

### 1. 質問を英語に変換

Codexへは英語で質問すると推論精度が向上します。
`$ARGUMENTS` が日本語の場合は英語に翻訳してからCodexに渡す。

### 2. Codex CLI を実行

用途に応じてサブコマンドを使い分ける：

```bash
# 一般的な質問・分析（非対話モード）
codex exec "{質問を英語で}"

# コードレビュー（未コミット変更）
codex review --uncommitted

# コードレビュー（ブランチ差分）
codex review --base main

# コードレビュー（特定コミット）
codex review --commit {SHA}

# セキュリティ監査
codex exec "Security audit: check for vulnerabilities, dependency issues, and OWASP top 10 risks"
```

**注意**: プロジェクトの git リポジトリ内で実行すること。別ディレクトリから実行する場合は `-C /path/to/project` を付ける。

コンテキストとして以下を含める：
- CLAUDE.md の要約
- docs/project-status.md の要約（あれば）
- 関連ファイルの情報

### 3. 結果を処理

1. Codexの回答を**日本語で要約**してユーザーに報告
2. 重要な設計決定は `docs/DESIGN.md` に記録
3. 実装提案がある場合は、次のアクションとして提示

### 4. 設計決定の記録フォーマット

`docs/DESIGN.md` に追記：

```markdown
## {日付} - {決定事項のタイトル}

### 背景
{なぜこの決定が必要だったか}

### 検討した選択肢
1. {選択肢A}: {メリット/デメリット}
2. {選択肢B}: {メリット/デメリット}

### 決定
{選んだ選択肢とその理由}

### Codexの分析
{Codexからの主要なインサイト}
```

## 注意事項

- 現在の実測環境: Codex CLI v0.111.0、既定モデルは gpt-5.4
- **git リポジトリ内**での実行が前提（`-C` でパス指定 or `--skip-git-repo-check`）
- 非対話実行は `codex exec`、レビューは `codex review` を使用
- `gpt-5.4` 指定は Codex CLI 側で利用可能な場合のみ使う
- 単純な質問には使わない（コスト節約）
- レビュー・監査・DevOps で精度が必要な場面で使用
- 結果は必ずユーザーに日本語で報告
