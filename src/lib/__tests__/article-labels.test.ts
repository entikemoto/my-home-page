import { describe, it, expect } from 'vitest';
import { stripLegacyGreeting } from '@/lib/articles';
import { formatDateJa } from '@/lib/article-labels';

describe('旧ダイジェスト要約の挨拶文を外す', () => {
  it('冒頭の「AI Daily Digestへようこそ。」だけを外す', () => {
    expect(stripLegacyGreeting('AI Daily Digestへようこそ。\n\nGemini の新 API は…')).toBe('Gemini の新 API は…');
  });
  it('挨拶文が無ければそのまま', () => {
    expect(stripLegacyGreeting('PFN が国産モデルを公開。')).toBe('PFN が国産モデルを公開。');
  });
  it('途中に出てくる同じ語句は消さない', () => {
    expect(stripLegacyGreeting('今日は AI Daily Digestへようこそ と書かれた記事')).toBe('今日は AI Daily Digestへようこそ と書かれた記事');
  });
});

describe('formatDateJa', () => {
  it('不正な日付は空文字（"Invalid Date" を出さない）', () => {
    expect(formatDateJa('')).toBe('');
  });
});
