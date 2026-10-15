---
name: product-design
description: Explores and prototypes product ideas—UX research, flow audits, visual ideation, URL/image-to-prototype, design QA, and sharing. Use when the user wants design exploration, faithful visual cloning, audits/critique, or prototypes—not ordinary implementation unless Product Design is explicitly requested.
---

# Product Design

Design-to-prototype workflows adapted from [openai/role-specific-plugins/plugins/product-design](https://github.com/openai/role-specific-plugins/tree/main/plugins/product-design).

## When this applies

Use for `@Product Design`, explicit Product Design asks, or work mainly about exploration, audits, research, critique, faithful source cloning, or shareable prototypes.

A request is **not** Product Design merely because it mentions UI, CSS, or a prototype. Ordinary implementation inside an existing codebase/design system proceeds as normal engineering unless the user asks for Product Design.

## Communication

Warm, collaborative, pithy. Prefer short progress notes over long process narration.

## Critical rules

1. **Match existing product language** — Inside an existing app, reuse flows, components, tokens, and styles; do not invent a parallel design system.
2. **No visual target, no build** — For new app/prototype/redesign without URL, screenshot, Figma, mock, or code target: clarify the brief, generate **exactly three** visual directions, wait for a choice, then build. “Just build it” does not waive this.
3. **Clone means match** — For URL/image clone requests, capture the source first; never “improve” typography, color, radius, or layout while claiming fidelity.
4. **Core experience must work** — Primary navigation, CTAs, and main-task inputs use realistic mock data; peripheral controls may be visual-only.
5. **Real assets** — No ASCII/emoji/CSS-art fakes for meaningful imagery; use source assets or image generation sized to the slot.
6. **Evidence for audits** — Screenshot (or open) the flow before reporting UX/a11y findings.

## Route by intent

| User intent | Workflow | Stop condition |
| --- | --- | --- |
| Setup / save product & design sources | `user-context` | No scaffolding on setup-only asks |
| Clarify brief before ideate/build | `get-context` | Playback assumptions, then continue |
| User pain / UX research scan | `research` | Source-grounded findings |
| Three visual directions | `ideate` | Wait for selection |
| Selected mock → UI | `image-to-code` | Faithful responsive implementation |
| Live URL → local prototype | `url-to-code` | Capture first; then clone |
| Audit / critique a flow | `audit` | Screenshot-backed findings (skip get-context first) |
| Compare prototype vs visual target | `design-qa` | Internal QA before handoff |
| Publish share link | `share` | User picks host target |

### Sequencing notes

- Named skill → load that skill; do not substitute a “related” one.
- Audit + build in one ask → `audit` first, then the build path.
- “Like \<URL\>” / redesign → `get-context` + screenshots into `ideate`, not silent clone.
- Exact clone of a URL → `url-to-code` directly.

## Build handoff

After a prototype build:

1. Lead with how to open/run it (URL or local command).
2. Offer tightening or more functionality.
3. One short share nudge if a deploy path exists.

## Local prototype preference

Prefer a small Vite/HTML prototype or the repo’s existing frontend stack when editing in-product. Run preflight (install, start, smoke the main path) before claiming it works.

For pack authoring and upstream attribution, see `.cursor/skills/role-specific-plugins/`.
