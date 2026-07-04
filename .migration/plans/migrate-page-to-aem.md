# RMIT Homepage Migration Plan

Migrate `https://www.rmit.edu.au/` to AEM Edge Delivery Services with a faithful **content + design** migration (structure, content, and matching visual styling).

## Overview

| Item | Value |
|------|-------|
| Source URL | `https://www.rmit.edu.au/` |
| Target | AEM Edge Delivery Services (this project) |
| Scope | Content + Design (structure, content, and visual styling to match the original) |
| Working area | Project blocks, styles, and content directory |

## Approach

The migration runs as an orchestrated workflow: analyze the page, map its sections to blocks, generate the import infrastructure (parsers/transformers), import the content, then extract and apply the design so the rendered page matches the original.

## Checklist

- [ ] **Confirm scope details** — verify single-page vs. site, and confirm design-matching fidelity expectations
- [ ] **Scrape & analyze the page** — capture the RMIT homepage HTML, screenshots, metadata, and local images
- [ ] **Identify page structure** — determine section boundaries and content sequences (hero, nav, cards, feature areas, footer, etc.)
- [ ] **Survey available blocks** — inventory existing project blocks and the Block Collection to map content to blocks
- [ ] **Authoring analysis & block mapping** — decide default content vs. blocks for each sequence; define/create needed block variants
- [ ] **Generate import infrastructure** — create block parsers and page transformers for the identified structure
- [ ] **Run content import** — bundle and execute the import script to produce the AEM content
- [ ] **Preview & verify content** — render the imported page locally and compare structure against the original
- [ ] **Extract design tokens & styles** — pull computed styles (colors, typography, spacing) from the original site
- [ ] **Apply design to blocks & global styles** — write EDS-ready CSS to match the original look and feel
- [ ] **Visual critique & iterate** — compare migrated page to the original, fix styling gaps (up to a few iterations)
- [ ] **Lint & quality checks** — run linting and validate accessibility/performance basics
- [ ] **Final review** — confirm content fidelity and visual match, summarize what was migrated

## Notes & Considerations

- The RMIT homepage is complex (navigation/megamenu, hero, multiple card/feature sections, footer). Navigation and footer may warrant dedicated instrumentation passes.
- This plan covers a **single page** (the homepage). If you want the full site or additional pages/templates migrated, the plan scope will expand.
- Design matching will be done via computed-style extraction and verified visually against the original.

## Open Questions

- Should navigation (header/megamenu) and footer be fully instrumented as part of this pass, or handled separately?
- Any specific fidelity bar for the design match (pixel-close vs. close-enough brand match)?

---
*Execution requires Execute mode. Approve this plan to begin.*
