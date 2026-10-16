---
title: Where the wireframe and the style guide disagree, build the wireframe and ask
summary: When the wireframe and the style guide disagree, the app follows the wireframe and the disagreement goes to the owner as a question; six visual deviations still await an answer.
component: all
type: decision
status: current
ids: []
---

# Where the wireframe and the style guide disagree, build the wireframe and ask

## Context

The shell and screen 24 are built from the wireframes (the shared shell and the page of the project overview) and from the brand style guide. The two sources disagree in several places, and the 4 Oct 2026 spec disagreed with the wireframe in one more. Each disagreement needed a default that lets the build go on and a question for the owner, who reviews the real screen.

## Decision

Where the wireframe and the style guide disagree, build the wireframe, record each deviation and ask the owner in the open questions of the spec (R-B9).

The cases decided so far:

- The chooser of tenant and workspace. Section 5 of the style guide puts it in the top bar and the wireframe puts it in the sidebar. The app puts it in the sidebar, as the wireframe does.
- The Delayed tile. The 4 Oct 2026 spec said it shows "not baselined", but the wireframe has baseline v1 and a Delayed figure of 2. By the BRD "not baselined" is the state of the tile when the project has no baseline. So the default follows the wireframe, and "Not baselined" is a state of its own and not the default value.
- Six visual deviations, built as the wireframe draws them until the owner rules:
  - the logo is 24 high (68.58 wide), below the minimum of 96 px of the style guide;
  - the project title is 26 where `--fs-display` is 30;
  - the faded button is drawn in `muted` by the wireframe stylesheet, the app and the style guide's table and HTML, although the version history of the original guide says that version 0.5 changed it to the primary text colour (`brand/style-guide.md`, kept in the owner's private store, line 267 of the original);
  - some font sizes sit below the floor: freshness 11.5, labels 11.5, counts and the Planned label 11, group labels 10.5;
  - the horizontal padding of a list row is 14 where the style guide says 16;
  - weight 700 is requested in four places and drawn as 600. Measured on the wireframe, the letter `b` of the workspace chooser is identical at 600, 700 and 800 (width 100.234375), and the wireframe stylesheet loads only Inter 400, 500 and 600 (D-B24).
- The dialog follows the wireframe in three details: the opacity of the overlay is the 0.32 of the wireframe and not the 0.4 first used by the app, the dialog has the shadow of the wireframe through a token, and it has no 1 px border because the dialog of the wireframe has none and the new shadow already sets the box apart from the background.

## Consequences

- The screen the owner reviews matches the wireframe, and every deviation from the style guide is listed.
- The sizes may change after the review: the answer to the six deviations decides whether the style guide or the wireframe wins each one.
- The overlay is lighter than it was before the dialog followed the wireframe, and the dialog has no border; both changes are visible, and the removal of the border was included in the review package.
- The owner's answer is pending. Until it arrives, the six deviations stay as built.

## Status

Current. The place of the chooser and the Delayed tile follow the design the owner approved on 5 Oct 2026 (FE-07, FE-16). The rule for the six visual deviations is a ruling of the overview-screen plan taken under FE-21 (R-B9, D-B24), and the owner's answer to them is pending, to be given at the review of screen 24. The three dialog details are rulings of the code clean-up taken under FE-27 and FE-28.

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 163 to 164 and 185 to 188 of the original (the chooser, the Delayed tile).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 218, 233 to 234 and 713 of the original (the chooser, "Not baselined", the open question on the six deviations).
- [Overview screen plan](../../history/plans/2026-10-06-frontend-overview-screen.md): lines 172 to 177 (R-B9) and 314 to 316 (D-B24) of the original.
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): lines 1007, 1011 and 1014 of the original (rows 30, 34 and 37 of its table of rulings).
- [Brand style guide](../../design/brand/style-guide.md) (section 6, the faded button on line 194), [style-guide.html](../../design/brand/style-guide.html) (line 56), the wireframe stylesheet [wireframe.css](../../design/wireframes/assets/wireframe.css) (line 128) and the version history of the original guide (`brand/style-guide.md`, kept in the owner's private store, line 267 of the original): the colour of the faded button.
