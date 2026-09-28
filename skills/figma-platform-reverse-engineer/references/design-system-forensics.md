# Design-System Forensics

## Goal

Recover the design system the product actually uses, then separately document normalization or improvement recommendations.

Do not clean the evidence while collecting it.

## Evidence order

Prefer:

1. bound Figma variables
2. local/published styles
3. component and variant definitions
4. Code Connect metadata
5. repeated structured values from design context
6. repeated visual values from screenshots

A raw hex value observed once is not automatically a design token.

## Brand layer

Document:

- primary and secondary marks
- monochrome/reversed variants
- clear-space behavior when evidenced
- brand colors
- display/body typefaces
- imagery style
- illustration/3D style
- icon style
- graphic motifs
- motion personality
- tone of visible microcopy

Separate exact observed rules from inferred brand guidance.

## Color system

Capture:

- primitive palette
- semantic colors
- light/dark or other modes
- background/surface hierarchy
- text colors
- borders/dividers
- status colors
- interactive states
- focus/selection colors

For each token record:

- Figma variable/style name
- mode
- resolved value
- scope/use
- aliases if visible
- sample consumers

If the file hardcodes colors inconsistently, preserve those values before proposing a semantic token set.

## Typography

Capture:

- family
- exact style/weight naming
- font size
- line height
- letter spacing
- text case
- paragraph spacing when relevant
- semantic use such as Display, H1, Body, Label, Caption

Do not infer a type scale from only one screen.

## Spacing and layout

Collect repeated:

- padding
- gaps
- container widths
- side margins
- grid columns
- breakpoints
- alignment patterns
- page shells
- safe areas for mobile

If multiple values cluster around a rhythm, document the observed values first and a normalized scale second.

## Radius, border, and elevation

Capture:

- corner radii
- border widths/styles
- separators
- shadows/effects
- overlays/backdrops
- glass/blur effects

## Component taxonomy

Organize components by function rather than raw page location:

- Actions: Button, IconButton, FAB
- Inputs: TextField, Select, Checkbox, Radio, Toggle, Upload
- Navigation: Sidebar, TopBar, Tabs, Breadcrumbs, BottomNav
- Data display: Card, Table, ListItem, Badge, Avatar, Stat
- Feedback: Alert, Toast, Progress, Skeleton, EmptyState
- Overlays: Modal, Drawer, Popover, Tooltip
- Domain components: product-specific items

For each component capture:

- component/set node ID
- local/published/remote status
- variants and properties
- states
- size options
- icon/text slots
- nested dependencies
- token bindings
- observed usages
- missing expected states

## Responsive system

Responsive behavior must be evidence-backed.

Strong evidence:

- paired desktop/tablet/mobile frames
- matching content and state across different widths
- Auto Layout/constraints consistent with resizing
- annotations describing behavior

Weak evidence:

- assuming standard breakpoints because the desktop frame is 1440 px

Document:

- breakpoint-like families
- navigation transformation
- column collapse
- table/list transformation
- modal/drawer behavior
- text wrapping
- image crop behavior
- component resize rules

## Motion system

When motion context exists, capture:

- duration
- easing
- keyframes
- stagger
- enter/exit direction
- hover/press behavior
- scroll-linked behavior

Do not invent motion because a static layout "would look good animated" in a forensic analysis. Put such ideas in recommendations.

## Accessibility audit

Check what can be proven or reasonably measured:

- color contrast where values are available
- touch target size
- visible focus state if designed
- text size
- icon-only controls and labels
- error communication beyond color
- disabled-state legibility

Missing accessibility states become gaps, not assumed implementation behavior.

## Deliverable structure

`09-design-system.md` should contain:

1. Brand foundations
2. Tokens and variables
3. Typography
4. Layout and spacing
5. Radius/border/elevation
6. Iconography and imagery
7. Motion
8. Component catalog
9. Responsive behavior
10. Accessibility findings
11. Inconsistencies
12. Proposed normalization layer
