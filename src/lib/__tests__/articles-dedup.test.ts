import { describe, it, expect } from 'vitest';
import { deduplicateArticles } from '@/lib/articles';
import type { HpArticle } from '@/types/article';

function art(over: Partial<HpArticle> & { articleId: string }): HpArticle {
  return {
    title: over.articleId,
    publishedAt: '2026-06-22T00:00:00+09:00',
    edition: 'standalone',
    orderInEdition: 1,
    body: 'b',
    originalSourceUrl: 'https://example.com/s',
    sourceName: 'note',
    tags: [],
    category: '',
    summary: 's',
    noteArticleUrl: `https://note.com/u/n/${over.articleId}`,
    format: 'digest',
    ...over,
  } as HpArticle;
}

describe('note 取り込み記事の重複排除', () => {
  it('同じ日の別の単発記事（standalone）は潰さない', () => {
    const a = art({ articleId: 'note-a', publishedAt: '2026-06-22T09:00:00+09:00' });
    const b = art({ articleId: 'note-b', publishedAt: '2026-06-22T20:00:00+09:00' });
    expect(deduplicateArticles([a, b]).map((x) => x.articleId)).toEqual(['note-a', 'note-b']);
  });

  it('正本（*_articles.json）と同じ note URL を持つ単発記事は落とす', () => {
    const canonical = art({ articleId: '2026-06-22_evening_1', edition: 'evening', noteArticleUrl: 'https://note.com/u/n/x' });
    const dup = art({ articleId: 'note-x', noteArticleUrl: 'https://note.com/u/n/x', publishedAt: '2026-06-22T20:07:00+09:00' });
    expect(deduplicateArticles([canonical, dup]).map((x) => x.articleId)).toEqual(['2026-06-22_evening_1']);
  });

  it('正本と同じタイトルの単発記事（note への再投稿）は落とす', () => {
    const canonical = art({ articleId: '2026-04-17_morning_1', edition: 'morning', title: 'インドIT産業がAIで変革期に' });
    const repost = art({ articleId: 'note-r', title: 'インドIT産業がAIで変革期に', noteArticleUrl: 'https://note.com/u/n/repost' });
    expect(deduplicateArticles([canonical, repost]).map((x) => x.articleId)).toEqual(['2026-04-17_morning_1']);
  });

  it('朝便・夜便は従来どおり「日付・便・順序」で正本を優先する', () => {
    const canonical = art({ articleId: '2026-06-22_morning_2', edition: 'morning', orderInEdition: 2 });
    const noteSplit = art({ articleId: 'note-m2', edition: 'morning', orderInEdition: 2, noteArticleUrl: 'https://note.com/u/n/digest' });
    const noteOnly = art({ articleId: 'note-m3', edition: 'morning', orderInEdition: 3, noteArticleUrl: 'https://note.com/u/n/digest' });
    expect(deduplicateArticles([canonical, noteSplit, noteOnly]).map((x) => x.articleId)).toEqual([
      '2026-06-22_morning_2',
      'note-m3',
    ]);
  });

  it('post 形式（Markdown 記事）は常に残る', () => {
    const post = art({ articleId: '2026-10-24-post-abcdef12', format: 'post', orderInEdition: 0, noteArticleUrl: 'https://note.com/u/n/p' });
    const noteDup = art({ articleId: 'note-p', noteArticleUrl: 'https://note.com/u/n/p' });
    expect(deduplicateArticles([post, noteDup]).map((x) => x.articleId)).toEqual(['2026-10-24-post-abcdef12']);
  });
});
