# Prompt Library

A personal prompt library for storing and managing reusable AI prompts. Features semantic search, dark mode, and dead-simple forking.

## Quick Start

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:5173`

## Adding Prompts

### Interactive Mode (Recommended)

```bash
pnpm new
```

Interactive prompts guide you through category, title, and template selection.

### CLI Mode

```bash
# With template
pnpm new --category=simple --title="Your Prompt Title"

# Blank template (just frontmatter)
pnpm new --category=simple --title="Your Prompt Title" --blank
```

Categories:
- `simple` - Quick prompts (< 100 words)
- `complex` - Multi-section prompts for GPTs/Gems
- `rules` - Agent configs for Cursor/coding tools

### Create Manually

1. Add `.mdx` file to `/prompts/{category}/`
2. Use kebab-case: `blog-outline-generator.mdx`
3. Add frontmatter:

```mdx
---
title: "Your Title"
description: "When/how you use this"
tags: ["tag1", "tag2"]
---

Your prompt content...
```

4. Restart dev server

## Fork & Customize

1. Fork this repo
2. Delete or update prompts in `/prompts/`
3. Add your own using `pnpm new`
4. Deploy to Vercel (or any static host)

That's it. The UI, search, and categories work automatically.

## Deploy

Push to GitHub → Import in Vercel → Done

Build command: `pnpm build`  
Output directory: `dist`

## Tech

React + TypeScript + Vite + Tailwind + MDX + Fuse.js

## License

MIT
