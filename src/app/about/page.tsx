import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    '医師・MBA・医学博士。医療×AIで現場発イノベーションを共創。医師・エンジニア・Bizが医療の未来を再設計する。',
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* ─── ヘッダー ─── */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2">池本 武志</h1>
        <p className="text-gray-500 text-sm mb-6">
          医師&nbsp;|&nbsp;MBA&nbsp;|&nbsp;医学博士（低酸素脳症研究）
        </p>
        <p className="text-base leading-relaxed">
          医療×AIで現場発イノベーションを共創。
          <br />
          医師・エンジニア・Bizが三位一体で医療の未来を再設計する。
        </p>
      </section>

      {/* ─── Vision ─── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 pb-1 border-b">Vision</h2>
        <p className="text-base leading-relaxed mb-4">
          診察室の課題は、現場にいる医師にしか見えない。
          <br />
          その課題を技術で解くには、エンジニアの力が要る。
          <br />
          それを事業にするには、Bizの視点が不可欠だ。
        </p>
        <p className="text-base leading-relaxed">
          三者が本音で対話し、医療現場発のイノベーションを起こす——
          それが私の目指す医療AIの姿です。
          患者さんの命を守る現場から、世界に通用するソリューションを生み出す。
        </p>
      </section>

      {/* ─── Profile ─── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 pb-1 border-b">Profile</h2>
        <dl className="space-y-4">
          <div className="grid grid-cols-[7rem_1fr] gap-2 text-sm">
            <dt className="text-gray-400 pt-0.5">現職</dt>
            <dd>医療法人ヒューマン 理事長</dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-2 text-sm">
            <dt className="text-gray-400 pt-0.5">学位・資格</dt>
            <dd>
              医師免許 / 医学博士（低酸素脳症研究）<br />
              MBA（BBT大学院 2024）
            </dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-2 text-sm">
            <dt className="text-gray-400 pt-0.5">経歴</dt>
            <dd>
              防衛医科大学校 卒業<br />
              元 防衛医官
            </dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-2 text-sm">
            <dt className="text-gray-400 pt-0.5">専門・関心</dt>
            <dd>
              脳神経内科・救急・低酸素脳症<br />
              生成AI・Web開発・医療AI起業
            </dd>
          </div>
        </dl>
      </section>

      {/* ─── このサイトについて ─── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 pb-1 border-b">このサイトについて</h2>
        <p className="text-base leading-relaxed mb-4">
          医師×MBAの複眼で、医療AIの"今"と"次"を読み解きます。
        </p>
        <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
          <li>医療AI最前線レポート — 海外含む主要ニュースを即日解説</li>
          <li>AI論文解説 — 臨床応用の観点から読み解く</li>
          <li>医療×AI起業動向 — スタートアップ・規制・資金調達の最新情報</li>
        </ul>
        <p className="text-sm text-gray-500 mt-4">
          毎朝・毎夜それぞれ3本、1本ずつ個別記事として公開しています。
          <Link href="/articles" className="underline hover:text-gray-800 ml-1">
            記事一覧へ →
          </Link>
        </p>
      </section>

      {/* ─── 発信媒体 ─── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 pb-1 border-b">発信媒体</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 text-xs">
              <th className="pb-2 font-normal w-28">媒体</th>
              <th className="pb-2 font-normal">役割</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-2.5 font-medium">
                <a
                  href="https://note.com/entikemoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70"
                >
                  note
                </a>
              </td>
              <td className="py-2.5 text-gray-600">
                朝便・夜便の3本まとめ記事（購読者向けまとめ配信）
              </td>
            </tr>
            <tr>
              <td className="py-2.5 font-medium">
                <a
                  href="https://x.com/Ikemoto1966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70"
                >
                  X
                </a>
              </td>
              <td className="py-2.5 text-gray-600">
                速報・一言コメント・HP記事の告知
              </td>
            </tr>
            <tr>
              <td className="py-2.5 font-medium text-gray-700">Slack</td>
              <td className="py-2.5 text-gray-600">
                medai-co-lab — 医師・エンジニア・Bizが集う医療AI共創コミュニティ
              </td>
            </tr>
            <tr>
              <td className="py-2.5 font-medium">
                <Link href="/articles" className="underline hover:opacity-70">
                  このHP
                </Link>
              </td>
              <td className="py-2.5 text-gray-600">
                個別記事の正本。1本ずつ検索・タグ・月別で探せる
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ─── 免責 ─── */}
      <section>
        <p className="text-xs text-gray-400 leading-relaxed">
          ※ 当サイトの記事は情報提供・解説を目的としており、医療上の診断・治療の助言ではありません。
          個別の医療判断については、必ず担当医にご相談ください。
        </p>
      </section>
    </main>
  );
}
