import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative mb-6">
      <Search
        className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500"
        size={20}
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder="Search prompts, tags, descriptions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search prompts"
        className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-12 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-gray-100"
      />
    </div>
  )
}
