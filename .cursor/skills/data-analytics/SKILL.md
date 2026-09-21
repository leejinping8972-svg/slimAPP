---
name: data-analytics
description: Answers product and business questions with quantitative evidence—metric diagnostics, KPI design, recommendations, data quality, validation, charts, dashboards, reports, and notebooks. Use when the task needs metrics, SQL/warehouse data, dashboards, KPIs, or decisions grounded in structured evidence.
---

# Data Analytics

Quantitative workflows adapted from [openai/role-specific-plugins/plugins/data-analytics](https://github.com/openai/role-specific-plugins/tree/main/plugins/data-analytics).

## Eligibility

Use this skill only when the answer needs structured records, numeric measures, metric definitions, or a decision grounded in such evidence.

Do **not** route here for pure drafting, slide formatting, code fixes, or qualitative product design with no data interpretation—even if the user says “report” or “dashboard.”

## Shared practices

1. Discover sources live; treat known table names as candidates, not authority.
2. Reproduce the metric before explaining it.
3. Separate verified drivers from hypotheses.
4. Prefer inspectable artifacts (SQL, notebook, chart, dashboard, report) over opaque claims.
5. If a required source of truth is missing, stop that path and ask for access or a reviewed fallback—do not silently substitute weaker data as equivalent.

For pack authoring, see `.cursor/skills/role-specific-plugins/`.

## Route by intent

| User intent | Workflow | Notes |
| --- | --- | --- |
| Missing framing / owners / recent changes | `gather-business-context` | Then continue to the analysis skill |
| Save/update semantic layer or data context | `create-data-context` | Durable source map for later work |
| Why a metric moved / anomaly | `metric-diagnostics` | Quantify pattern before drivers |
| Define KPIs, targets, guardrails | `design-kpis` | Ownership + measurement plan |
| Decision / prioritization / tradeoff | `product-business-analysis` | Pair with `build-report` unless waived |
| Trust / grain / freshness / conflicting sources | `analyze-data-quality` | |
| Review methodology before sharing | `validate-data` | |
| Charts / visual QA | `visualize-data` | |
| Monitoring scorecard | `build-dashboard` | |
| Durable narrative deliverable | `build-report` | |
| Multi-step SQL/Python investigation | `jupyter-notebooks` | |
| TAM / market opportunity sizing | `market-sizing` | |
| Recurring KPI pack | `kpi-reporting` | |

Staged requests (“first collect context, then recommend”) must continue past intake into the analysis skill—and load `build-report` when the primary skill is `product-business-analysis`, `metric-diagnostics`, `kpi-reporting`, or `market-sizing`, unless the user waives the report.

## Metric diagnostics skeleton

1. Define metric meaning, window, population, grain, controlling source.
2. Validate definition and source conflicts.
3. Establish the quantified pattern.
4. Choose the smallest driver cuts that could explain it.
5. State verified / likely / unresolved / next checks.

## Recommendation skeleton

1. Frame the decision and constraints.
2. Gather business + data context.
3. Show evidence tied to options.
4. Recommend with assumptions, risks, and what would change the call.

## Output defaults

- Answer first, then evidence.
- Show definitions (filters, grain, time zone) beside numbers.
- Label uncertainty and data-quality caveats.
- Offer one next step (deeper cut, dashboard, validation, semantic-layer update).
