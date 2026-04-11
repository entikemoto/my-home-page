---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-03-27"
summary: "- 変わったこと: AI に調査を任せた結果を、そのまま採用せず、実際のバージョンと照合した（記録の更新が中心）。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: AI に調査を任せた結果を、そのまま採用せず、実際のバージョンと照合した（記録の更新が中心）。
- **いままでとの違い**: 調査結果の見出しだけ見て設定を変えてしまうリスクがあった。
- **メリット**: 誤った機能追加を避け、**実機のバージョンを先に確認する**習慣が明文化された。

- 実行時バージョン確認: **v2.1.77**（前回記録の v2.1.78 を下回る）
- Gemini CLI による調査実施 → v2.1.79〜v2.2.0 の機能を報告
- **判定: 全結果がハルシネーション**。実バージョン v2.1.77 に該当機能なし（`--bare` フラグ等で確認）

#### 教訓

- Gemini の Claude Code チェンジログ調査は精度が低い（前回の `startup-validator` と同様）
- **次回からの改善策**: `claude --version` で実バージョンを先に確認し、Gemini の結果と照合する。乖離が大きければ Gemini 結果は採用しない
- 「`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`」「`InstructionsLoaded` hook」は未検証のため適用見送り

#### 適用した変更

1. `docs/last_changelog_check.md` の最終チェック日を `2026-03-27` に更新（記録のみ）

#### 次回の最優先候補

1. Claude Code の GitHub Releases を直接参照（https://github.com/anthropics/claude-code/releases）して Gemini 結果と照合する運用に切り替える
2. `LAST_COMPACT.md` の運用微調整（継続）
