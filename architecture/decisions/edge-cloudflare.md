---
title: Cloudflare at the edge
summary: Cloudflare provides DNS, CDN, a web firewall, protection against denial-of-service attacks and bot rules at the edge of the network.
component: infra
type: decision
status: draft
ids: []
---

# Cloudflare at the edge

## Context

Metis needs a layer at the edge of the network for domain names, content delivery and the filtering of hostile traffic. The proposals tie it to the requirement to protect every connection and to serve the MCP endpoint over TLS only (the BRD's security requirement for the AI interface). [Source: backend proposals, line 279 of the original]

## Decision

Proposed, not yet decided by the owner:

- Cloudflare provides the domain names (DNS), the CDN, a web application firewall, protection against attacks that take the service down, and bot rules that make an exception for the mobile app. [Source: backend proposals, line 279 of the original]
- It protects every connection, and the MCP endpoint is served over TLS only. [Source: backend proposals, line 279 of the original]

## Consequences

- Cloudflare lists ISO 27001:2022, ISO 27018 and ISO 27701, SOC 2 Type II and PCI DSS 4.0 level 1. That is supplier evidence for the supplier controls of ISO 27001, see [ISO 27001 first, SOC 2 Type II when customers ask](security-certification-path.md). [Source: backend proposals, line 279 of the original]
- Open: the sources do not say which hop ends TLS. Cloudflare protects every connection and App Platform also lists TLS among its roles (see [Production on one provider, DigitalOcean as drawn, not confirmed](production-hosting.md)), but neither source line says where TLS ends. [Source: backend proposals, lines 279 and 280 of the original]

## Status

Draft: proposed in the backend proposals of 10 Oct 2026, not decided by the owner.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 279 and 280 of the original.
