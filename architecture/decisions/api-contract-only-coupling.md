---
title: The API contract is the only coupling between app and back end
summary: No app criterion depends on the back-end language, the API contract is all the two sides share, and the app regenerates its zod schemas from the core's OpenAPI file once that exists.
component: all
type: decision
status: current
ids: []
---

# The API contract is the only coupling between app and back end

## Context

The first back-end decision (BD-01, in `spec/backend-brainstorm-log.md`, kept in the owner's private store) was a TypeScript core on Node: the server would import the same business packages as the front end, and the front end's mock would use the same code. The first wave of the new front end builds no back end (see [Prove one screen end to end before building more](acceptance-screen-first.md)).

On 5 Oct 2026 the owner reopened that decision (FE-10). The owner was not sure that the back end would use TypeScript or Node: the app folder had been deleted and the front end rewritten from scratch, the back end would be redone in the same way, and many internal agent functions were to be added to the app later, so a more stable framework was needed for the back end, to be designed afterwards.

## Decision

- BD-01 no longer binds the front end. The back end is designed after the front end (FE-10).
- No front-end criterion may depend on the language of the back end (FE-10). The criterion of sharing TypeScript with the back end was dropped from the platform comparison for that reason.
- The API contract is the only coupling between the two sides. While the back end does not exist, the contract the app writes in zod in `src/core/api/` is the handover: the data carries only codes and user content, the display labels of codes live in the screen dictionaries, and the detailed shapes are written in `src/core/api/` while building.
- Once the core publishes its OpenAPI file (`contract/openapi.json`, OpenAPI 3.1), the app regenerates its zod schemas from it and runs its checks (RD-07). The way the file reaches the app is described in the decision [The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`](api-contract-flow.md).

## Consequences

- The back-end language and framework are chosen on their own merits, and the app does not change with that choice. The choice is made in its own decision, [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](backend-language-java-spring-boot.md).
- Neither side relies on code shared with the other: the server does not import the front end's business packages, and the front end's mock does not use server code.
- All the risk of the coupling sits in the contract. A stale contract fails the build of the core, and a breaking change is flagged before it merges, because app versions already on phones keep calling the old shape [Unverified - confirm before applying] (section 4.5 of the repositories design).
- Screens call the API as they would call a real server, so a real server can replace the mock without changing a screen (see [Screens call the real API; a mock server answers in mock builds only](mock-server-behind-real-api.md)).

## Status

Current, decided by the owner on 5 Oct 2026 (FE-10). The step by which the app regenerates its schemas from the core's OpenAPI file was approved by the owner on 11 Oct 2026 with section 4 of the repositories design (RD-07).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 49 and 88 to 91 of the original (FE-10 and the reopening of BD-01).
- [Cross-platform research](../../history/specs/2026-10-05-cross-platform-research.md): lines 27 to 30 of the original (the criterion dropped, the zod contract as the handover).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 200 to 202 of the original (what the data carries, the contract as the handover).
- [Metis repositories and central documentation design](../../proposals/2026-10-11-repos-and-docs-design.md): section 4.5 and the owner decision RD-07 (section 4 approved).
