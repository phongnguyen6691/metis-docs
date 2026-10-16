---
title: App interfaces
summary: What the app calls and exposes, the rules it expects the server to keep, the screen contract format, the files it reads from metis-docs and the questions the back end must answer.
component: app
type: reference
status: current
ids: []
---

# App interfaces

This page lists every interface of the app: the calls it makes to the API, the rules it expects the server to keep, what it exposes (routes, query parameters, identifiers, build settings and the screen contract), what it reads from `metis-docs`, and the contract flow that is planned. The cited file of `metis-app` is the source of each statement. The API does not exist yet: a mock server answers in mock builds. [The API contract](../../architecture/contract.md) describes the contract from the side of the whole system.

## What the app calls

The app makes two calls, both `GET` requests. `apiConfig` in `src/platform/config.ts` holds the base URL and the timeout. The base URL is `EXPO_PUBLIC_API_BASE`, or `https://api.metis.test` when the variable is not set; a `.test` host never resolves, so without the variable no real server is reached: a mock build gets the mock server, a release build gets the network error. The timeout is 10 seconds (`timeoutMs: 10000`), and it covers reading the body. The client sends no token and no other header (`fetch(url, { signal })` in `src/core/api/client.ts`).

| Call | Made by | Answer checked by |
|---|---|---|
| `GET {apiBase}/workspaces/{workspaceId}/shell` | The frame (`useShell`), for the workspace named in the page path, else the last workspace whose shell loaded, else the home workspace | `shellSchema` in `src/core/api/shell.ts` |
| `GET {apiBase}/workspaces/{workspaceId}/projects/{projectId}/overview`, with `?scope=mine` appended when the person chooses "My items" | Screen 24 (`useOverview`) | `overviewSchema` in `src/core/api/overview.ts` |

Rules of the client, all in `src/core/api/client.ts`:

- The ids come from the URL of the page, so each one is encoded with `encodeURIComponent`: a slash, `?` or `#` in an id cannot change the path. An id that is empty, `.` or `..` is answered as not found without any request.
- The client never throws at a screen. Every failure becomes one of the named errors below, and `problemOf` in `src/shell/model.problem.ts` turns the error into the state to draw.
- The whole-project scope sends no `scope` parameter. The name `scope=mine` is provisional ([`delayed=true` and `scope=mine` are provisional names](../../architecture/decisions/provisional-drill-parameters.md)).

| What happens | Error kind | What the screen shows |
|---|---|---|
| Status 401 | `unauthenticated` | The session expired dialog. Its action, Sign in again, is text labelled `Not built yet` |
| Status 403 | `forbidden` | The no-access panel. Its action, Request access, is text labelled `Not built yet`, and a link goes back to My focus |
| Status 404, or an id that is empty, `.` or `..` | `notFound` | The "Project not found" panel, with a link back to My focus |
| Any other status outside 2xx | `server`, with the status | The unavailable panel, with a Try again button |
| A body that is not JSON, or that a zod contract rejects | `invalid`, with the path of each wrong field (an empty path means the whole reply) | The invalid-data panel, which names the wrong fields |
| No answer from the network | `network` | The unavailable panel |
| No answer within `timeoutMs` | `timeout` | The unavailable panel |

If the shell call fails, the sidebar shows "Could not load the menu." with a Try again button, and the icon rail shows a retry button named "Could not load the menu. Try again" (`src/shell/Shell.tsx`, `src/shell/strings/en.ts`).

Sources: `src/platform/config.ts`, `src/core/api/client.ts`, `src/shell/model.problem.ts` and `src/shell/useShell.ts` of `metis-app`; [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 146 to 153 and 174 of the original; [Every response is validated, and every failure is a named state](../../architecture/decisions/validated-contracts-and-error-states.md); [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md).

## What the server must send

The mock server follows these rules, and the zod contracts reject an answer that breaks them. The core in `metis-backend` keeps them, each with a test: see [Core interfaces](../core/interfaces.md#the-answers-to-the-apps-questions). The schemas in `src/core/api/` are the exact shape; the table lists the rules that are easy to miss.

| Rule | Why | Where the app enforces it |
|---|---|---|
| Every project page contract extends `projectPageSchema`: a `timeZone` (an IANA zone that `Intl` knows) and the `project` header (name, client, project manager, stage, declared health, framework, baseline or `null`, and `savedAt`) | Each tab (Charter, WBS, Plan, Governance, Focus) draws its own header and its own times from its own answer, so it never needs the overview answer. Every time on a page follows the workspace time zone | `src/core/api/project.ts`; `overviewSchema` is `projectPageSchema.extend(...)` |
| The server sends the initials of a person: the shell's user and every row of the workload card | No rule on the client fits every naming order, and two Vietnamese names can give the same two letters | `initials` in `shellSchema` and `overviewSchema` |
| A value of a drill filter holds no comma | A link joins the values of a filter with commas, and the destination page splits them there | The `drill` schema in `src/core/api/overview.ts` |
| A time is a UTC instant ending in `Z`, and a calendar day is `YYYY-MM-DD` | The screen converts an instant to the workspace time zone | `instant` and `day` in `src/core/api/primitives.ts` |
| A list never sends more rows than its `total` | The "+ N more" count must never be negative | The `refine` calls on `attention` in `overview.ts` |
| Every metric is a snapshot with `asOf`, `definitionVersion`, `freshness` (`fresh`, `stale`, `partial` or `unknown`) and a `drill` filter named after WBS fields. The screen never counts rows and never builds a filter | BR-32 and BR-39 | `snapshot` in `overview.ts` |
| A project with no baseline sends the Delayed metric as `state: notBaselined`, and `baseline` as `null` in the header | The screen shows "Not baselined", not a number | `delayed` in `overview.ts`, `baseline` in `project.ts` |
| The data carries codes and user content only | The labels of codes live in the dictionaries of the app | All schemas of `src/core/api/` |

The target for reading the API is under 1 second at the 95th percentile. It applies to the back end; the mock server is not measured.

Sources: `src/core/api/` of `metis-app`; [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 154 to 155, 180 to 202 and 678 of the original; [Code review report](../../history/code-review/report.md), lines 209 to 217, 374 to 379 and 381 to 387 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), line 19833 of the original.

## What the app exposes

### Routes

The route table is `ROUTES` in `src/core/routes.ts`, which writes a path with `[workspaceId]` where this page writes `{workspaceId}`. The wireframe screen of each destination is `SCREENS` in the same file. Only screen 24 is built; every other destination opens its path inside the real frame on a generic "Not built yet" page that names the screen, the path and the filters it received.

| Destination | Path | Wireframe screen | Built |
|---|---|---|---|
| Overview | `/w/{workspaceId}/projects/{projectId}/overview` | 24, Project overview | Yes |
| Charter | `/w/{workspaceId}/projects/{projectId}/charter` | 25, Project charter and business case | No |
| WBS | `/w/{workspaceId}/projects/{projectId}/wbs`, with drill filters | 26, WBS Master: table view | No |
| WBS item | `/w/{workspaceId}/projects/{projectId}/wbs/{itemId}` | 28, WBS item form and activity | No |
| Plan | `/w/{workspaceId}/projects/{projectId}/plan` | 30, Project plan: timeline | No |
| Governance | `/w/{workspaceId}/projects/{projectId}/governance` | 12, Gate review | No |
| Focus | `/w/{workspaceId}/projects/{projectId}/focus` | 34, Focus: today and this week | No |
| Raise change request | `/w/{workspaceId}/projects/{projectId}/changes/new` | 32, Change requests and baseline | No |
| New project | `/w/{workspaceId}/projects/new` | 37, Create project | No |
| Executive cockpit | `/w/{workspaceId}/cockpit` | 14, Executive portfolio cockpit | No |
| Workspace dashboard | `/w/{workspaceId}/dashboard` | 15, Workspace dashboard | No |
| Registry | `/w/{workspaceId}/registry` | 16, Portfolio and project registry | No |
| Roadmap | `/w/{workspaceId}/roadmap` | 17, Portfolio roadmap | No |
| Capacity | `/w/{workspaceId}/capacity` | 18, Capacity control tower | No |
| Risk & dependencies | `/w/{workspaceId}/risk` | 19, Risk and dependency control tower | No |
| Lifecycle framework | `/w/{workspaceId}/frameworks` | 11, Lifecycle framework designer | No |
| Templates | `/w/{workspaceId}/templates` | 13, Template library | No |
| Settings | `/w/{workspaceId}/settings` | 9, Workspace settings: fields and options | No |
| My focus | `/me/focus` | 34, Focus: today and this week | No |
| Approvals | `/me/approvals` | 38, My approvals | No |
| Notifications | `/me/notifications` | 39, Notifications and preferences | No |
| Search | `/search` | 40, Search results | No |

- The root path `/` redirects to the overview of the home project: workspace `creative-studio`, project `meridian-cgi-campaign` (`HOME` in `src/platform/config.ts`). A release still opens the demo project first, until the API names a default workspace.
- A path that matches no route, and a route folder with no page of its own, open the not-found page.
- Investment, Scenarios, SteerCo and AI copilot are sidebar items without a route. They are text labelled `Planned V2` or `Planned V3`, as is Help (`Planned V2`).
- Every route file in `src/app` only reads the URL parameters and hands them to a screen.

### Query parameters

A drill-down filter travels as a query parameter. The names are the WBS field names of the BRD, and the values are the ones the server sent in the metric snapshot: the screen copies a filter and never builds one.

| Parameter | On | Meaning |
|---|---|---|
| `status`, `type`, `label`, `risk`, `category`, `pic` | The WBS destination | A drill filter named after the WBS field of the same name. The demo data uses `status=blocked`, `type=deliverable`, `label=milestone`, `risk=high` and `critical`, a `category` code and a `pic` person id |
| `delayed` (value `true`) | The WBS destination | The filter of the Delayed tile. The name is provisional, because BRD WBS-05 has no filter for "late against the baseline" |
| `scope` (value `mine`) | The overview | "My items". The client sends it to the API as `?scope=mine`. The name is provisional |

A filter with several values is written with the values joined by a comma (`risk=high%2Ccritical`). The destination page accepts a comma-joined value or a repeated key, and `filtersOf` in `src/core/routes.ts` reads both.

Sources: `src/core/routes.ts`, `src/app/` and `src/platform/config.ts` of `metis-app`; [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 251 to 280 of the original; [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md).

### Identifiers

| Identifier | Value | Where |
|---|---|---|
| App name | Metis | `expo.name` in `app.json` |
| URL scheme | `metis` | `expo.scheme` in `app.json` |
| iOS bundle identifier | `dev.metis.app` | `expo.ios.bundleIdentifier` in `app.json` |
| Android package | `dev.metis.app` | `expo.android.package` in `app.json` |

Changing the bundle identifier later makes another app in the stores, and whether `dev.metis.app` carries the right organization name is an open question ([Name, bundle id, icons and splash](../../architecture/decisions/app-identity.md)).

### Build-time settings

| Variable | Read by | Effect |
|---|---|---|
| `EXPO_PUBLIC_MOCKS` | `src/platform/mocks.web.ts` and `src/platform/mocks.ts` | `1` starts the mock server (MSW on the web, a handler layer on iOS and Android). Any other value leaves the mock code out of the bundle. `pnpm web` and `pnpm build:web:e2e` set it to `1`, and `pnpm build:web` does not |
| `EXPO_PUBLIC_API_BASE` | `src/platform/config.ts` | The base URL of the API. The default is `https://api.metis.test` |

Metro inlines an `EXPO_PUBLIC_*` variable when it bundles, so a release build drops the block that reads the flag [Source: comments in `src/platform/mocks.web.ts` and `src/platform/mocks.ts`, read 12 Oct 2026].

### What the web build stores

| Key in `localStorage` | Holds | Read by |
|---|---|---|
| `metis.locale` | The language | `src/platform/storage.web.ts`, and `public/index.html`, which sets the page language before the first paint |
| `metis.workspace` | The last workspace whose shell loaded | `src/platform/storage.web.ts` |

A browser that blocks `localStorage` opens in English and runs without memory. The iOS and Android apps store nothing: every launch opens in English (`src/platform/storage.ts`).

### Screen contracts

`src/screens/<screen>/contract.yaml` is what a screen promises. Reviewers read it, and the checks read it: the browser specs read it at run time (`e2e/web/contract.ts`) and tap every control to measure its effect, and `gate:trace` (`scripts/check-trace.mjs`) reads `requirements` and `web`. A reverse check fails when the content draws a control that the contract does not list. This is an excerpt of the contract of screen 24:

```yaml
id: 24-project-overview
route: /w/{workspaceId}/projects/{projectId}/overview
shell: app
requirements: [OVW-01, OVW-02, OVW-03, OVW-04, OVW-05, BR-24, BR-32, BR-39, D-19]
web: [OVW-01, OVW-05, BR-32, D-19]
title: { key: destinations.overview }
elements:
  - id: scope-mine
    role: tab
    nameKey: scope.mine
    effect: { kind: url, search: { scope: mine } }
  - id: tile-blocked
    role: link
    nameKey: tiles.blocked
    effect: { kind: route, to: 26, search: { status: blocked } }
```

| Key | Meaning |
|---|---|
| `id` | The folder name of the screen |
| `route` | The path of the screen, with `{workspaceId}` and `{projectId}` |
| `shell` | The frame the screen sits in (`app`) |
| `requirements` | The BRD ids the screen promises. `gate:trace` fails when no running test of the screen names one of them |
| `web` | The ids among them that need a running browser spec in `e2e/web/<screen>/`, because only a browser lays the web page out |
| `title` | The dictionary key of the screen title |
| `elements` | The controls the content draws |
| `states` | The states of the screen |
| `responsive` | The layout in each width tier |

Each element has an `id` (the `testID`; an id ending in `*` covers the controls built from data, named by the data), a `role` (`link`, `button` or `tab`), a name (`nameKey`, a text of the screen dictionary or else of the shell dictionary, or `nameFrom: data`), an optional `targets` (`pointer`: drawn only on the web from tablet width; `touch`: drawn only with touch targets; absent: both) and an `effect`. There are four kinds of effect and no other. A control that cannot declare one is not built.

| Effect | What the control does | Fields |
|---|---|---|
| `route` | Goes to another screen, given by its number in the wireframe manifest | `to`, and `search` (a fixed filter) or `searchFrom: drill` (the server's filter) |
| `url` | Writes query parameters on the same page | `search` |
| `panel` | Opens a dialog or a drawer | none; screen 24 has none |
| `state` | Changes an attribute of the screen | `attribute`, `from`, `to` |

The Maestro flows in `e2e/native/` are written by hand. Flows generated from the contract are not built.

Sources: `src/screens/24-project-overview/contract.yaml`, `e2e/web/contract.ts` and `scripts/check-trace.mjs` of `metis-app`; [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 377 to 411 of the original; [`contract.yaml` is each screen's promise, traced to tests](../../architecture/decisions/screen-contract-and-trace.md).

## What the app reads from metis-docs

`pinned/` holds byte copies of ten files of `metis-docs`, under the same paths. `docs.lock` names the repository, the commit the copies come from and the sha256 of each copy, and `pnpm gate:tooling` fails when a copy differs from `docs.lock`, is missing or is not listed (`scripts/pinned.mjs`, `scripts/pinned.test.mjs`). The language gate skips `pinned/`, because `metis-docs` checks those files.

| File in `metis-docs` | What reads its copy |
|---|---|
| `design/brand/tokens.css` | `scripts/gen-tokens.mjs`, which writes `src/design-system/tokens.ts` (`pnpm gen:tokens`; `pnpm gate:tokens` fails when the file is stale); `e2e/web/support.ts`, which reads token values at run time to measure the page; `scripts/brand-files.test.mjs` |
| `design/brand/logo/metis-wordmark.svg` | `assets/brand/metis-wordmark.svg` is a byte copy, and the logo is drawn from it; `e2e/web/brand.spec.ts` compares the drawn paths with it |
| `design/brand/logo/metis-app-icon-square-1024.png`, `design/brand/logo/metis-app-icon-android-foreground-1024.png` and `design/brand/logo/metis-favicon-48.png` | Byte copies in `assets/brand/`, which `app.json` names for the icon, the Android adaptive icon, the splash screen and the web favicon |
| `design/brand/logo/metis-app-icon-180.png` | `public/apple-touch-icon.png` is a byte copy |
| `design/brand/logo/metis-app-icon.svg`, `design/brand/logo/metis-app-icon-square.svg` and `design/brand/logo/metis-app-icon-android-foreground.svg` | `scripts/brand-files.test.mjs` checks that the two derived icons carry the shapes of the source icon |
| `design/wireframes/manifest.json` | `src/core/routes.test.ts` checks that every destination names a first-release screen of the manifest |

The pull request that replaces a pinned copy is to come from the documentation bot of the repositories design. It is not built. Until it exists, the same change is made by hand: the file under `pinned/` and its hash in `docs.lock` change together, and `pnpm gate:tooling` proves that they agree.

Sources: `docs.lock`, `pinned/`, `scripts/pinned.mjs`, `scripts/gen-tokens.mjs`, `scripts/brand-files.test.mjs` and `src/core/routes.test.ts` of `metis-app`; [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), section 4.4 (lines 283 to 288 of the original).

## The contract flow to come

Planned, not built. Today the zod schemas in `src/core/api/` are written by hand from the contract of the foundation spec, and nothing copies a contract into the app. The flow that the owner approved is this:

1. The core generates `contract/openapi.json` (OpenAPI 3.1) in `metis-backend`, and its build fails when the committed file is stale.
2. On every backend pull request, oasdiff compares the contract with the one on `main`. A breaking change, such as a removed field or a new required input, needs the label `contract: breaking`, set by the frontend lead, because app versions already on phones keep calling the old shape.
3. When the backend pull request merges, a bot opens a pull request in `metis-app` that copies the contract. The app regenerates its zod schemas, and its checks run.

The backend must keep answering older app versions, because Apple and Google review every app release and people update at their own pace [Unverified - confirm before applying]. See [The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`](../../architecture/decisions/api-contract-flow.md) and [The API contract is the only coupling between app and back end](../../architecture/decisions/api-contract-only-coupling.md). [The API contract](../../architecture/contract.md) describes the same flow for the whole system.

Sources: [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), sections 2.2 and 4.5 (lines 77 to 81 and 290 to 294 of the original).

## Open questions

The design of the back end answered these on 14 Oct 2026, and the core in `metis-backend`, which has no commit yet, keeps its answers: see [Core interfaces](../core/interfaces.md#the-answers-to-the-apps-questions). Three answers stay provisional until the owner decides: the filter of the Delayed tile, the meaning of My items and the drill of the upcoming list. The second column says what the app and its mock server do.

| Question | What the app and the mock server do | Source |
|---|---|---|
| Which filter does the Delayed tile open? BRD WBS-05 has no "late against the baseline" filter. Needed before the back end builds the overview API | The mock data uses `delayed=true` ([`delayed=true` and `scope=mine` are provisional names](../../architecture/decisions/provisional-drill-parameters.md)) | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 701 of the original |
| How is the health of a project computed for resources and finance, and is there a level for each face? BRD OVW-05 names four faces, and the BRD has no rule for two of them. Needed before the back end computes project health | The contract carries one overall level, and the reasons of delivery and risk ([Derived health covers delivery and risk only](../../architecture/decisions/derived-health-scope.md)) | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 702 of the original |
| Which field of the API says that the viewer has read-only access, and with which reason code (PLT-04)? | The read-only state is not drawn, because the contract has no field for it | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 703 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19421 and 19422 of the original |
| Will the back end answer `GET {apiBase}/workspaces/{workspaceId}/shell` in the shape of `src/core/api/shell.ts`? Needed before the back end builds the frame | The mock server answers in that shape ([The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md)) | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 709 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19414 and 19415 of the original |
| Does "My items" (`?scope=mine`) filter by the person in charge, by the assignee, or by both? Needed before the back end builds the overview API | The mock server returns the same data for both scopes | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 710 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19416 and 19417 of the original |
| Does the "upcoming" list also filter by date and status? BRD WBS-05 has no date filter | The contract has `attention.upcoming.drill`, and the mock data uses `label=milestone` and `label=approvalGate`. The "View in WBS" link and the "+ N more" row copy that filter | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 767 to 769 of the original |
| Will the back end keep the rules of the table above: the time zone and the project header on the answer of every project tab, the initials of people sent by the server, and no comma in a value of a drill filter? Needed before the back end builds a project tab | The mock server keeps them, and the zod contracts reject an answer that does not | [Code review report](../../history/code-review/report.md), lines 209 to 217, 374 to 379 and 381 to 387 of the original; [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 185 to 198 of the original |
| Will the back end meet the target of reading the API in under 1 second at the 95th percentile? The target comes from the BRD | The mock server is not measured | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 678 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), line 19833 of the original |
