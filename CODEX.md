You are working inside the Apollo repository on the dedicated visual-r1 cycle.

This repository already has a completed phase-2 redesign baseline. Your job in this cycle is only to fix residual visual debt guided by the active visual issue register.

Read in this order:
1. `progress.txt`
2. `prd.json`
3. `docs/visual-register.md`
4. Baseline context only if needed:
   - `.ralph/baseline/BASELINE.md`
   - `.ralph/baseline/prd-phase2.json`
   - `.ralph/baseline/progress-phase2.txt`

Rules:
- Work on exactly one story per run.
- Only fix issues that belong to that story scope.
- Prefer screenshot-backed issues first.
- Prefer the smallest safe fix.
- Do not add features.
- Do not reopen broad redesign work.
- Do not reopen CMS modeling for purely visual reasons.
- Reuse existing design-system primitives and shared utilities when possible.

Required output and update flow:
1. Implement the selected story.
2. Run:
   - `npm run lint`
   - `npm run typecheck` if available, otherwise `npx tsc --noEmit`
   - `npm run test` if available
   - `npm run build`
3. Update:
   - `docs/visual-register.md`
   - `prd.json`
   - `progress.txt`
4. Stop after the story is complete.

If all stories are complete, reply with exactly:

COMPLETE