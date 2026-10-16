---
title: Provisional web-only stack
summary: The browser-only stack of 3 Oct 2026 (React DOM, Vite, Tailwind, React Aria, TanStack, Nx, Vitest and a PWA), replaced when native apps became a requirement.
component: app
type: decision
status: superseded
ids: []
---

# Provisional web-only stack

## Context

On 3 Oct 2026 the technology of the front end was fixed provisionally at a brainstorming session, before the technical spec existed. Two premises were decisions of the owner:

- The output is a real front-end web application with sample data, not a static prototype, and no back end is built first; the back end is settled later, at Discovery. The application had to be usable at once as a high-fidelity prototype for pilot customers and also be the seed of the production front end.
- The criterion is "best", not "least work", judged on nine points: stable running, few bugs, strong community, easy maintenance, explicit code, easy and fast scaling, not obsolete early, in line with the next five years, and good on every device from phone to desktop.

An independent review of the stack by GPT was run on 3 Oct 2026, before the spec was written.

## Decision

The stack put to the review and fixed provisionally was:

- Base: React with strict TypeScript (no `any`, `exactOptionalPropertyTypes`), built with Vite and run wholly in the browser, with no server rendering. Next.js was ruled out because the app sits behind sign-in, needs no discovery by search engines, and should not carry the burden of following changes of a high-level router. An installable web app (a PWA through `vite-plugin-pwa`) was to put Metis on phones without a native app, since BRD D-19 left native apps out of scope.
- Repository: one repository with several packages, managed by `pnpm` and `nx`: domain logic, contracts, design system, API client, fixtures and the web app. `nx` was chosen so that an import in the wrong direction becomes a build error and not a verbal agreement in a team of 40.
- Interface: Tailwind CSS for the whole app, the owner's choice over CSS Modules; `brand/tokens.css` stays the single source of colours, type, density and focus ring; the wireframe stylesheet translated into React components; Storybook as the living catalogue. Icons were not chosen and dark mode was not designed.
- Interaction: React Aria Components for dialogs, side trays, menus, selects, comboboxes, date pickers, tooltips and toasts; a self-built dense table on TanStack Table and TanStack Virtual (buying a commercial grid was ruled out to avoid depending on a vendor); `@xyflow/react` with `elkjs` for the four canvases; a self-built drag-and-drop board on React Aria; `react-hook-form` with `zod` for the long forms.
- Data: one OpenAPI file as the single source that generates TypeScript types, runtime `zod` validation, API hooks and Mock Service Worker handlers; TanStack Query for server data; `zustand` for small interface stores; `tRPC` ruled out because it would force a TypeScript back end; `xstate` for six state machines.
- Language and dates: `i18next` with `react-i18next` (ICU format), English first and Vietnamese second; `date-fns`.
- Tests: `vitest`, `playwright` on three browser engines and a phone viewport, `axe-core`, image comparison against the 58 wireframe pictures, tests generated from data, a coverage gate that breaks the build when a screen has no route or a requirement of the first release has no screen, and `eslint` with `prettier` (`biome` ruled out as too young).
- Ruled out from the start: Material UI and similar component sets, runtime CSS-in-JS, `create-react-app`, `moment` and `enzyme`.

## Consequences

- The review concluded "can be locked with conditions". It asked for no change of React, TypeScript, Vite, pnpm, Nx, Tailwind, React Aria, React Flow, TanStack Query, Zod, react-hook-form, i18next, Vitest, Playwright, axe-core, ESLint or Prettier. It did not ask to return to a static prototype, to build the back end first, or to cut scope. Its conditions were about how the complex parts are locked:
  - Tailwind must not become the public styling API of the 58 screens; a semantic design system is the API.
  - The dense table is not solved by joining TanStack Table and TanStack Virtual; an acceptance spike is needed and the commercial-grid option is reopened as a conditional decision.
  - The canvas and the list editor are not coded before their parity and command contract exists.
  - The OpenAPI file is a provisional transport contract, not the business source of truth.
  - `xstate` is used only for real orchestration.
  - Visual regression takes the approved high-fidelity app as its baseline, not the mid-fidelity pictures.
- The disposition of the review counted 24 conditions accepted, 3 accepted with an adjustment, 2 left to the owner (the dense-table strategy and the router) and none rebutted. Its largest finding was three real errors in the proposal itself: the metric reconciliation test would pass even with a wrong formula, a pixel comparison against mid-fidelity wireframes cannot be right once the app is high fidelity, and the wireframe stylesheet is a component vocabulary, so Tailwind has to sit under a named component layer.
- On 5 Oct 2026 the foundation spec replaced this base: React Native with Expo took the place of React DOM with Vite, Tailwind, React Aria Components, TanStack Router and Vitest.

## Status

Superseded by [React Native with Expo for web, iOS and Android](react-native-expo-single-codebase.md).

The stack was provisional from the start. It was replaced on 5 Oct 2026, when the owner asked for one codebase for web, iOS and Android and for the best performance on every device (FE-09, FE-11).

## Sources

- [Front-end stack review prompt](../../history/reviews/gpt-review-prompt-frontend-stack.md): lines 103 to 180 of the original (the two premises and the stack put to the review).
- [Front-end stack review](../../history/reviews/metis-review-frontend-stack.md): lines 13 to 21 and 1156 to 1170 of the original (the summary and the final conclusion).
- [Front-end stack review disposition](../../history/reviews/review-disposition-frontend-stack.md): lines 3 to 13 and 127 to 129 of the original (what the review applied to, the counts, what did not change).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 727 to 729 of the original (what the new base replaces).
