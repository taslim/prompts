# Prompt Library

A personal prompt library for storing and managing reusable AI prompts. Features semantic search, dark mode, and dead-simple forking.

## Quick Start

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:5173`

## Adding Prompts

All new prompts start as drafts in `prompts/drafts/` (git-ignored).

### Create Draft

```bash
pnpm new
```

Creates draft with `status: "draft"` in frontmatter.

### Publish Draft

1. Edit your prompt in `prompts/drafts/`
2. Change `status: "ready"` in frontmatter
3. Run `pnpm publish:prompts`
4. Restart dev server

### Categories

- `simple` - Quick prompts (< 100 words)
- `complex` - Multi-section prompts for GPTs/Gems
- `rules` - Agent configs for Cursor/coding tools

### Create Manually (Skip Drafts)

1. Add `.mdx` file to `/prompts/{category}/`
2. Use kebab-case: `blog-outline-generator.mdx`
3. Add frontmatter:

```mdx
---
---
title: "Your Title"
description: "When/how you use this"
tags: [tag1, tag2]
authors: [Author1, Author2]
source: "[Optional Link Text](https://example.com)"
---

Your prompt content...
```

Required: `title`, `description`, `authors`  
*Optional: `tags`, `source` (must be `[Text](url)` format)

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
