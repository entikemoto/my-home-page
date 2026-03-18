/**
 * CortexFlow2.0 が出力する個別記事の型定義（データ契約）
 * 参照: docs/business-and-system-overview.md §6-①
 */

export type Edition = 'morning' | 'evening' | 'standalone';

export interface HpArticle {
  articleId: string;          // 例: "2026-03-18_morning_1"
  title: string;
  publishedAt: string;        // ISO 8601
  edition: Edition;
  orderInEdition: number;     // 1〜3
  body: string;               // HP に表示する解説本文
  originalSourceUrl: string;  // ニュース元記事 URL
  sourceName: string;         // 例: "OpenAI"
  tags: string[];
  category: string;
  summary: string;
  noteArticleUrl: string;     // note 公開後に追記。公開前は空文字列
}

/** 一覧表示用（本文省略） */
export type HpArticleMeta = Omit<HpArticle, 'body'>;

/** 手動修正用: note 取り込み後に一部項目だけ上書きする */
export type HpArticleOverride = Partial<
  Pick<HpArticle, 'title' | 'summary' | 'body' | 'tags' | 'category' | 'sourceName'>
>;
