---
name: laravel
description: Enterprise Laravel development with Eloquent, API resources, testing, and production patterns
category: frameworks
triggers:
  - laravel
  - php framework
  - eloquent
  - blade
  - artisan
  - php api
  - laravel api
  - lumen
---

# Laravel

Enterprise-grade **Laravel development** following industry best practices. This skill covers Eloquent ORM, API resources, service patterns, authentication, testing, queues, and production deployment configurations used by top engineering teams.

## Purpose

Build robust PHP applications with confidence:

- Design clean model architectures with Eloquent
- Implement REST APIs with API Resources
- Use service and repository patterns
- Handle authentication with Laravel Sanctum
- Write comprehensive tests with PHPUnit
- Deploy production-ready applications
- Leverage queues for background processing

## Features

### 1. Model Design and Relationships

```php
<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'role' => 'user',
        'is_active' => true,
    ];

    // Relationships
    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'memberships')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function ownedOrganizations(): HasMany
    {
        return $this->hasMany(Organization::class, 'owner_id');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }

    // Accessors & Mutators
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucwords($value),
            set: fn (string $value) => strtolower($value),
        );
    }

    // Methods
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function belongsToOrganization(Organization $organization): bool
    {
        return $this->organizations()->where('organizations.id', $organization->id)->exists();
    }
}


// app/Models/Organization.php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'owner_id',
    ];

    // Relationships
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'memberships')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    // Scopes
    public function scopeForUser($query, User $user)
    {
        return $query->whereHas('members', fn ($q) => $q->where('users.id', $user->id));
    }
}


// app/Models/Project.php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'status',
        'created_by',
    ];

    protected $casts = [
        'status' => ProjectStatus::class,
    ];

    protected $attributes = [
        'status' => ProjectStatus::DRAFT,
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', ProjectStatus::ACTIVE);
    }

    public function scopeForOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }
}


// app/Enums/ProjectStatus.php
namespace App\Enums;

enum ProjectStatus: string
{
    case DRAFT = 'draft';
    case ACTIVE = 'active';
    case COMPLETED = 'completed';
    case ARCHIVED = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::ACTIVE => 'Active',
            self::COMPLETED => 'Completed',
            self::ARCHIVED => 'Archived',
        };
    }
}
```

### 2. API Resources and Collections

```php
<?php
// app/Http/Resources/UserResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),

            // Conditional relationships
            'organizations' => OrganizationResource::collection(
                $this->whenLoaded('organizations')
            ),
            'organization_count' => $this->when(
                $this->organizations_count !== null,
                $this->organizations_count
            ),
        ];
    }
}


// app/Http/Resources/OrganizationResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'owner' => new UserResource($this->whenLoaded('owner')),
            'member_count' => $this->when(
                $this->members_count !== null,
                $this->members_count
            ),
            'created_at' => $this->created_at->toIso8601String(),

            // Pivot data when loaded through relationship
            'membership' => $this->when($this->pivot, [
                'role' => $this->pivot?->role,
                'joined_at' => $this->pivot?->created_at?->toIso8601String(),
            ]),
        ];
    }
}


// app/Http/Resources/ProjectResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],
            'organization' => new OrganizationResource($this->whenLoaded('organization')),
            'creator' => new UserResource($this->whenLoaded('creator')),
            'task_count' => $this->when(
                $this->tasks_count !== null,
                $this->tasks_count
            ),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}


// app/Http/Resources/PaginatedCollection.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PaginatedCollection extends ResourceCollection
{
    protected string $resourceClass;

    public function __construct($resource, string $resourceClass)
    {
        parent::__construct($resource);
        $this->resourceClass = $resourceClass;
    }

    public function toArray(Request $request): array
    {
        return [
            'data' => $this->resourceClass::collection($this->collection),
            'pagination' => [
                'current_page' => $this->currentPage(),
                'per_page' => $this->perPage(),
                'total' => $this->total(),
                'total_pages' => $this->lastPage(),
                'has_more' => $this->hasMorePages(),
            ],
        ];
    }
}
```

### 3. Form Requests and Validation

```php
<?php
// app/Http/Requests/User/CreateUserRequest.php
namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'role' => ['sometimes', 'string', 'in:admin,user,guest'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }
}


// app/Http/Requests/User/UpdateUserRequest.php
namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin() || $this->user()->id === $this->route('user')->id;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'min:2', 'max:100'],
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users')->ignore($this->route('user')),
            ],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}


// app/Http/Requests/Organization/CreateOrganizationRequest.php
namespace App\Http\Requests\Organization;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'slug' => [
                'required',
                'string',
                'min:2',
                'max:100',
                'regex:/^[a-z0-9-]+$/',
                'unique:organizations,slug',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex' => 'Slug must contain only lowercase letters, numbers, and hyphens.',
            'slug.unique' => 'This slug is already taken.',
        ];
    }
}


// app/Http/Requests/Project/CreateProjectRequest.php
namespace App\Http\Requests\Project;

use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        $organization = $this->route('organization');
        return $this->user()->belongsToOrganization($organization);
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:1',
                'max:255',
                Rule::unique('projects')
                    ->where('organization_id', $this->route('organization')->id),
            ],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['sometimes', Rule::enum(ProjectStatus::class)],
        ];
    }
}
```

### 4. Controllers

```php
<?php
// app/Http/Controllers/Api/UserController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\PaginatedCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function index(Request $request): PaginatedCollection
    {
        $users = $this->userService->list(
            search: $request->input('search'),
            role: $request->input('role'),
            perPage: $request->input('per_page', 20)
        );

        return new PaginatedCollection($users, UserResource::class);
    }

    public function show(User $user): UserResource
    {
        return new UserResource(
            $user->load('organizations')
        );
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return (new UserResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $user = $this->userService->update($user, $request->validated());

        return new UserResource($user);
    }

    public function destroy(User $user): Response
    {
        $this->userService->delete($user);

        return response()->noContent();
    }

    public function me(Request $request): UserResource
    {
        return new UserResource(
            $request->user()->load('organizations')
        );
    }
}


// app/Http/Controllers/Api/AuthController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], Response::HTTP_CREATED);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            $request->input('email'),
            $request->input('password')
        );

        if (!$result) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ]);
    }

    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    public function refresh(Request $request): JsonResponse
    {
        $token = $this->authService->refreshToken($request->user());

        return response()->json([
            'token' => $token,
        ]);
    }
}


// app/Http/Controllers/Api/ProjectController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\CreateProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\PaginatedCollection;
use App\Http\Resources\ProjectResource;
use App\Models\Organization;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService
    ) {}

    public function index(Request $request, Organization $organization): PaginatedCollection
    {
        $projects = $this->projectService->listForOrganization(
            $organization,
            status: $request->input('status'),
            perPage: $request->input('per_page', 20)
        );

        return new PaginatedCollection($projects, ProjectResource::class);
    }

    public function store(CreateProjectRequest $request, Organization $organization): JsonResponse
    {
        $project = $this->projectService->create(
            $organization,
            $request->user(),
            $request->validated()
        );

        return (new ProjectResource($project))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Organization $organization, Project $project): ProjectResource
    {
        return new ProjectResource(
            $project->load(['organization', 'creator'])
        );
    }

    public function update(
        UpdateProjectRequest $request,
        Organization $organization,
        Project $project
    ): ProjectResource {
        $project = $this->projectService->update($project, $request->validated());

        return new ProjectResource($project);
    }

    public function destroy(Organization $organization, Project $project): Response
    {
        $this->projectService->delete($project);

        return response()->noContent();
    }
}
```

### 5. Service Layer

```php
<?php
// app/Services/UserService.php
namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function list(
        ?string $search = null,
        ?string $role = null,
        int $perPage = 20
    ): LengthAwarePaginator {
        return User::query()
            ->active()
            ->search($search)
            ->when($role, fn ($q) => $q->role($role))
            ->withCount('organizations')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function create(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'user',
        ]);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user->fresh();
    }

    public function delete(User $user): void
    {
        $user->delete(); // Soft delete
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}


// app/Services/AuthService.php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function register(array $data): array
    {
        $user = $this->userService->create($data);
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function login(string $email, string $password): ?array
    {
        $user = $this->userService->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }

        if (!$user->is_active) {
            return null;
        }

        // Revoke existing tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function refreshToken(User $user): string
    {
        $user->currentAccessToken()->delete();

        return $user->createToken('auth-token')->plainTextToken;
    }
}


// app/Services/ProjectService.php
namespace App\Services;

use App\Enums\ProjectStatus;
use App\Models\Organization;
use App\Models\Project;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProjectService
{
    public function listForOrganization(
        Organization $organization,
        ?string $status = null,
        int $perPage = 20
    ): LengthAwarePaginator {
        return Project::query()
            ->forOrganization($organization->id)
            ->when($status, fn ($q) => $q->where('status', $status))
            ->with(['creator'])
            ->withCount('tasks')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function create(
        Organization $organization,
        User $creator,
        array $data
    ): Project {
        return Project::create([
            'organization_id' => $organization->id,
            'created_by' => $creator->id,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? ProjectStatus::DRAFT,
        ]);
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);

        return $project->fresh();
    }

    public function delete(Project $project): void
    {
        $project->delete(); // Soft delete
    }
}
```

### 6. Middleware and Policies

```php
<?php
// app/Http/Middleware/EnsureOrganizationMember.php
namespace App\Http\Middleware;

use App\Models\Organization;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationMember
{
    public function handle(Request $request, Closure $next): Response
    {
        $organization = $request->route('organization');

        if (!$organization instanceof Organization) {
            abort(404, 'Organization not found');
        }

        if (!$request->user()->belongsToOrganization($organization)) {
            abort(403, 'You are not a member of this organization');
        }

        return $next($request);
    }
}


// app/Policies/ProjectPolicy.php
namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Project $project): bool
    {
        return $user->belongsToOrganization($project->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Project $project): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $project->created_by;
    }

    public function delete(User $user, Project $project): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $project->created_by;
    }
}
```

### 7. Testing Patterns

```php
<?php
// tests/Feature/UserTest.php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(5)->create();

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/users');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'role', 'created_at'],
                ],
                'pagination' => ['current_page', 'total', 'per_page'],
            ]);
    }

    public function test_non_admin_cannot_list_users(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/users');

        $response->assertForbidden();
    }

    public function test_user_can_get_own_profile(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/users/me');

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $user->id,
                    'email' => $user->email,
                ],
            ]);
    }

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/users', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $response->assertCreated()
            ->assertJson([
                'data' => [
                    'email' => 'new@example.com',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'new@example.com',
        ]);
    }

    public function test_cannot_create_user_with_duplicate_email(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $existing = User::factory()->create();

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/users', [
            'name' => 'New User',
            'email' => $existing->email,
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }
}


// tests/Feature/AuthTest.php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'user' => ['id', 'email', 'name'],
                'token',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
    }

    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'user' => ['id', 'email'],
                'token',
            ]);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertUnauthorized();
    }
}
```

## Use Cases

### Queue Jobs for Background Processing

```php
<?php
// app/Jobs/SendWelcomeEmail.php
namespace App\Jobs;

use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        public readonly User $user
    ) {}

    public function handle(): void
    {
        Mail::to($this->user->email)
            ->send(new WelcomeEmail($this->user));
    }

    public function failed(\Throwable $exception): void
    {
        // Log or notify about the failure
    }
}

// Usage
SendWelcomeEmail::dispatch($user);
```

### Event-Driven Architecture

```php
<?php
// app/Events/UserCreated.php
namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly User $user
    ) {}
}

// app/Listeners/SendWelcomeNotification.php
namespace App\Listeners;

use App\Events\UserCreated;
use App\Jobs\SendWelcomeEmail;

class SendWelcomeNotification
{
    public function handle(UserCreated $event): void
    {
        SendWelcomeEmail::dispatch($event->user);
    }
}

// app/Providers/EventServiceProvider.php
protected $listen = [
    UserCreated::class => [
        SendWelcomeNotification::class,
    ],
];
```

## Best Practices

### Do's

- Use UUID primary keys for public APIs
- Use Form Requests for validation
- Use API Resources for response formatting
- Use service classes for business logic
- Use policies for authorization
- Use eager loading to prevent N+1
- Use database transactions for writes
- Write feature and unit tests
- Use queues for heavy operations
- Use soft deletes for important data

### Don'ts

- Don't put business logic in controllers
- Don't use raw queries without bindings
- Don't ignore validation
- Don't skip authorization checks
- Don't expose internal IDs
- Don't use mutable defaults
- Don't ignore exceptions
- Don't skip testing
- Don't use sync for heavy tasks
- Don't forget rate limiting

## References

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)
- [Laravel API Tutorial](https://laravel.com/docs/eloquent-resources)
- [Laravel Testing](https://laravel.com/docs/testing)
- [Spatie Guidelines](https://spatie.be/guidelines/laravel-php)
