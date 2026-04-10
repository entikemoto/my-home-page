import type { Metadata } from 'next';
import Link from 'next/link';
import { getDevDiaryEntries } from '@/lib/dev-diary';
import type { DevDiaryEntryMeta } from '@/types/content';

export const metadata: Metadata = {
  title: 'Dev Log',
  description: '開発環境・ツール・ワークフローの進化記録。Claude Code や AI エージェント連携を日々アップデートしている記録。',
};

function collectTags(entries: DevDiaryEntryMeta[]): string[] {
  const set = new Set<string>();
  for (const e of entries) {
    for (const t of e.tags) {
      set.add(t);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'ja'));
}

function DevDiaryCard({ entry }: { entry: DevDiaryEntryMeta }) {
  // YYYY-MM-DD を UTC 固定でパースし、サーバーのタイムゾーンによる
  // 前日/翌日ズレを防ぐ
  const dateLabel = new Date(`${entry.date}T00:00:00Z`).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <article className="bg-white border-l-2 border-l-transparent border border-gray-100 hover:border-l-gray-400 hover:border-gray-200 transition-all duration-200 flex gap-5 p-5">
      <div className="shrink-0 w-20 pt-0.5">
        <time dateTime={entry.date} className="text-xs text-gray-400 leading-tight block">
          {dateLabel}
        </time>
      </div>

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
    </article>
  );
}

type PageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function DevDiaryPage({ searchParams }: PageProps) {
  const { tag: tagFilter } = await searchParams;
  const allEntries = getDevDiaryEntries();
  const tags = collectTags(allEntries);

  const entries =
    tagFilter && tagFilter.length > 0
      ? allEntries.filter((e) => e.tags.includes(tagFilter))
      : allEntries;

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2 text-gray-900">Dev Log</h1>
      <p className="text-sm text-gray-400 mb-4">
        {tagFilter ? `「${tagFilter}」で絞り込み: ${entries.length}件 / 全${allEntries.length}件` : `${entries.length}件`}
      </p>
      <div className="text-sm text-gray-500 leading-relaxed mb-6 max-w-3xl space-y-2">
        <p>
          開発環境・AI エージェント構成・ワークフローの変遷を記録しています。本文の正本は Obsidian Vault の{' '}
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">docs/</code> 配下から同期したものと、手書きのエントリがあります。
        </p>
        <p>
          タグで種類を絞り込めます（例: <span className="font-mono text-xs">tool-audit</span> はツール横断の定期チェック、
          <span className="font-mono text-xs"> changelog-check</span> は Claude Code の更新調査、
          <span className="font-mono text-xs"> dev-env-log</span> は開発環境ログ由来）。
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-10 text-xs">
          <span className="text-gray-400 shrink-0">タグ:</span>
          <Link
            href="/dev-diary"
            className={`px-3 py-1 rounded-full border transition-colors ${
              !tagFilter ? 'border-gray-800 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            すべて
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/dev-diary?tag=${encodeURIComponent(tag)}`}
              className={`px-3 py-1 rounded-full border font-mono transition-colors ${
                tagFilter === tag ? 'border-gray-800 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
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
        <div className="max-w-3xl flex flex-col gap-3">
          {entries.map((entry) => (
            <DevDiaryCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </main>
  );
}
