import { useState, useMemo, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Fuse from 'fuse.js'
import { Github, ExternalLink } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { CategoryFilter } from './CategoryFilter'
import { PromptCard } from './PromptCard'
import { prompts } from '../lib/loadPrompts'
import { searchConfig } from '../lib/searchConfig'
import type { Prompt, Category } from '../lib/types'

export const PromptLibrary = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [randomizedPrompts] = useState<Prompt[]>(() => {
    // Shuffle prompts on initial load using Fisher-Yates algorithm
    const shuffled = [...prompts]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  })
  const copyTimeoutRef = useRef<number | null>(null)

  // Derived from URL
  const searchQuery = searchParams.get('q') ?? ''
  const selectedCategory = (searchParams.get('category') ?? 'all') as 'all' | Category

  // Filter and search prompts
  const filteredPrompts = useMemo(() => {
    let results: Prompt[] = randomizedPrompts

    // Apply category filter first
    if (selectedCategory !== 'all') {
      results = results.filter((prompt) => prompt.category === selectedCategory)
    }

    // Apply search query on filtered results
    if (searchQuery.trim()) {
      const categoryFuse = new Fuse(results, searchConfig)
      results = categoryFuse.search(searchQuery).map((result: { item: Prompt }) => result.item)
    }

    return results
  }, [searchQuery, selectedCategory, randomizedPrompts])

  // Update URL when search changes
  const updateSearch = (query: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (query.trim()) {
        newParams.set('q', query)
      } else {
        newParams.delete('q')
      }
      return newParams
    })
  }

  // Update URL when category changes
  const updateCategory = (category: 'all' | Category) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (category === 'all') {
        newParams.delete('category')
      } else {
        newParams.set('category', category)
      }
      return newParams
    })
  }

  // Handle copy with feedback
  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)

      // Clear existing timeout if any
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }

      // Set new timeout
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedId(null)
        copyTimeoutRef.current = null
      }, 2000)
    } catch (error) {
      // Fallback for browsers without clipboard API or when permission denied
      console.error('Failed to copy to clipboard:', error)
      // Could add a toast notification here for better UX
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Prompts Library
          </h1>
          <p className="font-normal text-gray-600 dark:text-gray-400">
            My collection of reusable AI prompts and agent rules
          </p>
        </div>

        {/* Search */}
        <SearchBar value={searchQuery} onChange={updateSearch} />

        {/* Category Filters */}
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={updateCategory} />

        {/* Prompts Grid */}
        <div className="prompt-grid">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isExpanded={expandedId === prompt.id}
              onToggle={() => setExpandedId(expandedId === prompt.id ? null : prompt.id)}
              copiedId={copiedId}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            No prompts found. Try adjusting your search or filters.
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-sm text-gray-600 dark:text-gray-400 sm:justify-between">
            <p>
              Curated by{' '}
              <a
                href="https://taslim.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-gray-900 underline transition-colors hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
              >
                Taslim Okunola
                <ExternalLink size={14} />
              </a>
            </p>
            <span className="text-gray-400 dark:text-gray-600">·</span>
            <a
              href="https://github.com/taslim/prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="View source on GitHub"
            >
              <Github size={20} />
              <span className="font-medium">Open Source</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
