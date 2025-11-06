#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

type Category = 'simple' | 'complex' | 'rules'

interface DraftFrontmatter {
  title: string
  description?: string
  category?: Category
  status?: 'draft' | 'ready'
  tags?: string[]
  authors?: string[]
  source?: string
}

const draftsDir = path.join(__dirname, 'prompts', 'drafts')

// Check if drafts directory exists
if (!fs.existsSync(draftsDir)) {
  console.error('Error: drafts directory does not exist')
  process.exit(1)
}

// Read all draft files
const draftFiles = fs.readdirSync(draftsDir).filter((file) => file.endsWith('.mdx'))

if (draftFiles.length === 0) {
  console.log('No draft files found.')
  process.exit(0)
}

// Find drafts with status="ready"
const readyDrafts: Array<{ filename: string; frontmatter: DraftFrontmatter }> = []

for (const filename of draftFiles) {
  const filepath = path.join(draftsDir, filename)
  const fileContents = fs.readFileSync(filepath, 'utf-8')
  const { data } = matter(fileContents)

  if (data.status === 'ready') {
    readyDrafts.push({
      filename,
      frontmatter: data as DraftFrontmatter,
    })
  }
}

if (readyDrafts.length === 0) {
  console.log('No drafts with status="ready" found.')
  console.log(`\nTip: Set status: "ready" in the frontmatter of drafts you want to publish.\n`)
  process.exit(0)
}

// Publish each ready draft
console.log(`\nFound ${readyDrafts.length} draft(s) ready to publish:\n`)

let published = 0
let errors = 0

for (const draft of readyDrafts) {
  const { filename, frontmatter } = draft

  // Validate required fields
  if (!frontmatter.category || !['simple', 'complex', 'rules'].includes(frontmatter.category)) {
    console.error(
      `❌ ${filename}: Invalid or missing category "${frontmatter.category}". Skipping.`
    )
    errors++
    continue
  }

  if (!frontmatter.authors || frontmatter.authors.length === 0) {
    console.error(`❌ ${filename}: Missing required field "authors". Skipping.`)
    errors++
    continue
  }

  if (!frontmatter.description) {
    console.error(`❌ ${filename}: Missing required field "description". Skipping.`)
    errors++
    continue
  }

  const sourcePath = path.join(draftsDir, filename)
  const targetDir = path.join(__dirname, 'prompts', frontmatter.category)
  const targetPath = path.join(targetDir, filename)

  // Check if file already exists in target
  if (fs.existsSync(targetPath)) {
    console.error(`❌ ${filename}: Already exists in ${frontmatter.category}/. Skipping.`)
    errors++
    continue
  }

  try {
    // Read file and update status to remove draft status
    const fileContents = fs.readFileSync(sourcePath, 'utf-8')
    const parsed = matter(fileContents)

    // Save category before deleting it (for console output)
    const category = frontmatter.category

    // Remove status field (no longer needed in published prompts)
    delete parsed.data.status
    // Remove category field (inferred from folder location)
    delete parsed.data.category

    // Write updated content to target
    const updatedContent = matter.stringify(parsed.content, parsed.data)
    fs.writeFileSync(targetPath, updatedContent, 'utf-8')

    // Remove from drafts
    fs.unlinkSync(sourcePath)

    console.log(`✅ ${filename} → prompts/${category}/`)
    published++
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ ${filename}: Failed to publish - ${errorMessage}`)
    errors++
  }
}

console.log(`\n📊 Summary:`)
console.log(`   Published: ${published}`)
if (errors > 0) {
  console.log(`   Errors: ${errors}`)
}
console.log(`\n💡 Restart dev server to see published prompts in the UI.\n`)
