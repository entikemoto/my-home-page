import { describe, it, expect } from 'vitest';
import { bodyToBlocks } from '../essay-markdown';

describe('bodyToBlocks（エッセイ本文 → ブロック）', () => {
  // known-failure: 2026-08-07〜09-10 の Vercel 本番ビルドが 4 回連続で失敗した原因。
  // "# " で始まる行を誰も消費できず while ループが進まなかった（content/essays/2026-05-10-dx-article-list.md の 1 行目）
  it('H1（"# "）行で無限ループせず見出しとして扱う', () => {
    const blocks = bodyToBlocks('# DX記事一覧\n\n本文です。');
    expect(blocks).toEqual([
      { type: 'heading', level: 2, content: 'DX記事一覧' },
      { type: 'paragraph', content: '本文です。' },
    ]);
  });

  it('#### 以降の深い見出しも level 3 として扱う', () => {
    expect(bodyToBlocks('#### 深い見出し')).toEqual([{ type: 'heading', level: 3, content: '深い見出し' }]);
  });

  it('"#" だけ・"#hashtag" のような行でも必ず進む（連続行は従来どおり 1 段落に結合）', () => {
    expect(bodyToBlocks('#hashtag\n#')).toEqual([{ type: 'paragraph', content: '#hashtag #' }]);
  });

  it('既存の構文（##・###・リスト・引用・コード・hr・段落）は従来どおり', () => {
    const body = ['## 見出し2', '### 見出し3', '- a', '- b', '> q1', '> q2', '```', 'code', '```', '---', 'p1', 'p2', ''].join('\n');
    expect(bodyToBlocks(body)).toEqual([
      { type: 'heading', level: 2, content: '見出し2' },
      { type: 'heading', level: 3, content: '見出し3' },
      { type: 'list', items: ['a', 'b'] },
      { type: 'blockquote', lines: ['q1', 'q2'] },
      { type: 'code', content: 'code' },
      { type: 'hr' },
      { type: 'paragraph', content: 'p1 p2' },
    ]);
  });
});
