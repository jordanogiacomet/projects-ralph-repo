# AGENTS.md

You are an agent working inside this repository for the dedicated visual-r1 cycle.

Follow these instructions exactly.

## Core operating principles

- Be deterministic.
- Be incremental.
- Fix the minimum necessary to resolve the selected visual issue scope safely.
- Do not start a second story in the same run.
- Do not reopen the legacy redesign backlog.
- Do not invent visual problems that are not evidenced by the register or screenshots.
- Do not claim browser verification you did not actually perform.

---

## Read order

Before making any change, read these files in this order:

1. `progress.txt`
2. `prd.json`
3. `docs/visual-register.md`
4. Baseline context only if needed:
   - `.ralph/baseline/BASELINE.md`
   - `.ralph/baseline/prd-phase2.json`
   - `.ralph/baseline/progress-phase2.txt`
   - `.ralph/baseline/progress-archive-phase2.txt`

If any of the first 3 files is missing, malformed, or contradictory in a way that blocks safe execution:
- record the blocker in `progress.txt` if possible
- stop

---

## Sources of truth

Use these sources by purpose:

1. `prd.json`
   - story order
   - story status (`passes`)
   - dependencies
   - completion rules
2. `docs/visual-register.md`
   - issue-level scope
   - route/breakpoint/state/severity
   - screenshot references
   - suspected affected area
3. `progress.txt`
   - reusable patterns
   - current operational context
   - recent learnings for this visual cycle
4. Baseline files under `.ralph/baseline/`
   - baseline context only
   - never override the active root `prd.json`

If baseline files conflict with the active root `prd.json`, the active root `prd.json` wins.

---

## Story selection

Select exactly one story per run.

Choose the first story in `prd.json` where:
- `"passes": false`
- all dependencies are satisfied

Order:
`VP-001` → `VP-002` → `VP-003` → `VP-004` → `VP-005` → `VP-006` → `VP-007`

Rules:
- Do not skip an earlier valid story.
- Do not work on two stories in one run.
- Do not mark `VP-007` complete while any earlier story remains open.

If all stories are complete, reply with exactly:

COMPLETE

---

## Issue selection inside a story

Inside the selected story:
- work only on issues assigned to that story scope in `docs/visual-register.md`
- prefer higher-severity issues first
- prefer issues with screenshots or explicit evidence first
- do not fix issues from another story unless required by a shared-component change that is necessary and safe

If the selected story has no actionable issues yet:
- record that in `progress.txt`
- do not improvise unrelated changes

---

## Scope rules

Implement only the selected story.

Do:
- fix visual debt evidenced by the register/screenshots
- prefer the nearest responsible component
- reuse existing primitives, tokens, utilities, and layout patterns
- update the issue register when an issue is fixed, blocked, rejected, or deferred

Do not:
- add product features
- do broad refactors
- reopen CMS modeling
- start redesigning entire pages because of one local issue
- modify the frozen baseline files unless explicitly necessary for safe context

---

## Screenshots and evidence

If screenshots are available:
- use them as authoritative visual evidence for the issue
- reference screenshot filenames in the register and progress entry
- match route + breakpoint + state carefully

If screenshots are not available:
- only proceed when the issue description is objective enough to implement safely

Good issue descriptions:
- “CTA button baseline is lower than adjacent input on desktop”
- “Hero overlap card clips into header at 1024px”
- “Card grid becomes 3 columns too early and compresses logos on tablet”

Bad issue descriptions:
- “Make this prettier”
- “Improve layout a bit”
- “Looks weird somewhere”

---

## Branch rules

Read `branchName` from `prd.json`.

- If current branch already matches `branchName`, stay on it.
- If it does not exist locally, create it from `baseBranch` if available, otherwise `main`.
- If it exists, check it out.
- If git operations are unavailable, record that in `progress.txt` and continue only if safe.

---

## Quality checks

Before marking the story complete, run in this order:

1. `npm run lint`
2. `npm run typecheck` if it exists; otherwise `npx tsc --noEmit`
3. `npm run test` if it exists
4. `npm run build`

Rules:
- Run only commands that exist.
- Do not mark the story complete if required checks fail.
- If a check fails because of your changes, fix it.
- If a check fails for unrelated reasons, record that clearly and do not mark the story complete unless repository policy explicitly allows it.
- If browser tooling is unavailable, record manual QA pending.

---

## Register maintenance

Always keep `docs/visual-register.md` updated.

For each touched issue, update:
- status
- changed files
- short resolution note
- remaining QA note if applicable

Issue statuses should use one of:
- `open`
- `in-progress`
- `fixed`
- `blocked`
- `deferred`
- `rejected`

---

## Progress log rules

Always append a new entry to `progress.txt`.

Each entry must include:
- date/time
- story ID
- issue IDs addressed
- what was implemented
- files changed
- checks run and results
- browser/manual verification status
- learnings for future iterations

Do not rewrite old entries.

---

## Completion rules

A story is complete only when all of the following are true:

1. the selected story’s scoped issues were handled in the register
2. required checks were run
3. required checks passed
4. `prd.json` was updated with `"passes": true` for that story
5. a progress entry was appended to `progress.txt`

Then:
1. update `prd.json`
2. update `docs/visual-register.md`
3. append `progress.txt`
4. commit if checks passed

Stop after the commit.

If all stories in `prd.json` are complete, reply with exactly:

COMPLETE