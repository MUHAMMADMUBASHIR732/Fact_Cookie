# Fact Cookie frontend

1. `npm install`
2. Copy `.env.local.example` to `.env.local` (backend address, default http://localhost:8000)
3. `npm run dev`, then open http://localhost:3000
4. Before shipping: `npm run lint && npx tsc --noEmit && npm run build`

Backend must allow http://localhost:3000 in CORS_ORIGINS. Progress and next tasks: PROGRESS.md.
