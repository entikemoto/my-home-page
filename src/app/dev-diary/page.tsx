import type { Metadata } from 'next';
import Link from 'next/link';
import { getDevDiaryEntries } from '@/lib/dev-diary';
import type { DevDiaryEntryMeta } from '@/types/content';

export const metadata: Metadata = {
  title: 'Dev Log',
  description: '開発環境・ツール・ワークフローの進化記録。Claude Code や AI エージェント連携を日々アップデートしている記録。',
};

function DevDiaryCard({ entry }: { entry: DevDiaryEntryMeta }) {
  const date = new Date(entry.date);
  const dateLabel = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="bg-white border-l-2 border-l-transparent border border-gray-100 hover:border-l-gray-400 hover:border-gray-200 transition-all duration-200 flex gap-5 p-5">
      {/* 日付（左カラム） */}
      <div className="shrink-0 w-20 pt-0.5">
        <time dateTime={entry.date} className="text-xs text-gray-400 leading-tight block">
          {dateLabel}
        </time>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase block mb-1.5">
          Dev Log
        </span>
        <h2 className="font-serif text-base font-bold leading-snug mb-2">
          <Link href={`/dev-diary/${entry.slug}`} className="hover:text-gray-500 transition-colors">
            {entry.title}
          </Link>
        </h2>
        {entry.summary && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
            {entry.summary}
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] bg-gray-50 text-gray-400 font-mono">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function DevDiaryPage() {
  const entries = getDevDiaryEntries();

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2 text-gray-900">Dev Log</h1>
      <p className="text-sm text-gray-400 mb-3">{entries.length}件</p>
      <p className="text-sm text-gray-500 leading-relaxed mb-12">
        開発環境・AI エージェント構成・ワークフローの進化記録。毎日少しずつ改善している記録です。
      </p>

      {entries.length === 0 ? (
        <p className="text-gray-400">まだ記録がありません。</p>
      ) : (
        <div className="max-w-3xl flex flex-col gap-3">
          {entries.map((entry) => (
            <DevDiaryCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </main>
  );
}
