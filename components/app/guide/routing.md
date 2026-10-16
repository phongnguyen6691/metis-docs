---
title: Routing
summary: How the folder src/app becomes the table of paths, the rules of that table, and which file receives each kind of path.
component: app
type: how-to
status: current
ids: []
---

# Routing

Expo Router is a file-based router for React Native and web applications: a file added under the app directory becomes a route [Source: docs.expo.dev/router/introduction, read 12 Oct 2026]. In `metis-app` that directory is `src/app`, and its tree of folders is the table of paths. The same table serves the web, where the path is the URL in the address bar, and the apps, where a path opens through the URL scheme `metis` declared in `app.json` as a deep link [Source: docs.expo.dev/router/basics/core-concepts, read 12 Oct 2026].

Paths are relative to the root of `metis-app`. The previous page, [Styles and layout](styles-and-layout.md), covers the frame that every page sits in; the next, [Data flow](data-flow.md), follows the data a page asks for.

## The rules of the route table

- **`index.tsx` is the default route of its folder.** `src/app/index.tsx` is `/`, and `src/app/w/[workspaceId]/projects/[projectId]/wbs/index.tsx` is the path of the WBS of a project [Source: docs.expo.dev/router/basics/notation, read 12 Oct 2026].
- **`[workspaceId]` is a dynamic segment.** A name in square brackets matches one segment of the path [Source: docs.expo.dev/router/basics/notation, read 12 Oct 2026]. The value, and the query parameters such as `?scope=mine`, reach the route through `useLocalSearchParams()`.
- **A static segment beats a dynamic one.** The path `/w/creative-studio/projects/new` matches `projects/new.tsx` and not `projects/[projectId]` [Source: expo-router 57.0.24 build/sortRoutes.js, read 12 Oct 2026].
- **`_layout.tsx` wraps the pages of its folder and of the folders below it** [Source: docs.expo.dev/router/basics/notation, read 12 Oct 2026]. The app has exactly one layout, at the root, and it renders `<Slot />`: the matched page is drawn in place, with no stack of screens and no tab bar [Source: docs.expo.dev/router/advanced/root-layout, read 12 Oct 2026].
- **`+not-found.tsx` receives every path that no file matches** [Source: docs.expo.dev/router/basics/notation, read 12 Oct 2026]. A folder that holds no page of its own, such as `/w/creative-studio/projects`, is no path either.
- **`typedRoutes` types the links.** With `experiments.typedRoutes` in `app.json`, Expo Router generates TypeScript types for the table into `.expo/types/router.d.ts`, so a mistyped `pathname` is a TypeScript error [Source: docs.expo.dev/router/reference/typed-routes, read 12 Oct 2026]. `src/core/routes.ts` writes every path pattern out in full for that reason, and a test in `src/core/routes.test.ts` checks that the table and the route files of `src/app` name the same paths.
- **`Shell` reads parameters globally.** `Shell` sits in the layout, in no route, so it reads the parameters of the current URL with `useGlobalSearchParams` (`src/shell/Shell.tsx`). A route file reads its own with `useLocalSearchParams`.

## Which file receives a path

Each row below was measured: Expo Router 57.0.24 built its route table from the files under `src/app` and mapped the path to a route with its own `getRoutes`, `getReactNavigationConfig` and `getStateFromPath` code on 12 Oct 2026. The last column comes from the route files and from `src/shell/model.page.ts`.

| Path | File that receives it | `useLocalSearchParams()` there | What the page draws |
|---|---|---|---|
| `/` | `src/app/index.tsx` | `{}` | A `<Redirect>` to the overview of the `HOME` project, `/w/creative-studio/projects/meridian-cgi-campaign/overview` (`HOME` is in `src/platform/config.ts`) |
| `/w/creative-studio/projects/meridian-cgi-campaign/overview?scope=mine` | `src/app/w/[workspaceId]/projects/[projectId]/overview.tsx` | `workspaceId: creative-studio`, `projectId: meridian-cgi-campaign`, `scope: mine` | `OverviewScreen` with the scope `mine`: screen 24, the one screen that is built |
| `/w/creative-studio/projects/new` | `src/app/w/[workspaceId]/projects/new.tsx` | `workspaceId: creative-studio` | The shared not-built page for the destination `newProject`: its title, the note that it is not built, `Screen 37`, the path and the filters received (none) |
| `/w/creative-studio/risk?risk=high,critical` | `src/app/w/[workspaceId]/risk.tsx` | `workspaceId: creative-studio`, `risk: high,critical` | The not-built page for `risk` (screen 19), with the filter line `risk: high, critical` |
| `/w/creative-studio/projects/meridian-cgi-campaign/wbs/1.2` | `src/app/w/[workspaceId]/projects/[projectId]/wbs/[itemId].tsx` | `workspaceId`, `projectId` and `itemId: 1.2` | The not-built page for `wbsItem` (screen 28); the path segments are not filters |
| `/me/focus` | `src/app/me/focus.tsx` | `{}` | The not-built page for `myFocus` (screen 34) |
| `/no-such-page` | `src/app/+not-found.tsx` | The unmatched path | `NotBuilt` with no destination: the page `Page not found`, still inside the real shell |
| `/w/creative-studio/projects` | `src/app/+not-found.tsx` | The unmatched path | The same page: a folder with no page of its own is no path |

The overview route is the whole of a route that is built. It reads the parameters and hands them to the screen, and does nothing else:

```tsx
import { useLocalSearchParams } from 'expo-router'

import { one, type Params } from '../../../../../core/routes'
import { OverviewScreen } from '../../../../../screens/24-project-overview/Screen'

// A segment arrives as one string; anything else becomes an empty id, which reads as not found.
export default function OverviewRoute() {
  const params: Params = useLocalSearchParams()
  return (
    <OverviewScreen
      workspaceId={one(params.workspaceId) ?? ''}
      projectId={one(params.projectId) ?? ''}
      scope={one(params.scope)}
    />
  )
}
```

Every route that is not built yet is a few lines long and names its destination:

```tsx
import { NotBuilt } from '../../../shell/NotBuilt'

// A first-release destination not built yet: its final path opens the shared not-built page.
export default function RiskRoute() {
  return <NotBuilt destination="risk" />
}
```

The table of paths is `ROUTES` in `src/core/routes.ts`. The routes and the drill-down filters, as the app exposes them, are listed in [the Routes section of App interfaces](../interfaces.md#routes), and [Final routes, drill filters in the URL, and unbuilt destinations](../../../architecture/decisions/routes-and-unbuilt-destinations.md) records why unbuilt destinations already have their final paths.

## Try it

With `pnpm web` running, open `http://localhost:8081/_sitemap`: Expo Router adds a generated page that lists the routes it found [Source: expo-router 57.0.24 build/getRoutes.js, which generates the `_sitemap` route, read 12 Oct 2026]. Then open `http://localhost:8081/w/creative-studio/risk?risk=high,critical` and read the filter line of the not-built page.

## Check yourself

`Shell` reads `workspaceId` with `useGlobalSearchParams`, not `useLocalSearchParams`. Why?

1. The global hook is faster.
2. `Shell` sits in the root layout, in no route; only the global hook sees the parameters of the page that is open.
3. The local hook does not exist on the web.
4. For stricter TypeScript types.

<details>
<summary>Answer</summary>

Option 2. `useLocalSearchParams` "returns the URL parameters for the current component", while `useGlobalSearchParams` "returns the global URL regardless of the component" [Source: docs.expo.dev/router/reference/url-parameters, read 12 Oct 2026]. The root layout has no dynamic segment of its own, so only the global hook tells `Shell` which workspace and project are open. The same page warns that the global hook "might cause components to update extraneously in the background", so option 1 is the opposite of the truth.

</details>
