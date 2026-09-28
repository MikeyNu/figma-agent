# Error Recovery and Resume Protocol

## General rule

Preserve verified progress. Diagnose before retrying. Narrow the failing operation instead of restarting the audit.

## Missing node-specific URL

Whole-file analysis does not require a node-specific URL at the beginning.

Use file-level metadata to discover pages and node IDs.

Only tools that require a concrete node should receive one.

## `get_design_context` too large or truncated

1. Stop using the partial response as complete evidence.
2. Fetch metadata for the target node.
3. Identify visible logical children.
4. Request design context for those child IDs.
5. Reassemble the screen evidence bundle from complete child reads plus screenshot.

Do not guess the missing tail.

## Sparse design context

Correlate returned hierarchy IDs with the screenshot, then deep-read the relevant visible children.

## 403 / permission error

Check:

- authenticated Figma identity
- file permission for that identity
- seat/plan capability when relevant
- whether the file type is supported by the requested tool

Do not assume the URL is wrong.

## 404 / missing node

Confirm:

- correct file key or branch key
- node ID formatting (`1:2` vs URL `1-2`)
- whether the node was deleted or moved
- whether the file changed since discovery

Mark stale references if necessary.

## 429 / rate limit

- persist current progress
- respect tool-provided retry timing
- avoid duplicate reads
- use cached metadata to continue offline synthesis
- reduce unnecessary high-cost calls

## Tool unavailable in the client

1. Confirm the MCP connection/tool surface.
2. Use another official Figma capability if it proves the same fact.
3. Use read-only `use_figma` if available and appropriate.
4. Mark unsupported evidence as blocked.

Do not silently switch to screenshot-only guessing.

## Asset export returns null or missing source

Try:

1. smaller child node
2. raw image-fill extraction
3. SVG/vector export
4. node export
5. exact reconstruction
6. generative fallback if appropriate

Record which methods failed.

## Asset list cap reached

Split the subtree and run targeted asset recovery on children. Do not assume the first capped list contains all assets.

## Hidden or 0-opacity node cannot render

Use structured node evidence. If visual recovery is needed, do not mutate the source merely to make it render unless the user explicitly authorizes a temporary copy/workspace.

## File changed mid-run

If source metadata indicates a material change:

- record the old and new version markers
- identify pages/nodes analysed before the change
- revalidate changed or uncertain areas
- do not mix old and new screenshots without labelling them

## Partial tool success

Some returned data may be valid even when another element fails.

Persist successful evidence before retrying the failed subset.

## Resume protocol

At the start of a resumed session:

1. load `run-state.json`
2. load screen and evidence indexes
3. verify source file/branch identity
4. verify source version when possible
5. inspect `unresolved` and `blocked`
6. continue from the earliest incomplete completion gate
7. avoid re-fetching completed unchanged nodes

## Final blocked reporting

If the audit cannot finish, state precisely:

- what was completed
- what was blocked
- why it was blocked
- which documents are still trustworthy
- which findings depend on incomplete evidence
