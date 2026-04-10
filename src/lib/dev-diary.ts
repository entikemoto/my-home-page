import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { DevDiaryEntry, DevDiaryEntryMeta } from '@/types/content';

const DEV_DIARY_DIR = path.join(process.cwd(), 'content', 'dev-diary');

// ---------------------------------------------------------------------------
// キャッシュ
// ---------------------------------------------------------------------------

// キャッシュはビルド時の静的生成専用。
// SSR（動的レンダリング）では各リクエストで再読込するため、
// Vercel サーバーレス環境でも鮮度の問題は起きない。
let _cache: DevDiaryEntry[] | null = null;

export function _resetDevDiaryCache(): void {
  _cache = null;
}

// ---------------------------------------------------------------------------
// 読み込み
// ---------------------------------------------------------------------------

function loadEntries(): DevDiaryEntry[] {
  if (_cache) return _cache;

  if (!fs.existsSync(DEV_DIARY_DIR)) {
    _cache = [];
    return _cache;
  }

  const files = fs
    .readdirSync(DEV_DIARY_DIR)
    .filter((f) => f.endsWith('.md'));

  const entries: DevDiaryEntry[] = [];

  for (const filename of files) {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(DEV_DIARY_DIR, filename);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(fileContent);

    entries.push({
      slug,
      title: String(data.title ?? ''),
      date: String(data.date ?? slug.slice(0, 10)),
      summary: String(data.summary ?? ''),
      body: content.trim(),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      source: 'human-written',
    });
  }

  // date 降順
  entries.sort((a, b) => b.date.localeCompare(a.date));

  _cache = entries;
  return _cache;
}

// ---------------------------------------------------------------------------
// 公開 API
// ---------------------------------------------------------------------------

export function getDevDiaryEntries(): DevDiaryEntryMeta[] {
  return loadEntries().map(({ body: _body, ...meta }) => meta);
}

export function getDevDiaryEntry(slug: string): DevDiaryEntry | null {
  return loadEntries().find((e) => e.slug === slug) ?? null;
}
