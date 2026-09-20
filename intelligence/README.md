# Intelligence Engine — Phase 3

Phase 3 implements the standalone decision contracts for research routing, OpenRouter access, spend enforcement, reusable evidence packs, content generation, independent QA, quarantine, and continuity checks. Live provider calls are disabled by default and require runtime credentials plus explicit enablement.

Research is amortized: research topics/evidence packs, not individual posts. Generator cannot approve itself. HIGH_STAKES content cannot publish on stale/unapproved evidence. HUMAN_REVIEW is quarantined without interrupting the owner by default.
