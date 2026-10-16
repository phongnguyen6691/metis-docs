---
title: The web build is a single page
summary: The web build is exported as a single page because static output opened deep links on the home page, so the host must answer index.html for every path.
component: app
type: decision
status: current
ids: []
---

# The web build is a single page

## Context

The Expo template exports the web build in `static` mode. A trial of the web build on 5 Oct 2026 showed that static mode turns each dynamic route into a file of its own, for example `w/[workspaceId]/projects/[projectId]/overview.html`, so opening a deep path directly lands on the wrong page, the home page. Single-page mode together with a server that answers `index.html` for every path opens the right page [Source: trial build of 5 Oct 2026, recorded in section 2 of the foundation spec and in the foundation plan].

## Decision

- The web build is exported in single-page mode: `web.output` is `"single"`.
- The host of the web build must answer `index.html` for every path of the app.

## Consequences

- A deep path opened directly shows the right page.
- The page draws nothing before the JavaScript bundle has finished running. This weighs on the goal of 2 seconds on phones, which is measured again once the interface exists.
- Where the real web build runs is an open question before the web release: the service has to return `index.html` for every path of the app, including codes that contain dots such as `wbs/item-1.1.1`, and it is not yet decided which service that is or who configures it.
- It rules out the `static` output of the template for the web build.

## Status

Current, decided by the owner on 5 Oct 2026 with the foundation spec (FE-16), and confirmed by the foundation plan that the owner approved on 6 Oct 2026 (FE-17).

## Sources

- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): line 68 of the original (the single-page mode and the reason), and line 717 (the open question on the host).
- [Foundation plan](../../history/plans/2026-10-05-frontend-foundation.md): lines 101 to 106 of the original (the measurement and the trade-off).
