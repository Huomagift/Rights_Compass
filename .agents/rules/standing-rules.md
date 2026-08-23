---
trigger: always_on
---

## Standing rules — apply to every task in this project

1. Never place service-role keys, AI provider keys, or WhatsApp/Meta credentials
   inside the Expo app bundle. Client code only ever gets EXPO_PUBLIC_SUPABASE_URL
   and EXPO_PUBLIC_SUPABASE_ANON_KEY. All other secrets live server-side only
   (Supabase Edge Functions / secrets).

2. Do not modify existing visual design, layout, or component structure unless
   a task explicitly requires a new screen. Wire existing screens to real data —
   don't redesign them.

3. Never generate, paraphrase, or invent legal/constitutional text or citations.
   Only import from files I explicitly provide.

4. Correctness/security-critical values (quiz correct answers, access control,
   deletion scope, RLS policies) must be enforced server-side / at the database
   level, never trusted from client logic alone.

5. After each task, summarize exactly what changed (files touched, migrations
   added, new env vars required) before moving to unrelated work.

6. If a task depends on data or credentials not yet provided, stop and say
   what's missing rather than stubbing it with fake-looking data.