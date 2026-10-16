---
title: Coverage 100, mutation 100, no unused code
summary: A line of code enters only when machines prove it, with coverage and mutation score at 100, nothing unused, and a new helper needing two callers.
component: app
type: decision
status: current
ids: []
---

# Coverage 100, mutation 100, no unused code

## Context

On 5 Oct 2026 the owner set the standard for tests and for lean code (FE-12). The owner wanted the framework to include every test suite, so that it can be integrated into CI/CD later, with the suites covering unit, end-to-end and performance tests, and also required that every line of code written has every testing mechanism behind it. Code must not be written wildly, and no dead function, no dead line and no feature that is no longer used may sit there unnoticed. The app must be lean and clean, with beautiful code, the best performance, and behaviour that matches what is expected. The owner approved the test system and code leanness of the design, with its sections on browser and device compliance and on where the checks run, with "ok" (FE-13).

The spec had proposed a mutation score of 90%. A trial of the foundation plan measured that a threshold of 90% let one live mutant of 11 through.

## Decision

A line of code enters only when machines prove that it is needed and correct. Each of the five conditions is a gate:

1. A test runs through it. Coverage is 100% of lines and branches over the whole source. An exclusion is allowed only through a list that gives a reason for each item, for example platform glue that can only be tested on a real device.
2. The test really catches errors. Mutation testing with StrykerJS must reach a score of 100, not the 90% proposed. A mutant that truly changes no behaviour is turned off one place at a time with `// Stryker disable next-line <mutator>: <reason>`, and a lint rule requires the reason. When the plan was written, three surviving mutants were handled by rewriting the code or adding tests, with no disable line.
3. Something uses it. Knip finds no unused file, export or dependency; no dictionary key is left unread; no token is left unused unless it sits on a debt list that may only shrink. Removing a feature makes these gates force the removal of its code, text and dependencies.
4. If it is a control, it is in the screen contract.
5. It traces to a requirement: every requirement code that the contract declares has at least one test carrying that code in its name (see [`contract.yaml` is each screen's promise, traced to tests](screen-contract-and-trace.md)).

Added for lean and clean code: strict TypeScript, which forbids unused variables and parameters; ESLint with the boundary rules (see [Plain core, shared shell, layers enforced by lint](layers-enforced-by-lint.md)); a ceiling of 10 on the cyclomatic complexity of a function and of 300 lines on the length of a file, which the spec proposed and the lint rules `complexity` and `max-lines` enforce; a reason for every disabled lint rule; and Prettier.

Every gate is a command, `pnpm gate:<name>`, that runs on the developer's machine. CI and `pnpm verify` call the same commands, and no logic lives only in a CI file.

What stays inside coverage but outside mutation testing:

- The mock data in `src/mocks/fixtures/`. It is data and not logic, and a mutated letter would only be killed by a test that copies the data back as it is. The contract test pins it, and the handlers of the mock server stay inside mutation testing.
- The dictionaries `strings/en.ts` and `strings/vi.ts`, for the same reason. The dictionary test pins the Vietnamese against the original, the model tests pin the English text and the browser tests pin the text as drawn.
- The style files `*.styles.ts`. They stay in coverage, in the token rule and in the browser measurement of shapes.
- The tools in `scripts/` and `eslint-rules/`. They are under 100% coverage and under the rule that every file has a test beside it. The plan found no StrykerJS runner for `node --test` [Unverified - confirm before applying], and the counter-tests are the end-to-end test of each gate.

A new helper needs at least two callers in the change that creates it. A deliberate simplification is marked with a `ponytail:` comment that names the ceiling and how to raise it.

## Consequences

- Writing tests that are tight enough to kill every mutant takes more effort, and equivalent mutants have to be turned off one by one, each with a reason.
- A live mutant in the tools can slip through; the counter-tests catch most of them.
- A typo in a dictionary is caught only by review, and a style defect that the browser measurement does not measure can slip through.
- Dead code, untraced code, an unused token and a helper with a single caller are all ruled out.
- The other suites of the test system, and where they run, have their own decisions: [A screen is done when its gates pass, each proven able to fail](gates-with-canaries.md) and [CI runs `pnpm verify`; macOS work runs on a Mac; every run leaves a record](where-checks-run.md).

## Status

Current, decided by the owner on 5 Oct 2026 (FE-12, FE-13). The threshold of 100 was set by the foundation plan that the owner approved on 6 Oct 2026 (FE-17). What stays outside mutation testing is set by rulings of the foundation plan and the overview-screen plan, taken under FE-17 and FE-21. The rule on helpers comes from the code clean-up, taken under FE-27 and FE-28.

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 52, 55 and 372 to 391 of the original (FE-12, FE-13, the five conditions).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 467 to 507 and 673 to 684 of the original (the rule, the suites, the numbers).
- [Foundation plan](../../history/plans/2026-10-05-frontend-foundation.md): lines 88 to 92 and 129 to 136 of the original (the threshold of 100, the data and the tools outside mutation testing).
- [Overview screen plan](../../history/plans/2026-10-06-frontend-overview-screen.md): lines 195 to 197 (styles, R-B14) and 263 to 266 (dictionaries, D-B9) of the original.
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): line 30 of the original (the rule on helpers).
