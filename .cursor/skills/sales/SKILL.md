---
name: sales
description: Runs evidence-grounded sales workflows—meeting prep, call follow-up, account signals, deal strategy, forecast review, competitive briefs, business cases, quotes, coaching, prioritization, and CRM enrichment. Use for seller, prospect, account, opportunity, pipeline, forecast, or CRM-backed requests.
---

# Sales

Practical seller workflows adapted from [openai/role-specific-plugins/plugins/sales](https://github.com/openai/role-specific-plugins/tree/main/plugins/sales). Prefer evidence from CRM, calendar, transcripts, email, and docs over web guesses.

## Audience

Sellers and sales leaders—not engineers. Use plain language. Explain judgment calls. Put the user in control of material decisions.

## Shared practices

1. Resolve `[Blocking]` dependencies (or equivalent pasted context) before the first artifact.
2. Gather from the strongest source of truth first (usually ~~CRM for account/opportunity truth).
3. Ship a first useful output quickly; state limitations; offer one next step.
4. Never invent wins, quotes, forecast numbers, or stakeholder positions.
5. Prefer batch clarifying questions only when the answer would materially change the artifact.

For pack authoring and connector rules, see `.cursor/skills/role-specific-plugins/`.

## Dependency categories

| Category | Role |
| --- | --- |
| ~~CRM | Account, opportunity, contact, pipeline truth |
| ~~Calendar | Meeting identity and attendees |
| ~~Meeting Transcripts | Decisions, objections, coaching evidence |
| ~~Email / Messaging | Follow-up context and draft destinations |
| ~~Knowledge & Files | Plans, decks, enablement |
| ~~Sales Intelligence | Enrichment and signals |

Mark a category `[Blocking]` only inside a focused workflow when the first output cannot proceed honestly without it (e.g. calendar when the meeting must be discovered).

## Route by intent

| User intent | Workflow | Primary artifact |
| --- | --- | --- |
| Prep for customer/prospect meeting(s) | `prepare-for-meeting` | Meeting brief or daily digest |
| After a completed call | `follow-up-after-call` | Recap, actions, email/CRM drafts |
| What changed on an account / watchlist | `analyze-account-signals` | Evidence-backed brief + actions |
| Strategy for one active deal/renewal | `plan-deal-strategy` | Deal map + sequenced next steps |
| Forecast / commit / pipeline risk | `review-forecast` | Manager-ready rollup |
| Which accounts to work now | `prioritize-accounts` | Ranked action view |
| Competitive guidance | `build-competitive-brief` | Comparison + objection handling |
| ROI / value narrative | `build-business-case` | Assumptions, scenarios, proof gaps |
| Verbatim customer proof | `find-customer-quotes` | Quotes with provenance |
| Rep coaching from calls | `get-rep-call-feedback` / `review-rep-call-trends` | Coaching moments + trends |
| Who/what internal source to use | `find-key-internal-sources` | Ranked experts/docs + first ask |
| Fill firmographic/contact gaps | `enrich-company-and-contact-data` | Enrichment table |
| Broad “what can you do?” | orientation | Short catalog + 2–3 starter prompts |

If several apply, pick the narrowest workflow that produces the user’s primary artifact. Do not answer from this router alone when a focused row matches.

## Default workflow shape

1. **Clarify** — meeting/account/deal identity; time window; audience for the artifact.
2. **Gather** — CRM → transcripts/email → docs → enrichment only if needed.
3. **First output** — artifact + confidence + missing sources.
4. **Next step** — one offer (refine, connect a source, draft outreach, create a follow-up automation prompt).

## Output defaults

- Lead with the decision or action the seller should take.
- Cite evidence lightly inline (source system + date when known).
- Separate **Verified** / **Inferred** / **Unknown**.
- Append limitations and how installing or pasting a source would improve the answer.
