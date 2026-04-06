---
title: "Agentic Dev OS v2：Claude Code を司令塔に据えた開発環境が安定稼働"
date: "2026-04-06"
summary: "Claude Code + Gemini CLI + Codex CLI の3層構造が定着。委譲ルールをCLAUDE.mdで明文化したことで、AIへの指示の曖昧さが激減した。"
tags: ["claude-code", "gemini-cli", "codex-cli", "workflow", "agentic-dev-os"]
---

## 今日の変更

CLAUDE.md のエージェント委譲ルールを更新した。具体的には Gemini CLI への委譲基準を明確化し、「複数ソースの深いリサーチ」だけでなく「高頻度・軽量なサブタスク」も Gemini に任せるように変えた。

Gemini v0.32+ から Dynamic Task Routing が入り、Flash-Lite/Pro を自動選択してくれるので、コスト最適化がさらに改善された。

## 現状の構成

```
Claude Code (Sonnet 4.6) — 司令塔
├── 実装・ファイル操作・タスク管理
├── Gemini CLI → リサーチ・大量ドキュメント読解
├── Codex CLI → コードレビュー・セキュリティ監査
└── Opus 4.6 (Plan mode) → アーキテクチャ判断
```

## 気づいたこと

委譲ルールを曖昧にしておくと、Claude Code が全部自分でやろうとしてしまう。「これはGeminiに任せる」と明示することで、応答速度とコスト両方が改善した。

CLAUDE.md は「AIとの作業規約」として機能している。毎セッション自動で読み込まれるので、口頭で毎回説明する手間がなくなった。

## 次のアクション

- `/skills-scout` でコミュニティの新しいスキルをチェック
- Gemini CLI の `service_tier: flex` 設定を他プロジェクトにも適用
