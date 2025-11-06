import type { Prompt, Category } from './types'
import { slugifyAuthor } from './slugifyAuthor'

// Type definition for MDX content modules (parsed by Vite plugin using gray-matter)
interface MDXContentModule {
  frontmatter: {
    title: string
    description: string
    tags: string[]
    authors: string[]
    source?: string
  }
  content: string
}

/**
 * Parse markdown link format [Text](url) into {text, href}
 * Returns null if the format is invalid or uses non-http(s) scheme
 */
function parseMarkdownLink(value: string): { text: string; href: string } | null {
  const regex = /^\[(.+?)\]\((.+?)\)$/
  const match = regex.exec(value)
  if (!match) return null

  const [, rawText, rawHref] = match
  const text = rawText.trim()
  const href = rawHref.trim()

  if (!text || !href) return null

  // Whitelist only http/https schemes for security
  if (!/^https?:\/\//i.test(href)) return null

  try {
    const url = new URL(href)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  } catch {
    return null
  }

  return { text, href }
}

// Import MDX files with content extraction via Vite plugin
// Excludes drafts folder for work-in-progress prompts
const modules = import.meta.glob<MDXContentModule>('/prompts/{simple,complex,rules}/**/*.mdx', {
  eager: true,
  query: '?content',
})

export const prompts: Prompt[] = Object.entries(modules).map(([path, module]) => {
  const pathParts = path.split('/')
  const promptsIndex = pathParts.indexOf('prompts')

  if (promptsIndex === -1) {
    throw new Error(`Invalid prompt path: ${path}`)
  }

  const category = pathParts[promptsIndex + 1] as Category

  if (!['simple', 'complex', 'rules'].includes(category)) {
    throw new Error(`Invalid category: ${category} in path: ${path}`)
  }

  const filename = pathParts[pathParts.length - 1]?.replace('.mdx', '') || ''

  const authors = module.frontmatter.authors || []
  const authorSlugs = authors.map(slugifyAuthor)
  const source = module.frontmatter.source
    ? parseMarkdownLink(module.frontmatter.source)
    : undefined

  return {
    id: filename,
    category,
    title: module.frontmatter.title,
    description: module.frontmatter.description,
    tags: module.frontmatter.tags || [],
    content: module.content,
    authors,
    authorSlugs,
    source: source ?? undefined,
  }
})
