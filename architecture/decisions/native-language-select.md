---
title: The language select on each platform
summary: The language select is a labelled select element on the web, an action sheet on iOS, and a native picker at opacity 0.01 under a drawn face on Android.
component: app
type: decision
status: current
ids: []
---

# The language select on each platform

## Context

The spec shows each language by its own name, with English as the default, as a labelled `select` on the web and as the native picker of the platform on iOS and Android. Plan B used `@react-native-picker/picker` on all three platforms. On the iOS Simulator and the Android emulator that did not work on the top bar:

- The native picker of iOS is a wheel 216 points high, so on the top bar only an empty frame remained [Source: measured on the iOS Simulator, narrow-widths plan R-N29].
- The native picker of Android is 37 pixels wide and shows no text, and its arrow lies over the bell button [Source: measured with `uiautomator dump`, narrow-widths plan R-N30].

## Decision

- **Web.** The labelled `select` element that the picker library draws.
- **iOS** (`Select.ios.tsx`). A button shows the selected choice and an open mark. A tap opens the action sheet of iOS (`ActionSheetIOS`) with the label as its title, and the text of its cancel button comes from the dictionary (`topbar.cancel`; see [Typed dictionaries per screen, English first](typed-dictionaries.md)). The accessible name is "Language, English": the label and the selected language [Source: WCAG 2.5.3, as cited in the narrow-widths plan, R-N29].
- **Android** (`Select.android.tsx`). The same frame as on iOS, with the native picker covering the whole frame at `opacity` 0.01. It is not 0, because Android treats an element with alpha 0 as not visible: Maestro did not find the id `language`, and screen readers skip such an element (measured). It is not a transparent colour either, because the arrow is tinted with SRC_ATOP (`ReactPicker.setDropdownIconColor`) and a transparent colour leaves the arrow as it is: the arrow still lay over the word "English" (measured). The title of the choice dialog is the label (`prompt`).
- **Accessible name on Android.** The native picker has only the label "Language", which hides the text of the selected item from TalkBack. The name is "Language, English", as on iOS. The border of the frame sits on the inner shape, because Yoga places an absolutely positioned child inside the border of its container, which had left the picker 42 points high out of 44 [Source: measured, narrow-widths plan R-N43].

## Consequences

- One control has three code paths, a select element, an action sheet and a native picker under a drawn face. This is the real difference that the platform-file rule allows (see [Four Jest projects, and platform files only for real differences](jest-projects-and-platform-forks.md)).
- The 0.01 looks like a mistake, so its reason must stay written in a comment: a reader who does not know it would "clean it up" and bring the defect back.
- The visible keyboard focus ring of the Android select is not verified. It is not a spec item for the native apps, since the focus ring is a web gate.

## Status

Current, rulings of the narrow-widths plan (R-N29, R-N30, R-N43), taken under FE-21 and measured on the simulators and emulators under FE-25 (9 Oct 2026).

## Sources

- [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md): R-N29 and R-N30 (lines 188 to 197 of the original), R-N43 (lines 276 to 279) and the unverified focus ring (lines 298 and 299).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the language select (lines 320 to 326 of the original) and the as-built note (lines 782 to 784).
- [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md): D-B5 (lines 246 to 248 of the original).
- [Code review report](../../history/code-review/report.md): the reason for the opacity in a comment (lines 103 to 106 of the original).
