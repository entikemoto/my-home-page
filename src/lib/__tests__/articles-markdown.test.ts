import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// 一時ディレクトリを記事置き場にして、post 形式（Markdown）と digest 形式（JSON）の混在を検証する。
// 環境変数はモジュール読み込み前に設定する必要があるため、動的 import を使う。

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hp-articles-'));
process.env.HP_ARTICLES_DIR = tmp;
process.env.HP_ARTICLE_OVERRIDES_FILE = path.join(tmp, 'overrides.json');
process.env.HP_ARTICLE_XLINKS_FILE = path.join(tmp, 'x-links.json');

const DIGEST = [
  {
    articleId: '2026-06-23_morning_1',
    title: '旧形式の記事',
    publishedAt: '2026-06-23T00:00:00+00:00',
    edition: 'morning',
    orderInEdition: 1,
    body: '> [元](https://example.com/src)\n\n### 一言で言うと\n\n旧形式の本文。',
    originalSourceUrl: 'https://example.com/src',
    sourceName: 'Example',
    tags: ['AI'],
    category: '',
    summary: '旧形式の要約',
    noteArticleUrl: 'https://note.com/entikemoto/n/n0000000000',
  },
];

const POST = `---
title: X 記事のテスト
publishedAt: 2026-10-24T09:00:00+09:00
xUrl: https://x.com/Ikemoto1966/status/1
noteUrl: https://note.com/entikemoto/n/n1111111111
tags:
  - AIエージェント
  - 医療AI
coverImage: /images/articles/2026-10-24-test.png
---

### 一言で言うと

最初の段落が要約になる。**太字**と[リンク](https://example.com)を含む。

本文の続き。
`;

const POST_SAME_DAY = `---
title: 同じ日のもう 1 本
publishedAt: 2026-10-24T18:00:00+09:00
---

同じ日に 2 本あっても両方残る。
`;

type ArticlesModule = typeof import('../articles');
let mod: ArticlesModule;

beforeAll(async () => {
  fs.writeFileSync(path.join(tmp, 'AI_Daily_Digest_2026-06-23_morning_articles.json'), JSON.stringify(DIGEST));
  fs.writeFileSync(path.join(tmp, '2026-10-24-x-test-abcdef12.md'), POST);
  fs.writeFileSync(path.join(tmp, '2026-10-24-post-12345678.md'), POST_SAME_DAY);
  fs.writeFileSync(
    path.join(tmp, 'x-links.json'),
    JSON.stringify({ _meta: { note: 'test' }, '2026-06-23_morning_1': 'https://x.com/Ikemoto1966/status/999' }),
  );
  mod = await import('../articles');
});

beforeEach(() => mod._resetCache());

afterAll(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe('Markdown 記事（post 形式）の読み込み', () => {
  it('frontmatter と本文を HpArticle に正規化する', () => {
    const a = mod.getArticle('2026-10-24-x-test-abcdef12');
    expect(a).not.toBeNull();
    expect(a?.format).toBe('post');
    expect(a?.edition).toBe('standalone');
    expect(a?.orderInEdition).toBe(0);
    expect(a?.title).toBe('X 記事のテスト');
    expect(a?.xUrl).toBe('https://x.com/Ikemoto1966/status/1');
    expect(a?.noteArticleUrl).toBe('https://note.com/entikemoto/n/n1111111111');
    expect(a?.tags).toEqual(['AIエージェント', '医療AI']);
    expect(a?.coverImage).toBe('/images/articles/2026-10-24-test.png');
    expect(a?.sourceName).toBe('X');
    expect(a?.category).toBe('post');
    expect(a?.body.startsWith('### 一言で言うと')).toBe(true);
  });

  it('summary が無ければ本文の最初の段落から作る（装飾を外す）', () => {
    const a = mod.getArticle('2026-10-24-x-test-abcdef12');
    expect(a?.summary).toBe('最初の段落が要約になる。太字とリンクを含む。');
  });

  it('同じ日の post 記事が複数あっても両方残る', () => {
    const ids = mod.getArticles().map((a) => a.articleId);
    expect(ids).toContain('2026-10-24-x-test-abcdef12');
    expect(ids).toContain('2026-10-24-post-12345678');
  });

  it('旧 JSON 記事と混在し、最新順に並ぶ', () => {
    const list = mod.getArticles();
    expect(list.length).toBe(3);
    expect(list[0].format).toBe('post');
    expect(list[list.length - 1].articleId).toBe('2026-06-23_morning_1');
    expect(list[list.length - 1].format).toBe('digest');
  });

  it('post 記事はタグ・月別の絞り込みに乗る', () => {
    expect(mod.getArticlesByTag('医療AI').map((a) => a.articleId)).toEqual(['2026-10-24-x-test-abcdef12']);
    expect(mod.getArticlesByMonth(2026, 10).length).toBe(2);
  });
});

describe('x-links.json による過去記事の X リンク補完', () => {
  it('digest 記事に xUrl が付く', () => {
    expect(mod.getArticle('2026-06-23_morning_1')?.xUrl).toBe('https://x.com/Ikemoto1966/status/999');
  });

  it('frontmatter に xUrl がある post 記事は上書きしない', () => {
    expect(mod.getArticle('2026-10-24-x-test-abcdef12')?.xUrl).toBe('https://x.com/Ikemoto1966/status/1');
  });
});

describe('post 形式の契約違反はビルドエラーにする', () => {
  it('title 欠落', () => {
    const bad = path.join(tmp, 'bad.md');
    fs.writeFileSync(bad, '---\npublishedAt: 2026-10-24\n---\n本文');
    try {
      expect(() => mod.loadMarkdownArticle(bad)).toThrow(/title/);
    } finally {
      fs.unlinkSync(bad);
    }
  });

  it('coverImage がサイト内パスでない', () => {
    const bad = path.join(tmp, 'bad2.md');
    fs.writeFileSync(bad, '---\ntitle: t\npublishedAt: 2026-10-24\ncoverImage: https://example.com/a.png\n---\n本文');
    try {
      expect(() => mod.loadMarkdownArticle(bad)).toThrow(/coverImage/);
    } finally {
      fs.unlinkSync(bad);
    }
  });

  it('xUrl が URL でない', () => {
    const bad = path.join(tmp, 'bad3.md');
    fs.writeFileSync(bad, '---\ntitle: t\npublishedAt: 2026-10-24\nxUrl: not-a-url\n---\n本文');
    try {
      expect(() => mod.loadMarkdownArticle(bad)).toThrow(/xUrl/);
    } finally {
      fs.unlinkSync(bad);
    }
  });
});
