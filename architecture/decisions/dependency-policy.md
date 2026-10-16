---
title: Accepted advisories and allowed licences
summary: The dependency gate audits production packages with four reviewed advisories that may only shrink, an override for js-yaml, and permissive licences plus MPL-2.0.
component: app
type: decision
status: current
ids: []
---

# Accepted advisories and allowed licences

## Context

The dependency gate looks at the packages that go into the app. When plan A measured it, `pnpm audit --prod` reported four known vulnerabilities in the package tree of Expo SDK 57, two high and two moderate. Three sit in build tools (`node-forge`, `braces`, `uuid`) and do not enter the app bundle. One, `decode-uri-component` through expo-router, is in the app bundle but only slows the tab of a person who opens a broken path by hand. Forcing patched versions with `overrides` could break Expo; this was not measured [Unverified - confirm before applying]. The gate also needed a list of licences the owner accepts.

## Decision

- **Advisories.** `gate:deps` runs `pnpm audit --prod`. The four reviewed advisories are ignored in the audit settings of `pnpm-workspace.yaml`, one reason per code. The list may only shrink, and any new advisory turns the gate red.
- **A new advisory is removed, not added.** When GHSA-hp3w-g68c-fv3c appeared, it was removed by an override of `js-yaml` to 4.3.2 and not added to the reviewed list, so the list still holds four codes. To accept a fifth code instead, drop the override line and add the code together with a new decision of the owner.
- **Licences.** The allowed licences are the permissive ones plus MPL-2.0. GPL, AGPL and LGPL standing alone are not allowed. The gate looks only at packages that go into the app (`--prod`), not at development tools. Its reader of licence expressions follows the SPDX syntax and has a test for each of the twelve allowed codes.
- **When it runs.** The gate runs in every `pnpm verify`, not only on a schedule as the spec first said, because it is fast (2 to 4 seconds on pnpm 11.28.4) and turns red as soon as a new advisory appears. It needs the network.
- **No canary.** The rule that every gate has a canary lists this gate as an exception (see [A screen is done when its gates pass, each proven able to fail](gates-with-canaries.md)). A canary would have to install a vulnerable or wrongly licensed package and rewrite `node_modules` and the lockfile. `scripts/check-licenses.test.mjs` proves instead that the licence rule goes red.

## Consequences

- A new advisory can turn red a pull request that touches no package, until the advisory has been reviewed.
- If the owner wants all four advisories blocked, the team must wait for Expo to fix them or try `overrides`.
- Open: the owner's review package of 10 Oct 2026 still lists the four advisories as waiting for the owner, and recommends keeping them until Expo ships a fix.
- The setting for ignored advisories is named `auditConfig.ignoreGhsas`. A reviewer warned that pnpm 11.16 renamed it `audit.ignore` and that the old name still runs until pnpm 12; rename it when pnpm is upgraded [Unverified - confirm before applying].
- The licence notice file `LICENSES.md` was left to plan B together with the fonts, since the gate already proves the licences of the packages that go into the app.

## Status

Current, decided by the owner on 6 Oct 2026 (FE-17). The two points, the four accepted advisories and the licence list, were put to the owner with plan A, and the owner approved the plan with them (answer "ok, approved", translated).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-17 (line 57 of the original).
- [Front-end foundation plan (plan A)](../../history/plans/2026-10-05-frontend-foundation.md): the decisions on the dependency gate (lines 154 to 165 of the original), the SPDX reader (lines 4325 and 4326) and rulings 17 to 20 of the run (lines 4329 to 4338).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the gate without a canary (lines 594 to 596 of the original).
- `metis-app/reports/review/review.md`, the owner's review package, kept on the owner's machines and never committed (repositories design, section 6.1): the four advisories still waiting for the owner (line 48 of the original).
