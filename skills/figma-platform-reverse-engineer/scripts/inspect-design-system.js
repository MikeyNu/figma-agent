// Read-only helper for Figma `use_figma`.
// Replace __PAGE_ID__ with a real page ID to include local components from that page.

const PAGE_ID = "__PAGE_ID__";

const page = await figma.getNodeByIdAsync(PAGE_ID);
if (!page || page.type !== "PAGE") {
  throw new Error(`Expected PAGE node for ${PAGE_ID}`);
}
await figma.setCurrentPageAsync(page);

function safeJson(value) {
  return JSON.parse(JSON.stringify(value));
}

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const paintStyles = await figma.getLocalPaintStylesAsync();
const textStyles = await figma.getLocalTextStylesAsync();
const effectStyles = await figma.getLocalEffectStylesAsync();
const gridStyles = await figma.getLocalGridStylesAsync();

const variableCollections = collections.map(c => ({
  id: c.id,
  name: c.name,
  defaultModeId: c.defaultModeId,
  modes: c.modes.map(m => ({ modeId: m.modeId, name: m.name })),
  variableIds: [...c.variableIds]
}));

const variableRecords = variables.map(v => ({
  id: v.id,
  key: v.key,
  name: v.name,
  description: v.description,
  collectionId: v.variableCollectionId,
  resolvedType: v.resolvedType,
  remote: v.remote,
  hiddenFromPublishing: v.hiddenFromPublishing,
  scopes: [...v.scopes],
  valuesByMode: safeJson(v.valuesByMode),
  codeSyntax: safeJson(v.codeSyntax)
}));

function styleBase(style) {
  return {
    id: style.id,
    key: style.key,
    name: style.name,
    description: style.description,
    remote: style.remote
  };
}

const styles = {
  paint: paintStyles.map(s => ({ ...styleBase(s), paints: safeJson(s.paints) })),
  text: textStyles.map(s => ({
    ...styleBase(s),
    fontName: safeJson(s.fontName),
    fontSize: s.fontSize,
    lineHeight: safeJson(s.lineHeight),
    letterSpacing: safeJson(s.letterSpacing),
    textCase: s.textCase,
    textDecoration: s.textDecoration
  })),
  effect: effectStyles.map(s => ({ ...styleBase(s), effects: safeJson(s.effects) })),
  grid: gridStyles.map(s => ({ ...styleBase(s), layoutGrids: safeJson(s.layoutGrids) }))
};

function componentSummary(node) {
  const record = {
    id: node.id,
    type: node.type,
    name: node.name,
    description: node.description,
    visible: node.visible
  };

  const ownsDefinitions = node.type === "COMPONENT_SET" ||
    (node.type === "COMPONENT" && (!node.parent || node.parent.type !== "COMPONENT_SET"));

  if (ownsDefinitions && "componentPropertyDefinitions" in node) {
    record.componentPropertyDefinitions = safeJson(node.componentPropertyDefinitions);
  }

  if (node.type === "COMPONENT" && "variantProperties" in node) {
    record.variantProperties = safeJson(node.variantProperties);
  }

  return record;
}

const componentSets = page.findAllWithCriteria({ types: ["COMPONENT_SET"] }).map(componentSummary);
const components = page.findAllWithCriteria({ types: ["COMPONENT"] }).map(componentSummary);

return {
  page: { id: page.id, name: page.name },
  variableCollections,
  variables: variableRecords,
  styles,
  componentSets,
  components
};
