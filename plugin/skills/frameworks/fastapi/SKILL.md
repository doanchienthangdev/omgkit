---
name: fastapi
description: Enterprise FastAPI development with async patterns, Pydantic v2, dependency injection, and production APIs
category: frameworks
triggers:
  - fastapi
  - fast api
  - python api
  - pydantic
  - starlette
  - async python
  - python rest api
  - uvicorn
---

# FastAPI

Enterprise-grade **FastAPI development** following industry best practices. This skill covers async programming, Pydantic v2 validation, dependency injection, authentication, background tasks, testing patterns, and production deployment configurations used by top engineering teams.

## Purpose

Build high-performance Python APIs with confidence:

- Design async API architectures for maximum throughput
- Implement comprehensive request validation with Pydantic
- Use dependency injection for clean, testable code
- Handle authentication and authorization securely
- Write comprehensive tests with pytest
- Deploy production-ready applications
- Leverage automatic OpenAPI documentation

## Features

### 1. Application Setup and Configuration

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import uvicorn

from app.api.v1 import router as api_v1_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.db.session import engine, async_session_maker
from app.db.base import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    setup_logging()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="Enterprise API",
        version="1.0.0",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
        docs_url=f"{settings.API_V1_PREFIX}/docs",
        redoc_url=f"{settings.API_V1_PREFIX}/redoc",
        lifespan=lifespan,
    )

    # Middleware
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routes
    app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

    @app.get("/health")
    async def health_check():
        return {"status": "healthy"}

    return app


app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        workers=settings.WORKERS,
    )


# app/core/config.py
from functools import lru_cache
from typing import List, Optional
from pydantic import Field, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    # Application
    PROJECT_NAME: str = "FastAPI App"
    DEBUG: bool = False
    WORKERS: int = 4
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: PostgresDsn
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | List[str]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
```

### 2. Pydantic Schemas and Validation

```python
# app/schemas/user.py
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict


class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    is_active: bool = True


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain a digit")
        if not any(c in "!@#$%^&*" for c in v):
            raise ValueError("Password must contain a special character")
        return v


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    role: str
    created_at: datetime
    updated_at: datetime


class UserResponse(UserInDB):
    """Response model excluding sensitive fields."""
    pass


class UserWithOrganizations(UserResponse):
    organizations: List["OrganizationSummary"] = []


# app/schemas/organization.py
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum


class MemberRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"


class OrganizationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    slug: str = Field(..., min_length=2, max_length=100, pattern=r"^[a-z0-9-]+$")


class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)


class OrganizationSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str


class OrganizationResponse(OrganizationSummary):
    owner_id: UUID
    member_count: int = 0
    created_at: datetime


class MembershipResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID
    organization_id: UUID
    role: MemberRole
    joined_at: datetime


# app/schemas/common.py
from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit


class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    total: int
    page: int
    limit: int
    total_pages: int
    has_more: bool

    @classmethod
    def create(
        cls,
        data: List[T],
        total: int,
        page: int,
        limit: int,
    ) -> "PaginatedResponse[T]":
        total_pages = (total + limit - 1) // limit
        return cls(
            data=data,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            has_more=page < total_pages,
        )
```

### 3. Dependency Injection

```python
# app/api/deps.py
from typing import Annotated, AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
from uuid import UUID

from app.core.config import settings
from app.db.session import async_session_maker
from app.models.user import User
from app.schemas.common import PaginationParams
from app.services.user import UserService
from app.services.organization import OrganizationService
from app.core.redis import redis_client


security = HTTPBearer()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Database session dependency."""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_redis():
    """Redis client dependency."""
    return redis_client


def get_pagination(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
) -> PaginationParams:
    """Pagination parameters dependency."""
    return PaginationParams(page=page, limit=limit)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user_service = UserService(db)
    user = await user_service.get_by_id(UUID(user_id))

    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Get current active user."""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def require_role(*roles: str):
    """Role-based access control dependency factory."""
    async def role_checker(
        current_user: Annotated[User, Depends(get_current_user)],
    ) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user
    return role_checker


async def get_organization_member(
    org_slug: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Verify user is a member of the organization."""
    org_service = OrganizationService(db)
    organization = await org_service.get_by_slug(org_slug)

    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )

    membership = await org_service.get_membership(organization.id, current_user.id)
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this organization",
        )

    return {"organization": organization, "membership": membership}


# Type aliases for cleaner signatures
DB = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]
Pagination = Annotated[PaginationParams, Depends(get_pagination)]
AdminUser = Annotated[User, Depends(require_role("admin"))]
```

### 4. Routes and Endpoints

```python
# app/api/v1/__init__.py
from fastapi import APIRouter
from app.api.v1 import auth, users, organizations, projects

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
router.include_router(projects.router, prefix="/projects", tags=["projects"])


# app/api/v1/users.py
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, HTTPException, status, Query

from app.api.deps import DB, CurrentUser, Pagination, AdminUser
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserWithOrganizations
from app.schemas.common import PaginatedResponse
from app.services.user import UserService

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[UserResponse])
async def list_users(
    db: DB,
    current_user: AdminUser,
    pagination: Pagination,
    search: Optional[str] = Query(None, min_length=2),
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
):
    """List all users (admin only)."""
    service = UserService(db)
    users, total = await service.list(
        offset=pagination.offset,
        limit=pagination.limit,
        search=search,
        role=role,
        is_active=is_active,
    )
    return PaginatedResponse.create(
        data=users,
        total=total,
        page=pagination.page,
        limit=pagination.limit,
    )


@router.get("/me", response_model=UserWithOrganizations)
async def get_current_user(db: DB, current_user: CurrentUser):
    """Get current user profile."""
    service = UserService(db)
    return await service.get_with_organizations(current_user.id)


@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    db: DB,
    current_user: CurrentUser,
    user_in: UserUpdate,
):
    """Update current user profile."""
    service = UserService(db)
    return await service.update(current_user.id, user_in)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(db: DB, current_user: AdminUser, user_id: UUID):
    """Get user by ID (admin only)."""
    service = UserService(db)
    user = await service.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(db: DB, current_user: AdminUser, user_in: UserCreate):
    """Create new user (admin only)."""
    service = UserService(db)
    existing = await service.get_by_email(user_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    return await service.create(user_in)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(db: DB, current_user: AdminUser, user_id: UUID):
    """Delete user (admin only)."""
    service = UserService(db)
    user = await service.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    await service.delete(user_id)


# app/api/v1/auth.py
from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from pydantic import BaseModel, EmailStr

from app.api.deps import DB
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, verify_password
from app.services.user import UserService
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    db: DB,
    user_in: UserCreate,
    background_tasks: BackgroundTasks,
):
    """Register a new user."""
    service = UserService(db)
    existing = await service.get_by_email(user_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = await service.create(user_in)

    # Send welcome email in background
    background_tasks.add_task(send_welcome_email, user.email, user.name)

    return user


@router.post("/login", response_model=TokenResponse)
async def login(db: DB, login_data: LoginRequest):
    """Authenticate user and return tokens."""
    service = UserService(db)
    user = await service.get_by_email(login_data.email)

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive account",
        )

    access_token = create_access_token(
        subject=str(user.id),
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    refresh_token = create_refresh_token(
        subject=str(user.id),
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(db: DB, refresh_data: RefreshRequest):
    """Refresh access token."""
    # Verify and decode refresh token
    # Generate new access token
    pass


async def send_welcome_email(email: str, name: str):
    """Background task to send welcome email."""
    # Implement email sending logic
    pass
```

### 5. Service Layer

```python
# app/services/user.py
from typing import Optional, List, Tuple
from uuid import UUID
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.models.membership import Membership
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: UUID) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.id == user_id, User.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.email == email, User.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()

    async def get_with_organizations(self, user_id: UUID) -> Optional[User]:
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.memberships).selectinload(Membership.organization))
            .where(User.id == user_id, User.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        offset: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        role: Optional[str] = None,
        is_active: Optional[bool] = None,
    ) -> Tuple[List[User], int]:
        query = select(User).where(User.deleted_at.is_(None))

        if search:
            query = query.where(
                or_(
                    User.name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%"),
                )
            )

        if role:
            query = query.where(User.role == role)

        if is_active is not None:
            query = query.where(User.is_active == is_active)

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()

        # Get paginated results
        query = query.order_by(User.created_at.desc()).offset(offset).limit(limit)
        result = await self.db.execute(query)
        users = list(result.scalars().all())

        return users, total

    async def create(self, user_in: UserCreate) -> User:
        user = User(
            email=user_in.email,
            name=user_in.name,
            hashed_password=get_password_hash(user_in.password),
            role="user",
            is_active=True,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update(self, user_id: UUID, user_in: UserUpdate) -> Optional[User]:
        user = await self.get_by_id(user_id)
        if not user:
            return None

        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete(self, user_id: UUID) -> bool:
        user = await self.get_by_id(user_id)
        if not user:
            return False

        # Soft delete
        from datetime import datetime
        user.deleted_at = datetime.utcnow()
        await self.db.commit()
        return True


# app/services/organization.py
from typing import Optional, List, Tuple
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.organization import Organization
from app.models.membership import Membership
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, MemberRole


class OrganizationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, org_id: UUID) -> Optional[Organization]:
        result = await self.db.execute(
            select(Organization).where(Organization.id == org_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Optional[Organization]:
        result = await self.db.execute(
            select(Organization).where(Organization.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_membership(
        self, org_id: UUID, user_id: UUID
    ) -> Optional[Membership]:
        result = await self.db.execute(
            select(Membership).where(
                Membership.organization_id == org_id,
                Membership.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_for_user(
        self, user_id: UUID, offset: int = 0, limit: int = 20
    ) -> Tuple[List[Organization], int]:
        query = (
            select(Organization)
            .join(Membership)
            .where(Membership.user_id == user_id)
        )

        count_result = await self.db.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar()

        result = await self.db.execute(
            query.order_by(Organization.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        organizations = list(result.scalars().all())

        return organizations, total

    async def create(
        self, org_in: OrganizationCreate, owner_id: UUID
    ) -> Organization:
        org = Organization(
            name=org_in.name,
            slug=org_in.slug,
            owner_id=owner_id,
        )
        self.db.add(org)
        await self.db.flush()

        # Create owner membership
        membership = Membership(
            user_id=owner_id,
            organization_id=org.id,
            role=MemberRole.OWNER,
        )
        self.db.add(membership)

        await self.db.commit()
        await self.db.refresh(org)
        return org

    async def add_member(
        self, org_id: UUID, user_id: UUID, role: MemberRole = MemberRole.MEMBER
    ) -> Membership:
        membership = Membership(
            user_id=user_id,
            organization_id=org_id,
            role=role,
        )
        self.db.add(membership)
        await self.db.commit()
        await self.db.refresh(membership)
        return membership
```

### 6. Database Models

```python
# app/models/user.py
from datetime import datetime
from typing import List, TYPE_CHECKING
from uuid import uuid4
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.membership import Membership
    from app.models.organization import Organization


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(50), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Relationships
    memberships: Mapped[List["Membership"]] = relationship(
        "Membership", back_populates="user", lazy="selectin"
    )
    owned_organizations: Mapped[List["Organization"]] = relationship(
        "Organization", back_populates="owner", foreign_keys="Organization.owner_id"
    )


# app/models/organization.py
from datetime import datetime
from typing import List, TYPE_CHECKING
from uuid import uuid4
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.membership import Membership


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    owner_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )

    # Relationships
    owner: Mapped["User"] = relationship(
        "User", back_populates="owned_organizations", foreign_keys=[owner_id]
    )
    memberships: Mapped[List["Membership"]] = relationship(
        "Membership", back_populates="organization"
    )


# app/models/membership.py
from datetime import datetime
from uuid import uuid4
from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.user import User
from app.models.organization import Organization


class Membership(Base):
    __tablename__ = "memberships"
    __table_args__ = (
        UniqueConstraint("user_id", "organization_id", name="uq_user_org"),
    )

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id")
    )
    organization_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id")
    )
    role: Mapped[str] = mapped_column(String(50), default="member")
    joined_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="memberships")
    organization: Mapped["Organization"] = relationship(
        "Organization", back_populates="memberships"
    )
```

### 7. Testing Patterns

```python
# tests/conftest.py
import asyncio
from typing import AsyncGenerator
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.base import Base
from app.api.deps import get_db
from app.core.security import create_access_token

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(TEST_DATABASE_URL, echo=True)
TestingSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.fixture
async def test_user(db_session: AsyncSession):
    from app.models.user import User
    from app.core.security import get_password_hash

    user = User(
        email="test@example.com",
        name="Test User",
        hashed_password=get_password_hash("TestPass123!"),
        role="user",
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest.fixture
def auth_headers(test_user):
    token = create_access_token(subject=str(test_user.id))
    return {"Authorization": f"Bearer {token}"}


# tests/test_users.py
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient, auth_headers: dict):
    response = await client.get("/api/v1/users/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_update_current_user(client: AsyncClient, auth_headers: dict):
    response = await client.patch(
        "/api/v1/users/me",
        headers=auth_headers,
        json={"name": "Updated Name"},
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"


@pytest.mark.asyncio
async def test_unauthorized_access(client: AsyncClient):
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "new@example.com",
            "name": "New User",
            "password": "SecurePass123!",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new@example.com"
    assert "password" not in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient, test_user):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "name": "Duplicate User",
            "password": "SecurePass123!",
        },
    )
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_login(client: AsyncClient, test_user):
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "TestPass123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, test_user):
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "WrongPassword123!",
        },
    )
    assert response.status_code == 401
```

## Use Cases

### Background Task Processing

```python
# app/tasks/email.py
from celery import Celery
from app.core.config import settings

celery = Celery("tasks", broker=settings.REDIS_URL)


@celery.task(bind=True, max_retries=3)
def send_email_task(self, to: str, subject: str, body: str):
    try:
        # Send email logic
        pass
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


# Using with FastAPI background tasks
from fastapi import BackgroundTasks

@router.post("/invite")
async def invite_user(
    email: str,
    background_tasks: BackgroundTasks,
    current_user: CurrentUser,
):
    # Add task to background
    background_tasks.add_task(
        send_invitation_email,
        email=email,
        inviter_name=current_user.name,
    )
    return {"message": "Invitation sent"}
```

### WebSocket for Real-time Updates

```python
# app/api/v1/websocket.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, Set
from uuid import UUID
import json

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = set()
        self.active_connections[room].add(websocket)

    def disconnect(self, websocket: WebSocket, room: str):
        if room in self.active_connections:
            self.active_connections[room].discard(websocket)

    async def broadcast(self, room: str, message: dict):
        if room in self.active_connections:
            for connection in self.active_connections[room]:
                await connection.send_json(message)


manager = ConnectionManager()


@router.websocket("/ws/projects/{project_id}")
async def project_websocket(
    websocket: WebSocket,
    project_id: UUID,
):
    room = f"project:{project_id}"
    await manager.connect(websocket, room)

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await manager.broadcast(room, message)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room)
```

## Best Practices

### Do's

- Use Pydantic v2 for all validation
- Use async/await consistently throughout
- Use dependency injection for testability
- Use proper type hints everywhere
- Use background tasks for long operations
- Use connection pooling for database
- Use Redis for caching and rate limiting
- Write comprehensive tests with pytest
- Use proper error handling with HTTPException
- Use environment variables for configuration

### Don'ts

- Don't use sync operations in async functions
- Don't skip input validation
- Don't hardcode configuration values
- Don't ignore database session management
- Don't expose sensitive data in responses
- Don't use `*` imports
- Don't skip error handling
- Don't forget to close database sessions
- Don't use blocking I/O operations
- Don't ignore type checker warnings

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic v2 Documentation](https://docs.pydantic.dev/latest/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [pytest-asyncio Documentation](https://pytest-asyncio.readthedocs.io/)
- [Starlette Documentation](https://www.starlette.io/)
