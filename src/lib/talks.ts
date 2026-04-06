import fs from 'node:fs';
import path from 'node:path';
import type { Talk } from '@/types/content';

const TALKS_FILE = path.join(process.cwd(), 'content', 'talks.json');

// ---------------------------------------------------------------------------
// キャッシュ
// ---------------------------------------------------------------------------

let _cache: Talk[] | null = null;

// ---------------------------------------------------------------------------
// 読み込み
// ---------------------------------------------------------------------------

function loadTalks(): Talk[] {
  if (_cache) return _cache;

  if (!fs.existsSync(TALKS_FILE)) {
    _cache = [];
    return _cache;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(TALKS_FILE, 'utf-8'));
  } catch {
    throw new Error(`[talks] Failed to parse: ${TALKS_FILE}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`[talks] talks.json must be an array`);
  }

  const talks = (parsed as Talk[]).sort((a, b) => b.date.localeCompare(a.date));
  _cache = talks;
  return _cache;
}

// ---------------------------------------------------------------------------
// 公開 API
// ---------------------------------------------------------------------------

export function getTalks(): Talk[] {
  return loadTalks();
}

/** 年ごとにグループ化 */
export function getTalksByYear(): { year: number; talks: Talk[] }[] {
  const talks = loadTalks();
  const map = new Map<number, Talk[]>();

  for (const talk of talks) {
    const year = parseInt(talk.date.slice(0, 4), 10);
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(talk);
  }

  return [...map.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, items: items.sort((a, b) => b.date.localeCompare(a.date)) }))
    .map(({ year, items }) => ({ year, talks: items }));
}
