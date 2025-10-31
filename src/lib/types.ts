export type Category = 'simple' | 'complex' | 'rules'

export interface Prompt {
  id: string
  title: string
  description: string
  category: Category
  tags: string[]
  content: string
}
