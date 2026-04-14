#!/usr/bin/env node
/**
 * lint_devlog_tables.mjs
 *
 * Dev Log の Markdown ファイルに含まれるテーブルが
 * note.com で読めるフォーマットになっているかチェックする。
 *
 * ルール:
 *   1. 列数は最大 3 列まで（4列以上はエラー）
 *   2. セルのテキストは最大 30 文字まで（超過は警告）
 *
 * 使い方:
 *   node scripts/lint_devlog_tables.mjs
 *   node scripts/lint_devlog_tables.mjs --fix-hint  # 修正ヒントも表示
 */

import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DEVDIARY_DIR = resolve(__dirname, '../content/dev-diary');

const MAX_COLUMNS = 3;
const MAX_CELL_LENGTH = 30;

let hasError = false;

const files = readdirSync(DEVDIARY_DIR).filter(f => f.endsWith('.md'));

for (const file of files.sort()) {
  const filePath = join(DEVDIARY_DIR, file);
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const fileIssues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // テーブル行の検出（| で始まり | で終わる行）
    if (!line.trim().startsWith('|') || !line.trim().endsWith('|')) continue;
    // 区切り行（|---|---| 形式）はスキップ
    if (/^\|[\s\-:|]+\|$/.test(line.trim())) continue;

    const cells = line
      .trim()
      .slice(1, -1)  // 先頭と末尾の | を除去
      .split('|')
      .map(c => c.trim());

    const lineNum = i + 1;

    // ルール1: 列数チェック
    if (cells.length > MAX_COLUMNS) {
      fileIssues.push({
        level: 'ERROR',
        line: lineNum,
        message: `列数が ${cells.length} 列（最大 ${MAX_COLUMNS} 列）`,
        content: line.trim().slice(0, 80),
      });
      hasError = true;
    }

    // ルール2: セル文字数チェック
    for (const cell of cells) {
      // Markdown の装飾（**、`、絵文字など）を除いたテキスト長を測る
      const plain = cell.replace(/[*`_~]/g, '').replace(/!\[.*?\]\(.*?\)/g, '');
      if (plain.length > MAX_CELL_LENGTH) {
        fileIssues.push({
          level: 'WARN',
          line: lineNum,
          message: `セル「${cell.slice(0, 20)}…」が ${plain.length} 文字（推奨 ${MAX_CELL_LENGTH} 文字以内）`,
          content: null,
        });
      }
    }
  }

  if (fileIssues.length > 0) {
    console.log(`\n📄 ${file}`);
    for (const issue of fileIssues) {
      const icon = issue.level === 'ERROR' ? '❌' : '⚠️ ';
      console.log(`  ${icon} 行${issue.line}: ${issue.message}`);
      if (issue.content) {
        console.log(`     ${issue.content}`);
      }
    }
  }
}

if (hasError) {
  console.log('\n❌ エラーがあります。note.com で表示が崩れる可能性があります。');
  console.log('\n修正ガイド:');
  console.log('  - 4列以上の表 → バージョン列などを機能列に統合して3列以内に');
  console.log('  - 長いセル文字 → 箇条書きに分離、または別セクションに移動');
  process.exit(1);
} else {
  console.log('\n✅ テーブルにエラーはありません（note.com 互換）');
  console.log('   ⚠️  警告は参考情報です。短くできる場合は修正を推奨します。');
  process.exit(0);
}
