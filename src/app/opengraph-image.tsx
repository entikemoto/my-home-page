import { ImageResponse } from 'next/og';
import { loadJapaneseFont } from '@/lib/og-font';

export const alt = 'Takeshi Ikemoto — 医療 × 経営 × テクノロジー';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const tagline = '医療 × 経営 × テクノロジー';
  const sub = 'AI ニュースを臨床の眼で読み解く解説記事の書庫';
  const name = '池本毅  医師 / MBA / AIビルダー';
  const font = await loadJapaneseFont(`${tagline}${sub}${name}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(135deg, #14261F 0%, #1D342B 100%)',
          color: '#F7F4EC',
          fontFamily: font ? 'NotoSansJP' : 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, letterSpacing: 10, color: '#C2CEC7' }}>TAKESHI IKEMOTO</div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, marginTop: 28, lineHeight: 1.2 }}>{tagline}</div>
        <div style={{ display: 'flex', fontSize: 32, marginTop: 28, color: '#C2CEC7' }}>{sub}</div>
        <div style={{ display: 'flex', fontSize: 26, marginTop: 72, color: '#D9A86A' }}>{name}</div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: 'NotoSansJP', data: font, weight: 700, style: 'normal' }] : undefined,
    },
  );
}
