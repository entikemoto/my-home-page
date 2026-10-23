import type { MetadataRoute } from 'next';
import { getArticles, getAllTags } from '@/lib/articles';
import { getEssays } from '@/lib/essays';
import { getDevDiaryEntries } from '@/lib/dev-diary';
import { tagToSlug } from '@/lib/tag-slug';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['/', '/articles', '/essays', '/dev-diary', '/posts', '/youtube', '/talks', '/publications', '/lab', '/about'];

  const articles = getArticles();
  const latest = articles[0]?.publishedAt ? new Date(articles[0].publishedAt) : new Date();
  // 日付が欠けている・壊れているコンテンツがあっても sitemap 全体を落とさない
  const safeDate = (value: string): Date => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? latest : d;
  };

  return [
    ...staticPages.map((p) => ({
      url: absoluteUrl(p),
      lastModified: latest,
      changeFrequency: (p === '/' || p === '/articles' ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: p === '/' ? 1 : p === '/articles' ? 0.9 : 0.6,
    })),
    ...articles.map((a) => ({
      url: absoluteUrl(`/articles/${a.articleId}`),
      lastModified: safeDate(a.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // 1 記事しか無いタグ（1,000 以上ある）は sitemap に載せない
    ...getAllTags().filter(({ count }) => count >= 2).map(({ tag }) => ({
      url: absoluteUrl(`/articles/tag/${tagToSlug(tag)}`),
      lastModified: latest,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
    ...getEssays().map((e) => ({
      url: absoluteUrl(`/essays/${e.slug}`),
      lastModified: safeDate(e.publishedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
    ...getDevDiaryEntries().map((d) => ({
      url: absoluteUrl(`/dev-diary/${d.slug}`),
      lastModified: safeDate(`${d.date}T00:00:00Z`),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}
