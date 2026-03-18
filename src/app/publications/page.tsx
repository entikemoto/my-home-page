import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publications',
  description: '池本毅が出版したKindle本一覧。医療×AI×テクノロジーをテーマにした実践的な書籍。日英同時リリース。',
};

type Book = {
  title: string;
  subtitle?: string;
  lang: 'ja' | 'en';
  asin: string;
  description: string;
};

type BookGroup = {
  theme: string;
  themeEn: string;
  books: [Book, Book]; // [ja, en]
};

const bookGroups: BookGroup[] = [
  {
    theme: '医療とAI',
    themeEn: 'Medicine × AI',
    books: [
      {
        title: '拡張する医療',
        subtitle: 'AIがひらく、人間の限界の先へ',
        lang: 'ja',
        asin: 'B0GHZRDLYG',
        description: 'AIが切り拓く医療の未来。現場医師の視点から、人間の限界を越えた医療の可能性を問い直す。',
      },
      {
        title: 'Medicine × AI: Augmented Healthcare',
        subtitle: 'Beyond Human Limits with AI',
        lang: 'en',
        asin: 'B0GJJWV482',
        description: 'An English exploration of how AI augments medical practice, written from the perspective of a practicing physician.',
      },
    ],
  },
  {
    theme: 'AI事業開発',
    themeEn: 'AI-Driven Business',
    books: [
      {
        title: '非エンジニアでもできる生成AI事業開発入門',
        lang: 'ja',
        asin: 'B0GJPN6H5Q',
        description: 'Claude Code・Cursor・Windsurfを使い、アイデアをプロトタイプへ変える実践的なAI事業開発の入門書。',
      },
      {
        title: 'AI-Driven Business Development for Non-Engineers',
        subtitle: "How to Build Your 'AI Team' with Claude Code, Cursor, and Windsurf",
        lang: 'en',
        asin: 'B0GJPCWMJP',
        description: 'A practical English guide to turning business ideas into prototypes using AI tools—no engineering background required.',
      },
    ],
  },
  {
    theme: 'AIペアライティング',
    themeEn: 'AI Pair Writing',
    books: [
      {
        title: '非エンジニアのためのAIペアライティング',
        lang: 'ja',
        asin: 'B0GJGCNSZL',
        description: 'AIとペアを組んで書く実践ガイド。信頼性を保ちながら深掘り・改訂・監査を行うワークフローを解説する。',
      },
      {
        title: 'AI Pair Writing for Non-Engineers',
        subtitle: 'How to Deep Dive, Revise, and Audit While Maintaining Reliability',
        lang: 'en',
        asin: 'B0GJJZ5VZ6',
        description: 'The English counterpart—a hands-on guide to collaborative AI writing that preserves accuracy and depth.',
      },
    ],
  },
];

export default function PublicationsPage() {
  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="py-24 lg:py-32 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.5em] text-gray-400 uppercase mb-8">
              Publications
            </p>
            <h1 className="font-serif text-[clamp(3rem,7vw,5.5rem)] font-black text-gray-900 leading-tight mb-5">
              出版物
            </h1>
            <p className="text-[10px] tracking-[0.4em] text-amber-700 uppercase border-l border-amber-700 pl-3 mb-10">
              6 Kindle Books — 日英同時リリース
            </p>
            <p className="text-gray-600 text-sm leading-relaxed max-w-lg">
              医療×AI×テクノロジーをテーマに、現場医師の視点から書いた実践的なKindle本。
              全6冊を日本語・英語で同時リリース。
            </p>
          </div>
        </div>
      </section>

      {/* ─── Book Groups ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-20 lg:space-y-28">
          {bookGroups.map((group) => (
            <div key={group.themeEn}>
              {/* Theme Label */}
              <div className="flex items-center gap-6 mb-10">
                <div>
                  <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-1">
                    {group.themeEn}
                  </p>
                  <h2 className="font-serif text-xl font-bold text-gray-900">
                    {group.theme}
                  </h2>
                </div>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* JP + EN pair */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.books.map((book) => (
                  <article
                    key={book.asin}
                    className="border-l-2 border-l-transparent border border-gray-100 hover:border-l-amber-700 hover:border-gray-200 transition-all duration-200 p-7 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className={`text-[9px] tracking-[0.3em] uppercase px-2 py-0.5 border ${
                        book.lang === 'ja'
                          ? 'border-gray-200 text-gray-400'
                          : 'border-amber-700/30 text-amber-700'
                      }`}>
                        {book.lang === 'ja' ? '日本語' : 'English'}
                      </span>
                    </div>

                    <h3 className="font-serif text-base lg:text-lg font-bold text-gray-900 leading-snug mb-2 flex-1">
                      {book.title}
                    </h3>
                    {book.subtitle && (
                      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                        {book.subtitle}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      {book.description}
                    </p>

                    <a
                      href={`https://www.amazon.co.jp/dp/${book.asin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs tracking-[0.2em] text-amber-700 hover:text-amber-600 transition-colors mt-auto"
                    >
                      Amazonで見る →
                    </a>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── note Link ─── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 mb-6">
            出版の背景や執筆の経緯は note でも紹介しています。
          </p>
          <a
            href="https://note.com/entikemoto/n/nac04f4044af0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.2em] text-gray-700 border-b border-gray-300 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
          >
            note で読む →
          </a>
        </div>
      </section>
    </main>
  );
}
