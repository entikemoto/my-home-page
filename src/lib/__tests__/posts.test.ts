import { describe, expect, it } from 'vitest';
import { parsePosts } from '../posts';

describe('parsePosts', () => {
  it('VaultPublisher の行フォーマットをパースする', () => {
    const md = [
      '# 発信一覧',
      '',
      '- 2026-07-05 「医療AIの記事」 [X](https://x.com/i/status/1) / [note](https://note.com/n/1)',
    ].join('\n');
    const posts = parsePosts(md);
    expect(posts).toHaveLength(1);
    expect(posts[0].date).toBe('2026-07-05');
    expect(posts[0].title).toBe('医療AIの記事');
    expect(posts[0].links).toEqual([
      { label: 'X', url: 'https://x.com/i/status/1' },
      { label: 'note', url: 'https://note.com/n/1' },
    ]);
  });

  it('リンクなし・片方のみの行も許容する', () => {
    const md = [
      '- 2026-07-01 「リンクなし記事」',
      '- 2026-07-02 「Xのみ記事」 [X](https://x.com/i/status/2)',
    ].join('\n');
    const posts = parsePosts(md);
    expect(posts).toHaveLength(2);
    expect(posts[1].links).toHaveLength(0);
    expect(posts[0].links).toHaveLength(1);
  });

  it('フォーマット外の行（見出し・コメント）は無視する', () => {
    const md = ['# 見出し', '<!-- コメント -->', '- 行フォーマット違い', '普通の文章'].join('\n');
    expect(parsePosts(md)).toHaveLength(0);
  });

  it('新しい日付が先頭に来る', () => {
    const md = [
      '- 2026-07-01 「古い」',
      '- 2026-07-05 「新しい」',
    ].join('\n');
    const posts = parsePosts(md);
    expect(posts[0].title).toBe('新しい');
  });
});
