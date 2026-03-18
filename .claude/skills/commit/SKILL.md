---
name: commit
description: Run checks, stage all changes, and create a commit with a message that matches the repository's existing style.
disable-model-invocation: true
allowed-tools: Bash, Read, Grep, Glob
---

Follow these steps exactly:

## Step 1 — Run checks

Run `make check` and ensure it passes. If it fails, fix the issues and re-run until it passes. Do NOT proceed until checks are green.

## Step 2 — Discover changes

Run the following in parallel:
- `git status` to see all changed and untracked files.
- `git diff` to see unstaged changes.
- `git diff --cached` to see already-staged changes.

Then stage all changes with `git add -A`.

After staging, run `git diff --cached` again to see the full set of changes that will be committed. Read any new or heavily modified files if needed to understand what changed.

## Step 3 — Write the commit message

Run `git log --oneline -20` to see recent commit messages. Study the style:
- Prefix convention (e.g. `feat:`, `fix:`, `chore:`, `refactor:`)
- Capitalization, tense, length

Write a concise commit message that mimics the existing style. Focus on the "why", not the "what". Keep the first line under 72 characters. Add a body only if the change is non-trivial.

## Step 4 — Commit

Create the commit. Do NOT append any `Co-Authored-By` trailer. Use a HEREDOC to pass the message:

```bash
git commit -m "$(cat <<'EOF'
your message here
EOF
)"
```

## Step 5 — Verify

Run `git status` and `git log --oneline -5` to confirm the commit was created successfully. Report the result to the user.
