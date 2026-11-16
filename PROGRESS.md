# Progress
Resume rule: open only this file, find the first unchecked task, read only the files it touches.
Note: tasks below are WRITTEN but not yet run (no npm install / lint / tsc / build / browser check yet).
Do `npm install`, then `npm run lint && npx tsc --noEmit && npm run build` and fix before ticking "verified".

- [~] 1. Project, folders, fonts, tokens.css, Tailwind, light/dark (written: package.json, styles/*, tailwind.config.ts, app/layout.tsx, hooks/useTheme.ts)
- [~] 2. VerdictBadge, ThemeToggle, SpotlightLink done; Button, Input, Card, Modal, Tabs, Toast, Skeleton, Table todo
- [x] 3. Intro curtain animation (Intro.tsx) written; page transitions via CSS view transitions
- [~] 4. Landing v2: dark hero band, scroll-driven Pipeline, CodeWindow, principles, FAQ, Lenis smooth scroll, teal/rose/sand palette; pricing + docs + connect pages todo
- [~] 5. Pricing page (example plans, monthly/yearly) written
- [~] 6. Auth: login + signup redesigned (back button, icon fields, show/hide, strength bar, staggered entrance); reset + connect-login todo
- [~] 7. Real API layer done: lib/config.ts (env), client, auth, verifications, account (usage, billing, prefs, keys, docs, insights). App shell todo
- [~] 8. /dashboard written (usage, verdicts, trend, recent)
- [~] 9. /verifications history written
- [~] 10. /verifications/[id] detail written (export JSON/CSV, delete, polling)
- [~] 11. /verify (Playground) in app shell, real backend
- [~] 12. Connect guide page written (no live connected status yet; needs backend)
- [ ] 13. API keys and connector
- [ ] 14. Documents
- [ ] 15. Preferences
- [ ] 16. Insights
- [ ] 17. Billing and plans
- [ ] 18. Account settings
- [~] 19. Public Docs page written; public info pages from the demo frontend ported: /about, /support, /contact, /privacy, /terms (new components/marketing/InfoPage.tsx) + footer Company column and legal links
- [ ] 20. Admin
- [ ] 21. Error and empty states
- [ ] 22. Final pass
