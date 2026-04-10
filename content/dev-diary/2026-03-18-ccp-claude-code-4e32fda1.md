---
title: "Claude Code 更新チェック（定期チェック実施）"
date: "2026-03-18"
summary: "- 変わったこと: 通信エラーで止まったときも記録を残す設定と、長い会話を圧縮したあとの要約メモを残す設定を追加した。"
tags:
  - claude-code
  - workflow
  - changelog-check
  - dev-env-log
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: 通信エラーで止まったときも記録を残す設定と、長い会話を圧縮したあとの要約メモを残す設定を追加した。
- **いままでとの違い**: エラーや圧縮で文脈が抜けやすかった。
- **メリット**: 次のセッションに引き継ぐ材料が増え、途切れにくくなった。

- 現在確認バージョン: 2.1.78
- 調査範囲: v2.1.71〜v2.1.78（2026年3月上旬〜3月中旬リリース分）+ Claude Code settings / changelog

#### 発見した新機能と対応

「判定」は Vault への採用可否、「対応」は実際に入れた変更。

| 機能 | 判定 | 対応 |
|------|------|------|
| StopFailure hook | 即適用 | `auto-save-session.sh` を拡張し、APIエラー時にも LAST_SESSION を自動保存するよう追加 |
| PostCompact hook | 即適用 | `LAST_COMPACT.md` を補助メモとして保存し、次回開始時に補足参照できるよう追加 |
| `/effort` + `effortLevel` | 検討 | 設計・監査時の推論強度切替に有用。Vault ルールへの落とし込みは要設計 |
| MCP elicitation / Elicitation hooks | 検討 | 将来 MCP を増やしたときに有効。現行運用では優先度は高くない |
| `/loop` | 不要 | 既存 hook 中心の運用で十分。定期実行を増やすとノイズ化しやすい |
| Agent 継続方式の変更（`resume` 廃止、`SendMessage` に集約） | 検討 | 将来 agent 運用手順を明文化する際に反映したい |
| `/branch` への改名（`/fork` は互換） | 不要 | 互換性があり、現時点での運用影響は小さい |
| `worktree.sparsePaths` | 不要 | この Vault では恩恵が薄い |

#### 適用した変更

1. `docs/last_changelog_check.md` を更新
   - 最終チェック日を `2026-03-18` に更新
   - 直近リリースの要点と Vault への判定を追記
2. `.claude/settings.json` に `StopFailure` hook を追加
   - API エラーや認証失敗などでターンが終わったときも自動保存
3. `_tools/hooks/auto-save-session.sh` を拡張
   - `StopFailure` に対応
   - 失敗終了時は LAST_SESSION に失敗情報を追記
4. `.claude/settings.json` に `PostCompact` hook を追加
   - compact 後の要約を `LAST_COMPACT.md` に保存
5. `_tools/hooks/post-compact-brief.sh` を新規作成
   - `compact_summary` / `trigger` / `transcript_path` を補助メモとして保存
6. `_tools/hooks/session-start.sh` を拡張
   - `LAST_COMPACT.md` を補足コンテキストとして読み込む

#### 次回の最優先候補

1. `LAST_COMPACT.md` の運用微調整
   - compact 補助メモの粒度や注入量が適切かを実運用で確認する
