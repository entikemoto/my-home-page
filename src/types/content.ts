/**
 * AIニュース解説以外のコンテンツ型定義
 *
 * ContentSource で「誰がどう書いたか」を型レベルで保証する（Anthropic提言）。
 *   ai-assisted   ... AI初稿 → 本人が編集・加筆（Essays）
 *   human-written ... 本人が直接執筆（Dev Log, Talks）
 */

export type ContentSource = 'ai-assisted' | 'human-written';

// ---------------------------------------------------------------------------
// Essay（独自記事）
// ---------------------------------------------------------------------------

export interface Essay {
  slug: string;
  title: string;
  publishedAt: string;    // ISO 8601
  summary: string;
  body: string;           // Markdown 本文
  tags: string[];
  noteUrl?: string;       // note.com に掲載している場合
  source: ContentSource;
}

export type EssayMeta = Omit<Essay, 'body'>;

// ---------------------------------------------------------------------------
// Dev Log（開発日誌）
// ---------------------------------------------------------------------------

export interface DevDiaryEntry {
  slug: string;
  title: string;
  date: string;           // YYYY-MM-DD
  summary: string;
  body: string;           // Markdown 本文
  tags: string[];         // e.g. ["claude-code", "workflow", "cursor"]
  source: 'human-written';
}

export type DevDiaryEntryMeta = Omit<DevDiaryEntry, 'body'>;

// ---------------------------------------------------------------------------
// Talk（登壇・発表実績）
// ---------------------------------------------------------------------------

export interface Talk {
  id: string;
  title: string;
  date: string;           // YYYY-MM-DD
  venue: string;          // "Clubhouse", "勉強会" etc.
  topic: string;
  description: string;
  url?: string;           // アーカイブ URL（あれば）
  tags: string[];
}
