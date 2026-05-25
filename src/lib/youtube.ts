import fs from 'node:fs';
import path from 'node:path';
import type { YouTubeVideo } from '@/types/content';

const YOUTUBE_FILE = path.join(process.cwd(), 'content', 'youtube.json');

let _cache: YouTubeVideo[] | null = null;

function loadVideos(): YouTubeVideo[] {
  if (_cache) return _cache;

  if (!fs.existsSync(YOUTUBE_FILE)) {
    _cache = [];
    return _cache;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(YOUTUBE_FILE, 'utf-8'));
  } catch {
    throw new Error(`[youtube] Failed to parse: ${YOUTUBE_FILE}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`[youtube] youtube.json must be an array`);
  }

  const videos = (parsed as YouTubeVideo[]).sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt)
  );
  _cache = videos;
  return _cache;
}

export function getYouTubeVideos(): YouTubeVideo[] {
  return loadVideos();
}

export function getLatestYouTubeVideos(count: number): YouTubeVideo[] {
  return loadVideos().slice(0, count);
}

export function getThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
