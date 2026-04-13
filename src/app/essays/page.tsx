import type { Metadata } from 'next';
import Link from 'next/link';
import { getEssays } from '@/lib/essays';
import type { EssayMeta } from '@/types/content';

export const metadata: Metadata = {
  title: 'Essays',
  description: '医療・経営・テクノロジーをテーマに考えていることを書いた考察記事。',
};

function EssayCard({ essay }: { essay: EssayMeta }) {
  const date = new Date(essay.publishedAt);
  const dateLabel = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="bg-white border-l-2 border-l-transparent border border-gray-100 hover:border-l-teal-600 hover:border-gray-200 transition-all duration-200 flex flex-col">
      <div className="px-5 pt-5 pb-1 flex items-center justify-between">
        <span className="text-[10px] text-teal-600 tracking-[0.3em] uppercase">Essay</span>
        {essay.noteUrl && (
          <a
            href={essay.noteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors tracking-wide"
          >
            note ↗
          </a>
        )}
      </div>

      <div className="px-5 py-4 flex-1 flex flex-col">
        <h2 className="font-serif text-base font-bold leading-snug mb-3 flex-1">
          <Link
            href={`/essays/${essay.slug}`}
            className="hover:text-gray-500 transition-colors"
          >
            {essay.title}
          </Link>
        </h2>

        {essay.summary && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {essay.summary}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
          <time dateTime={essay.publishedAt}>{dateLabel}</time>
          <div className="flex flex-wrap gap-1 justify-end">
            {essay.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-gray-50 text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function EssaysPage() {
  const essays = getEssays();

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2 text-gray-900">Essays</h1>
      <p className="text-sm text-gray-400 mb-3">{essays.length}件</p>
      <p className="text-sm text-gray-500 leading-relaxed mb-12">
        医療・経営・テクノロジーの交差点で考えていることを書いています。
      </p>

      {essays.length === 0 ? (
        <p className="text-gray-400">まだ記事がありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {essays.map((essay) => (
            <EssayCard key={essay.slug} essay={essay} />
          ))}
        </div>
      )}
    </main>
  );
}
