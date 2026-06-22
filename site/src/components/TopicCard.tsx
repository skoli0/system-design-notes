import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Image, Hash } from 'lucide-react'
import type { Chapter } from '../data/chapters'

interface TopicCardProps {
  chapter: Chapter
  featured?: boolean
}

export default function TopicCard({ chapter, featured }: TopicCardProps) {
  return (
    <Link to={`/topics/${chapter.id}`} className={`topic-card ${featured ? 'topic-card-featured' : ''}`}>
      <div className="topic-card-meta">
        <span className="topic-chapter-num">
          <Hash size={12} />
          Ch. {chapter.order}
        </span>
        <span className="topic-read-time">
          <Clock size={12} />
          {chapter.readTime} min
        </span>
        {chapter.imageCount > 0 && (
          <span className="topic-image-count">
            <Image size={12} />
            {chapter.imageCount}
          </span>
        )}
      </div>
      <h3>{chapter.title.replace(/^Chapter \d+:\s*/i, '')}</h3>
      <p>{chapter.subtitle}</p>
      <span className="topic-card-link">
        Read chapter <ArrowRight size={14} />
      </span>
    </Link>
  )
}
