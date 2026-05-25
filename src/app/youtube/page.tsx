import type { Metadata } from 'next';
import Image from 'next/image';
import { getYouTubeVideos, getThumbnailUrl, getVideoUrl } from '@/lib/youtube';
import type { YouTubeVideo } from '@/types/content';

export const metadata: Metadata = {
  title: 'YouTube — いびき・睡眠時無呼吸チャンネル',
  description: 'いびき・睡眠時無呼吸症候群（SAS）の原因・症状・治療を医師がわかりやすく解説。いけもと耳鼻咽喉科クリニック監修。',
};

function VideoCard({ video }: { video: YouTubeVideo }) {
  const date = new Date(video.publishedAt);
  const dateLabel = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <a
      href={getVideoUrl(video.videoId)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 bg-white"
    >
      {/* サムネイル */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <Image
          src={getThumbnailUrl(video.videoId)}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* 再生ボタンオーバーレイ */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6 4l9 5-9 5V4z" fill="#14261F" />
            </svg>
          </div>
        </div>
      </div>

      {/* テキスト */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-red-600 tracking-[0.3em] uppercase font-medium">YouTube</span>
        </div>
        <h3 className="font-serif text-base font-bold leading-snug mb-2 text-gray-900 group-hover:text-gray-600 transition-colors">
          {video.title}
        </h3>
        {video.summary && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {video.summary}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <time dateTime={video.publishedAt} className="text-xs text-gray-400">
            {dateLabel}
          </time>
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-[10px] bg-gray-50 text-gray-400 font-mono">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function YouTubePage() {
  const videos = getYouTubeVideos();

  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-[10px] tracking-[0.5em] text-gray-400 uppercase mb-6">YouTube</p>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-black text-gray-900 leading-tight mb-5">
            いびき・睡眠時無呼吸、<br />
            正しく知る。
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xl mb-4">
            朝スッキリ起きられない、日中眠い、いびきがうるさい――<br />
            それは「ただの疲れ」ではなく、睡眠時無呼吸症候群（SAS）のサインかもしれません。
          </p>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xl mb-8">
            SASの原因・症状・検査・治療、いびきや鼻づまりの改善法、睡眠の質を上げる生活習慣を<br />
            いけもと耳鼻咽喉科クリニック（埼玉県草加市）の医師がわかりやすく解説します。
          </p>
          <a
            href="https://www.youtube.com/@drikemoto"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#14261F] text-white text-xs tracking-[0.15em] hover:bg-[#1D342B] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.6 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.3.6 9.3.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
            </svg>
            チャンネルを見る
          </a>
        </div>
      </section>

      {/* ─── 動画一覧 ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {videos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm mb-4">動画を準備中です。</p>
              <a
                href="https://www.youtube.com/@drikemoto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-4"
              >
                YouTube チャンネルをチェック →
              </a>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-8">{videos.length}本</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
