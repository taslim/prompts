import { Copy, Check } from 'lucide-react'
import type { Prompt } from '../lib/types'

interface PromptCardProps {
  prompt: Prompt
  isExpanded: boolean
  onToggle: () => void
  copiedId: string | null
  onCopy: (id: string, content: string) => void
}

export const PromptCard = ({ prompt, isExpanded, onToggle, copiedId, onCopy }: PromptCardProps) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCopy(prompt.id, prompt.content)
  }

  const getCategoryColor = () => {
    switch (prompt.category) {
      case 'simple':
        return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
      case 'complex':
        return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
      case 'rules':
        return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div
      className={`relative cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 ${!isExpanded ? 'h-[140px]' : ''}`}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${prompt.title}. ${isExpanded ? 'Collapse' : 'Expand'} to ${isExpanded ? 'hide' : 'view'} prompt details`}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={handleCopy}
          aria-label={
            copiedId === prompt.id ? 'Prompt copied to clipboard' : 'Copy prompt to clipboard'
          }
          className="rounded bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        >
          {copiedId === prompt.id ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <span className={`rounded px-2 py-1 text-xs font-medium ${getCategoryColor()}`}>
          {prompt.category}
        </span>
      </div>

      <div className="mb-3 pr-16">
        <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
          {prompt.title}
        </h3>
        <p
          className={`text-sm text-gray-500 dark:text-gray-400 ${!isExpanded ? 'line-clamp-3' : ''}`}
        >
          {prompt.description}
        </p>
      </div>

      {isExpanded && (
        <>
          <div className="mt-4 rounded border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <pre className="font-mono text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {prompt.content}
            </pre>
          </div>
          <button
            onClick={handleCopy}
            aria-label={
              copiedId === prompt.id ? 'Prompt copied to clipboard' : 'Copy prompt to clipboard'
            }
            className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {copiedId === prompt.id ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Prompt
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}
