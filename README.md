# Blackout Network

A social network starter for preppers, survivalists, homesteaders, and self-reliance communities.

## Stack

- Next.js App Router
- Tailwind CSS
- Supabase Auth + Database + Storage
- AdSense-ready layout placeholders

## Features included

- Facebook-style home feed layout
- Left and right sidebars for categories, groups, and trends
- Login + signup pages
- New post form
- Profile page route
- Groups page
- Ad block placeholder component for future AdSense placement
- Supabase client helpers
- SQL schema starter
- Seed content

## AdSense setup

This starter keeps monetization out of the UI copy. The ad placeholder components are there so you can swap in your Google AdSense code later in the layout, feed, or sidebar.

Suggested placement areas:
- right sidebar blocks
- between feed posts
- mobile in-content block after the first or second post

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env.local
```

3. Add your Supabase URL and anon key.

4. Run dev server:

```bash
npm run dev
```

5. In Supabase SQL editor, run `supabase/schema.sql` and then `supabase/seed.sql`.

## Notes

This is a starter scaffold, not a finished production app. Authentication UI is present, but you still need to connect the auth actions to your Supabase project and add route protection as you build.
"# Blackout" 
"# Blackout" 
