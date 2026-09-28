# Strict Parity QA

## Principle

"Looks close" is not a test.

Use multiple QA channels because each catches different classes of failure.

## 1. Structural QA

Verify:

- page/frame identity
- node hierarchy where relevant
- screen dimensions
- component/instance relationships
- variant/state identity
- Auto Layout/constraints when relevant
- variable/style bindings
- prototype reactions
- asset callsites

## 2. Visual QA

Compare source screenshots and recovered/reconstructed outputs at matched dimensions.

Inspect:

- overall composition
- alignment
- whitespace
- sizing
- typography
- line wrapping
- colors
- borders
- shadows
- radii
- icon geometry
- image crop
- overlays
- clipping
- scroll regions

## 3. Behavioral QA

For each documented user journey:

- validate each observed prototype edge
- check destination identity
- check overlay vs navigation semantics
- check back/close behavior
- check state changes
- record missing/error paths

## 4. Coverage QA

Required counters:

```text
pages_discovered
pages_classified
eligible_screens
screens_deep_read
prototype_reaction_nodes
prototype_reaction_nodes_mapped
material_assets
assets_recovered
assets_regenerated
assets_blocked
components_inventoried
variables_styles_inventoried
unresolved_conflicts
unresolved_gaps
```

Do not round coverage to 100% if blocked items exist.

## 5. Automated image diff

Use `scripts/visual_diff.py` when raster source and candidate are aligned.

The script reports:

- image dimensions
- normalized mean absolute RGB error
- percentile error
- fraction of pixels above error thresholds
- alpha error
- simple edge-overlap signal

Image-diff numbers are not universal truth. Font rasterization, antialiasing, color profiles, and renderer differences can produce harmless pixel differences. Use the metrics to localize and quantify mismatch, then visually inspect.

## 6. Hard-fail conditions

Regardless of average image score, fail parity when:

- a visible asset is missing
- the wrong icon/glyph is used
- a logo or text-bearing image is mutated
- dimensions/aspect ratio are wrong
- important copy is missing or changed
- key states are collapsed or omitted
- navigation destination is wrong
- a role sees the wrong capability in the documented model
- a generated asset changes product meaning

## 7. Component consistency QA

Check repeated components for:

- same token usage
- same radius and spacing
- consistent text style
- consistent icon sizing
- state naming
- variant completeness

Record inconsistent local overrides instead of silently treating them as one system value.

## 8. Responsive QA

When multiple breakpoints exist, compare equivalent states across widths.

Check:

- navigation transformation
- column stacking
- hidden/reordered content
- table behavior
- modal/drawer transformation
- text wrap
- image crop
- touch target changes

Do not infer responsive behavior solely by scaling a desktop screenshot.

## 9. Documentation QA

Before finishing:

- every stable ID is unique
- all links between docs resolve
- every `INFERRED` or `PROPOSED` item is labelled
- all conflicts are referenced
- traceability rows point to real finding IDs
- no temporary Figma asset URL is the only durable asset reference
- file/version metadata is recorded

## 10. Final status

Allowed final statuses:

- `PASS_COMPLETE`
- `PASS_WITH_DOCUMENTED_GAPS`
- `PARTIAL_BLOCKED`
- `FAILED_QA`

Never use `PASS_COMPLETE` when required scope is still blocked or unanalysed.
