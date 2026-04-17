/**
 * Vault の docs 以下の開発環境系 Markdown を、MyHomePage の content/dev-diary/*.md へ同期する。
 *
 * 対象（存在するものだけ読む）:
 * - dev_env_changelog.md … ## YYYY-MM-DD ── 見出し、## 技術メモ…
 * - last_tool_audit.md … ### YYYY-MM-DD — …（Tool Audit 履歴）
 * - last_changelog_check.md … ### YYYY-MM-DD（…）チェック履歴
 *
 * 手書きの Dev Log（vault_hp_sync なし）は削除しない。
 * 前回の同期分（vault_hp_sync または旧 generated_from）は毎回削除してから再生成。
 * CI で Vault が無いときはスキップ。
 *
 * 使い方: npm run sync:dev-log
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import slugify from '@sindresorhus/slugify';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MY_HOMEPAGE_ROOT = path.join(__dirname, '..');
const VAULT_ROOT = path.join(MY_HOMEPAGE_ROOT, '..', '..');
const DOCS = path.join(VAULT_ROOT, 'docs');
const DEV_DIARY_DIR = path.join(MY_HOMEPAGE_ROOT, 'content', 'dev-diary');

/** @typedef {'env' | 'audit' | 'ccp'} SourceKey */

/** @type {Record<SourceKey, string[]>} */
const TAGS_BY_SOURCE = {
  env: ['claude-code', 'workflow', 'changelog', 'dev-env-log'],
  audit: ['claude-code', 'workflow', 'tool-audit', 'dev-env-log'],
  ccp: ['claude-code', 'workflow', 'changelog-check', 'dev-env-log'],
};

function yamlEscape(s) {
  if (/["\n]/.test(s)) {
    return JSON.stringify(s);
  }
  return `"${s.replace(/\\/g, '\\\\')}"`;
}

/**
 * @param {string} text
 */
function parseEnvChangelog(text) {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const headingRegex = /^## (.+)$/gm;
  /** @type {{ full: string, content: string, index: number }[]} */
  const matches = [];
  let m;
  while ((m = headingRegex.exec(normalized)) !== null) {
    matches.push({ full: m[0], content: m[1], index: m.index });
  }

  /** @type {{ kind: 'dated' | 'tech', date?: string, title: string, body: string }[]} */
  const sections = [];

  for (let i = 0; i < matches.length; i++) {
    const h = matches[i];
    const next = matches[i + 1];
    const bodyStart = h.index + h.full.length;
    const bodyEnd = next ? next.index : normalized.length;
    let body = normalized.slice(bodyStart, bodyEnd).replace(/^\n+/, '').trimEnd();

    // ダッシュ種別（── — – - など）の表記ゆれに対応
    const dated = h.content.match(/^(\d{4}-\d{2}-\d{2})\s*[─—–\-]+\s*(.+)$/);
    if (dated) {
      sections.push({
        kind: 'dated',
        date: dated[1],
        title: dated[2].trim(),
        body,
      });
      continue;
    }
    if (h.content.startsWith('技術メモ')) {
      sections.push({
        kind: 'tech',
        title: h.content.trim(),
        body,
      });
    }
  }

  const datedOnly = sections.filter((s) => s.kind === 'dated' && s.date);
  const maxDate =
    datedOnly.length === 0
      ? new Date().toISOString().slice(0, 10)
      : datedOnly.map((s) => /** @type {string} */ (s.date)).reduce((a, b) => (a > b ? a : b));

  /** @type {{ source: SourceKey, date: string, title: string, body: string, tags: string[] }[]} */
  const out = [];

  for (const sec of sections) {
    if (sec.kind === 'dated' && sec.date) {
      out.push({
        source: 'env',
        date: sec.date,
        title: sec.title,
        body: sec.body,
        tags: TAGS_BY_SOURCE.env,
      });
    } else if (sec.kind === 'tech') {
      out.push({
        source: 'env',
        date: maxDate,
        title: sec.title,
        body: sec.body,
        tags: [...TAGS_BY_SOURCE.env, 'technical-memo'],
      });
    }
  }

  return out;
}

/**
 * ### 2026-04-03 — 第8回 Tool Audit
 */
function parseToolAudit(text) {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const re = /^### (\d{4}-\d{2}-\d{2})\s*(?:—|–|-)\s*(.+)$/gm;
  const matches = [...normalized.matchAll(re)];

  /** @type {{ source: SourceKey, date: string, title: string, body: string, tags: string[] }[]} */
  const out = [];

  for (let k = 0; k < matches.length; k++) {
    const row = matches[k];
    const date = row[1];
    const title = row[2].trim();
    const start = /** @type {number} */ (row.index) + row[0].length;
    const end = matches[k + 1] ? /** @type {number} */ (matches[k + 1].index) : normalized.length;
    const body = normalized.slice(start, end).replace(/^\n+/, '').trimEnd();
    out.push({
      source: 'audit',
      date,
      title,
      body,
      tags: TAGS_BY_SOURCE.audit,
    });
  }

  return out;
}

/**
 * ### 2026-02-16（初回リサーチ実施）
 */
function parseChangelogCheck(text) {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // 全角括弧（）・半角括弧()の両方に対応
  const re = /^### (\d{4}-\d{2}-\d{2})[（(]([^）)]+)[）)]\s*$/gm;
  const matches = [...normalized.matchAll(re)];

  /** @type {{ source: SourceKey, date: string, title: string, body: string, tags: string[] }[]} */
  const out = [];

  for (let k = 0; k < matches.length; k++) {
    const row = matches[k];
    const date = row[1];
    const sub = row[2].trim();
    const title = `Claude Code 更新チェック（${sub}）`;
    const start = /** @type {number} */ (row.index) + row[0].length;
    const end = matches[k + 1] ? /** @type {number} */ (matches[k + 1].index) : normalized.length;
    const body = normalized.slice(start, end).replace(/^\n+/, '').trimEnd();
    out.push({
      source: 'ccp',
      date,
      title,
      body,
      tags: TAGS_BY_SOURCE.ccp,
    });
  }

  return out;
}

/**
 * @param {string} body
 */
function makeSummary(body) {
  const ver = body.match(/\*\*バージョン\*\*[：:]\s*(.+)$/m);
  if (ver) {
    return `バージョン ${ver[1].trim()}`.slice(0, 220);
  }
  const lines = body.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (t && !t.startsWith('#') && !t.startsWith('>') && !t.startsWith('```')) {
      return t.replace(/\*\*/g, '').slice(0, 220);
    }
  }
  return '開発環境・ツールに関する記録';
}

/**
 * サイト掲載用の Dev Log は、非エンジニアにも読みやすいよう
 * Markdown の表を禁止し、箇条書きへ寄せる。
 * @param {string} text
 */
function hasMarkdownTable(text) {
  return /(?:^|\n)\|.+\|\n\|[\-:| ]+\|(?:\n|$)/m.test(text);
}

/**
 * @param {{ source: SourceKey; date: string; title: string; body: string; tags: string[] }[]} sections
 */
function assertNoMarkdownTables(sections) {
  const hits = sections.filter((sec) => hasMarkdownTable(sec.body));
  if (hits.length === 0) return;

  const details = hits
    .map((sec) => `- ${sec.date} / ${sec.title} [source=${sec.source}]`)
    .join('\n');

  throw new Error(
    '[vault_hp_sync] Markdown の表が残っているため同期を中止しました。\n' +
      'サイト掲載用の開発ログは表ではなく箇条書きで記述してください。\n' +
      '該当セクション:\n' +
      `${details}`,
  );
}

/**
 * @param {string} date
 * @param {string} titleJp
 * @param {SourceKey} sourceKey
 */
function buildFileStem(date, titleJp, sourceKey) {
  const ascii = slugify(titleJp, { lowercase: true, strict: true });
  const h = crypto
    .createHash('sha256')
    .update(`${sourceKey}\0${date}\0${titleJp}`)
    .digest('hex')
    .slice(0, 8);
  const slugPart = ascii.length >= 4 ? ascii : 'entry';
  return `${date}-${sourceKey}-${slugPart}-${h}`;
}

/**
 * @param {{ title: string; date: string; summary: string; tags: string[]; vault_sync_source: SourceKey }} data
 */
function buildFrontmatterBlock(data) {
  const lines = ['---'];
  lines.push(`title: ${yamlEscape(data.title)}`);
  lines.push(`date: "${data.date}"`);
  lines.push(`summary: ${yamlEscape(data.summary)}`);
  lines.push('tags:');
  for (const t of data.tags) {
    // : # [ ] 改行などの特殊文字によるYAML破損を防ぐため必ずクオート
    lines.push(`  - ${yamlEscape(t)}`);
  }
  lines.push('vault_hp_sync: true');
  lines.push(`vault_sync_source: ${data.vault_sync_source}`);
  lines.push('---');
  return lines.join('\n');
}

function removePreviousGenerated() {
  if (!fs.existsSync(DEV_DIARY_DIR)) return;

  const legacy = path.join(DEV_DIARY_DIR, 'dev-env-changelog.md');
  if (fs.existsSync(legacy)) {
    fs.unlinkSync(legacy);
    console.log('[vault_hp_sync] 旧単一ファイルを削除: dev-env-changelog.md');
  }

  for (const name of fs.readdirSync(DEV_DIARY_DIR)) {
    if (!name.endsWith('.md')) continue;
    const full = path.join(DEV_DIARY_DIR, name);
    let raw;
    try {
      raw = fs.readFileSync(full, 'utf-8');
    } catch {
      continue;
    }
    const { data } = matter(raw);
    if (data.vault_hp_sync === true || data.generated_from === 'dev_env_changelog') {
      fs.unlinkSync(full);
      console.log(`[vault_hp_sync] 削除（再同期）: ${name}`);
    }
  }
}

function main() {
  if (!fs.existsSync(DOCS)) {
    console.warn(
      `[vault_hp_sync] スキップ: Vault の docs が見つかりません (${DOCS})\n` +
        '  CI ではリポジトリにコミット済みの dev-diary をそのまま使います。',
    );
    process.exit(0);
  }

  /** @type {{ path: string; label: string; fn: (s: string) => { source: SourceKey; date: string; title: string; body: string; tags: string[] }[] }}[] */
  const readers = [
    {
      path: path.join(DOCS, 'dev_env_changelog.md'),
      label: 'dev_env_changelog',
      fn: parseEnvChangelog,
    },
    {
      path: path.join(DOCS, 'last_tool_audit.md'),
      label: 'last_tool_audit',
      fn: parseToolAudit,
    },
    {
      path: path.join(DOCS, 'last_changelog_check.md'),
      label: 'last_changelog_check',
      fn: parseChangelogCheck,
    },
  ];

  /** @type {{ source: SourceKey; date: string; title: string; body: string; tags: string[] }[]} */
  const all = [];

  for (const r of readers) {
    if (!fs.existsSync(r.path)) {
      console.warn(`[vault_hp_sync] 省略（ファイルなし）: ${r.label}`);
      continue;
    }
    const raw = fs.readFileSync(r.path, 'utf-8');
    const part = r.fn(raw);
    if (part.length === 0) {
      console.warn(
        `[vault_hp_sync] ⚠ ${r.label}: セクションが0件です。` +
        `見出し形式を確認してください（例: ## YYYY-MM-DD ── タイトル）`,
      );
    } else {
      console.log(`[vault_hp_sync] ${r.label}: ${part.length} セクション`);
    }
    all.push(...part);
  }

  if (all.length === 0) {
    console.warn('[vault_hp_sync] 取り込むセクションがありません。');
    process.exit(0);
  }

  assertNoMarkdownTables(all);

  removePreviousGenerated();
  fs.mkdirSync(DEV_DIARY_DIR, { recursive: true });

  let n = 0;
  for (const sec of all) {
    const stem = buildFileStem(sec.date, sec.title, sec.source);
    const dest = path.join(DEV_DIARY_DIR, `${stem}.md`);
    const summary = makeSummary(sec.body);
    const fm = buildFrontmatterBlock({
      title: sec.title,
      date: sec.date,
      summary,
      tags: sec.tags,
      vault_sync_source: sec.source,
    });
    fs.writeFileSync(dest, `${fm}\n\n${sec.body.trim()}\n`, 'utf-8');
    n += 1;
    console.log(`[vault_hp_sync] 書き出し: ${path.basename(dest)}`);
  }

  console.log(`[vault_hp_sync] 完了: ${n} 件`);
}

main();
