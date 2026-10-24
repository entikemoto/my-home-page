import { ImageResponse } from 'next/og';
import { getArticle } from '@/lib/articles';
import { loadJapaneseFont } from '@/lib/og-font';
import { formatDateJa } from '@/lib/article-labels';

export const alt = '記事カード';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = { params: Promise<{ articleId: string }> };

export default async function Image({ params }: Props) {
  const { articleId } = await params;
  const article = getArticle(articleId);
  const title = article?.title ?? 'Takeshi Ikemoto';
  const date = article ? formatDateJa(article.publishedAt) : '';
  const name = '池本毅  医師 / MBA / AIビルダー';

  const font = await loadJapaneseFont(`${title}${date}${name}Takeshi Ikemoto`);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #14261F 0%, #1D342B 100%)',
          color: '#F7F4EC',
          fontFamily: font ? 'NotoSansJP' : 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 24, color: '#C2CEC7', letterSpacing: 2 }}>
          {date && <span>{date}</span>}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 40 ? 52 : 62,
            fontWeight: 700,
            lineHeight: 1.35,
            letterSpacing: -1,
            maxHeight: 360,
            overflow: 'hidden',
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 26, color: '#C2CEC7' }}>
          <span>{name}</span>
          <span style={{ letterSpacing: 4, fontSize: 22 }}>TAKESHI IKEMOTO</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: 'NotoSansJP', data: font, weight: 700, style: 'normal' }] : undefined,
    },
  );
}
