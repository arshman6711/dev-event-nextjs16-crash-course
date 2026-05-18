<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 16.2.4 App Router project (DevEvent — a hub for developer events).

## Summary of changes

- **`instrumentation-client.ts`**: Initializes PostHog using the recommended Next.js 15.3+ client instrumentation API. Includes error tracking (`capture_exceptions`), debug mode in development, and uses the `/ingest` reverse proxy path for improved ad-blocker resilience.
- **`components/PostHogProvider.tsx`**: Pure `PHProvider` wrapper that supplies PostHog React context to child components. PostHog initialization is handled entirely by `instrumentation-client.ts`.
- **`next.config.ts`**: PostHog reverse proxy rewrites (`/ingest/*` → PostHog ingestion endpoints, `/ingest/static/*` and `/ingest/array/*` → PostHog assets) and `skipTrailingSlashRedirect: true` for correct API routing.
- **`components/ExploreBtn.tsx`**: Captures `explore_events_clicked` when the user clicks the "Explore Events" CTA button.
- **`components/EventCard.tsx`**: Captures `event_card_clicked` with event metadata (`event_title`, `event_slug`, `event_location`, `event_date`) when a user clicks any featured event card.
- **`components/navbar.tsx`**: Captures `nav_link_clicked` with a `label` property on each navigation link.
- **`.env.local`**: `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set to the correct project values.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the "Explore Events" CTA button — top of the discovery funnel | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked a featured event card (includes title, slug, location, date) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link (includes label: Home, Events, Create Events) | `components/navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1598618)
- [All key interactions over time](/insights/isNpJwxH) — `event_card_clicked`, `explore_events_clicked`, and `nav_link_clicked` trends
- [Explore → Event click conversion funnel](/insights/7WfMtzMv) — conversion rate from exploring to clicking an event card
- [Event card clicks by location](/insights/jaaHncV9) — which event locations attract the most clicks
- [Navigation link clicks by label](/insights/bSDMwDok) — which nav destinations users visit most
- [Unique users engaging with events](/insights/exElfku4) — daily unique users clicking on event cards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
