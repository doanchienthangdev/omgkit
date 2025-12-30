---
name: managing-databases
description: AI agent performs database administration tasks including backup/restore, monitoring, replication, security hardening, and maintenance operations. Use when managing production databases, troubleshooting performance, or implementing high availability.
category: databases
triggers:
  - DBA
  - database management
  - backup
  - restore
  - replication
  - database monitoring
  - VACUUM
  - maintenance
---

# Managing Databases

## Purpose

Operate and maintain production databases with reliability and performance:

- Implement backup and disaster recovery strategies
- Configure monitoring and alerting
- Manage replication and high availability
- Perform routine maintenance operations
- Troubleshoot performance issues

## Quick Start

```bash
# PostgreSQL backup
pg_dump -Fc -d mydb > backup_$(date +%Y%m%d).dump

# Restore
pg_restore -d mydb backup_20241230.dump

# Check database health
psql -c "SELECT pg_database_size('mydb');"
psql -c "SELECT * FROM pg_stat_activity;"
```

## Features

| Feature | Description | Tools/Commands |
|---------|-------------|----------------|
| Backup/Restore | Point-in-time recovery, full/incremental | pg_dump, pg_basebackup, WAL archiving |
| Monitoring | Connections, queries, locks, replication | pg_stat_*, Prometheus, Grafana |
| Replication | Master-replica, synchronous/async | streaming replication, logical replication |
| Security | Users, roles, encryption, audit | pg_hba.conf, SSL, pgaudit |
| Maintenance | VACUUM, ANALYZE, reindex | autovacuum tuning, pg_repack |
| Connection Pooling | Reduce connection overhead | PgBouncer, pgpool-II |

## Common Patterns

### Backup Strategies

```bash
# Full backup with compression
pg_dump -Fc -Z9 -d production > backup_$(date +%Y%m%d_%H%M%S).dump

# Parallel backup for large databases
pg_dump -Fc -j 4 -d production > backup.dump

# Base backup for PITR (Point-in-Time Recovery)
pg_basebackup -D /backups/base -Fp -Xs -P -R

# Continuous WAL archiving (postgresql.conf)
archive_mode = on
archive_command = 'cp %p /archive/%f'

# Restore to specific point in time
recovery_target_time = '2024-12-30 14:30:00'
```

```sql
-- Verify backup integrity
SELECT pg_is_in_recovery();
SELECT pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn();
```

### Monitoring Queries

```sql
-- Active connections and queries
SELECT pid, usename, application_name, state, query,
       now() - query_start AS duration
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- Table sizes and bloat
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
       pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
       pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Slow queries (requires pg_stat_statements)
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;  -- Unused indexes at top

-- Lock monitoring
SELECT blocked_locks.pid AS blocked_pid,
       blocking_locks.pid AS blocking_pid,
       blocked_activity.query AS blocked_query
FROM pg_locks blocked_locks
JOIN pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

### Replication Setup

```sql
-- On primary: Create replication user
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'secret';

-- pg_hba.conf on primary
host replication replicator replica_ip/32 scram-sha-256
```

```bash
# On replica: Initialize from primary
pg_basebackup -h primary_host -U replicator -D /var/lib/postgresql/data -Fp -Xs -P -R

# Verify replication status (on primary)
SELECT client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn
FROM pg_stat_replication;

# Check replication lag (on replica)
SELECT now() - pg_last_xact_replay_timestamp() AS replication_lag;
```

### Connection Pooling (PgBouncer)

```ini
# pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction  # transaction, session, statement
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 5
reserve_pool_size = 5
```

### Maintenance Operations

```sql
-- Manual VACUUM and ANALYZE
VACUUM ANALYZE orders;

-- Aggressive vacuum for bloat
VACUUM FULL orders;  -- Locks table, use pg_repack instead

-- Reindex without locking (PostgreSQL 12+)
REINDEX INDEX CONCURRENTLY idx_orders_status;

-- Tune autovacuum per table (high-churn tables)
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.01,
  autovacuum_analyze_scale_factor = 0.005
);

-- Check autovacuum status
SELECT schemaname, relname, last_vacuum, last_autovacuum,
       last_analyze, last_autoanalyze, n_dead_tup
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

```bash
# pg_repack: Online VACUUM FULL alternative
pg_repack -d mydb -t orders
```

### Security Hardening

```sql
-- Create role with minimal privileges
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE mydb TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- Read-only user for reporting
CREATE ROLE readonly WITH LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE mydb TO readonly;
GRANT USAGE ON SCHEMA public TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;

-- Revoke public access
REVOKE ALL ON DATABASE mydb FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
```

```bash
# pg_hba.conf - Secure access rules
# TYPE  DATABASE  USER       ADDRESS         METHOD
local   all       postgres                   peer
host    mydb      app_user   10.0.0.0/8      scram-sha-256
hostssl mydb      app_user   0.0.0.0/0       scram-sha-256
```

## Use Cases

- Setting up production database infrastructure
- Troubleshooting slow queries and locks
- Implementing disaster recovery plans
- Scaling with read replicas
- Security audits and compliance

## Best Practices

| Do | Avoid |
|----|-------|
| Test restore procedures regularly | Assuming backups work without testing |
| Use connection pooling in production | Direct connections from all app instances |
| Enable pg_stat_statements for query analysis | Waiting for problems to investigate queries |
| Set up replication before you need it | Single point of failure in production |
| Use CONCURRENTLY for index operations | Blocking operations during peak hours |
| Create least-privilege database users | Using superuser for applications |
| Monitor replication lag actively | Discovering lag during failover |
| Document and automate runbooks | Manual, ad-hoc maintenance |

## Daily Health Check

```sql
-- Run this checklist daily
-- 1. Database size and growth
SELECT pg_size_pretty(pg_database_size('mydb'));

-- 2. Connection count
SELECT count(*) FROM pg_stat_activity;

-- 3. Long-running queries (>5 min)
SELECT * FROM pg_stat_activity
WHERE state != 'idle' AND query_start < now() - interval '5 minutes';

-- 4. Replication lag
SELECT now() - pg_last_xact_replay_timestamp() AS lag;

-- 5. Bloat check (dead tuples)
SELECT relname, n_dead_tup FROM pg_stat_user_tables
WHERE n_dead_tup > 10000 ORDER BY n_dead_tup DESC;

-- 6. Failed/pending transactions
SELECT * FROM pg_prepared_xacts;
```

## Emergency Procedures

```sql
-- Kill long-running query
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
WHERE query_start < now() - interval '30 minutes' AND state != 'idle';

-- Cancel query without killing connection
SELECT pg_cancel_backend(pid);

-- Emergency: Kill all connections to database
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
WHERE datname = 'mydb' AND pid != pg_backend_pid();
```

## Related Skills

See also these related skill documents:

- **optimizing-databases** - Query and index optimization
- **managing-database-migrations** - Safe schema changes
- **designing-database-schemas** - Schema architecture
