import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import TopicCard from '../components/TopicCard'
import { categories, chapters, type ChapterCategory } from '../data/chapters'

export default function TopicsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') as ChapterCategory | null
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    let result = chapters
    if (activeCategory) {
      result = result.filter((c) => c.category === activeCategory)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.sourceFolder.toLowerCase().includes(q),
      )
    }
    return result
  }, [activeCategory, query])

  function setCategory(cat: ChapterCategory | null) {
    if (cat) {
      setSearchParams({ category: cat })
    } else {
      setSearchParams({})
    }
  }

  const totalImages = chapters.reduce((sum, c) => sum + c.imageCount, 0)

  return (
    <div className="topics-page">
      <header className="page-header">
        <h1>All Chapters</h1>
        <p>
          {chapters.length} chapters with {totalImages} architecture diagrams — sourced directly from the
          repository notes.
        </p>
      </header>

      <div className="topics-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search chapters..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-pills">
          <button
            className={`pill ${!activeCategory ? 'pill-active' : ''}`}
            onClick={() => setCategory(null)}
          >
            All ({chapters.length})
          </button>
          {categories.map((cat) => {
            const count = chapters.filter((c) => c.category === cat.id).length
            return (
              <button
                key={cat.id}
                className={`pill ${activeCategory === cat.id ? 'pill-active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No chapters match your search.</p>
        </div>
      ) : (
        <div className="topic-grid">
          {filtered.map((chapter) => (
            <TopicCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      )}
    </div>
  )
}
