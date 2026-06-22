import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import KnowledgeGraph, { GraphDetailPanel } from '../components/KnowledgeGraph'
import { graphLinksFiltered, graphNodes, linkTypes, nodeGroups, type NodeGroup } from '../data/knowledgeGraph'

const allGroups = new Set(nodeGroups.map((g) => g.id))

export default function KnowledgeGraphPage() {
  const [activeGroups, setActiveGroups] = useState<Set<NodeGroup>>(allGroups)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelCollapsed, setPanelCollapsed] = useState(false)

  const stats = useMemo(
    () => ({
      nodes: graphNodes.length,
      edges: graphLinksFiltered.length,
    }),
    [],
  )

  function toggleGroup(group: NodeGroup) {
    setActiveGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) {
        if (next.size === 1) return prev
        next.delete(group)
      } else {
        next.add(group)
      }
      return next
    })
  }

  return (
    <div className="kg-page">
      <div className="kg-toolbar">
        <div className="kg-toolbar-title">
          <h1>Concept map</h1>
          <span>{stats.nodes} concepts · {stats.edges} links</span>
        </div>

        <div className="search-box kg-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="kg-legend">
          {nodeGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`kg-legend-item ${activeGroups.has(group.id) ? 'kg-legend-active' : ''}`}
              onClick={() => toggleGroup(group.id)}
            >
              <span className="kg-legend-dot" style={{ background: group.color }} />
              {group.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`kg-layout ${panelCollapsed ? 'kg-layout-expanded' : ''}`}>
        <KnowledgeGraph
          activeGroups={activeGroups}
          searchQuery={searchQuery}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <div className="kg-link-legend kg-link-legend-float">
          {linkTypes.map((lt) => (
            <span key={lt.id} className="kg-link-legend-item">
              <span className="kg-link-legend-line" data-type={lt.id} />
              {lt.label}
            </span>
          ))}
        </div>

        <GraphDetailPanel
          nodeId={selectedId}
          onClose={() => setSelectedId(null)}
          onSelectNode={setSelectedId}
          collapsed={panelCollapsed}
          onCollapse={() => setPanelCollapsed((c) => !c)}
        />
      </div>
    </div>
  )
}
