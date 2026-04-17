---
title: "Claude Code 更新チェック（セキュリティ機能の大幅追加）"
date: "2026-04-17"
summary: "- 変わったこと: セキュリティ強化として 8 機能を一気に追加（hook 3本・MCP 2本・スキル 2本・プロジェクト個別設定 1本）。"
tags:
  - "claude-code"
  - "workflow"
  - "changelog-check"
  - "dev-env-log"
vault_hp_sync: true
vault_sync_source: ccp
---

### この回の要点（先に読む）

- **変わったこと**: セキュリティ強化として 8 機能を一気に追加（hook 3本・MCP 2本・スキル 2本・プロジェクト個別設定 1本）。
- **いままでとの違い**: 自作 hook + 単一スキルのみだった。シークレット・依存脆弱性・prompt injection の自動防御が薄く、医療データを扱うプロジェクト固有の保護もなかった。
- **メリット**: コミット時のシークレット漏洩、脆弱な依存関係追加、外部コンテンツ経由の prompt injection、医療情報の意図しない外部送信──いずれも自動で検出・遮断できる体制になった。

#### 追加した機能（8件すべて完了）

| # | 機能 | 種類 | 場所 |
|---|------|------|------|
| 1 | gitleaks PreCommit hook | Hook | `_tools/hooks/gitleaks-precommit.sh` |
| 2 | pip-audit PostToolUse hook | Hook | `_tools/hooks/pip-audit-guard.sh` |
| 3 | UserPromptSubmit hook（外部コンテンツマーカー） | Hook | `_tools/hooks/external-content-marker.sh` |
| 4 | VoiceClinical 専用厳格設定 | Config | `projects/20260216_VoiceClinical/.claude/settings.local.json` |
| 5 | Semgrep MCP server | MCP | `~/.claude.json`（user scope） |
| 6 | GitHub MCP server | MCP | `~/.claude.json`（user scope, OAuth 認証必要） |
| 7 | `/security-audit` スキル | Skill | `~/.claude/skills/security-audit/` |
| 8 | `/threat-model` スキル | Skill | `~/.claude/skills/threat-model/` |

#### 前提インストール（実施済）

- `brew install gitleaks` → v8.30.1
- `pipx install pip-audit` → v2.10.0
- `brew install uv`（uvx 提供）→ v0.11.7

#### 残作業（ユーザー手動）

- **GitHub MCP の OAuth 認証** — Claude Code 内で `/mcp` を実行し、`github` を選択してブラウザで認証する
- **Semgrep MCP の動作確認** — 実プロジェクト（CortexFlow2.0 等）でセキュリティ分析を実行して動作確認
