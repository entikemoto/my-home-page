import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getDevDiaryEntries } from '@/lib/dev-diary';
import DevDiaryClient from './DevDiaryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dev Log',
  description: '開発環境・ツール・ワークフローの進化記録。Claude Code や AI エージェント連携を日々アップデートしている記録。',
};

function collectTags(entries: ReturnType<typeof getDevDiaryEntries>): string[] {
  const set = new Set<string>();
  for (const e of entries) {
    for (const t of e.tags) {
      set.add(t);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'ja'));
}

// searchParams を使わないため、このページはビルド時に静的生成される。
// コンテンツは content/dev-diary/*.md からビルド時に読み込まれる。
export default function DevDiaryPage() {
  const allEntries = getDevDiaryEntries();
  const tags = collectTags(allEntries);

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2 text-gray-900">Dev Log</h1>
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

      {/* useSearchParams を使うため Suspense が必要 */}
      <Suspense fallback={<p className="text-sm text-gray-400">読み込み中...</p>}>
        <DevDiaryClient allEntries={allEntries} tags={tags} />
      </Suspense>
    </main>
  );
}
