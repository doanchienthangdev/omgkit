---
name: prisma
description: Prisma ORM with type-safe queries, migrations, relations, and production database patterns
category: databases
triggers:
  - prisma
  - prisma client
  - prisma migrate
  - prisma schema
  - orm
  - type-safe database
---

# Prisma

Enterprise-grade **Prisma ORM** development following industry best practices. This skill covers schema design, type-safe queries, migrations, relations, transactions, and production-ready patterns used by top engineering teams.

## Purpose

Build type-safe database applications with confidence:

- Design comprehensive Prisma schemas
- Write type-safe database queries
- Manage database migrations
- Handle complex relations
- Implement transactions
- Optimize query performance
- Deploy to production

## Features

### 1. Schema Design

```prisma
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums
enum UserRole {
  ADMIN
  USER
  GUEST
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

// User model
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      UserRole @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  profile      Profile?
  posts        Post[]
  orders       Order[]
  memberships  Membership[]
  ownedOrgs    Organization[] @relation("OrganizationOwner")

  @@index([email])
  @@index([role, isActive])
  @@map("users")
}

// One-to-one relation
model Profile {
  id        String  @id @default(cuid())
  firstName String
  lastName  String
  avatar    String?
  bio       String?

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

// One-to-many relation
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  categories Category[]
  tags       Tag[]

  @@index([authorId])
  @@index([published, publishedAt])
  @@fulltext([title, content])
  @@map("posts")
}

// Many-to-many relation (explicit)
model Category {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
  posts Post[]

  @@map("categories")
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]

  @@map("tags")
}

// Order with items (one-to-many)
model Order {
  id        String      @id @default(cuid())
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id])

  items OrderItem[]

  @@index([userId, status])
  @@index([createdAt])
  @@map("orders")
}

model OrderItem {
  id        String  @id @default(cuid())
  quantity  Int
  price     Decimal @db.Decimal(10, 2)

  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId String
  product   Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  stock       Int      @default(0)
  createdAt   DateTime @default(now())

  orderItems OrderItem[]

  @@map("products")
}

// Many-to-many with extra fields
model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())

  ownerId String
  owner   User   @relation("OrganizationOwner", fields: [ownerId], references: [id])

  memberships Membership[]

  @@map("organizations")
}

model Membership {
  id        String   @id @default(cuid())
  role      String   @default("member")
  joinedAt  DateTime @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
  @@map("memberships")
}
```

### 2. Type-Safe Queries

```typescript
// src/repositories/user.repository.ts
import { PrismaClient, Prisma, User, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// Include types for relations
type UserWithProfile = Prisma.UserGetPayload<{
  include: { profile: true };
}>;

type UserWithOrganizations = Prisma.UserGetPayload<{
  include: {
    memberships: {
      include: { organization: true };
    };
  };
}>;

export class UserRepository {
  // Create with profile
  async createWithProfile(data: {
    email: string;
    password: string;
    profile: { firstName: string; lastName: string };
  }): Promise<UserWithProfile> {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        profile: {
          create: {
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
          },
        },
      },
      include: { profile: true },
    });
  }

  // Find with filters
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
        include: { profile: true },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        total,
        page: skip ? Math.floor(skip / (take || 20)) + 1 : 1,
        limit: take || 20,
        totalPages: Math.ceil(total / (take || 20)),
      },
    };
  }

  // Search users
  async search(query: string, role?: UserRole) {
    return prisma.user.findMany({
      where: {
        AND: [
          role ? { role } : {},
          {
            OR: [
              { email: { contains: query, mode: 'insensitive' } },
              { profile: { firstName: { contains: query, mode: 'insensitive' } } },
              { profile: { lastName: { contains: query, mode: 'insensitive' } } },
            ],
          },
        ],
      },
      include: { profile: true },
    });
  }

  // Update with upsert for profile
  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; bio?: string }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              bio: data.bio,
            },
            update: data,
          },
        },
      },
      include: { profile: true },
    });
  }

  // Delete with cascade
  async delete(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }

  // Get user with organizations
  async getUserWithOrganizations(userId: string): Promise<UserWithOrganizations | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });
  }
}
```

### 3. Transactions

```typescript
// src/services/order.service.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface OrderItem {
  productId: string;
  quantity: number;
}

export class OrderService {
  // Interactive transaction for creating order
  async createOrder(userId: string, items: OrderItem[]) {
    return prisma.$transaction(async (tx) => {
      // Validate and get products
      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== items.length) {
        throw new Error('Some products not found');
      }

      // Check stock and calculate total
      let total = new Prisma.Decimal(0);
      const orderItems: Prisma.OrderItemCreateManyOrderInput[] = [];

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId)!;

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        // Update stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });

        const itemTotal = product.price.mul(item.quantity);
        total = total.add(itemTotal);

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Create order with items
      return tx.order.create({
        data: {
          userId,
          total,
          items: {
            createMany: { data: orderItems },
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    });
  }

  // Sequential transaction for batch operations
  async batchUpdateOrderStatus(
    orderIds: string[],
    status: 'CONFIRMED' | 'SHIPPED' | 'DELIVERED'
  ) {
    const operations = orderIds.map((id) =>
      prisma.order.update({
        where: { id },
        data: { status },
      })
    );

    return prisma.$transaction(operations);
  }

  // Cancel order with stock restoration
  async cancelOrder(orderId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'PENDING') {
        throw new Error('Only pending orders can be cancelled');
      }

      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // Update order status
      return tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });
    });
  }
}
```

### 4. Migrations

```bash
# Generate migration from schema changes
npx prisma migrate dev --name add_user_profile

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
        },
      },
    },
  });

  // Create categories
  const categories = await Promise.all(
    ['Technology', 'Design', 'Business'].map((name) =>
      prisma.category.upsert({
        where: { slug: name.toLowerCase() },
        update: {},
        create: {
          name,
          slug: name.toLowerCase(),
        },
      })
    )
  );

  // Create products
  const products = await prisma.product.createMany({
    data: [
      { name: 'Product 1', price: 29.99, stock: 100 },
      { name: 'Product 2', price: 49.99, stock: 50 },
      { name: 'Product 3', price: 99.99, stock: 25 },
    ],
    skipDuplicates: true,
  });

  console.log({ admin, categories, products });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 5. Advanced Queries

```typescript
// src/repositories/post.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class PostRepository {
  // Full-text search
  async searchPosts(query: string) {
    return prisma.post.findMany({
      where: {
        OR: [
          { title: { search: query } },
          { content: { search: query } },
        ],
      },
      orderBy: {
        _relevance: {
          fields: ['title', 'content'],
          search: query,
          sort: 'desc',
        },
      },
    });
  }

  // Aggregations
  async getPostStats() {
    return prisma.post.aggregate({
      _count: { id: true },
      _avg: { id: true },
      where: { published: true },
    });
  }

  // Group by
  async getPostCountByAuthor() {
    return prisma.post.groupBy({
      by: ['authorId'],
      _count: { id: true },
      having: {
        id: { _count: { gt: 5 } },
      },
      orderBy: {
        _count: { id: 'desc' },
      },
    });
  }

  // Raw queries
  async getTopAuthors(limit: number) {
    return prisma.$queryRaw<Array<{ author_id: string; post_count: bigint }>>`
      SELECT author_id, COUNT(*) as post_count
      FROM posts
      WHERE published = true
      GROUP BY author_id
      ORDER BY post_count DESC
      LIMIT ${limit}
    `;
  }

  // Complex filtering
  async findPosts(filters: {
    categoryIds?: string[];
    tagIds?: string[];
    authorId?: string;
    published?: boolean;
    search?: string;
    dateRange?: { start: Date; end: Date };
  }) {
    const where: Prisma.PostWhereInput = {};

    if (filters.categoryIds?.length) {
      where.categories = {
        some: { id: { in: filters.categoryIds } },
      };
    }

    if (filters.tagIds?.length) {
      where.tags = {
        some: { id: { in: filters.tagIds } },
      };
    }

    if (filters.authorId) {
      where.authorId = filters.authorId;
    }

    if (filters.published !== undefined) {
      where.published = filters.published;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.dateRange) {
      where.createdAt = {
        gte: filters.dateRange.start,
        lte: filters.dateRange.end,
      };
    }

    return prisma.post.findMany({
      where,
      include: {
        author: { include: { profile: true } },
        categories: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
```

### 6. Connection and Configuration

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// With middleware for soft delete
const prismaWithSoftDelete = new PrismaClient().$extends({
  query: {
    user: {
      async findMany({ model, operation, args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async delete({ model, operation, args, query }) {
        return prisma.user.update({
          ...args,
          data: { deletedAt: new Date() },
        });
      },
    },
  },
});
```

## Use Cases

### Pagination with Cursor

```typescript
async function getPaginatedPosts(cursor?: string, take: number = 20) {
  const posts = await prisma.post.findMany({
    take: take + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  const hasMore = posts.length > take;
  const data = hasMore ? posts.slice(0, -1) : posts;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return { data, nextCursor, hasMore };
}
```

### Optimistic Concurrency

```typescript
async function updateWithVersion(postId: string, data: any, version: number) {
  const result = await prisma.post.updateMany({
    where: {
      id: postId,
      version: version,
    },
    data: {
      ...data,
      version: { increment: 1 },
    },
  });

  if (result.count === 0) {
    throw new Error('Concurrent modification detected');
  }

  return prisma.post.findUnique({ where: { id: postId } });
}
```

## Best Practices

### Do's

- Use type-safe queries with generated types
- Implement proper error handling
- Use transactions for multi-operation writes
- Create indexes for frequently queried fields
- Use select/include to limit returned data
- Implement pagination for large datasets
- Use connection pooling in production
- Run migrations in CI/CD pipelines
- Seed development databases
- Use Prisma Studio for debugging

### Don'ts

- Don't expose Prisma Client directly in APIs
- Don't skip migrations in production
- Don't use raw queries unless necessary
- Don't ignore relation loading (N+1)
- Don't hardcode connection strings
- Don't skip input validation
- Don't use implicit many-to-many for complex relations
- Don't ignore transaction isolation levels
- Don't skip database backups
- Don't use synchronous operations

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Best Practices](https://www.prisma.io/docs/guides)
- [Prisma Blog](https://www.prisma.io/blog)
