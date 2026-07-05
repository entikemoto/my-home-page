import type { Metadata } from 'next';
import { getPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Posts',
  description:
    '池本毅の発信アーカイブ。X（スレッド）と note で公開した記事・解説の一覧。医療AI・AI事業開発・開発ワークフローが中心テーマ。',
};

export default function PostsPage() {
  const posts = getPosts();

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2 text-gray-900">Posts</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-10 max-w-3xl">
        X と note での発信アーカイブです。各記事は X のスレッド（要点）と note（全文）で読めます。
      </p>

      {posts.length === 0 ? (
        <p className="text-sm text-gray-400">まだ発信記録がありません。</p>
      ) : (
        <ul className="max-w-3xl divide-y divide-gray-100">
          {posts.map((post) => (
            <li key={`${post.date}-${post.title}`} className="py-4 flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                <time className="text-xs text-gray-400 font-mono shrink-0">{post.date}</time>
                <span className="text-sm text-gray-900">{post.title}</span>
              </div>
              {post.links.length > 0 && (
                <div className="pl-[5.5rem] flex gap-3 text-xs">
                  {post.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
