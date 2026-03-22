const NOTE_ACCOUNT = process.env.NOTE_ACCOUNT ?? 'entikemoto';
const NOTE_API_BASE = 'https://note.com/api';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'MyHomePage note importer',
      accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText} (${url})`);
  }

  return response.json();
}

function normalizeText(value) {
  return (value ?? '').replace(/\r/g, '').replace(/\u00a0/g, ' ').trim();
}

function collapseSpaces(value) {
  return normalizeText(value).replace(/[ \t]+/g, ' ');
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, '/');
}

function htmlToText(html) {
  return normalizeText(
    decodeHtmlEntities(
      (html ?? '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<p\b[^>]*>/gi, '')
        .replace(/<\/h2>/gi, '\n\n')
        .replace(/<h2\b[^>]*>/gi, '\n\n## ')
        .replace(/<\/h3>/gi, '\n\n')
        .replace(/<h3\b[^>]*>/gi, '\n\n### ')
        .replace(/<\/blockquote>/gi, '\n\n')
        .replace(/<blockquote\b[^>]*>/gi, '')
        .replace(/<\/li>/gi, '\n')
        .replace(/<li\b[^>]*>/gi, '- ')
        .replace(/<\/ul>/gi, '\n')
        .replace(/<ul\b[^>]*>/gi, '\n')
        .replace(/<\/figure>/gi, '\n\n')
        .replace(/<figure\b[^>]*>/gi, '')
        .replace(/<\/figcaption>/gi, '\n')
        .replace(/<figcaption\b[^>]*>/gi, '')
        .replace(/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '$2\n$1')
        .replace(/<[^>]+>/g, '')
    )
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
  );
}

function hostnameLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'note';
  }
}

function stripHashtagPrefix(tag) {
  return tag.replace(/^#/, '').trim();
}

function inferEdition(title) {
  if (title.includes('朝版')) return 'morning';
  if (title.includes('夜版')) return 'evening';
  return 'standalone';
}

function inferCategory(title) {
  if (title.startsWith('【AI Deep Dive】')) return 'deep-dive';
  if (title.startsWith('【')) return 'feature';
  return '';
}

function summarize(text, max = 120) {
  const compact = collapseSpaces(text);
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max).trim()}...`;
}

function toParagraphBody(text) {
  return htmlToText(text)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractSectionSummary(section) {
  const match = section.match(
    /###\s*一言で言うと\s*([\s\S]*?)(?=\n+(?:###\s*(?:何が起きているのか|AI業界の文脈では|私の見立て)|##\s*[①②③]\s+|$))/,
  );
  return summarize(match?.[1] ?? section);
}

function formatDigestSectionBody(section) {
  return section
    .replace(/###\s+###\s+/g, '### ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function trimSourceHeadline(rawTitle) {
  // Take only the first line — the Japanese title.
  // Subsequent lines contain the English source headline and URL.
  return collapseSpaces(rawTitle.split('\n')[0]);
}

function splitDigestBody(body) {
  const compact = htmlToText(body);
  const matches = [...compact.matchAll(/(?:^|\n)##\s*([①②③])\s+([\s\S]*?)(?=(?:\n##\s*[①②③]\s+)|$)/g)];

  return matches.map((match, index) => {
    const marker = match[1];
    const section = match[2].trim();
    const urlMatch = section.match(/https?:\/\/\S+/);
    const sectionBeforeSummary = section.split(/\n+###\s*一言で言うと\s*\n+/)[0] ?? section;
    const bodyStart = section.search(/###\s*一言で言うと/);
    const rawTitle = urlMatch
      ? sectionBeforeSummary.slice(0, sectionBeforeSummary.indexOf(urlMatch[0])).trim()
      : sectionBeforeSummary;
    const cleanedBody = bodyStart >= 0 ? section.slice(bodyStart).trim() : section;

    return {
      marker,
      order: index + 1,
      title: trimSourceHeadline(rawTitle),
      originalSourceUrl: urlMatch?.[0] ?? '',
      sourceName: urlMatch ? hostnameLabel(urlMatch[0]) : 'note',
      summary: extractSectionSummary(section),
      body: formatDigestSectionBody(cleanedBody),
    };
  });
}

function toDigestArticles(note) {
  const edition = inferEdition(note.name);
  const sections = splitDigestBody(note.body);

  return sections.map((section) => ({
    articleId: `note-${note.key}-${section.order}`,
    title: section.title || `${note.name} ${section.order}本目`,
    publishedAt: note.publish_at,
    edition,
    orderInEdition: section.order,
    body: section.body,
    originalSourceUrl: section.originalSourceUrl || note.note_url,
    sourceName: section.sourceName,
    tags: (note.hashtag_notes ?? []).map((item) => stripHashtagPrefix(item.hashtag.name)),
    category: '',
    summary: section.summary,
    noteArticleUrl: note.note_url,
  }));
}

function toStandaloneArticle(note) {
  const body = toParagraphBody(note.body);
  return {
    articleId: `note-${note.key}`,
    title: note.name,
    publishedAt: note.publish_at,
    edition: 'standalone',
    orderInEdition: 1,
    body,
    originalSourceUrl: note.note_url,
    sourceName: 'note',
    tags: (note.hashtag_notes ?? []).map((item) => stripHashtagPrefix(item.hashtag.name)),
    category: inferCategory(note.name),
    summary: summarize(body),
    noteArticleUrl: note.note_url,
  };
}

function isDigestNote(title) {
  return /^AI Daily Digest /.test(title);
}

async function fetchAllNotes() {
  const items = [];
  let page = 1;

  while (true) {
    const payload = await fetchJson(
      `${NOTE_API_BASE}/v2/creators/${NOTE_ACCOUNT}/contents?kind=note&page=${page}`,
    );
    const data = payload.data;
    items.push(...data.contents);

    if (data.isLastPage) break;

    page += 1;
    await sleep(250);
  }

  return items;
}

async function fetchNoteDetail(key) {
  const payload = await fetchJson(`${NOTE_API_BASE}/v3/notes/${key}`);
  return payload.data;
}

async function main() {
  const allNotes = await fetchAllNotes();
  const articles = [];

  for (const item of allNotes) {
    const detail = await fetchNoteDetail(item.key);

    if (isDigestNote(detail.name)) {
      articles.push(...toDigestArticles(detail));
    } else {
      articles.push(toStandaloneArticle(detail));
    }

    await sleep(250);
  }

  articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const outDir = path.join(process.cwd(), 'content', 'articles');
  const outFile = path.join(outDir, 'note_import.json');

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outFile, `${JSON.stringify(articles, null, 2)}\n`, 'utf8');

  console.log(`Imported ${articles.length} articles from note into ${outFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
