/**
 * OGP 画像（next/og の ImageResponse）用の日本語フォント読み込み。
 *
 * ImageResponse の既定フォントは日本語を描けない。Google Fonts の CSS API に
 * `text=` を渡すと、その文字だけを含むサブセットを返すので、記事ごとに必要な字だけ取る。
 * 取得に失敗したら null を返し、呼び出し側は既定フォントで描く（ビルドを落とさない）。
 */

const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap';

export async function loadJapaneseFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const unique = Array.from(new Set(Array.from(text))).join('');
    const css = await fetch(`${FONT_CSS}&text=${encodeURIComponent(unique)}`, {
      // 古い UA を名乗ると TTF/OTF（ImageResponse が読める形式）で返る
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:12.0) Gecko/20100101 Firefox/12.0' },
      next: { revalidate: 60 * 60 * 24 * 30 },
    }).then((r) => (r.ok ? r.text() : ''));
    const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype)'\)/);
    if (!match) return null;
    const res = await fetch(match[1], { next: { revalidate: 60 * 60 * 24 * 30 } });
    return res.ok ? res.arrayBuffer() : null;
  } catch {
    return null;
  }
}
