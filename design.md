# Design — luckdate / ChatViva Slim

A locked design system for this Flutter app. Every visual redesign reads this
file before emitting UI changes. Do not regenerate a new theme per page —
extend or amend this file when the system needs to grow.

/* Hallmark · genre: editorial · design-system: design.md · designed-as-app
 * locked: brand colors · logo · super symbol · Sunny avatar · interaction flows
 */

## Locked (do not change)

- **Brand colors** — all `LuckdateColors` hex values in `mobile/lib/app/theme/luckdate_theme.dart`
- **Logo** — `assets/images/logo.png` / brand wordmark usage
- **Super symbol** — project super-symbol asset usage
- **Sunny IP** — `LdSunnyAvatar` / sunny mood assets and character behavior
- **Functional interaction** — routes, taps, auth/order/plan/chat flows, copy intent

## Genre

editorial (soft vitality brand — paper-led, restrained accent)

## Macrostructure family

- Marketing / launch pages: Letter-leaning asymmetric copy column (Welcome already)
- App shell pages: Workbench — header → primary surface → secondary lists
- Chat: Conversational — avatar + bubble stack, actions as full-width controls

## Theme (locked colour map)

Paper / ink / accent map onto existing Flutter tokens — **values must not drift**:

| Role | Flutter token |
|------|----------------|
| paper | `cloudIvory` `#FFF9F5` |
| paper-2 / surface | `ivoryWhite` `#FFFFFF` |
| ink | `textPrimary` `#2C3A2E` |
| ink-2 | `textSecondary` `#7A6E62` |
| rule | `lineSoft` `#E8DFD4` |
| accent | `deepSage` `#5E6B45` |
| accent soft | `sageSoft` `#E8EFE0` |
| secondary accent | `sunGold` `#D4A853` (≤ 5% viewport) |

## Typography

- Family: **Montserrat** only (project font — locked)
- Display / H1: w600–w700, tighter tracking (−0.3 to −0.6)
- Body: w400, 15 / 22
- Caption / tab: w500–w600, slight +tracking
- **No italic headers**

## Spacing

4-point scale via `LuckdateSpacing` (xs 4 → xxl 32). Prefer named tokens; avoid magic numbers in new UI.

## Radius (redesigned)

| Token | Value | Use |
|-------|-------|-----|
| control | 14 | buttons, inputs, chips |
| md | 12 | small surfaces |
| lg | 16 | bubbles, medium cards |
| xl | 18 | primary cards (was 20+) |
| sheet | 24 | bottom sheets |
| pill | 999 | handles / true pills only (rare) |

Prefer **control** over full pill for primary CTAs.

## Depth

- Default cards: hairline border + **no** heavy drop shadow (or soft 0/1px only)
- Elevate only for floating sheets / composers
- No glassmorphism, no multi-layer glow

## Motion

- Short: 200–220ms; ease soft out
- Nav selection: opacity / colour crossfade only
- Respect reduced-motion where available

## CTA voice

- Primary: fill `deepSage`, label white, radius **control**, height 52
- Secondary: ivory fill, soft rule border, ink label, same radius/height rhythm
- Selected chips: sage fill + white label (same family)

## Microinteractions

- Silent success preferred (SnackBar only when needed)
- Focus: sage ring / border 1.5 on inputs
- Chat action buttons: full-width, stacked, easy tap targets (≥ 48)

## Per-page allowances

- Marketing (Welcome): may keep lifestyle photo + brand lockups
- App pages: no decorative enrichment; function carries the page
- Chat: Sunny avatar unchanged; bubble chrome may refine

## What pages MUST share

- Colour tokens above
- Montserrat
- Logo / super symbol / Sunny assets
- CTA voice (control radius + sage primary)
- Bottom nav destinations and labels

## What pages MAY differ on

- Section padding and list density
- Card vs flush rows
- Header alignment within shell
- Local illustration placement (not replacing Sunny)

## Flutter mapping

- Tokens live in `mobile/lib/app/theme/luckdate_theme.dart`
- Shared chrome in `mobile/lib/core/widgets/ld_components.dart` + `ld_shell.dart`
