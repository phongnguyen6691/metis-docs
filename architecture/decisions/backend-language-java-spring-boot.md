---
title: The core in Java 25 LTS with Spring Boot 4; no C# or .NET
summary: The business core is written in Java 25 with Spring Boot 4, and C# and .NET are ruled out for the back end.
component: core
type: decision
status: current
ids: []
---

# The core in Java 25 LTS with Spring Boot 4; no C# or .NET

## Context

The back-end language stayed open until 10 Oct 2026. Three steps closed it.

- On 5 Oct 2026 the owner reopened the earlier choice of TypeScript on Node.js (FE-10): many internal agent functions were to follow in the app, so the back end needed a more stable framework. [Source: backend brainstorm log, line 17 of the original]
- On 10 Oct 2026 the owner ruled out C# and .NET ("I have no sympathy for C# and .NET", translated; BE-04). The draft that proposed C# on .NET 10 was dropped and TypeScript was proposed in its place. [Source: backend brainstorm log, line 151 of the original]
- The owner then challenged that proposal (BE-10): Hono and zod are quite new for an enterprise project that needs a stable architecture and long-term support, so why not Java, Python or Node.js with NestJS? The owner asked for an objective debate that need not follow the owner's own view. The log's own assessment found Hono a real weakness for an enterprise core meant to live over five years (no published long-term support policy, few conventions for a large team) and kept zod, because the front end already uses it as its contract. A check of the TypeScript library set then found seven points against the Hono on Workers set, most of them pointing toward NestJS. [Source: backend brainstorm log, lines 196, 199 and 206 of the original]

The backend proposals then compared four frameworks on facts they checked on 10 Oct 2026. [Source: backend proposals, lines 63 to 75 of the original]

| | Spring Boot | NestJS | Django | Hono |
|---|---|---|---|---|
| Behind it | The Spring team of Broadcom | Its founder and core team, a consultancy and donations | Django Software Foundation, a non-profit | One npm maintainer, who works for Cloudflare; Hono is not a Cloudflare product |
| Published support policy | Yes, with dates | None; fixes were seen for 12.x and 11.x together | Yes: LTS releases of 3 years | None found |

The proposals judge that Spring Boot comes first when stability and long-term support come first: of the four it alone has a large company behind it, a support policy with specific dates and an extra five years of enterprise support for the last minor version of each line. Django comes next, but its official page names no enterprise support and MPXJ would have to run outside the process. NestJS is the closest to the front end, since both use TypeScript, but it publishes no support policy, relies on old-style decorators with no plan to move to the standard ones, and sits in the npm ecosystem, which had the most supply-chain incidents of 2025 and 2026. [Source: backend proposals, lines 80 to 82 of the original]

Facts about the platform behind the choice:

- Java 25 is a long-term-support release. Amazon Corretto 25 lists its end of life as October 2032 [Source: aws.amazon.com/corretto/faqs, read 12 Oct 2026], and Eclipse Temurin lists Java 25 as supported at least until Sep 2031 [Source: adoptium.net/support, read 12 Oct 2026].
- Spring publishes a support policy: a minimum support period for each minor release, and an additional five-year enterprise support period for the last minor version of a major version [Source: spring.io/support-policy, read 12 Oct 2026].

## Decision

- The business core is written in Java 25, a long-term-support release, with Spring Boot 4. In BE-12 the owner asked to focus only on Java. [Source: backend brainstorm log, lines 220 and 222 of the original]
- C# and .NET are not used for the back end. [Source: backend brainstorm log, line 151 of the original]
- The front end stays TypeScript. The two sides meet only in the OpenAPI 3.1 contract, from which the front end generates its zod schemas; see [The API contract is the only coupling between app and back end](api-contract-only-coupling.md) and [The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`](api-contract-flow.md). [Source: backend proposals, line 90 of the original; repositories design, section 4.5]

## Consequences

- The runtime and the framework both have dated support, and the Keycloak, Temporal and MPXJ of the proposals belong to the same Java ecosystem; those components are drafts, see [Keycloak 26 for sign-in, with a magic-link authenticator](identity-keycloak.md), [Temporal for workflows, schedules and agent runs](durable-workflows-temporal.md) and [The core's libraries](core-libraries.md). [Source: backend proposals, line 80 of the original]
- The proposals name four weak points of Spring Boot and offset each one. [Source: backend proposals, lines 87 to 90 of the original]
  - The MCP SDK for Java is at Tier 2, while the one for TypeScript is at Tier 1 [Source: modelcontextprotocol.io/docs/sdk, read 12 Oct 2026]. The proposals therefore put the MCP gateway in TypeScript; the named alternative is the MCP server of Spring AI.
  - springdoc-openapi is maintained by its community, not by the Spring team [Source: springdoc.org, read 12 Oct 2026]. The generated OpenAPI file is stored in the repository and checked in CI, so the generator can be replaced without changing the contract.
  - The JVM uses memory: the proposals size each Java container at no less than 1 vCPU and 2 GB.
  - The front end stays TypeScript, so the contract goes through OpenAPI 3.1 and zod is generated with orval or Kubb.
- The proposals put the MCP endpoint in a separate TypeScript gateway, a draft: see [A thin, stateless MCP gateway in TypeScript](mcp-gateway-typescript.md). If that proposal is adopted, the back end has two languages, Java for the core and TypeScript for the gateway. [Source: backend proposals, line 87 of the original]
- C# and .NET are ruled out. The NestJS, Hono and Django options were compared and not chosen for the core.
- The owner's priority, stability and long-term support first, is recorded in [Prefer mature, supported components](component-selection-stability.md).

## Status

Current, decided by the owner on 10 Oct 2026 (BE-04 and BE-12). BE-04 ruled out C# and .NET; BE-12 settled the back end on Java 25 with Spring Boot 4. The components around the core, such as the MCP gateway, are proposals in their own draft records.

## Sources

- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 17, 151, 196, 199, 206, 220 and 222 of the original (BE-04, BE-10, BE-12).
- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 63 to 75, 77 to 82, 84 to 88 and 90, and the first clause of line 89, of the original.
- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): entry FE-10.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): section 4.5 and the owner decision RD-07.
- Pages read on 12 Oct 2026: spring.io/support-policy, aws.amazon.com/corretto/faqs, adoptium.net/support, modelcontextprotocol.io/docs/sdk and springdoc.org.
