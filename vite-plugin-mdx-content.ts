import type { Plugin } from 'vite'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import matter from 'gray-matter'

const VIRTUAL_PREFIX = '\0mdx-content:'

const resolveFromProjectRoot = (...paths: string[]) => resolve(process.cwd(), ...paths)

export function mdxContent(): Plugin {
  return {
    name: 'mdx-content',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!source.endsWith('.mdx?content')) {
        return null
      }

      const [relativePath] = source.split('?')
      const importerPath = importer?.replace(VIRTUAL_PREFIX, '')
      const importerDirectory = importerPath ? dirname(importerPath) : process.cwd()
      const absolutePath = relativePath.startsWith('/')
        ? resolveFromProjectRoot(relativePath.slice(1))
        : resolve(importerDirectory, relativePath)

      return `${VIRTUAL_PREFIX}${absolutePath}`
    },
    load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) {
        return null
      }

      const absolutePath = id.slice(VIRTUAL_PREFIX.length)

      if (!existsSync(absolutePath)) {
        this.error(`MDX file not found: ${absolutePath}`)
        return null
      }

      try {
        const fileContents = readFileSync(absolutePath, 'utf-8')
        const { data, content } = matter(fileContents)

        if (!data.title || data.description === undefined) {
          this.warn(
            `MDX file ${absolutePath} is missing required frontmatter fields (title, description)`
          )
        }

        return `export const frontmatter = ${JSON.stringify(data)}\nexport const content = ${JSON.stringify(content.trim())}`
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        this.error(`Failed to process MDX file ${absolutePath}: ${errorMessage}`)
        return null
      }
    },
  }
}
