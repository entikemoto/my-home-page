/**
 * サイト全体の定数。URL は環境変数 NEXT_PUBLIC_SITE_URL で上書きできる
 * （カスタムドメイン取得時はそこを変えるだけでよい）。
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://my-home-page-ruby.vercel.app').replace(
  /\/$/,
  '',
);

export const SITE_NAME = 'Takeshi Ikemoto';
export const SITE_TAGLINE = '医療 × 経営 × テクノロジー';
export const SITE_DESCRIPTION =
  '医師・MBA・AIビルダー 池本毅の公式サイト。AI ニュースを臨床の眼で読み解く解説記事を 1 本ずつ蓄積し、探せる書庫として公開しています。';

export const SOCIAL = {
  x: 'https://x.com/Ikemoto1966',
  xHandle: '@Ikemoto1966',
  note: 'https://note.com/entikemoto',
  youtube: 'https://www.youtube.com/@drikemoto',
} as const;

export function absoluteUrl(pathname: string): string {
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}
