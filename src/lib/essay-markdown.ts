/**
 * エッセイ本文（軽量 Markdown）をブロック列に変換する。
 *
 * 2026-09-11 に src/app/essays/[slug]/page.tsx から移設。
 * 旧実装は "## " と "### " 以外の "#" 行（例: "# DX記事一覧"）を誰も消費できず
 * while ループが進まなくなり、Vercel の本番ビルドが 2026-08-07 から 4 回連続で
 * 失敗していた（テスト: __tests__/essay-markdown.test.ts）。
 * 方針: 見出しは "#" の数で level を決める（H1 は本文内では level 2 扱い）。
 * どの分岐にも当てはまらない行は段落として必ず 1 行進める（無限ループの安全弁）。
 */

export type BodyBlock =
  | { type: 'heading'; level: 2 | 3; content: string }
  | { type: 'list'; items: string[] }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'code'; content: string }
  | { type: 'hr' }
  | { type: 'paragraph'; content: string };

const HEADING = /^(#{1,6})\s+(.*)$/;

function isBlockStart(line: string): boolean {
  return (
    line.trim() === '' ||
    HEADING.test(line) ||
    line.startsWith('```') ||
    line.startsWith('>') ||
    line.trimStart().startsWith('- ') ||
    line.trim() === '---'
  );
}

export function bodyToBlocks(body: string): BodyBlock[] {
  const lines = body.split('\n');
  const blocks: BodyBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // コードブロック
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', content: codeLines.join('\n') });
      i++;
      continue;
    }

    // 見出し（# 〜 ######。H1・H2 → level 2、H3 以降 → level 3）
    const heading = line.match(HEADING);
    if (heading) {
      blocks.push({
        type: 'heading',
        level: heading[1].length <= 2 ? 2 : 3,
        content: heading[2].trim(),
      });
      i++;
      continue;
    }

    // HR
    if (line.trim() === '---') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // 空行
    if (line.trim() === '') {
      i++;
      continue;
    }

    // リスト
    if (line.trimStart().startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
        items.push(lines[i].replace(/^\s*-\s/, '').trim());
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // ブロッククォート
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'blockquote', lines: quoteLines });
      continue;
    }

    // 段落（連続する行をまとめる）。先頭行は無条件に取り込む＝必ず 1 行進む
    const paraLines: string[] = [line];
    i++;
    while (i < lines.length && !isBlockStart(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'paragraph', content: paraLines.join(' ') });
  }

  return blocks;
}
