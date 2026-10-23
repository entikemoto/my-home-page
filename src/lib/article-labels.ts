import type { HpArticleMeta } from '@/types/article';

const EDITION_LABEL: Record<string, string> = {
  morning: '朝便',
  evening: '夜便',
};

const CATEGORY_LABEL: Record<string, string> = {
  'deep-dive': 'Deep Dive',
  feature: 'note 記事',
  post: 'X 記事',
};

/** カード・記事ページの肩に出す種別ラベル */
export function articleKindLabel(article: Pick<HpArticleMeta, 'format' | 'edition' | 'orderInEdition' | 'category'>): string {
  if (article.format === 'post') return CATEGORY_LABEL[article.category] ?? 'X 記事';
  if (article.edition === 'standalone') return CATEGORY_LABEL[article.category] ?? 'note 記事';
  return `AI Daily Digest ${EDITION_LABEL[article.edition] ?? article.edition}`;
}

export function formatDateJa(iso: string, style: 'long' | 'short' = 'long'): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return ''; // 日付の無いコンテンツで "Invalid Date" を出さない
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'Asia/Tokyo',
  });
}
