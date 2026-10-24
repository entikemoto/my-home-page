import { describe, it, expect } from 'vitest';
import path from 'node:path';
import os from 'node:os';

// known-failure（2026-10-24）: .env.local の HP_ARTICLES_DIR が移設前の vault パスを指したまま残り、
// ローカルだけ記事 0 件・記事ページ全 404 になっていた。存在しないパスが明示されていたら黙って 0 件にしない。
process.env.HP_ARTICLES_DIR = path.join(os.tmpdir(), 'hp-articles-does-not-exist-' + Date.now());

describe('HP_ARTICLES_DIR が存在しないパスを指す', () => {
  it('黙って 0 件にせず、設定ミスとしてエラーにする', async () => {
    const mod = await import('../articles');
    mod._resetCache();
    expect(() => mod.getArticles()).toThrow(/HP_ARTICLES_DIR/);
  });
});
