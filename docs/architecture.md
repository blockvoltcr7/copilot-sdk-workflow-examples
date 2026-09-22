# Issue-to-Code-to-CI Architecture

The target system is a durable controller around short-lived Copilot sessions.
Copilot sessions reason and use skills; application code owns identity, state,
polling, retries, and irreversible side effects.

## Runtime flow

1. Receive or scan for an authorized `copilot_ready` issue.
2. Fetch eligible issues through deterministic GitHub API or `gh` calls.
3. Use a low-cost model to return a typed `IssueTriageResult`.
4. Claim the selected issue with an idempotent workflow record.
5. Create a fresh coding session and return `CodeChangeResult`.
6. Create a fresh validation session and start Jenkins through a discovered skill.
7. Poll Jenkins outside the language-model session.
8. Analyze the completed Serenity report in a fresh session.
9. Close the issue on verified success or retry with the failure handoff.
10. Stop after three failed attempts and request human review.

## Boundaries

- `~/.copilot/skills` provides personal skills when configuration discovery and
  skills are enabled.
- `examples/agent-factory` stores the experimental Agent Factory as a template
  so it does not affect the other configuration-discovery examples.
- Structured JSON contracts cross session boundaries; transcripts do not.
- The durable controller must revalidate repository, issue, revision, and CI
  state before every side effect.

## Why polling stays outside Copilot

Waiting for Jenkins is deterministic and can take minutes. A worker or scheduled
job should poll the CI API and persist status without holding a model turn open.
Only the completed evidence needs model interpretation.
