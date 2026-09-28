# Documentation Specification

## Objective

Produce human-readable documents and machine-readable indexes that can support implementation, audit, and later PRD comparison.

## Stable ID namespaces

Use these defaults:

- Screens: `FIG-SCR-###`
- Interactions: `FIG-INT-###`
- Journeys: `FIG-JNY-###`
- Flows: `FIG-FLOW-###`
- Features: `FIG-FEAT-###`
- Roles: `FIG-ROLE-###`
- Entities: `FIG-ENT-###`
- Components: `FIG-CMP-###`
- Design tokens: `FIG-TOK-###`
- Assets: `FIG-AST-###`
- Gaps: `FIG-GAP-###`
- Conflicts: `FIG-CON-###`
- Evidence: `FIG-EV-###`
- Decisions/recommendations: `FIG-DEC-###`

IDs must remain stable after first publication. Do not renumber because a row was deleted.

## Default document set

### `00-analysis-index.md`

- source Figma URL
- file/branch identity
- audit date
- current source version marker if available
- scope
- coverage metrics
- final status
- document links
- blocked areas

### `01-figma-file-map.md`

- page inventory
- page classification
- top-level sections/frames
- WIP/archive notes
- responsive/design-system locations

### `02-screen-inventory.md`

One row per canonical screen/state.

Required fields:

- ID
- page
- node ID
- name
- state family
- role/audience
- responsive family
- canonical status
- evidence status

### `03-platform-model.md`

Explain the product's purpose and major surface areas using Figma evidence only.

Separate observed product model from proposed completion work.

### `04-roles-and-permissions.md`

- role inventory
- evidence for each role
- role-capability matrix
- unresolved permissions

### `05-user-journeys.md`

One section per `FIG-JNY`.

### `06-flow-and-state-model.md`

- flow graph summaries
- state machines
- interaction table
- unreachable/dead-end findings

### `07-information-architecture.md`

- global navigation
- route hierarchy
- tabs/subnavigation
- overlays/modals
- settings structure

### `08-domain-and-feature-inventory.md`

- entity glossary
- visible entity fields
- statuses/lifecycle
- feature list
- CRUD evidence without inventing operations

### `09-design-system.md`

Use the structure from `design-system-forensics.md`.

### `10-asset-manifest.md`

Human-readable asset summary plus link to machine-readable manifest.

### `11-gap-and-conflict-register.md`

Keep gaps and contradictions explicit.

### `12-evidence-ledger.md`

Map evidence IDs to source page/node/tool and finding IDs.

### `13-build-readiness-spec.md`

- implementation scope implied by Figma
- route inventory
- shared shells
- component backlog
- domain/state requirements
- missing product decisions
- blockers
- recommended build order

Do not turn proposals into mandatory requirements without labelling them.

### `14-qa-report.md`

- coverage
- visual QA
- asset QA
- flow QA
- design-system QA
- documentation QA
- unresolved blockers
- final status

### `traceability-matrix.csv`

Recommended columns:

```text
finding_id,type,title,status,confidence,page,node_id,evidence_ids,related_ids,notes
```

This is the primary bridge for later PRD comparison.

## Writing rules

- Use concrete names from the design.
- Keep evidence references near claims.
- Avoid prose that hides uncertainty.
- Prefer tables for inventories and mappings.
- Preserve direct design terminology even when proposing cleaner terminology separately.
- Do not use a proposed backend architecture as if Figma proved it.
