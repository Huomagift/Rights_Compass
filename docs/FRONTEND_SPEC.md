# Rights Compass: Complete Frontend Spec

Master checklist for the Rights Compass frontend. Every item below must exist as a route, screen, modal or sheet, working end to end on typed mock data, before backend or AI work begins.

Read together with `docs/PROJECT_RULES.md` (locked decisions, Material 3 and responsive rules, architecture, trust rules, phase order).

## How this file is used

- Audit: every numbered section and sub-item (e.g. 2.3) gets exactly one status: COMPLETE, PARTIAL, MISSING, NEEDS IMPROVEMENT, DUPLICATED, BROKEN, N/A. Cite file paths as evidence.
- Build: fill only what the audit marks as not COMPLETE. Preserve good existing work. Do not delete or restructure working screens without a stated reason.
- Not in scope: backend, real authentication, real payments, real AI. Use mock repositories and clearly labelled mock state. Never present mock behaviour as real.

## 0. Universal state checklist

Every data-driven screen must define the states that apply to it:

- Initial, Loading (skeleton, not a bare spinner where content shape is known), Loaded
- Empty (with a useful next action)
- Error (plain-language message + Retry)
- Offline (what still works, what needs internet)
- Partial data (some sections loaded, some failed)
- Processing (buttons show progress and cannot be double-submitted)
- Success (confirmation with next step)
- Cancelled
- Permission denied (with a way to recover)
- Unauthorized / session expired (re-authenticate, return to where the user was)
- Destructive confirmation (delete, cancel, refund, decline, remove)

These are provided by shared components (see PROJECT_RULES: ScreenState wrapper), not rebuilt per screen.

## 1. App and system screens

- 1.1 Splash: logo, tagline, transition. First launch routes to onboarding; returning user routes to authenticated app.
- 1.2 First-launch vs returning-user routing logic.
- 1.3 Offline screen/state: Retry, continue with cached content, explanation of what needs internet. Important because users may be in a real legal situation.
- 1.4 Global error screen: message, Retry, Return home, optional error reference ID.
- 1.5 Maintenance screen.
- 1.6 Force-update screen.
- 1.7 Session-expired state and re-auth flow.
- 1.8 Network failure and generic API failure states (shared components).
- 1.9 Pre-permission explanation screens (shown before the native prompt) for: notifications, microphone, camera (document capture), file/storage access, phone/call where applicable. Each has a permission-denied recovery state.

## 2. Authentication

- 2.1 Welcome: Rights Compass identity, value proposition, Get Started, "I already have an account".
- 2.2 Phone number entry: country code, phone number, WhatsApp indicator, validation, invalid number, empty, loading (sending code), error.
- 2.3 OTP entry: 6 digits, countdown, Resend OTP, Change phone number.
- 2.4 OTP states: incorrect code, expired code, too many attempts (with lockout message), verifying (loading), verified (success), verification failed.
- 2.5 Frontend must be ready for a WhatsApp/phone verification backend. Use mock state; do not fake verification as real.

## 3. User onboarding

Flow: Welcome, Name, Phone, Phone verification, Reminder time, Priority areas, Completion. Include an "Apply as a lawyer" option that requires finishing onboarding first.

- 3.1 Name step.
- 3.2 Phone and verification steps (reuse section 2).
- 3.3 Reminder time: 7 AM, 8 AM, 9 AM, 12 PM, Custom, Not now.
- 3.4 Priority legal areas: multi-select. Use the categories already present in the product (general rights, employment, police/security, housing/property, family, consumer rights, etc.). Do not add categories without checking existing product direction.
- 3.5 Completion screen with clear entry to the app.
- 3.6 Cross-cutting: Back, Continue, progress indicator, validation, loading, error, easy recovery.
- 3.7 Low cognitive load: one meaningful decision per step, large touch targets, clear hierarchy, encouraging but not childish, minimal clutter.

## 4. Lawyer application

Lives inside the normal app. The applicant continues using Rights Compass as a normal user afterwards. No separate app experience.

- 4.1 Introduction: what it is, required information, verification process, privacy and document handling, what happens after submission. CTA: Start application.
- 4.2 Step 1, Personal details: name and phone pre-filled; email, location, and other professional details.
- 4.3 Step 2, Practice areas: multi-select (human rights, employment, criminal, family, property, civil, corporate/commercial, other).
- 4.4 Step 3, Verification documents: NIN, legal professional credential (call to bar or equivalent), other required professional documentation. Every upload supports: empty, select file, uploading (progress), uploaded, replace, remove, upload failed, invalid format, file too large, document unreadable, missing document.
- 4.5 Step 4, Review and submit: all information shown before submission; edit links back to each step.
- 4.6 Submission result: submitted, pending review, error with retry. Then "Continue to Rights Compass" into the normal home.
- 4.7 Draft handling: application can be saved and resumed.

## 5. Lawyer verification status

Reachable from Profile and dashboard.

- 5.1 Statuses with dedicated UI: not_started, draft, submitted, under_review, more_information_required, approved, rejected.
- 5.2 more_information_required: reviewer request, what is missing, relevant document, "Update application" CTA.
- 5.3 rejected: clear status, reason/category where appropriate, what the user can do, resubmit flow.
- 5.4 approved: verification badge/state and access to lawyer functionality (section 18).
- 5.5 Status must never show "verified" unless the state is approved.

## 6. Home

- 6.1 Header: greeting, search, notifications.
- 6.2 Right of the Day: title, short legal fact, legal reference, Learn more.
- 6.3 Continue Learning: current lesson, progress, Continue CTA.
- 6.4 Active Legal Guide: dynamic card (short guide, scenario, quiz, or important legal information).
- 6.5 Quick actions: Learn, Ask AI, Constitution, Find a Lawyer (gated), Talk to Rights Compass.
- 6.6 Persistent, non-alarming "Need help now?" entry leading to AI voice/chat.
- 6.7 Not overcrowded. Loading, empty and error states per section.

## 7. Learning

- 7.1 Learning hub: overall progress, current path, completed lessons, streak, recommended content.
- 7.2 Learning path (Duolingo-inspired): lesson node states are locked, available, in progress, completed, recommended.
- 7.3 Lesson introduction: topic, estimated duration, learning objectives.
- 7.4 Teaching screen: explanation, legal reference, example, key takeaway, scenario.
- 7.5 Scenario screen: user answers a realistic legal situation.
- 7.6 Answer feedback: dedicated correct and incorrect states (explanation, why it matters, correct principle, continue).
- 7.7 Quiz: multiple choice, true/false, multiple selection, scenario/situational. Question types are extensible via a renderer registry.
- 7.8 Lesson completion: completion, progress, key takeaway, next lesson.
- 7.9 Interrupted lesson: resume, restart, continue from previous point.
- 7.10 Lesson entry points to Ask AI with lesson context.

## 8. Library

- 8.1 Library home: Constitution, legal guides, rights, saved content, downloads, quizzes.
- 8.2 Constitution landing: browse chapters/sections, search, filters, key topics.
- 8.3 Chapters and sections list (structured view).
- 8.4 Individual provision: section number, official text, plain-language explanation, key takeaway, related rights, related lessons, Ask AI about this. Official legal text is never altered or invented; UI receives it from a content source (mock content clearly marked as placeholder).
- 8.5 Search within the library: search, loading, results (section, preview, chapter), no results, error.
- 8.6 Download full Constitution: file size, download, downloading (progress), complete, failed, retry.
- 8.7 Downloads / offline library.
- 8.8 Saved content: lessons, constitution sections, guides, AI explanations, relevant resources. Save/unsave everywhere it applies.

## 9. AI chat

- 9.1 AI landing with useful prompts: explain this right, explain today's lesson, explain this constitutional section, help me understand a legal situation.
- 9.2 Conversation: user messages, AI messages, thinking/loading, streaming-ready message UI, source/reference display, suggested follow-ups, new conversation, conversation history.
- 9.3 Contextual AI: chat can be opened with context from a lesson, constitution section or legal guide (Library, Section, Ask AI, Chat with that context attached).
- 9.4 AI states: idle, connecting, thinking, responding, completed, failed, timeout, rate_limited, offline, with retry.
- 9.5 AI disclaimer: legal information/assistance, not a lawyer and not a substitute for professional representation. Clear, not frightening, not cluttered.
- 9.6 Owl mascot appears only in the Tutor chat (see PROJECT_RULES).

## 10. Voice / phone AI

- 10.1 Voice landing: Talk to Rights Compass, Start voice conversation, Call Rights Compass.
- 10.2 Microphone permission: explanation, denied state, retry.
- 10.3 Connecting state and connection failure.
- 10.4 Active call: duration, mute, speaker, end call, connection status.
- 10.5 Call ended: summary, continue in chat, find a lawyer, return home.
- 10.6 Failure: connection failed, call unavailable, retry, continue in chat.
- 10.7 Emergency/urgent limitation screen: makes clear the AI is not an emergency service and routes the user toward appropriate real-world help.
- 10.8 Integration-ready only. Do not pretend telephony or WhatsApp calling exists.

## 11. Marketplace (gated)

Built fully, but behind the waitlist/feature flag.

- 11.1 Marketplace home: search ("What kind of legal help do you need?"), legal issue categories, practice areas, filters.
- 11.2 Lawyer directory cards: name, verification status, practice areas, location, short description, availability, pricing information where applicable.
- 11.3 Filters: practice area, location, availability, language, verification.
- 11.4 Lawyer profile: name, verified status, practice areas, professional information, location, languages, availability, service info, Request consultation. Reviews only if implemented later.
- 11.5 States: loading, empty (no lawyers match), error, offline.
- 11.6 Mock lawyers are clearly marked as mock. Do not invent professional credentials.

## 12. Legal service request (gated)

- 12.1 Describe issue: legal issue/type, what happened, location, urgency, preferred contact method. Validation.
- 12.2 Attachments: images, PDF, documents. States: empty, selecting, uploading, uploaded, failed, remove, replace.
- 12.3 Select lawyer.
- 12.4 Review request: user request, lawyer, service, lawyer fee, Rights Compass fee, total.
- 12.5 Submit: processing, success, failure, retry.

## 13. Payment (gated)

Built around transaction states, never assuming payment goes straight to the lawyer.

- 13.1 Payment summary: lawyer fee, Rights Compass/platform fee, total. Amounts in naira.
- 13.2 Payment method: card, bank transfer, other supported methods (provider-agnostic UI).
- 13.3 Payment processing: duplicate-submission prevention.
- 13.4 Payment successful: "Payment secured." The lawyer's money is NOT shown as released.
- 13.5 Payment failed, retry, cancel, timeout.

## 14. Escrow and transaction tracking (gated)

- 14.1 Transaction state machine in the frontend. States: REQUESTED, LAWYER_ACCEPTED, PAYMENT_PENDING, PAYMENT_PROCESSING, PAYMENT_SECURED, SERVICE_IN_PROGRESS, COMPLETION_REQUESTED, CLIENT_CONFIRMED, LAWYER_CONFIRMED, COMPLETED, DISPUTED, REFUND_PENDING, REFUNDED, FAILED, CANCELLED. The transition order is config-driven so the product owner can change it (for example whether payment comes before or after lawyer acceptance).
- 14.2 Reusable status UI (badge, banner, copy) per state.
- 14.3 Transaction detail: amount, lawyer, service, payment status, current state, timeline, relevant actions.
- 14.4 Timeline that visually communicates progress.
- 14.5 Transactions list (Profile, Transactions): payments, services, refunds, with empty/loading/error states.

## 15. Service completion (gated)

- 15.1 "Has your legal service been completed?" Actions: Confirm completion, I still need help.
- 15.2 Confirmation dialog clearly explaining the consequence (funds will be released to the lawyer).
- 15.3 Both parties: client confirmation and lawyer confirmation UIs, plus a waiting-for-other-party state.

## 16. Disputes and refunds (gated)

- 16.1 Report a problem: service not completed, service incomplete, wrong service, communication issue, other.
- 16.2 Dispute details: description, evidence, attachments.
- 16.3 Submitted: dispute reference ID, current status, expected next step.
- 16.4 Dispute status: under review, more information required, decision reached. The UI never implies a particular outcome in advance.
- 16.5 Refund states: requested, processing, completed, failed.

## 17. Notifications

- 17.1 Notification center. Categories: Right of the Day, learning, lawyer application, lawyer requests, payments, escrow, messages, system.
- 17.2 States: unread, read, empty, loading, error. Mark read/all read, tap to deep link.
- 17.3 Notification settings (separate screen, see section 21).

## 18. Lawyer mode (gated, only after approved)

Same app, additional access. No duplicate app.

- 18.1 Lawyer overview: pending requests, active services/cases, completed services, earnings, settlement status, verification status.
- 18.2 Incoming requests list: client, legal issue, practice area, location, service, fee, date. Actions: View, Accept, Decline.
- 18.3 Request detail: client request, attachments, service, fee, relevant transaction info, contact options according to privacy rules.
- 18.4 Accept: confirmation state. Decline: optional reason.
- 18.5 Active cases/services list: client, service, status, deadline, payment state.
- 18.6 Case detail: client, service, request, attachments, status, transaction, contact. Structured so messaging can be added later.
- 18.7 Earnings overview: pending, available, completed, total.
- 18.8 Transaction history and settlement detail.
- 18.9 Payout states: pending, processing, paid, failed.

## 19. Contact and handoff

- 19.1 Handoff options: WhatsApp, phone call, email. It must be obvious which method is being used.
- 19.2 Failure states when a handoff cannot be completed (app not installed, no number, etc.) with a fallback.
- 19.3 Prepared for in-app messaging later.

## 20. Profile

- 20.1 Personal information: name, phone, email, profile image.
- 20.2 Learning: progress, streak, completed lessons, saved resources.
- 20.3 Preferences: language, reminder time, notification settings, theme.
- 20.4 Security: phone verification, active sessions, change phone number.
- 20.5 Lawyer: apply, application status, lawyer dashboard if approved.
- 20.6 Transactions: payments, services, refunds.
- 20.7 Privacy: data controls, delete account/data.
- 20.8 About: terms, privacy policy, legal information, support, app version.

## 21. Settings

- 21.1 Appearance: light, dark, system.
- 21.2 Language: architecture ready for multiple languages; English first. No hardcoded strings.
- 21.3 Notifications: individual toggles for Right of the Day, learning reminders, lawyer updates, transaction updates.
- 21.4 Reminder: time and enable/disable.

## 22. Account deletion

- 22.1 Flow: Delete account, explanation, data that will be deleted, what cannot be recovered, irreversible warning, confirmation, OTP/authentication if appropriate, deleting, success.
- 22.2 Failure, retry, cancel at every step.

## 23. Global search

- 23.1 Searches constitution, lessons, legal guides, lawyers (gated), saved resources.
- 23.2 States: empty, typing, loading, results (grouped), no results, error.

## 24. Help and support

- 24.1 Help center categories: account, learning, constitution, AI, lawyers, payments, refunds, verification.
- 24.2 Contact support: issue category, description, attachments, submit.
- 24.3 Support tickets: open, in progress, resolved; ticket detail.

## 25. Legal and trust pages

- 25.1 Routes/components for: Terms of Service, Privacy Policy, AI disclaimer, legal information disclaimer, lawyer marketplace terms, payment/escrow terms, refund policy, user rules/community guidelines, consent screens.
- 25.2 Legal copy is NOT written by the AI. Use clearly marked placeholder content areas ("Final legal copy pending review") that content can replace later.

## 26. Admin dashboard (separate web app)

Audit whether one exists. If not, build the architecture and UI as a separate web app, not inside the mobile app. Built last.

- 26.1 Admin login: email, password, authentication state, 2FA-ready structure.
- 26.2 Overview: users, lawyers, pending applications, active services, transactions, disputes, support tickets.
- 26.3 Lawyer verification: application, documents, Approve, Reject, Request more information.
- 26.4 Users: search, profile, status, transactions, relevant activity, suspend/deactivate.
- 26.5 Content management: Right of the Day, lessons, learning paths, quiz questions, scenarios, legal guides, constitution references, categories, translations.
- 26.6 Transactions: payment, escrow status, client, lawyer, amount, Rights Compass fee, lawyer amount, status.
- 26.7 Disputes: open disputes, evidence, status, decision, refund/release actions.
- 26.8 Support: tickets, status, user, conversation.
- 26.9 AI/content management (later): prompts/config, knowledge sources, content versions, flagged responses, user feedback.

## 27. Content architecture and data models

- 27.1 Typed models exist for: User, Lesson, LearningPath, Question, Quiz, Scenario, LegalRight, ConstitutionSection, LegalGuide, Lawyer, LawyerApplication, LegalRequest, Transaction, Dispute, Notification, SupportTicket, ChatConversation, ChatMessage.
- 27.2 Content is not hardcoded into UI components.
- 27.3 Repository interfaces let real services replace mock ones without UI rewrites.

## 28. Mock layer

- 28.1 Separate mock data and services for users, lessons, lawyers, transactions, disputes, notifications, AI responses, lawyer applications.
- 28.2 A way to force each state (loading, empty, error, offline, every transaction and verification state) so every screen can be tested without a backend.
- 28.3 Mock behaviour is labelled as mock, never presented as real.

## 29. Design system, responsiveness, accessibility, theme

- 29.1 Material 3 throughout: color roles, type scale, shape, elevation, components, state layers. Warm Earth palette preserved as the seed.
- 29.2 Central theme/tokens; no scattered hardcoded colors.
- 29.3 Responsive by window size class: compact, medium, expanded. Type scale, spacing, grids, navigation, cards, dialogs, forms, tables, bottom sheets and content width all adapt. Desktop is not a stretched phone and mobile is not a squeezed desktop. Same font sizes are NOT used on mobile and web.
- 29.4 Mobile checks: safe areas, keyboard behavior, long text, small screens, large font settings, touch targets, scroll behavior, sticky actions, modal height, landscape where relevant. No text overflow, cut-off buttons, content behind navigation, or accidental horizontal scroll.
- 29.5 Accessibility: semantic labels, contrast, keyboard navigation and focus states on web, screen-reader labels, clear errors, accessible form controls, no meaning conveyed by color alone.
- 29.6 Theme: light, dark, system.
- 29.7 Avoid generic AI-looking UI: no random gradients, heavy glassmorphism, excessive rounded cards, or decorative floating elements.

## 30. Navigation

- 30.1 Primary structure: Home, Learn (or Library per existing design), Library, Marketplace, Profile, using the locked 4-tab decision in PROJECT_RULES.
- 30.2 AI is a prominent contextual action, not another permanent tab.
- 30.3 Lawyer functionality appears contextually when verified.
- 30.4 Every screen reachable, no dead ends, deep links for notifications and contextual AI.

## 31. Definition of done

- Every item above has a route or an intentional modal/sheet/dialog.
- Every important journey can be completed on mock data.
- Loading, empty, error, success, processing and offline states exist where relevant.
- Forms validate; destructive actions confirm.
- Mobile, tablet and desktop layouts are intentional.
- Light and dark mode work; accessibility basics handled.
- Mock data is separated from backend services; integration points are defined.
- Lawyer, payment/escrow, dispute/refund, AI, admin and legal/trust items are accounted for.
- Gated features are hidden behind a single flag and appear when it is removed.112