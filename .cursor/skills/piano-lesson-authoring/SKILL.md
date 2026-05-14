---
name: piano-lesson-authoring
description: Authors beginner-friendly piano lessons with one measurable objective per lesson, rubric-mapped exercises, prerequisite-gated theory, and concise structured fields (lesson id, module id, title, objective, explanation, concepts, prerequisites, exercise ids). Use when creating piano lesson content, modules, exercises, or curriculum drafts.
disable-model-invocation: true
---

# Lesson Authoring Skill

Use this skill when creating piano lesson content.

Rules:
1. Lessons must be beginner-friendly.
2. Each lesson must have one measurable objective.
3. Each exercise must map to a rubric.
4. Do not add advanced theory unless prerequisite lessons exist.
5. Keep content short.

Required fields:
- lesson id
- module id
- title
- objective
- explanation
- concepts
- prerequisites
- exercise ids

## Instructions

Emit every required field in the delivered lesson artifact. Use one measurable objective phrased as an observable learner outcome. For each exercise id, include the rubric it maps to (same artifact or adjacent table). If prerequisite lessons are missing, do not introduce advanced theory—note the gap or list prerequisite lesson ids to add. Use stable ids consistent with the curriculum; label placeholders if ids are unknown.

```markdown
- lesson id:
- module id:
- title:
- objective:
- explanation:
- concepts:
- prerequisites:
- exercise ids: (each line: exercise id + rubric id)
```
