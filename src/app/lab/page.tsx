import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MedAI Co-Lab',
  description: '医師・エンジニア・ビジネスパーソンが集い、医療AIの未来を共創するSlackコミュニティ。',
};

export default function LabPage() {
  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="py-24 lg:py-32 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.5em] text-gray-400 uppercase mb-8">
              Community
            </p>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-black text-gray-900 leading-tight mb-5">
              医療AI共創ラボ
            </h1>
            <p className="text-[10px] tracking-[0.4em] text-amber-700 uppercase border-l border-amber-700 pl-3 mb-10">
              MedAI Co-Lab
            </p>
            <p className="text-gray-600 text-sm leading-relaxed max-w-lg">
              医師・エンジニア・ビジネスパーソンが垣根を越えて集い、
              医療AIの課題と可能性をともに探求するコミュニティです。
            </p>
          </div>
        </div>
      </section>

      {/* ─── About the Lab ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left: Concept */}
            <div>
              <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-6">Concept</p>
              <h2 className="font-serif text-3xl lg:text-4xl font-black text-gray-900 leading-[1.15] mb-8">
                「現場」と「技術」を<br />
                繋ぐ場所。
              </h2>
              <div className="w-8 h-px bg-amber-700 mb-8" />
              <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-sm">
                医療の課題は、現場にいる医師にしか見えない。
                その課題を解く技術は、エンジニアが持っている。
                それを事業にするには、Bizの視点が要る。
              </p>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                三者がフラットに対話し、医療AIの「実装」を加速させる。
                それがこのラボの目指す場です。
              </p>
            </div>

            {/* Right: What you get */}
            <div>
              <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-6">What We Do</p>
              <ul className="space-y-8">
                {[
                  {
                    label: 'ニュース解説の深掘り',
                    body: 'HPやnoteの記事をもとに、Slackでさらに議論を深めます。',
                  },
                  {
                    label: '実装事例の共有',
                    body: '医療現場でのAI活用事例、ツール・ワークフローの紹介。',
                  },
                  {
                    label: '起業・事業アイデアの対話',
                    body: '医療×AIの事業仮説を、多職種の視点でブラッシュアップする。',
                  },
                  {
                    label: 'コラボレーション',
                    body: '医師・エンジニア・Bizが繋がり、プロジェクトを生み出す場。',
                  },
                ].map((item) => (
                  <li key={item.label} className="border-l border-gray-100 pl-5">
                    <p className="text-sm font-bold text-gray-900 mb-1">{item.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Join ─── */}
      <section className="bg-gray-900 text-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[10px] tracking-[0.5em] text-gray-500 uppercase mb-6">Join Us</p>
          <h2 className="font-serif text-2xl lg:text-4xl font-bold mb-6 leading-relaxed">
            一緒に、医療の未来を<br />
            創りませんか？
          </h2>
          <p className="text-gray-500 mb-10 text-sm leading-relaxed max-w-lg mx-auto">
            Slackコミュニティ「medai-co-lab」で運営しています。
            医師・エンジニア・ビジネスパーソン、どなたでも参加歓迎です。
          </p>
          <p className="text-gray-600 text-xs tracking-wide">
            ※ 参加リンクは準備中です。X または note でお知らせします。
          </p>
        </div>
      </section>
    </main>
  );
}
