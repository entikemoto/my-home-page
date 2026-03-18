import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Takeshi Ikemoto のプロフィール。医療×経営×テクノロジーの視点から、次の医療を構想する。',
};

export default function AboutPage() {
  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="py-24 lg:py-32 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.5em] text-gray-400 uppercase mb-8">
              Profile
            </p>
            <h1 className="font-serif text-[clamp(3rem,8vw,5.6rem)] font-black text-gray-900 leading-tight mb-5">
              Beyond Medicine.
              <br />
              Beyond Imagination.
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              医療を越え、想像を越えて。
              <br />
              人とAIの叡智で、「次の医療」を創り出す。
            </p>
            <p className="text-[10px] tracking-[0.4em] text-amber-700 uppercase border-l border-amber-700 pl-3 mb-10">
              医療 × 経営 × テクノロジー
            </p>
            <p className="text-gray-600 leading-relaxed max-w-2xl text-sm sm:text-base">
              医療の現場、経営の視点、そしてAIの可能性をつなぎ、
              次の医療を構想するための拠点として、このサイトを運営しています。
            </p>
          </div>
        </div>
      </section>

      {/* ─── Reason ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-12 h-px bg-gray-300" />
              <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
                Why This Site Exists
              </span>
            </div>
            <h2 className="font-serif text-2xl lg:text-4xl font-bold text-gray-900 leading-tight mb-10">
              このサイトを作った理由
            </h2>
            <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                医療には、まだ越えられていない壁があります。どれほど技術が進歩しても、
                どれほど努力を重ねても、人の力だけでは届かない領域がある。
              </p>
              <p>
                では、その壁を越えるために何が必要か。私はその答えを、
                「人とAIの叡智の融合」に見いだしました。
              </p>
              <p>
                このサイトは、「医療 × 経営 × テクノロジー」という三つの視点を軸に、
                次の時代の医療のかたちを探求し、共有するために立ち上げたものです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Turning Point ─── */}
      <section className="bg-gray-50 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-12 h-px bg-gray-300" />
              <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
                Turning Point
              </span>
            </div>
            <h2 className="font-serif text-2xl lg:text-4xl font-bold text-gray-900 leading-tight mb-10">
              医師 → AI への転換点
            </h2>
            <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                医師として診療を続ける中で、私は気づきました。どれほど努力しても、
                「人的リソースの限界」を超えられないという現実に。
              </p>
              <p>
                一方で、AIには別の可能性がありました。それは診断支援やデータ解析といった
                機能的なものにとどまらず、「医療を人に戻す」ための力を秘めているということです。
              </p>
              <p>
                MBA取得のために学んだ経営科学の視点が、AIを「単なる技術」ではなく、
                「医療の仕組みを再設計する手段」として捉えるきっかけになりました。
              </p>
              <p>
                それ以降、AIを活用した診療プロセス設計や、地域医療モデルの再構築に取り組んでいます。
                AIは、医師を置き換えるものではありません。むしろ、「人と医療の距離を再び近づける」
                ためのパートナーなのです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Vision / Profile ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-16">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-8 pb-4 border-b border-gray-100">
                Vision
              </h2>
              <p className="font-serif text-xl lg:text-3xl font-bold text-gray-900 leading-relaxed mb-8">
                人の力だけでは届かない壁を越えるために、
                <br />
                人とAIの叡智を医療へつなぐ。
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                日々のAI解説と実践知を通じて、医療の現場、経営、技術がどう結びつくかを考え、
                次の医療の選択肢を示していきます。
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-8 pb-4 border-b border-gray-100">
                Profile
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>Takeshi Ikemoto</p>
                <p>医療 × 経営 × テクノロジー</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
                    Career
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
                    <li>防衛医科大学校 卒業</li>
                    <li>防衛医科大学校医学研究科 卒業（医学博士取得）</li>
                    <li>ハンガリー王立アカデミー実験医学研究所 留学</li>
                    <li>2008年より 医療法人ヒューマン いけもと耳鼻咽喉科クリニック 理事長</li>
                    <li>2024年 ビジネス・ブレークスルー大学大学院 修了（MBA取得）</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/articles"
                  className="text-sm text-gray-700 underline underline-offset-4 hover:text-gray-500 transition-colors"
                >
                  記事一覧へ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Media ─── */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="font-serif text-2xl font-bold mb-12">Publishing Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-l-2 border-amber-700 pl-5">
              <a
                href="https://note.com/entikemoto"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gray-900 hover:text-teal-600 transition-colors block mb-2 text-sm"
              >
                note
              </a>
              <p className="text-xs text-gray-500 leading-relaxed">
                AI Daily Digest の朝版・夜版を中心に、そのほかの記事も掲載
              </p>
            </div>
            <div className="border-l-2 border-amber-700 pl-5">
              <a
                href="https://x.com/Ikemoto1966"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gray-900 hover:text-teal-600 transition-colors block mb-2 text-sm"
              >
                X
              </a>
              <p className="text-xs text-gray-500 leading-relaxed">
                note記事の紹介を中心に、更新情報や短いコメントを発信
              </p>
            </div>
            <div className="border-l-2 border-gray-200 pl-5">
              <p className="font-bold text-gray-700 mb-2 text-sm">Slack</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                medai-co-lab で、医療AI共創コミュニティとの共有と対話を行っています
              </p>
            </div>
            <div className="border-l-2 border-amber-700 pl-5">
              <Link
                href="/articles"
                className="font-bold text-gray-900 hover:text-teal-600 transition-colors block mb-2 text-sm"
              >
                This Site
              </Link>
              <p className="text-xs text-gray-500 leading-relaxed">
                個別記事の正本。1本ずつ検索・タグ・月別で探せる
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Disclaimer ─── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <p className="text-xs text-gray-400 leading-relaxed">
          ※ 当サイトの記事は情報提供・解説を目的としており、医療上の診断・治療の助言ではありません。
          個別の医療判断については、必ず担当医にご相談ください。
        </p>
      </div>
    </main>
  );
}
