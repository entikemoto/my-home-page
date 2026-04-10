/**
 * Vault の docs/dev_env_changelog.md を、日付見出し（## YYYY-MM-DD ── …）と
 * 「## 技術メモ…」ごとに content/dev-diary/{日付}-{slug}-{短いhash}.md へ分割して同期する。
 *
 * - 手書きの Dev Log（generated_from なし）は触らない
 * - 前回同期分（generated_from: dev_env_changelog）は毎回削除してから再生成（正本と常に一致）
 * - CI でソースが無いときはスキップし、リポジトリ内の生成済みファイルをそのまま使う
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
const SOURCE = path.join(VAULT_ROOT, 'docs', 'dev_env_changelog.md');
const DEV_DIARY_DIR = path.join(MY_HOMEPAGE_ROOT, 'content', 'dev-diary');
const GENERATED_MARKER = 'dev_env_changelog';

function yamlEscape(s) {
  if (/["\n]/.test(s)) {
    return JSON.stringify(s);
  }
  return `"${s.replace(/\\/g, '\\\\')}"`;
}

/** @typedef {{ kind: 'dated', date: string, title: string, body: string } | { kind: 'tech', title: string, body: string }} ParsedSection */

/**
 * @param {string} text
 * @returns {ParsedSection[]}
 */
function parseChangelogSections(text) {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const headingRegex = /^## (.+)$/gm;
  /** @type {{ full: string, content: string, index: number }[]} */
  const matches = [];
  let m;
  while ((m = headingRegex.exec(normalized)) !== null) {
    matches.push({ full: m[0], content: m[1], index: m.index });
  }

  /** @type {ParsedSection[]} */
  const sections = [];

  for (let i = 0; i < matches.length; i++) {
    const h = matches[i];
    const next = matches[i + 1];
    const bodyStart = h.index + h.full.length;
    const bodyEnd = next ? next.index : normalized.length;
    let body = normalized.slice(bodyStart, bodyEnd).replace(/^\n+/, '').trimEnd();

    const dated = h.content.match(/^(\d{4}-\d{2}-\d{2})\s*──\s*(.+)$/);
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

  return sections;
}

/**
 * @param {string} body
 * @returns {string}
 */
function makeSummary(body) {
  const ver = body.match(/\*\*バージョン\*\*[：:]\s*(.+)$/m);
  if (ver) {
    const s = `バージョン ${ver[1].trim()}`.slice(0, 220);
    return s;
  }
  const lines = body.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (t && !t.startsWith('#') && !t.startsWith('>') && !t.startsWith('```')) {
      return t.replace(/\*\*/g, '').slice(0, 220);
    }
  }
  return '開発環境アップデートの記録';
}

/**
 * @param {string} date
 * @param {string} titleJp
 * @returns {string} 拡張子なしファイル名
 */
function buildFileStem(date, titleJp) {
  const ascii = slugify(titleJp, { lowercase: true, strict: true });
  const h = crypto.createHash('sha256').update(`${date}\0${titleJp}`).digest('hex').slice(0, 8);
  if (ascii.length >= 4) {
    return `${date}-${ascii}-${h}`;
  }
  return `${date}-dev-env-${h}`;
}

/**
 * 既存の自動生成ファイルを削除
 */
function removePreviousGenerated() {
  if (!fs.existsSync(DEV_DIARY_DIR)) return;

  const legacy = path.join(DEV_DIARY_DIR, 'dev-env-changelog.md');
  if (fs.existsSync(legacy)) {
    fs.unlinkSync(legacy);
    console.log('[sync_dev_env_changelog] 旧単一ファイルを削除: dev-env-changelog.md');
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
    if (data.generated_from === GENERATED_MARKER) {
      fs.unlinkSync(full);
      console.log(`[sync_dev_env_changelog] 削除（再同期）: ${name}`);
    }
  }
}

/**
 * @param {ParsedSection[]} sections
 * @returns {string}
 */
function maxDateFromSections(sections) {
  const dates = sections.filter((s) => s.kind === 'dated').map((s) => s.date);
  if (dates.length === 0) return new Date().toISOString().slice(0, 10);
  return dates.reduce((a, b) => (a > b ? a : b));
}

/**
 * @param {import('gray-matter').GrayMatterFile<{ generated_from?: string }>['data']} data
 */
function buildFrontmatterBlock(data) {
  const lines = ['---'];
  lines.push(`title: ${yamlEscape(data.title)}`);
  lines.push(`date: "${data.date}"`);
  lines.push(`summary: ${yamlEscape(data.summary)}`);
  lines.push('tags:');
  for (const t of data.tags) {
    lines.push(`  - ${t}`);
  }
  lines.push(`generated_from: ${GENERATED_MARKER}`);
  lines.push('---');
  return lines.join('\n');
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.warn(
      `[sync_dev_env_changelog] スキップ: ソースが見つかりません (${SOURCE})\n` +
        '  CI ではリポジトリにコミット済みの dev-diary をそのまま使います。',
    );
    process.exit(0);
  }

  const raw = fs.readFileSync(SOURCE, 'utf-8');
  const sections = parseChangelogSections(raw);

  if (sections.length === 0) {
    console.warn('[sync_dev_env_changelog] 日付見出し（## YYYY-MM-DD ── …）が見つかりません。');
    process.exit(0);
  }

  const maxDate = maxDateFromSections(sections);

  removePreviousGenerated();
  fs.mkdirSync(DEV_DIARY_DIR, { recursive: true });

  /** @type {string[]} */
  const written = [];

  for (const sec of sections) {
    let date;
    let title;
    let body;

    if (sec.kind === 'dated') {
      date = sec.date;
      title = sec.title;
      body = sec.body;
    } else {
      date = maxDate;
      title = sec.title;
      body = sec.body;
    }

    const stem = buildFileStem(date, title);
    const dest = path.join(DEV_DIARY_DIR, `${stem}.md`);
    const summary = makeSummary(body);

    const fm = buildFrontmatterBlock({
      title,
      date,
      summary,
      tags: ['claude-code', 'workflow', 'changelog', 'dev-env-log'],
    });

    fs.writeFileSync(dest, `${fm}\n\n${body.trim()}\n`, 'utf-8');
    written.push(path.basename(dest));
    console.log(`[sync_dev_env_changelog] 書き出し: ${path.basename(dest)} (${date})`);
  }

  console.log(`[sync_dev_env_changelog] 完了: ${written.length} 件`);
}

main();
