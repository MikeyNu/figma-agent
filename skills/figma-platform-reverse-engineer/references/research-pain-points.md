# Researched Figma-Agent Pain Points

Last reviewed: 2026-09-28

This document converts current Figma platform constraints and observed agent failure patterns into design requirements for the skill.

## 1. Whole-frame context can exceed agent/client limits

Figma documents cases where `get_design_context` responses can exceed client token limits. Large screens can also be sparse or truncated depending on client behavior.

### Skill mitigation

- metadata before deep context
- split by visible logical child nodes
- never reason from a truncated prefix as if complete
- keep screenshots as visual reference, not structural substitute

## 2. Read calls are rate limited

Figma MCP and REST read limits vary by seat and plan.

### Skill mitigation

- cache by file version + node + purpose
- avoid repeated deep reads
- persist progress before waiting/retrying
- use targeted calls after one reconnaissance pass

## 3. Figma files are dynamically page-loaded

Plugin API access is page-sensitive and Figma discourages naive all-page loading.

### Skill mitigation

- one target page per read-only `use_figma` script
- explicit `setCurrentPageAsync`
- page-by-page ledger
- avoid unsupported bulk-loading shortcuts

## 4. The MCP output is context, not a complete product model

Figma explicitly separates what the MCP sends from what the agent must infer. It does not automatically know a team's design-system strategy or production architecture.

### Skill mitigation

- evidence categories
- design-system discovery
- platform inference as a distinct labelled phase
- no backend claims from visual data alone

## 5. Agents may choose the wrong Figma tool

Figma documents that agents sometimes need explicit prompting to use variable or design-context tools.

### Skill mitigation

- required per-phase tool sequence
- per-screen evidence bundle
- capability fallback rules

## 6. Code Connect is powerful but incomplete as whole-file evidence

Published components and code mappings can improve semantic understanding, but unpublished/local components remain important and may not appear in published-component tools.

### Skill mitigation

- published component graph plus local Plugin API inventory
- never interpret an empty published list as an empty design system

## 7. Variables access differs across APIs and plans

REST Variables APIs have plan/account requirements. The Plugin API and MCP may expose different useful surfaces.

### Skill mitigation

- use the best available official source
- preserve the exact source type in evidence
- mark unavailable token data instead of guessing

## 8. Asset URLs are temporary and exports can fail

Figma image-render endpoints may return null for non-renderable nodes. Asset URLs can expire, and tool outputs may cap discovered assets.

### Skill mitigation

- download exact assets during deep-read phase
- record provenance and checksums
- recurse to child nodes when asset lists cap
- exact reconstruction before generation

## 9. Visual fidelity can hide structural errors

A screenshot can look correct while the underlying component, variable, typography, or interaction semantics are wrong.

### Skill mitigation

- structural + visual + behavioral QA
- hard-fail conditions for wrong symbolic assets and wrong navigation

## 10. Canvas placement is not a flow graph

Designers often arrange alternatives, explorations, breakpoints, and states spatially. Adjacency is not authoritative navigation evidence.

### Skill mitigation

- prototype reactions first
- adjacency only as inference support
- orphan/unwired screens tracked separately

## 11. Hidden and archived work contaminates naive extraction

Production files often retain alternatives and deprecated work.

### Skill mitigation

- visibility and page-purpose classification
- canonical status field
- preserve hidden evidence without promoting it automatically

## 12. Long agent runs lose coherence

Long-horizon analysis is vulnerable to context pollution, lost progress, duplicate work, and forgotten uncertainty.

### Skill mitigation

- persistent run ledger
- structured evidence notes
- progressive disclosure
- resumable checkpoints
- optional specialist subagents only when they share the same ledger

## 13. Generative asset replacement creates believable wrongness

Image generators can create visually plausible substitutes that alter logos, UI glyphs, text, or semantic details.

### Skill mitigation

- generation is last resort
- exact symbolic assets are excluded from casual generation
- reconstruction spec + visual/numeric QA loop
- blocked is preferable to fake

## 14. Later PRD review creates anchoring pressure

Once an agent reads a PRD, it may reinterpret prior design evidence to fit the document.

### Skill mitigation

- freeze Figma findings first
- compare by stable IDs
- preserve disagreements instead of harmonizing them away

## 15. Client integration itself can fail

Public issue reports show cases where an MCP server is connected but the expected callable tool surface is not registered correctly in the agent client.

### Skill mitigation

- capability check before the run
- distinguish connector/tool-surface failure from Figma permissions
- do not degrade silently to screenshot-only analysis
