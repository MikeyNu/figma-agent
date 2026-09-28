# Asset Recovery and Regeneration Pipeline

## Goal

Recover every material static visual asset with provenance and sufficient fidelity for implementation.

## Asset classes

Classify each asset:

- `LOGO_OR_BRAND_MARK`
- `UI_ICON`
- `ILLUSTRATION`
- `PHOTO`
- `THREE_D_RENDER`
- `BACKGROUND_OR_TEXTURE`
- `CHART_OR_INFOGRAPHIC`
- `AVATAR_OR_CONTENT_IMAGE`
- `DECORATIVE_VECTOR`
- `VIDEO_OR_ANIMATION`
- `OTHER`

## Manifest fields

Every asset gets:

- asset ID
- source file/page/node
- asset class
- visible uses
- original dimensions/aspect ratio
- expected format
- transparency requirement
- extraction method
- local path when downloaded
- checksum when practical
- regeneration status
- QA status
- notes

## Recovery order

Always follow this order.

### 1. Design-context asset URL

If `get_design_context` already returns an exact asset source, use it promptly.

### 2. Original image fill

Use `download_assets` raw image output when possible. Original bytes are preferable to screenshots or re-exports.

### 3. Exact SVG/vector export

Use SVG assets for logos, icons, and simple illustrations when available.

### 4. Configured node export

Use the node's Figma export settings when they exist.

### 5. Targeted child export

When a parent subtree hits asset limits or mixes several visuals, identify and export the exact child node.

### 6. Exact reconstruction from structured geometry

Use Figma vector/node data for deterministic reconstruction when possible.

### 7. Generative regeneration

Only after every exact recovery route fails.

## Never use generation as a shortcut

Generative AI is inappropriate as the first choice for:

- logos and brand marks
- exact UI glyphs
- text-bearing assets
- QR codes/barcodes
- certification marks
- compliance graphics
- screenshots of third-party products
- data-bearing charts where exact values matter

For these, exact reconstruction or an unresolved asset is preferable to a plausible fake.

## Regeneration specification

Before generation, create an `ASSET-RECON-SPEC` containing:

- target dimensions
- aspect ratio
- alpha/background requirement
- composition and crop
- silhouette
- object count
- subject placement
- palette and dominant colors
- material and texture
- lighting direction and softness
- perspective/camera angle
- depth of field
- shadows/reflections
- edge softness
- intended UI context
- elements that must not be changed

Use the highest-resolution Figma screenshot or export as reference input when the generation tool supports image conditioning.

## Iterative QA loop

1. Generate candidate.
2. Place candidate at the exact target dimensions.
3. Compare against the Figma reference visually.
4. Run `scripts/visual_diff.py` when aligned raster references are available.
5. Inspect silhouette, crop, palette, contrast, edges, transparency, and local detail.
6. Write a specific correction prompt based on measured mismatch.
7. Repeat until the acceptance gate passes or the attempt budget is exhausted.

Do not use vague loops such as "make it closer".

## Parity acceptance

An asset passes only if:

- dimensions/aspect ratio are correct
- no required object is missing
- no extra object changes meaning
- transparency/background is correct
- silhouette and visual mass align
- palette and contrast align
- perspective/crop align
- text, logo, or symbolic meaning has not mutated
- it works in the target UI slot at actual size

Numeric metrics are supporting evidence, not the sole acceptance criterion.

## Naming

Use deterministic names:

```text
FIG-AST-001-logo-primary.svg
FIG-AST-014-dashboard-empty-illustration.webp
FIG-AST-027-auth-background.png
```

## Deduplication

When practical:

- hash downloaded bytes
- record duplicate asset IDs that reference the same bytes
- keep one canonical file with usage references

Do not dedupe merely because two assets look similar.

## Failure state

If regeneration cannot meet parity, mark:

`BLOCKED_ASSET_RECOVERY`

Keep the reference screenshot/node ID and explain exactly why the asset is unresolved.
