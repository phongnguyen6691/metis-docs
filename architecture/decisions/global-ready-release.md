---
title: One region first, more regions per customer later
summary: Metis starts in one region and is built to open more regions per customer, with each region a full deployment and each tenant tied to a home region.
component: all
type: decision
status: current
ids: [TEN-01, TEN-13, D-20]
---

# One region first, more regions per customer later

## Context

BE-01 asked which market stage one serves and where its data lives. The BRD leaves the cloud, the launch regions and the residency options to a decision that blocks solution design (D-20), plans a per-tenant choice of hosting region for V2 (TEN-13) and already asks for the region to be recorded when a tenant is created (TEN-01). [Source: backend brainstorm log, lines 58, 77 and 78 of the original; BRD rows D-20, TEN-13 and TEN-01]

The proposal was to answer by the real customers of stage one and, whatever the answer, to use only components that follow open standards (PostgreSQL, a Redis-compatible cache, S3-compatible file storage, containers, OpenTelemetry), so that changing region or cloud changes no architecture. [Source: backend brainstorm log, line 71 of the original]

## Decision

The owner answered on 10 Oct 2026: "2 and 3, the first customer may be in Vietnam, but the release must be ready for global customers" (translated). It means: run one region of a major cloud in Singapore for customers in Vietnam and Southeast Asia, and make the release ready to serve global customers and to open more regions per customer. [Source: backend brainstorm log, line 73 of the original]

- Stage one runs in one region. The log reads the owner's answer as a region in Singapore; where it runs is not final, see the last consequence. [Source: backend brainstorm log, line 73 of the original]
- The release is built so that more regions can be opened for a customer later.
- Each region is a full, independent deployment, with its own database, files, cache and workers. [Source: backend brainstorm log, line 77 of the original]
- Each tenant is tied to a home region when it is created. [Source: backend brainstorm log, line 77 of the original]
- A thin global layer holds only the directory from tenant to region, the domain names, the CDN and the sign-in entry point. [Source: backend brainstorm log, line 77 of the original]
- Only components that follow open standards are used: PostgreSQL, a Redis-compatible cache, S3-compatible file storage, containers and OpenTelemetry. [Source: backend brainstorm log, line 71 of the original]

## Consequences

- A region for European or US customers, or a deployment placed in Vietnam, is one more deployment and changes no architecture. [Source: backend brainstorm log, line 78 of the original]
- The per-tenant data location that the BRD plans for V2 (TEN-13) becomes the choice of the home region when the tenant is created. [Source: backend brainstorm log, line 78 of the original]
- The system handles several time zones, currencies and display formats from the start; the app already has English and Vietnamese. [Source: backend brainstorm log, line 84 of the original]
- Every region repeats the whole deployment, and the global layer stays thin on purpose: nothing else is shared between regions. [Source: backend brainstorm log, line 77 of the original]
- It rules out components that tie the system to one cloud or one region, because the open-standards rule exists so that the region or the cloud can change. [Source: backend brainstorm log, line 71 of the original]
- Where stage one runs is not final. On the same day the owner asked for both backend proposals to be drawn and withdrew the question of choosing between them (BE-08). There are two backend proposals, a Singapore proposal and a Vietnam proposal, which share the core and the back-end stack. [Source: backend brainstorm log, lines 188, 220 and 222; backend proposals, lines 24 and 36 of the original]

## Status

Current, decided by the owner on 10 Oct 2026 (BE-01). Where the first region is placed is not final, see the last consequence.

## Sources

- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 58, 71, 73, 77, 78 and 84 of the original (BE-01), and lines 188, 220 and 222 (BE-08 and BE-12).
- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 24 and 36 of the original.
- BRD rows TEN-01, TEN-13 and D-20, in `business/requirements/`.
