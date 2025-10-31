#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import enquirer from 'enquirer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

type Category = 'simple' | 'complex' | 'rules'

// Parse command line arguments
const args = process.argv.slice(2)
const categoryArg = args.find((arg) => arg.startsWith('--category='))
const titleArg = args.find((arg) => arg.startsWith('--title='))
const blankFlag = args.includes('--blank')

// Interactive mode if no args provided
const isInteractive = !categoryArg && !titleArg

let category: Category
let title: string
let useBlank = blankFlag

if (isInteractive) {
  // Interactive prompts
  const answers = await enquirer.prompt<{
    category: Category
    title: string
    useTemplate: boolean
  }>([
    {
      type: 'select',
      name: 'category',
      message: 'Select category:',
      choices: [
        { name: 'simple', message: 'Simple - Quick prompts (< 100 words)' },
        { name: 'complex', message: 'Complex - Multi-section prompts for GPTs/Gems' },
        { name: 'rules', message: 'Rules - Agent configs for Cursor/coding tools' },
      ],
    },
    {
      type: 'input',
      name: 'title',
      message: 'Prompt title:',
      validate: (input: string) => (input.trim() ? true : 'Title is required'),
    },
    {
      type: 'confirm',
      name: 'useTemplate',
      message: 'Use category template?',
      initial: false,
    },
  ])

  category = answers.category
  title = answers.title
  useBlank = !answers.useTemplate
} else {
  // CLI mode - validate required args
  if (!categoryArg || !titleArg) {
    console.error(`
Usage: 
  pnpm new                                              (interactive mode)
  pnpm new --category=<type> --title="Title" [--blank]  (CLI mode)

Examples:
  pnpm new
  pnpm new --category=simple --title="Code Refactor Helper"
  pnpm new --category=complex --title="Research Assistant" --blank

Categories:
  simple   - Short prompts (< 100 words)
  complex  - Multi-section prompts for GPTs/Gems
  rules    - Agent configuration for coding tools

Flags:
  --blank  - Skip template, create minimal frontmatter only
`)
    process.exit(1)
  }

  category = categoryArg.split('=')[1] as Category
  title = titleArg.split('=')[1].replace(/"/g, '')

  // Validate category
  if (!['simple', 'complex', 'rules'].includes(category)) {
    console.error('Error: Category must be "simple", "complex", or "rules"')
    process.exit(1)
  }
}

// Generate filename from title
const filename =
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') + '.mdx'

const filepath = path.join(__dirname, 'prompts', category, filename)

// Check if file exists
if (fs.existsSync(filepath)) {
  console.error(`Error: File already exists: ${filepath}`)
  process.exit(1)
}

// Blank template (minimal frontmatter)
const blankTemplate = `---
title: "${title}"
description: ""
tags: []
---


`

// Category-specific templates
const templates: Record<Category, string> = {
  simple: `---
title: "${title}"
description: "Describe when and how you use this prompt"
tags: ["tag1", "tag2"]
---

Your prompt content here...

[PLACEHOLDER]
`,
  complex: `---
title: "${title}"
description: "Describe this GPT/Gem and what it helps you accomplish"
tags: ["tag1", "tag2"]
---

You are [role description].

# Your Role
- Responsibility 1
- Responsibility 2

# Process
1. Step 1
2. Step 2

# Output Format
- Format requirement 1
- Format requirement 2

[Additional instructions...]
`,
  rules: `---
title: "${title}"
description: "Describe what project type or tool this is for"
tags: ["tag1", "tag2"]
---

# ${title}

## Code Style
- Rule 1
- Rule 2

## Best Practices
- Practice 1
- Practice 2

## Conventions
- Convention 1
- Convention 2
`,
}

// Select template
const content = useBlank ? blankTemplate : templates[category]

// Create the file
fs.writeFileSync(filepath, content, 'utf8')

console.log(`\n✅ Created: ${filepath}`)
if (useBlank) {
  console.log('   (blank template)')
}
console.log(`\nNext steps:`)
console.log(`1. Edit the file and add your prompt content`)
console.log(`2. Update tags and description`)
console.log(`3. Restart dev server to see it in the UI\n`)
