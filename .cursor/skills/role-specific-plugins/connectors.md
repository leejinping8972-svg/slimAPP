# Connector configuration

Upstream connector-backed plugins declare apps in `.app.json`. Some entries use placeholders that must be replaced per workspace.

## Placeholder rule

```json
{
  "apps": {
    "salesforce": {
      "id": "REPLACE_WITH_SALESFORCE_APP_OR_CONNECTOR_ID"
    }
  }
}
```

| Placeholder | Replace with |
| --- | --- |
| `REPLACE_WITH_SALESFORCE_APP_OR_CONNECTOR_ID` | Salesforce or Agentforce Sales id available to the target workspace |

- Leave canonical shared platform connector ids and documented `templated_apps_*` registry ids unchanged.
- Do not copy app/connector ids from another workspace unless portability is documented.
- If the team does not use an optional app, remove that binding before shipping the pack.

## Cursor equivalent

Cursor rarely uses `.app.json`. Instead:

1. List dependency categories in the role `SKILL.md`.
2. Resolve each category against MCP servers / tools visible in the session.
3. Treat user uploads, pasted notes, exports, and repo files as valid category satisfaction.
4. When a `[Blocking]` category has no tool and no user context, explain the gap and ask for the smallest fallback (export, CSV, notes) before inventing facts.

## Category cheat sheet

| Category | Common providers |
| --- | --- |
| ~~CRM | Salesforce, HubSpot, Pipedrive, Zoho |
| ~~Calendar | Google Calendar, Outlook |
| ~~Meeting Transcripts | Zoom, Fireflies, Otter, Granola |
| ~~Email / Messaging | Gmail, Outlook, Slack, Teams |
| ~~Knowledge & Files | Drive, Notion, SharePoint, repo docs |
| ~~Sales Intelligence | ZoomInfo, Apollo, Clay |
| ~~Warehouse / BI | Snowflake, BigQuery, Databricks, Metabase, Hex |
| ~~Product Analytics | Amplitude, Mixpanel, Statsig |
| ~~Browser / Design | Browser tools, Figma, local screenshots |
| ~~Hosting | Vercel, Netlify, static preview, Sites-like tools |
