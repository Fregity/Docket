# Docket

Stop asking the group chat what the homework was.

A mobile-first web app where students create classes, share an invite link
with classmates, and keep a shared list of what's due — so nobody has to
scroll through a group chat looking for the homework.

---

## 1. What's built

- **Landing page** — hero, "Get started" / "Join a class"
- **Auth** — Google sign-in and email/password, via Supabase Auth
- **Onboarding** — create or join a class right after signup (skippable)
- **Dashboard** — everything due, grouped into Overdue / Today / Tomorrow /
  This week / Later, plus a "My classes" list and a floating "+ Add homework"
- **Classes** — create a class (with a curated accent color), class detail
  page (due list, completed section, members), a classes index page
- **Invite links** — `/join/<CODE>` works for signed-out visitors too: it
  previews the class name and member count, prompts sign-in, then joins
  automatically
- **Homework** — add / edit / mark complete / delete, with quick due-date
  buttons (Today / Tomorrow / Friday / Custom)
- **History** — a chronological list of past assignments across all classes
- **Settings** — display name, sign out
- **Admin** — an internal `/admin` page showing total users / classes /
  assignments (gated by an email allowlist — see env vars below)
- **Design** — white background, Geist Sans body, Fraunces serif for
  headers and due-dates, a curated flat/muted accent-color palette
  (olive, terracotta, clay, dusty blue, etc.) set per-class by its creator,
  soft rounded cards, restrained motion
- **PWA-installable** — has a manifest so it can be added to a phone's home
  screen and open full-screen

Not built (intentionally, per the MVP scope): AI, chat/DMs, teacher
accounts, push/email notifications, photo attachments, assignment
confirmation counts. The database and code are structured so these can be
added later without a rewrite.

---

## 2. Set up Supabase (one-time, ~5 minutes)

You mentioned you don't have a Supabase project yet — here's the exact path:

1. Go to **supabase.com** → sign in → **New Project**.
   - Pick any name/region, set a database password, and save it somewhere
     safe (you won't need it for the app itself, but you'll want it if you
     ever need to connect a Postgres client directly).
2. Once it finishes provisioning, open **Project Settings → API** and copy:
   - **Project URL** (looks like `https://xxxxxxxx.supabase.co`)
   - **anon public** key
3. Open the **SQL Editor** (left sidebar) → **New query** → paste in the
   entire contents of `supabase/schema.sql` from this project → **Run**.
   This creates all four tables, row-level security policies, and the
   helper functions the app calls.
4. **Enable Google sign-in (optional but recommended):**
   - **Authentication → Providers → Google** → toggle on.
   - Supabase shows you a **Callback URL** — you'll need a Google Cloud
     OAuth client (console.cloud.google.com → APIs & Services →
     Credentials → Create OAuth client ID → Web application) and paste
     that callback URL into its "Authorized redirect URIs."
   - Paste the resulting Client ID / Secret back into Supabase's Google
     provider settings.
   - If you'd rather skip this for now, email/password works immediately
     with zero extra setup — Google can be added later without any app
     code changes.
5. **Turn off "Confirm email" for faster testing (optional):**
   **Authentication → Providers → Email → uncheck "Confirm email."**
   With it on, new users have to click a confirmation link before their
   first sign-in; for a fast student-facing MVP you may want it off, or on
   — your call.

---

## 3. Run it locally

Requires Node.js 18.18+ installed.

```bash
cd docket
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=you@example.com
```

Then:

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## 4. Deploy to Vercel

Since you already have Vercel set up, this is the fast path:

1. Push this project to a GitHub repo.
2. In Vercel: **Add New → Project** → import that repo.
3. Under **Environment Variables**, add the same four variables from
   `.env.local` above — but set `NEXT_PUBLIC_SITE_URL` to your actual
   Vercel URL (e.g. `https://docket-yourname.vercel.app`). This is what
   invite links get built from, so it has to match the real deployed URL.
4. Deploy.
5. If you enabled Google sign-in, go back to your Google Cloud OAuth
   client and add `https://docket-yourname.vercel.app` (and the Supabase
   callback URL) to the authorized origins/redirects if you haven't
   already.
6. Once you're ready for a custom domain, add it in Vercel's **Domains**
   tab and update `NEXT_PUBLIC_SITE_URL` to match.

---

## 5. Known limitations / things to double check

- **PWA icons are placeholders.** `public/manifest.json` points at
  `/icons/icon-192.png` and `/icons/icon-512.png`, which don't exist yet —
  add real PNGs at those paths (or point the manifest elsewhere) before
  relying on "Add to Home Screen" looking polished. The browser-tab
  favicon (`app/icon.svg`) is a simple placeholder mark too.
- **Nav bar is simplified.** The spec described Home / Classes / + /
  History / Settings; I built Home / Classes / History / Settings, since
  "+" already exists as the floating "Add homework" button on the
  Dashboard and Class pages — having both felt redundant. Easy to add a
  center "+" tab later if you want it front-and-center in the nav itself.
- **No automated tests.** Given the "usable by tomorrow" priority, I
  focused entirely on the working path, not test coverage.
- **I couldn't run or test this build myself** — no network access in my
  environment, so `npm install` and a live Supabase connection have to
  happen on your end. I've been careful with the Supabase/Next.js
  patterns, but budget time for working through anything that comes up
  on first run.
- **Conflicting/duplicate assignments** aren't flagged (per spec — this
  was explicitly out of scope for MVP).
- **Anyone in a class can edit/delete any assignment** in that class (per
  spec's MVP permission rule) — the code is structured so tightening this
  to "only the creator can delete" later is a small change (one RLS
  policy + one UI check), not a rewrite.

---

## 6. Next 5 features I'd recommend, in order

1. **"What's due tomorrow?"** — a single dedicated view/filter across all
   classes. Cheap to build, directly reinforces the core "answer in 3
   seconds" promise.
2. **Assignment confirmation** ("✓ Confirmed by 3 classmates") — solves the
   single-biggest trust problem (one person entering the wrong homework)
   with very little UI.
3. **Push or email reminder for tomorrow's homework** — the one
   notification that's actually worth the complexity, since it's the
   moment the app earns daily habitual use.
4. **Photo of the board** attached to an assignment — huge trust/speed
   win for the person adding homework (photograph beats typing) and costs
   just one Supabase Storage bucket.
5. **"What did I miss?"** for absent students — a natural next layer once
   history/assignments are already reliably populated, and it's the
   single clearest "why would I tell a friend to get this app" moment
   beyond the initial invite.
