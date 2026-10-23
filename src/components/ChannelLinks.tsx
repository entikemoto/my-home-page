/**
 * 記事がどこで読めるかを示す導線（X / note / 元記事）。
 * 記事ページの見出し直下と、カードの下段で使う。
 */

type Props = {
  xUrl?: string;
  noteUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  size?: 'sm' | 'md';
};

function XGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2H21.5l-7.52 8.59L22.8 22h-6.93l-5.42-7.08L4.26 22H1l8.04-9.19L.6 2h7.1l4.9 6.48L18.24 2Zm-1.21 18h1.8L7.03 3.9H5.1L17.03 20Z" />
    </svg>
  );
}

export default function ChannelLinks({ xUrl, noteUrl, sourceUrl, sourceName, size = 'md' }: Props) {
  if (!xUrl && !noteUrl && !sourceUrl) return null;

  const base =
    size === 'md'
      ? 'inline-flex items-center gap-2 border px-4 py-2 text-xs tracking-[0.12em] transition-colors'
      : 'inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] tracking-[0.08em] transition-colors';

  return (
    <div className={`flex flex-wrap ${size === 'md' ? 'gap-2.5' : 'gap-1.5'}`}>
      {xUrl && (
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} border-gray-900 bg-gray-900 text-white hover:bg-gray-700 hover:border-gray-700`}
        >
          <XGlyph className={size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3'} />
          <span>X で読む</span>
        </a>
      )}
      {noteUrl && (
        <a
          href={noteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900`}
        >
          <span>note で読む</span>
        </a>
      )}
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} border-transparent text-gray-500 hover:text-gray-900 pl-1`}
        >
          <span>元記事{sourceName ? `（${sourceName}）` : ''} ↗</span>
        </a>
      )}
    </div>
  );
}
