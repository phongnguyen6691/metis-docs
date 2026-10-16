---
title: pnpm 11.28.4, the hoisted layout, Expo's peer pins
summary: pnpm is pinned to 11.28.4 with the hoisted node_modules layout, and the three peer packages that Expo's template pins are kept pinned.
component: app
type: decision
status: current
ids: []
---

# pnpm 11.28.4, the hoisted layout, Expo's peer pins

## Context

The spec named pnpm 10.34.6, and the machine had pnpm 11.3.0. In the verbatim dry run of plan A, pnpm 11.3.0 with the hoisted layout printed `Done in` and then did not exit when it installed over an existing `node_modules`: 3 runs out of 3 hung, one of them for 715 seconds [Source: measured in the dry run of plan A, lines 93 to 96 of the original]. The plan attributes the hang to a pnpm bug fixed in versions 11.23.0 and 11.26.0 [Unverified - confirm before applying]. `create-expo` does not write the `nodeLinker` setting.

Separately, `expo-router` pulls `react-native-reanimated`, `react-native-worklets` and `react-native-gesture-handler` into the tree as peers of `react-native-drawer-layout`. The project template pins their versions. Removing them from `package.json` would leave pnpm installing them with no pinned version: the probe found 4.7.1 available, while Expo SDK 57 goes with 4.5.1 [Source: probe recorded in plan A, lines 109 to 112 of the original].

## Decision

- **pnpm 11.28.4.** The `packageManager` field pins pnpm 11.28.4, the newest version 11 at the time (released on 3 Oct 2026), from the first task of plan A. The pnpm 11.3.0 on the machine and `pnpm/action-setup` in CI both switch to the pinned version by themselves [Source: foundation plan, lines 96 to 97 of the original]. Section 2 of the spec was updated with the number.
- **`nodeLinker: hoisted`.** The first task writes the setting by hand, because `create-expo` does not. The hoisted layout keeps what the spec said: the iOS and Android builds were proven only with this layout [Source: probe recorded in plan A, lines 98 and 99 of the original]. Every gate of plan A is green with both layouts.
- **Keep Expo's pins.** `react-native-reanimated`, `react-native-worklets` and `react-native-gesture-handler` stay in `package.json` with the versions the project template pins. Knip does not report them [Source: foundation plan, line 112 of the original].

## Consequences

- The first pnpm run on a machine downloads pnpm 11.28.4, about 4 seconds.
- Keeping the three pins has no further effect.

## Status

Current, a decision of plan A taken when it was written and approved by the owner with the plan on 6 Oct 2026 (FE-17).

## Sources

- [Front-end foundation plan (plan A)](../../history/plans/2026-10-05-frontend-foundation.md): the decisions on pnpm and on Expo's peer packages (lines 93 to 100 and 109 to 112 of the original).
- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-17, the approval of plan A (line 57 of the original).
