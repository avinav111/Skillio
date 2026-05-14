---
name: idea-triage
description: Triages brain-dumped product ideas into MVP now, later, risky, reject, or needs research; updates docs/IDEAS_INBOX.md and docs/DECISIONS.md without implementing. Use when the user dumps many product ideas, asks for idea triage, backlog sorting, or prioritization without building features.
disable-model-invocation: true
---

# Idea Triage Skill

Use this skill when the user brain dumps product ideas.

Do not implement the ideas.

Classify each idea as:

- MVP now
- later
- risky
- reject
- needs research

Add accepted future ideas to docs/IDEAS_INBOX.md.

If the idea affects architecture, add a proposed decision to docs/DECISIONS.md but do not implement without explicit approval.

Output:

- cleaned summary
- recommendation
- whether implementation is advised now

## Cursor agent notes

- Split the brain dump into distinct ideas; assign exactly one classification each; if unknown, use **needs research** and list open questions.
- **docs/IDEAS_INBOX.md**: append **later**, **needs research**, and **risky** items that should stay on the backlog; skip **reject**; skip **MVP now** in this file unless the user explicitly wants those logged as future work. Create `docs/` and the file with a minimal top heading on first use; avoid duplicate lines.
- **docs/DECISIONS.md**: for architecture-impacting ideas, append a short **proposed** decision (context, options, suggested choice, explicit **Proposed — not approved**). Create the file with a minimal top heading on first use.
- Do not edit application code, configs, or schemas as part of this skill unless the user separately approves implementation.
