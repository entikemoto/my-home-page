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
