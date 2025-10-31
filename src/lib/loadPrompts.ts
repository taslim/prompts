import type { Prompt, Category } from './types'

// Type definition for MDX content modules (parsed by Vite plugin using gray-matter)
interface MDXContentModule {
  frontmatter: {
    title: string
    description: string
    tags: string[]
  }
  content: string
}

// Import MDX files with content extraction via Vite plugin
const modules = import.meta.glob<MDXContentModule>('/prompts/**/*.mdx', {
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

  return {
    id: filename,
    category,
    title: module.frontmatter.title,
    description: module.frontmatter.description,
    tags: module.frontmatter.tags || [],
    content: module.content,
  }
})
