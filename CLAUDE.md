# CLAUDE.md

## Verification

After implementation, always run through every step below. If `make check` or testing
reveals failures — even in code from a previous session — fix them and re-run. All code in
this repo is yours; own it.

When planning, include these verification steps in the plan but do not execute them.

1. **`make check`** — Run this first. It must pass before anything else. No exceptions, even
   for documentation-only changes (the check may evolve to cover markdown formatting).
2. **Manual test** — Encouraged for every change (UI, API, or both). Playwright CLI acts as
   an integration safety net since there is no formal contract between backend and frontend.
   Follow the Manual Test steps below.
3. **Nuke & reseed** — Before testing, always nuke the data directory and reseed:
   ```bash
   rm -rf ~/.standalone && make api.seed
   ```
   If data is missing after reseeding, the seed script needs fixing — update it.

## Conventions

### Controller Naming (Laravel-style)

Controller files follow Laravel's resourceful naming convention:

| Verb      | URI                    | Action  | Filename                 |
| --------- | ---------------------- | ------- | ------------------------ |
| GET       | /photos                | index   | `index.controller.ts`    |
| GET       | /photos/create         | create  | `create.controller.ts`   |
| POST      | /photos                | store   | `store.controller.ts`    |
| GET       | /photos/{photo}        | show    | `show.controller.ts`     |
| GET       | /photos/{photo}/edit   | edit    | `edit.controller.ts`     |
| PUT/PATCH | /photos/{photo}        | update  | `update.controller.ts`   |
| DELETE    | /photos/{photo}        | destroy | `destroy.controller.ts`  |

Non-standard actions use descriptive kebab-case names (e.g., `change-password.controller.ts`,
`login.controller.ts`).

## Reference

All reference materials live under `.idea/github.com/` (gitignored). **Do NOT read these
into the main conversation context.** Instead, spawn an Explore subagent to discover and
read from them on-demand. This keeps the main context lean.

- `.idea/github.com/shadcn-ui/ui` — shadcn/ui component library. Consult for component APIs, patterns, and implementation details when building UI.
- `.idea/github.com/nestjs/nest` — NestJS framework. Consult for module, controller, guard, decorator, and pipe patterns.
- `.idea/github.com/typeorm/typeorm` — TypeORM. Consult for entity definitions, repository patterns, query builder, and migration APIs.
- `.idea/github.com/typestack/class-validator` — class-validator. Consult for available validation decorators and custom validator patterns.
- `.idea/github.com/typestack/class-transformer` — class-transformer. Consult for transformation decorators (Expose, Exclude, Transform, Type).
- `.idea/github.com/emilkowalski/sonner` — Sonner toast library. Consult for toast API and customization options.
- `.idea/github.com/pacocoursey/next-themes` — next-themes. Consult for theme provider setup and usage patterns.
- `.idea/github.com/lucide-icons/lucide` — Lucide icons. Consult for available icon names and React component usage.

**Convention for new dependencies:** When you need to reference a dependency that is not yet
cloned locally, shallow-clone it into `.idea/github.com/{owner}/{repo}`
(`git clone --depth 1`) and add it to the list above. Prefer local source code over web
search or training knowledge — training data may be outdated.

## Manual Test

Load the `playwright-cli` skill (`/playwright-cli`) before running manual tests. All
Playwright CLI artifacts are saved to `.playwright-cli/` (gitignored).

### Steps

1. **Nuke & reseed:**
   ```bash
   rm -rf ~/.standalone && make api.seed
   ```

2. **Start the dev environment:**
   ```bash
   make dev
   ```

3. **Open the app in Playwright and verify your changes:**
   ```bash
   npx @playwright/cli open http://localhost:25702
   ```
   Navigate to the pages affected by your changes. Interact with the UI — click buttons,
   fill forms, navigate between pages — and confirm everything works as expected.

4. **Clean up** when done:
   ```bash
   npx @playwright/cli close
   make kill
   ```
