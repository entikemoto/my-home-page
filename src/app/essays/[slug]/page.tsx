import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getEssay, getEssays, _resetEssayCache } from '@/lib/essays';
import { absoluteUrl } from '@/lib/site';
import { formatDateJa } from '@/lib/article-labels';
import MarkdownBody from '@/components/MarkdownBody';
import ChannelLinks from '@/components/ChannelLinks';

if (process.env.NODE_ENV === 'development') {
  _resetEssayCache();
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getEssays().map((e) => ({ slug: e.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) return {};
  const url = absoluteUrl(`/essays/${essay.slug}`);
  return {
    title: essay.title,
    description: essay.summary,
    alternates: { canonical: url },
    openGraph: {
      title: essay.title,
      description: essay.summary,
      type: 'article',
      url,
      publishedTime: essay.publishedAt,
    },
  };
}

export default async function EssayPage({ params }: Props) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();

  return (
    <main className="px-6 lg:px-8">
      <article className="mx-auto max-w-[42rem] py-14 lg:py-20">
        <header className="mb-10">
          <p className="mb-5 flex items-center gap-3 text-xs tracking-[0.12em] text-gray-500">
            <span className="text-teal-700">エッセイ</span>
            <span aria-hidden className="text-gray-300">/</span>
            <time dateTime={essay.publishedAt}>{formatDateJa(essay.publishedAt)}</time>
          </p>
          <h1 className="font-serif text-[1.7rem] font-bold leading-[1.35] tracking-tight text-gray-900 lg:text-[2.35rem]">
            {essay.title}
          </h1>
          {essay.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {essay.tags.map((tag) => (
                <li key={tag} className="bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {tag}
                </li>
              ))}
            </ul>
          )}
          {essay.noteUrl && (
            <div className="mt-7">
              <ChannelLinks noteUrl={essay.noteUrl} />
            </div>
          )}
        </header>

        <div className="text-[1.02rem] leading-[2] text-gray-800">
          <MarkdownBody body={essay.body} />
        </div>

        <footer className="mt-14 border-t border-gray-200 pt-8 text-xs leading-relaxed text-gray-400">
          ※ 本記事は個人の見解であり、医療上の診断・治療の助言ではありません。
        </footer>
      </article>
    </main>
  );
}
