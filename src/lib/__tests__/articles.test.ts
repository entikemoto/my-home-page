import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import path from 'node:path';
import {
  getArticles,
  getArticle,
  getArticlesByTag,
  getArticlesByCategory,
  getArticlesByMonth,
  getAllTags,
  _resetCache,
} from '../articles';

// テストごとにキャッシュをリセット
beforeEach(() => _resetCache());
afterEach(() => _resetCache());

// HP_ARTICLES_DIR をフィクスチャディレクトリに向ける
const FIXTURE_DIR = path.join(process.cwd(), 'content', 'articles');
vi.stubEnv('HP_ARTICLES_DIR', FIXTURE_DIR);

describe('getArticles()', () => {
  it('全記事を最新順で返す', () => {
    const articles = getArticles();
    expect(articles.length).toBeGreaterThanOrEqual(2);

    // 最新順チェック
    for (let i = 0; i < articles.length - 1; i++) {
      expect(new Date(articles[i].publishedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(articles[i + 1].publishedAt).getTime(),
      );
    }
  });

  it('body フィールドを含まない', () => {
    const articles = getArticles();
    for (const a of articles) {
      expect(a).not.toHaveProperty('body');
    }
  });
});

describe('getArticle()', () => {
  it('存在する ID で記事（body 含む）を返す', () => {
    const article = getArticle('2026-03-18_morning_1');
    expect(article).not.toBeNull();
    expect(article?.title).toBe('OpenAIの新API発表が示す次の競争軸');
    expect(article?.body).toBeTruthy();
  });

  it('存在しない ID で null を返す', () => {
    expect(getArticle('nonexistent')).toBeNull();
  });
});

describe('getArticlesByTag()', () => {
  it('タグに一致する記事のみ返す', () => {
    const results = getArticlesByTag('医療AI');
    expect(results.length).toBeGreaterThanOrEqual(1);
    results.forEach((a) => expect(a.tags).toContain('医療AI'));
  });

  it('一致しないタグで空配列を返す', () => {
    expect(getArticlesByTag('存在しないタグ')).toEqual([]);
  });
});

describe('getArticlesByCategory()', () => {
  it('カテゴリーに一致する記事のみ返す', () => {
    const results = getArticlesByCategory('model');
    expect(results.length).toBeGreaterThanOrEqual(1);
    results.forEach((a) => expect(a.category).toBe('model'));
  });
});

describe('getArticlesByMonth()', () => {
  it('指定年月の記事のみ返す', () => {
    const results = getArticlesByMonth(2026, 3);
    expect(results.length).toBeGreaterThanOrEqual(2);
    results.forEach((a) => {
      const d = new Date(a.publishedAt);
      expect(d.getFullYear()).toBe(2026);
      expect(d.getMonth() + 1).toBe(3);
    });
  });

  it('存在しない年月で空配列を返す', () => {
    expect(getArticlesByMonth(2020, 1)).toEqual([]);
  });
});

describe('getAllTags()', () => {
  it('全タグを件数付きで返す', () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThanOrEqual(1);
    tags.forEach(({ tag, count }) => {
      expect(typeof tag).toBe('string');
      expect(count).toBeGreaterThan(0);
    });
  });

  it('件数の降順で返す', () => {
    const tags = getAllTags();
    for (let i = 0; i < tags.length - 1; i++) {
      expect(tags[i].count).toBeGreaterThanOrEqual(tags[i + 1].count);
    }
  });
});
