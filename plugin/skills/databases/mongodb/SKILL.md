---
name: mongodb
description: MongoDB database. Use for document storage, aggregation, NoSQL.
---

# MongoDB Skill

## Document Design
```javascript
{
  _id: ObjectId(),
  email: "user@example.com",
  profile: {
    name: "John",
    avatar: "url"
  },
  createdAt: ISODate()
}
```

## Query Patterns
```javascript
// Find
db.users.find({ email: /example.com/ });

// Aggregation
db.users.aggregate([
  { $match: { active: true } },
  { $group: { _id: "$role", count: { $sum: 1 } } }
]);

// Update
db.users.updateOne(
  { _id: id },
  { $set: { name: "New Name" } }
);
```

## Best Practices
- Design for queries
- Embed related data
- Use indexes
- Avoid deep nesting
