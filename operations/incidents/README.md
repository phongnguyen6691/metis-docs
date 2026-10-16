---
title: Incident reviews
summary: What the incidents folder holds, one review per incident, and why it holds none yet.
component: infra
type: overview
status: current
ids: []
---

# Incident reviews

This folder holds one review per incident, with its timeline, its cause, its fix and its follow-ups [Source: repositories design, section 3.1, line 143 of the original]. It holds none yet, because nothing is deployed: no environment of Metis exists (see [Environments](../environments.md)).

## What a review is

- One incident in one file, with the header type `incident` described in [AGENTS.md](../../AGENTS.md).
- The four parts are the timeline, the cause, the fix and the follow-ups.
- The infrastructure lead reviews changes to this folder [Source: repositories design, section 3.7, line 219 of the original].

## Index

| Review | Incident | Component |
|---|---|---|
| None yet | | |

## Sources

- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 3.1 and 3.7 (lines 143 and 219 of the original).
