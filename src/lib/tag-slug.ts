export function tagToSlug(tag: string): string {
  return Buffer.from(tag, 'utf8').toString('base64url');
}

export function slugToTag(slug: string): string {
  return Buffer.from(slug, 'base64url').toString('utf8');
}
