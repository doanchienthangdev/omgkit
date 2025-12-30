---
name: laravel
description: Laravel PHP development. Use for Laravel projects, Eloquent, Blade.
---

# Laravel Skill

## Patterns

### Model
```php
class User extends Model
{
    protected $fillable = ['email', 'password'];
    protected $hidden = ['password'];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
```

### Controller
```php
class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        $user = User::create($validated);
        return response()->json($user, 201);
    }
}
```

### Routes
```php
Route::apiResource('users', UserController::class);
```

### Migration
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('email')->unique();
    $table->string('password');
    $table->timestamps();
});
```

## Best Practices
- Use Eloquent relationships
- Use Form Requests
- Use Resources for API responses
- Use Jobs for async
