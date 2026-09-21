---
name: role-specific-plugins
description: Creates, customizes, and routes OpenAI-style role-specific skill packs (Sales, Data Analytics, Product Design) for Cursor. Use when adapting openai/role-specific-plugins, scaffolding a new role plugin, configuring connectors, or choosing which role workflow to run.
---

# Role-Specific Plugins

Adapt [openai/role-specific-plugins](https://github.com/openai/role-specific-plugins) patterns into Cursor project skills. Upstream plugins package domain skills, connector bindings, and starter assets for Sales, Data Analytics, and Product Design.

## When to use

| Intent | Load |
| --- | --- |
| Create or customize a role pack | This skill + [authoring.md](authoring.md) |
| Sales workflows (meetings, pipeline, CRM) | `.cursor/skills/sales/SKILL.md` |
| Analytics (metrics, dashboards, reports) | `.cursor/skills/data-analytics/SKILL.md` |
| Product design (prototype, audit, ideate) | `.cursor/skills/product-design/SKILL.md` |
| Connector / app placeholders | [connectors.md](connectors.md) |
| Role catalog and skill maps | [roles.md](roles.md) |

## Cursor mapping

Upstream Codex concepts map as follows:

| Codex / ChatGPT | Cursor |
| --- | --- |
| Plugin `skills/` | `.cursor/skills/<role>/` (+ optional nested refs) |
| Index skill (router) | Role `SKILL.md` frontmatter + routing section |
| `.app.json` connectors | MCP tools / connected apps available in the session |
| `ask_user_input` | Ask clarifying questions in chat (batch high-impact ones) |
| Browser / Sites | Available browser or deploy tools in this environment |
| Work Mode gates | Ignore ChatGPT Work Mode stop-gates; proceed in Cursor |

Do not copy Codex-only runtime branches (`chatgpt_web` chat stop-gates, `@Sites` Desktop rules) into Cursor skills unless the team still runs those surfaces.

## Core authoring rules

1. **Router stays thin** — Role index chooses the focused skill; it does not do that skill's work.
2. **Descriptions are discovery** — Third person, WHAT + WHEN, trigger terms in frontmatter `description`.
3. **Progressive disclosure** — Keep `SKILL.md` under 500 lines; put rubrics, schemas, and long playbooks in sibling refs one level deep.
4. **Evidence over invention** — Prefer CRM / warehouse / screenshots / transcripts; label gaps; never invent customer or metric facts.
5. **First useful output** — Resolve only blocking gaps before the first artifact; note non-blocking limits after.
6. **Customize before install** — Replace `REPLACE_WITH_*` connector placeholders; remove unused optional apps. See [connectors.md](connectors.md).

## Quick start: add a role pack

1. Create `.cursor/skills/<role-name>/SKILL.md` with YAML `name` + `description`.
2. Add focused workflow files under `references/` or sibling skills as needed.
3. Document dependency categories (CRM, Calendar, Warehouse, Browser, etc.) and which are `[Blocking]`.
4. List example prompts and expected artifacts.
5. Attribute upstream MIT material — see [ATTRIBUTION.md](ATTRIBUTION.md).

Full template and checklist: [authoring.md](authoring.md).

## Routing heuristics

- Seller / account / pipeline / meeting prep / CRM → **sales**
- Metric movement / KPI / SQL / dashboard / quantitative decision → **data-analytics**
- Prototype / UX audit / visual ideation / URL or image → code → **product-design**
- Ordinary implementation with an existing design system and no design exploration → **do not** force product-design; implement normally unless the user asks for Product Design

If unclear, ask one clarification rather than loading all three.
