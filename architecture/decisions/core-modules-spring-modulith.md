---
title: Modules of the core kept apart by Spring Modulith
summary: Each module of the core is a direct sub-package that Spring Modulith verifies in the architecture check, which fails a cycle, a use of a hidden package or a dependency the module did not declare.
component: core
type: decision
status: current
ids: []
---

# Modules of the core kept apart by Spring Modulith

## Context

The core is one code base of modules built into one image, and tooling must enforce the boundaries of its modules from the start, so that a module that one day needs its own release rhythm can be split along a boundary that was verified all along; see [One code base and one image, run as the API or as its migration job](modular-monolith-core.md). The proposals named ArchUnit or Spring Modulith for the job, see [The same test discipline as the front end](backend-testing.md). The design compared three ways to keep modules apart. [Source: design, section 4.1]

| | Spring Modulith, modules as packages | One Gradle project per module | Packages with hand-written rules only |
|---|---|---|---|
| A module | A direct sub-package of the application; its base package is its interface and every sub-package is hidden, unless named as an interface | A Gradle project with its own build file | A package, by convention |
| What stops a forbidden import | A test that fails: `ApplicationModules.verify()` rejects cycles, access to a hidden package and a dependency a module did not declare | The compiler: the class is not on the classpath | ArchUnit rules the team writes and keeps complete |
| Cost of a new module | A package and one `package-info.java` | A build file, a settings entry, a longer configuration phase | A package and new rules |
| One image, one transaction across modules | Yes | Yes | Yes |
| Module tests and documentation | Built in: a test can start one module with only its declared dependencies, and the module diagram is generated | To build | To build |
| Later split into a service | Along the verified boundary | Along the project | Along whatever the rules covered |

What the first column says of Spring Modulith is on its reference pages. [Source: docs.spring.io/spring-modulith/reference/verification.html, testing.html and documentation.html, read 14 Oct 2026] It is the Spring project for this shape, and it matches the rule of the app, one project until a second consumer exists ([One app, no multi-package workspace](one-app-no-package-workspace.md)).

## Decision

- A module of the core is a direct sub-package of `dev.metis.core`. The types of its base package are its interface; everything under `internal` is hidden from the other modules. A module may expose one of its sub-packages as a named interface.
- Each module lists the modules and named interfaces it may use in its `package-info.java`, with `@ApplicationModule(allowedDependencies = ...)`.
- The architecture check runs `ApplicationModules.of(CoreApplication.class).verify()`, which fails a cycle, a use of a hidden type and a dependency the module did not declare. ArchUnit, on which Spring Modulith is built, adds the rules inside a module: its layers `web`, `app`, `domain` and `data`, and the forbidden APIs; [Develop the core](../../components/core/develop.md#rules-inside-a-module) lists them.
- The version is Spring Modulith 2.1.1, the release built on Spring Boot 4.1.1. Spring Boot does not manage it, so `gradle/libs.versions.toml` holds its BOM. [Source: github.com/spring-projects/spring-modulith/releases/tag/2.1.1, read 14 Oct 2026, as section 9.1 of the design records it] The core compiles against its API alone and only the tests run its verification, so the image carries none of it.

As plan two built it, the core has two modules. `platform` may use no module; it exposes two named interfaces, `web` (the exceptions a module throws) and `security` (`CurrentUser`), and hides `tenancy`, `time` and `logging`. `workspace` may use `platform :: web` and `platform :: security` alone.

## Consequences

- A new module costs a package and its `package-info.java`, and the core keeps one image and real transactions across modules.
- Two counter-tests prove that the check can fail: architecture-hidden-type makes `workspace` call a class of `platform.time.internal` and expects "depends on non-exposed type"; architecture-undeclared-module makes `platform`, which declares no module, call a type of `workspace` and expects "depends on module 'workspace'".
- A later split into a service follows the verified boundary.
- Spring Modulith publishes no end of support. [Source: api.spring.io/projects/spring-modulith/generations, read 14 Oct 2026] Whether the Spring support policy covers it is not stated. [Unverified - confirm before applying] Its rules are ArchUnit rules, so the boundary check can be rewritten on ArchUnit alone if Spring Modulith is ever dropped.
- It rules out a Gradle project per module, and boundaries held by hand-written rules alone.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan two built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.1](../../history/specs/2026-10-14-backend-skeleton-design.md#41-how-modules-are-kept-apart), sections 5.2 and 9.1, and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-02 and BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Global Constraints (line 32).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: the `package-info.java` of `core/src/main/java/dev/metis/core/platform/`, of its `web/` and `security/` and of `workspace/`; `core/src/test/java/dev/metis/core/ArchitectureTest.java` (lines 116 to 119); `core/build.gradle.kts` (lines 31, 38 and 47); `tools/src/main/java/dev/metis/tools/canary/ArchitectureCanaries.java` (lines 106 to 166).
- Pages read on 14 Oct 2026, as the design cites them: docs.spring.io/spring-modulith/reference/verification.html, testing.html and documentation.html; api.spring.io/projects/spring-modulith/generations; github.com/spring-projects/spring-modulith/releases/tag/2.1.1.
