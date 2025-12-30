---
name: Developing MCP Servers
description: Creates Model Context Protocol servers with tools, resources, and prompts for AI assistant integration. Use when extending Claude with custom capabilities, building AI tool integrations, or exposing APIs to AI assistants.
category: tools
triggers:
  - mcp server
  - model context protocol
  - claude tools
  - ai tools
  - mcp development
  - fastmcp
  - tool creation
---

# Developing MCP Servers

## Quick Start

```python
from fastmcp import FastMCP

mcp = FastMCP("my-service")

@mcp.tool()
def get_weather(city: str) -> str:
    """Get current weather for a city.

    Args:
        city: Name of the city to get weather for
    """
    return f"Weather in {city}: 72F, Sunny"

@mcp.resource("config://settings")
def get_settings() -> str:
    """Expose application settings as a resource."""
    return json.dumps({"theme": "dark", "language": "en"})

@mcp.prompt()
def analyze_code(code: str, language: str = "python") -> str:
    """Generate a prompt for code analysis."""
    return f"Analyze this {language} code:\n```{language}\n{code}\n```"

if __name__ == "__main__":
    mcp.run()
```

## Features

| Feature | Description | Guide |
|---------|-------------|-------|
| Tool Definition | Create callable tools with typed parameters | Use @mcp.tool() decorator with docstrings |
| Resource Exposure | Expose data resources for AI to read | Use @mcp.resource() with URI patterns |
| Prompt Templates | Define reusable prompt templates | Use @mcp.prompt() for consistent prompts |
| Dynamic Resources | Create parameterized resource URIs | Use URI templates like "user://{id}/profile" |
| Progress Reporting | Report progress for long operations | Use ctx.report_progress() in async tools |
| Streaming Results | Stream results for large outputs | Use AsyncGenerator return type |
| Lifecycle Hooks | Manage server startup and shutdown | Use lifespan context manager |
| Middleware | Add logging, rate limiting, auth | Implement middleware functions |
| Error Handling | Return structured error responses | Use try/except with error codes |
| Testing | Test tools and resources in isolation | Use MCPTestClient for unit tests |

## Common Patterns

### TypeScript MCP Server

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "my-server", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "search",
    description: "Search the database",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  }],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name === "search") {
    const results = await searchDatabase(args.query);
    return { content: [{ type: "text", text: JSON.stringify(results) }] };
  }
  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Database Integration Server

```python
from fastmcp import FastMCP
import asyncpg

mcp = FastMCP("database-server")
pool: asyncpg.Pool = None

@mcp.tool()
async def query(sql: str, params: list = None) -> dict:
    """Execute read-only SQL query."""
    if not sql.strip().upper().startswith("SELECT"):
        raise ValueError("Only SELECT queries allowed")

    async with pool.acquire() as conn:
        rows = await conn.fetch(sql, *(params or []))
        return {
            "columns": list(rows[0].keys()) if rows else [],
            "rows": [dict(row) for row in rows],
            "count": len(rows),
        }

@mcp.resource("schema://tables")
async def list_tables() -> str:
    """List all database tables."""
    async with pool.acquire() as conn:
        tables = await conn.fetch(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        )
        return json.dumps([t["table_name"] for t in tables])
```

### Secure File System Server

```python
from pathlib import Path

mcp = FastMCP("filesystem-server")
WORKSPACE = Path(os.getenv("WORKSPACE", ".")).resolve()

def validate_path(path: str) -> Path:
    """Ensure path is within workspace."""
    full_path = (WORKSPACE / path).resolve()
    if not str(full_path).startswith(str(WORKSPACE)):
        raise ValueError("Path outside workspace")
    return full_path

@mcp.tool()
def read_file(path: str) -> str:
    """Read file contents safely."""
    file_path = validate_path(path)
    return file_path.read_text()

@mcp.tool()
def list_directory(path: str = ".") -> list[dict]:
    """List directory contents."""
    dir_path = validate_path(path)
    return [{"name": f.name, "type": "dir" if f.is_dir() else "file"} for f in dir_path.iterdir()]
```

### Testing MCP Servers

```python
import pytest
from fastmcp.testing import MCPTestClient

@pytest.fixture
def client():
    return MCPTestClient(mcp)

class TestMCPServer:
    async def test_tool_execution(self, client):
        result = await client.call_tool("get_weather", {"city": "Seattle"})
        assert result.success
        assert "Seattle" in result.content

    async def test_resource_access(self, client):
        result = await client.read_resource("config://settings")
        assert result.success
        data = json.loads(result.content)
        assert "theme" in data
```

## Best Practices

| Do | Avoid |
|----|-------|
| Document tools thoroughly with clear docstrings | Vague or missing tool descriptions |
| Validate all inputs with type hints | Trusting user input without validation |
| Return structured error responses | Exposing internal error details |
| Use async for I/O-bound operations | Blocking the event loop with sync I/O |
| Implement pagination for large results | Returning unbounded data sets |
| Add rate limiting for resource-intensive tools | Allowing unlimited API calls |
| Test tools with MCPTestClient | Skipping unit tests for tools |
| Follow MCP specification strictly | Deviating from protocol standards |
| Sanitize paths and SQL queries | Allowing path traversal or SQL injection |
| Log tool calls for debugging | Missing audit trail for operations |

## Related Skills

- **python** - Primary language for FastMCP
- **typescript** - MCP SDK for TypeScript
- **api-architecture** - API design patterns

## References

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [FastMCP Documentation](https://github.com/jlowin/fastmcp)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude MCP Guide](https://docs.anthropic.com/en/docs/build-with-claude/mcp)
