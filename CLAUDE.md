# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Everything Claude Code (ECC)** - a Claude Code plugin providing production-ready agents, skills, hooks, commands, rules, and MCP configurations for software development. Requires Node.js >=18.

## Commands

```bash
# Run all tests (978 tests across lib, hooks, integration, CI, scripts)
node tests/run-all.js
# or
npm test  # also runs CI validators first

# Run individual test files
node tests/lib/utils.test.js
node tests/lib/package-manager.test.js
node tests/hooks/hooks.test.js

# Lint (eslint + markdownlint)
npm run lint

# Run CI validators only
node scripts/ci/validate-agents.js
node scripts/ci/validate-commands.js
node scripts/ci/validate-skills.js
node scripts/ci/validate-hooks.js
node scripts/ci/validate-rules.js

# CLAW workflow manager
npm run claw
# or
node scripts/claw.js
```

## Architecture

### Core Component Directories

- **agents/** - 13 specialized subagents (planner, code-reviewer, tdd-guide, architect, security-reviewer, etc.)
- **skills/** - 64 skill files, each as a **directory** containing a `SKILL.md` file (not standalone `.md` files)
- **commands/** - 33 slash commands invoked by users as `/command-name`
- **hooks/hooks.json** - PreToolUse/PostToolUse/SessionStart/PreCompact automations
- **rules/** - `common/` (9 language-agnostic rules) + language subdirs (`typescript/`, `python/`, `golang/`, `swift/`) that extend common
- **mcp-configs/mcp-servers.json** - 14+ MCP server configurations (GitHub, Supabase, Firecrawl, Cloudflare, etc.)
- **scripts/lib/** - Shared Node.js utilities (package-manager, session-manager, session-aliases, utils)
- **scripts/hooks/** - Hook scripts (session-start, session-end, pre-compact, post-edit-format, etc.)
- **scripts/ci/** - CI validators for agents, commands, skills, hooks, and rules

### Supporting Directories

- **contexts/** - Context templates for dev, review, and research sessions
- **examples/** - Example `CLAUDE.md` files for various tech stacks
- **.claude-plugin/** - Plugin manifest (`plugin.json`) for Claude Code marketplace
- **.opencode/** - OpenCode/Claw integration (TypeScript, with custom tools)
- **.cursor/rules/** - Mirrors `rules/` structure for Cursor IDE

### Key Architectural Relationships

The **rules/** hierarchy is intentional: `common/` rules are always applied; language-specific rules (`typescript/`, `python/`, etc.) override common rules where they conflict. The `.cursor/rules/` directory mirrors this same structure.

**Skills** are directories (not flat files) - each skill has `skills/<skill-name>/SKILL.md`. The CI validator (`validate-skills.js`) enforces this structure and YAML frontmatter (`name`, `description`, `origin`).

**Agents** delegate specialized tasks; `planner.md` uses `opus` model while most others use `sonnet` or `haiku`. Agent YAML frontmatter requires `name`, `description`, `tools[]`, and `model`.

## File Formats

### Agent (`agents/*.md`)
```markdown
---
name: agent-name
description: When to invoke this agent (detailed)
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: sonnet
---
```

### Skill (`skills/<name>/SKILL.md`)
```markdown
---
name: skill-name
description: Brief description
origin: ECC
---
```

### Command (`commands/*.md`)
```markdown
---
description: Shown in /help output
---
```

### Hook (`hooks/hooks.json`)
```json
{
  "hooks": {
    "PreToolUse": [{ "matcher": "...", "hooks": [{"type": "command", "command": "..."}], "description": "..." }]
  }
}
```

File naming: lowercase with hyphens (e.g., `python-reviewer.md`, `tdd-workflow.md`).

## Key Slash Commands

- `/tdd` - Test-driven development workflow
- `/plan` - Implementation planning (delegates to planner agent)
- `/e2e` - Generate and run E2E tests
- `/code-review` - Quality review
- `/build-fix` - Fix build errors
- `/learn` - Extract patterns from sessions
- `/skill-create` - Generate skills from git history
- `/orchestrate` - Multi-agent orchestration
- `/multi-plan`, `/multi-execute`, `/multi-backend`, `/multi-frontend` - Parallel multi-agent workflows
- `/checkpoint` - Verification checkpoints
- `/sessions` - Session history management
