import fs from 'node:fs';
import path from 'node:path';

const POSTS_FILE = path.join(process.cwd(), 'content', 'posts.md');

export type PostLink = {
  label: string;
  url: string;
};

export type PostEntry = {
  date: string;
  title: string;
  links: PostLink[];
};

// VaultPublisher が追記する行のフォーマット:
// - YYYY-MM-DD 「タイトル」 [X](URL) / [note](URL)
const LINE_PATTERN = /^-\s+(\d{4}-\d{2}-\d{2})\s+「(.+?)」\s*(.*)$/;
const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

export function parsePosts(markdown: string): PostEntry[] {
  const entries: PostEntry[] = [];
  for (const line of markdown.split('\n')) {
    const m = line.trim().match(LINE_PATTERN);
    if (!m) continue;
    const [, date, title, rest] = m;
    const links: PostLink[] = [];
    for (const lm of rest.matchAll(LINK_PATTERN)) {
      links.push({ label: lm[1], url: lm[2] });
    }
    entries.push({ date, title, links });
  }
  // 新しい順
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function getPosts(): PostEntry[] {
  if (!fs.existsSync(POSTS_FILE)) return [];
  return parsePosts(fs.readFileSync(POSTS_FILE, 'utf-8'));
}
