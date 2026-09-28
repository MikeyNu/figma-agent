# Research Sources

Last reviewed: 2026-09-28

This skill is grounded in current public documentation and agent-reliability guidance. Maintainers should re-check these sources when Figma MCP or Plugin API behavior changes.

## Figma MCP

- Figma MCP introduction: https://developers.figma.com/docs/figma-mcp-server/
- Tools and prompts: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/
- Rate limits and access: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/
- Write to canvas: https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/
- Add custom rules: https://developers.figma.com/docs/figma-mcp-server/add-custom-rules/
- Known MCP client issues: https://developers.figma.com/docs/figma-mcp-server/mcp-clients-issues/
- MCP vs agent responsibilities: https://developers.figma.com/docs/figma-mcp-server/mcp-vs-agent/
- Figma MCP guide repository: https://github.com/figma/mcp-server-guide

## Figma REST and Plugin API

- REST introduction: https://developers.figma.com/docs/rest-api/
- File endpoints: https://developers.figma.com/docs/rest-api/file-endpoints/
- REST rate limits: https://developers.figma.com/docs/rest-api/rate-limits/
- Variables endpoints: https://developers.figma.com/docs/rest-api/variables-endpoints/
- REST node types: https://developers.figma.com/docs/rest-api/file-node-types/
- Plugin API reference: https://developers.figma.com/docs/plugins/api/api-reference/
- PageNode and flow starting points: https://developers.figma.com/docs/plugins/api/PageNode/
- Node reactions: https://developers.figma.com/docs/plugins/api/properties/nodes-reactions/
- Working with variables: https://developers.figma.com/docs/plugins/working-with-variables/

## Agent reliability and evaluation

- OpenAI evaluation best practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices
- OpenAI agent workflow evaluation: https://developers.openai.com/api/docs/guides/agent-evals
- Anthropic context engineering for agents: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Anthropic building effective agents: https://www.anthropic.com/research/building-effective-agents
- Anthropic agent eval guidance: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

## Practical failure reports and complementary work

These are supporting signals, not normative specifications.

- Official Figma design-to-code skill: https://github.com/figma/mcp-server-guide/blob/main/skills/figma-design-to-code/SKILL.md
- Example reports of large MCP output truncation and downstream design loss should be treated as a reminder to use progressive disclosure and verify complete evidence.
