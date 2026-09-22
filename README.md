# Copilot SDK Workflow Examples

Runnable TypeScript examples for learning the GitHub Copilot SDK and designing
an issue-to-code-to-CI automation workflow.

This repository intentionally separates:

- deterministic application logic,
- Copilot sessions,
- personal skills discovered from `~/.copilot/skills`,
- custom agents,
- experimental Agent Factories,
- structured JSON handoffs between fresh sessions.

## Requirements

- Node.js 22.12 or newer
- An authenticated GitHub Copilot environment
- GitHub CLI authenticated with `gh auth login`
- A repository selected as the current working directory for GitHub examples

## Install

```bash
npm install
npm run check
```

## Examples

### 1. Inspect available models

```bash
npm run example:models
```

Lists the models available to the authenticated account, including policy and
billing metadata when supplied by the runtime.

### 2. Discover personal and project skills

```bash
npm run example:skills
```

Skills under `~/.copilot/skills` should appear with the source
`personal-copilot`.

### 3. Invoke a discovered skill

```bash
npm run example:invoke-skill -- \
  "Use the dynatrace-query skill to explain its available workflow"
```

The script prints the skills actually invoked during the session. Tool
permissions require an interactive approval.

### 4. Triage `copilot_ready` GitHub issues

Run this command from a GitHub repository containing labeled issues:

```bash
npm run example:triage
```

Application code retrieves issues with `gh`. A low-cost model ranks normalized
issue data and returns a validated `issue-triage.v1` object.

Model availability is account-specific. To request a particular model, first
inspect `example:models`, then set it explicitly; unavailable models safely fall
back to `auto`:

```bash
COPILOT_TRIAGE_MODEL=<model-id> npm run example:triage
```

### 5. Define and select a custom agent

```bash
npm run example:agent -- "Explain the architecture of this repository"
```

### 6. Register and invoke an experimental Agent Factory

```bash
npm run example:factory -- \
  "Add a health endpoint and include unit-test acceptance criteria"
```

The factory source is isolated at
`examples/agent-factory/remediation-factory.extension.mjs` so ordinary SDK
examples do not auto-discover it. Copy it to a test project's
`.github/extensions/remediation-factory/extension.mjs`, then point the launcher
at that project:

```bash
COPILOT_FACTORY_PROJECT=/absolute/path/to/test-project \
  npm run example:factory -- "Add a health endpoint"
```

The factory runs independent implementation and testing analyses, then
synthesizes them.

Standalone extension launching is runtime-host dependent and experimental. The
launcher supplies the installed SDK extension directory, but a runtime without
an extension launch provider will reject this example. This is local extension
wiring, not an MCP server configuration.

Agent Factories are experimental and require a compatible Copilot runtime.

## Compatibility note

The repository pins the current stable npm SDK version. On the machine used to
build this repository, model discovery worked, while config discovery reached a
newer bundled runtime that required an extension launch provider the stable SDK
did not register. If `example:skills` reports that error on another machine,
check the SDK/runtime versions there before changing your skill layout; it does
not mean `~/.copilot/skills` is invalid.

### 7. Pass structured output into a fresh session

```bash
npm run example:handoff
```

This demonstration creates one session that returns `CodeChangeResult`, closes
that session, and passes only the validated object into a fresh validation
session.

## Architecture notes

- [Issue-to-Code-to-CI architecture](docs/architecture.md)
- [Security and trust boundaries](docs/security.md)

## Roadmap

- GitHub App webhook receiver
- Durable workflow state and idempotent issue claiming
- Per-issue Git worktrees
- Coding Agent Factory
- Jenkins trigger adapter
- Non-LLM Jenkins polling worker
- Serenity result parser
- Three-attempt remediation loop
- Optional Vite + React operations dashboard
