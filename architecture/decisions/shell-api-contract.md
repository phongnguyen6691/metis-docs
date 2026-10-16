---
title: The shell has its own endpoint
summary: The frame gets its data from one call, GET /workspaces/{workspaceId}/shell, with a contract of its own that is separate from the call of the overview screen.
component: app
type: decision
status: current
ids: []
---

# The shell has its own endpoint

## Context

The first version of the API contract described one call, the one for the overview screen, `GET {apiBase}/workspaces/{workspaceId}/projects/{projectId}/overview`. The frame around every screen (the sidebar, the top bar, the workspace menu, the project tree, the notification count) needs data of its own, the spec had no call for it, and the shell must not import `src/mocks`.

## Decision

The shell has its own contract, `src/core/api/shell.ts`, and its own call:

`GET {apiBase}/workspaces/{workspaceId}/shell`

The response is `{ user: { name, initials }, tenant: { name }, workspace: { id, name }, workspaces: { id, name }[], nav: { home, portfolio, workspace }, tree, notifications }`.

- `user` gives the name and the initials of the person, and `tenant` gives the name of the tenant.
- `workspace` and `workspaces` give the current workspace and the list that the workspace menu shows.
- Each entry of `nav` is `{ code, badge: { count, alert } | null, planned: 'V2' | 'V3' | null }`. Its `code` is one of the 15 codes of `NAV_CODES`. The three groups of `nav` are the three groups of the sidebar.
- `tree` is portfolio, program and project (`{ id, name }`), and it is also the source of the names in the location path.
- `notifications` is the notification count.

The split of work: the label of a code lives in the dictionary of the shell, and the path of a code lives in the route table. The server only chooses which items show, in which order, with which counts, and with the release label.

## Consequences

- If the back end wants another shape, only the shell changes.
- The back end has not confirmed the shape. The spec asks the question to the back-end team before it builds the shell, and until then the mock server answers with exactly this shape (see [Screens call the real API; a mock server answers in mock builds only](mock-server-behind-real-api.md)).
- The shell call is the second call of the API contract, which is what the front end hands to the back end (see [The API contract is the only coupling between app and back end](api-contract-only-coupling.md)).

## Status

Current, a ruling of plan B taken under FE-21 (R-B2). The back end has not confirmed the shape yet (spec section 13).

## Sources

- [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md): R-B2 (lines 142 to 149 of the original) and the as-built note for section 3.5 of the spec (lines 19465 to 19469).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the first call of the contract (lines 172 to 175 of the original) and the open question for the back end (line 709).
