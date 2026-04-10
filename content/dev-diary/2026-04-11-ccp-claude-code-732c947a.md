---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-04-11"
summary: "- 変わったこと: Claude Code を v2.1.101 に上げ、Monitor ツールなど新機能の公式情報を GitHub から直接確認した。運用ガイドと CLAUDE.md に Monitor を追記した。"
tags:
  - claude-code
  - workflow
  - changelog-check
  - dev-env-log
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: Claude Code を v2.1.101 に上げ、Monitor ツールなど新機能の公式情報を GitHub から直接確認した。運用ガイドと CLAUDE.md に Monitor を追記した。
- **いままでとの違い**: 調査を AI に任せるときの当たり外れを減らすため、一次ソース（公式リリース）を優先するやり方に寄せた。
- **メリット**: バージョンと機能の対応が確認しやすく、誤った期待を持ちにくい。

- 実行時バージョン: **v2.1.91** → `claude install latest` で **v2.1.101** に更新
- 調査範囲: v2.1.78〜v2.1.101（GitHub Releases 直接取得）
- **教訓の実践**: Gemini は補助のみ。GitHub API で一次ソース確認を優先 → ハルシネーションなし

#### 発見した新機能と対応

| 機能 | バージョン | 判定 | 対応 |
|------|-----------|------|------|
| hooks の `if` 条件フィルタ | v2.1.85 | 即適用（保留） | 次回 `.claude/settings.json` で適用予定 |
| Monitor ツール | v2.1.98 | 即適用 | 下記 |
| `rate_limits` statusline | v2.1.80 | 検討 | 現行 statusline が充実しているため低優先 |
| `CwdChanged` / `FileChanged` hook | v2.1.83 | 不要 | このVaultでは用途限定的 |
| `TaskCreated` hook | v2.1.84 | 不要 | 現行運用で不要 |
| `refreshInterval` statusline | v2.1.97 | 不要 | セッション開始時のみで十分 |
| `/team-onboarding` | v2.1.101 | 不要 | ソロ運用 |
| デフォルト effort → `high` | v2.1.94 | 確認のみ | API キーユーザーに影響、意識して使う |

#### 適用した変更

1. Claude Code を v2.1.91 → v2.1.101 に更新（`claude install latest`）
2. `claude_orchestra_lite/運用ガイド.md` に Monitor ツールセクションを追加
   - パラメータ解説、Bash `run_in_background` との使い分け、実用例3パターン
3. `CLAUDE.md` 便利なコマンド表に Monitor ツールを追記
4. `docs/last_changelog_check.md` を更新

#### 次回の最優先候補

1. hooks の `if` 条件フィルタを `.claude/settings.json` に適用（validate-file-location 等）
2. Monitor ツールを実プロジェクト（20260204_richmanbtc 等）で実際に試す
