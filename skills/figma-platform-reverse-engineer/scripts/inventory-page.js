// Read-only helper for Figma `use_figma`.
// Replace __PAGE_ID__ with a real PageNode ID returned by Figma.
// Load the figma-use skill before executing this through use_figma.

const PAGE_ID = "__PAGE_ID__";
const MAX_TEXT_SAMPLES = 250;
const MAX_TEXT_CHARS = 180;

const page = await figma.getNodeByIdAsync(PAGE_ID);
if (!page || page.type !== "PAGE") {
  throw new Error(`Expected PAGE node for ${PAGE_ID}`);
}

await figma.setCurrentPageAsync(page);

const allNodes = page.findAll(() => true);
const countsByType = {};
let hiddenCount = 0;
let reactionNodeCount = 0;
let instanceCount = 0;
let componentCount = 0;
let componentSetCount = 0;

for (const node of allNodes) {
  countsByType[node.type] = (countsByType[node.type] || 0) + 1;
  if ("visible" in node && node.visible === false) hiddenCount += 1;
  if ("reactions" in node && Array.isArray(node.reactions) && node.reactions.length > 0) {
    reactionNodeCount += 1;
  }
  if (node.type === "INSTANCE") instanceCount += 1;
  if (node.type === "COMPONENT") componentCount += 1;
  if (node.type === "COMPONENT_SET") componentSetCount += 1;
}

function nodeSummary(node) {
  const summary = {
    id: node.id,
    type: node.type,
    name: node.name,
    visible: "visible" in node ? node.visible : true,
    childCount: "children" in node ? node.children.length : 0
  };

  if ("x" in node) summary.x = node.x;
  if ("y" in node) summary.y = node.y;
  if ("width" in node) summary.width = node.width;
  if ("height" in node) summary.height = node.height;
  if ("locked" in node) summary.locked = node.locked;
  if ("opacity" in node) summary.opacity = node.opacity;
  if ("layoutMode" in node) summary.layoutMode = node.layoutMode;
  if ("reactions" in node && Array.isArray(node.reactions)) {
    summary.reactionCount = node.reactions.length;
  }

  return summary;
}

const topLevel = page.children.map(nodeSummary);

const textNodes = page.findAllWithCriteria({ types: ["TEXT"] }).slice(0, MAX_TEXT_SAMPLES);
const textSamples = textNodes.map(node => ({
  id: node.id,
  name: node.name,
  visible: node.visible,
  text: node.characters.slice(0, MAX_TEXT_CHARS),
  truncated: node.characters.length > MAX_TEXT_CHARS
}));

const sections = page.findAllWithCriteria({ types: ["SECTION"] }).map(nodeSummary);
const frames = page.findAllWithCriteria({ types: ["FRAME"] }).map(nodeSummary);
const components = page.findAllWithCriteria({ types: ["COMPONENT"] }).map(nodeSummary);
const componentSets = page.findAllWithCriteria({ types: ["COMPONENT_SET"] }).map(nodeSummary);

return {
  page: {
    id: page.id,
    name: page.name,
    flowStartingPoints: page.flowStartingPoints.map(x => ({ nodeId: x.nodeId, name: x.name }))
  },
  counts: {
    totalDescendants: allNodes.length,
    hidden: hiddenCount,
    reactionNodes: reactionNodeCount,
    instances: instanceCount,
    components: componentCount,
    componentSets: componentSetCount,
    byType: countsByType
  },
  topLevel,
  sections,
  frames,
  components,
  componentSets,
  textSamples
};
