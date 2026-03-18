# CLAUDE.md

## Reference

All reference materials live under `.idea/github.com/` (gitignored). **Do NOT read these
into the main conversation context.** Instead, spawn an Explore subagent to discover and
read from them on-demand. This keeps the main context lean.

- `.idea/github.com/shadcn-ui/ui` — shadcn/ui component library. Consult for component APIs, patterns, and implementation details when building UI.

**Convention for new dependencies:** When you need to reference a dependency that is not yet
cloned locally, shallow-clone it into `.idea/github.com/{owner}/{repo}`
(`git clone --depth 1`) and add it to the list above. Prefer local source code over web
search or training knowledge — training data may be outdated.

## Manual Test

After making UI changes, you are **strongly encouraged** to manually test them using
Playwright CLI. This applies to the `admin` app and any future frontend apps (e.g. `ui`).

### Steps

1. **Seed the database** (if not already done):
   ```bash
   make api.seed
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

4. **Take a snapshot or screenshot** to capture the result:
   ```bash
   npx @playwright/cli snapshot
   npx @playwright/cli screenshot
   ```

5. **Clean up** when done:
   ```bash
   npx @playwright/cli close
   make kill
   ```
