---
title: "karpathy-scout に YouTube 収集を追加した"
date: "2026-06-27"
summary: "- 変わったこと: karpathy-scout スキルの収集対象に YouTube を追加した"
tags:
  - "claude-code"
  - "workflow"
  - "changelog"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: env
---

### この回の要点（先に読む）

- **変わったこと**: karpathy-scout スキルの収集対象に YouTube を追加した
- **いままでとの違い**: これまでは X（Twitter）の投稿だけを収集していたが、Karpathy が YouTube に上げる長編動画・講演も自動で拾えるようになった
- **メリット**: X より YouTube のほうが Google にインデックスされやすく、取りこぼしが減る。Karpathy の一番密度の高いコンテンツ（長編解説動画）を見逃さなくなる

### 何が変わったか

karpathy-scout は Andrej Karpathy（AI研究者・元Tesla AI責任者）の発言を毎週自動収集して、開発ワークフローの改善ヒントを抽出するスキルです。

これまでの収集対象は X（Twitter）と GitHub だけでした。ところが Karpathy は YouTube にも定期的に長編動画を投稿しており、むしろそちらのほうが情報密度が高い。X の投稿は Google にインデックスされないことも多いのに対し、YouTube の動画タイトル・説明文はほぼ確実に検索で引っかかります。

「収集の穴を埋めるなら YouTube が一番コスパがいい」という判断で、検索クエリ1行を追加しました。

### 今回対応したこと

- ✅ `~/.claude/skills/karpathy-scout/SKILL.md` の Step 1A に検索クエリを追加（`karpathy site:youtube.com after:YYYY-MM-DD`）

---
