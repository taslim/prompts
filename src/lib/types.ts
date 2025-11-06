export type Category = 'simple' | 'complex' | 'rules'

export interface Prompt {
  id: string
  title: string
  description: string
  category: Category
  tags: string[]
  content: string
  authors: string[]
  authorSlugs: string[]
  source?: {
    text: string
    href: string
  }
}
