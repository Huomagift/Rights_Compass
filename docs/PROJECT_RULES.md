# Rights Compass: Project Rules

These rules apply to every task. The feature checklist lives in `docs/FRONTEND_SPEC.md`.

## Product context

- Stack: React Native + Supabase (confirm from the code and report any difference).
- Frontend-first: every screen works on typed mock data now. Backend and AI come later. Do not start either.
- Preserve existing good work. Never rebuild a working screen without saying why first.
- Do not create unnecessary routes or duplicate screens.

## Locked decisions

- Fixed 4-tab nav: Home, Library, Marketplace, Profile.
- Warm Earth visual palette (use as the Material 3 seed).
- Owl mascot appears only in the Tutor chat.
- AI, voice, and lawyer features are reached contextually, not as extra tabs.
- Marketplace, lawyer onboarding, payments and escrow are built fully but stay behind the existing waitlist/feature flag. Removing that one flag must be what reveals them.
- Admin dashboard is a separate web app, built last.

## Decisions

1. **OTP in onboarding (Phase 2)**: Required now, not optional. Build it as a real gate in the flow — onboarding cannot complete without passing it — but it runs entirely on mock state. Use a fixed mock code (e.g. 123456) that always succeeds, and still implement the full set of failure states (wrong code, expired, too many attempts) so they exist before backend arrives.
2. **Escrow state machine order (Phase 8)**: Use this sequence —
   `REQUESTED` → `LAWYER_ACCEPTED` → `PAYMENT_PENDING` → `PAYMENT_SECURED` → `SERVICE_IN_PROGRESS` → `COMPLETION_REQUESTED` → `CLIENT_CONFIRMED` → `LAWYER_CONFIRMED` → `COMPLETED`
   with `DISPUTED`, `REFUND_PENDING`, `REFUNDED`, `CANCELLED` and `FAILED` reachable from the relevant points along that path (not fixed positions in the main sequence).
   Payment happens AFTER the lawyer accepts, not before — a client should never pay before a lawyer has agreed to take the case.
   Implement this as an editable config array/table that the transition engine reads, not hardcoded if/else logic, so the order can be changed later without a rewrite.
3. **Voice UI scope (Phase 5)**: Build full layout and states for voice landing, permission, connecting, active call, call ended, and failure — all of them, on mock data. But keep the active-call visual simple: a pulsing avatar and a running call timer is enough. Skip animated waveform rendering and any other high-fidelity audio visualization — this UI gets replaced once real telephony/WhatsApp calling is integrated, so don't over-invest polish here. Spend that time budget on screens that will survive backend integration unchanged (escrow, learning, library).
4. **Admin dashboard location (Phase 11)**: Build it as a separate app inside this same repo, at `/admin`, not a separate git repo. It should share the existing typed models (`Transaction`, `Dispute`, `Lawyer`, `LawyerApplication`, etc.) from the main app rather than duplicating them, since there's no backend yet to justify splitting repos. We can split it into its own repo later if deployment needs require it.
5. **Client-trusted verification badges (Tracking only)**: Risk #4 from audit (verification badges stored in `AsyncStorage`) is explicitly tracked as "do not treat as solved" in frontend work. It is a backend/RLS concern, not something to fix in the frontend, but must be tracked so it is not forgotten when connecting backend.


## Material 3 and responsiveness

- Use M3 color roles from ONE central token file. No hardcoded colors, sizes or spacing in components.
- Use M3 window size classes: compact < 600, medium 600 to 839, expanded >= 840.
- Type scale differs per class. Compact: display <= 36, headline 24 to 28, title 18 to 20, body 14 to 16, label 12 to 14. Expanded: full M3 scale. Implement as a responsive typography hook/tokens, never per-screen font sizes.
- Layout: compact = single column + bottom nav. Medium/expanded = navigation rail, max content width, list-detail panes where useful. If this conflicts with the existing design, flag it instead of silently changing it.
- 48dp minimum touch targets, safe areas, keyboard-aware forms, no horizontal scroll, no text overflow at large font scale.
- Light, dark and system themes.
- No generic AI-looking UI (random gradients, heavy glassmorphism, oversized rounded cards, decorative floating elements).

## Architecture

- Typed models for User, Lesson, Question, ConstitutionSection, Lawyer, LawyerApplication, LegalRequest, Transaction, Dispute, Notification, SupportTicket, ChatConversation, etc.
- Repository interfaces plus a separate mock implementation (`src/mocks`). One switch swaps mock for real later. UI never imports mock data directly.
- Model states as typed discriminated unions or state machines: transaction (REQUESTED through CANCELLED), lawyer verification (not_started through rejected), AI (idle through offline), upload, OTP, download.
- Build ONE reusable ScreenState wrapper (skeleton, empty, error with retry, offline, session-expired, permission-denied) so no screen implements these ad hoc.
- All user-facing strings go through an i18n layer (English first).
- Feature-based folder organization, shared UI primitives, no monolithic components, no unnecessary dependencies.

## Content and trust rules

- Never invent constitutional text, lawyers, credentials, or legal policy copy. Use clearly labelled placeholders.
- Escrow copy says "payment secured/held", never "lawyer paid", until the state is COMPLETED.
- A lawyer shows as verified only when the state is approved.
- AI disclaimer: legal information, not representation by a lawyer.
- Do not expose sensitive user or document information unnecessarily in the UI.
- Do not imply a dispute outcome before a decision is reached.

## Phase order

1. Foundation: tokens, responsive type, navigation, ScreenState, forms, mock layer
2. Auth, OTP, onboarding
3. Home and Learning
4. Library, Constitution, search, downloads, saved
5. AI chat and voice UI
6. Lawyer application and verification status
7. Marketplace, legal request, contact handoff
8. Payments, escrow, completion, disputes, refunds
9. Lawyer dashboard, cases, earnings
10. Notifications, profile, settings, account deletion, support, legal pages
11. Admin (separate web app)
12. Full QA of every route and state

Work one phase at a time. Do not jump between unrelated screens.

## Checkpoint report (end of every phase)

- Completed: exact screens/components implemented
- Preserved: things that were already complete
- Improved: existing screens upgraded
- Remaining: what is still missing
- Risks: anything that could affect backend integration later
- Next phase: exactly what comes next

Then stop and wait for approval.