# DueBird / Docket - Instructions for Codex

## Start with the current code

Before making any substantial change, read [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md). Then inspect the relevant current implementation, configuration, and database artifacts before proposing or changing anything. The repository is the source of truth whenever project notes are stale, incomplete, or conflict with the code.

Preserve established architecture, patterns, naming, and conventions unless there is a concrete reason to change them. Prefer small, focused changes over unnecessary rewrites, and do not overwrite or discard unrelated user changes. Work on a separate branch and use pull requests when appropriate.

## Engineering expectations

- Explain the reasoning behind architectural and security decisions.
- Avoid unnecessary dependencies.
- Consider mobile usability, accessibility, performance, and security in every user-facing change.
- Run relevant tests, linting, type checks, and other checks when possible. State honestly when something was not run or could not be tested.
- Do not claim a change is deployed unless deployment has been verified.
- Keep documentation current when an important architectural decision changes.

## Supabase, data, and security

- Never expose Supabase service-role credentials or any other secret to client-side code.
- Respect existing Supabase RLS policies and authentication boundaries; inspect them before making security-sensitive changes.
- Include appropriate, reviewable database migrations for every schema change.
- Treat historical product and security notes as context, not proof that the current implementation is identical.

## Product principles

DueBird should earn repeat use from students through real utility, reliability, and respectful retention features - not cosmetic work or signup counts alone. For work involving dates, timezones, PWA behavior, notifications, analytics, or retention, first inspect the existing implementation and its deployment configuration. Do not fabricate historical analytics timestamps or implement notifications without explicit user opt-in.
