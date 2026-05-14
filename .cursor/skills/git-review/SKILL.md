---
name: git-review
description: Runs a structured pre-commit review—git diff, changed-file summary, risk callouts, lint/test verification, commit message draft, and build log updates when warranted. Use before committing, when the user asks for a pre-commit review, or when validating staged or unstaged changes.
disable-model-invocation: true
---

# Git Review Skill

Use this skill before a commit.

Steps:

1. Check git diff.
2. Summarize changed files.
3. Identify risky changes.
4. Confirm tests/lint status.
5. Suggest commit message.
6. Update BUILD_LOG.md if needed.

Do not commit automatically unless explicitly asked.

## Agent execution notes

- For diffs, use `git diff` for unstaged changes and `git diff --cached` for staged changes; include both when the user is unsure what will commit.
- Risky changes often include auth/session handling, secrets, migrations, permissions, payments, serialization boundaries, and breaking public APIs or contracts.
- For tests and lint, run the repository’s usual commands (for example scripts in `package.json`, `make`, or CI-equivalent); if nothing is defined, say that explicitly and rely on static review.
- Resolve the build log path by convention: this repository’s git workflow rule points to `docs/BUILD_LOG.md` for major changes—use that file when it exists and the change warrants an entry; otherwise follow step 6 literally for `BUILD_LOG.md` if that is the project’s file.
- Suggested commit messages should match project conventions when known (for example `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:` prefixes).

## Output

Report in order: diff highlights → file list → risks → lint/tests result (or gap) → proposed commit message → whether the build log needs an update and what entry to add.
