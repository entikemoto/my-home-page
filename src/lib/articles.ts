import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
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

/** 過去記事（digest）の articleId → X 投稿 URL 対応表（記事生成側の配信記録から生成） */
function getXLinksFile(): string {
  return process.env.HP_ARTICLE_XLINKS_FILE ?? path.join(getArticlesDir(), 'x-links.json');
}

/** 記事データとして読まない補助ファイル */
const AUXILIARY_FILES = new Set(['overrides.json', 'x-links.json']);

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
    // 明示的に指定された置き場が無いのは設定ミス。黙って 0 件にせず止める
    // （2026-10-24: .env.local の HP_ARTICLES_DIR が移設前の vault パスを指したまま残り、
    //   ローカルだけ記事 0 件で全ページが 404 になっていた）
    if (process.env.HP_ARTICLES_DIR) {
      throw new Error(
        `[articles] HP_ARTICLES_DIR が指すディレクトリがありません: ${dir}（.env.local を確認してください）`,
      );
    }
    return [];
  }

  const excludedFiles = new Set([
    ...AUXILIARY_FILES,
    path.basename(getOverridesFile()),
    path.basename(getXLinksFile()),
  ]);
  const entries = fs.readdirSync(dir).filter((f) => !excludedFiles.has(f));
  const articles: HpArticle[] = [];

  for (const file of entries.filter((f) => f.endsWith('.json'))) {
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
      articles.push({ ...(item as HpArticle), format: 'digest' });
    }
  }

  for (const file of entries.filter((f) => f.endsWith('.md'))) {
    articles.push(loadMarkdownArticle(path.join(dir, file)));
  }

  return articles;
}

// ---------------------------------------------------------------------------
// Markdown 記事（post 形式）: VaultPublisher が 1 記事 1 ファイルで追加する
// 仕様: docs/specs/article-markdown-format.md
// ---------------------------------------------------------------------------

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function toIsoDate(value: unknown, filePath: string): string {
  // gray-matter は YAML の日付を Date に変換する。文字列ならそのまま使う
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string' && value.trim()) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      throw new Error(`[articles] Invalid publishedAt in ${filePath}: ${value}`);
    }
    return value.trim();
  }
  throw new Error(`[articles] Missing required field "publishedAt" in ${filePath}`);
}

/** 本文の最初の段落（見出し・引用・リストを除く）から要約を作る */
export function summaryFromBody(body: string, maxLength = 120): string {
  const blocks = body
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b && !/^(#|>|-\s|```|---)/.test(b));
  const first = blocks[0] ?? '';
  const text = first
    .replace(/\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

export function loadMarkdownArticle(filePath: string): HpArticle {
  const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'));
  const body = content.trim();
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  if (!title) throw new Error(`[articles] Missing required field "title" in ${filePath}`);
  if (!body) throw new Error(`[articles] Empty body in ${filePath}`);

  const optionalUrl = (key: string): string | undefined => {
    const v = data[key];
    if (typeof v !== 'string' || !v.trim()) return undefined;
    try {
      new URL(v);
    } catch {
      throw new Error(`[articles] Invalid ${key} in ${filePath}: ${v}`);
    }
    return v.trim();
  };

  const coverImage =
    typeof data.coverImage === 'string' && data.coverImage.trim()
      ? data.coverImage.trim()
      : undefined;
  if (coverImage && !coverImage.startsWith('/')) {
    throw new Error(`[articles] coverImage must be a site path starting with "/" in ${filePath}`);
  }

  return {
    articleId: path.basename(filePath, '.md'),
    title,
    publishedAt: toIsoDate(data.publishedAt, filePath),
    edition: 'standalone',
    orderInEdition: 0,
    body,
    originalSourceUrl: optionalUrl('sourceUrl'),
    sourceName: typeof data.sourceName === 'string' && data.sourceName.trim() ? data.sourceName.trim() : 'X',
    tags: toStringArray(data.tags),
    category: typeof data.category === 'string' && data.category.trim() ? data.category.trim() : 'post',
    summary:
      typeof data.summary === 'string' && data.summary.trim()
        ? data.summary.trim()
        : summaryFromBody(body),
    noteArticleUrl: optionalUrl('noteUrl'),
    xUrl: optionalUrl('xUrl'),
    coverImage,
    format: 'post',
  };
}

function loadXLinks(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    throw new Error(`[articles] Failed to parse x-links JSON: ${filePath}`);
  }
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error(`[articles] x-links file must be an object: ${filePath}`);
  }
  const result: Record<string, string> = {};
  for (const [id, url] of Object.entries(parsed as Record<string, unknown>)) {
    if (id.startsWith('_') || typeof url !== 'string') continue;
    result[id] = url;
  }
  return result;
}

function applyXLinks(articles: HpArticle[], links: Record<string, string>): HpArticle[] {
  return articles.map((a) => (a.xUrl || !links[a.articleId] ? a : { ...a, xUrl: links[a.articleId] }));
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
// コンテンツ重複排除（同一日・同一edition・同一順序の記事）
// note_import.json と *_articles.json が同じ記事を持つ場合、
// *_articles.json 側（非 "note-" プレフィックス）を優先する。
// ---------------------------------------------------------------------------

function deduplicateArticles(articles: HpArticle[]): HpArticle[] {
  type Key = string;
  const toDateStr = (publishedAt: string) => publishedAt.slice(0, 10);
  // post 形式は 1 ファイル 1 記事で articleId が一意なので、日付キーで潰さない
  const makeKey = (a: HpArticle): Key =>
    a.format === 'post'
      ? `post|${a.articleId}`
      : `${toDateStr(a.publishedAt)}|${a.edition}|${a.orderInEdition}`;

  // 非 note- 記事を先に登録し、note- 記事で上書きしない
  const map = new Map<Key, HpArticle>();
  const nonNote = articles.filter((a) => !a.articleId.startsWith('note-'));
  const note = articles.filter((a) => a.articleId.startsWith('note-'));

  for (const a of nonNote) {
    map.set(makeKey(a), a);
  }
  for (const a of note) {
    const key = makeKey(a);
    if (!map.has(key)) {
      map.set(key, a);
    }
  }

  return [...map.values()];
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
  const deduped = deduplicateArticles(articles);
  const mergedArticles = applyXLinks(applyOverrides(deduped, overrides), loadXLinks(getXLinksFile()));
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

/** 前後の記事（最新順の並びで、prev = 1 つ新しい記事、next = 1 つ古い記事） */
export function getAdjacentArticles(id: string): { newer: HpArticleMeta | null; older: HpArticleMeta | null } {
  const list = getArticles();
  const i = list.findIndex((a) => a.articleId === id);
  if (i === -1) return { newer: null, older: null };
  return { newer: list[i - 1] ?? null, older: list[i + 1] ?? null };
}

/** 関連記事: 共通タグが多い順・同数なら新しい順。自分自身は除く */
export function getRelatedArticles(id: string, limit = 3): HpArticleMeta[] {
  const list = getArticles();
  const self = list.find((a) => a.articleId === id);
  if (!self || self.tags.length === 0) return [];
  const tags = new Set(self.tags);
  return list
    .filter((a) => a.articleId !== id)
    .map((a, index) => ({ a, index, score: a.tags.filter((t) => tags.has(t)).length }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || x.index - y.index)
    .slice(0, limit)
    .map((x) => x.a);
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
