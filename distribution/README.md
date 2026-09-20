# Phase 5 — Distribution

Creator Network owns distribution. Existing portfolio repositories are never mutated.

## Contract
A publish job is created only after QA PASS and a valid media/content package. Capacity is reserved before research/render spend. Each virtual employee has an isolated Buffer account configuration and secret reference. No API key is stored in Git.

Lifecycle: DRAFT -> RESERVED -> SCHEDULED -> SENT | RETRY_WAIT | QUARANTINED. Publication is not considered successful until Buffer reports the post in `sent` state.

Unsupported or unsafe platform automation fails closed. The system may preserve or reschedule an asset; it may not browser-automate around a provider restriction.
