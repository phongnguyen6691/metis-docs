---
title: Derived health covers delivery and risk only
summary: The derived project health in the API contract carries an overall level and the reasons for delivery and risk, and no resource or finance level until the BRD defines their rules.
component: app
type: decision
status: current
ids: [OVW-05]
---

# Derived health covers delivery and risk only

## Context

The BRD asks for a computed health on four faces, delivery, risk, resource and financial, shown next to the status that the project manager declares (OVW-05). The spec followed it and described a level and reasons for each of the four faces in the contract. The BRD has no rule yet for project health on the resource and finance faces, and screen 24 shows no level of its own for any face. Any value there would be invented data.

## Decision

The derived health in the API contract carries only an overall level and the reasons of two faces, delivery and risk. The resource and finance levels, and the reasons of those two faces, are not invented: they wait until the BRD defines their rules. The list of reason kinds is closed, so when the back end adds a new kind, the contract changes on both sides.

The open question is written in section 13 of the spec: how the health of the resource and finance faces is computed, and whether each face has a level of its own. It is due before the back end computes project health.

## Consequences

- The app never shows a resource or finance level.
- If the decision proves wrong, the remedy is one extra change of the contract, added to what exists, with nothing that exists broken.
- A new reason kind from the back end is a change on both sides of the contract.

## Status

Current, a decision of plan A taken when it was written, approved by the owner with the plan on 6 Oct 2026 (FE-17), and kept narrow by a ruling taken while the plan ran. The question of the resource and finance faces is open in section 13 of the spec.

## Sources

- [Front-end foundation plan (plan A)](../../history/plans/2026-10-05-frontend-foundation.md): the decision on derived health (lines 146 to 151 of the original) and ruling 8 of the run (lines 4312 and 4313).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the derived health in the contract (line 183 of the original) and the open question (line 702).
