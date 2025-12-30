---
name: Developing with Prisma
description: The agent implements Prisma ORM for type-safe database access with schema design, migrations, and queries. Use when building database layers, designing relational schemas, implementing type-safe queries, or managing database migrations.
---

# Developing with Prisma

## Quick Start

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
  @@index([email])
}

model Post {
  id       String @id @default(cuid())
  title    String
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
```

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Features

| Feature | Description | Guide |
|---------|-------------|-------|
| Schema Design | Declarative data modeling with relations | Define models, relations, indexes in schema.prisma |
| Type-Safe Queries | Auto-generated TypeScript types | Use `findMany`, `findUnique`, `create`, `update` |
| Migrations | Version-controlled schema changes | `prisma migrate dev` for development, `deploy` for production |
| Relations | One-to-one, one-to-many, many-to-many | Use `include` or `select` to load related data |
| Transactions | ACID operations across multiple queries | Use `$transaction` for atomic operations |
| Raw Queries | Execute raw SQL when needed | Use `$queryRaw` for complex queries |

## Common Patterns

### Repository with Pagination

```typescript
async function findUsers(page = 1, limit = 20, where?: Prisma.UserWhereInput) {
  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit, include: { profile: true } }),
    prisma.user.count({ where }),
  ]);
  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}
```

### Interactive Transaction

```typescript
async function createOrder(userId: string, items: { productId: string; qty: number }[]) {
  return prisma.$transaction(async (tx) => {
    let total = 0;
    for (const item of items) {
      const product = await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } },
      });
      if (product.stock < 0) throw new Error(`Insufficient stock: ${product.name}`);
      total += product.price * item.qty;
    }
    return tx.order.create({ data: { userId, total, items: { create: items } } });
  });
}
```

### Cursor-Based Pagination

```typescript
async function getPaginatedPosts(cursor?: string, take = 20) {
  const posts = await prisma.post.findMany({
    take: take + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: 'desc' },
  });
  const hasMore = posts.length > take;
  return { data: hasMore ? posts.slice(0, -1) : posts, nextCursor: hasMore ? posts[take - 1].id : null };
}
```

## Best Practices

| Do | Avoid |
|----|-------|
| Use `select` to fetch only needed fields | Exposing Prisma Client directly in APIs |
| Create indexes for frequently queried fields | Skipping migrations in production |
| Use transactions for multi-table operations | Ignoring N+1 query problems |
| Run migrations in CI/CD pipelines | Hardcoding connection strings |
| Use connection pooling in production | Using raw queries unless necessary |
| Validate input before database operations | Using implicit many-to-many for complex joins |
| Seed development databases consistently | Ignoring transaction isolation levels |
