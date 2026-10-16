---
title: Three width tiers and 44 point touch targets
summary: The layout has three width tiers, the full layout from 1280, an icon rail and a drawer from 768 to 1279 and one column below, with 44 point touch targets on phone web and at every width on iOS and Android.
component: app
type: decision
status: current
ids: [D-19]
---

# Three width tiers and 44 point touch targets

## Context

The spec fixes three width tiers for the shell and for screen 24 (the style guide, section 5.1, and BRD D-19, which asks only for viewing and light updating on phones: Focus, Board, Overview and approvals). The first overview-screen plan built the shell from 1280 px only and cut the tiers (R-B1).

On 9 Oct 2026 the owner opened screen 24 on a phone in Chrome and the whole page broke (FE-23). Measured before the fix with Chromium emulating a Pixel 7 and WebKit emulating an iPhone 15:

- At 412 px Chrome scaled the page down, so the window became 948 px wide and the text about 43% of its real size. At 393 px the document was 946 px wide and 21 elements lay beyond the right edge. At 768 px the document was 948 px wide. At 1024 px and 1280 px nothing overflowed.
- The project name broke one letter per line, because the page column was 180 px (412 minus the 232 px sidebar), and 54 controls were smaller than 44 x 44 at phone width.
- The root cause was that no component read the screen width: the sidebar was always 232 wide, the top bar was a row that never wrapped with a search box fixed at 300, the card rows of screen 24 were always horizontal, and the shape gate measured only at 1280 and 1440.

A later round on an Android tablet (800 dp) showed a second gap: the app had touch targets only at the phone tier, so on the tablet controls were 18 to 30 dp tall (FE-25).

## Decision

The tier comes from the window width: `useWindowDimensions()` through `tierOf(width)`, with `desktop` from `bpDesktop` (1280), `tablet` from `bpTablet` (768) and `phone` below. One mechanism serves all three platforms, because the app has no CSS media queries, and it updates itself when the device rotates or the window is resized. The breakpoints, the touch size (`--touch`, 44 px) and the width of the icon rail (`--rail-w`, 64 px) are brand tokens (see [The brand tokens are the only source of sizes and colours](brand-tokens-source.md)).

- Desktop, from 1280: the full layout, unchanged.
- Tablet, 768 to 1279: the sidebar becomes an icon rail. Its menu button is at the top and opens the full sidebar as a drawer; below it each link item of the Home, Portfolio and Workspace groups is one icon button, whose readable name is the label of the item with its count (for example "My focus 9"), because a number shown on a button has to be in its name [Source: WCAG 2.5.3, as cited by the plan]. Planned items and the project tree are only in the drawer. The eight metric tiles go to two rows of four, and the card rows stay as on the desktop. The top bar drops Help, which is not built, and its search box shrinks, with its placeholder on one line cut by an ellipsis.
- Phone, below 768: one column, with no sidebar column. The top bar holds the menu button, the breadcrumb (cut with an ellipsis), the bell and the language select; it hides the search box (it is in the drawer), New, Help and the avatar, which is decoration only. The metric tiles go to four rows of two, each card has a row of its own, and cards drop `flex: 1`, because in a column whose height follows its content Yoga gives `flex: 1` a base size of 0 and shares no free space, so the cards shrink to 0 and overlap on the app, while on web CSS treats `flex-basis: 0%` in a frame of undefined height as `content` [Source: `node_modules/react-native/ReactCommon/yoga/yoga/node/Node.cpp:329-339` and `algorithm/CalculateLayout.cpp:1640-1649`, as cited by the plan]. The segments of the status bar are for looking only, because a segment of 1 item in 12 is 23 to 27 px wide and forcing 44 px would misstate the proportions; the line of the legend below is the link, at touch height, to the same target.
- The drawer is the React Native `Modal` with a transparent background, holding the unchanged `Sidebar` and a dimmed button that closes it. It closes on Escape (web), on the Back button (Android), on a tap on the dimmed background, on navigation to another page and when the window widens to the desktop tier. It remembers the page and the tier where it opened and closes in the same render when either changes, so Back does not reopen it. The `Modal` of react-native-web traps focus, closes on Escape and returns focus to the button that opened it [Source: `node_modules/react-native-web/dist/exports/Modal/ModalContent.js:26-35` and `ModalFocusTrap.js:66-118`, as cited by the plan]; on the apps it is the modal of the operating system.
- Where wrapping is enough, a row wraps instead of changing with the tier: the project header (the title block has a minimum width and the buttons wrap when room runs out), the row of tabs and the title row of the screen use `flexWrap`, and nothing changes on the desktop. The title block, the freshness and the scope sentence shrink with the row (`flexShrink: 1`), because react-native-web gives a View `flexShrink: 0`. The breadcrumb grows (`flexGrow: 1`) because on the phone there is no search box with `marginLeft: auto` to push the bell to the right. The language select has `height` equal to the touch size on the phone and `flexShrink: 0` at every tier, because WebKit keeps the `height` of a select and ignores `min-height` (measured on WebKit emulating an iPhone 15: 44 x 30, with the text squeezed).
- Touch targets are 44 points. On web they apply at the phone tier only. On the iOS and Android apps they apply at every width: `useTouchTargets` in `src/design-system/tier.ts` is true at the phone tier or when the platform is finger-only (true on the apps, false on web). `useTouch()` gives `{ minHeight: touch, minWidth: touch }` when `useTouchTargets` is true and nothing otherwise. It is applied to Button, Segmented, Select, Menu, BarRow, the rows and the chooser of the sidebar, the tabs of the project header, the bell and the menu button; the language select, the status-bar segments and the search box of the top bar use the same condition. Measured with `uiautomator dump` over the whole page and the drawer: on the Android tablet the old rule left 41 of 75 elements below 44 dp (an item row 18, the Raise change request button 26, the language select 30, sidebar items 28) and the new rule left 0 of 75; an Android 15 phone and Android 7.0 both left 0 of 62.
- The web build also lays text out like iOS and Android (text does not shrink in a row), and no text may leave its frame.

How the tiers are checked:

- Component tests use a default window of 1440 x 900 (`src/window.test.setup.ts`, for the two native Jest projects), because the React Native preset fakes a window of 750 px, which is the phone tier. A test that needs another tier sets `Dimensions.set`.
- The Playwright spec `e2e/web/24-project-overview/narrow.spec.ts` measures 360 and 390 px (phone emulation with `isMobile` and `hasTouch`), 768 and 1024 px, in both languages, on Chromium and WebKit: no horizontal scroll, a window the browser does not scale down, no clipped text, the right shape of the tile grid and of the cards, touch targets of 44 or more on the phone, the drawer opens and closes on Escape with focus returned to the menu button, navigation closes it, and axe finds no serious or critical violation. Every part of the top bar must lie within the height of the bar. The clipped-text check leaves out the top bar, where the breadcrumb is cut on purpose.
- The new measurement was shown red: a temporary build whose `tierOf` always returns `desktop` turned every phone case and the 768 px case red with the window widened to 948 to 962 px, which is the measured defect, and the 1024 px case red because the sidebar was still there.

## Consequences

- Screen 24 no longer breaks on phones, and the desktop did not change: full-page images at 1440 px in both languages were identical pixel for pixel to those of 8 Oct 2026.
- On a tablet the project tree needs two taps, because it is in the drawer.
- Creating a project on a phone would need New added to the drawer, because the phone top bar has no New.
- The drawer has no slide animation. It closes when the device is rotated or the window is resized across a tier, and focus then falls back to the page body, because react-native-web returns focus only to an element that is still on the page [Source: `ModalFocusTrap.js:111-120` of react-native-web, as cited by the plan].
- On a phone the user taps the line of the legend, not the bar, to drill into a status.
- The layout may render twice while a window is resized continuously, which is negligible.

## Status

Current. The three tiers are in the spec the owner approved on 5 Oct 2026 (FE-07, FE-16). They were built on 9 Oct 2026 after the owner found screen 24 broken on phones (FE-23), and the 44 point targets on the apps at every width come from the emulator round (FE-25). The details are rulings of the narrow-widths plan, taken under FE-21.

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 211 to 216 of the original (the three tiers and the drawer proposal), and line 63 (FE-23).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 282 to 291 of the original (the tiers), and lines 757 to 765 and 787 to 792 (the as-built notes for FE-23 and FE-25: tablet, phone, touch targets, the text layout measurement).
- [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md): lines 39 to 80, 81 to 88 (R-N10), 106 to 160 and 265 to 275 of the original (R-N1 to R-N9, R-N11 to R-N26, R-N42), and lines 8 to 33 (the defects measured before the fix).
