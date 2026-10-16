---
title: ISO 27001 first, SOC 2 Type II when customers ask
summary: Metis aims for ISO/IEC 27001:2022 first and SOC 2 Type II when customers ask, manages its suppliers as ISO 27001 requires, and passes an independent penetration test before go-live.
component: all
type: decision
status: draft
ids: [D-31, TEN-02]
---

# ISO 27001 first, SOC 2 Type II when customers ask

## Context

Enterprise buyers usually ask for an independent security attestation, so the BRD asks to choose a compliance target, for example SOC 2 Type II or ISO 27001, and to design the controls for it from the start (D-31). It also asks for an external penetration test before go-live (TEN-02). [Source: backend proposals, lines 19, 304 and 314 of the original]

Metis builds on infrastructure suppliers, so the question is also what those suppliers have to show. [Source: backend proposals, lines 303 and 325 of the original]

## Decision

Proposed, not yet decided by the owner:

- An independent penetration test happens before go-live, and it is mandatory. Its scope has to include the hand-written magic-link authenticator, the MCP gateway and the cross-tenant check through row-level security. [Source: backend proposals, lines 19, 206 (first sentence) and 304 of the original]
- ISO/IEC 27001:2022 comes first and is mandatory. SOC 2 Type II follows when customers ask. [Source: backend proposals, lines 19, 314 and 315 of the original]
- Supplier controls follow ISO 27001, which does not require a supplier to hold ISO 27001 but requires Metis to manage its suppliers: a policy, contracts with security clauses, periodic monitoring and a way to handle data when a supplier is left (controls 5.19 to 5.23 of ISO/IEC 27001:2022). A supplier's SOC 2 Type II report or ISO 27001 certificate is the evidence auditors usually ask for. [Source: backend proposals, line 303 of the original]
- From each infrastructure supplier Metis collects a certificate that covers the services and data centers actually used and an audit report from the last 12 months. [Unverified - confirm before applying] [Source: backend proposals, line 325 of the original]
- For the SOC 2 of Metis the infrastructure suppliers are subservice organizations. The usual method (carve-out) relies on the supplier's own SOC 2 report; if a supplier has none, the chain of assurance breaks and a direct inspection may be needed. [Unverified - confirm before applying] [Source: backend proposals, line 325 of the original]

The other standards considered, with the level proposed for each:

| Standard | What it is | Why Metis needs it | Level |
|---|---|---|---|
| ISO/IEC 27001:2022 | Information security management system, certified by an accredited body; every certificate of the 2013 edition expires from 31 Oct 2025 | D-31, controls designed from the start | Mandatory, first |
| SOC 2 Type II | Report of a CPA audit firm that controls are designed and operate well over a period; Type I only looks at the design on one date | The same; US customers often ask | When customers ask |
| ISO/IEC 27017:2026 | Security controls for cloud services, issued together with 27001 | Metis both provides a cloud service (SaaS) and uses the cloud | Should have |
| ISO/IEC 27018:2025 | Protection of personal data processed on behalf of customers in the cloud | Metis holds the employee data of customers | Should have |
| ISO/IEC 27701:2025 | Privacy management system, a standalone standard from the 2025 edition | European customers and GDPR questions | Later |
| ISO/IEC 42001:2023 | AI management system | Metis has AI agents and MCP, and the question of EU AI Act Article 50 is open (Q-16) | Later |
| CSA STAR | Level 1 is a self-declared CAIQ questionnaire; level 2 builds on ISO 27001 or SOC 2 | Customers look up the STAR registry | Level 1 early |
| PCI DSS | Applies only to parties that hold, process or transmit card data | Not needed, because invoicing is outside the product (D-27) | No |

[Source: backend proposals, lines 310 to 321 of the original]

## Consequences

- The effort is an information security management system certified by an accredited body for ISO 27001, a SOC 2 report by a CPA audit firm when customers ask, the penetration test before go-live, and supplier management as listed above. [Source: backend proposals, lines 303, 314 and 315 of the original]
- Suppliers differ in what they can show: see [Cloudflare at the edge](edge-cloudflare.md) and [Production on one provider, DigitalOcean as drawn, not confirmed](production-hosting.md) for what the edge and the hosting provider list. A supplier without a report may have to be inspected directly. [Source: backend proposals, line 325 of the original]
- Software that Metis runs itself, such as Keycloak, has no certificate of its own and is covered by Metis's controls and the penetration test, see [Keycloak 26 for sign-in, with a magic-link authenticator](identity-keycloak.md). [Source: backend proposals, lines 206 and 283 of the original]
- It rules out treating a supplier's certificate as a substitute for Metis's own supplier management: ISO 27001 asks Metis to manage its suppliers, and the supplier's report is only the evidence. [Source: backend proposals, line 303 of the original]
- Open: whether Article 50 of the EU AI Act applies to Metis, and for which customers (Q-16).

## Status

Draft: proposed in the backend proposals of 10 Oct 2026, not decided by the owner. The BRD (D-31) requires a compliance target; the owner has not chosen it.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 19, 206 (first sentence), 283, 303, 304, 310 to 321 and 325 of the original.
- BRD rows D-31, TEN-02, D-27 and Q-16, in `business/requirements/`.
