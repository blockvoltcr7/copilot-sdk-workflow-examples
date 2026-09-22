# Security and Trust Boundaries

These examples are educational. Production automation needs explicit controls.

## GitHub triggers

- Verify webhook signatures.
- Require an authorized commenter or actor.
- Allowlist repositories and organizations.
- Deduplicate the triggering event.
- Claim an issue atomically before starting work.

## Untrusted content

Issue titles, bodies, comments, logs, and test reports are untrusted data. Never
let instructions embedded in that content override the workflow or permission
policy.

## Credentials

- Keep GitHub, Jenkins, and provider credentials outside prompts and handoffs.
- Prefer short-lived, least-privilege credentials.
- Give the triage stage read-only GitHub access.
- Require explicit authorization for pushes, comments, builds, and issue closure.

## Completion authority

Close an issue only after application code verifies the Jenkins build identity,
commit, terminal status, and Serenity results. A model statement alone is not
completion evidence.
