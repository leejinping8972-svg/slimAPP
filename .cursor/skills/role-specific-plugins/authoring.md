# Authoring a role-specific Cursor skill pack

## Directory layout

```text
.cursor/skills/<role-name>/
|-- SKILL.md                 # Router + shared practices (required)
|-- references/              # Optional deep playbooks (one level deep)
|   |-- orientation.md
|   `-- <workflow>.md
`-- scripts/                 # Optional helpers the agent should execute
```

Optional sibling focused skills:

```text
.cursor/skills/<role-name>-<workflow>/SKILL.md
```

Prefer one role router plus `references/` unless a workflow is large enough to deserve its own skill discovery entry.

## SKILL.md skeleton

```markdown
---
name: my-role
description: <third-person WHAT + WHEN with trigger terms>
---

# My Role

## Plugin purpose
One short paragraph.

## Audience and language
Domain experts; plain language; no implementation narration unless asked.

## Dependency categories
- [Blocking] ~~Category — when it blocks first output
- ~~Category — useful, non-blocking

## Routing
Map intents → focused reference or sibling skill. Router does not execute the focused workflow.

## Default workflow
1. Resolve dependencies and clarify (batch only high-impact questions)
2. Gather context from authoritative sources first
3. First useful output + limitations
4. One clear next-step offer
```

## Description checklist

- Third person
- Specific capabilities (WHAT)
- Trigger scenarios (WHEN)
- Distinct from sibling roles (avoid stealing ordinary coding tasks)

## Dependency category pattern

Use `~~Category` placeholders in skills; resolve against MCP tools and user-provided files in the live session.

1. Unlabeled categories are useful but non-blocking.
2. `[Blocking]` only when the first artifact cannot be honest without that source or equivalent pasted context.
3. If equivalent user context exists, do not demand a connector install.
4. After a partial first output, offer optional connectors as improvements.

## Output contract defaults

Every focused workflow should define:

- Primary artifact shape (brief, table, HTML, markdown report, prototype path)
- Evidence rules (cite sources; mark confidence)
- Limitations section
- Exactly one suggested next step (not a long menu)

## Cursor-specific do / don't

**Do**
- Prefer tools actually present (MCP, browser, shell, files)
- Keep scripts executable with clear CLI usage
- Link refs one level deep from `SKILL.md`

**Don't**
- Embed ChatGPT Work Mode stop-gates
- Hard-code another workspace's connector IDs
- Duplicate full upstream plugin trees (vendor only what the team will customize)
- Put Windows-style paths in instructions

## Verification

- [ ] `name` lowercase hyphenated, ≤64 chars
- [ ] `description` ≤1024 chars, WHAT + WHEN
- [ ] Router is thin; focused logic lives in refs or sibling skills
- [ ] SKILL.md < 500 lines
- [ ] Connector placeholders documented or removed
- [ ] ATTRIBUTION retained for substantial upstream text
