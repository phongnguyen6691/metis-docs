---
title: Brand tools
summary: The scripts that draw the logo files and derive the platform icons.
component: all
type: how-to
status: current
ids: []
---

# Logo toolkit

Builds the Metis logo set from Fraunces 700 glyph outlines: opentype.js extracts outlines, @resvg/resvg-js renders PNGs.

```bash
npm install            # opentype.js and @resvg/resvg-js
./fetch.sh             # downloads Fraunces 700 (optical size 144) from Google Fonts as fraunces.ttf
node extract.js        # writes glyphs.json: the word "Metis" with the dot of the i removed
node gen-logo.js ../logo   # SVG masters, PNG exports and favicon.ico into ../logo
```

`glyphs.json` is committed, so `gen-logo.js` runs without fetching the font. To change the name, edit the word in `extract.js`, run it, then adjust the letter that carries the accent in `gen-logo.js`. Colours come from `INK` and `VIOLET` at the top of `gen-logo.js` and must match `../tokens.css`.

The two platform variants of the app icon (iOS square without rounded corners, Android adaptive foreground) are derived from `../logo/metis-app-icon.svg` by `node platform-icons.mjs <path to a metis-app clone>`, which renders the PNGs with the Playwright Chromium installed in that clone.
