# Flow and Platform Inference

## Goal

Transform a collection of screens into a defensible platform model without pretending the design contains backend facts it does not contain.

## Step 1: Build the navigation graph

Create nodes for canonical screens/states and edges for observed prototype reactions.

Edge fields:

- edge ID
- source screen ID
- source control node ID
- trigger
- action type
- destination screen ID/node ID
- overlay/back/close semantics
- evidence status

Then layer inferred edges separately.

## Step 2: Identify entry points

Use prototype flow starting points first.

Also identify visual entry candidates such as:

- sign in
- landing/dashboard
- onboarding first step
- role chooser
- deep-linked detail view

If they are not wired as flow starts, label them inferred.

## Step 3: Identify roles and actor boundaries

Signals include:

- distinct navigation shells
- role labels
- different dashboards
- approval/moderation controls
- ownership language such as My Orders vs All Orders
- organization/team switching
- user management
- access-denied or locked controls

Never infer permissions solely from the visual prominence of a button.

## Step 4: Build role-capability matrix

Example columns:

| Capability | Admin | Operator | Customer | Evidence |
| --- | --- | --- | --- | --- |
| View all records | OBSERVED | UNRESOLVED | No evidence | FIG-EV-... |

Use `No evidence` instead of inventing `No`.

## Step 5: Derive domain entities

Collect recurring nouns from:

- page titles
- tables
- cards
- forms
- filters
- status chips
- breadcrumb labels
- detail views
- empty states

For each entity, build a UI-evidenced model:

- display fields
- editable fields
- filters
- status vocabulary
- actions
- related entities
- likely ownership/actor relationships

Do not assert storage technology, API shape, or hidden fields unless another source supports them.

## Step 6: Derive state machines

When an entity appears in multiple statuses, map transitions.

Example:

```text
Draft -> Submitted -> Under Review -> Approved
                         |-> Rejected
```

Each transition must indicate:

- observed control/action
- observed destination state
- inferred transition
- missing reversal/cancellation behavior

## Step 7: User journeys

Every journey should include:

1. Actor
2. Preconditions
3. Intent/goal
4. Entry point
5. Ordered states/screens
6. Decisions
7. Data created/changed as visible in UI
8. Success state
9. Error/recovery paths
10. Unresolved gaps

Do not produce a journey that skips an unexplained state merely because the screens can be arranged in a plausible story.

## Step 8: Information architecture

Document:

- primary navigation
- secondary navigation
- route-like hierarchy
- breadcrumbs
- tabs
- persistent shells
- role-specific sections
- settings hierarchy
- modal/overlay subflows

Separate routable screens from overlays and component states.

## Step 9: Fill gaps conservatively

Use a three-column thought model:

| What Figma proves | What a working product still needs | Proposed resolution |
| --- | --- | --- |

A proposed resolution should follow the existing design language, terminology, and flow conventions.

When multiple solutions fit equally well, preserve alternatives and request product confirmation later instead of pretending there is one uniquely correct answer.

## Common inference traps

### Canvas adjacency

Frames placed side-by-side may be variants, explorations, or unrelated flows.

### Name authority

A frame called `Final Final 2` is not automatically canonical. A frame called `Old` may still be the one wired into the prototype.

### Role blending

Similar shells can conceal materially different permissions. Compare actions and data scope, not just visual structure.

### CRUD inflation

Seeing a list and detail view does not prove create/update/delete all exist.

### Backend invention

A table column called Status does not prove a specific workflow engine or database enum.

### Missing-state denial

Absence of an error state in Figma does not mean the product should not have one. It means the state is a gap.

## Build-readiness output

The platform inference phase should leave engineering with:

- route/surface map
- role-capability matrix
- journey map
- entity/state model
- feature inventory
- gap register
- unresolved decision list

That is enough to plan implementation without pretending the Figma file is a database or API specification.
