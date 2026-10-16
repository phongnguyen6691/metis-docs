---
title: One app, no multi-package workspace
summary: The front end is one app with no multi-package workspace and no path alias, and a package is split out only when a second consumer exists.
component: app
type: decision
status: current
ids: []
---

# One app, no multi-package workspace

## Context

In the first round the CSS of the design system sat outside the root of the app, so Tailwind scanned the wrong place and lost layout classes: the 4 Oct 2026 spec recorded that switching off two source-declaring lines made the class `h-9` produce 0 pixels.

The review of the provisional web stack proposed splitting the domain package into four (`domain`, `metrics`, `authz`, `editor-core`) and renaming the API client package `data-access`. The disposition accepted it with an adjustment: a package is created when it has its first user, not eight empty packages on the first day, because an empty package is a maintenance debt and `nx` adds a package with little effort. The package boundaries are still declared beforehand by import rules, so the rules do not wait for the packages.

## Decision

- The front end is one app. Its folder is `apps/metis/` (the brainstorm first called it `apps/web`); in the four-repository layout that folder becomes the root of `metis-app`.
- There is no multi-package workspace and no path alias.
- A package is split out only when a second place needs it; the example given is a server.
- The design system is a folder of the app, `src/design-system/`, and not a package. A lint rule forbids it from importing the rest of the app, and every text it shows comes through a required prop.
- The folders of `src/` are `app/` (the route files of Expo Router, which only connect the shell and the screens), `core/` (plain TypeScript: API contract, client, translation layer, formatting, route table), `design-system/` (base components, the generated `tokens.ts`, stories), `platform/` (storage, API address, file download, external links, starting the mock server), `shell/` (the application frame and the parts shared by every screen), `screens/<id>/` (one folder per screen: the contract, the screen, the model files and the dictionaries) and `mocks/` (mock data and handlers, used only in development and in tests). `e2e/` holds the browser and native flows and `scripts/` the generators, the gates and the verify command. What each folder may import is the subject of [Plain core, shared shell, layers enforced by lint](layers-enforced-by-lint.md).

## Consequences

- No empty package exists, and no path alias hides where a file comes from.
- The structure inside the app is held by lint rules and not by package boundaries.
- The design system's styles live inside the app root, which removes the cause of the lost layout classes.
- It rules out a pnpm or Nx workspace of several packages at this stage. A package appears when a second consumer does, for instance a server.

## Status

Current, decided by the owner on 5 Oct 2026 (FE-06 with FE-09, the approval of the first part of the design and of the common base).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 131 to 137 of the original (one app, no workspace, the design system folder, the reason).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 87 to 109 of the original (the folder layout and the rule on packages).
- [Front-end stack review disposition](../../history/reviews/review-disposition-frontend-stack.md): lines 37 and 92 of the original (create a package at its first user).
- [Metis repositories and central documentation design](../../proposals/2026-10-11-repos-and-docs-design.md): the first row of section 6.1 (the app folder becomes the repository root).
