---
title: Push updates and rate limits on Valkey
summary: Changes are pushed to screens over WebSocket or server-sent events (undecided), and Valkey counts calls for the rate limits and holds no business data.
component: core
type: decision
status: draft
ids: [PLT-06, MCP-12, TEN-10, TEN-02]
---

# Push updates and rate limits on Valkey

## Context

The BRD asks that other users' changes appear without a manual reload (PLT-06), that rate limits apply per token and per tenant (MCP-12, TEN-10), with a default of 60 MCP calls a minute per token, and that every cache key carries the tenant id (the cache rule of the isolation matrix in TEN-02). [Source: backend proposals, lines 33 and 286; system draft, line 213 of the original]

## Decision

Proposed, not yet decided by the owner:

- `api` pushes changes to screens over WebSocket or server-sent events (SSE); the proposals leave the choice open. The Expo app reads SSE with `expo/fetch`. [Source: backend proposals, lines 33 and 52 of the original]
- Valkey pub/sub carries events between the `api` instances. [Source: backend proposals, lines 33 and 52 of the original]
- Valkey counts calls for the rate limits: by default 60 MCP commands a minute per token, with limits per token and per tenant. [Source: backend proposals, line 33; system draft, line 213 of the original]
- Valkey holds no business data, so it needs no backup. [Source: backend proposals, line 286 of the original]

Carried over from the superseded system draft, to be confirmed:

- There is one SSE stream per project. Events travel from the outbox through Valkey to the `api` instances and then to the screen, and after a reconnect the stream resumes from the last event received. [Source: system draft, line 215 of the original]
- The system draft preferred SSE to WebSocket because the push is one-way and every write still goes over plain HTTP. [Source: system draft, line 21 of the original]
- On iOS and Android, Expo's `fetch` reads streams from SDK 55 and is the default `fetch` from SDK 56, but it has no reader for the event format, so a small reader has to be written. The library `react-native-sse` is not used because it has had no release since March 2024. [Source: system draft, line 215 of the original]
- The write lease on the builder canvas is kept in PostgreSQL, not in Valkey. [Source: system draft, line 214 of the original]

## Consequences

- Valkey needs no backup and restore routine, because it holds no business data. [Source: backend proposals, line 286 of the original]
- One component serves three jobs: cache, event fan-out between `api` instances and call counters. [Source: backend proposals, lines 33, 52 and 286 of the original]
- Open: WebSocket or SSE. With SSE the native apps need their own small reader for the event format. [Source: system draft, line 215 of the original]
- Valkey 9.1.2 is licensed under BSD-3; the organization behind it was not looked up. [Unverified - confirm before applying] [Source: backend proposals, line 52 of the original]
- The write lease of the builder canvas stays out of Valkey, see [One editor holds a short lease on the builder canvas](builder-canvas-single-editor.md). [Source: system draft, line 214 of the original]

## Status

Draft: proposed in the backend proposals of 10 Oct 2026, not decided by the owner. The parts taken from the superseded system draft are carried over and have to be confirmed.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 33, 52 and 286 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 21 and 213 to 215 of the original, carried over, confirm.
- BRD rows PLT-06, MCP-12, TEN-10 and TEN-02, in `business/requirements/`.
