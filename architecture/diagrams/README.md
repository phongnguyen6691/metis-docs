---
title: Architecture diagrams
summary: The eleven pitch diagrams of what Metis runs on, how the app is built and tested, the two hosting proposals with their prices, the legal and security requirements and why each component was chosen, and how to rebuild them.
component: all
type: overview
status: current
ids: []
---

# Architecture diagrams

Eleven drawings, each 1920 by 1080, drawn on 10 and 11 Oct 2026 to pitch Metis. The owner keeps them here whole, prices included: [Pitch diagrams in the documents, the rest of the pitch material out](../decisions/pitch-diagrams-in-docs.md).

## The drawings

| Drawing | Shows | Built or proposed |
|---|---|---|
| [01-what-metis-runs-on.svg](01-what-metis-runs-on.svg) | The users, the app, the edge, the backend, the data stores and the outside services, each with its technology and what it is used for | The app is built; everything behind it is proposed |
| [02-frontend-architecture.svg](02-frontend-architecture.svg) | How one code base becomes a website, an iPhone app and an Android app, and the path of one request from tap to screen | The build is as built; the edge and the backend are as proposed |
| [03-frontend-test-pipeline.svg](03-frontend-test-pipeline.svg) | The 13 checks that `pnpm verify` runs on the app, in order, each with its tool and its result in the full run of 10 Oct 2026 | Built |
| [04-proposal-singapore.svg](04-proposal-singapore.svg) | The Singapore proposal with its services at several suppliers: where each part runs and its price a month | Proposed |
| [05-proposal-singapore-single-provider.svg](05-proposal-singapore-single-provider.svg) | The Singapore proposal on one provider: the same layout with PostgreSQL and Temporal moved into DigitalOcean, its price a month, the same layout priced at other clouds, scaling and the environments | Proposed |
| [06-scattered-vs-single-provider.svg](06-scattered-vs-single-provider.svg) | The two Singapore layouts side by side: what moves, the network path, the suppliers on the bill, the recovery commitments and the monthly totals | Proposed |
| [07-proposal-vietnam.svg](07-proposal-vietnam.svg) | The Vietnam proposal on a Vietnamese cloud: where each part runs and its price a month | Proposed |
| [08-singapore-vs-vietnam.svg](08-singapore-vs-vietnam.svg) | Singapore against Vietnam beyond cost, one row per criterion, from the law to price transparency | Proposed |
| [09-legal-and-security.svg](09-legal-and-security.svg) | What the law asks of a Singapore entity and of a Vietnam entity, the certifications of each supplier, the supplier controls of ISO 27001 and the budgets of the audits and of the penetration test | Proposed |
| [10-why-these-components.svg](10-why-these-components.svg) | Why each component was chosen, part 1 of 2: the edge, the servers and the databases, each with what it does, the requirement it meets and the evidence | Proposed |
| [11-why-these-components-services.svg](11-why-these-components-services.svg) | Why each component was chosen, part 2 of 2: files, services and tooling | Proposed |

## How to read them

- A drawing is a picture of the day it was drawn, which its footer gives. Nothing updates it when the app, a provider or a price changes.
- The prices are in US dollars a month, before VAT, as the providers listed them on 10 Oct 2026. The Vietnam drawing converts from Vietnamese dong at the rate it names.
- What a drawing proposes is decided only when its decision record says so. The hosting is a draft: [Production on one provider, DigitalOcean as drawn, not confirmed](../decisions/production-hosting.md). So is the certification path: [ISO 27001 first, SOC 2 Type II when customers ask](../decisions/security-certification-path.md).
- The pages keep the technical content of the drawings without financial figures: [Architecture overview](../overview.md) for the parts and the path of a request, [Develop the app](../../components/app/develop.md) for the checks of the app as they are now.
- A footer names its sources by the path they had when the drawing was made. The backend proposals and the financial model are kept in the owner's private store, `apps/metis` is the app that is now `metis-app`, and the files under `.superpowers` are working notes on the owner's machine.

## Rebuild

The drawings are generated: change `src/data.mjs`, never an SVG. From `src/`, with Node 24:

```bash
node build.mjs <the root of a metis-app clone>
node render.mjs <the root of a metis-app clone> <a folder outside this repository>
```

- `build.mjs` writes the eleven SVG files. It measures every text in the Chromium that Playwright installs in that clone, so the clone needs its dependencies installed.
- It stops, and writes nothing for that drawing, on a text wider than its card, a total that differs from the `expect` of the data, an em or en dash, a font size under 14 px, or a character the embedded fonts do not cover.
- `FROZEN` in `src/data.mjs` lists the drawings the build never rewrites: when a change of the data would alter one of them, the build stops instead. To change a frozen drawing on purpose, take it off the list for that build.
- `render.mjs` checks the layout of each SVG in the same browser (text on text, text outside its card, a line through text or through a card) and writes one PNG per drawing for review. The PNG files stay out of this repository.
- `node tools/check.mjs` reads the drawings and the scripts as text, so the English-only and the dash rules apply to them, but it does not rebuild them: the build needs a browser.

## Icons, logos and fonts

- Icons: lucide-static 1.48.0, under the ISC licence, some of them from Feather, under the MIT licence. Logos: simple-icons 16.32.0, under CC0 1.0, and a few under the terms each footer names. The logos are trademarks of their owners.
- `src/icons.json` holds the shapes the drawings use, taken once from the two packages by `src/extract-icons.mjs`. The licence texts are in `src/licenses/`.
- Fonts: Inter and Manrope, under the SIL Open Font License 1.1, embedded in every SVG so that a drawing looks the same on every machine. The font files and their licence texts are in `src/fonts/`.
