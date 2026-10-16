---
title: Data flow
summary: How data goes one way from a route to a drawn screen, what each mock scenario and each error does along the way, and what the mock server is in each build.
component: app
type: how-to
status: current
ids: []
---

# Data flow

The overview screen does not count and does not calculate. Data goes one way: the route takes parameters, a hook calls the API, `zod` checks the shape of the answer, a pure function translates the text and formats the numbers, and the components only draw. There is no state library and no fetch library: the path uses `useState`, `useEffect`, `fetch` and `zod`, and React Native provides the Fetch API [Source: reactnative.dev/docs/network, read 12 Oct 2026].

Paths are relative to the root of `metis-app`. The previous page, [Routing](routing.md), explains how a path reaches a route file; the next, [Testing](testing.md), shows how this path is tested. The calls themselves, with their error mapping, are listed under [What the app calls in App interfaces](../interfaces.md#what-the-app-calls).

## The path of one request

1. **Route.** `src/app/w/[workspaceId]/projects/[projectId]/overview.tsx` reads `workspaceId`, `projectId` and `scope` from the URL and hands them to `OverviewScreen` (see [Routing](routing.md)).
2. **Hook.** `useOverview` gives the shared `useApi` hook a key, `[workspaceId, projectId, scope]`, and a function that calls `getOverview`. `useApi` adds a counter, `attempt`, to the key to form the question, and calls the function in an effect. Until an answer arrives, `result` is `null`: the root of the screen keeps `aria-busy`, and `StateView` draws a spinner with the loading sentence.
3. **Client.** `getOverview` builds the address, `{baseUrl}/workspaces/{workspaceId}/projects/{projectId}/overview`, with `?scope=mine` when the scope is mine, and starts a timer of 10 seconds (`timeoutMs` in `src/platform/config.ts`) that aborts the request through an `AbortController`. `baseUrl` is `EXPO_PUBLIC_API_BASE`, or `https://api.metis.test` when the variable is not set. The ids come from the URL the user typed, so they are encoded, and an id that is empty, `.` or `..` answers `notFound` without a request.
4. **Server.** In a mock build the mock server answers (see below); otherwise the request goes over the network.
5. **zod.** `parse` runs `overviewSchema.safeParse` on the body. A body that fits the contract becomes `{ ok: true, data }`. A body that does not, or that is not JSON, becomes an `invalid` error that lists each wrong field by its path.
6. **Model.** `buildOverview` translates the text for the language, formats the numbers with `Intl`, and builds the drill-down links from the filters the server sent.
7. **Screen.** `Loaded` draws the project header, then the body: a header row, the row of tiles and the rows of cards.

The hook keeps every answer together with its question:

```ts
// Answers are kept with their question, so a new key or a retry shows loading, not the old answer.
export function useApi<T>(key: string, load: () => Promise<ApiResult<T>>): ApiState<T> {
  const [attempt, setAttempt] = useState(0)
  const question = JSON.stringify([key, attempt])
  const [answer, setAnswer] = useState<{ question: string; result: ApiResult<T> } | null>(null)
  // Callers pass a new closure on every render; only a new question may ask again.
  const ask = useEffectEvent(load)
  useEffect(() => {
    // A late answer to a replaced question must not overwrite the answer to the current one.
    let current = true
    ask().then((result) => {
      if (current) setAnswer({ question, result })
    })
    return () => {
      current = false
    }
  }, [question])
  return {
    result: answer?.question === question ? answer.result : null,
    // Stryker disable next-line ArithmeticOperator: any other number changes the question too
    retry: () => setAttempt((n) => n + 1)
  }
}
```

If the project changes, or Try again is pressed, while an older call is still on its way, the old answer is dropped and never overwrites the new one. `useEffectEvent` lets the hook call the latest `load` without asking again on every render [Source: react.dev/reference/react/useEffectEvent, read 12 Oct 2026].

The client never throws. Every failure becomes an `ApiError` with a name that the screen knows how to draw:

```ts
// Never throws: every failure becomes an ApiError.
async function request<T>(
  url: string,
  schema: z.ZodType<T>,
  signal: AbortSignal
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, { signal })
    if (!response.ok) {
      return fail(STATUS_ERRORS[response.status] ?? { kind: 'server', status: response.status })
    }
    return parse(schema, await response.text())
  } catch {
    return fail(signal.aborted ? { kind: 'timeout' } : { kind: 'network' })
  }
}
```

`STATUS_ERRORS` maps 401 to `unauthenticated`, 403 to `forbidden` and 404 to `notFound`. Any other status becomes `server`. The frame makes its own request the same way: `useShell` calls `getShell`, which asks `GET /workspaces/{workspaceId}/shell`. When that fails, the sidebar says `Could not load the menu.` and offers a retry.

## What answers the request in each build

| Build | What answers | Scenarios |
|---|---|---|
| Web, mock build (`pnpm web`) | MSW registers a service worker, which answers requests at the network level [Source: mswjs.io/docs/integrations/browser, read 12 Oct 2026] (`src/platform/mocks.web.ts`) | Picked with `?mock=<name>` in the URL; an unknown name picks `default` |
| iOS and Android, mock build | The apps have no service worker [Source: comment in src/platform/mocks.ts, read 12 Oct 2026], so `src/platform/mocks.ts` replaces the global `fetch` with a function that asks the MSW handlers first | Only `default`, because the apps have no URL to pick one with |
| Release build | No mock server: Metro replaces `process.env.EXPO_PUBLIC_MOCKS` with its value when it bundles [Source: docs.expo.dev/guides/environment-variables, read 12 Oct 2026], so the block that loads MSW is left out of the bundle [Source: comment in src/platform/mocks.web.ts, read 12 Oct 2026]. `scripts/check-web-release.mjs` fails the web release export if any trace of the mocks is left | None |

In both mock builds an API call that no handler answers is a bug: it logs an error that names the call, and a call to any other host goes on to the network.

## The scenarios

A scenario changes the overview answer of a project that has data. The 403 and 404 answers, and the answer to the shell request, stay the same in every scenario (`src/mocks/handlers.ts`). The names are the `SCENARIOS` of that file. [The mock scenarios in Develop the app](../develop.md#the-mock-scenarios) says how to pick one.

| Scenario | What the server answers | What the client returns | What the user sees |
|---|---|---|---|
| `default` | 200 with the data of the demo project | `{ ok: true, data }` | The project header, then the tiles and the cards |
| `loading` | Never answers | After the timer of 10 seconds, `{ ok: false, error: { kind: 'timeout' } }` | First the loading state: a spinner and the sentence "Loading the project overview." After the 10 seconds, the same panel as `serverError`. The test in `src/mocks/handlers.test.ts` checks that this scenario ends in a `timeout` error |
| `partial` | 200, with the freshness of every metric set to `partial` | `{ ok: true, data }` | The whole screen as usual. Only the line under the title changes: `Partial · as of {time} · metrics v1`, with the time filled in (the freshness line reports the weakest snapshot) |
| `unknown` | 200, with the freshness of every metric set to `unknown` | `{ ok: true, data }` | The same line reads `Unknown · metrics v1`, with no time |
| `longLists` | 200, with the total of each attention list set to its number of rows plus 3 | `{ ok: true, data }` | Each list gets a last row, "+ 3 more · open in WBS" (the list of overdue items says "open in Focus") with a link. The schema also checks that a list never sends more rows than its total |
| `invalidData` | 200, with the metric `blocked` removed | `{ ok: false, error: { kind: 'invalid', issues: [...] } }`, one issue with the path `metrics.blocked` | `problemOf` picks the `invalid` state and puts the field name in the sentence: a panel titled "This data could not be shown", "The server sent data this screen does not understand. Field: metrics.blocked.", with a Try again button |
| `serverError` | 500 | `{ kind: 'server', status: 500 }`, because 500 is not in `STATUS_ERRORS` | `problemOf` puts server, network and timeout failures in one `unavailable` state: a panel titled "Could not load the project overview", "The server did not answer. Try again in a moment.", with Try again. Pressing it adds 1 to `attempt`, the question changes and the effect asks again |
| `sessionExpired` | 401 | `{ kind: 'unauthenticated' }` | The `sessionExpired` state is a dialog, not a panel: "Your session expired", "Sign in again to carry on where you were." Its action "Sign in again" has no destination yet, so it shows as a label with the tag "Not built yet" |

Other answers depend on the project in the path, not on a scenario:

| Case | What the server answers | What the client returns | What the user sees |
|---|---|---|---|
| The project `spring-catalogue-renders` | 403 in every scenario | `{ kind: 'forbidden' }` | The `noAccess` panel, with a lock mark: "You don't have access to this project", and two actions: "Request access", which is not built yet, and a link "Back to My focus" |
| Any other project, or any workspace other than `creative-studio` (any id the demo data holds no overview for) | 404 | `{ kind: 'notFound' }` | The `notFound` panel: "Project not found", "Check the link or ask the person who sent it.", and "Back to My focus". There is no Try again, because trying again cannot find the project |
| A release build with no mock server and no `EXPO_PUBLIC_API_BASE` | The request goes to `https://api.metis.test`, and `fetch` fails; a `.test` host never resolves [Source: comment in src/platform/config.ts, read 12 Oct 2026] | `{ kind: 'network' }` | The same panel as `serverError`, with Try again |

The strings are in the dictionaries `src/shell/strings/en.ts` (the shared `states` block) and `src/screens/24-project-overview/strings/en.ts`; this page quotes the English ones. See [Screens call the real API; a mock server answers in mock builds only](../../../architecture/decisions/mock-server-behind-real-api.md) and [Every response is validated, and every failure is a named state](../../../architecture/decisions/validated-contracts-and-error-states.md).

## Try it

Run `pnpm web`, then open `http://localhost:8081/w/creative-studio/projects/meridian-cgi-campaign/overview?mock=serverError`. The panel "Could not load the project overview" appears; press Try again. Replace `serverError` with each name in the table above. Then open `http://localhost:8081/w/creative-studio/projects/spring-catalogue-renders/overview`: this project always answers 403.

## Check yourself

When is `process.env.EXPO_PUBLIC_MOCKS` read?

1. Each time the app opens, from the environment variables of the machine.
2. When Metro bundles: the expression is replaced by its value.
3. When the app is installed on the simulator.
4. From `app.json`.

<details>
<summary>Answer</summary>

Option 2. Expo replaces each `process.env.EXPO_PUBLIC_*` that is written in the code with its value when it bundles [Source: docs.expo.dev/guides/environment-variables, read 12 Oct 2026]. A release build sets no flag, so the condition is always false, and the `if` block that holds `require('msw/browser')` is left out of the bundle (`src/platform/mocks.web.ts`). The release check of the web export, `scripts/check-web-release.mjs`, fails if any trace of the mocks is left.

</details>
