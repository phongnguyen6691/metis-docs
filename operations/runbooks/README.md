---
title: Runbooks
summary: What the runbooks folder holds, one procedure per file, and why it holds none yet.
component: infra
type: overview
status: current
ids: []
---

# Runbooks

This folder holds one procedure per file: how to deploy, how to roll back, how to restore and how to rotate a key [Source: repositories design, section 3.1, line 142 of the original]. It holds none yet, because nothing is deployed: no environment of Metis exists (see [Environments](../environments.md)).

## What a runbook is

- One procedure in one file, with the header type `runbook` described in [AGENTS.md](../../AGENTS.md).
- When a fix in the `troubleshoot.md` of a component is a procedure, that page links the runbook [Source: repositories design, section 3.1, line 137 of the original].
- The infrastructure lead reviews changes to this folder [Source: repositories design, section 3.7, line 219 of the original].

The restore procedures will have to meet the recovery targets of the BRD: at most 15 minutes of data lost in an incident, back within 4 hours, and the restore of one tenant without touching another [Source: backend brainstorm log, line 28 of the original].

## Index

| Runbook | Procedure | Component |
|---|---|---|
| None yet | | |

## Sources

- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 3.1 and 3.7 (lines 137, 142 and 219 of the original).
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 28 of the original.
