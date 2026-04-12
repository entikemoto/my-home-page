'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { DevDiaryEntryMeta } from '@/types/content';

function DevDiaryCard({ entry }: { entry: DevDiaryEntryMeta }) {
  const dateLabel = new Date(`${entry.date}T00:00:00Z`).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <article className="bg-white border-l-2 border-l-transparent border border-gray-100 hover:border-l-gray-400 hover:border-gray-200 transition-all duration-200 flex flex-col">
      <div className="px-5 pt-5 pb-1">
        <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase">
          Dev Log
        </span>
      </div>

      <div className="px-5 py-4 flex-1 flex flex-col">
        <h2 className="font-serif text-base font-bold leading-snug mb-3 flex-1">
          <Link href={`/dev-diary/${entry.slug}`} className="hover:text-gray-500 transition-colors">
            {entry.title}
          </Link>
        </h2>

        {entry.summary && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {entry.summary}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-50">
          <time dateTime={entry.date} className="text-xs text-gray-400 block mb-2">
            {dateLabel}
          </time>
          <div className="flex flex-wrap gap-1">
            {entry.tags.map((tag) => (
              <Link
                key={tag}
                href={`/dev-diary?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-0.5 text-[10px] bg-gray-50 text-gray-400 font-mono hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

type Props = {
  allEntries: DevDiaryEntryMeta[];
  tags: string[];
};

export default function DevDiaryClient({ allEntries, tags }: Props) {
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get('tag') ?? '';

  const entries =
    tagFilter.length > 0
      ? allEntries.filter((e) => e.tags.includes(tagFilter))
      : allEntries;

  return (
    <>
      <p className="text-sm text-gray-400 mb-4">
        {tagFilter
          ? `「${tagFilter}」で絞り込み: ${entries.length}件 / 全${allEntries.length}件`
          : `${allEntries.length}件`}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-10 text-xs">
          <span className="text-gray-400 shrink-0">タグ:</span>
          <Link
            href="/dev-diary"
            className={`px-3 py-1 rounded-full border transition-colors ${
              !tagFilter
                ? 'border-gray-800 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            すべて
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/dev-diary?tag=${encodeURIComponent(tag)}`}
              className={`px-3 py-1 rounded-full border font-mono transition-colors ${
                tagFilter === tag
                  ? 'border-gray-800 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {entries.length === 0 ? (
        <p className="text-gray-400">
          {tagFilter ? 'このタグに該当する記録がありません。' : 'まだ記録がありません。'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <DevDiaryCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </>
  );
}
