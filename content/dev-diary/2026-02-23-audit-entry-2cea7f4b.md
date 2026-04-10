---
title: "初回セットアップ"
date: "2026-02-23"
summary: "- 変わったこと: 月次でツール横断を見る `/tool-audit` スキルを用意し、委譲ルールと Gemini の既定モデル表記を更新した。"
tags:
  - claude-code
  - workflow
  - tool-audit
  - dev-env-log
vault_hp_sync: true
vault_sync_source: audit
---

### この回の要点（先に読む）

- **変わったこと**: 月次でツール横断を見る `/tool-audit` スキルを用意し、委譲ルールと Gemini の既定モデル表記を更新した。
- **いままでとの違い**: バラバラにアップデート情報を追う必要があった。
- **メリット**: 定期チェックの型ができ、見落としを減らしやすい。

- `/tool-audit` スキルを新規作成
- 委譲ルールを Opus 4.6 ベースに更新
- Gemini モデルを gemini-3-flash に更新
