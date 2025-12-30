---
name: fastapi
description: FastAPI development. Use for FastAPI projects, async APIs, Pydantic models.
---

# FastAPI Skill

## Setup
```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel

app = FastAPI()
```

## Patterns

### Route with Pydantic
```python
class UserCreate(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str

@app.post("/users", response_model=User)
async def create_user(user: UserCreate):
    return await db.create_user(user)
```

### Dependency Injection
```python
async def get_db():
    db = Database()
    try:
        yield db
    finally:
        await db.close()

@app.get("/users/{id}")
async def get_user(id: str, db: Database = Depends(get_db)):
    return await db.get_user(id)
```

### Error Handling
```python
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(status_code=400, content={"error": str(exc)})
```

## Best Practices
- Use Pydantic for validation
- Use async/await
- Use dependency injection
- Document with OpenAPI
