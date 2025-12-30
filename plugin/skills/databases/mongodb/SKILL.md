---
name: mongodb
description: MongoDB NoSQL database with document modeling, aggregation pipelines, indexing, and Mongoose ODM
category: databases
triggers:
  - mongodb
  - mongo
  - mongoose
  - nosql
  - document database
  - bson
  - aggregation
---

# MongoDB

Enterprise-grade **MongoDB NoSQL database** development following industry best practices. This skill covers document modeling, CRUD operations, aggregation pipelines, indexing strategies, Mongoose ODM, transactions, and production-ready patterns used by top engineering teams.

## Purpose

Build scalable document-based applications:

- Design effective document schemas
- Implement efficient CRUD operations
- Write powerful aggregation pipelines
- Optimize queries with proper indexing
- Use Mongoose ODM for type safety
- Handle transactions for data integrity
- Implement production patterns

## Features

### 1. Document Schema Design

```typescript
// src/models/user.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript interfaces
export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IUser extends Document {
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
  };
  addresses: IAddress[];
  role: 'admin' | 'user' | 'guest';
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(password: string): Promise<boolean>;
  getFullName(): string;
}

// Statics interface
export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findActiveUsers(): Promise<IUser[]>;
}

// Schema definition
const addressSchema = new Schema<IAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' },
}, { _id: false });

const userSchema = new Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Don't include in queries by default
  },
  profile: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    avatar: String,
    bio: { type: String, maxlength: 500 },
  },
  addresses: [addressSchema],
  role: {
    type: String,
    enum: ['admin', 'user', 'guest'],
    default: 'user',
  },
  isActive: { type: Boolean, default: true },
  lastLoginAt: Date,
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual properties
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Instance methods
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(password, this.password);
};

userSchema.methods.getFullName = function(): string {
  return `${this.profile.firstName} ${this.profile.lastName}`;
};

// Static methods
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

// Middleware (hooks)
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const bcrypt = await import('bcrypt');
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);
```

### 2. CRUD Operations

```typescript
// src/repositories/user.repository.ts
import { User, IUser } from '../models/user.model';
import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export class UserRepository {
  // Create
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async createMany(users: Partial<IUser>[]): Promise<IUser[]> {
    return User.insertMany(users);
  }

  // Read
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByIdWithPassword(id: string): Promise<IUser | null> {
    return User.findById(id).select('+password');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findByEmail(email);
  }

  async findOne(filter: FilterQuery<IUser>): Promise<IUser | null> {
    return User.findOne(filter);
  }

  async find(
    filter: FilterQuery<IUser>,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<IUser>> {
    const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  // Update
  async updateById(
    id: string,
    update: UpdateQuery<IUser>,
    options: QueryOptions = {}
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  async updateOne(
    filter: FilterQuery<IUser>,
    update: UpdateQuery<IUser>
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });
  }

  async updateMany(
    filter: FilterQuery<IUser>,
    update: UpdateQuery<IUser>
  ): Promise<{ modifiedCount: number }> {
    const result = await User.updateMany(filter, update);
    return { modifiedCount: result.modifiedCount };
  }

  // Delete
  async deleteById(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  }

  async deleteMany(filter: FilterQuery<IUser>): Promise<{ deletedCount: number }> {
    const result = await User.deleteMany(filter);
    return { deletedCount: result.deletedCount };
  }

  // Soft delete
  async softDelete(id: string): Promise<IUser | null> {
    return this.updateById(id, { isActive: false });
  }

  // Exists check
  async exists(filter: FilterQuery<IUser>): Promise<boolean> {
    const result = await User.exists(filter);
    return !!result;
  }

  // Count
  async count(filter: FilterQuery<IUser> = {}): Promise<number> {
    return User.countDocuments(filter);
  }
}
```

### 3. Aggregation Pipelines

```typescript
// src/services/analytics.service.ts
import { User } from '../models/user.model';
import { Order } from '../models/order.model';

export class AnalyticsService {
  // User statistics by role
  async getUserStatsByRole() {
    return User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          avgAddresses: { $avg: { $size: '$addresses' } },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }

  // Monthly user registrations
  async getMonthlyRegistrations(year: number) {
    return User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          count: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);
  }

  // Order revenue by product category
  async getRevenueByCategory(startDate: Date, endDate: Date) {
    return Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          totalQuantity: { $sum: '$items.quantity' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalRevenue: { $round: ['$totalRevenue', 2] },
          totalQuantity: 1,
          orderCount: 1,
          avgOrderValue: {
            $round: [{ $divide: ['$totalRevenue', '$orderCount'] }, 2],
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);
  }

  // Top customers with order summary
  async getTopCustomers(limit: number = 10) {
    return Order.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$userId',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' },
          lastOrderDate: { $max: '$createdAt' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          email: '$user.email',
          name: {
            $concat: ['$user.profile.firstName', ' ', '$user.profile.lastName'],
          },
          totalOrders: 1,
          totalSpent: { $round: ['$totalSpent', 2] },
          avgOrderValue: { $round: ['$avgOrderValue', 2] },
          lastOrderDate: 1,
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
    ]);
  }

  // Search with text score
  async searchProducts(query: string, options: { category?: string; limit?: number }) {
    const pipeline: any[] = [
      {
        $search: {
          index: 'products_search',
          text: {
            query,
            path: ['name', 'description', 'tags'],
            fuzzy: { maxEdits: 1 },
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'searchScore' },
        },
      },
    ];

    if (options.category) {
      pipeline.push({ $match: { category: options.category } });
    }

    pipeline.push(
      { $sort: { score: -1 } },
      { $limit: options.limit || 20 }
    );

    return Product.aggregate(pipeline);
  }
}
```

### 4. Transactions

```typescript
// src/services/order.service.ts
import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';

export class OrderService {
  async createOrder(userId: string, items: Array<{ productId: string; quantity: number }>) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Validate user
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate order total and validate stock
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId).session(session);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        // Decrement stock
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: -item.quantity } },
          { session }
        );

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          total: itemTotal,
        });
      }

      // Create order
      const [order] = await Order.create([{
        userId,
        items: orderItems,
        total,
        status: 'pending',
      }], { session });

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async cancelOrder(orderId: string) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const order = await Order.findById(orderId).session(session);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'pending') {
        throw new Error('Only pending orders can be cancelled');
      }

      // Restore stock
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
          { session }
        );
      }

      // Update order status
      order.status = 'cancelled';
      await order.save({ session });

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
```

### 5. Connection and Configuration

```typescript
// src/config/database.ts
import mongoose from 'mongoose';

interface DatabaseConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

export async function connectDatabase(config: DatabaseConfig): Promise<void> {
  const defaultOptions: mongoose.ConnectOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  });

  await mongoose.connect(config.uri, {
    ...defaultOptions,
    ...config.options,
  });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
}

// Health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await mongoose.connection.db.admin().ping();
    return true;
  } catch {
    return false;
  }
}
```

### 6. Indexing Strategies

```javascript
// Creating indexes for optimal query performance

// Compound index for common query patterns
db.orders.createIndex(
  { userId: 1, status: 1, createdAt: -1 },
  { name: 'user_status_date' }
);

// Partial index for active records only
db.users.createIndex(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
    name: 'active_users_email'
  }
);

// TTL index for expiring documents
db.sessions.createIndex(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'session_ttl' }
);

// Text index for full-text search
db.products.createIndex(
  { name: 'text', description: 'text', tags: 'text' },
  {
    weights: { name: 10, tags: 5, description: 1 },
    name: 'product_search'
  }
);

// Geospatial index
db.stores.createIndex(
  { location: '2dsphere' },
  { name: 'store_location' }
);

// Wildcard index for dynamic fields
db.logs.createIndex(
  { 'metadata.$**': 1 },
  { name: 'log_metadata_wildcard' }
);
```

## Use Cases

### Real-time Analytics Dashboard

```typescript
// Aggregation for dashboard metrics
async function getDashboardMetrics(timeRange: { start: Date; end: Date }) {
  const [orderStats, userStats, revenueByDay] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: timeRange.start, $lte: timeRange.end },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$total' },
        },
      },
    ]),

    User.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          newUsers: [
            {
              $match: {
                createdAt: { $gte: timeRange.start, $lte: timeRange.end },
              },
            },
            { $count: 'count' },
          ],
          byRole: [{ $group: { _id: '$role', count: { $sum: 1 } } }],
        },
      },
    ]),

    Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: timeRange.start, $lte: timeRange.end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return { orderStats, userStats: userStats[0], revenueByDay };
}
```

### Change Streams for Real-time Updates

```typescript
// Watch for real-time changes
async function watchOrderChanges(callback: (change: any) => void) {
  const changeStream = Order.watch([
    { $match: { operationType: { $in: ['insert', 'update'] } } },
  ], { fullDocument: 'updateLookup' });

  changeStream.on('change', (change) => {
    callback({
      type: change.operationType,
      document: change.fullDocument,
      timestamp: change.clusterTime,
    });
  });

  return () => changeStream.close();
}
```

## Best Practices

### Do's

- Design schemas based on query patterns
- Use appropriate indexes for queries
- Implement proper error handling
- Use transactions for multi-document operations
- Set up connection pooling
- Use lean() for read-only queries
- Implement pagination for large datasets
- Use aggregation for complex queries
- Monitor slow queries
- Set up replica sets for production

### Don'ts

- Don't embed large arrays in documents
- Don't create too many indexes
- Don't use $where or mapReduce
- Don't ignore index usage in queries
- Don't skip validation
- Don't store large files directly
- Don't use synchronous operations
- Don't ignore connection errors
- Don't hardcode connection strings
- Don't skip backups

## References

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Performance Best Practices](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/)
- [Schema Design Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)
