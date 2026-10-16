---
title: Agents run on their own recommendations; only the owner commits
summary: Agents decide on their own recommendations and run to the deliverable, stopping only before irreversible, security-sensitive or outward actions, and only the owner commits.
component: all
type: decision
status: current
ids: []
---

# Agents run on their own recommendations; only the owner commits

## Context

The front end was built by a coordinating agent and sub-agents, and the coordinator decided in the owner's place under FE-21 and FE-28. Three answers of the owner fixed how far the agents go alone:

- 6 Oct 2026 (FE-19): the owner approved running the foundation plan straight in the repository on `main`, with sub-agents in parallel lanes. The repository had no commit yet, so no branch or worktree could be split off. The agents do not commit.
- 6 Oct 2026 (FE-21): the work had stopped to ask for approval of the second plan. The owner objected, in words translated here: the point is to review screen 24, everything was to follow the recommendations up to the last step, so why stop?
- 10 Oct 2026 (FE-28): for the code cleanup plan the owner asked to execute it as soon as it was written, with parallel tasks to deliver faster, every decision following the recommendations, and no stop to ask anything until every error is fixed.

## Decision

- The coordinating agent decides on its own recommendations. It does not stop to ask for approval of a plan or of a single decision (FE-21, FE-28).
- Each decision is written in the plan or the run ledger with its reason and the consequence if it proves wrong (FE-28).
- The agents run to the deliverable the owner will review: screen 24 working in a browser for FE-21, every finding fixed for FE-28.
- Tasks that edit different files run in parallel, each on its own lane (a separate working copy that writes only its own area), and are merged back afterwards (FE-19, FE-28).
- Agents stop only before an action that cannot be undone, a security-sensitive action, or an action that leaves the repository: commit, push, publish (FE-21).
- Agents never run `git add`, `git commit` or `git push`. Each task report lists the files it changed, and the owner commits (FE-19, FE-21, FE-28).

## Consequences

- The owner meets the result at the end, not at each step. The ledger of decisions, each with its reason and the consequence if it was wrong, is what makes a run reviewable afterwards.
- A decision the owner would have made differently is met only at the review of the deliverable.
- Nothing outward happens without the owner: no commit, push or publication. Because nothing is committed, the review package of a run is the difference between two snapshots of the tree, as in the code cleanup run.
- What the owner reviews at the end of a run starts with anything cut from the approved spec (see [A plan never drops an approved spec requirement](never-cut-an-approved-spec-item.md)).
- The machine load limits of FE-26 still apply to parallel lanes (FE-28); see [Checks must not overload the machine](resource-caps.md).
- It rules out stopping in the middle of a run to ask for plan approval, and it rules out any commit by an agent.

## Status

Current, decided by the owner on 6 Oct 2026 (FE-19, FE-21) and on 10 Oct 2026 (FE-28).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-19, FE-21 and FE-28 (lines 58, 60 and 68 of the original).
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): the global constraint on git commands (line 17 of the original), the coordinator deciding in the owner's place (line 974), and rows 1 and 2 of its table of rulings made during the run, on parallel lanes and on no commit (lines 978 and 979).
