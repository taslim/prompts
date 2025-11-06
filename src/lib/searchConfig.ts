import type { IFuseOptions } from 'fuse.js'
import type { Prompt } from './types'

export const searchConfig: IFuseOptions<Prompt> = {
  threshold: 0.3,
  keys: [
    { name: 'title', weight: 3 },
    { name: 'description', weight: 2 },
    { name: 'tags', weight: 2 },
    { name: 'authors', weight: 2 },
    { name: 'content', weight: 1 },
  ],
}
