import { Link } from 'react-router-dom'
import { ArrowRight, Layers, Zap, BookMarked } from 'lucide-react'
import TopicCard from '../components/TopicCard'
import { categories, chapters } from '../data/chapters'

const categoryIcons = {
  fundamentals: Layers,
  'building-blocks': Zap,
  'case-studies': BookMarked,
}

export default function HomePage() {
  const featured = chapters.filter((c) =>
    ['01-scaling', '04-rate-limiter', '08-url-shortener', '11-news-feed-system', '12-chat-system'].includes(
      c.id,
    ),
  )
  const totalImages = chapters.reduce((sum, c) => sum + c.imageCount, 0)
  const firstChapter = chapters[0]

  return (
    <>
      <section className="hero">
        <div className="hero-badge">From the repository</div>
        <h1>
          Learn <em>system design</em> with real notes &amp; diagrams
        </h1>
        <p className="hero-subtitle">
          {chapters.length} chapters covering scalability fundamentals, building blocks, and full case
          studies — with {totalImages} architecture diagrams from the original notes.
        </p>
        <div className="hero-actions">
          <Link to="/topics" className="btn btn-primary">
            Browse all chapters <ArrowRight size={16} />
          </Link>
          <Link to="/graph" className="btn btn-secondary">
            Explore knowledge graph
          </Link>
          {firstChapter && (
            <Link to={`/topics/${firstChapter.id}`} className="btn btn-secondary">
              Start with Chapter 1
            </Link>
          )}
        </div>
        <div className="hero-stats">
          <div>
            <strong>{chapters.length}</strong>
            <span>chapters</span>
          </div>
          <div>
            <strong>{totalImages}</strong>
            <span>diagrams</span>
          </div>
          <div>
            <strong>{chapters.filter((c) => c.category === 'case-studies').length}</strong>
            <span>case studies</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Learning paths</h2>
        <p className="section-desc">Work through chapters in order or jump to any topic.</p>
        <div className="category-grid">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id]
            const count = chapters.filter((c) => c.category === cat.id).length
            return (
              <Link key={cat.id} to={`/topics?category=${cat.id}`} className="category-card">
                <div className="category-icon">
                  <Icon size={22} />
                </div>
                <h3>{cat.label}</h3>
                <p>{cat.description}</p>
                <span className="category-count">{count} chapters</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="section">
        <h2>Featured chapters</h2>
        <div className="topic-grid">
          {featured.map((chapter) => (
            <TopicCard key={chapter.id} chapter={chapter} featured />
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>See how concepts connect</h2>
        <p>
          Explore an interactive knowledge graph mapping {chapters.length} chapters to fundamentals,
          patterns, and system designs.
        </p>
        <Link to="/graph" className="btn btn-primary">
          Open knowledge graph <ArrowRight size={16} />
        </Link>
      </section>

      <section className="cta-section">
        <h2>Ready to dive in?</h2>
        <p>Every chapter includes the original text, architecture diagrams, and step-by-step design walkthroughs.</p>
        {firstChapter && (
          <Link to={`/topics/${firstChapter.id}`} className="btn btn-primary">
            Begin with Chapter 1 <ArrowRight size={16} />
          </Link>
        )}
      </section>
    </>
  )
}
