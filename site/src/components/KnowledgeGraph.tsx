import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Maximize2, Minus, Plus } from 'lucide-react'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force'
import {
  graphLinksFiltered,
  graphNodes,
  nodeGroups,
  type GraphNode,
  type LinkType,
  type NodeGroup,
} from '../data/knowledgeGraph'

interface SimNode extends SimulationNodeDatum, GraphNode {
  x?: number
  y?: number
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  type: LinkType
  label?: string
}

interface KnowledgeGraphProps {
  activeGroups: Set<NodeGroup>
  searchQuery: string
  selectedId: string | null
  onSelect: (id: string | null) => void
}

const linkColors: Record<LinkType, string> = {
  requires: '#fb7185',
  uses: '#60a5fa',
  extends: '#a78bfa',
  related: '#5a6d85',
}

const groupAnchors: Record<NodeGroup, { x: number; y: number }> = {
  fundamental: { x: 0.22, y: 0.28 },
  component: { x: 0.5, y: 0.18 },
  pattern: { x: 0.78, y: 0.3 },
  storage: { x: 0.28, y: 0.72 },
  messaging: { x: 0.55, y: 0.78 },
  system: { x: 0.78, y: 0.68 },
}

function fitViewToNodes(
  nodes: SimNode[],
  width: number,
  height: number,
  padding = 72,
): { x: number; y: number; k: number } {
  if (nodes.length === 0) return { x: 0, y: 0, k: 1 }

  const xs = nodes.map((n) => n.x ?? 0)
  const ys = nodes.map((n) => n.y ?? 0)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const graphW = Math.max(maxX - minX + 120, 1)
  const graphH = Math.max(maxY - minY + 120, 1)
  const k = Math.min(1.15, Math.min((width - padding * 2) / graphW, (height - padding * 2) / graphH))
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  return { k, x: width / 2 - cx * k, y: height / 2 - cy * k }
}

export default function KnowledgeGraph({
  activeGroups,
  searchQuery,
  selectedId,
  onSelect,
}: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [nodes, setNodes] = useState<SimNode[]>([])
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const fittedRef = useRef(false)
  const dragRef = useRef<{ nodeId: string; startX: number; startY: number; nodeX: number; nodeY: number } | null>(null)
  const panRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)

  const query = searchQuery.trim().toLowerCase()

  const visibleNodeIds = useMemo(() => {
    const ids = new Set<string>()
    for (const node of graphNodes) {
      if (!activeGroups.has(node.group)) continue
      if (query && !node.label.toLowerCase().includes(query) && !node.description.toLowerCase().includes(query)) {
        continue
      }
      ids.add(node.id)
    }
    if (selectedId || query) {
      const seed = selectedId ?? [...ids][0]
      if (seed) {
        for (const link of graphLinksFiltered) {
          if (link.source === seed || link.target === seed) {
            const src = graphNodes.find((n) => n.id === link.source)
            const tgt = graphNodes.find((n) => n.id === link.target)
            if (src && activeGroups.has(src.group)) ids.add(src.id)
            if (tgt && activeGroups.has(tgt.group)) ids.add(tgt.id)
          }
        }
      }
      if (query) {
        for (const link of graphLinksFiltered) {
          const src = graphNodes.find((n) => n.id === link.source)
          const tgt = graphNodes.find((n) => n.id === link.target)
          if (src && ids.has(src.id) && tgt && activeGroups.has(tgt.group)) ids.add(tgt.id)
          if (tgt && ids.has(tgt.id) && src && activeGroups.has(src.group)) ids.add(src.id)
        }
      }
    }
    return ids
  }, [activeGroups, query, selectedId])

  const highlightId = selectedId ?? hoveredId

  const neighborIds = useMemo(() => {
    if (!highlightId) return new Set<string>()
    const neighbors = new Set<string>()
    for (const link of graphLinksFiltered) {
      if (link.source === highlightId) neighbors.add(link.target as string)
      if (link.target === highlightId) neighbors.add(link.source as string)
    }
    return neighbors
  }, [highlightId])

  const simNodes = useMemo(
    () => graphNodes.filter((n) => visibleNodeIds.has(n.id)).map((n) => ({ ...n })) as SimNode[],
    [visibleNodeIds],
  )

  const simLinks = useMemo(
    () =>
      graphLinksFiltered
        .filter((l) => visibleNodeIds.has(l.source as string) && visibleNodeIds.has(l.target as string))
        .map((l) => ({ ...l })) as SimLink[],
    [visibleNodeIds],
  )

  const fitView = useCallback(() => {
    setTransform(fitViewToNodes(nodes.length ? nodes : simNodes, dimensions.width, dimensions.height))
  }, [nodes, simNodes, dimensions.width, dimensions.height])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDimensions({ width: Math.max(width, 400), height: Math.max(height, 480) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    fittedRef.current = false
  }, [visibleNodeIds])

  useEffect(() => {
    if (simNodes.length === 0) {
      setNodes([])
      return
    }

    const simulation = forceSimulation(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance((link) => {
            const s = link.source as SimNode
            const t = link.target as SimNode
            return s.group === t.group ? 70 : 110
          })
          .strength(0.45),
      )
      .force('charge', forceManyBody().strength(-520).distanceMax(320))
      .force('center', forceCenter(dimensions.width / 2, dimensions.height / 2).strength(0.04))
      .force(
        'x',
        forceX<SimNode>((d) => groupAnchors[d.group].x * dimensions.width).strength(0.08),
      )
      .force(
        'y',
        forceY<SimNode>((d) => groupAnchors[d.group].y * dimensions.height).strength(0.08),
      )
      .force('collide', forceCollide<SimNode>().radius((d) => (d.group === 'system' ? 22 : 18)))
      .alphaDecay(0.025)

    simulation.on('tick', () => {
      setNodes([...simNodes])
    })

    simulation.on('end', () => {
      if (!fittedRef.current) {
        setTransform(fitViewToNodes(simNodes, dimensions.width, dimensions.height))
        fittedRef.current = true
      }
    })

    return () => {
      simulation.stop()
    }
  }, [simNodes, simLinks, dimensions.width, dimensions.height])

  const zoomBy = useCallback(
    (factor: number, origin?: { x: number; y: number }) => {
      const rect = svgRef.current?.getBoundingClientRect()
      const mx = origin?.x ?? (rect ? rect.width / 2 : dimensions.width / 2)
      const my = origin?.y ?? (rect ? rect.height / 2 : dimensions.height / 2)

      setTransform((t) => {
        const newK = Math.min(2.5, Math.max(0.2, t.k * factor))
        return {
          k: newK,
          x: mx - (mx - t.x) * (newK / t.k),
          y: my - (my - t.y) * (newK / t.k),
        }
      })
    },
    [dimensions.width, dimensions.height],
  )

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return
      zoomBy(e.deltaY > 0 ? 0.9 : 1.1, { x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    [zoomBy],
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent, node?: SimNode) => {
      const target = e.currentTarget as HTMLElement
      target.setPointerCapture(e.pointerId)
      if (node) {
        dragRef.current = {
          nodeId: node.id,
          startX: e.clientX,
          startY: e.clientY,
          nodeX: node.x ?? 0,
          nodeY: node.y ?? 0,
        }
        node.fx = node.x
        node.fy = node.y
      } else {
        panRef.current = { startX: e.clientX, startY: e.clientY, origX: transform.x, origY: transform.y }
      }
    },
    [transform],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragRef.current) {
        const dx = (e.clientX - dragRef.current.startX) / transform.k
        const dy = (e.clientY - dragRef.current.startY) / transform.k
        setNodes((prev) =>
          prev.map((n) =>
            n.id === dragRef.current!.nodeId
              ? {
                  ...n,
                  fx: dragRef.current!.nodeX + dx,
                  fy: dragRef.current!.nodeY + dy,
                  x: dragRef.current!.nodeX + dx,
                  y: dragRef.current!.nodeY + dy,
                }
              : n,
          ),
        )
      } else if (panRef.current) {
        setTransform((t) => ({
          ...t,
          x: panRef.current!.origX + (e.clientX - panRef.current!.startX),
          y: panRef.current!.origY + (e.clientY - panRef.current!.startY),
        }))
      }
    },
    [transform.k],
  )

  const onPointerUp = useCallback(() => {
    dragRef.current = null
    panRef.current = null
  }, [])

  const groupColor = (group: NodeGroup) => nodeGroups.find((g) => g.id === group)?.color ?? '#888'
  const showAllLabels = !highlightId && !query

  return (
    <div className="kg-canvas-wrap" ref={containerRef}>
      <div className="kg-canvas-toolbar">
        <button type="button" className="kg-tool-btn" onClick={() => zoomBy(1.2)} aria-label="Zoom in">
          <Plus size={14} />
        </button>
        <button type="button" className="kg-tool-btn" onClick={() => zoomBy(0.83)} aria-label="Zoom out">
          <Minus size={14} />
        </button>
        <button type="button" className="kg-tool-btn" onClick={fitView} aria-label="Fit to view">
          <Maximize2 size={14} />
        </button>
        <span className="kg-zoom-label">{Math.round(transform.k * 100)}%</span>
      </div>

      <svg
        ref={svgRef}
        className="kg-canvas"
        width={dimensions.width}
        height={dimensions.height}
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <defs>
          <pattern id="kg-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" className="kg-grid-dot" />
          </pattern>
        </defs>

        <rect
          width={dimensions.width}
          height={dimensions.height}
          className="kg-canvas-bg"
          onPointerDown={(e) => onPointerDown(e)}
          onClick={() => onSelect(null)}
        />
        <rect width={dimensions.width} height={dimensions.height} fill="url(#kg-grid)" pointerEvents="none" />

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          {simLinks.map((link, i) => {
            const source = link.source as SimNode
            const target = link.target as SimNode
            if (source.x == null || target.x == null) return null

            const isHighlighted =
              highlightId &&
              (link.source === highlightId ||
                link.target === highlightId ||
                source.id === highlightId ||
                target.id === highlightId)
            const dimmed = highlightId && !isHighlighted

            const mx = (source.x + target.x) / 2
            const my = (source.y! + target.y!) / 2
            const dx = target.x - source.x
            const dy = target.y! - source.y!
            const curve = Math.min(40, Math.hypot(dx, dy) * 0.15)
            const path = `M${source.x},${source.y} Q${mx + dy * 0.1},${my - dx * 0.1 + curve} ${target.x},${target.y}`

            return (
              <path
                key={`${source.id}-${target.id}-${i}`}
                d={path}
                fill="none"
                className="kg-link"
                stroke={linkColors[link.type]}
                strokeOpacity={dimmed ? 0.06 : isHighlighted ? 0.9 : 0.28}
                strokeWidth={isHighlighted ? 2 : 1.2}
              />
            )
          })}

          {nodes.map((node) => {
            const isSelected = selectedId === node.id
            const isNeighbor = neighborIds.has(node.id)
            const isHovered = hoveredId === node.id
            const dimmed = highlightId && !isSelected && !isNeighbor && !isHovered
            const color = groupColor(node.group)
            const radius = node.group === 'system' ? 9 : 7
            const showLabel = showAllLabels || isSelected || isNeighbor || isHovered

            return (
              <g
                key={node.id}
                transform={`translate(${node.x ?? 0},${node.y ?? 0})`}
                className="kg-node"
                style={{ opacity: dimmed ? 0.15 : 1 }}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  onPointerDown(e, node)
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(node.id)
                }}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {(isSelected || isHovered) && <circle r={radius + 8} fill={color} opacity={0.18} />}
                <circle
                  r={radius}
                  fill={color}
                  stroke={isSelected ? 'var(--color-text)' : isHovered ? color : 'transparent'}
                  strokeWidth={isSelected ? 2 : 1.5}
                  strokeOpacity={isHovered ? 0.6 : 1}
                />
                {showLabel && (
                  <text
                    y={radius + 13}
                    textAnchor="middle"
                    className={`kg-node-label ${isSelected || isHovered ? 'kg-node-label-active' : ''}`}
                  >
                    {node.label}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {nodes.length === 0 && (
        <div className="kg-empty-overlay">
          <p>No concepts match your filters.</p>
        </div>
      )}
    </div>
  )
}

export function GraphDetailPanel({
  nodeId,
  onClose,
  onSelectNode,
  onCollapse,
  collapsed,
}: {
  nodeId: string | null
  onClose: () => void
  onSelectNode: (id: string) => void
  onCollapse: () => void
  collapsed: boolean
}) {
  const node = graphNodes.find((n) => n.id === nodeId)

  if (collapsed) {
    return (
      <button type="button" className="kg-panel-expand" onClick={onCollapse} aria-label="Show details panel">
        Details
      </button>
    )
  }

  if (!node) {
    return (
      <aside className="kg-panel kg-panel-empty">
        <div className="kg-panel-top">
          <h3>Concept details</h3>
          <button type="button" className="kg-panel-close" onClick={onCollapse} aria-label="Collapse panel">
            ›
          </button>
        </div>
        <p>Click a node to inspect its relationships and jump to the related chapter.</p>
        <ul className="kg-panel-tips">
          <li>Scroll to zoom · drag canvas to pan</li>
          <li>Drag nodes to untangle clusters</li>
          <li>Labels appear on hover and selection</li>
        </ul>
      </aside>
    )
  }

  const links = graphLinksFiltered.filter((l) => l.source === node.id || l.target === node.id)
  const incoming = links.filter((l) => l.target === node.id)
  const outgoing = links.filter((l) => l.source === node.id)
  const color = nodeGroups.find((g) => g.id === node.group)?.color

  return (
    <aside className="kg-panel">
      <div className="kg-panel-top">
        <span className="kg-panel-badge" style={{ background: `${color}22`, color, borderColor: `${color}44` }}>
          {nodeGroups.find((g) => g.id === node.group)?.label}
        </span>
        <div className="kg-panel-actions">
          <button type="button" className="kg-panel-close" onClick={onClose} aria-label="Clear selection">
            ×
          </button>
          <button type="button" className="kg-panel-close" onClick={onCollapse} aria-label="Collapse panel">
            ›
          </button>
        </div>
      </div>

      <h3>{node.label}</h3>
      <p className="kg-panel-desc">{node.description}</p>

      {node.chapterId && (
        <Link to={`/topics/${node.chapterId}`} className="btn btn-primary kg-panel-chapter">
          Read chapter →
        </Link>
      )}

      {outgoing.length > 0 && (
        <div className="kg-panel-section">
          <h4>Connects to ({outgoing.length})</h4>
          <ul>
            {outgoing.map((link) => {
              const target = graphNodes.find((n) => n.id === link.target)!
              return (
                <li key={`${link.source}-${link.target}`}>
                  <span className="kg-link-type">{link.type}</span>
                  <button type="button" onClick={() => onSelectNode(target.id)}>
                    {target.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {incoming.length > 0 && (
        <div className="kg-panel-section">
          <h4>Connected from ({incoming.length})</h4>
          <ul>
            {incoming.map((link) => {
              const source = graphNodes.find((n) => n.id === link.source)!
              return (
                <li key={`${link.source}-${link.target}`}>
                  <span className="kg-link-type">{link.type}</span>
                  <button type="button" onClick={() => onSelectNode(source.id)}>
                    {source.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </aside>
  )
}
