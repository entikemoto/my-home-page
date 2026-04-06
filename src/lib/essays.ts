import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Essay, EssayMeta } from '@/types/content';

const ESSAYS_DIR = path.join(process.cwd(), 'content', 'essays');

// ---------------------------------------------------------------------------
// キャッシュ
// ---------------------------------------------------------------------------

let _cache: Essay[] | null = null;

export function _resetEssayCache(): void {
  _cache = null;
}

// ---------------------------------------------------------------------------
// 読み込み
// ---------------------------------------------------------------------------

function loadEssays(): Essay[] {
  if (_cache) return _cache;

  if (!fs.existsSync(ESSAYS_DIR)) {
    _cache = [];
    return _cache;
  }

  const files = fs
    .readdirSync(ESSAYS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .reverse(); // ファイル名 YYYY-MM-DD-... 形式で降順

  const essays: Essay[] = [];

  for (const filename of files) {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(ESSAYS_DIR, filename);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(fileContent);

    essays.push({
      slug,
      title: String(data.title ?? ''),
      publishedAt: String(data.publishedAt ?? ''),
      summary: String(data.summary ?? ''),
      body: content.trim(),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      noteUrl: data.noteUrl ? String(data.noteUrl) : undefined,
      source: data.source === 'human-written' ? 'human-written' : 'ai-assisted',
    });
  }

  // publishedAt 降順（明示的に並び替え）
  essays.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  _cache = essays;
  return _cache;
}

// ---------------------------------------------------------------------------
// 公開 API
// ---------------------------------------------------------------------------

export function getEssays(): EssayMeta[] {
  return loadEssays().map(({ body: _body, ...meta }) => meta);
}

export function getEssay(slug: string): Essay | null {
  return loadEssays().find((e) => e.slug === slug) ?? null;
}
