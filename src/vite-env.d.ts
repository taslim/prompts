/// <reference types="vite/client" />

declare module '*.mdx' {
  let Component: React.ComponentType
  export const frontmatter: {
    title: string
    description: string
    tags: string[]
  }
  export default Component
}
