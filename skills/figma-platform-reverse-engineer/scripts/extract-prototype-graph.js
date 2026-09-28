// Read-only helper for Figma `use_figma`.
// Replace __PAGE_ID__ with a real PageNode ID returned by Figma.
// Returns prototype reactions plus normalized destination IDs.

const PAGE_ID = "__PAGE_ID__";

const page = await figma.getNodeByIdAsync(PAGE_ID);
if (!page || page.type !== "PAGE") {
  throw new Error(`Expected PAGE node for ${PAGE_ID}`);
}

await figma.setCurrentPageAsync(page);

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function topLevelContainer(node) {
  let current = node;
  let last = node;
  while (current && current.parent && current.parent.type !== "PAGE") {
    last = current.parent;
    current = current.parent;
  }
  const candidate = current && current.parent && current.parent.type === "PAGE" ? current : last;
  return candidate && candidate.type !== "PAGE"
    ? { id: candidate.id, type: candidate.type, name: candidate.name }
    : null;
}

function collectDestinationIds(value, out = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectDestinationIds(item, out);
    return out;
  }
  if (!value || typeof value !== "object") return out;

  for (const [key, child] of Object.entries(value)) {
    if ((key === "destinationId" || key === "destinationNodeId") && typeof child === "string") {
      out.add(child);
    }
    collectDestinationIds(child, out);
  }
  return out;
}

const reactionNodes = page.findAll(node => (
  "reactions" in node && Array.isArray(node.reactions) && node.reactions.length > 0
));

const interactions = reactionNodes.map(node => {
  const reactions = plain(node.reactions);
  const destinationIds = [...collectDestinationIds(reactions)];
  const container = topLevelContainer(node);

  const record = {
    sourceNode: { id: node.id, type: node.type, name: node.name },
    sourceTopLevel: container,
    destinationIds,
    reactions
  };

  if ("overflowDirection" in node) record.overflowDirection = node.overflowDirection;
  if ("overlayPositionType" in node) record.overlayPositionType = node.overlayPositionType;
  if ("overlayBackgroundInteraction" in node) {
    record.overlayBackgroundInteraction = node.overlayBackgroundInteraction;
  }

  return record;
});

return {
  page: { id: page.id, name: page.name },
  flowStartingPoints: page.flowStartingPoints.map(x => ({ nodeId: x.nodeId, name: x.name })),
  prototypeStartNode: page.prototypeStartNode
    ? { id: page.prototypeStartNode.id, type: page.prototypeStartNode.type, name: page.prototypeStartNode.name }
    : null,
  interactionNodeCount: interactions.length,
  interactions
};
