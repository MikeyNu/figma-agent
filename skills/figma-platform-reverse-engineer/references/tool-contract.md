# Figma Tool Contract

## Principle

Use the least expensive tool that can answer the current question, then progressively narrow.

Do not use a high-volume design-context call when metadata or a small read-only Plugin API query will do.

## Whole-file discovery

### `get_metadata`

Use without `nodeId` to list top-level pages in a Figma Design file when supported.

Use with a concrete page/node ID to inspect the structural map before deeper calls.

Do not invent a node ID.

### `get_libraries`

Call once at the beginning, then follow `libraries_available_to_add_next_offset` until exhausted when relevant.

Library discovery does not replace local-component inspection.

### `list_file_components_for_code_connect`

Useful for the published component graph.

Limitation: local or unpublished components may not appear. Never treat an empty published list as proof that the file contains no components.

## Deep design inspection

### `get_design_context`

Use on concrete canonical screen or component nodes.

Required discipline:

- load the Figma design-to-code prerequisite skill first
- keep the screenshot enabled unless there is a strong context reason not to
- if response is sparse, truncated, or oversized, use metadata to split the target into smaller visible child nodes
- never build conclusions from the truncated leading portion while ignoring the missing tail

### `get_screenshot`

Use for a visual source of truth.

Increase `maxDimension` when small typography, icons, subtle states, or asset parity need close inspection.

A screenshot is not a substitute for structured design context.

### `get_variable_defs`

Use on representative nodes to resolve variable names and values actually used by the design.

Prefer variables/styles over reverse-engineering raw pixel values.

### `get_motion_context`

Use after design context when a node contains intentional motion or keyframe animation.

### `get_code_connect_map`

Use when mappings exist and component semantics matter.

Code Connect is strong evidence for a design node's code identity, not proof that the whole file is correctly implemented.

## Programmatic inspection with `use_figma`

Load `figma-use` before every call.

Default this skill to read-only JavaScript.

Important operating constraints:

- pages are dynamically loaded
- use `await figma.setCurrentPageAsync(page)` when switching pages
- switch to at most one target page per script
- do not use unsupported shortcuts such as `loadAllPagesAsync`
- return structured JSON data with `return`
- do not use `console.log` as the result channel
- keep scripts focused and deterministic

For correctness, prefer sequential page inspection unless the active Figma guidance explicitly guarantees safe parallel read execution in the current client.

## Asset recovery

### `download_assets`

Use it to obtain:

- exported render of a node
- original source images in image fills
- SVG assets for vector layers

Important constraints:

- raw images and SVG lists can be capped per call
- URLs are temporary
- recurse into smaller child nodes if a large subtree exceeds asset limits
- do not override export format/scale unless required by the task

## Rate-limit discipline

Figma MCP and REST reads may be rate limited by plan and seat type.

Mitigations:

- cache results by file version + node ID + tool purpose
- do not re-fetch unchanged nodes
- use one metadata call to plan many targeted reads
- batch only where the tool contract explicitly supports batching
- honour retry guidance on rate-limit responses
- preserve partial progress in the run ledger

## Capability fallback order

If a preferred tool is unavailable:

1. use another official Figma read surface that proves the same fact
2. use read-only `use_figma` Plugin API inspection
3. record the evidence gap
4. never substitute a visual guess for unavailable structured evidence without labelling it `INFERRED` or `UNRESOLVED`

## Authentication and permissions

If a valid link fails:

- verify the authenticated Figma identity when possible
- verify the file is accessible to that identity
- distinguish unsupported tool/file type from permissions
- do not repeatedly ask the user for the same link when the problem is authorization
