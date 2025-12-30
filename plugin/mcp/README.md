# MCP Server Integrations

OMGKIT supports Model Context Protocol (MCP) servers for enhanced capabilities.

## Supported Servers

| Server | Package | Purpose |
|--------|---------|---------|
| **Context7** | `@upstash/context7-mcp` | Up-to-date library documentation |
| **Sequential Thinking** | `@modelcontextprotocol/server-sequential-thinking` | Multi-step reasoning |
| **Memory** | `@modelcontextprotocol/server-memory` | Persistent knowledge graph |
| **Filesystem** | `@modelcontextprotocol/server-filesystem` | Secure file operations |

## Setup

### Option 1: Use provided config

Copy `.mcp.json` to your project root or Claude Code config directory.

### Option 2: Manual setup

Add to your Claude Code MCP configuration:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

## Command Enhancements

| Command | MCP Servers | Enhancement |
|---------|-------------|-------------|
| `/feature` | Context7, Sequential | Accurate docs, structured planning |
| `/fix` | Sequential, Memory | Step-by-step debugging |
| `/test` | Filesystem | File-based test generation |
| `/plan` | Sequential, Memory | Structured breakdown |
| `/research` | Context7 | Real-time documentation |

## Enabling/Disabling

In `.omgkit/config.yaml`:

```yaml
mcp:
  context7: true
  sequential: true
  memory: true
  filesystem: true
  playwright: false
```
