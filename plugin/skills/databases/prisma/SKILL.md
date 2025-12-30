---
name: prisma
description: Prisma ORM. Use for database access, migrations, type-safe queries.
---

# Prisma Skill

## Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       String @id @default(cuid())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

## Queries
```typescript
// Create
const user = await prisma.user.create({
  data: { email: 'test@example.com' }
});

// Find with relations
const users = await prisma.user.findMany({
  include: { posts: true },
  where: { email: { contains: '@example.com' } }
});

// Update
await prisma.user.update({
  where: { id },
  data: { email: 'new@example.com' }
});

// Transaction
await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.post.create({ data: postData })
]);
```

## Best Practices
- Use migrations
- Use transactions
- Include only needed relations
- Use select for partial data
