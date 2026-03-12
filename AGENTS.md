# AGENTS.md

You are an agent working inside this repository.

Follow these instructions exactly.

## Core operating principles

- Be deterministic.
- Be incremental.
- Change the minimum necessary to complete the selected story safely.
- Do not start a second story in the same run.
- Do not treat historical implementation as automatic completion.
- Do not claim verification you did not actually perform.
- Preserve Apollo’s institutional identity while translating a Payload-inspired visual language.

---

## Read order

Before making any change, read these files in this order:

1. `progress.txt`
   - Read `## Codebase Patterns`
   - Read `## Project Snapshot`
   - Read `## PRD Sync Notes`
   - Read `## Current Delivery Status`
   - Read `## Validation Rules`
   - Read `## Active Risks / Known Issues`
   - Read older historical entries only if they are directly relevant to the selected story
2. `prd.json`
3. `progress-archive.txt` only if the selected story requires older historical context

If any required file is missing, unreadable, malformed, or internally contradictory in a way that prevents safe execution:
- treat that as a blocker
- append the blocker to `progress.txt` if possible
- stop

---

## Sources of truth

Use these sources by purpose:

1. `prd.json`
   - story order
   - story status (`passes`)
   - dependencies
   - completion rules
2. `progress.txt`
   - reusable codebase patterns
   - operational context
   - recent implementation learnings
3. `progress-archive.txt`
   - older historical implementation context only when needed
4. existing repository code
   - local implementation patterns and abstractions

If `progress.txt` or `progress-archive.txt` conflicts with the active `prd.json` on:
- story status
- story order
- dependencies
- what is next

then `prd.json` wins.

If descriptive text in `prd.json` conflicts with the actual `userStories` array or `storyDependencies`, the structured fields win.

---

## Story selection

Select exactly one story per run.

Choose the first story in the current `userStories` order from `prd.json` where:
- `"passes": false`
- all declared dependencies are already satisfied

For the active PRD v3.3 tail, the open phase-2 order is:
`US-051` → `US-052` → `US-053` → `US-054` → `US-055` → `US-056` → `US-057` → `US-058` → `US-050`

Rules:
- Do not begin a second story in the same run.
- Do not skip a valid earlier story just because a later story looks easier.
- Do not change unrelated stories in `prd.json`.
- If an older `progress.txt` entry suggests the story was already explored or partially implemented, treat that as context only.
- Re-evaluate the story against the current `prd.json` acceptance criteria before marking it complete.
- Treat `US-050` as the final gate story; do not select it while any of `US-051` through `US-058` remain incomplete.

If all stories are already complete, reply with exactly:

COMPLETE

For redesign, backlog-review, and visual-refinement stories:
- do not add net-new product features unless the story explicitly requires them
- prioritize hierarchy, spacing, typography, surfaces, CTA clarity, responsiveness, and consistency
- preserve Apollo’s institutional identity while translating a Payload-inspired visual language.
- prefer template evolution, shared primitives, and design-system alignment over one-off styling

A story is not complete merely because similar work exists in history.
It is complete only when:

- the current repository state satisfies the current acceptance criteria
- validation has been rerun in the current state
- the story has been recorded correctly



## Branch rules

Read `branchName` from `prd.json`.

- If the current branch already matches `branchName`, stay on it.
- If it does not exist locally, create it from `main`.
- If it exists, check it out.
- If git operations are unavailable, append that limitation to `progress.txt` and continue only with file changes that do not depend on git.

## Scope rules

Implement only the selected story.

Keep changes:
- focused
- minimal
- consistent with existing repository patterns

Do not:
- refactor unrelated areas
- start another story
- expand scope because of adjacent issues

If you notice a broader issue outside the selected story:
- do not fix it unless required to complete the selected story safely
- record it in `progress.txt` as future context

For backlog or visual-review stories:
- do not implement product features unless the story explicitly requires it
- evaluate delivery sequencing and design intent
- preserve the current site identity while pushing toward a more modern, refined, and visually coherent result

## Implementation preferences

Prefer, in order:

1. existing abstractions already used in the repo
2. local patterns consistent with nearby files
3. the smallest new abstraction needed to complete the story safely

Avoid introducing new architecture, libraries, or conventions unless the selected story requires them.

## Quality checks

Before marking the story complete, run every applicable project check in this order:

1. `npm run lint`
2. `npm run typecheck` if it exists; otherwise run `npx tsc --noEmit`
3. `npm run test` if it exists
4. `npm run build`

Rules:
- Run only commands that exist in this repository.
- If `npm run typecheck` does not exist, `npx tsc --noEmit` is required.
- Do not mark a story complete if any required check fails.
- Fix failing checks if they are caused by your changes.
- If a check cannot run, append the reason to `progress.txt`.
- If checks fail for reasons unrelated to your story, record that clearly in `progress.txt` and do not mark the story complete.
- If `npm run build` fails with known transient Next.js sandbox issues, retry once.
- If the retry still fails, record the exact failure in `progress.txt`.
- If `npx next build --debug` is used for diagnosis, record that explicitly and do not treat it as equivalent silently.

## progress.txt rules

Always append the selected story's own entry to `progress.txt`.
Outside explicit documentation-maintenance or backlog-governance stories, do not replace or compress existing content.

`progress.txt` must begin with a `## Codebase Patterns` section at the top, followed by concise operational sections such as:
  `## Codebase Patterns`
- `## Project Snapshot`
- `## PRD Sync Notes`
- `## Current Delivery Status`
- `## Validation Rules`
- `## Active Risks / Known Issues`

Historical story entries should remain below those sections.
Do not rewrite or compress historical entries during a normal story run unless the selected story explicitly requires documentation maintenance.
If `progress.txt` becomes large, keep only the operational sections plus the most recent relevant entries there.
Move older historical entries to `progress-archive.txt` without deleting them.

For backlog-governance or documentation-maintenance stories, it is valid to relocate historical entries from `progress.txt` to `progress-archive.txt` as long as traceability is preserved and the current run still appends its own new progress entry.

`progress-archive.txt` should contain older completed story logs and long historical context that is no longer needed in most runs.
Do not use `progress-archive.txt` as the primary source of current story order or completion state.

## Codebase Patterns maintenance

Maintain a `## Codebase Patterns` section at the top of `progress.txt`.

Only add patterns that are:

- reusable
- likely to matter for future stories
- broader than a single task

Examples of good patterns:

- Payload upload relations may be either string IDs or populated objects
- New blocks must be exported from `src/blocks/index.ts` and registered in the relevant collection config
- Interactive layout components use a server/client split with `FooServer.tsx` and `Foo.tsx`

Do not add:

- story-specific notes
- temporary debugging notes
- one-off implementation details
- ephemeral environment noise

## Documentation updates

If you discover reusable knowledge that will help future work, update the most appropriate nearby documentation.

- `AGENTS.md`
- local module notes
- nearby developer docs

Good documentation updates include:

- architecture constraints
- hidden dependencies
- synchronization requirements between files
- environment or testing assumptions
- non-obvious conventions

Do not document:
- temporary debugging notes
- story-only context already captured in `progress.txt`

## Browser verification

For UI changes:

- verify in the browser if browser tooling is available
- confirm the relevant page or flow works
- confirm responsive behavior when relevant
- record the result in `progress.txt`

If browser tooling is unavailable, record that manual verification is still required.

## Completion rules

A story is complete only when all of the following are true:

1. the selected story was implemented
2. applicable checks were run
3. applicable checks passed
4. `prd.json` was updated so that selected story has "passes": true
5. a progress entry was appended to `progress.txt`

When the selected story is fully implemented:

1. run checks
2. update `prd.json` and set that story to `"passes": true`
3. append the progress entry to `progress.txt`
4. commit if checks passed

Stop after the commit.
Do not begin another story.

If all stories in `prd.json` are complete, reply with exactly:

COMPLETE
