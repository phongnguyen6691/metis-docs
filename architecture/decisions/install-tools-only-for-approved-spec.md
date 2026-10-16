---
title: Install a tool only for an approved spec item
summary: A tool or package is installed only when an item of the approved spec needs it, the need is proven by the error line, and every install is logged.
component: all
type: decision
status: current
ids: []
---

# Install a tool only for an approved spec item

## Context

Building and testing the apps on the development Mac kept running into missing tools. On 5 Oct 2026 the Android SDK lacked packages (the NDK, CMake, then the build tools) that building the Android app needs. The owner's answer, translated: install them if they are necessary and listed in the spec the owner had approved (FE-18).

On 9 Oct 2026 the owner asked for the iOS and Android apps to be tested in full on the simulators of that Mac, and for anything missing to be installed (FE-25). The installs that followed were made under FE-18.

## Decision

- Install a tool or package only when an item of the approved spec needs it. For FE-18 the item was the Android app running its Maestro flows on the Android Emulator (sections 9.2 and 11.1 of the front-end spec).
- Prove the need with the error line that the missing tool causes.
- Log every install: what was installed, its version and the error line that justified it.

## Consequences

- Nothing is installed on a hunch, and each install can be traced to a spec item and to a failure. The decision log lists them, and a plan that needed one records it too (ruling R-N39 of the narrow widths plan).
- Installs made under the rule:
  - FE-18: `ndk;27.1.12297006`, `cmake;3.22.1` and `build-tools;35.0.0`, added to the Android SDK already on the Mac.
  - FE-25: OpenJDK 21 from Homebrew for Gradle and Maestro (error line `Unable to locate a Java Runtime`); `fonttools` 4.66.1 in a Python virtual environment, to cut static fonts for Android (error line `ModuleNotFoundError: No module named 'fontTools'`); `@types/react-dom` 19.2.7 as a development dependency (error line `TS7016: Could not find a declaration file for module 'react-dom/client'`); an Android 7.0 system image and virtual device, because the spec supports the Android app from Android 7 and, the log says, the font-weight defect exists only below Android 9 [Unverified - confirm before applying]. The Android tablet virtual device was made from a system image already on the Mac, so nothing was installed for it.
- Each install needs the failure that proves it first, and an entry in the log.
- It rules out installing a tool because it might be useful.

## Status

Current, decided by the owner on 5 Oct 2026 (FE-18) and applied on 9 Oct 2026 (FE-25).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-18 and FE-25 (lines 61 and 65 of the original).
- [Plan of 9 Oct 2026, three width levels](../../history/plans/2026-10-09-frontend-narrow-widths.md): ruling R-N39, the `@types/react-dom` install and its error line (lines 243 to 246 of the original).
