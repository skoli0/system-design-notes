import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, Image, Loader2 } from 'lucide-react'
import MarkdownContent from '../components/MarkdownContent'
import { chapters, getChapterById } from '../data/chapters'

export default function TopicPage() {
  const { id } = useParams<{ id: string }>()
  const chapter = getChapterById(id ?? '')
  const index = chapters.findIndex((c) => c.id === id)
  const prev = index > 0 ? chapters[index - 1] : null
  const next = index < chapters.length - 1 ? chapters[index + 1] : null

  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!chapter) return

    setLoading(true)
    setError(null)
    fetch(`/chapters/${chapter.id}/content.md`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load chapter content')
        return res.text()
      })
      .then(setContent)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [chapter])

  if (!chapter) {
    return (
      <div className="not-found">
        <h1>Chapter not found</h1>
        <Link to="/topics" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to topics
        </Link>
      </div>
    )
  }

  return (
    <article className="topic-article topic-article-wide">
      <nav className="breadcrumb">
        <Link to="/topics">Topics</Link>
        <span>/</span>
        <span>Chapter {chapter.order}</span>
      </nav>

      <header className="article-header">
        <div className="article-meta">
          <span className="topic-chapter-num">Chapter {chapter.order}</span>
          <span className="topic-read-time">
            <Clock size={14} />
            {chapter.readTime} min read
          </span>
          {chapter.imageCount > 0 && (
            <span className="topic-image-count">
              <Image size={14} />
              {chapter.imageCount} diagrams
            </span>
          )}
        </div>
      </header>

      {loading && (
        <div className="loading-state">
          <Loader2 size={24} className="spinner" />
          <p>Loading chapter...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <p className="error-hint">Run <code>npm run sync</code> to generate chapter content.</p>
        </div>
      )}

      {content && <MarkdownContent content={content} />}

      <nav className="article-nav">
        {prev ? (
          <Link to={`/topics/${prev.id}`} className="article-nav-link article-nav-prev">
            <span>Previous — Ch. {prev.order}</span>
            <strong>{prev.title.replace(/^Chapter \d+:\s*/i, '')}</strong>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link to={`/topics/${next.id}`} className="article-nav-link article-nav-next">
            <span>Next — Ch. {next.order}</span>
            <strong>{next.title.replace(/^Chapter \d+:\s*/i, '')}</strong>
            <ArrowRight size={16} />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  )
}
