import type { Category } from '../lib/types'

interface CategoryFilterProps {
  selectedCategory: 'all' | Category
  onCategoryChange: (category: 'all' | Category) => void
}

const categories: Array<{ id: 'all' | Category; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'simple', label: 'Simple' },
  { id: 'complex', label: 'Complex' },
  { id: 'rules', label: 'Rules' },
]

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="mb-8 flex gap-2" role="group" aria-label="Filter prompts by category">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          aria-pressed={selectedCategory === cat.id}
          aria-label={`Filter by ${cat.label} prompts`}
          className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            selectedCategory === cat.id
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
