# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Standing Project Rules (Follow in Every Task & Session)

1. **Security & Credentials**: Never place service-role keys, AI provider keys, or WhatsApp/Meta credentials inside the React Native/Expo app. These belong only in server-side environments (Supabase Edge Functions, secrets manager). Client code only ever gets the Supabase URL + anon/public key.
2. **UI & Design Integrity**: Do not modify existing visual design, layout, colors, or component structure unless the task explicitly requires a new screen. Wire existing UI to real data — don't redesign it.
3. **Legal Content Accuracy**: Never generate, paraphrase, or invent legal/constitutional text, citations, or legal claims. If required content (Constitution text, guide content) isn't supplied yet, build the schema/import tooling and leave content empty or clearly marked "pending content" — do not fill gaps with fabricated text.
4. **Server-Side Enforcement**: Any value that determines correctness, entitlement, or security (quiz correct answers, subscription/access status, deletion scope, RLS policies) must be enforced server-side / at the database level, never trusted from client-side logic alone.
5. **Task Completion Summary**: After completing a task, summarize exactly what was changed (files touched, migrations added, new env vars required) so the user can review before moving to the next task. Do not proceed to unrelated work without confirmation.
6. **Missing Info / Credentials**: If something in a task depends on information or credentials that haven't been provided yet, stop and explicitly state what's missing rather than guessing or stubbing it with fake data that looks real.

