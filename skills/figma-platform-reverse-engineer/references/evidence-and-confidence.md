# Evidence and Confidence Model

## Purpose

This model prevents an agent from silently turning visual guesses into product facts.

Every substantive finding should have:

- a stable finding ID
- status: `OBSERVED`, `INFERRED`, `PROPOSED`, or `UNRESOLVED`
- evidence references
- confidence: `HIGH`, `MEDIUM`, or `LOW`
- affected screens/roles/entities
- contradiction references when relevant

## Evidence classes

Use these evidence classes in descending practical authority for the question they answer.

### E1: Explicit prototype behavior

Examples:

- flow starting point
- click/tap/hover reaction
- navigate action
- overlay action
- back/close action
- variable-setting action
- conditional action

Best for proving intended navigation and interaction behavior.

### E2: Structured Figma node and component data

Examples:

- node hierarchy
- component/instance relationship
- component properties
- variant values
- frame overflow behavior
- visibility
- auto layout
- bound variables

Best for proving composition, reuse, state mechanics, and layout intent.

### E3: Variables, styles, libraries, Code Connect

Best for proving design-system intent, semantic tokens, published component semantics, and code-component identity.

### E4: High-fidelity design context

Best for detailed screen composition, text, layout, token usage, and static asset references.

### E5: Screenshot/render evidence

Best for proving visual appearance, relative placement, visible state, clipping, hierarchy, and final rendering.

A screenshot is weaker evidence for hidden structure, exact token identity, prototype behavior, and component inheritance.

### E6: Repeated cross-screen pattern

Examples:

- same sidebar across six screens
- same entity status vocabulary across a list and detail view
- consistent CTA progression across several states

Useful for inference, but not equivalent to explicit prototype wiring.

### E7: Product-pattern reasoning

Examples:

- proposing a confirmation state for a destructive action
- proposing password reset because login exists but recovery does not

This can only support `PROPOSED` findings unless independent Figma evidence exists.

## Confidence rules

### HIGH

Use when at least one direct, authoritative signal proves the finding, or several independent signals strongly agree.

Examples:

- a button has an explicit Navigate reaction to a destination frame
- a variable named `color/text/primary` is bound to text across the product
- an Admin-only sidebar and Admin-labelled dashboard are both present

### MEDIUM

Use when evidence is consistent but indirect.

Examples:

- a screen likely represents an approval detail view because the list action, title, status controls, and adjacent confirmation state align, but no prototype link is wired

### LOW

Use when the conclusion depends mostly on convention, naming, visual adjacency, or incomplete evidence.

Low-confidence findings must never be phrased as settled product behavior.

## Contradiction handling

When evidence conflicts:

1. create a conflict ID such as `FIG-CON-001`
2. preserve all contradictory sources
3. identify whether one source is likely stale, hidden, archived, or a responsive/state variant
4. do not silently choose a winner
5. if a provisional choice is needed for a build-readiness recommendation, mark that choice `PROPOSED`

## Evidence references

Use compact references that survive later comparison:

```text
FIG-EV-001 page=Checkout node=123:456 source=prototype-reaction
FIG-EV-002 page=Checkout node=123:789 source=get_design_context
FIG-EV-003 page=Checkout node=123:789 source=screenshot
```

When possible, also keep the original Figma URL or construct a selection link from known file/node IDs.

## Assumption laundering check

Before publishing a document, search for language such as:

- "the system will"
- "users can"
- "this action sends"
- "the backend stores"
- "the platform automatically"

For every such statement, ask:

1. Is it directly observed?
2. Is it inferred?
3. Is it merely proposed?

Relabel or rewrite anything that overstates certainty.
