import type { Metadata } from 'next';
import { getTalksByYear } from '@/lib/talks';
import type { Talk } from '@/types/content';

export const metadata: Metadata = {
  title: 'Talks',
  description: 'Clubhouse や勉強会での登壇・発表の記録。',
};

const VENUE_COLOR: Record<string, string> = {
  Clubhouse: 'text-green-700 bg-green-50',
  勉強会: 'text-blue-700 bg-blue-50',
  カンファレンス: 'text-purple-700 bg-purple-50',
};

function venueClass(venue: string): string {
  return VENUE_COLOR[venue] ?? 'text-gray-600 bg-gray-50';
}

function TalkCard({ talk }: { talk: Talk }) {
  const date = new Date(talk.date);
  const dateLabel = date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex gap-5 py-5 border-b border-gray-100 last:border-b-0">
      {/* 日付 */}
      <div className="shrink-0 w-16 pt-0.5 text-right">
        <time dateTime={talk.date} className="text-xs text-gray-400 leading-tight block">
          {dateLabel}
        </time>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] px-2 py-0.5 tracking-wide font-medium ${venueClass(talk.venue)}`}>
            {talk.venue}
          </span>
          <span className="text-[10px] text-gray-400">{talk.topic}</span>
        </div>

        <h3 className="font-serif text-base font-bold leading-snug mb-1.5 text-gray-900">
          {talk.url ? (
            <a href={talk.url} target="_blank" rel="noopener noreferrer"
              className="hover:text-gray-500 transition-colors">
              {talk.title}
            </a>
          ) : (
            talk.title
          )}
        </h3>

        {talk.description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-2">{talk.description}</p>
        )}

        <div className="flex flex-wrap gap-1">
          {talk.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] bg-gray-50 text-gray-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TalksPage() {
  const groups = getTalksByYear();
  const total = groups.reduce((sum, g) => sum + g.talks.length, 0);

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2 text-gray-900">Talks</h1>
      <p className="text-sm text-gray-400 mb-3">{total}件</p>
      <p className="text-sm text-gray-500 leading-relaxed mb-12">
        Clubhouse や勉強会での登壇・発表の記録。医療AI・起業・AI活用をテーマに話しています。
      </p>

      {groups.length === 0 ? (
        <p className="text-gray-400">まだ登壇記録がありません。</p>
      ) : (
        <div className="max-w-3xl space-y-12">
          {groups.map(({ year, talks }) => (
            <section key={year}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                {year}
              </h2>
              <div>
                {talks.map((talk) => (
                  <TalkCard key={talk.id} talk={talk} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
