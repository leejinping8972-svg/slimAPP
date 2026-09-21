# Role catalog

Source of truth for workflows: [openai/role-specific-plugins](https://github.com/openai/role-specific-plugins). Condensed for Cursor routing.

## Sales

**Use for:** meeting prep, call follow-up, account signals, deal strategy, forecast review, competitive briefs, business cases, customer quotes, rep coaching, account prioritization, company/contact enrichment, CRM-backed context.

**Example prompts:**
- Prep me for my next customer meeting
- Turn my latest call into a follow-up package
- Which accounts should I focus on this week?
- Build a competitive brief for Acme vs Competitor Alpha

**Focused skills (upstream names):** `prepare-for-meeting`, `follow-up-after-call`, `analyze-account-signals`, `plan-deal-strategy`, `review-forecast`, `build-competitive-brief`, `build-business-case`, `find-customer-quotes`, `get-rep-call-feedback`, `review-rep-call-trends`, `find-key-internal-sources`, `prioritize-accounts`, `enrich-company-and-contact-data`, `sales-company-research`, plus connector helpers (`salesforce`, `hubspot`, `zoominfo`, `apollo`).

**Typical sources:** CRM, calendar, meeting transcripts, email/Slack, docs/Drive, sales intelligence.

## Data Analytics

**Use for:** metric diagnostics, KPI design, product/business recommendations, data quality, validation, visualization, dashboards, reports, notebooks, market sizing, semantic-layer / data-context setup.

**Example prompts:**
- Diagnose why retention dropped last week
- Design KPIs for onboarding activation
- Build a dashboard for weekly growth review
- Validate this analysis before I share it

**Focused skills (upstream names):** `gather-business-context`, `create-data-context`, `metric-diagnostics`, `design-kpis`, `product-business-analysis`, `analyze-data-quality`, `validate-data`, `visualize-data`, `build-dashboard`, `build-report`, `jupyter-notebooks`, `kpi-reporting`, `market-sizing`, and related delivery helpers.

**Typical sources:** warehouses (Snowflake/BigQuery/Databricks), BI, product analytics, spreadsheets, docs, semantic layers.

**Eligibility:** Require structured records, numeric measures, or quantitative evidence. Do not route here for pure formatting, prose reports, or code fixes with no data interpretation.

## Product Design

**Use for:** design exploration, UX research, flow audits, visual ideation, URL/image → prototype, design QA, sharing prototypes. Not ordinary implementation unless explicitly invoked.

**Example prompts:**
- Turn this product idea into three visual directions
- Clone this URL into an editable prototype
- Audit this onboarding flow for UX and a11y issues
- Research the biggest UX problems users report for X

**Focused skills (upstream names):** `user-context`, `get-context`, `research`, `ideate`, `image-to-code`, `url-to-code`, `audit`, `design-qa`, `share`.

**Typical sources:** screenshots, Figma/Canva, live URLs, design tokens, Storybook, brand assets, browser capture.

**Hard rule:** For new builds without a visual target, show three visual options and wait for a choice before scaffolding or coding.
