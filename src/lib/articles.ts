import fs from 'node:fs';
import path from 'node:path';
import type { HpArticle, HpArticleMeta, HpArticleOverride } from '@/types/article';

/**
 * 記事 JSON ファイルの格納ディレクトリ。
 * HP_ARTICLES_DIR 環境変数で上書き可能（CortexFlow2.0 の出力先を直接指定する場合）。
 * デフォルト: プロジェクトルート/content/articles
 */
function getArticlesDir(): string {
  return process.env.HP_ARTICLES_DIR ?? path.join(process.cwd(), 'content', 'articles');
}

function getOverridesFile(): string {
  return process.env.HP_ARTICLE_OVERRIDES_FILE ?? path.join(getArticlesDir(), 'overrides.json');
}

// ---------------------------------------------------------------------------
// バリデーション
// ---------------------------------------------------------------------------

function assertRequiredFields(article: Partial<HpArticle>, filePath: string): void {
  const required: (keyof HpArticle)[] = [
    'articleId',
    'title',
    'publishedAt',
    'edition',
    'orderInEdition',
    'body',
    'originalSourceUrl',
    'sourceName',
    'tags',
    'category',
    'summary',
    'noteArticleUrl',
  ];

  for (const key of required) {
    if (article[key] === undefined || article[key] === null) {
      throw new Error(`[articles] Missing required field "${key}" in ${filePath}`);
    }
  }

  // URL 形式チェック
  try {
    new URL(article.originalSourceUrl as string);
  } catch {
    throw new Error(
      `[articles] Invalid originalSourceUrl in ${filePath}: ${article.originalSourceUrl}`,
    );
  }

  // edition 値チェック
  if (
    article.edition !== 'morning' &&
    article.edition !== 'evening' &&
    article.edition !== 'standalone'
  ) {
    throw new Error(
      `[articles] Invalid edition "${article.edition}" in ${filePath}. Must be "morning", "evening", or "standalone".`,
    );
  }
}

// ---------------------------------------------------------------------------
// ファイル読み込み
// ---------------------------------------------------------------------------

function loadArticlesFromDir(dir: string): HpArticle[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const excludedFiles = new Set(['overrides.json', path.basename(getOverridesFile())]);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !excludedFiles.has(f));
  const articles: HpArticle[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`[articles] Failed to parse JSON: ${filePath}`);
    }

    const items = Array.isArray(parsed) ? parsed : [parsed];
    for (const item of items) {
      assertRequiredFields(item as Partial<HpArticle>, filePath);
      articles.push(item as HpArticle);
    }
  }

  return articles;
}

function loadOverrides(filePath: string): Record<string, HpArticleOverride> {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    throw new Error(`[articles] Failed to parse overrides JSON: ${filePath}`);
  }

  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error(`[articles] Overrides file must be an object: ${filePath}`);
  }

  return parsed as Record<string, HpArticleOverride>;
}

function applyOverrides(
  articles: HpArticle[],
  overrides: Record<string, HpArticleOverride>,
): HpArticle[] {
  return articles.map((article) => {
    const override = overrides[article.articleId];
    if (!override) {
      return article;
    }

    const merged = { ...article, ...override };
    assertRequiredFields(merged, `override:${article.articleId}`);
    return merged;
  });
}

// ---------------------------------------------------------------------------
// 重複 ID チェック
// ---------------------------------------------------------------------------

function checkDuplicateIds(articles: HpArticle[]): void {
  const seen = new Set<string>();
  for (const article of articles) {
    if (seen.has(article.articleId)) {
      throw new Error(`[articles] Duplicate articleId: ${article.articleId}`);
    }
    seen.add(article.articleId);
  }
}

// ---------------------------------------------------------------------------
// キャッシュ（同一プロセス内での再読み込みを避ける）
// ---------------------------------------------------------------------------

let _cache: HpArticle[] | null = null;

function getAllArticlesRaw(): HpArticle[] {
  if (_cache) return _cache;

  const articlesDir = getArticlesDir();
  const overridesFile = getOverridesFile();
  const articles = loadArticlesFromDir(articlesDir);
  const overrides = loadOverrides(overridesFile);
  const mergedArticles = applyOverrides(articles, overrides);
  checkDuplicateIds(mergedArticles);

  // 最新順（publishedAt 降順）
  mergedArticles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  _cache = mergedArticles;
  return _cache;
}

/** テスト用: キャッシュをリセットする */
export function _resetCache(): void {
  _cache = null;
}

// ---------------------------------------------------------------------------
// 公開 API
// ---------------------------------------------------------------------------

/** 全記事メタデータを最新順で取得 */
export function getArticles(): HpArticleMeta[] {
  return getAllArticlesRaw().map((article) => {
    const { body, ...meta } = article;
    void body;
    return meta;
  });
}

/** articleId で1記事（本文含む）を取得。見つからない場合は null */
export function getArticle(id: string): HpArticle | null {
  return getAllArticlesRaw().find((a) => a.articleId === id) ?? null;
}

/** 一覧検索用に本文を含む全記事を最新順で取得 */
export function getArticlesWithBody(): HpArticle[] {
  return getAllArticlesRaw();
}

/** タグで絞り込み（最新順） */
export function getArticlesByTag(tag: string): HpArticleMeta[] {
  return getArticles().filter((a) => a.tags.includes(tag));
}

/** カテゴリーで絞り込み（最新順） */
export function getArticlesByCategory(category: string): HpArticleMeta[] {
  return getArticles().filter((a) => a.category === category);
}

/** 年月で絞り込み（アーカイブ用、最新順） */
export function getArticlesByMonth(year: number, month: number): HpArticleMeta[] {
  return getArticles().filter((a) => {
    const d = new Date(a.publishedAt);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

/** 全タグと件数を取得（件数降順） */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const article of getArticles()) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
