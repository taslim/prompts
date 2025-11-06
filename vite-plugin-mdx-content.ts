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

        // Validate required fields
        if (!data.title || typeof data.title !== 'string') {
          this.error(`MDX file ${absolutePath} is missing required field: title (must be a string)`)
          return null
        }

        if (!data.description || typeof data.description !== 'string') {
          this.error(
            `MDX file ${absolutePath} is missing required field: description (must be a non-empty string)`
          )
          return null
        }

        if (!data.authors || !Array.isArray(data.authors) || data.authors.length === 0) {
          this.error(
            `MDX file ${absolutePath} is missing required field: authors (must be a non-empty array of strings)`
          )
          return null
        }

        // Validate authors array
        for (const author of data.authors) {
          if (typeof author !== 'string' || author.trim() === '') {
            this.error(
              `MDX file ${absolutePath} has invalid authors array: all authors must be non-empty strings`
            )
            return null
          }
        }

        // Validate source format if present
        if (data.source !== undefined) {
          if (typeof data.source !== 'string') {
            this.warn(
              `MDX file ${absolutePath} has invalid source: must be a string in format [Text](url)`
            )
          } else {
            const markdownLinkPattern = /^\[(.+?)\]\((.+?)\)$/
            if (!markdownLinkPattern.test(data.source)) {
              this.warn(
                `MDX file ${absolutePath} has invalid source format: expected [Text](url), got "${data.source}"`
              )
            }
          }
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
