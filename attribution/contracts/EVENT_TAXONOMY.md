# Attribution Event Taxonomy
Required source keys on every accepted event: `src_creator`, `src_platform`, `src_experiment`, `src_icp`, `src_franchise`, `src_cta`.
Accepted events: `creator_landing`, `content_click`, `lead_started`, `lead_completed`, `email_captured`, `tool_started`, `checkout_started`, `purchase_completed`, `qualified_lead`.
The collector deliberately excludes names, emails, phone numbers, addresses, free-form form contents, payment data, IP-derived identity, and document contents. `properties` is allowlisted to destination/session/value/currency/product/vertical/path/referrer_host.
`event_id` is required. Server dedupe is `SHA-256(event:event_id)` and persistence uses insert-ignore semantics.
