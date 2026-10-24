/**
 * 記事の型定義（データ契約）
 *
 * 2 つの入力形式を 1 つの型に正規化する:
 *   - digest: CortexFlow2.0（旧）が書き出した content/articles/*.json（2026-03〜06 の 219 ファイル）
 *   - post:   VaultPublisher が 1 記事 1 ファイルで追加する content/articles/*.md
 *             （2026-10 以降。X の Article 投稿と同じ本文。仕様: docs/specs/article-markdown-format.md）
 */

export type Edition = 'morning' | 'evening' | 'standalone';

export type ArticleFormat = 'digest' | 'post';

export interface HpArticle {
  articleId: string;          // 例: "2026-03-18_morning_1"（digest）/ "2026-10-24-ai-agent-3f2a9c1d"（post）
  title: string;
  publishedAt: string;        // ISO 8601
  edition: Edition;
  orderInEdition: number;     // digest: 1〜3 / post: 0
  body: string;               // HP に表示する解説本文（軽量 Markdown）
  originalSourceUrl?: string; // ニュース元記事 URL（post では任意）
  sourceName: string;         // 例: "OpenAI"（post で未指定なら "X"）
  tags: string[];
  category: string;           // post の既定は "post"
  summary: string;
  todayPoint?: string;        // 今日のポイント該当bullet。優先的に冒頭に表示する
  noteArticleUrl?: string;    // note 公開後に追記。無ければ undefined か空文字列
  xUrl?: string;              // X の投稿 URL（post は frontmatter、digest は x-links.json から補完）
  coverImage?: string;        // サイト内パス。例: "/images/articles/2026-10-24-xxx.png"
  format: ArticleFormat;
}

/** 一覧表示用（本文省略） */
export type HpArticleMeta = Omit<HpArticle, 'body'>;

/** 手動修正用: note 取り込み後に一部項目だけ上書きする */
export type HpArticleOverride = Partial<
  Pick<HpArticle, 'title' | 'summary' | 'todayPoint' | 'body' | 'tags' | 'category' | 'sourceName'>
>;
