---
title: Every response is validated, and every failure is a named state
summary: The app checks each API response with zod and turns every failure into a named state, never a thrown error or a silently wrong screen.
component: app
type: decision
status: current
ids: []
---

# Every response is validated, and every failure is a named state

## Context

The back end does not exist in the first wave, so nothing guarantees that an answer has the shape a screen expects. A wrong shape that is drawn anyway gives a wrong screen that nobody notices. The client also meets network errors, time-outs, status codes it does not know and malformed data, and none of them may reach a screen as an unnamed exception.

The code review of 9 Oct 2026 added a second force: the project header was typed from the overview contract and always marked the Overview tab, so each later tab (Charter, WBS, Plan, Governance, Focus) would have had to call the overview API to draw its own header, or keep a copy.

## Decision

- The API contract is written with zod, and the app checks every API response against it at run time. Data of the wrong shape becomes a clear error and never a silently wrong screen. The contract is also what is handed to the back end.
- Data flow: the screen calls the hook of the screen with the workspace and project codes; the hook calls the client in `src/core/api/`; the client takes the absolute API address from `src/platform/config`, sends the request and checks the response against the zod contract; valid data goes through `model.ts` into a display model, which the screen draws with design-system components.
- The client never throws an unnamed error to a screen. Each failure comes back as a named error: network, time-out, not signed in, no permission, not found, server, or wrong shape with the name of the wrong field. `ApiError` is exported.
- Each named error maps to a state of the screen:
  - 401 is the session-expired state, shown as a dialog.
  - 403 is the no-permission state: an explanatory sentence, a "Request access" action and a "Back to My focus" link, as in the wireframe of the access states (screen 43).
  - 404 is the not-found state, with the sentence "Project not found".
  - A server, network or time-out failure is one shared "could not load" state with a "Try again" button.
  - A wrong shape is an error that names the wrong field.
  - Loading is a sentence and a labelled spinner.
- "Request access" and "Sign in again" have no target yet, so they are text with the label "Not built yet".
- The overview is one call, `GET {apiBase}/workspaces/{workspaceId}/projects/{projectId}/overview`. The response carries the project header, the metric snapshots, the breakdowns (by status, by Category and by person), the attention lists and the computed health with its reasons. Each attention list carries a total and its first rows, and the number of rows never exceeds the total, so a "more" line cannot show a negative number.
- Initials of people are sent by the server and not derived by the app, because no client rule is right for every order of names.
- The response carries the IANA time zone of the workspace (`timeZone`), and every time on the screen is shown in that zone, because the BRD (section 12.1) computes "today" in the workspace time zone. Timestamps are UTC with a trailing Z. The contract rejects a time zone that `Intl` does not know.
- Every contract of a project page extends `projectPageSchema` of `src/core/api/project.ts`, which holds the time zone and the project header (`project`, contract `projectHeaderSchema`: name, customer, PM, stage with name, order and total, declared health, framework with name and version, baseline with version and date or empty, and the last-saved time). The overview contract is `projectPageSchema.extend(...)`. Each page reports its own tab, and the header marks that tab.
- Data carries only codes and user content. The labels of codes live in the dictionary of the screen.

## Consequences

- Wrong data shows as a named error and not as a wrong screen, and the error names the field.
- Every later tab draws its own header and times from its own response and needs nothing from the overview response.
- Server, network and time-out failures are not told apart on screen. The wording of the six states, and where "Request access" and "Sign in again" lead, are questions for the owner, asked at the review of screen 24; the sentences in the app are drafts until then.
- The metric figures inside a response follow [The app never computes a metric or a drill filter](metrics-are-server-snapshots.md), and the contract itself is the one thing shared with the back end ([The API contract is the only coupling between app and back end](api-contract-only-coupling.md)).

## Status

Current. The owner approved checking every response with zod with the first part of the design on 5 Oct 2026 (FE-06). The state mapping is set by the overview-screen plan, taken under FE-21 (R-B15, D-B15). The project page contract is the as-built result of the code clean-up (FE-27, FE-28).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 127 to 130 of the original (the zod contract, approved as FE-06).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 144 to 155 and 172 to 202 of the original (the data flow, the failure states, the contract of the overview), and line 707 (the open question on the states).
- [Foundation plan](../../history/plans/2026-10-05-frontend-foundation.md): lines 69 to 72 of the original (the named errors of the client).
- [Overview screen plan](../../history/plans/2026-10-06-frontend-overview-screen.md): lines 198 to 201 (R-B15) and 285 to 289 (D-B15) of the original.
- [Code review report](../../history/code-review/report.md): lines 209 to 217 of the original (the project header coupled to the overview contract).
