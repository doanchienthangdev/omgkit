---
name: django
description: Enterprise Django development with DRF, ORM optimization, async views, and production patterns
category: frameworks
triggers:
  - django
  - django rest framework
  - drf
  - django orm
  - django admin
  - django templates
  - django views
  - python web framework
---

# Django

Enterprise-grade **Django development** following industry best practices. This skill covers Django REST Framework, ORM optimization, async views, authentication, testing patterns, and production deployment configurations used by top engineering teams.

## Purpose

Build scalable Python web applications with confidence:

- Design clean model architectures with proper relationships
- Implement REST APIs with Django REST Framework
- Optimize database queries for performance
- Handle authentication and permissions securely
- Write comprehensive tests for reliability
- Deploy production-ready applications
- Leverage async views for high concurrency

## Features

### 1. Model Design and Relationships

```python
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from uuid import uuid4

class User(AbstractUser):
    """Custom user model with UUID primary key and additional fields."""
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.email


class Organization(models.Model):
    """Organization with membership relationships."""
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    owner = models.ForeignKey(User, on_delete=models.PROTECT, related_name='owned_organizations')
    members = models.ManyToManyField(User, through='Membership', related_name='organizations')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'organizations'


class Membership(models.Model):
    """Through model for organization membership with roles."""
    class Role(models.TextChoices):
        OWNER = 'owner', 'Owner'
        ADMIN = 'admin', 'Admin'
        MEMBER = 'member', 'Member'
        VIEWER = 'viewer', 'Viewer'

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'memberships'
        unique_together = ['user', 'organization']


class Project(models.Model):
    """Project with soft delete and audit fields."""
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        ACTIVE = 'active', 'Active'
        ARCHIVED = 'archived', 'Archived'

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']

    @property
    def is_deleted(self):
        return self.deleted_at is not None

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save(update_fields=['deleted_at'])
```

### 2. Django REST Framework Serializers

```python
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """User serializer with computed fields."""
    full_name = serializers.SerializerMethodField()
    organization_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'full_name', 'avatar',
                  'is_verified', 'organization_count', 'created_at']
        read_only_fields = ['id', 'is_verified', 'created_at']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

    def get_organization_count(self, obj):
        return obj.organizations.count()


class UserCreateSerializer(serializers.ModelSerializer):
    """User registration serializer with password validation."""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class OrganizationSerializer(serializers.ModelSerializer):
    """Organization serializer with nested relationships."""
    owner = UserSerializer(read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ['id', 'name', 'slug', 'owner', 'member_count', 'created_at']
        read_only_fields = ['id', 'owner', 'created_at']

    def get_member_count(self, obj):
        return obj.members.count()

    def create(self, validated_data):
        user = self.context['request'].user
        org = Organization.objects.create(owner=user, **validated_data)
        Membership.objects.create(user=user, organization=org, role=Membership.Role.OWNER)
        return org


class ProjectSerializer(serializers.ModelSerializer):
    """Project serializer with validation."""
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'status', 'created_by',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def validate_name(self, value):
        org = self.context.get('organization')
        if org and Project.objects.filter(organization=org, name=value).exists():
            raise serializers.ValidationError('Project with this name already exists')
        return value
```

### 3. Views and ViewSets

```python
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Prefetch


class UserViewSet(viewsets.ModelViewSet):
    """User management viewset with custom actions."""
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Optimize with prefetch
        return queryset.prefetch_related(
            Prefetch('organizations', queryset=Organization.objects.only('id', 'name'))
        )

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        """Get or update current user."""
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)

        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Admin action to verify a user."""
        if not request.user.is_staff:
            return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)

        user = self.get_object()
        user.is_verified = True
        user.save(update_fields=['is_verified'])
        return Response({'status': 'verified'})


class OrganizationViewSet(viewsets.ModelViewSet):
    """Organization viewset with membership management."""
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        return Organization.objects.filter(
            members=self.request.user
        ).select_related('owner').annotate(
            member_count=Count('members')
        )

    @action(detail=True, methods=['get'])
    def members(self, request, slug=None):
        """List organization members."""
        org = self.get_object()
        memberships = Membership.objects.filter(organization=org).select_related('user')
        data = [
            {
                'user': UserSerializer(m.user).data,
                'role': m.role,
                'joined_at': m.joined_at
            }
            for m in memberships
        ]
        return Response(data)

    @action(detail=True, methods=['post'])
    def invite(self, request, slug=None):
        """Invite a user to the organization."""
        org = self.get_object()
        email = request.data.get('email')
        role = request.data.get('role', Membership.Role.MEMBER)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        membership, created = Membership.objects.get_or_create(
            user=user, organization=org,
            defaults={'role': role}
        )

        if not created:
            return Response({'error': 'User already a member'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'invited'}, status=status.HTTP_201_CREATED)


class ProjectViewSet(viewsets.ModelViewSet):
    """Project viewset scoped to organization."""
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        org_slug = self.kwargs.get('org_slug')
        return Project.objects.filter(
            organization__slug=org_slug,
            organization__members=self.request.user,
            deleted_at__isnull=True
        ).select_related('created_by')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        org_slug = self.kwargs.get('org_slug')
        context['organization'] = get_object_or_404(Organization, slug=org_slug)
        return context

    def perform_create(self, serializer):
        org_slug = self.kwargs.get('org_slug')
        org = get_object_or_404(Organization, slug=org_slug)
        serializer.save(organization=org, created_by=self.request.user)

    def perform_destroy(self, instance):
        # Soft delete instead of hard delete
        instance.soft_delete()
```

### 4. Custom Permissions and Authentication

```python
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication


class IsOrganizationMember(permissions.BasePermission):
    """Check if user is a member of the organization."""

    def has_permission(self, request, view):
        org_slug = view.kwargs.get('org_slug')
        if not org_slug:
            return True
        return Membership.objects.filter(
            user=request.user,
            organization__slug=org_slug
        ).exists()


class IsOrganizationAdmin(permissions.BasePermission):
    """Check if user is an admin of the organization."""

    def has_permission(self, request, view):
        org_slug = view.kwargs.get('org_slug')
        if not org_slug:
            return False
        return Membership.objects.filter(
            user=request.user,
            organization__slug=org_slug,
            role__in=[Membership.Role.OWNER, Membership.Role.ADMIN]
        ).exists()


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level permission for owner access."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check various ownership patterns
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user

        return False


# Custom JWT Authentication with additional claims
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Add custom claims to JWT token."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['is_verified'] = user.is_verified
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
```

### 5. Query Optimization and Managers

```python
from django.db import models
from django.db.models import Q, Count, Avg, F, Prefetch


class ProjectManager(models.Manager):
    """Custom manager with optimized queries."""

    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

    def with_stats(self):
        """Include task statistics."""
        return self.annotate(
            task_count=Count('tasks'),
            completed_task_count=Count('tasks', filter=Q(tasks__status='completed')),
            completion_rate=F('completed_task_count') * 100.0 / F('task_count')
        )

    def for_user(self, user):
        """Filter projects accessible to user."""
        return self.filter(organization__members=user)

    def active(self):
        """Filter active projects."""
        return self.filter(status=Project.Status.ACTIVE)

    def with_recent_activity(self, days=7):
        """Filter projects with recent activity."""
        from datetime import timedelta
        from django.utils import timezone
        cutoff = timezone.now() - timedelta(days=days)
        return self.filter(
            Q(updated_at__gte=cutoff) | Q(tasks__updated_at__gte=cutoff)
        ).distinct()


# Optimized queryset usage in views
class OptimizedProjectViewSet(viewsets.ModelViewSet):
    """ViewSet demonstrating query optimization."""

    def get_queryset(self):
        return Project.objects.select_related(
            'organization',
            'created_by'
        ).prefetch_related(
            Prefetch(
                'tasks',
                queryset=Task.objects.filter(status='active').only('id', 'title', 'status')
            ),
            'organization__members'
        ).with_stats().for_user(self.request.user)

    def list(self, request, *args, **kwargs):
        # Use values() for lightweight list responses
        queryset = self.get_queryset().values(
            'id', 'name', 'status', 'task_count', 'completion_rate', 'created_at'
        )
        return Response(list(queryset))
```

### 6. Async Views and Background Tasks

```python
from django.http import JsonResponse
from django.views import View
from asgiref.sync import sync_to_async
import asyncio


class AsyncProjectView(View):
    """Async view for concurrent operations."""

    async def get(self, request, project_id):
        # Run multiple async operations concurrently
        project, tasks, activity = await asyncio.gather(
            self.get_project(project_id),
            self.get_tasks(project_id),
            self.get_recent_activity(project_id)
        )

        return JsonResponse({
            'project': project,
            'tasks': tasks,
            'activity': activity
        })

    @sync_to_async
    def get_project(self, project_id):
        project = Project.objects.select_related('created_by').get(id=project_id)
        return {
            'id': str(project.id),
            'name': project.name,
            'status': project.status,
            'created_by': project.created_by.email
        }

    @sync_to_async
    def get_tasks(self, project_id):
        tasks = list(Task.objects.filter(project_id=project_id).values('id', 'title', 'status'))
        return tasks

    @sync_to_async
    def get_recent_activity(self, project_id):
        # Fetch recent activity logs
        from datetime import timedelta
        from django.utils import timezone
        cutoff = timezone.now() - timedelta(days=7)
        activities = list(ActivityLog.objects.filter(
            project_id=project_id,
            created_at__gte=cutoff
        ).values('action', 'created_at')[:10])
        return activities


# Celery background tasks
from celery import shared_task
from django.core.mail import send_mail


@shared_task(bind=True, max_retries=3)
def send_invitation_email(self, user_id, org_id):
    """Send organization invitation email."""
    try:
        user = User.objects.get(id=user_id)
        org = Organization.objects.get(id=org_id)

        send_mail(
            subject=f'Invitation to join {org.name}',
            message=f'You have been invited to join {org.name}.',
            from_email='noreply@example.com',
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@shared_task
def generate_project_report(project_id):
    """Generate project report asynchronously."""
    project = Project.objects.prefetch_related('tasks').get(id=project_id)

    report_data = {
        'project': project.name,
        'total_tasks': project.tasks.count(),
        'completed_tasks': project.tasks.filter(status='completed').count(),
        'generated_at': timezone.now().isoformat()
    }

    # Save report to storage
    from django.core.files.base import ContentFile
    import json

    report_content = json.dumps(report_data, indent=2)
    project.latest_report.save(
        f'report_{project_id}.json',
        ContentFile(report_content.encode())
    )

    return report_data
```

### 7. Testing Patterns

```python
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from model_bakery import baker


class UserAPITestCase(APITestCase):
    """Test case for user API endpoints."""

    def setUp(self):
        self.user = baker.make(User, email='test@example.com')
        self.client.force_authenticate(user=self.user)

    def test_get_current_user(self):
        """Test retrieving current user profile."""
        url = reverse('user-me')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')

    def test_update_current_user(self):
        """Test updating current user profile."""
        url = reverse('user-me')
        response = self.client.patch(url, {'username': 'newusername'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'newusername')

    def test_create_user_with_weak_password(self):
        """Test user creation fails with weak password."""
        url = reverse('user-list')
        data = {
            'email': 'new@example.com',
            'username': 'newuser',
            'password': '123',
            'password_confirm': '123'
        }

        self.client.force_authenticate(user=None)
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)


class OrganizationAPITestCase(APITestCase):
    """Test case for organization API endpoints."""

    def setUp(self):
        self.user = baker.make(User)
        self.org = baker.make(Organization, owner=self.user)
        baker.make(Membership, user=self.user, organization=self.org, role=Membership.Role.OWNER)
        self.client.force_authenticate(user=self.user)

    def test_list_user_organizations(self):
        """Test listing organizations user belongs to."""
        # Create another org user is not part of
        other_org = baker.make(Organization)

        url = reverse('organization-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], self.org.slug)

    def test_create_organization(self):
        """Test creating a new organization."""
        url = reverse('organization-list')
        data = {'name': 'New Org', 'slug': 'new-org'}

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Org')
        # Verify membership was created
        self.assertTrue(Membership.objects.filter(
            user=self.user,
            organization__slug='new-org',
            role=Membership.Role.OWNER
        ).exists())

    def test_invite_member(self):
        """Test inviting a member to organization."""
        new_user = baker.make(User, email='invite@example.com')
        url = reverse('organization-invite', kwargs={'slug': self.org.slug})

        response = self.client.post(url, {'email': 'invite@example.com', 'role': 'member'})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Membership.objects.filter(
            user=new_user,
            organization=self.org
        ).exists())


@pytest.fixture
def api_client():
    """Pytest fixture for API client."""
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def authenticated_client(api_client):
    """Pytest fixture for authenticated API client."""
    user = baker.make(User)
    api_client.force_authenticate(user=user)
    api_client.user = user
    return api_client


@pytest.mark.django_db
class TestProjectAPI:
    """Pytest-based tests for project API."""

    def test_create_project(self, authenticated_client):
        org = baker.make(Organization, owner=authenticated_client.user)
        baker.make(Membership, user=authenticated_client.user, organization=org)

        url = reverse('project-list', kwargs={'org_slug': org.slug})
        response = authenticated_client.post(url, {
            'name': 'Test Project',
            'description': 'A test project'
        })

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'Test Project'
        assert response.data['created_by']['id'] == str(authenticated_client.user.id)

    def test_soft_delete_project(self, authenticated_client):
        org = baker.make(Organization, owner=authenticated_client.user)
        baker.make(Membership, user=authenticated_client.user, organization=org)
        project = baker.make(Project, organization=org, created_by=authenticated_client.user)

        url = reverse('project-detail', kwargs={
            'org_slug': org.slug,
            'pk': project.id
        })
        response = authenticated_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        project.refresh_from_db()
        assert project.deleted_at is not None
```

## Use Cases

### Multi-tenant SaaS Application

```python
# settings.py - Multi-tenant configuration
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'apps.tenants.middleware.TenantMiddleware',  # Custom tenant middleware
    'django.middleware.common.CommonMiddleware',
    # ...
]

# middleware.py
from django.utils.deprecation import MiddlewareMixin
from threading import local

_thread_locals = local()

def get_current_tenant():
    return getattr(_thread_locals, 'tenant', None)

class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Extract tenant from subdomain or header
        host = request.get_host().split(':')[0]
        subdomain = host.split('.')[0]

        try:
            tenant = Organization.objects.get(slug=subdomain)
            _thread_locals.tenant = tenant
            request.tenant = tenant
        except Organization.DoesNotExist:
            _thread_locals.tenant = None
            request.tenant = None

# managers.py - Tenant-aware manager
class TenantManager(models.Manager):
    def get_queryset(self):
        tenant = get_current_tenant()
        qs = super().get_queryset()
        if tenant:
            return qs.filter(organization=tenant)
        return qs

# models.py - Tenant-scoped model
class TenantModel(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    objects = TenantManager()
    all_objects = models.Manager()  # Bypass tenant filtering

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.organization_id:
            self.organization = get_current_tenant()
        super().save(*args, **kwargs)
```

### Real-time Dashboard with WebSockets

```python
# consumers.py - Django Channels WebSocket consumer
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class DashboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
            return

        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.room_group_name = f'dashboard_{self.project_id}'

        # Verify user has access to project
        if not await self.has_project_access():
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Send initial data
        await self.send_dashboard_data()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'refresh':
            await self.send_dashboard_data()
        elif action == 'subscribe':
            # Handle subscription to specific metrics
            pass

    async def dashboard_update(self, event):
        """Handler for dashboard update messages."""
        await self.send(text_data=json.dumps({
            'type': 'update',
            'data': event['data']
        }))

    @database_sync_to_async
    def has_project_access(self):
        return Project.objects.filter(
            id=self.project_id,
            organization__members=self.user
        ).exists()

    @database_sync_to_async
    def get_dashboard_data(self):
        project = Project.objects.prefetch_related('tasks').get(id=self.project_id)
        return {
            'project': {'id': str(project.id), 'name': project.name},
            'stats': {
                'total_tasks': project.tasks.count(),
                'completed': project.tasks.filter(status='completed').count(),
                'in_progress': project.tasks.filter(status='in_progress').count(),
            }
        }

    async def send_dashboard_data(self):
        data = await self.get_dashboard_data()
        await self.send(text_data=json.dumps({
            'type': 'initial',
            'data': data
        }))


# Signal to broadcast updates
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@receiver(post_save, sender=Task)
def broadcast_task_update(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'dashboard_{instance.project_id}',
        {
            'type': 'dashboard_update',
            'data': {
                'task_id': str(instance.id),
                'status': instance.status,
                'updated_at': instance.updated_at.isoformat()
            }
        }
    )
```

## Best Practices

### Do's

- Use UUID primary keys for public-facing IDs
- Use `select_related` and `prefetch_related` for query optimization
- Use custom managers for reusable query logic
- Use signals sparingly and for cross-cutting concerns only
- Use Django REST Framework serializers for validation
- Use soft deletes for important data
- Use database indexes for frequently queried fields
- Write comprehensive tests with fixtures
- Use environment variables for configuration
- Use Celery for background tasks

### Don'ts

- Don't use `ForeignKey` without `on_delete` consideration
- Don't query in loops (N+1 problem)
- Don't store sensitive data in plain text
- Don't use `Model.objects.all()` in production views
- Don't skip migrations in deployment
- Don't use raw SQL without parameterization
- Don't ignore database connection pooling
- Don't put business logic in views
- Don't use synchronous operations for I/O-heavy tasks
- Don't skip input validation

## References

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Channels](https://channels.readthedocs.io/)
- [Celery Documentation](https://docs.celeryq.dev/)
- [Django Best Practices](https://django-best-practices.readthedocs.io/)
