---
title: Prefer mature, supported components
summary: Stability and long-term support rank first, with an organization behind each component and a published support policy when possible.
component: all
type: decision
status: current
ids: []
---

# Prefer mature, supported components

## Context

On 5 Oct 2026 the owner said that many internal agent functions would be added to the app later, so the back end needed a more stable framework (FE-10). [Source: backend brainstorm log, line 17 of the original]

On 10 Oct 2026 the owner pressed the point (BE-10). Hono and zod are quite new, while this is an enterprise project whose architecture must be stable and supported for a long time. The owner asked whether that can be guaranteed, why Java, Python or Node.js with NestJS had not been considered, and asked for an objective debate that need not follow the owner's own view. [Source: backend brainstorm log, line 196 of the original]

The log answers with an objective assessment that includes the weak side of the earlier proposal. Hono, a thin and recent framework, is a real weakness for an enterprise core that must live over five years: it has no published long-term support policy and few conventions for a large team, and the earlier "build your own frame" core pushed the burden of conventions onto code written in-house. zod is different: the front end already uses it as its contract, so it stays. The assessment ends with a principle that the log proposes for the enterprise core. [Source: backend brainstorm log, lines 198, 199 and 201 of the original]

## Decision

Decided by the owner:

- Stability and long-term support rank first among the criteria for the back end. The owner asked for a stable architecture with long-term support (BE-10), and the backend proposals record this as the owner's order of priority. [Source: backend brainstorm log, line 196; backend proposals, line 20 of the original]
- The same order of priority asks for an organization behind each component and a published support policy when possible. [Source: backend proposals, line 20 of the original]

Proposed by the log, not decided by the owner:

- For the core of an enterprise product, prefer components that have run in production for years, have an organization or a company behind them and publish a support policy. [Source: backend brainstorm log, line 201 of the original]
- Use a young component only at the edge, where replacing it takes little effort. [Source: backend brainstorm log, line 201 of the original]

## Consequences

- The log applies the priority to Hono, which it judges a weakness for the core, and to zod, which it keeps because the front end already uses it as its contract. [Source: backend brainstorm log, lines 199 and 201 of the original]
- The log's principle also reopened Better Auth against Keycloak and DBOS against Temporal. [Source: backend brainstorm log, line 201 of the original] This record does not say how those two were settled; see the draft records [Keycloak 26 for sign-in, with a magic-link authenticator](identity-keycloak.md) and [Temporal for workflows, schedules and agent runs](durable-workflows-temporal.md).
- The priority shaped the choice of language, see [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](backend-language-java-spring-boot.md).
- If the owner adopts the log's principle, each choice for the core has to be justified by how long the component has run in production, who stands behind it and what support policy it publishes.
- Open: the log records no result for BE-10, so the principle waits for the owner's ruling. [Source: backend brainstorm log, line 204 of the original]

## Status

Current for the owner's priority, a stable architecture with long-term support, which the owner stated on 10 Oct 2026 (BE-10). BE-10 is logged as being debated, with no result (lines 196 and 204 of the log). The backend proposals state this order of priority as the owner's, and the owner then chose Java 25 with Spring Boot 4 (BE-12). The log's principle, years in production and young components only at the edge, is a proposal and is not decided.

## Sources

- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 17, 196, 198, 199, 201 and 204 of the original (BE-10).
- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: line 20 of the original, up to its first two clauses (stability and long-term support first, an organization behind each component and a published support policy when possible).
- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): entry FE-10.
