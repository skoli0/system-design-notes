export type NodeGroup = 'fundamental' | 'component' | 'pattern' | 'storage' | 'messaging' | 'system'

export type LinkType = 'requires' | 'uses' | 'extends' | 'related'

export interface GraphNode {
  id: string
  label: string
  group: NodeGroup
  description: string
  chapterId?: string
}

export interface GraphLink {
  source: string
  target: string
  type: LinkType
  label?: string
}

export const nodeGroups: { id: NodeGroup; label: string; color: string }[] = [
  { id: 'fundamental', label: 'Fundamentals', color: '#5eead4' },
  { id: 'component', label: 'Components', color: '#60a5fa' },
  { id: 'pattern', label: 'Patterns', color: '#a78bfa' },
  { id: 'storage', label: 'Data & Storage', color: '#fbbf24' },
  { id: 'messaging', label: 'Messaging', color: '#fb7185' },
  { id: 'system', label: 'System Designs', color: '#4ade80' },
]

export const linkTypes: { id: LinkType; label: string }[] = [
  { id: 'requires', label: 'Requires' },
  { id: 'uses', label: 'Uses' },
  { id: 'extends', label: 'Extends' },
  { id: 'related', label: 'Related' },
]

function n(
  id: string,
  label: string,
  group: NodeGroup,
  description: string,
  chapterId?: string,
): GraphNode {
  return { id, label, group, description, chapterId }
}

function l(
  source: string,
  target: string,
  type: LinkType,
  label?: string,
): GraphLink {
  return { source, target, type, label }
}

export const graphNodes: GraphNode[] = [
  // Fundamentals
  n('scaling', 'Scaling', 'fundamental', 'Growing systems from one server to millions of users through vertical and horizontal strategies.', '01-scaling'),
  n('horizontal-scaling', 'Horizontal Scaling', 'fundamental', 'Adding more machines to distribute load; preferred for large-scale distributed systems.', '01-scaling'),
  n('load-balancing', 'Load Balancing', 'fundamental', 'Distributing incoming traffic across multiple servers for availability and throughput.', '01-scaling'),
  n('caching', 'Caching', 'fundamental', 'Storing frequently accessed data in fast memory layers to reduce latency and database load.', '01-scaling'),
  n('cdn', 'CDN', 'fundamental', 'Geographically distributed edge caches that serve static content close to users.', '01-scaling'),
  n('db-replication', 'DB Replication', 'fundamental', 'Copying data across database nodes for read scaling, availability, and fault tolerance.', '01-scaling'),
  n('db-sharding', 'DB Sharding', 'fundamental', 'Partitioning data across multiple database shards when a single node cannot hold all data.', '01-scaling'),
  n('stateless-design', 'Stateless Design', 'fundamental', 'Moving session state out of app servers so any instance can handle any request.', '01-scaling'),
  n('multi-datacenter', 'Multi-DC Setup', 'fundamental', 'Deploying across geographic regions for availability, disaster recovery, and lower latency.', '01-scaling'),
  n('back-of-envelope', 'Back-of-Envelope Est.', 'fundamental', 'Quick capacity calculations for QPS, storage, and bandwidth before committing to architecture.', '02-back-of-the-envelope-estimation'),
  n('design-framework', 'Design Framework', 'fundamental', 'Four-step interview process: clarify scope, high-level design, deep dive, wrap-up.', '03-system-design-framework'),
  n('cap-theorem', 'CAP Theorem', 'fundamental', 'Trade-off between consistency, availability, and partition tolerance in distributed systems.', '06-key-value-store'),

  // Components
  n('rate-limiting', 'Rate Limiting', 'component', 'Controlling request rates to prevent abuse, overload, and unfair resource usage.', '04-rate-limiter'),
  n('token-bucket', 'Token Bucket', 'component', 'Rate limiting algorithm that refills tokens at a fixed rate and allows controlled bursts.', '04-rate-limiter'),
  n('sliding-window', 'Sliding Window', 'component', 'Rate limiting algorithm using a rolling time window for more accurate throttling.', '04-rate-limiter'),
  n('consistent-hashing', 'Consistent Hashing', 'component', 'Hash ring technique that minimizes data redistribution when nodes are added or removed.', '05-consistent-hashing'),
  n('kv-store', 'Key-Value Store', 'component', 'Distributed NoSQL store optimized for simple get/put operations at massive scale.', '06-key-value-store'),
  n('gossip-protocol', 'Gossip Protocol', 'component', 'Peer-to-peer protocol for spreading cluster membership and failure detection.', '06-key-value-store'),
  n('quorum', 'Quorum Consensus', 'component', 'Requiring W writes and R reads where W + R > N for tunable consistency.', '06-key-value-store'),
  n('vector-clocks', 'Vector Clocks', 'component', 'Logical timestamps for detecting concurrent writes and resolving conflicts.', '06-key-value-store'),
  n('unique-ids', 'Unique ID Generation', 'component', 'Generating globally unique, sortable IDs in distributed systems without coordination.', '07-unique-id-generator'),
  n('snowflake-id', 'Snowflake ID', 'component', '64-bit time-ordered ID: timestamp + machine ID + sequence number.', '07-unique-id-generator'),
  n('api-gateway', 'API Gateway', 'component', 'Single entry point for routing, auth, rate limiting, and protocol translation.', '04-rate-limiter'),
  n('geohashing', 'Geohashing', 'component', 'Encoding geographic coordinates into string keys for spatial indexing and proximity queries.', '16-proximity-service'),
  n('quadtree', 'Quadtree', 'component', 'Tree data structure that recursively subdivides 2D space for spatial search.', '16-proximity-service'),
  n('trie', 'Trie', 'component', 'Prefix tree for efficient autocomplete and dictionary lookups.', '13-search-autocomplete'),

  // Patterns
  n('fan-out', 'Fan-out', 'pattern', 'Distributing an event to many recipients — on write (push) or on read (pull).', '11-news-feed-system'),
  n('pull-model', 'Pull Model', 'pattern', 'Assembling data at read time by fetching from multiple sources.', '11-news-feed-system'),
  n('push-model', 'Push Model', 'pattern', 'Pre-computing and storing results at write time for fast reads.', '11-news-feed-system'),
  n('idempotency', 'Idempotency', 'pattern', 'Ensuring duplicate requests produce the same result — critical for payments and reservations.', '22-hotel-reservation-system'),
  n('optimistic-locking', 'Optimistic Locking', 'pattern', 'Detecting conflicts at commit time using version numbers instead of holding locks.', '22-hotel-reservation-system'),
  n('pessimistic-locking', 'Pessimistic Locking', 'pattern', 'Locking resources upfront to prevent concurrent conflicting modifications.', '22-hotel-reservation-system'),
  n('event-sourcing', 'Event Sourcing', 'pattern', 'Storing state changes as an append-only log of events rather than current state.', '27-digital-wallet'),
  n('cqrs', 'CQRS', 'pattern', 'Separating read and write models for independent scaling and optimization.', '27-digital-wallet'),
  n('saga', 'Saga Pattern', 'pattern', 'Managing distributed transactions through a sequence of local transactions with compensations.', '27-digital-wallet'),
  n('two-phase-commit', '2PC', 'pattern', 'Atomic commit protocol coordinating all participants before finalizing a transaction.', '27-digital-wallet'),
  n('map-reduce', 'MapReduce', 'pattern', 'Batch processing pattern: map data to key-value pairs, shuffle, then reduce aggregates.', '21-ad-click-event-aggregation'),
  n('stream-processing', 'Stream Processing', 'pattern', 'Continuous real-time processing of event streams with windowing and watermarks.', '21-ad-click-event-aggregation'),
  n('lambda-architecture', 'Lambda Architecture', 'pattern', 'Combining batch and speed layers for comprehensive data processing.', '21-ad-click-event-aggregation'),
  n('merkle-tree', 'Merkle Tree', 'pattern', 'Hash tree for efficient anti-entropy sync and data integrity verification between replicas.', '06-key-value-store'),
  n('raft', 'Raft Consensus', 'pattern', 'Leader-based consensus algorithm for replicated state machines.', '28-stock-exchange'),
  n('leader-election', 'Leader Election', 'pattern', 'Selecting a single coordinator node responsible for ordering and replication.', '28-stock-exchange'),

  // Storage
  n('erasure-coding', 'Erasure Coding', 'storage', 'Data redundancy using parity fragments — more storage-efficient than full replication.', '24-s3-like-object-storage'),
  n('object-storage', 'Object Storage', 'storage', 'Flat namespace storage for blobs with metadata, versioning, and multipart uploads.', '24-s3-like-object-storage'),
  n('lsm-tree', 'LSM Tree', 'storage', 'Log-structured merge tree optimized for high write throughput in databases.', '23-distributed-email-service'),
  n('skip-list', 'Skip List', 'storage', 'Probabilistic data structure for O(log n) sorted-set operations in leaderboards.', '25-real-time-gaming-leaderboard'),

  // Messaging
  n('message-queue', 'Message Queue', 'messaging', 'Asynchronous buffer between producers and consumers for decoupling and load leveling.', '19-distributed-message-queue'),
  n('pub-sub', 'Pub/Sub', 'messaging', 'Publish-subscribe pattern where publishers emit events to topics consumed by subscribers.', '19-distributed-message-queue'),
  n('websocket', 'WebSocket', 'messaging', 'Full-duplex persistent connection for real-time bidirectional communication.', '12-chat-system'),
  n('long-polling', 'Long Polling', 'messaging', 'HTTP technique holding connections open until new data arrives.', '12-chat-system'),

  // System designs (case studies)
  n('url-shortener', 'URL Shortener', 'system', 'Hash-based shortening service with high read ratio and cache-heavy redirect path.', '08-url-shortener'),
  n('web-crawler', 'Web Crawler', 'system', 'Distributed URL frontier with politeness, prioritization, and deduplication.', '09-web-crawler'),
  n('notification-system', 'Notifications', 'system', 'Multi-channel delivery (push, SMS, email) with retry, rate limiting, and dedup.', '10-notification-system'),
  n('news-feed', 'News Feed', 'system', 'Timeline system with fan-out on write/read hybrid and celebrity handling.', '11-news-feed-system'),
  n('chat-system', 'Chat System', 'system', 'Real-time messaging with presence, group chat, and message sync.', '12-chat-system'),
  n('search-autocomplete', 'Search Autocomplete', 'system', 'Trie-based typeahead with data gathering pipeline and shardable index.', '13-search-autocomplete'),
  n('youtube', 'YouTube', 'system', 'Video upload, transcoding DAG, CDN streaming, and metadata management.', '14-youtube'),
  n('google-drive', 'Google Drive', 'system', 'File sync with block-level delta sync, conflict resolution, and metadata DB.', '15-google-drive'),
  n('proximity-service', 'Proximity Service', 'system', 'Nearby business search using geospatial indexes and radius queries.', '16-proximity-service'),
  n('nearby-friends', 'Nearby Friends', 'system', 'Real-time location sharing with geohash pub/sub and periodic updates.', '17-nearby-friends'),
  n('google-maps', 'Google Maps', 'system', 'Map tiles, routing graphs, navigation, and location streaming at scale.', '18-google-maps'),
  n('distributed-mq', 'Distributed MQ', 'system', 'Kafka-like broker with partitions, replication, consumer groups, and WAL.', '19-distributed-message-queue'),
  n('metrics-monitoring', 'Metrics Monitoring', 'system', 'Time-series ingestion, aggregation, visualization, and alerting pipeline.', '20-metrics-monitoring-and-alerting-system'),
  n('ad-click-aggregation', 'Ad Click Aggregation', 'system', 'Real-time and batch click counting with windowing and MapReduce.', '21-ad-click-event-aggregation'),
  n('hotel-reservation', 'Hotel Reservation', 'system', 'Inventory management with double-booking prevention and optimistic locking.', '22-hotel-reservation-system'),
  n('email-service', 'Email Service', 'system', 'SMTP sending/receiving, folder indexing, search, and attachment storage.', '23-distributed-email-service'),
  n('s3-storage', 'S3 Storage', 'system', 'Object store with erasure coding, versioning, multipart upload, and metadata service.', '24-s3-like-object-storage'),
  n('gaming-leaderboard', 'Gaming Leaderboard', 'system', 'Real-time ranked scores with skip lists, sharding, and scatter-gather reads.', '25-real-time-gaming-leaderboard'),
  n('payment-system', 'Payment System', 'system', 'Payment flows with idempotency, reconciliation, retry, and settlement.', '26-payment-system'),
  n('digital-wallet', 'Digital Wallet', 'system', 'In-app balance with event sourcing, CQRS, sagas, and strong consistency.', '27-digital-wallet'),
  n('stock-exchange', 'Stock Exchange', 'system', 'Order matching engine with deterministic sequencing, Raft, and market data.', '28-stock-exchange'),
]

export const graphLinks: GraphLink[] = [
  // Scaling foundations
  l('scaling', 'horizontal-scaling', 'extends'),
  l('scaling', 'load-balancing', 'requires'),
  l('scaling', 'caching', 'uses'),
  l('scaling', 'cdn', 'uses'),
  l('scaling', 'db-replication', 'uses'),
  l('scaling', 'db-sharding', 'uses'),
  l('scaling', 'stateless-design', 'requires'),
  l('scaling', 'multi-datacenter', 'extends'),
  l('horizontal-scaling', 'load-balancing', 'requires'),
  l('horizontal-scaling', 'consistent-hashing', 'uses'),
  l('db-sharding', 'consistent-hashing', 'uses'),
  l('design-framework', 'back-of-envelope', 'requires'),
  l('design-framework', 'scaling', 'related'),

  // Rate limiting
  l('rate-limiting', 'token-bucket', 'uses'),
  l('rate-limiting', 'sliding-window', 'uses'),
  l('api-gateway', 'rate-limiting', 'uses'),
  l('notification-system', 'rate-limiting', 'uses'),

  // KV store cluster
  l('kv-store', 'cap-theorem', 'requires'),
  l('kv-store', 'consistent-hashing', 'uses'),
  l('kv-store', 'gossip-protocol', 'uses'),
  l('kv-store', 'quorum', 'uses'),
  l('kv-store', 'vector-clocks', 'uses'),
  l('kv-store', 'merkle-tree', 'uses'),
  l('gossip-protocol', 'cap-theorem', 'related'),
  l('quorum', 'cap-theorem', 'related'),

  // IDs
  l('unique-ids', 'snowflake-id', 'extends'),
  l('url-shortener', 'unique-ids', 'uses'),
  l('snowflake-id', 'back-of-envelope', 'related'),

  // Messaging
  l('message-queue', 'pub-sub', 'related'),
  l('distributed-mq', 'message-queue', 'extends'),
  l('distributed-mq', 'pub-sub', 'uses'),
  l('distributed-mq', 'raft', 'uses'),
  l('notification-system', 'message-queue', 'uses'),
  l('youtube', 'message-queue', 'uses'),
  l('ad-click-aggregation', 'message-queue', 'uses'),
  l('metrics-monitoring', 'message-queue', 'uses'),

  // Real-time comms
  l('chat-system', 'websocket', 'uses'),
  l('chat-system', 'long-polling', 'related'),
  l('nearby-friends', 'pub-sub', 'uses'),
  l('gaming-leaderboard', 'message-queue', 'uses'),

  // Fan-out / feed
  l('news-feed', 'fan-out', 'uses'),
  l('fan-out', 'pull-model', 'related'),
  l('fan-out', 'push-model', 'related'),
  l('news-feed', 'caching', 'uses'),
  l('news-feed', 'db-sharding', 'uses'),
  l('notification-system', 'fan-out', 'uses'),

  // Spatial
  l('proximity-service', 'geohashing', 'uses'),
  l('proximity-service', 'quadtree', 'uses'),
  l('nearby-friends', 'geohashing', 'uses'),
  l('google-maps', 'geohashing', 'uses'),
  l('google-maps', 'cdn', 'uses'),

  // Search & crawl
  l('search-autocomplete', 'trie', 'uses'),
  l('search-autocomplete', 'caching', 'uses'),
  l('web-crawler', 'message-queue', 'uses'),
  l('email-service', 'lsm-tree', 'uses'),

  // Video & files
  l('youtube', 'cdn', 'uses'),
  l('youtube', 'object-storage', 'uses'),
  l('google-drive', 'object-storage', 'related'),
  l('google-drive', 'db-replication', 'uses'),

  // Storage systems
  l('s3-storage', 'object-storage', 'extends'),
  l('s3-storage', 'erasure-coding', 'uses'),
  l('s3-storage', 'consistent-hashing', 'uses'),
  l('object-storage', 'erasure-coding', 'uses'),

  // Stream processing
  l('ad-click-aggregation', 'stream-processing', 'uses'),
  l('ad-click-aggregation', 'map-reduce', 'uses'),
  l('ad-click-aggregation', 'lambda-architecture', 'extends'),
  l('stream-processing', 'message-queue', 'requires'),
  l('metrics-monitoring', 'stream-processing', 'related'),

  // Transactions
  l('hotel-reservation', 'idempotency', 'uses'),
  l('hotel-reservation', 'optimistic-locking', 'uses'),
  l('hotel-reservation', 'pessimistic-locking', 'related'),
  l('hotel-reservation', 'caching', 'uses'),
  l('payment-system', 'idempotency', 'requires'),
  l('digital-wallet', 'event-sourcing', 'uses'),
  l('digital-wallet', 'cqrs', 'uses'),
  l('digital-wallet', 'saga', 'uses'),
  l('digital-wallet', 'two-phase-commit', 'related'),
  l('payment-system', 'digital-wallet', 'related'),

  // Stock exchange
  l('stock-exchange', 'raft', 'uses'),
  l('stock-exchange', 'leader-election', 'uses'),
  l('stock-exchange', 'event-sourcing', 'uses'),
  l('leader-election', 'raft', 'extends'),

  // Leaderboard
  l('gaming-leaderboard', 'skip-list', 'uses'),
  l('gaming-leaderboard', 'caching', 'uses'),
  l('gaming-leaderboard', 'db-sharding', 'uses'),

  // Cross-system dependencies
  l('url-shortener', 'caching', 'uses'),
  l('url-shortener', 'db-replication', 'uses'),
  l('url-shortener', 'load-balancing', 'uses'),
  l('chat-system', 'kv-store', 'related'),
  l('chat-system', 'message-queue', 'uses'),
  l('metrics-monitoring', 'consistent-hashing', 'uses'),
  l('distributed-mq', 'consistent-hashing', 'uses'),
  l('scaling', 'message-queue', 'uses'),
  l('api-gateway', 'load-balancing', 'related'),
]

// Remove invalid link referencing non-existent node
export const graphLinksFiltered = graphLinks.filter((link) => {
  const ids = new Set(graphNodes.map((n) => n.id))
  return ids.has(link.source) && ids.has(link.target)
})

export function getNodeById(id: string): GraphNode | undefined {
  return graphNodes.find((n) => n.id === id)
}

export function getConnectedLinks(nodeId: string): GraphLink[] {
  return graphLinksFiltered.filter((l) => l.source === nodeId || l.target === nodeId)
}

export function getNeighborIds(nodeId: string): Set<string> {
  const neighbors = new Set<string>()
  for (const link of graphLinksFiltered) {
    if (link.source === nodeId) neighbors.add(link.target)
    if (link.target === nodeId) neighbors.add(link.source)
  }
  return neighbors
}
