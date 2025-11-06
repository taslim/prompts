/**
 * Converts an author name to a URL-friendly slug
 * - Lowercase
 * - Trim whitespace
 * - Replace multiple spaces/special chars with single hyphen
 * - Remove diacritics and non-alphanumeric chars (except hyphens)
 */
export function slugifyAuthor(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompose diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, '') // Trim hyphens from start/end
}
