---
name: gemini-research
description: "Gemini CLIでのリサーチ。ライブラリ調査・最新ベストプラクティス・大量ドキュメント読解・マルチモーダル処理で自動発火"
disable-model-invocation: false
---

# Gemini リサーチスキル

Gemini CLI（1Mトークン対応）でリサーチを実行します。

## いつ使うか

- ライブラリ/フレームワークの調査
- 最新のベストプラクティス確認
- 大量のドキュメント読み込み
- PDF/動画/音声の解析（マルチモーダル）

## 実行手順

### 1. リサーチトピックを明確化

`$ARGUMENTS` またはユーザーの質問から、以下を特定：
- 何を調べるか（トピック）
- どの観点で調べるか（使い方、比較、制限事項など）
- どの程度の深さが必要か

### 2. Gemini CLI を実行

```bash
# 基本リサーチ
gemini -p "Research: {トピック}

Provide:
1. Overview (what it is, main use cases)
2. Best practices (recommended patterns)
3. Code examples (practical snippets)
4. Caveats and limitations
5. Alternatives (if any)

Be specific and include version numbers where relevant.
" 2>/dev/null
```

```bash
# コードベース分析
gemini -p "Analyze this codebase for: {観点}

Focus on:
1. Current implementation patterns
2. Potential improvements
3. Consistency issues
4. Security considerations
" --include-directories src,lib 2>/dev/null
```

```bash
# マルチモーダル（PDF/動画/音声）
gemini -p "Extract from this file: {抽出したい情報}

Format the output as:
1. Summary (2-3 sentences)
2. Key points (bullet list)
3. Relevant quotes or data
" < /path/to/file.pdf 2>/dev/null
```

### 3. 結果を処理

1. Geminiの回答を**日本語で要約**してユーザーに報告
2. 重要な情報は `.claude/docs/research/{topic}.md` に保存
3. コード例がある場合は、プロジェクトに適用可能な形で提示

### 4. 結果の保存フォーマット

`.claude/docs/research/{topic}.md`:

```markdown
# {トピック} リサーチ結果

調査日: {YYYY-MM-DD}
調査者: Gemini CLI

## 概要
{1-2段落の要約}

## 主要ポイント
- {ポイント1}
- {ポイント2}
- {ポイント3}

## コード例
{コード例}

## 注意点・制限事項
- {注意点1}
- {注意点2}

## 参考リンク
- {URL1}
- {URL2}

## このプロジェクトへの適用
{プロジェクト固有の考慮事項や推奨事項}
```

## 注意事項

- Gemini CLI の無料枠は **1日約1,000リクエスト**
- 1分あたり15リクエストの制限あり
- 大量のリサーチが必要な場合は、質問を統合して効率化する
- 結果は必ずユーザーに日本語で報告

### フォールバック

デフォルトモデルでエラーが発生した場合は `-m gemini-2.5-flash` を明示指定：

```bash
gemini -m gemini-2.5-flash -p "..." 2>/dev/null
```
