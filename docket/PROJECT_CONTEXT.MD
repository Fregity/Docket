# DueBird / Docket Project Context

## Purpose

DueBird is a student assignment and deadline management application at [myduebird.com](https://myduebird.com). It is the owner's primary computer-science and entrepreneurship project. The goal is to develop a genuinely useful product with real active users, not simply accumulate signups.

Repository: `Fregity/Docket`  
Application directory: `docket/`

## Current-repository verification

This document was created on 2026-11-11 in a workspace where the repository contents were not present: no `docket/` directory, source files, package manifest, database migrations, configuration files, or Git metadata were available to inspect. Git was also unavailable in the environment.

As a result, the actual framework versions, directory structure, database schema, and important implementation files are **unknown in this checkout**. Do not guess or treat this document as a substitute for inspection. When the repository is available, update this section from the actual codebase - especially the application manifest/package lockfile, `docket/` structure, Supabase migrations and policies, authentication setup, service-worker/PWA assets, and deployment configuration.

## Technology and hosting

- A Next.js application is intended to live inside `docket/`.
- Supabase provides authentication and the database.
- Authentication includes Google OAuth.
- Vercel hosts the site and deploys automatically from Git commits.
- Namecheap manages the domain.

Verify all versions, providers, configuration, and integration details against the repository and live configuration before changing them.

## Product and growth context

- The application has historically had about 14 users.
- Awareness and retention are the main challenges.
- One friend stopped using the app because he forgot it existed.
- Settings later gained an Add to Home Screen option.
- Improving retention matters more than merely increasing registrations.
- The product should become something students naturally return to.

Prioritize changes that improve usability, retention, reliability, or sustainable growth. The owner has roughly 5-8 hours per week for development outside school, so favor practical, incremental work. Explain what a change accomplishes and why it matters; do not rewrite large files without a compelling reason.

## Analytics

Existing analytics historically included visitor IDs, session IDs, user IDs, event names, and JSON properties. Events include landing-page views, signups, class creation and joining, assignment creation and completion, and dashboard returns.

Historically, the analytics table did not include `created_at`, which prevents reliable cohort-retention analysis. The existing "returning visitors" metric has historically counted multiple events, not necessarily visits on separate days.

Potential improvements, to validate against the current schema and data:

- Add timestamped events going forward.
- Measure honest D1, D7, and D30 retention.
- Define meaningful activity.
- Instrument dashboard-installation prompts.
- Measure actual recurring usage better.

Never assign fabricated timestamps to historical events or present misleading historical retention figures.

## PWA and notifications

The app is known to have a manifest and an Add to Home Screen feature. Push notifications may improve retention: Web Push can work on Android and on supported iOS Home Screen web apps.

A complete notification implementation requires:

- A service worker.
- Push API subscriptions.
- VAPID keys stored only server-side.
- Secure subscription storage.
- Explicit permission and opt-in.
- A reliable scheduled sender.
- Timezone-aware due-date handling.
- Unsubscribe and preference controls.
- Duplicate-send prevention.

Never send notifications without explicit user opt-in. Before choosing an approach, inspect the current service worker, deployment configuration, and Vercel Cron configuration.

## Security and privacy history

Previous work reportedly included:

- RLS enabled on public tables.
- Analytics insertion policies.
- Admin analytics via `SECURITY DEFINER` functions and an admin-email allowlist.
- A server-only Supabase admin client.
- Account deletion.
- Creator foreign keys that do not block account deletion.
- Safe authentication redirects.
- Terms and Privacy pages.
- A signup notice with a minimum age of 13.

These are historical notes only. Verify the current implementation, policies, migrations, and environment boundaries before changing anything.

## Dates and timezones

A prior issue displayed assignments as due today when they were actually due tomorrow because UTC and local time were mixed. A prior fix reportedly introduced:

- `docket/lib/dates.ts`
- Local-date extraction and date-only arithmetic
- `dateForDisplay` using noon UTC
- `todayISO` based on the local date
- `docket/components/DashboardAssignments.tsx`, which waits for the browser timezone before grouping assignments

Verify the current implementation before modifying date logic. Do not reintroduce UTC/local date bugs; use deliberate date-only and timezone-aware handling.

## Development preferences

- Prefer practical, incremental development.
- Batch related schema work; avoid excessive one-off SQL investigations.
- Automatic Vercel deployments generally mean a local production build is not required, though relevant checks should still run when possible.
- Favor material product improvements over cosmetic changes that do not improve usability, retention, reliability, or growth.
- Keep architectural documentation current after meaningful decisions.
