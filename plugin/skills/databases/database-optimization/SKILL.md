---
name: database-optimization
description: Advanced database performance tuning including query optimization, indexing strategies, partitioning, and scaling patterns
category: databases
triggers:
  - database optimization
  - query optimization
  - indexing
  - database performance
  - slow queries
  - database scaling
  - partitioning
---

# Database Optimization

Master **database performance tuning** for high-scale applications. This skill covers query optimization, indexing strategies, partitioning, and scaling patterns.

## Purpose

Optimize database performance for production workloads:

- Analyze and optimize slow queries
- Design effective indexing strategies
- Implement table partitioning
- Configure connection pooling
- Scale with read replicas
- Plan database migrations

## Features

### 1. Query Optimization

```sql
-- Identify slow queries
-- PostgreSQL
SELECT
  query,
  calls,
  total_time / 1000 as total_seconds,
  mean_time / 1000 as mean_seconds,
  rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 20;

-- Analyze query execution plan
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id;

-- Before optimization (sequential scan, nested loop)
-- After optimization (index scan, hash join)
```

```typescript
// Query optimization patterns

// BAD: N+1 query problem
const users = await db.user.findMany();
for (const user of users) {
  const orders = await db.order.findMany({ where: { userId: user.id } });
  // Process orders...
}

// GOOD: Eager loading
const users = await db.user.findMany({
  include: {
    orders: {
      where: { status: 'completed' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
  },
});

// GOOD: Batch loading with DataLoader
const userLoader = new DataLoader(async (userIds: string[]) => {
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
  });
  return userIds.map(id => users.find(u => u.id === id));
});

// Pagination optimization
// BAD: OFFSET pagination (slow on large tables)
SELECT * FROM orders ORDER BY created_at LIMIT 20 OFFSET 10000;

// GOOD: Cursor-based pagination
async function getOrdersPage(cursor?: string, limit: number = 20) {
  return db.order.findMany({
    take: limit + 1, // Fetch one extra to check if there's more
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { createdAt: 'desc' },
  });
}

// Selective column loading
// BAD: SELECT *
const users = await db.user.findMany();

// GOOD: Select only needed columns
const users = await db.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});
```

### 2. Indexing Strategies

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (column order matters!)
-- Good for: WHERE status = ? AND created_at > ?
CREATE INDEX idx_orders_status_created ON orders(status, created_at);

-- Partial index (smaller, faster)
CREATE INDEX idx_orders_pending ON orders(created_at)
WHERE status = 'pending';

-- Covering index (includes all needed columns)
CREATE INDEX idx_orders_user_covering ON orders(user_id)
INCLUDE (status, total, created_at);

-- Expression index
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

-- GiST index for full-text search
CREATE INDEX idx_products_search ON products
USING GIN(to_tsvector('english', name || ' ' || description));

-- Index for JSON queries
CREATE INDEX idx_settings_preferences ON users
USING GIN((settings->'preferences'));
```

```typescript
// Index analysis tool
async function analyzeTableIndexes(tableName: string): Promise<IndexAnalysis> {
  // Get existing indexes
  const indexes = await db.$queryRaw`
    SELECT
      indexname,
      indexdef,
      pg_size_pretty(pg_relation_size(indexname::regclass)) as size
    FROM pg_indexes
    WHERE tablename = ${tableName}
  `;

  // Get index usage stats
  const stats = await db.$queryRaw`
    SELECT
      indexrelname as index_name,
      idx_scan as scans,
      idx_tup_read as tuples_read,
      idx_tup_fetch as tuples_fetched
    FROM pg_stat_user_indexes
    WHERE relname = ${tableName}
  `;

  // Find unused indexes
  const unused = stats.filter(s => s.scans === 0);

  // Find missing index opportunities
  const missingIndexSuggestions = await db.$queryRaw`
    SELECT
      schemaname || '.' || relname as table,
      seq_scan,
      seq_tup_read,
      idx_scan,
      seq_tup_read / seq_scan as avg_seq_tuples
    FROM pg_stat_user_tables
    WHERE seq_scan > 0
      AND relname = ${tableName}
      AND seq_tup_read / seq_scan > 1000
  `;

  return {
    indexes,
    stats,
    unusedIndexes: unused,
    missingIndexSuggestions,
    recommendations: generateRecommendations(indexes, stats, missingIndexSuggestions),
  };
}

// Index recommendations
function generateRecommendations(indexes, stats, missing): string[] {
  const recommendations: string[] = [];

  // Check for unused indexes
  for (const unused of stats.filter(s => s.scans === 0)) {
    recommendations.push(
      `Consider dropping unused index: ${unused.index_name}`
    );
  }

  // Check for missing indexes on frequently scanned columns
  if (missing.length > 0) {
    recommendations.push(
      `High sequential scans detected. Consider adding indexes.`
    );
  }

  return recommendations;
}
```

### 3. Table Partitioning

```sql
-- Range partitioning by date (PostgreSQL)
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  total DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
  FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- Automatic partition creation
CREATE OR REPLACE FUNCTION create_partition_if_not_exists()
RETURNS TRIGGER AS $$
DECLARE
  partition_name TEXT;
  start_date DATE;
  end_date DATE;
BEGIN
  start_date := DATE_TRUNC('month', NEW.created_at);
  end_date := start_date + INTERVAL '1 month';
  partition_name := 'orders_' || TO_CHAR(start_date, 'YYYY_MM');

  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = partition_name) THEN
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF orders
       FOR VALUES FROM (%L) TO (%L)',
      partition_name, start_date, end_date
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

```typescript
// Partition management
class PartitionManager {
  // Create future partitions proactively
  async createFuturePartitions(tableName: string, monthsAhead: number = 3): Promise<void> {
    const now = new Date();

    for (let i = 0; i <= monthsAhead; i++) {
      const partitionDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);

      const partitionName = `${tableName}_${partitionDate.getFullYear()}_${String(partitionDate.getMonth() + 1).padStart(2, '0')}`;

      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS ${partitionName}
        PARTITION OF ${tableName}
        FOR VALUES FROM (${partitionDate}) TO (${nextMonth})
      `;
    }
  }

  // Archive old partitions
  async archiveOldPartitions(tableName: string, retentionMonths: number): Promise<void> {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - retentionMonths);

    const partitions = await this.getPartitions(tableName);

    for (const partition of partitions) {
      if (partition.endDate < cutoff) {
        // Export to archive storage
        await this.exportPartition(partition.name);

        // Drop partition
        await db.$executeRaw`DROP TABLE ${partition.name}`;
      }
    }
  }
}
```

### 4. Connection Pooling

```typescript
// PgBouncer configuration
// pgbouncer.ini
[databases]
myapp = host=localhost dbname=myapp

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3
server_lifetime = 3600
server_idle_timeout = 600
server_connect_timeout = 15
server_login_retry = 1

// Application-level pooling with Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'warn', 'error'],
});

// Configure pool size
// DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=10"

// Connection pool monitoring
async function getPoolStats(): Promise<PoolStats> {
  const stats = await prisma.$queryRaw`
    SELECT
      numbackends as active_connections,
      xact_commit as commits,
      xact_rollback as rollbacks,
      blks_read as blocks_read,
      blks_hit as blocks_hit,
      tup_returned as rows_returned,
      tup_fetched as rows_fetched,
      tup_inserted as rows_inserted,
      tup_updated as rows_updated,
      tup_deleted as rows_deleted
    FROM pg_stat_database
    WHERE datname = current_database()
  `;

  return {
    ...stats[0],
    cacheHitRatio: stats[0].blks_hit / (stats[0].blks_hit + stats[0].blks_read),
  };
}
```

### 5. Read Replicas

```typescript
// Read/Write splitting
class DatabaseRouter {
  private writeClient: PrismaClient;
  private readClients: PrismaClient[];
  private currentReadIndex = 0;

  constructor() {
    this.writeClient = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_WRITE_URL } },
    });

    this.readClients = (process.env.DATABASE_READ_URLS || '')
      .split(',')
      .map(url => new PrismaClient({ datasources: { db: { url } } }));
  }

  // Get client for write operations
  get write(): PrismaClient {
    return this.writeClient;
  }

  // Round-robin load balancing for reads
  get read(): PrismaClient {
    if (this.readClients.length === 0) {
      return this.writeClient;
    }

    const client = this.readClients[this.currentReadIndex];
    this.currentReadIndex = (this.currentReadIndex + 1) % this.readClients.length;
    return client;
  }

  // Transaction always uses write
  async transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.writeClient.$transaction(fn);
  }
}

const db = new DatabaseRouter();

// Usage
// Reads go to replicas
const users = await db.read.user.findMany();

// Writes go to primary
const newUser = await db.write.user.create({ data: userData });

// Transactions use primary
await db.transaction(async (tx) => {
  await tx.order.create({ data: orderData });
  await tx.inventory.update({ where: { id }, data: { stock: { decrement: 1 } } });
});
```

### 6. Query Performance Monitoring

```typescript
// Slow query logging and analysis
class QueryMonitor {
  private slowQueryThreshold = 1000; // 1 second

  // Prisma middleware for query logging
  setupMiddleware(prisma: PrismaClient): void {
    prisma.$use(async (params, next) => {
      const start = Date.now();
      const result = await next(params);
      const duration = Date.now() - start;

      if (duration > this.slowQueryThreshold) {
        this.logSlowQuery({
          model: params.model,
          action: params.action,
          duration,
          args: params.args,
        });
      }

      // Record metrics
      queryHistogram.observe({
        model: params.model || 'unknown',
        action: params.action,
      }, duration / 1000);

      return result;
    });
  }

  private logSlowQuery(query: SlowQuery): void {
    logger.warn({
      type: 'slow_query',
      ...query,
    }, `Slow query detected: ${query.model}.${query.action}`);

    // Send to monitoring
    metrics.increment('database.slow_queries', {
      model: query.model,
      action: query.action,
    });
  }

  // Get query statistics
  async getQueryStats(): Promise<QueryStats[]> {
    return db.$queryRaw`
      SELECT
        query,
        calls,
        total_time,
        mean_time,
        rows,
        shared_blks_hit,
        shared_blks_read,
        shared_blks_hit::float / NULLIF(shared_blks_hit + shared_blks_read, 0) as cache_hit_ratio
      FROM pg_stat_statements
      ORDER BY total_time DESC
      LIMIT 50
    `;
  }

  // Reset statistics
  async resetStats(): Promise<void> {
    await db.$executeRaw`SELECT pg_stat_statements_reset()`;
  }
}
```

## Use Cases

### 1. E-commerce Query Optimization

```sql
-- Optimized product search query
SELECT p.*, c.name as category_name
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE
  p.status = 'active'
  AND p.price BETWEEN 10 AND 100
  AND to_tsvector('english', p.name || ' ' || p.description) @@ plainto_tsquery('english', 'wireless headphones')
ORDER BY p.popularity DESC, p.created_at DESC
LIMIT 20;

-- Index for this query
CREATE INDEX idx_products_search ON products
USING GIN(to_tsvector('english', name || ' ' || description))
WHERE status = 'active';

CREATE INDEX idx_products_price_popularity ON products(price, popularity DESC)
WHERE status = 'active';
```

### 2. Analytics Dashboard

```sql
-- Materialized view for dashboard
CREATE MATERIALIZED VIEW daily_sales_summary AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as order_count,
  SUM(total) as revenue,
  AVG(total) as avg_order_value,
  COUNT(DISTINCT user_id) as unique_customers
FROM orders
WHERE status = 'completed'
GROUP BY DATE_TRUNC('day', created_at);

-- Refresh periodically
CREATE UNIQUE INDEX idx_daily_sales_date ON daily_sales_summary(date);

-- Refresh concurrently (no locks)
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales_summary;
```

## Best Practices

### Do's

- **Analyze query plans** - Use EXPLAIN ANALYZE
- **Use appropriate indexes** - Based on actual query patterns
- **Implement connection pooling** - PgBouncer or app-level
- **Monitor slow queries** - Set up alerts
- **Plan for growth** - Partitioning, sharding
- **Test with production-like data** - Not empty tables

### Don'ts

- Don't add indexes blindly
- Don't use SELECT *
- Don't ignore query plans
- Don't skip connection limits
- Don't forget about index maintenance
- Don't over-normalize

## Related Skills

- **postgresql** - PostgreSQL specific features
- **prisma** - ORM optimization
- **caching-strategies** - Query result caching

## Reference Resources

- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance-tips.html)
- [Use The Index, Luke](https://use-the-index-luke.com/)
- [PgBouncer Documentation](https://www.pgbouncer.org/config.html)
- [Prisma Performance](https://www.prisma.io/docs/guides/performance-and-optimization)
