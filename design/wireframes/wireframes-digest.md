---
title: Wireframes text digest
summary: The text and annotations of every wireframe screen, for readers and AI agents that cannot read the images.
component: all
type: reference
status: current
ids: []
generated_from: design/wireframes/tools/build-index.mjs
---

# Metis wireframes: text digest

Generated 2026-10-03 from screens/*.html by tools/build-index.mjs. For each of the 58 screens: metadata, the screen content in reading order (app chrome such as the sidebar is omitted; [n] marks an annotation), then the annotations. The images are in png/.

## 01 Sign in

- File: screens/01-sign-in.html · image: png/01-sign-in.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: 01
- Requirements: PLT-01, PLT-02, PLT-03, TEN-03
- Context: none
- Purpose: Tenant-aware sign-in: SSO by work email, email and password with MFA, magic link for invited external users, invitation acceptance, no public demo.

### Content

    Enterprise portfolio intelligence & governance
    From strategy to closeout, one governed workspace.
    See what the company invests in, run every project on one WBS, and let your own AI assistant work with the data under the same permissions.
    1 Portfolio cockpit for executives
    Investment, health, capacity and the decisions that need you.
    2 Charter to closeout for project teams
    Charter, WBS, plan, change control and reports on one source of truth.
    3 Your LLM client, through MCP
    Any client that implements the MCP specification can read and log work in natural language, with the same permissions and audit as the app.
    Acme Holdings sign-in · there is no public demo; ask your admin for the sandbox workspace [5]
    [4]
    You are invited to Acme Holdings
    Q. Tran invited you to the Creative Studio workspace as a Team member. Sign in or create your account to accept.
    Sign in
    Use your work email. We send you to your company's sign-in page.
    Work email nadia.r@acme.example
    Continue with SSO [1]
    acme.example signs in with your company identity provider
    or use a password
    Email name@company.example
    Password ••••••••••••
    Sign in
    Step 2 of 2 · verification code [2]
    Enter the 6-digit code from your authenticator app. Your admin requires MFA for every member.
    4
    1
    9
    ·
    Verify
    Keep me signed in on this device Use a recovery code
    Invited as an external user? [3]
    Clients and partners get a one-time sign-in link by email. You only see the projects you were invited to.
    j.park@northwind.example
    Send magic link

### Annotations

1. TEN-03 The email domain decides the tenant and its identity provider (SAML 2.0 or OIDC); members of an SSO tenant never see a password form unless the admin allows it.
2. TEN-03, PLT-01 Password sign-in always ends with MFA when the tenant requires it. The session persists across browser restarts until it expires or the user signs out.
3. PLT-02 External users (for example the client contact J. Park) sign in with a magic link and see only the projects they are invited to; this path exists only if client access is approved (decision D-02).
4. PLT-03 An invitation link opens this page with the banner; accepting creates the membership with the role chosen by the inviter.
5. PLT-01 Unlike the POC there is no "Explore the demo workspace" button: demos run in a resettable sandbox workspace inside each tenant (PLT-19, decision D-21).

## 02 Tenant admin: users and roles

- File: screens/02-tenant-admin-users.html · image: png/02-tenant-admin-users.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: TEN-04, PLT-03, PLT-04, WSP-11, TEN-11, BR-26
- Context: data-nav=admin-users
- Purpose: Tenant admin manages every user of the organization: invitations, workspace and project roles, deactivation that keeps history, and SCIM provisioning later.

### Content

    Users & roles
    Acme Holdings · 180 of 250 seats used · 3 workspaces
    Import CSV
    Invite users [1]
    Search Name or email
    Type All
    Status All
    Workspace All workspaces
    Role Any role
    Users Showing 11 of 182
    Name | Roles [2] | Status | Last active
    QT Q. Tran
    q.tran@acme.example · Member
    | Tenant admin | Active | Today 09:12
    LT Linh T.
    linh.t@acme.example · Member
    | Digital Products · Executive | Active | Today 08:40
    AW A. Wong
    a.wong@acme.example · Member
    | Digital Products · Product Director +1 | Active | Today 08:55
    MJ M. Johnson
    m.johnson@acme.example · Member
    | Digital Products · Portfolio Manager | Active | Yesterday
    LW L. Wang
    l.wang@acme.example · Member
    | Digital Products · Project Manager +1 | Active | Today 07:58
    HL H. Le
    h.le@acme.example · Member
    | Creative Studio · Workspace Owner | Active | Today 09:05
    NR Nadia R.
    nadia.r@acme.example · Member
    | Creative Studio · Project Manager +1 | Active | Today 09:31
    DK Denny K.
    denny.k@acme.example · Member
    | Creative Studio · Team member | Active | Yesterday
    JP J. Park
    j.park@northwind.example · External
    | Creative Studio · Client · 1 project | Active | 18 Sep
    ? Pending invitation
    new.analyst@acme.example · Member
    | Corporate PMO · Viewer | Invited | Sent 20 Sep
    AL Art Lead
    art.lead@acme.example · Member
    | None · history kept | Deactivated [4] | 12 Aug
    NR Nadia R.
    nadia.r@acme.example · Member · MFA on
    Active
    Workspace roles [3]
    Workspace | Role
    Creative Studio | Project Manager
    Digital Products | No access
    Corporate PMO | Viewer
    Project overrides
    Meridian CGI Campaign
    Creative Studio · Client Delivery
    Project Manager
    Northwind Showroom VR
    Creative Studio · Client Delivery
    Team member
    + Add project override
    Effective access: Creative Studio projects as Project Manager, Corporate PMO read-only. Checked on the server for the app, MCP and API alike.
    Deactivate user
    Save changes
    Deactivating revokes access at once, revokes her MCP tokens and keeps her name on items, comments and history.
    Automatic provisioning (SCIM) [5] Planned V2
    Create, update and deactivate users and group-based roles from your identity provider.
    SCIM setup will open from this card once it is available.

### Annotations

1. PLT-03, TEN-04 Invite one or many people by email with a workspace role; they join on acceptance. Seats come from the plan, so an invite beyond 250 seats is blocked with a clear message.
2. WSP-11 Roles are assigned per workspace; "+1" opens the other roles of that person (for example A. Wong is also a Gate Approver).
3. WSP-11, PLT-04 Workspace role plus optional project overrides give the effective permission; the server enforces it for the web app, MCP clients and the API.
4. BR-26 A deactivated member loses access immediately but stays on existing items and history, as the POC already did for "Art Lead".
5. TEN-11 SCIM provisioning is P1; until then the admin invites, imports from CSV, or relies on just-in-time provisioning from SSO.

## 03 Tenant admin: sign-in and security

- File: screens/03-tenant-admin-security.html · image: png/03-tenant-admin-security.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: TEN-03, TEN-04, TEN-09, PLT-01
- Context: data-nav=admin-security
- Purpose: Tenant-level identity: SSO with SAML 2.0 or OIDC and verified domains, MFA and password policy, session lifetime, and time-limited support access grants for provider staff.

### Content

    Sign-in & security
    Applies to every workspace in Acme Holdings · last changed by Q. Tran on 2 Sep 2026
    Save changes [5]
    Single sign-on [1] Connected
    Protocol SAML 2.0 OIDC
    Identity provider metadata URL https://idp.acme.example/saml/metadata
    Signing certificate Valid until 14 Mar 2027
    Default workspace role on first sign-in No workspace access
    Verified domains
    acme.example
    Verified
    studio.acme.example
    Pending DNS record Verify
    Create users on first SSO sign-in (just-in-time)
    Members of verified domains must use SSO
    Tenant admins keep a password and MFA sign-in as a break-glass route.
    Passwords and MFA [2]
    Require MFA for every member
    Authenticator app Security key Text message
    Minimum password length 12 characters
    External users Magic link only
    Sessions [3]
    Session lifetime 12 hours
    Sign out after inactivity 60 minutes
    Remember trusted devices for 30 days Sign out all users
    IP allowlist Planned V2
    Limit sign-in to company networks for members; external users are exempt.
    Support access [4] Provider staff never see your business data without a grant Grant access
    Provider staff | Reason | Scope | Granted by | Expires | Status |
    MS Metis support engineer
    | Ticket #2291 · report export fails | Read-only · Digital Products | Q. Tran | 24 Sep 2026, 18:00 | Active | Revoke
    MS Metis support engineer
    | Ticket #2204 · SSO set-up | Read-only · Tenant settings | Q. Tran | 12 Sep 2026, 17:00 | Expired | View log
    Ticket or reason Required
    Scope Read-only · one workspace
    Duration 72 hours
    Create grant

### Annotations

1. TEN-03 Each tenant connects its own identity provider (SAML 2.0 or OIDC). Verified domains route sign-in; just-in-time users start with no workspace access until an admin assigns a role.
2. TEN-03 MFA is a tenant policy for members; external client users sign in with magic links only.
3. PLT-01 Session lifetime and inactivity time-out are configurable; "Sign out all users" ends every session at once.
4. TEN-09 Support access is granted by the tenant admin, scoped, time-limited and visible in the audit log; it expires on its own.
5. TEN-04 These settings belong to the tenant admin console; every change is recorded with actor, before and after values (BR-19).

## 04 Tenant admin: AI access (MCP)

- File: screens/04-tenant-admin-ai-access.html · image: png/04-tenant-admin-ai-access.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: MCP-01, MCP-02, MCP-03, MCP-04, MCP-08, MCP-12, MCP-13, MCP-14, MCP-16, MCP-19, MCP-20, TEN-04
- Context: data-nav=admin-ai
- Purpose: Tenant policy for the MCP server: endpoint, how clients sign in, scopes by role, action classes and their policy, client allowlist and workspace restrictions, data protection, rate limits, and every active token with revoke.

### Content

    AI access (MCP)
    Lets LLM clients that implement the MCP specification read and log work in Acme Holdings, acting as the signed-in user. Verified clients are listed on each user's AI access page.
    MCP server enabled Save policy
    Endpoint [1] Healthy
    https://acme.mcp.metis.example/mcp
    Copy
    Transport Streamable HTTP Protocol version 2026-07-28 Scope One endpoint for the tenant; data filtered per user
    How clients sign in [2]
    Personal access tokens (Authorization: Bearer)
    OAuth (MCP authorization flow)
    Maximum token lifetime 90 days
    Default lifetime 30 days
    Revoke a user's tokens when the user is deactivated
    Rate limits [5]
    Per token 60 calls a minute
    Per tenant (plan) 100,000 a month
    Used this month 41,200 of 100,000
    Over the limit a client gets a retry-after error; the web app is never slowed down.
    What each role may allow [3] Token scopes can only narrow this
    Role | Read | Append | Update
    Executive | Portfolio, projects | Journal, comments | No
    Portfolio Manager | Portfolio, projects | Journal, comments | Second increment
    Project Manager | Own projects | Journal, comments | Second increment
    Team member | Assigned projects | Comments | No
    Viewer | Granted views | No | No
    Client (external) | No MCP access | No | No
    Action classes [7] Policy per class
    Read
    Runs directly. list_projects, get_project_overview, get_wbs_items, get_my_focus, list_risks, get_report
    On
    Append-only
    New journal entries and comments; runs directly and is attributed to the user and token in activity. add_journal_entry, add_comment
    On
    Reversible write
    Field updates and drafts, undoable from the item's activity; each call needs a record version and an idempotency key. update_wbs_item, create_change_request_draft, create_risk, generate_report
    Ask the user to confirm in the app
    Second increment
    Prepare-only [4]
    Governance actions: approvals, gate and portfolio decisions, baseline changes, deletions, permission and token changes; a person confirms them in the app
    Prepare only 🔒
    Client allowlist [8] Clients that may connect Named list
    Client | Status | Users |
    Chat assistant (OAuth)
    First seen 4 Aug 2026
    | Allowed | 12 | Block
    Team analytics agent
    First seen 30 Aug 2026
    | Allowed | 2 | Block
    Browser extension assistant
    Refused 3 times since 18 Sep 2026
    | Not on the list | 0 | Allow
    The list covers OAuth clients, which are identified by their registration. A client that is not on the list is refused with a message naming this policy. The other option is "All clients that implement the MCP specification". Personal tokens cannot prove which application uses them, so they are allowed or blocked per workspace on the right.
    Workspaces MCP may reach MCP access · personal tokens
    Creative Studio Reachable Tokens
    Digital Products Reachable Tokens
    Corporate PMO Excluded Tokens
    A token cannot reach an excluded workspace, whatever its scopes. Where personal tokens are off, only allowed OAuth clients can connect; a call with a personal token is refused with this policy named.
    Data protection [9]
    Minimal fields
    Tools return only the fields a task needs; contact emails and phones need a separate contacts scope
    On
    Record text is data
    Text inside comments, descriptions and files is returned as data and never treated as instructions; writes act only on explicit parameters
    Always
    Active tokens [6] 4 of 37 shown · tokens are stored hashed Revoke all
    User | Token | Scopes | Client (as reported) | Created | Expires | Last used |
    NR Nadia R.
    | Nadia's assistant
    mts_pat_••••3f9a
    | projects:read, wbs:read, journal:write, comments:write | Desktop LLM app self-reported
    | 2 Sep 2026 | 1 Dec 2026 | Today 09:31 | Revoke
    AW A. Wong
    | Gate prep
    OAuth
    | portfolio:read, projects:read, changes:read | Chat assistant (OAuth) | 15 Aug 2026 | 13 Nov 2026 | Today 08:55 | Revoke
    MJ M. Johnson
    | Weekly status agent
    mts_pat_••••81c2
    | projects:read, reports:read | Internal agent self-reported
    | 1 Jul 2026 | 29 Sep 2026 | 20 Sep 2026 | Revoke
    LW L. Wang
    | IDE assistant
    mts_pat_••••d07e
    | wbs:read | Code editor self-reported
    | 10 Sep 2026 | 9 Oct 2026 | 21 Sep 2026 | Revoke

### Annotations

1. MCP-01 One tenant-specific HTTPS endpoint using the Streamable HTTP transport of the MCP specification 2026-07-28 [Source: modelcontextprotocol.io/specification/2026-07-28, transports].
2. MCP-02, MCP-03 Personal access tokens work with clients that can send an Authorization: Bearer header; OAuth follows the MCP authorization flow for clients that support it [Source: modelcontextprotocol.io/specification/2026-07-28/basic/authorization].
3. MCP-04 The effective right of a call is the user's role intersected with the token's scopes, inside one tenant only.
4. MCP-08 Governance actions are locked to the prepare-only class: an AI client can draft a decision but a person confirms it in the app.
5. MCP-12 Limits apply per token and per tenant (from the plan); exceeding them affects only the calling client.
6. MCP-02, TEN-04 The admin sees and can revoke every token in the tenant; a token shows only its prefix and last four characters.
7. MCP-19, MCP-14 Every tool belongs to exactly one action class, shown in the tool list and recorded in the audit log: read and append-only run directly; a reversible write needs a record version and an idempotency key, can be undone from the item's activity by a person with edit rights and can be set to ask for confirmation in the app; prepare-only covers governance actions.
8. MCP-20, MCP-03 The tenant admin allows all clients that implement the MCP specification or only a named list; under a named list a client that is not on it is refused with a message naming the policy, and Block removes a client at once. OAuth clients are identified by their registration. A personal token is a bearer token that works from any application holding it, so it cannot be matched to the list: personal tokens are allowed or blocked as a whole, per workspace. Excluding a workspace closes it to every token and client.
9. MCP-13, MCP-16 Tools return only the fields a task needs and keep contact data behind its own scope; text stored in records is treated as data, so instructions hidden in a comment cannot trigger any server action.

## 05 Tenant admin: plan and usage

- File: screens/05-tenant-admin-plan-usage.html · image: png/05-tenant-admin-plan-usage.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: TEN-05, TEN-10, MCP-12, TEN-14
- Context: data-nav=admin-plan
- Purpose: The tenant's plan, enabled modules, usage against each limit and what happens at a limit; self-serve billing arrives in V2.

### Content

    Plan & usage
    Acme Holdings · usage as of 22 Sep 2026, 09:40 · monthly counters reset on 1 Oct
    Request plan change
    Current plan [1] Active
    Business
    Billing Annual contract, invoiced by the Metis account team
    Renews 1 Apr 2027
    Region APAC
    Account contact Q. Tran
    Modules
    Project execution
    Included
    Lifecycle governance
    Included
    Portfolio cockpit, registry, roadmap, capacity
    Included
    AI access (MCP)
    Included
    Investment, scenarios, SteerCo reports
    Planned V2
    In-app AI copilot
    Planned V3
    Usage against limits [2] Email to admins at 80% and 100%
    Seats 180 of 250
    2 invitations pending
    Workspaces 3 of 5
    Creative Studio, Digital Products, Corporate PMO
    File storage 62 of 200 GB
    Largest: Creative Studio, 41 GB
    MCP calls this month [4] 41,200 of 100,000
    Per-token limits are set in AI access (MCP)
    Data exports this month 14
    No limit: export is never blocked
    Report generations today 38 of 500
    Fair-use limit per tenant
    What happens at a limit [3]
    Reading, editing existing work and exporting data are never blocked by a limit.
    Only the limited action stops, for example inviting a 251st member or uploading past 200 GB.
    MCP calls past the monthly limit get a retry-after error; people using the web app are not affected.
    Fair-use limits (calls a minute, parallel exports) protect other tenants and reset on their own.
    Billing and plan changes [5] Planned V2
    Self-serve plan upgrade, payment method and invoices. Until then the account team changes plans on request.
    Billing will be managed from this card once it is available.

### Annotations

1. TEN-05 The plan decides which modules are on and every limit; V2 and V3 modules show as locked rather than hidden.
2. TEN-05 Each limit shows current use, the limit and when it resets, so admins act before a block happens.
3. TEN-10 A limit never blocks access to existing data or export; it only stops the action that would exceed it.
4. MCP-12 MCP calls count against the tenant quota; per-token rate limits are a separate control in the AI access policy.
5. TEN-14 Self-serve billing is P1; in the MVP the provider sets plans and invoices outside the product, pending the commercial-model decision.

## 06 Tenant admin: audit log

- File: screens/06-tenant-admin-audit.html · image: png/06-tenant-admin-audit.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: PLT-11, MCP-11, BR-12, BR-19
- Context: data-nav=admin-audit
- Purpose: Immutable, filterable log of configuration, governance and MCP actions with actor, channel, before and after values and reason, plus the detail of one MCP call.

### Content

    Audit log
    Entries cannot be edited or deleted · kept for the life of the tenant plus the retention period
    Export CSV [5]
    Date Last 7 days
    Actor Anyone
    Channel All Web MCP API System
    Workspace All workspaces
    Action type All actions
    Search Object, ticket, reason
    Events [1] 8 of 1,240 in range
    Time | Actor | Channel | Action | Change
    22 Sep 09:31 | AI Nadia R.
    via MCP · token Nadia's assistant
    | MCP | Journal entry added · Meridian CGI Campaign | Note linked to 1.1
    22 Sep 09:12 | QT Q. Tran
    | Web | Support access granted · tenant | None to read-only, 72 h · reason: ticket #2291
    22 Sep 08:55 | AI A. Wong
    via MCP · token Gate prep
    | MCP | Decision draft prepared · Merchant Onboarding, Solution gate | Draft created, awaiting a person to confirm
    22 Sep 08:40 | HL H. Le
    | Web | Change request decided · CR-002 | Under review to Approved · rationale: overnight queue frees the farm
    21 Sep 17:02 | MJ M. Johnson
    | Web | Framework draft created · Company A Digital Delivery | v2.2 draft cloned from v2.1
    21 Sep 16:20 | QT Q. Tran
    | Web | Member deactivated · Art Lead | Active to Deactivated · reason: left the company
    21 Sep 16:20 | S System
    | System | Token revoked · Art Lead, "Render notes" | Revoked because the user was deactivated
    20 Sep 15:44 | AI L. Wang
    via MCP · token IDE assistant
    | MCP | Tool call denied · update_wbs_item, Core Platform | Denied update tools are not enabled
    AI MCP call detail [2] Success
    Time 22 Sep 2026, 09:31:12
    User Nadia R. (Project Manager, Creative Studio)
    Token Nadia's assistant · mts_pat_••••3f9a
    Client Desktop LLM app (as reported by the client)
    Tool add_journal_entry
    Parameters [3] Project Meridian CGI Campaign · type Note · linked item 1.1 · 412 characters of text
    Result Journal entry created, 22 Sep 09:31
    Request ID req_7f2c91
    The full entry text is stored with the journal entry, not in the audit log. The audit keeps who, what, where and the outcome.
    Open journal entry All calls by this token
    Why this matters [4]
    Approvals, decisions and configuration changes always appear here with actor and reason, whichever channel made them.

### Annotations

1. PLT-11 Each event records time, actor, channel, action, object, before and after values and the reason. Entries are immutable.
2. MCP-11 Every MCP call is logged with user, token, client name, tool and result; the square AI avatar marks actions made through MCP everywhere in the product.
3. MCP-11 The audit stores a parameter summary, not the content, so the log does not become a second copy of business data.
4. BR-12, BR-19 Approvals, governance decisions and configuration changes are always auditable, including denied attempts such as the blocked update_wbs_item call.
5. PLT-11 Authorized roles can export the filtered log, for example for an external audit.

## 07 Provider console: tenants

- File: screens/07-provider-tenants.html · image: png/07-provider-tenants.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: TEN-01, TEN-06, TEN-07, TEN-08, TEN-09, TEN-13, TEN-15
- Context: data-nav=provider-tenants
- Purpose: Provider operations console: list and create tenants, move them through their lifecycle, with metadata and usage only and no access to business data without a support grant.

### Content

    Tenants
    Provider operations · data as of 22 Sep 2026, 09:40
    Create tenant
    [1]
    Provider staff see tenant metadata and usage only. Business data (projects, WBS, reports) needs an active support grant from that tenant's admin, and every access is logged in the tenant's audit log.
    Tenants
    46
    Active
    38
    Trial
    6
    2 end this week
    Suspended
    1
    Cancelled, in export window
    1
    All tenants Search tenants
    Any plan
    Any status
    Tenant | Plan | Region [5] | Status | Seats | Storage | MCP calls
    Acme Holdings
    since 3 Feb 2026
    | Business | APAC | Active | 180 / 250 | 62 GB | 41.2K
    Blue Harbor Bank
    since 12 Nov 2025
    | Enterprise | APAC | Active | 1,240 / 1,500 | 410 GB | 380K
    Kite Logistics
    trial started 13 Sep 2026
    | Business | EU | Trial · day 9 | 22 / 50 | 3 GB | 2.1K
    Orchid Retail
    unpaid invoice
    | Team | US | Suspended | 40 / 40 | 12 GB | 0
    Lumen Health Group
    export window until 30 Sep 2026
    | Enterprise | EU | Cancelled | 0 / 300 | 88 GB | 0
    Selected: Acme Holdings · tenant admin Q. Tran · support grant active until 24 Sep 2026, 18:00
    Suspend Cancel tenant [4]
    Tenant lifecycle [3]
    Trial full product, plan limits
    Active contract in force · Acme Holdings
    Suspended read-only, export allowed
    Cancelled 30-day export window
    Deleted purged after retention
    Deletion produces a deletion certificate for the customer. Suspension never removes data.
    Usage metering export [6] Planned V2
    Monthly usage per tenant (active users, storage, MCP calls) for billing and capacity planning.
    Create tenant [2]
    Organization name * Nova Energy
    Email domains nova.example
    First tenant admin * it.admin@nova.example
    Plan Business
    Start as Trial Active
    Trial length 30 days
    Region Planned V2: choice EU
    Creates the tenant, sends the admin invitation, adds a default workspace and the default lifecycle framework from the global library.
    Create tenant

### Annotations

1. TEN-08, TEN-09 The provider console shows metadata and usage only; business data needs a time-limited support grant from the tenant admin.
2. TEN-01 Creating a tenant also invites its first admin and seeds a default workspace and lifecycle framework, so the tenant can start at once.
3. TEN-06 Lifecycle states and what each allows: suspended tenants are read-only and can still export.
4. TEN-07 Cancelling opens an export window before deletion; the tenant can export all data and files during it.
5. TEN-13 Every tenant has a home region; choosing a region for data residency is P1, so the MVP uses the default region.
6. TEN-15 Usage metering for billing is P1; the MVP shows usage per tenant in this table only.

## 08 My profile: AI access (MCP)

- File: screens/08-profile-ai-access.html · image: png/08-profile-ai-access.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: MCP-01, MCP-02, MCP-03, MCP-05, MCP-06, MCP-08, MCP-09, MCP-10, MCP-15, MCP-19, MCP-20, BR-39
- Context: data-workspace=Creative Studio
- Purpose: A user connects an LLM client that implements the MCP specification (verified clients listed) with OAuth or a personal access token, tests the connection, reads what each failure means and what to do, and sees the versioned tool list and what the client may do.

### Content

    AI access (MCP)
    Connect an LLM client that implements the MCP specification; verified clients are listed below. It sees only what you can see and every action is recorded as yours.
    Profile Notifications AI access
    1 · Endpoint [1] Enabled by your admin
    https://acme.mcp.metis.example/mcp
    Copy
    Streamable HTTP · one endpoint for Acme Holdings · data filtered to your permissions
    Verified clients [6] Tested against protocol 2026-07-28
    Client | Sign-in | Status
    Desktop LLM app | Personal token | Verified
    Chat assistant (OAuth) | OAuth | Verified
    Code editor | Personal token | Verified
    Internal agent | Personal token | Not yet verified
    Other clients that implement the MCP specification may work; they are not on the verified list.
    2a · Connect with OAuth [2] Recommended when your client supports it
    1 Add the endpoint URL as a remote MCP server in your client.
    2 Your client opens the Metis sign-in page; sign in as usual.
    3 Approve the scopes the client asks for. You can approve fewer.
    4 Done. The connection appears under My connections; revoke it any time.
    2b · Or use a personal access token [3] Create token
    Example; check your MCP client's documentation [4]
    {
    "mcpServers": {
    "metis": {
    "url": "https://acme.mcp.metis.example/mcp",
    "headers": { "Authorization": "Bearer mts_pat_••••3f9a" }
    }
    Test connection Connected as Nadia R. · 6 of 13 tools allowed by this token
    If the test or a call fails [7]
    What the client reports | What to do
    Invalid or expired token | Create a new token and paste it into your client; tell your admin if a token you did not revoke stopped working
    Missing scope | Add the scope to the token, or approve it again when your client asks
    Workspace restriction | The token or your tenant excludes this workspace; use a token for an allowed workspace or ask your admin
    Client not allowed by tenant policy | Use a client on your tenant's list, or ask your admin to add this one
    Rate limit | Wait for the retry time in the message, then try again
    Protocol version mismatch | Update the client to a version that supports protocol 2026-07-28
    Server unavailable | Try again in a few minutes; if it keeps failing, tell your admin
    Create personal access token Close
    Name * Nadia's assistant
    Scopes
    projects:read wbs:read
    journal:write comments:write
    reports:read risks:read
    wbs:write · second increment changes:draft · second increment
    Workspaces Creative Studio only
    Expires In 90 days (maximum)
    Copy the token now; it is shown once. Metis stores only a hash: mts_pat_7Hq2••••••••3f9a
    Cancel Create token
    What an AI client can do as you [5]
    Kind | Examples | Allowed
    Read | Projects, WBS items, my focus, changes, risks, charter, reports | Yes, within your permissions
    Append-only | Journal entries, comments | Yes
    Reversible write | WBS item status and dates, draft change requests, risks, report drafts | Second increment
    Prepare-only | Approvals, gate decisions, baseline changes, deletions, permissions | Prepare only, you confirm
    Tools [8] 13 tools · tool set 1.2
    Tool | Class | Version | This token
    list_projects | Read | 1.0 | Allowed
    get_project_overview
    Figures computed by Metis, with as-of time and metric version [9]
    | Read | 1.1 | Allowed
    get_my_focus | Read | 1.0 | Allowed
    get_report | Read | 1.0 | Needs reports:read
    add_journal_entry | Append-only | 1.0 | Allowed
    update_wbs_item | Reversible write | 1.0 | Second increment
    Changes stay backward compatible within a major version All 13 tools
    My connections
    AI Nadia's assistant
    Token · projects:read, wbs:read, journal:write, comments:write · expires 1 Dec 2026 · last used today 09:31
    Revoke
    AI Old laptop
    Token · expired 30 Aug 2026
    Expired
    Recent activity through MCP All
    AI add_journal_entry · Meridian CGI Campaign
    via MCP · token Nadia's assistant · today 09:31
    Done
    AI get_my_focus
    via MCP · token Nadia's assistant · today 09:30
    Done
    AI update_wbs_item · 1.1.2
    via MCP · token Nadia's assistant · yesterday 17:12
    Denied: missing scope

### Annotations

1. MCP-01 One tenant-specific HTTPS endpoint over Streamable HTTP [Source: modelcontextprotocol.io/specification/2026-07-28, transports].
2. MCP-03 Clients that implement the MCP authorization flow sign the user in through Metis and ask for scopes; no token is copied [Source: modelcontextprotocol.io/specification/2026-07-28/basic/authorization].
3. MCP-02 A personal access token works with clients that can send an Authorization: Bearer header. It is shown once, stored as a hash, limited by scopes, workspaces and expiry, and revocable.
4. MCP-15 The setup guide gives the endpoint, an example configuration and a "Test connection" check. Configuration formats differ by client [Unverified - confirm before applying], so the example is labelled.
5. MCP-05, MCP-06, MCP-08, MCP-19 The kinds are the four action classes set by the tenant admin: read and append-only tools work in the first increment, reversible writes come in the second, and prepare-only governance actions are drafted for the user to confirm in the app.
6. MCP-15 Metis promises support for clients that implement the MCP specification and lists the clients it has tested, with their sign-in method; which clients must be verified is open question Q-08.
7. MCP-15, MCP-20 A failed test or call names its category and the fix: invalid or expired token, missing scope, workspace restriction, client not allowed by tenant policy, rate limit, protocol version mismatch, plus server unavailable. The test call and the activity list use the same wording.
8. MCP-09 The tool list shows each tool's version and whether this token allows it; changes stay backward compatible within a major version.
9. MCP-10, BR-39 Tools return figures computed by the platform with the Section 12 definitions, stamped with the as-of time and metric version, so the AI client never aggregates raw rows itself.

## 09 Workspace settings: fields and options

- File: screens/09-workspace-fields-options.html · image: png/09-workspace-fields-options.png
- Area: Workspace & governance · Phase: MVP · POC screenshots: 32, 33
- Requirements: WSP-07, WSP-08, WSP-09, BR-25
- Context: data-nav=settings, data-workspace=Creative Studio
- Purpose: Workspace-managed lists for Category, Type, Label, Phase, Status and Priority with usage counts, system meanings, propagating renames and delete with replacement.

### Content

    Fields & options
    Lists behind every dropdown, Board column and filter in the 3 Creative Studio projects. Renames update all items; counts show usage.
    General Fields & options Team & roles Frameworks Data
    Category [1] PM control areas
    ⋮⋮ Deliverables
    14 items Rename
    ⋮⋮ Technical
    6 items Rename
    ⋮⋮ Quality
    5 items Rename
    ⋮⋮ Timeline
    3 items Delete
    ⋮⋮ Resource
    3 items Rename
    ⋮⋮ Risk
    4 items Rename
    ⋮⋮ Communication
    0 items Delete
    Add a category
    Add
    Type Work object level
    ⋮⋮ Deliverable Feeds charter V
    9 items
    ⋮⋮ Work Package
    6 items
    ⋮⋮ Task
    20 items
    ⋮⋮ Subtask
    0 items
    Add a type
    Add
    Category rows group work; they are not a Type and are never counted as work items.
    Label Pick any that apply
    Milestone
    6 items System
    Checkpoint
    0 items System
    Approval Gate
    4 items System
    ↘ Input Required
    4 items System
    Risk Related
    3 items System
    Add a label
    Add
    Phase [3] From lifecycle framework
    Creative Production v1.2 · edit in Lifecycle framework
    Initiation
    7 items
    Planning
    5 items
    Production
    12 items
    Review
    6 items
    Delivery
    4 items
    Closing
    1 item
    Status [2] Board columns
    Value | System state | Used
    Not Started | Not started
    | 12
    In Progress | In progress
    | 9
    Waiting | Waiting
    | 2
    Blocked | Blocked
    | 0
    Done | Done
    | 12
    Priority
    ⋮⋮ Low
    3 items
    ⋮⋮ Medium
    10 items
    ⋮⋮ High
    14 items
    ⋮⋮ Critical
    8 items
    Add a priority
    Add
    Delete category "Timeline"? [4] Close
    3 work items in 2 projects use this category. Choose where they move before it is deleted.
    Move items to * Deliverables
    Item history keeps the old value; the change is recorded in the audit log. Values with a system meaning, such as the Done status or the Milestone label, cannot be deleted.
    Cancel Move 3 items and delete

### Annotations

1. WSP-07 Values can be added, renamed (every item using them updates), reordered by drag and deleted; counts show usage across the workspace.
2. WSP-08 Each status maps to a system state, so renaming "Done" to "Completed" keeps progress, Board columns and charter sections correct.
3. WSP-09 Phase values are the stages of the published lifecycle framework; they are read-only here and change only by publishing a new framework version.
4. BR-25 Deleting a value in use requires a replacement; the POC left this undefined. Built-in labels and system statuses cannot be deleted.

## 10 Workspace settings: team and roles

- File: screens/10-workspace-team-roles.html · image: png/10-workspace-team-roles.png
- Area: Workspace & governance · Phase: MVP · POC screenshots: 34
- Requirements: WSP-10, WSP-11, PLT-03, BR-26
- Context: data-nav=settings, data-workspace=Creative Studio
- Purpose: Workspace members with their workspace role, project overrides and open assignments; invitations; removal keeps names on history and flags open items for reassignment.

### Content

    Team & roles
    6 active members in Creative Studio · roles decide what each person can see and change
    General Fields & options Team & roles Frameworks Data
    [1]
    Everyone here can be chosen as PIC, Reviewer or Approver and can be @mentioned. Renaming a member updates their assignments in every project. Removing a member keeps their name on existing items so history stays accurate.
    Members Search members
    Member | Workspace role [2] | Project overrides | Open items
    HL H. Le
    Studio Director
    | Workspace Owner
    | None | 0
    NR Nadia R.
    Project Manager
    | Project Manager
    | Northwind Showroom VR · Team member | 3
    DK Denny K.
    3D Lead
    | Team member
    | None | 4
    SW Sasha W.
    Art Director
    | Team member
    | Meridian CGI Campaign · Reviewer of renders | 1
    JP J. Park
    Northwind Furniture Co.
    | Client
    | Meridian CGI Campaign only | 0
    QT Q. Tran
    Tenant admin
    | Viewer
    | None | 0
    AL Art Lead
    Former member
    | Removed 21 Sep 2026 [4] | None | 1
    Art Lead still has 1 open item (3.1 Visual Quality Approval, Waiting). Reassign it so the approval is not stuck. Reassign
    Invite member [3]
    Email * name@acme.example
    Workspace role Team member
    Limit to projects (optional) All projects in the workspace
    Send invitation
    What each role can do [5]
    Workspace Owner
    Members, fields and options, frameworks, policies
    Portfolio Manager
    Portfolio governance, registry, reporting cadence
    Project Manager
    Charter, WBS, plan, risks, change requests, reports
    Team member
    Assigned items: status, effort, comments, files
    Viewer
    Read-only views
    CL Client (external)
    Invited projects only: comments, own inputs, client approvals

### Annotations

1. WSP-10 Members are the only people selectable as PIC, Reviewer or Approver; renaming a member updates assignments everywhere, as in the POC Team settings.
2. WSP-11 A workspace role plus optional project overrides gives each person's effective permission; the POC only had Admin and Member labels that were not enforced.
3. PLT-03 Invitations go by email with a role and an optional project limit; the person joins on acceptance.
4. BR-26 Removing a member revokes access at once but keeps the name on items and history; open items are flagged for reassignment.
5. WSP-11 Role summaries match the BRD role model; the Client role exists only if client access is approved (decision D-02).

## 11 Lifecycle framework designer

- File: screens/11-lifecycle-framework-designer.html · image: png/11-lifecycle-framework-designer.png
- Area: Workspace & governance · Phase: MVP · POC screenshots: none
- Requirements: GOV-01, GOV-02, GOV-03, GOV-04, GOV-05, GOV-06, GOV-12, GOV-19, GOV-20, GOV-21, GOV-22, BR-15, BR-16
- Context: data-nav=framework, data-workspace=Digital Products
- Purpose: Edit a draft version of the workspace lifecycle: stages, gates, criteria, mandatory artifacts, role mapping and conditional rules, then submit it for review and publish.

### Content

    Company A Digital Delivery Draft v2.2 [1]
    Cloned from published v2.1 (effective 14 Apr 2026, used by 41 projects) by M. Johnson on 21 Sep 2026 · 4 changes since clone
    Compare with v2.1 Planned V2
    Submit for review
    Publish v2.2
    Readiness check: 3 of 4 pass. Compliance Review has no stage owner role. Publish v2.2 stays disabled until the review is approved and every check passes. [6]
    Published versions never change. Projects keep the version they started with; moving a running project to v2.2 needs an approved migration, which arrives in V2.
    Stages [2] + Add stage
    ⋮⋮ 1 Discovery
    ◇ Discovery approval
    ⋮⋮ 2 Design
    ◇ Design approval
    ⋮⋮ 3 Solution
    ◇ Solution approval
    Edited
    3a Compliance Review
    Conditional · added when Regulatory impact = Yes
    New
    ⋮⋮ 4 Development
    ◇ Build readiness
    ⋮⋮ 5 Test
    ◇ Go-live readiness
    ⋮⋮ 6 GTM
    ◇ Launch approval
    ⋮⋮ 7 Retro
    Closure and improvement backlog
    Stage 3 · Solution [3] Deactivate stage
    Objective Define the technical and business solution and confirm it is feasible within budget.
    Stage owner role Engineering lead
    Target duration (SLA) 15 working days
    Entry criteria
    Design gate passed or passed with conditions Budget range agreed with Finance
    Exit criteria
    Architecture approved NFRs and integrations listed Security and risk assessment done Estimate within 10% of budget
    Mandatory artifacts [4] + Add
    Artifact | Kind | Owner
    Architecture document | File | Engineering lead
    NFR list | Field | Engineering lead
    Integration list | Checklist | Engineering lead
    Security and risk assessment | File | Security
    Estimate | Field | Project Manager
    Gate · Solution approval
    Approvers Engineering lead Product Director Control function: Security
    Quorum 2 of 3 approvers
    Decision options Pass Pass with conditions Rework Hold Reject
    Rationale required for every decision
    All mandatory artifacts attached before submission
    Rules [5] + Add rule
    IF Project field "Regulatory impact" is Yes
    THEN add stage Compliance Review after Solution
    IF Approved budget is more than $2M
    THEN add approver Control function: Finance to the Solution gate

### Annotations

1. GOV-12, GOV-19, GOV-21, GOV-22 Changes happen in a draft cloned from the published version; publishing needs review and creates v2.2 with an effective date. Projects stay on the version they started with (BR-15, BR-16).
2. GOV-01 Stages can be added, edited, deactivated and reordered by drag; each published stage becomes a Phase value in the workspace.
3. GOV-02, GOV-05, GOV-20 Each stage stores objective, owner role, SLA, entry and exit criteria; roles route stage tasks to the right people.
4. GOV-03, GOV-04 Gate submission is blocked until the five mandatory artifacts are attached; quorum and decision options are set per gate.
5. GOV-06 Conditional rules add or remove stages and approvers from project fields, as in the v3 example "regulatory impact = yes adds Compliance Review".
6. GOV-21 Publishing runs a readiness check: every stage has an owner role, every gate has approvers and a quorum those approvers can meet, mandatory artifacts are defined, and the stage list gives the Phase values. A failing check names each failure and keeps Publish disabled; a disabled button means "not allowed yet", while planned features carry a Planned tag instead.

## 12 Gate review

- File: screens/12-gate-review.html · image: png/12-gate-review.png
- Area: Workspace & governance · Phase: MVP · POC screenshots: none
- Requirements: GOV-08, GOV-09, GOV-13, GOV-14, GOV-15, CHG-11, MCP-08, BR-17, BR-18, BR-30, BR-42
- Context: data-workspace=Digital Products, data-project=Merchant Onboarding, data-tab=governance
- Purpose: Formal stage-exit review: readiness evidence, risks, dependencies and impact, approver votes against quorum, a decision with rationale and actions, Pass options locked with the reason while mandatory artifacts are missing, waivers, and a decision draft prepared through MCP.

### Content

    AI
    A decision draft was prepared via MCP by A. Wong's assistant (token Gate prep) at 08:55: "Pass with conditions". It cannot be confirmed while 2 mandatory artifacts are missing; nothing is decided until an approver submits a decision here. [1]
    Review draft
    Lifecycle · Company A Digital Delivery v2.1 Stage 3 of 7 · started 26 Aug 2026
    Discovery passed 12 Jun
    Design passed with conditions 21 Aug
    Solution gate due 17 Sep · 5 days late
    Development
    Test
    GTM
    Retro
    Solution gate readiness [2] Overdue 5 days
    Mandatory artifacts
    3 of 5
    2 missing
    Open risks
    2
    1 high
    Dependencies at risk
    1
    Budget impact
    +$90K
    +7.5% on $1.2M
    Mandatory artifact [3] | Owner | Status | Evidence
    Architecture document | L. Wang | Attached | architecture-v3.pdf · 10 Sep
    NFR list | L. Wang | Sign-off missing | 14 NFRs listed · sign-off not recorded
    Integration list | L. Wang | Complete | 6 integrations
    Security and risk assessment | Security | Missing | Requested 15 Sep
    Estimate | M. Johnson | Waived to 2 Oct | Waiver W-04
    Open risks
    Payment partner API rate limits
    High
    KYC vendor contract not signed
    Medium
    Dependencies
    Core API v3 from Core Platform
    12 days late
    Resource impact
    Development needs 6.5 FTE: Engineering 4, QA 1.5, UX 1
    Decision history [5] Decision Log
    Pass Discovery gate · 12 Jun 2026
    A. Wong, L. Wang · rationale: strong MSME demand evidence
    Pass with conditions Design gate · 21 Aug 2026
    Condition: accessibility review before Development · owner UX lead · due 30 Sep · open
    Approvers Votes 1/3 · quorum 2/3
    LW L. Wang · Engineering lead
    "Security assessment must exist before build starts."
    Rework
    AW A. Wong · Product Director
    Draft prepared via MCP, not confirmed
    Draft
    SC Control function: Security
    Not voted
    Pending
    Your decision [4] as A. Wong
    Pass Pass with conditions Rework Hold Reject
    🔒 2 blockers before you can decide [7] 1. Security and risk assessment: not attached. Owner L. Wang. Open the artifact Remind L. Wang
    2. NFR list: attached, sign-off not recorded. Owner L. Wang. Open the artifact Request sign-off
    Request waiver
    Rationale * The security and risk assessment and the NFR sign-off must exist before Development starts; resubmit the gate when both are attached.
    Rework actions
    Action | Owner | Due
    Attach security and risk assessment | Security lead | 29 Sep
    Record the NFR list sign-off | L. Wang | 26 Sep
    Request information Submit decision
    After approval a gate decision cannot be edited; corrections go through a correction workflow and both entries stay in the Decision Log.
    Waiver W-04 [6] Active
    Rule waived Mandatory artifact: Estimate
    Reason Vendor quote arrives 30 Sep
    Approved by Linh T., 18 Sep 2026
    Expires 2 Oct 2026, then the criterion blocks again

### Annotations

1. MCP-08 An AI client can prepare a decision, never make it; the draft waits for a person to confirm it in the app.
2. GOV-14 Readiness shows evidence, open risks, dependencies, budget and resource impact and decision history before the meeting.
3. GOV-09, BR-17 The project cannot leave Solution while a mandatory artifact is missing, unless an approved waiver that has not expired covers it; here the estimate is covered by waiver W-04 and two artifacts are missing.
4. GOV-08, BR-30, BR-18 Five decision options and a required rationale; votes always read "Votes 1/3 · quorum 2/3" (votes cast of approvers, votes needed of approvers). An approved decision is immutable except through a correction workflow.
5. GOV-15, CHG-11 Conditions become tracked actions with owner and due date; every gate decision is linked to evidence and stored in the Decision Log.
6. GOV-13 A waiver names the rule, reason, approver and expiry; when it expires the criterion blocks again and an attention item is raised.
7. A disabled decision is not an explanation: the banner lists each blocker by name with its owner and a link to the artifact, so the approver can clear it or request a waiver from here rather than leaving to find out why. BR-42, GOV-09, BR-17 The server decides which options are eligible: Pass and Pass with conditions stay disabled, with the missing artifacts named, until every mandatory artifact exists or is covered by a waiver. "Request waiver" starts a waiver request; Rework, Hold and Reject remain available. The server rejects an ineligible decision from any channel, including a confirmed MCP draft.

## 13 Template library

- File: screens/13-template-library.html · image: png/13-template-library.png
- Area: Workspace & governance · Phase: MVP · POC screenshots: 35
- Requirements: GOV-17, GOV-18, GOV-23, GOV-24, GOV-25, GOV-26, GOV-28, BLD-09, BLD-11, BLD-13, BLD-16
- Context: data-nav=templates, data-workspace=Creative Studio
- Purpose: Catalog of lifecycle and process frameworks at global, tenant and workspace level with version, owner, status, usage and provenance; clone is the POC's Edit a copy; a process framework draft opens in its editor and the Workspace Owner publishes it once its check passes; review, deprecation with a replacement template, compare and migrate arrive in V2.

### Content

    Template library
    New projects and the Deliverable Builder offer only published templates [1]
    All Lifecycle frameworks Process frameworks Project templates Planned V2
    New framework
    Global · provided by Metis, read-only Planned V2 [2]
    Lifecycle Company A reference lifecycle v1.0 Published
    Discovery, Design, Solution, Development, Test, GTM, Retro · 7 stages, 6 gates · reference framework from BRD v3.0
    Owner Metis Status Active Used by 0 projects in this tenant directly Preview Clone
    Process Simple Review Loop v1.0 Published
    Draft, Internal Review, Client Review, Final · 6 items, 5 relationships
    Owner Metis Status Active Used by 9 projects in this tenant Preview Clone
    Tenant · Acme Holdings
    Lifecycle Company A Digital Delivery v2.1 Published
    Discovery, Design, Solution, Development, Test, GTM, Retro · 7 stages, 6 gates
    Owner MJ M. Johnson [6] Status Active Used by 41 projects · draft v2.2 in progress
    Provenance: cloned from Company A reference lifecycle v1.0 by M. Johnson, 2 Feb 2026 [4]
    Preview Clone Compare Planned V2 Migrate projects Planned V2
    Process 3D Animation / Video v1.0 Published
    PreViz, Draft Flow, Frame Check, Final Render · 12 items, 11 relationships
    Owner HL H. Le Status Active Used by 2 projects
    Source: built-in, maintained by the provider Scope: available to every workspace Version: v1.0, read-only
    A starter template or a starting pack may offer this provider version directly; that is a reference and creates no publication in your workspace. Editing it creates a workspace draft that your Workspace Owner publishes.
    Preview Edit a copy
    Lifecycle Classic Waterfall v3.0 Published
    Initiate, Plan, Execute, Close · 4 stages, 3 gates
    Owner AW A. Wong Status Deprecated Planned V2 [7] Used by 4 running projects · not offered for new projects Replacement Company A Digital Delivery v2.1 Reason Superseded by the 7-stage digital lifecycle
    Preview Migrate projects Planned V2
    Workspace · Creative Studio
    Lifecycle Creative Production v1.2 Published
    Initiation, Planning, Production, Review, Delivery, Closing · 6 stages, 5 gates
    Owner HL H. Le Status Active Used by 3 projects
    Provenance: created by H. Le from the POC phase list, 20 May 2026
    Preview Clone
    Process CGI Still Renders v1.1 Published
    Camera Angle, Draft, Pre-Finals, Final; approvals, quality checks, deposits, milestones · 16 items, 15 relationships
    Owner HL H. Le Status Active Used by 3 projects
    Provenance: built-in framework from the POC, edited by H. Le
    Preview Edit a copy [3] Deprecate
    Process CGI Still Renders, 5 angles v0.1 Draft
    Copy with one more camera angle · 17 items, 17 relationships so far
    Owner NR Nadia R. Status Draft, not offered yet Used by 0 projects · visible to editors only Check 4 of 5 pass: a dependency cycle
    Provenance: copy of CGI Still Renders v1.1 by Nadia R., 21 Sep 2026
    Open in editor [8] Publish Delete draft Submit for review Planned V2
    Clone
    Adapt
    Review
    Publish
    Instantiate
    How a template changes. Comparing versions and migrating running projects to a new version are V2 [5]

### Annotations

1. GOV-17 The catalog lists approved templates for the user's scope; drafts are visible to editors but never offered for new projects or in the Builder. A process framework draft is offered once the Workspace Owner publishes it (BLD-16).
2. GOV-26 A provider-maintained global library is P1; tenants will clone from it but cannot edit it.
3. GOV-18, BLD-09 Each card carries its source, scope and version as persistent badges, so nobody has to remember whether a framework is a provider built-in or a workspace copy. A pack or template that offers a built-in version references the provider version and creates no publication event in the workspace, which is what keeps the publishing authority of BLD-16 intact. "Edit a copy" from the POC is the clone action: built-in and published frameworks never change in place; editing always produces a new draft.
4. GOV-23 Provenance records the source template, author and date, so every framework can be traced to its origin.
5. GOV-24, GOV-25, BLD-11 Version comparison, project migration and the review step before a custom process framework is published are P1 (V2); in Release 1 the Workspace Owner publishes process frameworks directly (BLD-16).
6. GOV-28 Every template card shows its owner, its status (Active or Deprecated) and how many projects use it; the owner answers for changes and for retiring the template.
7. GOV-28 Deprecation is P1 (V2): a deprecated template names its replacement and a reason, is no longer offered for new projects, and still shows on the running projects that use it until they migrate. Templates unused or unreviewed for a set period are flagged to their owner.
8. BLD-13, BLD-16 Open in editor opens the process framework editor (screen 58). Project Managers such as Nadia R. draft process frameworks; the Workspace Owner publishes a draft once its check passes, and here a dependency cycle keeps Publish disabled. Delete draft removes a draft that was never published. A published process framework is deprecated instead (Deprecate on CGI Still Renders): it is no longer offered in the Builder and still shows on the items built from it; naming a replacement is V2.

## 14 Executive portfolio cockpit

- File: screens/14-executive-cockpit.html · image: png/14-executive-cockpit.png
- Area: Portfolio · Phase: MVP · POC screenshots: none
- Requirements: EXE-01, EXE-02, EXE-03, EXE-04, EXE-06, BR-39
- Context: data-nav=cockpit, data-workspace=Digital Products
- Purpose: CEO-first control tower for one workspace: investment, health and capacity tiles with their data freshness, the attention queue with the kind of action each item needs, and (in V2) recommended decisions.

### Content

    Good morning, Linh. 6 items need attention.
    Digital Products workspace · FY2027 · As of 22 Sep 2026, 09:40 · metrics v1
    Portfolio All portfolios
    Period Q3 2026
    Scope [5] This workspace
    Export pack
    Portfolio investment
    $50.2M
    approved budget · forecast $51.9M
    as of 22 Sep 09:40
    Active projects
    128
    96 committed · 32 proposed
    as of 22 Sep 09:40
    FTE demand [6]
    474
    +22 over capacity 452
    capacity last confirmed 12 days ago
    Expected value [1]
    Not tracked
    Benefits arrive in V2
    no data source yet
    Value at risk
    Not tracked
    Benefits arrive in V2
    no data source yet
    Requires attention [2] 6 All exceptions
    Critical Review Core Platform declared Green, computed Off track
    Green-but-risky · 3 milestones overdue, 2 critical risks · Owner L. Wang
    Review
    Critical Rebalance Data capability at 118% for Q4
    Capacity overload · driven by Data Platform and MSME Payment · Owner Resource Manager
    Rebalance
    High Decide CR-016 Add iOS support, pending 6 days
    +$300K, +4 weeks, +6 FTE · Mobile App · Approver you
    Decide
    High Review Solution gate overdue 5 days
    Merchant Onboarding · 2 of 5 mandatory artifacts missing · Owner A. Wong
    Open gate
    Medium Review 3 projects above 20% budget variance
    Core Platform +24%, Digital Sales +21%, AML Upgrade +20%
    View
    Medium Remind 4 weekly status reports missing
    Reporting period 15 to 21 Sep · reminders sent
    Remind
    Portfolio health [3] 73 / 100
    Delivery 81
    Financial 76
    Resource 72
    Risk 64
    Strategic Planned V2
    Decision center [4] Planned V2
    5 Stop
    8 Review
    3 Accelerate
    4 Fund
    Projects by health Table view
    On track 81 At risk 30 Off track 17
    Investment by portfolio approved, $M
    Growth 27.1
    Technology & Reg. 23.1
    Capacity hot spots confirmed 10 Sep
    Q4 demand / capacity Ask managers to confirm
    Data 118% Over
    Engineering 112% Over
    UX 84% OK

### Annotations

1. EXE-01 Investment, projects and FTE aggregate from approved project records. Value tiles say "Not tracked" until benefits are captured (INV-02, V2) instead of showing invented numbers.
2. EXE-02 Every exception has severity, the kind of action it needs (Decide, Review, Rebalance or Remind), reason, owner and one next action; the headline counts items that need attention, not only decisions. Sources: green-but-risky (RSK-04), capacity (RES-02), pending and approved-not-applied CRs (CHG-07), overdue gates (GOV-10), budget variance (CHR-13), missing status (RPT-04).
3. EXE-03 Four health dimensions in the MVP; the strategic dimension needs the strategy model (STR-01, V2). Each score drills to the projects behind it (BR-32).
4. EXE-04, BR-10 Decision center is V2: recommendations are advisory until an authorized executive approves them; decisions go to the Decision Log.
5. EXE-06 The MVP cockpit covers one workspace; "All workspaces" appears with the cross-workspace view in V2 and respects record-level permissions (BR-20).
6. BR-39 Every tile states how fresh its data is: a dot with "as of" time when current, a warning triangle with words when a source is stale (capacity not confirmed for 12 days), a question mark when there is no source. Figures carry the metric version of Section 12.

## 15 Workspace dashboard

- File: screens/15-workspace-dashboard.html · image: png/15-workspace-dashboard.png
- Area: Portfolio · Phase: MVP · POC screenshots: none
- Requirements: EXE-05, GOV-10, GOV-12, GOV-14, BR-14, BR-15, BR-39
- Context: data-nav=workspace-dashboard, data-workspace=Digital Products
- Purpose: Governance view of one workspace: portfolio KPIs, the delivery pipeline by lifecycle stage with overdue and blocked gates, and the governance attention list.

### Content

    Digital Products workspace
    Framework Company A Digital Delivery v2.1 · FY2027 · As of 22 Sep 2026, 09:40 · metrics v1
    Portfolio All portfolios
    Period Q3 2026
    Open cockpit
    Portfolio investment [1]
    $50.2M
    approved · forecast $51.9M
    Active projects
    128
    96 committed · 32 proposed
    FTE demand
    474
    +22 over capacity 452
    Open risks
    84
    13 critical · 4 systemic
    Gates due this month
    9
    1 overdue · Merchant Onboarding
    Delivery pipeline [2] projects by current stage · framework v2.1 Table view
    Discovery 6 0 overdue
    Design 8 0 overdue
    Solution 5 1 gate overdue
    Development 14 1 blocked
    Test 5 0 overdue
    GTM 4 0 overdue
    Retro 2 0 overdue
    Merchant Onboarding · Solution gate overdue 5 days [3]
    Data Platform · blocked by Core Platform dependency
    44 projects on v2.1 · 52 committed projects stay on v1.9 until migrated · 32 proposals not yet in Discovery
    Governance attention [4] 6 All exceptions
    Critical Solution gate overdue: Merchant Onboarding
    2 of 5 mandatory artifacts missing · approvers L. Wang, A. Wong, Security · Votes 1/3 · quorum 2/3
    Open gate
    High 3 projects missing mandatory Discovery evidence
    Digital Sales, CRM Refresh, Branch Kiosk · problem statement or KPI baseline not attached
    Request evidence
    High Budget change needs a CR: Mobile App
    CR-016 add iOS · +$300K, +4 weeks, +6 FTE · pending 6 days
    View CR
    Medium Stage SLA breached: Core Platform in Development
    34 days over planned stage duration · computed health Off track
    Review
    Medium 2 waivers expire this week
    KYC Automation security review (25 Sep) · Card Rewards UAT evidence (27 Sep)
    Renew or close
    Medium Solution gate due 26 Sep: Treasury API
    All 5 artifacts attached · readiness check passed
    Schedule
    Health [5] Open
    On track 81 At risk 30 Off track 17
    Capacity Open
    Data 118% Over
    Engineering 112% Over
    Critical risks
    13
    4 systemic · open Risk
    Next MVP release
    30 Mar 2027
    MSME Payment MVP1 · open Roadmap

### Annotations

1. EXE-05, BR-39 The dashboard covers one workspace; KPIs aggregate approved project records with the BRD Section 12 definitions, state their as-of time and metric version, and every figure opens the projects behind it.
2. GOV-12, BR-14, BR-15 Counts are stage instances of the workspace default framework. Projects keep the framework version they started with, so projects still on v1.9 are counted apart until an approved migration.
3. GOV-10 A gate past its planned date or a stage past its SLA is flagged in the pipeline and in the attention list; blocked means an unmet dependency.
4. GOV-14 Each governance item has severity, reason and one next action that opens gate readiness: evidence, open risks, dependencies, budget and resource impact.
5. EXE-05 Compact tiles link to the cockpit, capacity, risk and roadmap screens instead of repeating them.

## 16 Portfolio and project registry

- File: screens/16-portfolio-registry.html · image: png/16-portfolio-registry.png
- Area: Portfolio · Phase: MVP · POC screenshots: none
- Requirements: REG-01, REG-02, REG-03, CHR-15, RSK-04, BR-02, BR-39
- Context: data-nav=registry, data-workspace=Digital Products
- Purpose: Single list of every project in the workspace, searchable and filterable, grouped by portfolio, with stage, health, budget and framework version.

### Content

    Registry 128 projects · 96 committed · 32 proposed As of 22 Sep 2026, 09:40 · metrics v1
    Saved views Export + New project
    Search by project ID or name
    [2]
    Filters apply instantly, no reload
    Portfolio All
    Program All
    Owner All
    Health All
    Stage All
    Strategic objective All
    Status Committed, Proposed
    | Project [1] | Program | Owner | Sponsor | Stage | Health | Budget | Forecast | End date | Version | Tags [4]
    Growth [3] · 70 projects · $27.1M approved
    ☆ | PRJ-001 MSME Payment | MSME Transformation | A. Wong | Linh T. | Development | On track | $2.4M | $2.5M | 30 Jun 2027 | v2.1 | MSME revenue +20%
    ☆ | PRJ-002 Merchant Onboarding | MSME Transformation | M. Johnson | A. Wong | Solution | At risk | $1.2M | $1.3M | 15 Jul 2027 | v2.1 | MSME revenue +20%
    ☆ | PRJ-003 Digital Sales | Customer | M. Johnson | Linh T. | Design | At risk | $1.9M | $2.3M | 30 Sep 2027 | v2.1 | Digital share 40%
    ★ | PRJ-004 Mobile App | Customer | A. Wong | Linh T. | Development | At risk | $1.5M | $1.8M | 15 Dec 2027 | v2.1 | Digital share 40% CR-016
    ☆ | PRJ-008 CRM Refresh | Customer | M. Johnson | A. Wong | Discovery | On track | $0.9M | $0.9M | 31 Mar 2028 | v2.1 | Digital share 40%
    ☆ | PRJ-010 Card Rewards | Customer | A. Wong | Linh T. | Test | On track | $1.1M | $1.1M | 30 Nov 2026 | v2.1 | No objective
    Technology & Regulatory · 58 projects · $23.1M approved
    ★ | PRJ-005 ▾ Core Platform | Platform | L. Wang | Linh T. | Development | Off track | $3.8M | $4.7M | 20 Aug 2027 | v1.9 | Cost to serve -15%
    Health [5]
    Declared On track · computed Off track
    3 milestones overdue, 2 critical risks
    Next gate
    Test entry · planned 14 Nov 2026
    Stage SLA breached by 34 days
    Budget
    Variance +24% vs approved
    Forecast $4.7M vs approved $3.8M
    Pin Open project
    ☆ | PRJ-006 Data Platform | Platform | L. Wang | A. Wong | Development | At risk | $2.9M | $3.1M | 31 Oct 2027 | v1.9 | Cost to serve -15%
    ☆ | PRJ-011 Treasury API | Platform | L. Wang | A. Wong | Solution | On track | $1.4M | $1.4M | 31 May 2027 | v2.1 | Cost to serve -15%
    ☆ | PRJ-007 AML Upgrade | Regulatory | A. Wong | Linh T. | Test | On track | $1.6M | $1.92M | 31 Mar 2027 | v2.1 | Exempt: regulatory
    ☆ | PRJ-012 KYC Automation | Regulatory | A. Wong | Linh T. | Test | At risk | $1.3M | $1.4M | 28 Feb 2027 | v2.1 | Exempt: regulatory
    Showing 11 of 128 · forecast in red is 20% or more above approved Load more

### Annotations

1. REG-01 One master record per project with a unique ID; the version column shows the framework version the project was created with, which never changes without an approved migration.
2. REG-02 Search by ID or name and one filter row above the table; results update without a page reload and the filters can be saved as a view.
3. REG-03 Rows are grouped by the primary portfolio (POC "Space") and program (POC "Folder"); a project can carry secondary tags for other groupings.
4. CHR-15, BR-02 The tag column shows the linked strategic objective or an approved exemption; a committed project with neither is flagged, as for Card Rewards.
5. RSK-04, BR-39 The expanded row compares declared and computed health; a declared Green with a computed Red is green-but-risky and also appears in the executive attention queue. Computed values state their as-of time and metric version in the page header.

## 17 Portfolio roadmap

- File: screens/17-portfolio-roadmap.html · image: png/17-portfolio-roadmap.png
- Area: Portfolio · Phase: MVP · POC screenshots: none
- Requirements: RMP-01, RMP-02, RMP-03, RMP-04, WBS-14, BR-23
- Context: data-nav=roadmap, data-workspace=Digital Products
- Purpose: Eighteen-month roadmap of projects, MVP milestones and gates grouped by portfolio and program, with the cross-project dependency overlay and its conflicts.

### Content

    Roadmap Q3 2026 to Q4 2027 · 128 projects, 11 shown
    Export
    Portfolio All
    Program All
    Health All
    Zoom [1] Quarter Month
    Group by Portfolio Strategic theme
    Planned V2
    Show MVPs Gates Dependencies
    Overlay [4] Lifecycle stages Planned V2
    Projects, MVPs and gates
    Project
    MVP or milestone
    Gate
    Late or conflict
    Today, 22 Sep 2026
    Project Q3 2026 Q4 2026 Q1 2027 Q2 2027 Q3 2027 Q4 2027
    Growth
    MSME Transformation
    MSME Payment On track
    MVP1 30 Mar [3]
    MVP2 forecast 8 Jul, baseline end 30 Jun
    Merchant Onboarding At risk
    Solution gate, 5 days overdue
    Customer
    Digital Sales At risk
    Mobile App At risk
    CR-016 would add 4 weeks
    Technology & Regulatory
    Platform
    Core Platform Off track
    Core API v2 forecast 27 Jun (+12 days)
    Data Platform At risk
    Treasury API On track
    Solution gate 26 Sep
    Regulatory
    AML Upgrade On track
    KYC Automation At risk
    Dependency conflicts [2] 1
    Conflict Core Platform, Core API v2 to MSME Payment, MVP2 (finish to start)
    Predecessor forecast 27 Jun 2027 (+12 days) leaves MVP2 at 8 Jul 2027, after the MSME Payment baseline end of 30 Jun 2027. Nothing was moved automatically.
    Open dependency Raise change request

### Annotations

1. RMP-01 A 12 to 24 month window with quarter or month zoom and the shared filter row; the window starts in the current quarter so the today line is always visible.
2. RMP-02, WBS-14, BR-23 The overlay draws cross-project dependencies and turns a link red when the successor cannot meet its date; the platform flags the conflict and never reschedules on its own.
3. RMP-01 Filled diamonds are MVP releases and milestones from the WBS, outlined diamonds are lifecycle gates; anything late is red and keeps its label.
4. RMP-03, RMP-04 Grouping by strategic theme needs the strategy model and the lifecycle stage overlay is planned; both are V2.

## 18 Capacity control tower

- File: screens/18-capacity.html · image: png/18-capacity.png
- Area: Portfolio · Phase: MVP · POC screenshots: none
- Requirements: RES-01, RES-02, RES-03, RES-04, BR-07, BR-39
- Context: data-nav=capacity, data-workspace=Digital Products
- Purpose: Capacity, demand, utilization and gap by capability for the workspace, with monthly heat and the projects behind each bottleneck; the allocation editor that feeds demand opens in a side drawer from Edit allocations.

### Content

    Capacity
    Demand from project allocations · capacity from the resource plan · As of 22 Sep 2026, 09:40 · metrics v1
    Period Q4 2026 Q1 2027 Month
    Capability All
    Import capacity file
    Scenario Planned V2 [6]
    Edit allocations
    Capacity [7]
    452 FTE
    7 capabilities
    last confirmed 10 Sep · 12 days ago
    Demand
    474 FTE
    from 96 committed projects
    as of 22 Sep 09:40
    Utilization
    105%
    -22 FTE gap
    Capabilities over threshold
    4
    2 critical · 2 warning
    By capability, Q4 2026 [1] warning from 100%, critical from 110% [2] Table view
    Capability | Capacity | Demand | Utilization | Gap | Status
    Data | 40 | 47
    118%
    | -7 | Critical
    Engineering | 150 | 168
    112%
    | -18 | Critical
    Product | 45 | 48
    107%
    | -3 | Warning
    QA | 60 | 62
    103%
    | -2 | Warning
    Operations | 112 | 109
    97%
    | +3 | OK
    Risk | 20 | 19
    95%
    | +1 | OK
    UX | 25 | 21
    84%
    | +4 | OK
    Total | 452 | 474 | 105% | -22 |
    Utilization by month [3] Table view
    Capability | Oct | Nov | Dec | Jan | Feb | Mar
    Data | 112 | 118 | 124 | 121 | 117 | 110
    Engineering | 106 | 112 | 118 | 115 | 110 | 104
    Product | 103 | 107 | 111 | 108 | 104 | 99
    QA | 100 | 103 | 106 | 104 | 100 | 96
    Operations | 95 | 97 | 99 | 98 | 96 | 94
    Risk | 93 | 95 | 97 | 96 | 94 | 92
    UX | 82 | 84 | 86 | 87 | 85 | 81
    under 90% · 90 to 99 · 100 to 109 · 110 to 119 · 120% and over
    Top bottlenecks [4] 2
    Data · 118% 7 FTE short in Q4
    Data Platform 15.0 FTE
    MSME Payment 9.3 FTE
    Core Platform 6.7 FTE
    Digital Sales 4.1 FTE
    18 other projects 12.0 FTE
    Engineering · 112% 18 FTE short in Q4
    Core Platform 32 FTE
    Mobile App 16 FTE
    Data Platform 14 FTE
    41 other projects 106 FTE
    CR-016 (Mobile App, add iOS) would add 6 Engineering FTE if approved.
    Open Data Platform Open Core Platform
    Thresholds per capability Edit
    Capability | Warning | Critical | Source
    All capabilities | 100% | 110% | Workspace default
    Operations | 105% | 115% | Override, shift-based team
    Changes are audited and apply to the next calculation; history is not recoloured.
    Drawer opened from Edit allocations [5]
    Capacity page: summary, month strip and bottlenecks stay in place behind the drawer
    Edit allocations Close
    Capability Data
    Period Q4 2026 by month
    FTE per project per month · entered by project managers, approved by the Resource Manager
    Project | Owner | Oct | Nov | Dec | Q4 average
    PRJ-006 Data Platform | L. Wang | 14.0 | 15.0 | 16.0 | 15.0
    PRJ-001 MSME Payment | A. Wong | 9.0 | 9.0 | 10.0 | 9.3
    PRJ-005 Core Platform | L. Wang | 6.0 | 7.0 | 7.0 | 6.7
    PRJ-003 Digital Sales | M. Johnson | 3.8 | 4.0 | 4.5 | 4.1
    18 other projects | various | 12.0 | 12.0 | 12.0 | 12.0
    Demand | | 44.8 | 47.0 | 49.5 | 47.1
    Capacity | | 40.0 | 40.0 | 40.0 | 40.0
    Utilization | | 112% | 118% | 124% | 118%
    Import from file Cancel Save allocations

### Annotations

1. RES-01 Utilization is demand divided by capacity per capability; demand is the sum of active project allocations, so every figure traces to a project.
2. BR-07 Warning and critical thresholds are configurable per capability and organization; status always shows a word next to the colour.
3. RES-01 The month strip uses one blue ramp from light to dark (magnitude), cell text switches between ink and white by fill, and a table view carries the same numbers.
4. RES-02 Each bottleneck lists the projects causing the demand, so the fix starts from a project, not from a person.
5. RES-03 Allocations are edited in a side drawer opened from "Edit allocations", so the page keeps its summary, month strip and bottlenecks in view; saving recalculates demand. In the MVP, capacity is kept in the platform or imported from a file and project managers enter allocations; the HR integration that feeds capacity arrives in V2.
6. RES-04 Capacity scenarios (add, remove or shift projects) are V2 and never change the approved baseline until a decision is made.
7. BR-39 Capacity was last confirmed by resource managers 12 days ago, so this tile and the executive cockpit mark it stale with a warning triangle and words; demand is recalculated from allocations and is current.

## 19 Risk and dependency control tower

- File: screens/19-risk-dependency.html · image: png/19-risk-dependency.png
- Area: Portfolio · Phase: MVP · POC screenshots: none
- Requirements: RSK-01, RSK-02, RSK-03, RSK-04, WBS-14, BR-08, BR-23, BR-39
- Context: data-nav=risk, data-workspace=Digital Products
- Purpose: Portfolio view of risks and cross-project dependencies: severity counts, systemic risk chains, green-but-risky projects, the portfolio risk register and the dependency map with downstream impact.

### Content

    Risk & dependencies
    84 open risks across 128 projects · As of 22 Sep 2026, 09:40 · metrics v1
    Portfolio All
    Severity All
    Owner All
    Export
    Critical [1]
    13
    +2 since last week
    High
    30
    8 without mitigation
    Medium
    41
    Systemic
    4
    same cause in 2 or more projects
    Systemic risks [2] 4
    Core API delay Critical
    Core Platform Core API v2 · 12 days late
    →
    MSME Payment MVP2 · 8 days late
    →
    MSME Launch program milestone · 8 days at risk
    Data engineer shortage
    Data capability at 118% in Q4 · Data Platform, MSME Payment, Core Platform, Digital Sales
    Critical
    AML rule change in 2027
    AML Upgrade, KYC Automation
    High
    Payment partner certification
    MSME Payment, Merchant Onboarding
    Medium
    Green-but-risky [3] 1
    Core Platform
    Declared On track · computed Off track
    3 milestones overdue, 2 critical risks · no override recorded
    Ask owner
    AML Upgrade
    Declared On track · computed At risk
    Override by A. Wong on 18 Sep: "contingency approved for the +20% forecast"
    Override
    Overrides need a rationale, stay visible here and are audited.
    Portfolio risk register [4] Score = probability band (1 to 5) × impact (1 to 5) × 4 · Critical from 64, High from 36 Table view
    ID | Risk | Project | Prob. | Impact | Score | Owner | Mitigation | Due | Status
    R-101 | Core API v2 slips past MVP2 need | Core Platform | 70% | Critical | 80 | L. Wang | Fallback with a mock gateway | 15 Oct 2026 | Mitigating
    R-102 | Data engineer shortage in Q4 | Data Platform | 80% | High | 64 | Resource Manager | Contractor pool, defer CRM data work | 30 Sep 2026 | Open
    R-103 | iOS scope (CR-016) overloads Engineering | Mobile App | 50% | High | 48 | A. Wong | Decide CR-016 with the capacity view | 29 Sep 2026 | Open
    R-105 | AML rule change in 2027 | AML Upgrade | 30% | Critical | 40 | A. Wong | Parameterise screening rules | 31 Dec 2026 | Mitigating
    R-104 | KYC rules rework at Solution gate | Merchant Onboarding | 40% | High | 32 | M. Johnson | Early Risk review before the gate | 10 Oct 2026 | Mitigating
    R-106 | Payment partner certification delay | MSME Payment | 35% | High | 32 | A. Wong | Start certification in Q4 | 30 Nov 2026 | Open
    R-107 | KYC vendor contract renewal | KYC Automation | 25% | Medium | 24 | A. Wong | Negotiate a 12-month extension | 15 Nov 2026 | Open
    Showing 7 of 84 · sorted by score Load more
    Dependency map [5]
    Late or conflict At risk On track
    FS +12d
    FS +8d
    FS buffer 10d
    SS +3d
    Core Platform Core API v2 · forecast 27 Jun
    MSME Payment MVP2 · forecast 8 Jul
    MSME Launch program milestone
    Merchant Onboarding pilot · buffer absorbs
    Data Platform Customer 360 feed
    Digital Sales personalisation release
    Downstream impact selected: Core Platform · Core API v2
    +8 days MSME Payment · MVP2
    after the baseline end 30 Jun 2027
    +8 days MSME Launch
    program milestone at risk
    0 days Merchant Onboarding · pilot
    10-day buffer absorbs the slip
    Impacts are flags only; owners decide whether to re-plan or raise a change request. Notify owners

### Annotations

1. RSK-02, BR-39 Severity counts aggregate every project risk register in the workspace with one scoring method and state their as-of time and metric version; each tile opens the filtered register.
2. RSK-02, RSK-03 A risk is systemic when the same cause hits two or more projects; the chain shows how the slip travels downstream, in days.
3. RSK-04, BR-08 A project declared Green while the rules compute Amber or Red stays flagged until an override with rationale is recorded; overrides remain visible and audited.
4. RSK-01 Register fields: risk, project, probability, impact, score, owner, mitigation, due date and status; the scoring rule is shown so every score can be checked by hand.
5. RSK-03, WBS-14, BR-23 Cross-project dependencies with type and slip; selecting a node lists the impacted downstream items. Nothing is rescheduled automatically.

## 20 Investment and benefits

- File: screens/20-investment-benefits.html · image: png/20-investment-benefits.png
- Area: Portfolio · Phase: V2 · POC screenshots: none
- Requirements: INV-01, INV-02, INV-03, INV-04, CHR-13
- Context: data-nav=investment, data-workspace=Digital Products
- Purpose: Portfolio investment by portfolio and program (approved, actual, forecast, CapEx and OpEx), the project value map, the benefits register and value at risk with its method.

### Content

    Planned for V2. In the MVP, project budgets (approved, actual, forecast) roll up as simple sums in the cockpit; this screen adds CapEx and OpEx, benefits and value at risk. [5]
    Investment & benefits
    FY2027 · USD · actuals imported 21 Sep 2026
    Portfolio All
    Fiscal year FY2027
    Export
    Approved
    $50.2M
    96 committed projects
    Actual to date
    $21.6M
    43% of approved
    Forecast
    $51.9M
    +3.4% vs approved
    Expected value
    $83.0M
    from 41 measured benefits
    Value at risk
    $9.2M
    4 projects
    By portfolio and program [1] $M Table view
    Portfolio · program | Approved | Actual to date | Forecast | Variance | CapEx | OpEx | Expected value
    Growth | 27.1 | 11.8 | 28.3 | +4.4% | 16.2 | 12.1 | 49.0
    MSME Transformation | 14.2 | 6.3 | 14.6 | +2.8% | 8.9 | 5.7 | 31.0
    Customer | 12.9 | 5.5 | 13.7 | +6.2% | 7.3 | 6.4 | 18.0
    Technology & Regulatory | 23.1 | 9.8 | 23.6 | +2.2% | 15.1 | 8.5 | 34.0
    Platform | 17.4 | 7.6 | 18.0 | +3.4% | 12.2 | 5.8 | 26.0
    Regulatory | 5.7 | 2.2 | 5.6 | -1.8% | 2.9 | 2.7 | 8.0
    Total | 50.2 | 21.6 | 51.9 | +3.4% | 31.3 | 20.6 | 83.0
    Project value map approved vs expected value, $M
    Approved investment Expected value
    MSME Payment
    2.4 · 9.5 · 4.0x
    Core Platform
    3.8 · 12.0 · 3.2x
    Data Platform
    2.9 · 7.2 · 2.5x
    Digital Sales
    1.9 · 3.1 · 1.6x
    Mobile App
    1.5 · 2.0 · 1.3x
    ROI proxy = expected value ÷ approved investment. AML Upgrade and KYC Automation are regulatory and carry no monetised value.
    Value at risk [3] $9.2M
    Core Platform
    computed Off track · 3 milestones overdue
    $4.8M
    Digital Sales
    forecast 21% over approved
    $1.9M
    Data Platform
    Data capability at 118% in Q4
    $1.3M
    Mobile App
    CR-016 pending, +4 weeks if approved
    $1.2M
    Method: expected value of projects that are Off track, more than 10% over budget or delayed past a release, weighted by slip probability. Configurable per workspace. Edit method
    Funding checkpoints [4]
    Merchant Onboarding · Solution gate
    releases the build tranche of $0.6M · gate 5 days overdue
    Held
    Treasury API · Solution gate, 26 Sep
    releases $0.8M · readiness passed
    Scheduled
    Benefits register [2] 41 benefits · 5 shown + Add benefit
    KPI | Linked to | Baseline | Target | Realized | Owner | Measured on | Status
    Payment adoption | MSME Payment · MVP1 | 42% | 57% | 49% | A. Wong | 31 Mar 2027 | At risk
    Reconciliation time | MSME Payment · MVP1 | 3 h | 1 h | 1.5 h | A. Wong | 31 Mar 2027 | At risk
    Digital sales share | Digital Sales | 22% | 40% | 26% | M. Johnson | 30 Sep 2027 | On track
    Cost to serve per account | Core Platform | $18.0 | $15.3 | $17.4 | L. Wang | 31 Dec 2027 | Off track
    AML false positive rate | AML Upgrade | 12% | 6% | 11% | A. Wong | 31 Mar 2027 | On track

### Annotations

1. INV-01, CHR-13 Approved, actual, forecast, variance, CapEx and OpEx by portfolio and program; every total reconciles with the project records it sums.
2. INV-02 Each benefit is a KPI with baseline, target, realized value, an owner and a measurement date, linked to a project or MVP.
3. INV-03 Value at risk shows its method next to the number; the method is configurable per workspace and changes are audited.
4. INV-04 Funding tranches are tied to configured stage gates and released only by the gate decision.
5. CHR-13 Until V2, budgets live on each project charter and the cockpit shows simple sums; no value figures are shown before benefits exist.

## 21 Scenario planner

- File: screens/21-scenario-planner.html · image: png/21-scenario-planner.png
- Area: Portfolio · Phase: V2 · POC screenshots: none
- Requirements: STR-02, STR-03, STR-04, STR-05, BR-10, BR-11
- Context: data-nav=scenario, data-workspace=Digital Products
- Purpose: What-if planning on a copy of the portfolio: budget and capacity levers, baseline versus scenario, recommended stop, delay, protect and reallocate actions, applied only as a proposal.

### Content

    Planned for V2. Scenarios run on a copy of the portfolio; the approved baseline never changes from this screen.
    Scenario: budget minus 15%
    Draft by Linh T. · 21 Sep 2026 · baseline FY2027 approved portfolio
    Compare scenarios
    Save
    Apply as proposal [4]
    Levers
    Budget change
    -15%
    $50.2M to $42.7M
    Minimum portfolio score [2] 50
    weights: strategic 30, customer 20, financial 20, risk 10, urgency 10, feasibility 10
    Protect regulatory projects
    Protect committed MVP releases
    Protect projects past Test [5]
    Capacity ceiling 100% per capability
    Recalculate
    Baseline vs scenario [1] Table view
    Measure | Baseline | Scenario | Change
    Budget | $50.2M | $42.7M | -$7.5M
    Active projects | 128 | 109 | -19
    FTE demand | 474 | 431 | -43
    Utilization (capacity 452) | 105% | 95% | -10 pts
    Expected value | $83.0M | $77.0M | -$6.0M
    Recommended actions advisory
    STOP 9 lowest-score initiatives, 6 of them proposals -$3.4M · 20 FTE
    DELAY 10 low-urgency initiatives moved to FY2028 -$4.1M · 23 FTE
    PROTECT 8 regulatory and committed MVP releases no change
    REALLOCATE 12 released Engineering FTE to Core Platform and Data Platform 0 net
    Capacity impact [3]
    Baseline Scenario
    Data
    118% · 104%
    Engineering
    112% · 99%
    Product
    107% · 97%
    QA
    103% · 93%
    Bars share one axis, 0 to 125%.
    Impact on projects 19 changed · 6 shown All projects
    Project | Score | Stage | Action | Budget | FTE | Value | Reason
    PRJ-009 Branch Kiosk | 38 | Discovery | Stop | -$0.8M | -4 | -$0.6M | score below 50, proposal only
    PRJ-008 CRM Refresh | 44 | Discovery | Delay | -$0.9M | -5 | -$0.4M | low urgency, Data capability over 100%
    PRJ-004 Mobile App | 52 | Development | Delay | -$0.5M | -6 | -$0.3M | iOS scope (CR-016) moved to FY2028
    PRJ-001 MSME Payment | 86 | Development | Protect | 0 | 0 | 0 | committed MVP1 release 30 Mar 2027
    PRJ-007 AML Upgrade | 71 | Test | Protect | 0 | 0 | 0 | regulatory, past Test
    PRJ-005 Core Platform | 78 | Development | Reallocate | 0 | +8 | 0 | receives released Engineering FTE

### Annotations

1. STR-03 Baseline against scenario for budget, projects, FTE, utilization and expected value, computed on a copy of the portfolio.
2. STR-02 Recommendations follow the portfolio score; the weights are visible and changes to them are audited, so every stop or delay can be explained.
3. STR-04 Capacity impact by capability shows which bottlenecks the scenario relieves; both series share one axis.
4. BR-10, BR-11 "Apply as proposal" creates a decision proposal for an authorized executive; the approved baseline and project data stay unchanged.
5. STR-05 Lifecycle stage and governance readiness feed the evaluation; projects past Test are protected by default.

## 22 SteerCo report

- File: screens/22-steerco-report.html · image: png/22-steerco-report.png
- Area: Portfolio · Phase: V2 · POC screenshots: none
- Requirements: ANL-01, ANL-02, ANL-03, ANL-04, AIC-06, BR-39
- Context: data-nav=steerco, data-workspace=Digital Products
- Purpose: Report builder and preview for the executive portfolio review: health, investment, movements, decisions required and appendices, generated from live data for a period and portfolio.

### Content

    Planned for V2. The MVP has project-level weekly status reports; portfolio packs for SteerCo come with portfolio analytics.
    SteerCo report
    Save Share link Export PDF
    Build [1]
    Template [2] SteerCo pack Weekly
    Period Q3 2026 · 1 Jul to 30 Sep
    Portfolio All portfolios
    Sections
    Executive summary
    Top movements
    Decisions required
    Project health
    Risks
    Change requests
    Capacity
    Investment
    Governance
    Draft narrative with AI Planned V3
    Drafts are reviewed and edited by a person before the pack is published. [5]
    Generate
    Digital Products · prepared by M. Johnson (PMO) · 22 Sep 2026
    SteerCo portfolio review, Q3 2026
    Data as of 22 Sep 2026, 09:40 · metrics v1 · every figure links to its records [3]
    Executive summary
    Portfolio health
    73 / 100
    delivery 81 · risk 64
    Investment
    $50.2M
    forecast $51.9M
    Off track
    17
    of 128 projects
    Capacity
    105%
    demand 474 · capacity 452 FTE
    Delivery held steady but risk and capacity worsened. Core Platform is the main exposure: it reports On track while the rules compute Off track, and its Core API v2 delay pushes MSME Payment MVP2 past its baseline end. Data and Engineering capacity are above the critical threshold in Q4.
    Top movements since the Q2 review
    ▲ Payment adoption (MSME Payment MVP1) 43% to 49%
    ▼ Projects off track 13 to 17
    ▼ Engineering capacity after attrition 158 to 150 FTE
    ▼ Open change requests 2 to 5
    Decisions required
    CR-016, Mobile App iOS support (+$300K, +4 weeks, +6 Engineering FTE): approve, or defer to FY2028. Recommendation: defer, Engineering is at 112%.
    Core Platform recovery plan : accept the computed Off track status and re-plan Core API v2, or record an override with rationale. Owner L. Wang.
    Reallocate 12 Engineering FTE from stopped and delayed work to Core Platform and Data Platform. Owner Resource Manager.
    Governance [4]
    Gates decided
    14
    11 pass · 2 conditional · 1 rework
    First-pass approval
    79%
    11 of 14 gates
    CR cycle time
    6 days
    median, submission to decision
    Reporting compliance
    96%
    4 weekly reports missing
    Appendix
    A. Project health, 128 projects B. Risks, 13 critical C. Change requests, 5 open D. Capacity by capability E. Investment by program

### Annotations

1. ANL-01 The pack is generated for a chosen period and portfolio from live data, with selectable sections; saved packs keep the figures of their generation date.
2. ANL-02 The weekly portfolio report variant shows only material changes since the previous week and the exceptions that need action.
3. ANL-03, BR-39 Every figure in the preview links to the projects and source records behind it, using the BRD Section 12 definitions; the pack states its as-of time and metric version, and a saved pack is a snapshot.
4. ANL-04 Governance analytics: gate outcomes, first-pass approval, CR cycle time and reporting compliance for the period.
5. AIC-06 AI drafting of the narrative is V3; a person always reviews and edits the text before the pack is published.

## 23 AI portfolio copilot

- File: screens/23-ai-copilot.html · image: png/23-ai-copilot.png
- Area: Portfolio · Phase: V3 · POC screenshots: none
- Requirements: AIC-01, AIC-02, AIC-03, MCP-04, MCP-08, MCP-10, BR-10
- Context: data-nav=copilot, data-workspace=Digital Products
- Purpose: In-app copilot that answers portfolio questions with cited records, evidence, assumptions and confidence, and turns recommendations into a scenario or a prepared decision, never an executed one.

### Content

    Planned for V3. The copilot uses the same tool layer and permissions as the MCP server; it can prepare decisions but never execute them.
    AI copilot
    Scope: Digital Products As: Linh T., Executive [4] New conversation
    LT Which projects should I stop if I need to reduce investment by 10%?
    AI
    A 10% cut is $5.0M of the $50.2M approved portfolio. Stopping or deferring these five items reaches $5.1M and releases 29 FTE , mostly in Data and Engineering where Q4 demand is above capacity. [1]
    Action | Project | Score | Saves | FTE | Value lost
    Stop | PRJ-009 Branch Kiosk | 38 | $0.8M | 4 | $0.6M
    Stop | 4 proposals scored below 45 | 39 to 44 | $1.6M | 8 | $0.9M
    Defer | PRJ-008 CRM Refresh | 44 | $0.9M | 5 | $0.4M
    Defer | PRJ-004 Mobile App , iOS scope and CR-016 | 52 | $0.8M | 6 | $0.3M
    Defer | PRJ-011 Treasury API phase 2 | 58 | $1.0M | 6 | $0.5M
    | Total | | $5.1M | 29 | $2.7M
    Evidence [2]
    portfolio score below 50, or below 60 with no committed release
    value to investment under 1.5x
    demand on Data or Engineering in Q4
    Assumptions
    proposals carry no sunk cost
    deferral costs not included
    FY2027 budget only
    Confidence
    Medium
    2 proposals have no benefit estimate yet.
    Protected: AML Upgrade, KYC Automation (regulatory), MSME Payment (committed MVP1).
    Create scenario
    Prepare decision [5]
    View evidence
    Ask follow-up
    I cannot stop or defer projects. "Prepare decision" drafts a proposal that an authorized executive approves in the Decision Log.
    Ask about this portfolio, a project or a decision
    Send
    Try: Which gates are at risk this month? Summarise Core Platform for SteerCo What changed since last week?
    Tools used [3] same layer as MCP
    get_portfolio_summary 09:41:02 budget, capacity and scores, computed by the server 1
    list_projects 09:41:03 score below 60, not protected 8
    list_change_requests 09:41:03 open requests that add cost 1
    list_risks 09:41:04 systemic risks on candidates 2
    Runs with Linh T.'s permissions in Digital Products only; every call is in the audit log.

### Annotations

1. AIC-01 Answers cite the records they rely on; every project, CR and figure is a link to its source.
2. AIC-02 A recommendation always carries its evidence, assumptions and confidence, and names the projects it protected.
3. MCP-10 Totals and KPIs come from server tools with the BRD Section 12 definitions; the model narrates and does not calculate them.
4. MCP-04 The copilot acts as the signed-in user, inside the selected workspace, with the same permissions as the app and the MCP server.
5. AIC-03, MCP-08, BR-10 Actions only create a scenario or prepare a decision; stopping, deferring or approving needs an authorized person in the app.

## 24 Project overview

- File: screens/24-project-overview.html · image: png/24-project-overview.png
- Area: Project execution · Phase: MVP · POC screenshots: 02, 03
- Requirements: OVW-01, OVW-02, OVW-03, OVW-04, OVW-05, BR-39
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=overview
- Purpose: Read-only project dashboard computed from the WBS with the BRD Section 12 metric definitions; every tile drills down.

### Content

    Overview As of 22 Sep 2026, 09:40 · metrics v1 12 work items · Category rows excluded
    This project My items Export
    Work items [1]
    12
    6 category rows not counted
    Deliverables
    3
    Type = Deliverable
    Work packages
    2
    Milestones
    3
    3 overdue
    Approval gates
    2
    2 overdue
    Blocked
    0
    Delayed vs baseline [2]
    2
    +2 since baseline v1
    High risk
    4
    1 critical
    Overall progress [3]
    25% 3 of 12 work items done
    Same value as the Weekly Status report for the same date.
    Status breakdown Table view
    Done 3 In Progress 3 Waiting 1 Blocked 0 Not Started 5
    Health [4]
    Declared by PM At risk
    Computed Off track
    Declared health is better than computed. Delivery: 9 overdue items including 3 milestones. Risk: 1 critical risk without mitigation.
    Progress by category done / work items
    Deliverables 0 / 5
    Technical 2 / 2
    Quality 0 / 2
    Timeline 0 / 1
    Resource 1 / 1
    Risk 0 / 1
    Workload by PIC open items only
    DK Denny K. 4
    NR Nadia R. 3
    SW Sasha W. 1
    AL Art Lead 1
    Upcoming milestones & gates [5] View in WBS
    None due from today. 3 milestones and 2 gates are overdue (see Overdue).
    Overdue 9
    1.1.1 Phase 1 Render Delivery 60d
    3.1 Visual Quality Approval 59d
    1.1 51 Render Images 43d
    1.1.2 Phase 2 Render Delivery 43d
    + 5 more · open in Focus
    High & critical risk items 4
    6.1 Client Feedback Risk Critical
    1.2 3D Film (2 to 3 minutes) High
    3.2 Client Approval Gate High
    4.1 Timeline Risk High

### Annotations

1. OVW-01, BR-24, BR-39 Counts follow BRD Section 12 and state their as-of time and metric version: Category rows are grouping nodes and are never counted. The POC showed 18 items and 22% here because it counted them.
2. OVW-01 Delayed compares current target dates with the baseline; Overdue compares with today. Before a baseline exists the tile shows "Not baselined".
3. OVW-02 A meter replaces the POC donut (dataviz rule: progress is one number). Status breakdown is a stacked bar with a legend and a table view.
4. OVW-05, BR-08 Declared versus computed health. A declared Green with a computed Red is flagged as green-but-risky in the executive attention queue.
5. OVW-03, OVW-04 "Upcoming" only lists items with a target date from today; every tile, segment and row opens the filtered WBS or the item.

## 25 Project charter and business case

- File: screens/25-project-charter.html · image: png/25-project-charter.png
- Area: Project execution · Phase: MVP · POC screenshots: 04, 05, 06, 07, 08
- Requirements: CHR-01, CHR-02, CHR-03, CHR-04, CHR-05, CHR-06, CHR-07, CHR-08, CHR-09, CHR-10, CHR-11, CHR-12, CHR-13, CHR-14, CHR-15, CHR-16, BR-01, BR-02, BR-03, BR-22, BR-39, PLT-16, PLT-20
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=charter
- Purpose: Nine-section charter that is a live slice of project data, with a sticky section navigator showing completion and what is required before commitment: sections V and VI are derived from the WBS and collapsed, VII reads from the risk register, sign-off freezes a revision and a PDF pins a data snapshot.

### Content

    Charter
    Rev 1 · signed 25 Jun 2026
    Rev 2 draft · 4th hero angle pending CR-001
    View revisions
    Compare Planned V2
    Export JSON
    Export PDF [6]
    Issue Rev 2
    Export PDF pins a data snapshot: it states its as-of time, metric version and generator, and downloading it again returns the same file.
    I. Project identification Shared with Overview, WBS and Timeline
    Project name Meridian CGI Campaign
    Client / department Northwind Furniture Co.
    Project number NW-2026-014
    Project manager NR Nadia R.
    Start date 25 Jun 2026
    Target completion 2 Sep 2026
    Baseline v1 [5] ?
    Baseline Approved snapshot of scope, dates, budget and critical dependencies; changed only through CRs. Open glossary [8]
    Overall status In Progress
    Contract value / no. $148,000
    Lifecycle position Production · stage 3 of 6 Creative Production v1.2
    Revision Rev 2 (draft) · "Adds a 4th hero render angle, pending CR-001"
    Project team
    Name | Title / role
    NR Nadia R. | Project Manager
    DK Denny K. | 3D Lead
    SW Sasha W. | Art Director
    HL H. Le | Studio Director, project owner
    II. Key contacts + Add contact
    Role | Name | Email | Phone
    Approved Representative | JP J. Park | name@client.example | Not set
    Contracting Officer Representative | Not set | Not set | Not set
    Key Contact | NR Nadia R. | name@acme.example | Not set
    III. Description and objectives · IV. Scope
    Description
    Still renders and a hero film for the Meridian product launch of Northwind Furniture Co.
    Objectives
    Deliver 51 still renders of the hero product range
    Deliver a 2 to 3 minute hero film
    Hand over all final assets by the target completion date
    In scope
    51 still renders, 3D film, final asset package.
    Out of scope
    Not entered yet.
    Detailed deliverables and dates come from the WBS (section V).
    ▸ V. Deliverables [1] Derived from WBS 3 deliverables · 1 in progress, 2 not started Expand
    ▸ VI. Input required: client commitments [2] Derived from WBS 2 commitments · both done Expand
    VII. Overall project risk [3] From risk register + Add risk
    WBS | Risk | Owner | Level | Mitigation plan
    6.1 | Client Feedback Risk | Nadia R. | Critical | Not entered
    1.2 | 3D Film (2 to 3 minutes) | Sasha W. | High | Not entered
    4.1 | Timeline Risk | Denny K. | High | Overnight render queue (CR-002)
    VIII. Other notes · IX. Sign-off [4]
    Other notes
    Signer | Role | Date | Revision | Method
    JP J. Park | Client Representative | 25 Jun 2026 | Rev 1 | In-app sign-off
    HL H. Le | Project Owner | 25 Jun 2026 | Rev 1 | In-app sign-off
    NR Nadia R. | Project Manager | 25 Jun 2026 | Rev 1 | In-app sign-off
    Rev 1 is frozen. Edits made since then form Rev 2, which needs a new sign-off once issued.
    Sections [7] stays in view while scrolling
    I. Project identification * ✓ Complete
    II. Key contacts * ◐ 1 role not set
    III. Description and objectives * ✓ Complete
    IV. Scope * ◐ Out of scope missing
    V. Deliverables ⇄ Derived
    VI. Input required ⇄ Derived
    VII. Overall project risk ◐ 2 mitigations missing
    VIII. Other notes ○ Empty, optional
    IX. Sign-off ✓ Rev 1 signed
    Business case and budget * ◐ 3 fields missing
    * Required before commitment ?
    Business case and budget Approved
    Contract value $148,000
    Budget approved Not set
    Actual to date Enter or import
    Forecast Not set
    Variance Calculated once budget and forecast exist
    Project owner HL H. Le
    Executive sponsor Select sponsor
    Strategic objective Select objective or record exemption
    Problem, opportunity, target customer, rationale, alternatives, benefits and assumptions open in the business case editor.
    Open business case
    Revisions Compare Planned V2
    Rev 2 Draft
    Adds a 4th hero render angle, pending CR-001 · not issued
    Rev 1 Issued and frozen
    Signed 25 Jun 2026 by J. Park, H. Le, Nadia R.
    Open
    How this charter stays current
    Sections V and VI read from the WBS Master. Section VII reads from the risk register. Section I shares its fields with the project record.
    Editing a deliverable date in the WBS updates section V immediately.

### Annotations

1. CHR-05, BR-22 Read-only view of WBS work items with Type = Deliverable, collapsed by default to a one-line summary because it is derived; it is edited in the WBS. The POC showed none here because its Category rows were stored as Deliverable.
2. CHR-06 Items labelled Input Required are the client's commitments, with PIC (the client shows a dashed avatar), target and a note that lives only on the charter; derived, so collapsed by default like section V.
3. CHR-07 Top risks come from the project risk register; a risk added here is saved to the register, so the two never diverge.
4. CHR-08, CHR-09 Sign-off is recorded per authenticated signer, date and revision instead of the POC's plain text boxes. A signed revision is frozen; comparison of revisions is V2 (CHR-10).
5. CHR-02, BR-04 Target completion is locked by baseline v1; changing it opens a change request instead of an inline edit.
6. CHR-11, PLT-16, BR-39, CHR-12 to CHR-15 PDF and JSON export as in the POC; a PDF is a snapshot that states its as-of time, metric version and generator and is kept, so downloading it again returns the same file. The side card holds the business case, budget, owner, sponsor and strategic link required before commitment; unknown values stay empty.
7. CHR-01, BR-01, BR-02, BR-03 The section navigator stays in view while scrolling and jumps to each section. It shows completion with shape and words (✓ complete, ◐ partial with what is missing, ○ empty, ⇄ derived) and marks with * what must be complete before commitment: sections I to IV and the business case with owner, sponsor, strategic link, budget and target date. The business case gaps are flagged because this project is already committed.
8. PLT-20 Product terms used as labels (Baseline here, commitment in the navigator) have a ? that opens the glossary definition in place, taken from Appendix A.

## 26 WBS Master: table view

- File: screens/26-wbs-table.html · image: png/26-wbs-table.png
- Area: Project execution · Phase: MVP · POC screenshots: 09, 10, 11
- Requirements: WBS-01, WBS-02, WBS-03, WBS-04, WBS-05, WBS-06, WBS-18, WBS-19, WBS-20, BR-04, BR-24
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=wbs
- Purpose: Single source of truth for project work: tree table with category rows, saved views and column presets, instant filters, bulk actions, inline edits and baseline locks.

### Content

    WBS Master
    Table Tree Blueprint
    12 work items · 6 categories · codes generated automatically [5]
    Deliverable Builder + Add item
    Views [7]
    All items My open items Client inputs · shared This phase · shared
    Save current view
    Columns All columns
    Planning Start, Target, Duration, Dependencies
    Tracking Status, PIC, Target
    Risk Risk level, Labels
    ✓ All columns Every column of the item form that fits a table
    WBS and Description stay frozen in every preset
    Category All
    Phase All
    Type All
    Status All
    PIC [3] All
    Filters apply as you choose; matches keep their parent rows.
    2 selected
    Status PIC Phase
    Priority Risk Delete
    [4]
    Clear selection
    | WBS [1] | Description | Type | Phase | PIC
    Start | Target [6] | Dur. | Status | Priority | Risk | Actions
    | ▾ 1.0 Deliverables (5) [2] | All client-facing outputs | Category | | | 6 Jul | 2 Sep | | Rolled up | | | +
    | 1.1 51 Render Images | Full still-frame render set | Deliverable | Production | DK Denny K. | 6 Jul | 10 Aug | 36d | In Progress | High | Medium | + ⧉ ⌁ ×
    | 1.1.1 Phase 1 Render Delivery | First 25 renders for sign-off | Task | Production | DK Denny K. | 6 Jul | 24 Jul | 19d | In Progress | High | Medium | + ⧉ ⌁ ×
    | 1.1.2 Phase 2 Render Delivery | Remaining 26 renders | Task | Production | DK Denny K. | 25 Jul | 10 Aug | 17d | Not Started | High | Medium | + ⧉ ⌁ ×
    | 1.2 3D Film (2 to 3 minutes) | Hero animated film for launch | Deliverable | Production | SW Sasha W. | 13 Jul | 28 Aug | 47d | Not Started | Critical | High | + ⧉ ⌁ ×
    | 1.3 Final Delivery | Final assets packaged and handed over | Deliverable | Delivery | NR Nadia R. | 29 Aug | 2 Sep | 5d | Not Started | Critical | Medium | + ⧉ ⌁ ×
    | ▾ 2.0 Technical (2) | Source assets and references | Category | | | 29 Jun | 5 Jul | | Rolled up | | | +
    | 2.1 CAD / Design Files | Product CAD geometry from the client | Work Package | Initiation | JP Client | 29 Jun | 3 Jul | 5d | Done | High | Low | + ⧉ ⌁ ×
    | 2.2 Tone / Mood Reference | Lighting, palette and mood board | Work Package | Initiation | SW Sasha W. | 29 Jun | 5 Jul | 7d | Done | Medium | Low | + ⧉ ⌁ ×
    | ▾ 3.0 Quality (2) | Reviews and approvals | Category | | | Not set | 28 Aug | | Rolled up | | | +
    | 3.1 Visual Quality Approval | Internal visual sign-off | Task | Review | AL Art Lead | Not set | 25 Jul | - | Waiting | High | Medium | + ⧉ ⌁ ×
    | 3.2 Client Approval Gate | Client approval of final set | Task | Review | NR Nadia R. | 20 Aug | 28 Aug | 9d | Not Started | Critical | High | + ⧉ ⌁ ×
    | ▸ 4.0 Timeline (1) | Schedule risks | Category | | | Not set | 10 Aug | | Rolled up | | | +
    | ▸ 5.0 Resource (1) | Render capacity | Category | | | Not set | 29 Jun | | Rolled up | | | +
    | ▸ 6.0 Risks (1) | Client feedback risk | Category | | | Not set | 28 Aug | | Rolled up | | | +
    Legend: Milestone Checkpoint Approval Gate Input Required Risk Related
    · Dur. = duration in calendar days · actions: add child, duplicate, attach, delete · baselined target

### Annotations

1. WBS-01, WBS-04 Every column except code and Duration edits inline. The table, tree, item form, Board and Builder all write to this one WBS; no other view keeps a copy.
2. WBS-18, BR-24 Category rows group work by PM control area. Their dates and status roll up and they are never counted; the POC stored them as Type = Deliverable and counted them.
3. WBS-05 Category, Phase, Type, Status and PIC filters apply instantly, with no Apply button, and keep each match's parent rows visible.
4. WBS-06, WBS-19 Bulk changes are written to each item's activity. Delete asks for confirmation and lists children and dependencies that go with it.
5. WBS-02, WBS-03 Codes are generated and renumbered when items move; a permanent internal ID keeps links and history. The POC made users type the WBS ID by hand.
6. BR-04 Deliverable and milestone targets captured in baseline v1 show a lock; changing one opens a change request instead of an inline edit.
7. WBS-20 Saved views keep filters, columns, sort and expansion: personal views (My open items) are the user's own, shared views (Client inputs, This phase) are available to every project member. Column presets: Planning (dates, duration, dependencies), Tracking (status, PIC, target), Risk (risk level, labels) or All columns; WBS and Description stay frozen, and the table is fully operable from the keyboard (arrow keys move between cells, Enter edits, Space selects a row); the ring marks the cell with keyboard focus (3.2 Status), while selected rows use the light accent fill.

## 27 WBS Master: tree diagram and blueprint

- File: screens/27-wbs-tree.html · image: png/27-wbs-tree.png
- Area: Project execution · Phase: MVP · POC screenshots: 12, 13, 14
- Requirements: WBS-08, WBS-09, WBS-10, WBS-13, BR-23, BR-40, BR-41
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=wbs
- Purpose: Hierarchy canvas of the same WBS with automatic layouts, zoom, keyboard navigation and dependency arrows that flag conflicts only when both dates exist; Blueprint shows the Builder canvas per deliverable.

### Content

    WBS Master
    Table Tree Blueprint
    Auto vertical Auto horizontal Free move Planned V2
    [2]
    − 85% +
    Expand view
    Meridian CGI Campaign
    1.0 Deliverables
    2.0 Technical
    3.0 Quality
    4.0 Timeline
    5.0 Resource
    6.0 Risks
    1.1 51 Render Images
    1.2 3D Film (2 to 3 min)
    1.3 Final Delivery
    2.1 CAD / Design Files
    2.2 Tone / Mood Ref.
    3.1 Visual Quality Appr.
    3.2 Client Approval Gate
    4.1 Timeline Risk
    5.1 Render Farm Alloc.
    6.1 Client Feedback Risk
    1.1.1 Phase 1 Render Delivery
    1.1.2 Phase 2 Render Delivery
    Conflict
    Dependencies 1 conflict
    FS 1.1.1 then 1.1.2
    OK
    FS 1.2 then 3.2
    3.2 starts 20 Aug before 1.2 finishes 28 Aug
    Conflict
    FS 3.2 then 1.3
    OK
    FS 2.2 then 3.1
    Schedule data incomplete: 3.1 has no start date
    Incomplete
    Conflicts are flagged on both items. Dates never move on their own.
    Blueprint [4]
    Deliverable 1.1 51 Render Images
    No blueprint for 1.1 yet. Blueprints are saved when a deliverable is built with the Deliverable Builder. Open Deliverable Builder
    Arrows: violet = finish-to-start red = conflict grey dashed = schedule data incomplete
    · grey lines = hierarchy · rounded nodes = work items, dark border = categories (not counted)
    Keyboard: arrow keys move between nodes · Enter opens the item · Tab moves along dependency links · the Table view is the list equivalent [5]

### Annotations

1. WBS-08 Same data as the table, drawn as a hierarchy with Auto vertical and Auto horizontal layouts, zoom and an expanded full-screen view.
2. WBS-09 Free move, where users drag nodes anywhere and positions are remembered, is planned for V2. The POC offered it as the default layout.
3. WBS-13, BR-23, BR-40 Dependency arrows show FS, SS, FF and SF links. 3.2 starts 20 Aug before 1.2 finishes 28 Aug, so the FS link is flagged on both items and no date is moved. A conflict is evaluated only when both compared dates exist: 3.1 has no start date, so the 2.2 then 3.1 link shows "schedule data incomplete" instead of a conflict.
4. WBS-10 Blueprint shows the Deliverable Builder canvas saved for each deliverable, one per deliverable; the empty state points to the Builder, as in the POC.
5. BR-41 Everything on the canvas works from the keyboard: arrow keys move between nodes, Enter opens the item, Tab follows dependency links; the Table view shows the same items and links as a list.

## 28 WBS item form and activity

- File: screens/28-wbs-item.html · image: png/28-wbs-item.png
- Area: Project execution · Phase: MVP · POC screenshots: 19, 20, 21
- Requirements: WBS-11, WBS-12, WBS-13, WBS-15, WBS-16, WBS-17, MCP-06, MCP-11, BR-23, BR-40
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=wbs
- Purpose: Item form for 1.1.2 split into General, Schedule, Dependencies and Activity tabs: derived level, generated code, assignments from the team, dependencies that flag but never move dates, and an activity feed that marks actions made through MCP.

### Content

    WBS | Description | Type | Phase | PIC | Start | Target | Status
    1.0 Deliverables | All client-facing outputs | Category | | | 6 Jul | 2 Sep | Rolled up
    1.1 51 Render Images | Full still-frame render set | Deliverable | Production | Denny K. | 6 Jul | 10 Aug | In Progress
    1.1.1 Phase 1 Render Delivery | First 25 renders | Task | Production | Denny K. | 6 Jul | 24 Jul | In Progress
    1.1.2 Phase 2 Render Delivery | Remaining 26 renders | Task | Production | Denny K. | 25 Jul | 10 Aug | Not Started
    Edit WBS item · 1.1.2 Phase 2 Render Delivery Close
    General Schedule Dependencies 1 Activity 3
    WBS code [1] 1.1.2 · generated
    Parent 1.1 51 Render Images
    Level Level 3 · derived
    Category (PM control area) Deliverables
    Type (work object level) Task
    Phase (lifecycle stage) Production
    Labels
    Milestone Checkpoint Approval Gate Input Required Risk Related
    Name * Phase 2 Render Delivery
    Description Remaining 26 renders delivered.
    Notes Notes
    Input required (list) Comma-separated inputs
    Output produced (list) Comma-separated outputs
    PIC [2] DK Denny K.
    Reviewer Select a team member
    Approver Select a team member
    Status Not Started
    Priority High
    Risk level Medium
    Files and links [6] No files yet · Add file or link
    Discard changes Save item
    The other three tabs of the same form Shown side by side for review; in the product one tab is visible at a time
    Schedule tab
    Start date 25 Jul 2026
    Target date 10 Aug 2026
    Duration (auto) [4] 17 calendar days
    Planned effort e.g. 40h
    Actual effort 12h or 2d 4h
    The target date is locked by baseline v1; change it through a change request.
    Dependencies tab [3] 1 waiting
    FS After 1.1.1 Phase 1 Render Delivery
    Predecessor is In Progress and 60 days past its 24 Jul target; this item cannot start yet
    Type: FS, SS, FF, SF
    Add a predecessor this item depends on
    A conflict needs both compared dates; a missing date shows "schedule data incomplete". Conflicts are flagged on both items and dates never move.
    Activity tab [5] All Comments Changes
    AI Comment via MCP · token Nadia's assistant
    Summary of a client email added from the journal entry of 22 Sep. Posted on behalf of Nadia R. · 22 Sep 2026
    NR Nadia R. commented
    Hold Phase 2 renders until CR-001 is decided. @Denny K. · 19 Sep 2026
    ◇ Baseline v1 captured
    Target 10 Aug 2026 locked; changes go through change requests · 25 Jun 2026
    Write a comment, use @ to mention
    as Nadia R. Attach Send

### Annotations

1. WBS-11 The code is generated and the level is derived from the position, so neither is typed by hand as in the POC. Planned effort (Schedule tab) is new and feeds capacity.
2. WBS-12 PIC, Reviewer and Approver are picked from workspace members; the client can be picked only for Input Required items. Free-text names are not accepted.
3. WBS-13, BR-23, BR-40 Predecessor links use FS, SS, FF or SF. An overdue predecessor is flagged on this item; no date is changed automatically. A conflict is evaluated only when both compared dates exist; otherwise the link shows "schedule data incomplete".
4. WBS-15 Duration is target minus start plus one: 25 Jul to 10 Aug is 17 calendar days. Workspaces can switch to working days.
5. WBS-16, MCP-06, MCP-11 Activity mixes changes and comments with @mentions. A comment written through MCP shows the square AI avatar, the token name and the person it acts for, and is audited.
6. WBS-17 Files and links attach once the item exists and are stored with access control, unlike the POC where uploads lived in browser storage.
7. WBS-11 The form is split into four tabs so no view is longer than one screen. General: WBS code, parent, level, Category, Type, Phase, Labels, Name, Description, Notes, Input Required and Output Produced lists, PIC, Reviewer, Approver, Status, Priority, Risk Level, Files and Links. Schedule: Start, Target, Duration, Planned and Actual Effort. Dependencies: predecessor links. Activity: changes and comments. Every WBS-11 field is one click away, and a tab label shows a red dot when a field inside it fails validation.

## 29 Deliverable Builder

- File: screens/29-deliverable-builder.html · image: png/29-deliverable-builder.png
- Area: Project execution · Phase: MVP · POC screenshots: 15, 16, 17, 18
- Requirements: BLD-01, BLD-02, BLD-03, BLD-04, BLD-05, BLD-06, BLD-07, BLD-08, BLD-10, BLD-12, BR-31, BR-41
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=wbs
- Purpose: Pick a target deliverable and a process framework, adjust the swimlane canvas or its keyboard list view, preview the result, then build 16 pre-wired WBS items with labels, dependencies and a saved Blueprint.

### Content

    WBS Master (table) behind the Builder
    Deliverable Builder · 1.4 Demo Deliverable Close
    1 · Which deliverable is this for? [1]
    Build under an existing item
    Create a new deliverable
    Deliverable name Demo Deliverable
    Parent category 1.0 Deliverables
    New code: 1.4 (generated)
    2 · Choose a process framework
    CGI Still Renders Camera Angle to Draft to Pre-Finals to Final, gated by approvals, quality checks, deposits and milestones 16 items · 15 relationships Preview
    3D Animation / Video PreViz to Draft Flow to Frame Check to Final Render, with client approvals and voice or footage inputs 12 items · 11 relationships Preview
    Simple Review Loop Draft to Internal Review to Client Review to Final 6 items · 5 relationships Preview
    Start date 22 Sep 2026
    [2] Canvas List
    Mouse: drag a node along its lane to reschedule, click to edit with the full item form, drag the link handle onto another node to connect, double-click a lane line to add a point, select an arrow and press Delete, + adds a node. Keyboard: Tab, arrow keys, Enter, C and Delete on the canvas, or every edit in the List view.
    Deliverables
    1.4.1 Camera Angle
    1.4.2 Draft
    1.4.3 Pre-Finals
    1.4.4 Final
    Approval
    1.4.5 C.A. Approval
    1.4.6 Draft Approval
    1.4.7 Prefinal Approval
    Input required
    1.4.8 Confirmed Modeling
    1.4.9 Payment Deposit 1
    1.4.10 Payment Deposit 2
    Quality gate
    1.4.11 Quality Check 1
    1.4.12 Final Quality Check
    Milestones
    1.4.13 Milestone 1: Angles locked
    1.4.14 Milestone 2: Prefinal locked
    Risk
    1.4.15 Risk Mitigation #1
    1.4.16 Communication
    Lane to WBS label [4]
    Approval → Approval Gate
    Input required → Input Required
    Quality gate → Checkpoint
    Milestones → Milestone
    Risk → Risk Related
    All items are created under 1.4
    3 · Preview what will be built [7] Updates as you edit the canvas or the list
    16 items under 1.4 Demo Deliverable: 4 work items (1.4.1 to 1.4.4), 3 Approval Gate (1.4.5 to 1.4.7), 3 Input Required (1.4.8 to 1.4.10), 2 Checkpoint (1.4.11, 1.4.12), 2 Milestone (1.4.13, 1.4.14), 2 Risk Related (1.4.15, 1.4.16)
    15 relationships exactly as drawn; dates computed from the start date 22 Sep 2026 and the framework offsets
    Blueprint saved for 1.4; each item records framework CGI Still Renders v1.1
    Same input, same result. The same framework version, target and start date always build the same items, codes and links.
    [5] Running again for 1.4 first shows the difference: items to add, items unchanged, and items with progress, effort or comments, which are never overwritten. Then you add another set or cancel. 1.4 has no generated items yet.
    16 items · 15 relationships · framework CGI Still Renders v1.1 (built-in) [3]
    Back Build 16 items into the WBS
    List view of the same canvas [6] Shown after Canvas / List is switched to List; both views edit one model
    Lane | Code | Node | Label | Connected from
    Input required | 1.4.8 | Confirmed Modeling | Input Required | Start of flow
    Risk | 1.4.15 | Risk Mitigation #1 | Risk Related | Start of flow
    Deliverables | 1.4.1 | Camera Angle | None | 1.4.8, 1.4.15
    Approval | 1.4.5 | C.A. Approval | Approval Gate | 1.4.1
    Deliverables | 1.4.2 | Draft | None | 1.4.5
    Milestones | 1.4.13 | Milestone 1: Angles locked | Milestone | 1.4.5
    10 more nodes and 10 more relationships
    Keyboard: Tab moves through nodes lane by lane · arrow keys move the selected node · Enter edits · C connects to another node · Delete removes · ? lists every shortcut. The focused node shows the focus ring; the selected row uses the selection fill.

### Annotations

1. BLD-01, BLD-02 Build under an existing item or create a new deliverable with its parent category; framework cards show the flow and item and relationship counts, with a read-only preview.
2. BLD-03, BLD-04, BR-41 Lanes come from the framework. One start date drives every node date, and the canvas keeps the POC gestures: drag along the lane, click to edit, drag to connect, Delete to remove. Each gesture has a keyboard equivalent on the canvas, and the List view covers every edit without a pointer.
3. BLD-05, BLD-10, BLD-08 Building creates 16 items and 15 dependencies in the WBS, saves this canvas as the Blueprint of 1.4, and records the framework and version on each generated item.
4. BLD-06 Each lane maps to a WBS label and all items sit under the target deliverable, as recommended for the Builder rules decision. The POC instead created new top-level groups 7.x to 10.x.
5. BLD-07, BLD-12, BR-31 Re-running the Builder never overwrites work: a second run for 1.4 first shows the difference against the existing set, then offers to add another set or cancel; items with progress, effort or comments are never changed.
6. BLD-12, BR-41 The Canvas / List switch shows the same framework graph as an outline of lanes and nodes. Both views edit one model, so switching never loses work, and the list is the keyboard equivalent of the canvas: Tab moves through nodes, arrow keys move a node, Enter edits, C connects, Delete removes, ? lists every shortcut.
7. BLD-12, BLD-05 Before anything is written, the preview lists the items, labels, relationships and dates that will be created; its counts equal what the build creates. Building is deterministic: the same framework version, target and start date always give the same result.

## 30 Project plan: timeline

- File: screens/30-plan-timeline.html · image: png/30-plan-timeline.png
- Area: Project execution · Phase: MVP · POC screenshots: 22
- Requirements: PLN-01, PLN-02, PLN-03, PLN-04, WBS-13, BR-23, BR-40
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=plan
- Purpose: Point-based timeline of dated work items with days relative to today, OVERDUE tags, a today line and dependency conflicts flagged with the WBS rules; stage overlay and Gantt come in V2.

### Content

    Timeline Board Changes Reports [1]
    Filter: all work items
    − 100% +
    Horizontal Vertical
    Equal spacing
    [3]
    Gantt Planned V2
    Full screen
    Work items by target date [2]
    25 Jun to 30 Sep 2026 · 12 work items · 9 overdue · today 22 Sep
    29 Jun to 5 Jul · 85 to 79 days ago
    5.1 Render Farm Allocation Done
    2.1 CAD / Design Files Done
    2.2 Tone / Mood Reference Done
    24 to 25 Jul · 60 and 59 days ago
    1.1.1 Phase 1 Render Delivery OVERDUE
    3.1 Visual Quality Approval OVERDUE
    10 Aug · 43 days ago
    1.1 51 Render Images OVERDUE
    1.1.2 Phase 2 Render Delivery OVERDUE
    4.1 Timeline Risk OVERDUE
    28 Aug to 2 Sep · 25 and 20 days ago
    1.2 3D Film (2 to 3 min) ⚠ OVERDUE
    3.2 Client Approval Gate ⚠ OVERDUE
    6.1 Client Feedback Risk OVERDUE
    1.3 Final Delivery OVERDUE
    Initiation Planning Production · stage 3 of 6 Review Delivery
    Planned V2: stage overlay
    Today · 22 Sep
    25 Jun
    Jul
    Aug
    Sep
    ● point = target date of a work item ◆ = milestone red = not Done and past target ⚠ = dependency conflict Clusters group items whose dates overlap at this zoom
    ⚠ 1 dependency conflict. 1.2 then 3.2 (finish to start): 3.2 starts 20 Aug before 1.2 finishes 28 Aug. Flagged on both items; no date is moved. A link with a missing date shows "schedule data incomplete" instead, as for 2.2 then 3.1 (3.1 has no start date). [6] Open in WBS tree
    Gantt with bars and dependency lines Planned V2 [5]
    Evaluated in V2 together with the portfolio roadmap component; until then the WBS table carries start and target dates.

### Annotations

1. PLN-01 Project Plan groups Timeline, Board, Changes and Reports and keeps the project context when switching.
2. PLN-02 Each point is a dated work item. Cards show the date, days relative to today, code and name; OVERDUE means not Done and target before today, the same rule as Overview and Focus.
3. PLN-02 Filter, zoom (default 100%), horizontal or vertical orientation and equal spacing behave as in the POC.
4. PLN-03 Lifecycle stage and gate overlay on the timeline is planned for V2.
5. PLN-04 A bar Gantt with dependency lines is not in the MVP; it is evaluated in V2.
6. WBS-13, BR-23, BR-40 The timeline marks both items of a dependency conflict with the same rule as the WBS: a conflict is evaluated only when both compared dates exist, otherwise the link reads "schedule data incomplete". 3.2 starts 20 Aug before 1.2 finishes 28 Aug, so both carry the marker; no date moves until a person changes it.

## 31 Project plan: board

- File: screens/31-plan-board.html · image: png/31-plan-board.png
- Area: Project execution · Phase: MVP · POC screenshots: 23
- Requirements: PLN-05, WBS-01, WBS-16, BR-41
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=plan
- Purpose: Kanban of work items by status from the workspace Status list; dragging a card or choosing a column in its Move to… menu changes status and is logged; Done is a collapsed column of recent completions.

### Content

    Timeline Board Changes Reports
    Filter: all work items
    Only mine
    9 open · 3 done · category rows are not cards
    Not Started 5 [1]
    1.1.2 Milestone
    Phase 2 Render Delivery
    DK 10 Aug · 43d late High
    1.2
    3D Film (2 to 3 minutes)
    SW 28 Aug · 25d late Critical
    1.3 Milestone
    Final Delivery
    NR 2 Sep · 20d late Critical
    3.2 Approval Gate
    Client Approval Gate
    NR 28 Aug · 25d late Critical
    6.1 Risk Related
    Client Feedback Risk
    NR 28 Aug · 25d late Critical
    + Add task [3]
    In Progress 3
    1.1
    51 Render Images
    DK 10 Aug · 43d late High
    1.1.1 Milestone
    Phase 1 Render Delivery
    DK 24 Jul · 60d late High
    4.1 Risk Related
    Timeline Risk
    DK 10 Aug · 43d late High
    Move to… [5]
    Not Started
    In Progress current
    Waiting
    Blocked Enter
    Done
    Shift+M opens · ↑ ↓ choose · Enter moves · Esc closes
    + Add task
    Waiting 1
    3.1 Approval Gate
    Visual Quality Approval
    AL 25 Jul · 59d late High
    + Add task
    Blocked 0 [2]
    Drop items here
    Moving 4.1 here, by dragging or with Move to…, sets Status = Blocked and logs "Nadia R. changed Status from In Progress to Blocked" on the item.
    + Add task
    Done 3 [4]
    Collapsed. Shows items completed in the last 14 days.
    Expand

### Annotations

1. PLN-05 Columns come from the workspace Status list and show counts. Cards show code, label, name, PIC, target with days late (Section 12) and priority; category rows never become cards.
2. PLN-05, WBS-16 Dragging a card, or choosing a column in its Move to… menu, changes the item's Status and writes the change to its activity, so the board never holds its own copy of status.
3. WBS-01 "+ Add task" creates a WBS item with that column's status; it appears in the table and tree at once.
4. PLN-05 The POC board had no Done column. Here Done is a collapsed column limited to recent completions, so work can be finished by drag and drop without crowding the board.
5. BR-41, PLN-05 Every card has a Move to… menu, the keyboard and touch equivalent of dragging: Shift+M on the focused card (or the card menu on touch) lists the Status columns; the choice moves the card, is logged like a drag and is announced to screen readers. The focused card shows the keyboard focus ring; the highlighted option uses the selection fill.

## 32 Change requests and baseline

- File: screens/32-change-requests.html · image: png/32-change-requests.png
- Area: Project execution · Phase: MVP · POC screenshots: 24, 25
- Requirements: CHG-01, CHG-02, CHG-03, CHG-04, CHG-05, CHG-06, CHG-07, CHG-09, CHG-12, BR-05, BR-28, BR-29
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=plan
- Purpose: Change register for a baselined project: CR detail with impact analysis, actions that depend on the viewer's role, a decision that needs a different approver and a rationale, and an approved CR whose baseline changes are reviewed before the PM applies them as baseline v2.

### Content

    Timeline Board Changes Reports
    + New change request
    Project baselined: CRs are enforced.
    Baseline v1 captured 25 Jun 2026. Locked scope, dates, budget and critical dependencies change only through approved change requests.
    [1]
    All (2) Open (1) Approved (1) Rejected (0) Deferred (0) Closed (0)
    Open 1 Approved 1 · 1 pending application Rejected 0 Total logged 2
    Ref | Change | Type | Priority | Status | Requester | Logged | Impacts |
    CR-001 | Add a 4th hero render angle | Scope | Medium | Under review | Nadia R. | 2 Jul | 1 item | Open below
    CR-002 | Move render farm to overnight queue | Schedule | High | Approved, pending application | Denny K. | 30 Jun | 1 item | Review changes [5]
    CR-002 Move render farm to overnight queue Approved, pending application
    Approved, not yet applied. H. Le approved this change on 22 Sep 2026, 08:40: "overnight queue frees the farm". The baseline keeps the old value until the PM applies it. [8]
    Review baseline changes
    Field | Baseline v1 · 25 Jun 2026 | After applying (baseline v2) | Difference
    1.1.2 Phase 2 Render Delivery · target date | 10 Aug 2026 | 12 Aug 2026 | +2 days
    Project target completion | 2 Sep 2026 | 2 Sep 2026 | No change
    Scope (deliverables), budget, critical dependencies | As in baseline v1 | As in baseline v1 | No change
    CR-002 unlocked only the field it changes. Applying records baseline v2 with a reference to CR-002; baseline v1 stays viewable. Not now Apply to baseline
    Shown to Nadia R. as PM. H. Le, the approver, sees the decision record; Denny K., the requester, sees the status only.
    CR-001 Add a 4th hero render angle Under review
    Requester Nadia R.
    Type Scope
    Priority Medium
    What is changing? * [2] Client asked for one additional hero product angle beyond the agreed 51-render set.
    Why? (justification) * Northwind's marketing team wants a top-down angle for the campaign's social cut-downs.
    Affected WBS items 1.1 51 Render Images × + Add item
    Schedule impact (days) 3
    Budget impact Not entered
    Resource impact (FTE) Not entered
    Impact notes (cost, risk, quality) Adds about 3 days of render and review time.
    Proposed action Add a new sub-deliverable under 51 Render Images and re-baseline the Phase 2 dates.
    Effective date Not set
    Impact analysis [3]
    What matters here: the Phase 2 target date is baselined, so approving this re-baselines it. Everything else is a 3-day shift inside one deliverable.
    1 item directly affected · 0 downstream items could shift Open the full graph
    Locked field affected: 1.1 target date (baseline v1).
    Based on dependency links. Advisory only: nothing is rescheduled automatically.
    Review and decision [4]
    Approver HL H. Le
    Status Under review
    Nadia R. requested this change, so she cannot approve it. A different approver decides.
    Decision notes * H. Le adds the rationale here; a decision without it is blocked
    Actions by role [7] Each viewer sees only their row
    Role | Who | Actions on this CR
    Requester | Nadia R. (you) | Edit Withdraw request
    Approver | H. Le | Approve Reject Defer Request information
    PM | Nadia R. (you) | Apply to baseline appears only after approval, as on CR-002 above
    History [6]
    NR Nadia R. submitted this change request · 2 Jul 2026, 9:20 PM

### Annotations

1. CHG-01, CHG-06 The register says whether the project is baselined. Before commitment it stays advisory as in the POC; after baseline v1 locked fields change only through approved CRs.
2. CHG-02 POC fields plus budget impact, resource impact and effective date. What, Why, Type and at least one affected item or baseline field are mandatory.
3. CHG-03 The material impact is stated in one line first, with the counts and the full dependency graph behind it, because an impact view grows with the plan and a long list buries the one thing that needs the decision. Impact analysis counts directly affected items and downstream items that could shift through dependency links, and names the locked fields involved. It never reschedules.
4. CHG-04, CHG-09, BR-28 Approve, Reject, Defer and Request information, each with a required rationale. The requester cannot be the approver; the POC set Nadia R. as both requester and approver of CR-001.
5. CHG-07 An approved CR stays "pending application" until the PM applies it. The register offers Review changes, not a direct Apply: Apply becomes available only after the baseline difference has been shown. Approved CRs left unapplied past the workspace threshold raise an attention item.
6. CHG-05, CHG-12, BR-29 History cannot be edited. A submitted CR can be withdrawn with a reason but not deleted; the POC offered "Delete request" at any time.
7. CHG-04, CHG-07, CHG-09 Actions follow the viewer's role: the requester edits or withdraws, the approver decides, the PM applies approved changes. A person never sees buttons they may not use; the table shows all three rows only to explain the rule, and the signed-in user's row is highlighted.
8. CHG-07, BR-05 Before Apply, the PM sees each unlocked field with its baseline v1 value and the value it will have in baseline v2; unchanged locked fields are listed as unchanged. Applying creates baseline v2 referencing CR-002 and closes the pending application.

## 33 Journal and project reporting

- File: screens/33-journal-reports.html · image: png/33-journal-reports.png
- Area: Project execution · Phase: MVP · POC screenshots: 26, 27, 28
- Requirements: RPT-01, RPT-02, RPT-03, RPT-04, CHG-11, MCP-06, PLT-16, BR-39
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=plan
- Purpose: Reports area with three mutually exclusive tabs: the everyday journal, the report builder whose generated Weekly Status is a snapshot with as-of time and metric version and is published as the weekly status submission, and the saved snapshots.

### Content

    Timeline Board Changes Reports
    Reports has three tabs and shows one at a time; the three frames below are the three tab states [7]
    Tab state 1 Journal
    Journal (5) Build a report Saved (0)
    Journal [1]
    Everyday project log. Entries are timestamped, attributed and flow straight into reports.
    Note Meeting Decision Issue Highlight
    What happened today?
    Link WBS item
    + Log entry
    AI Note 22 Sep · via MCP · token Nadia's assistant · for Nadia R.
    Summary of a client email from Northwind.
    NR Highlight 21 Sep
    Phase 1 renders approved internally.
    NR Issue 20 Sep
    Render farm queue adds 2 days.
    NR Decision 19 Sep
    Hold Phase 2 renders until CR-001 is decided.
    Promote to Decision Log [2]
    NR Meeting 18 Sep · linked 1.1 51 Render Images
    Weekly client sync: Northwind wants a top-down angle.
    Tab state 2 Build a report, after Generate report
    Journal (5) Build a report Saved (0)
    Build a report [3]
    Template Weekly Status Executive Summary Full History Custom
    Period 15 Sep 2026
    to 22 Sep 2026
    Sections Health summary Completed this period Coming up (next 7 days) Overdue Milestones Journal entries Item notes Change requests Activity log
    Title Weekly Status: 15 Sep to 22 Sep 2026
    Generate report
    Weekly Status: 15 Sep to 22 Sep 2026 Copy Markdown PDF Save report [6]
    Meridian CGI Campaign · 15 Sep to 22 Sep 2026 · prepared by Nadia R.
    Data as of 22 Sep 2026 09:40 · snapshot S-0922-01 · metrics v1 [8]
    Health summary [4]
    Progress: 3 of 12 work items done (25%) · In progress: 3 · Overdue: 9
    Completed this period
    Nothing completed in this period.
    Coming up (next 7 days)
    Nothing due in the next 7 days.
    Overdue
    1.1.1 Phase 1 Render Delivery · 60 days
    3.1 Visual Quality Approval · 59 days
    1.1 51 Render Images, 1.1.2 Phase 2 Render Delivery, 4.1 Timeline Risk · 43 days
    1.2, 3.2, 6.1 · 25 days · 1.3 Final Delivery · 20 days
    Milestones
    1.1.1, 1.1.2 and 1.3 are overdue.
    Journal entries
    22 Sep Note (via MCP): summary of a client email
    21 Sep Highlight: Phase 1 renders approved internally
    20 Sep Issue: render farm queue adds 2 days
    19 Sep Decision: hold Phase 2 renders until CR-001 is decided
    18 Sep Meeting: Northwind wants a top-down angle
    Change requests
    CR-001 Add a 4th hero render angle · Under review · CR-002 Move render farm to overnight queue · Approved, pending application
    Publish as weekly status [5] Cadence: weekly (workspace setting)
    Declared health At risk
    Narrative What changed, what is at risk, what you need from leadership
    Computed health is Off track; the difference is flagged to the PMO. Publish weekly status
    Tab state 3 Saved, after Save report
    Journal (5) Build a report Saved (1)
    Report | Period | Snapshot | Data as of | Metrics | Saved by |
    Weekly Status: 15 Sep to 22 Sep 2026 | 15 to 22 Sep 2026 | S-0922-01 | 22 Sep 2026 09:40 | v1 | Nadia R. | Open PDF Copy Markdown
    A saved report never changes: reopening it shows the figures of its snapshot, even after the WBS has moved on. Generate a new report for current figures.

### Annotations

1. RPT-01, MCP-06 Journal types Note, Meeting, Decision, Issue and Highlight, optionally linked to a WBS item. An LLM client can append entries through MCP; they show the square AI avatar, the token and the person it acts for.
2. CHG-11 A Decision entry can be promoted to the Decision Log, which keeps rationale, evidence and approver and links back to the entry.
3. RPT-02 Templates Weekly Status, Executive Summary, Full History and Custom; each preselects its sections. The default title follows template and period.
4. RPT-03 The health summary uses the Section 12 definitions, so it matches the Overview (25%, 12 work items). In the POC the two screens disagreed (25% here, 22% on the Overview).
5. RPT-04 Publishing the generated report with declared health and narrative is the weekly status submission; a missing or late one appears in the executive attention queue.
6. RPT-03, PLT-16 Copy as Markdown, export to PDF and save to the Saved list, as in the POC. The PDF, the Markdown and the saved copy all carry the same snapshot.
7. RPT-01, RPT-02, RPT-03 Journal, Build a report and Saved are mutually exclusive tabs: selecting one hides the other two. The three frames here are separate states of one area, not one screen; the POC also showed them as separate tabs (POC 26, 27, 28).
8. RPT-03, PLT-16, BR-39 Generating a report takes a snapshot: the report states its data as-of time, snapshot ID and metric version, and its PDF and saved copy keep those figures when the data changes.

## 34 Focus: today and this week

- File: screens/34-focus.html · image: png/34-focus.png
- Area: Project execution · Phase: MVP · POC screenshots: 29
- Requirements: OVW-06, OVW-07, OVW-08
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=focus
- Purpose: Personal start-of-day view: overdue, due in the next 7 days and starting in the next 7 days, with Only mine, a scope switch from this project to all my projects, and status changes or Done straight from each row; counts follow Section 12.

### Content

    Today and this week
    Tuesday, 22 September 2026
    9 items are overdue, worth clearing first.
    9 overdue 0 due today 0 due in next 7 days 3 in progress [1]
    This project All my projects [4] Only mine · Nadia R. [2]
    Overdue Status ▾ changes it here · ✓ marks done [3] 9
    1.1.1 Phase 1 Render Delivery
    Denny K. In Progress 60 days ✓
    3.1 Visual Quality Approval
    Art Lead Waiting 59 days ✓
    1.1 51 Render Images
    Denny K. In Progress 43 days ✓
    1.1.2 Phase 2 Render Delivery
    Denny K. Not Started 43 days ✓
    4.1 Timeline Risk
    Denny K. In Progress 43 days ✓
    1.2 3D Film (2 to 3 minutes)
    Sasha W. Not Started 25 days ✓
    3.2 Client Approval Gate
    Nadia R. Not Started 25 days ✓
    Set status of 3.2: Not Started In Progress Waiting Blocked Done Arrow keys move, Enter sets, Esc closes; the change is logged in the item's activity
    6.1 Client Feedback Risk
    Nadia R. Not Started 25 days ✓
    1.3 Final Delivery
    Nadia R. Not Started 20 days ✓
    Due this week 0
    Nothing due in the next 7 days. [5]
    Starting this week 0
    Nothing starts in the next 7 days.
    All my projects, as the switch shows it Creative Studio · Only mine on · Nadia R. 3 overdue 1 due this week
    Meridian CGI Campaign 3.2 Client Approval Gate
    Not Started 25 days ✓
    Meridian CGI Campaign 6.1 Client Feedback Risk
    Not Started 25 days ✓
    Meridian CGI Campaign 1.3 Final Delivery
    Not Started 20 days ✓
    Northwind Showroom VR 2.3 VR Asset Export
    In Progress Due Thu 24 Sep ✓

### Annotations

1. OVW-06 Counts follow Section 12: overdue means not Done and target before today, days overdue is today minus target, and "this week" is the next 7 days, rolling.
2. OVW-06 Only mine filters to the signed-in user; for Nadia R. the overdue list drops to 3.2, 6.1 and 1.3.
3. OVW-07 Quick update without opening the item: the status chip opens a picker (shown open for 3.2, with the keyboard focus ring on Waiting) and ✓ marks the item Done. Each change is saved like an edit in the item form and logged in the item's activity; an item marked Done leaves the list.
4. OVW-08 The scope switch shows the same three lists across every project of the workspace that the user belongs to, with the project name on each row; the card at the bottom shows the result for Nadia R. with Only mine on. Counts in the header follow the chosen scope.
5. OVW-06 Each empty column says why it is empty, as the POC did, instead of showing a blank card.

## 35 MVP detail

- File: screens/35-mvp-detail.html · image: png/35-mvp-detail.png
- Area: Project execution · Phase: MVP · POC screenshots: none
- Requirements: MVP-01, MVP-02, MVP-03, MVP-04, BR-06, BR-39
- Context: data-workspace=Digital Products, data-project=MSME Payment, data-tab=overview
- Purpose: Outcome container for MVP 1 Omni Payment: customer problem, outcome KPIs, release criteria, linked features and milestones, dependencies, and MVP progress and health with their formulas and as-of time, compared with the project.

### Content

    MVP 1 · Omni Payment
    At risk
    Project MSME Payment is On track; this MVP is At risk [3]
    As of 22 Sep 2026 09:40 · metrics v1 [6]
    MVP 1 Omni Payment MVP 2 Edit MVP
    Release date
    30 Mar 2027
    189 days from today
    Budget
    $650K
    Owner: Product Owner
    Progress
    62%
    13 of 21 linked work items done
    Done linked work items ÷ linked work items
    Expected benefit [1]
    Not tracked
    No benefit record yet, so no value is shown; $0 would mean measured and zero. Benefits arrive in V2
    Customer problem and outcome
    MSME customers use multiple channels and manually reconcile transactions.
    Objective: raise payment adoption from 42% to 57% and cut reconciliation time from 3 h to 1 h.
    Outcome KPI [4] | Baseline | Target | Current | Status
    Payment adoption | 42% | 57% | 49% | At risk
    Reconciliation time | 3 h | 1 h | 1.5 h | At risk
    Features and milestones [2] + Link WBS item
    Feature (WBS item) | Status | Linked in WBS
    Multi-bank payment | In Progress | Yes
    Auto reconciliation | In Progress | Yes
    Virtual account | In Progress | Yes
    Design Done
    Build 62%
    Test Not started
    MVP health Worst of the four dimensions At risk
    Scope
    On track
    Schedule
    At risk
    Resource
    On track
    Dependency
    At risk
    Health takes the worst of scope, schedule, resource and dependency; a dimension without data shows Unknown and never counts as On track.
    Dependencies
    FS Core API
    From Core Platform (PRJ-005), computed Off track
    At risk
    FS Risk approval
    Control function review
    Pending
    Release criteria
    Outcome KPIs have baseline and target
    All linked features Done
    Dependencies resolved: Core API, Risk approval
    Test stage passed
    [5] MVP objects are enabled for the Digital Products workspace. Creative Studio has them switched off and works with deliverables only.

### Annotations

1. MVP-01, BR-39 Objective, customer problem, scope, release date, KPIs, owner and budget. Expected benefit shows "Not tracked" in an empty outline until benefits arrive in V2: a missing value is never displayed as $0, which would mean a measured zero.
2. MVP-02 Features are WBS items linked to the MVP and its milestones; a committed MVP cannot keep an unlinked feature.
3. MVP-03 Computed as in BRD Section 12.1. Progress = done work items linked to the MVP ÷ work items linked to it ("no linked work" when none). Health = the worst of scope, schedule, resource and dependency; a dimension without data shows Unknown. It is shown next to the project's status, so a healthy project with an at-risk MVP is visible.
4. BR-06 Every MVP needs at least one measurable outcome KPI with baseline and target, plus release criteria.
5. MVP-04 MVPs are a workspace option: on for product delivery, off for creative production, where deliverables are the unit of outcome.
6. BR-39 Progress and health state the time of the newest data they include and the metric version, the same as on dashboards, reports and MCP answers.

## 36 Workspace setup

- File: screens/36-workspace-setup.html · image: png/36-workspace-setup.png
- Area: Workspace & governance · Phase: MVP · POC screenshots: none
- Requirements: WSP-01, WSP-03, WSP-04, WSP-05, WSP-06, WSP-14, BR-14, PLT-20, BLD-13
- Context: data-nav=settings, data-workspace=Corporate PMO
- Purpose: Guided setup of a new workspace in Draft: six steps with progress, the profile form that drives durations and reporting periods, the four WSP-14 readiness rules checked before activation, the workspace lifecycle and the navigation tree.

### Content

    Set up Corporate PMO Draft
    Created by Q. Tran on 18 Sep 2026 · owner M. Johnson · members join when the workspace is active
    Glossary
    Activate workspace
    Setup steps [1]
    0 of 6 complete · 4 in progress · saved as you go
    1 Profile
    In progress · 8 of 11 fields
    2 Starter template
    Optional · not started
    3 Fields and options
    1 status without a system state
    4 Team and roles
    1 invitation pending
    5 Lifecycle framework
    Draft · not published
    6 Process frameworks
    Not started · opens the template library
    Optional for activation
    The readiness check tests the four rules below. Step 6 is not one of them: recommended before anyone uses the Deliverable Builder, and never a reason a workspace cannot activate. Built-in process frameworks are available meanwhile.
    Step 1 of 6 · Workspace profile [2] All changes saved · 10:12
    Workspace name * Corporate PMO
    Company or business unit * Acme Holdings · Group PMO
    Workspace owner * MJ M. Johnson
    Governance owner LT Linh T.
    Purpose Oversight of group-wide change initiatives and the quarterly portfolio review.
    Operating model Choose an operating model
    Timezone * Singapore (UTC+08:00)
    Currency * USD · US dollar
    Fiscal calendar * Calendar year (Jan to Dec)
    Business calendar * ? [3] Choose working days and holidays
    Business calendar The working days and public holidays of this workspace. Durations counted in working days and due dates skip non-working days.
    Open in glossary
    Reporting cadence * ? Choose a cadence
    Sets the weekly status periods and their due day.
    2 required fields left: business calendar and reporting cadence
    Save and continue
    Readiness check [4] 3 open
    ✓ Owner set
    M. Johnson
    ✕ Published default lifecycle framework
    Still a draft. Publishing needs review approval and the framework's own readiness check, where gate approvers are checked.
    Go to step 5
    ✕ Every Status value mapped to a system state
    1 status without a system state: Parked
    Go to step 3
    ✕ At least one portfolio
    No portfolios yet
    Add a portfolio
    Activate becomes available when all four checks pass.
    After activation: create the first project (CHR-17)
    Workspace lifecycle [5] Changes are made by tenant admins and audited
    Draft Now
    Being set up. Only owners and admins open it; it is not yet in members' workspace switcher.
    Active Members work here. It appears in the workspace switcher, which reopens the last project and tab.
    Suspended Temporarily read-only. Members can read and export; nobody can edit.
    Archived Read-only and auditable for good, including configuration and gate decisions.
    Navigation tree [6] + Portfolio + Program
    Workspace › Portfolio › Program › Project
    No portfolios yet. Create one here, or let the starter template in step 2 add a first structure.
    Rename Updates the name in the sidebar, registry and reports at once
    Move A project moved to another program keeps all its data and history
    Archive Leaves the tree; its records stay read-only and auditable
    Programs show their project count; a project node opens Docs & Links.

### Annotations

1. WSP-14 Guided setup follows the WSP-14 checklist in six steps that can be done in any order: profile, an optional starter template, fields and options, team and roles, lifecycle framework, process frameworks. The step list shows progress and partial steps such as a pending invitation. Step 6 opens the template library, where process frameworks are copied or drafted in their editor and published by the Workspace Owner (BLD-13, BLD-16); it is not part of the readiness check. Creating the first project is not a setup step; it follows activation.
2. WSP-01, WSP-03 A new workspace starts in Draft with its owner. The profile holds purpose, operating model, governance owner, timezone, currency, fiscal and business calendars and reporting cadence; it autosaves.
3. PLT-20 Every governance term has inline help with a link to the glossary. The business calendar drives working-day durations (WBS-15) and the cadence drives reporting periods (RPT-04).
4. WSP-14, BR-14 The checklist now says which steps the check tests and which it does not, so the process framework step reads as recommended rather than as a blocker nobody can clear. The readiness check shows exactly the four WSP-14 rules: owner set, a published default lifecycle framework (BR-14), every Status value mapped to a system state, and at least one portfolio. The server runs the same four rules when Activate is pressed; the screen only renders their result. Each failing rule links to the step that fixes it. Gate approvers are checked when the framework is published (GOV-21), not here.
5. WSP-05, WSP-04 The four workspace states and what each allows. Only Active workspaces appear in members' switcher, and switching returns to the last project and tab.
6. WSP-06 Portfolios and programs are created, renamed, moved and archived here or from the sidebar; moving a project keeps its data and history.

## 37 Create project

- File: screens/37-project-create.html · image: png/37-project-create.png
- Area: Project execution · Phase: MVP · POC screenshots: none
- Requirements: CHR-17, REG-01, GOV-12, CHR-14, CHR-15, BR-01, BR-13, BR-15, PLT-20
- Context: data-nav=registry, data-workspace=Digital Products
- Purpose: New project dialog over the registry: placement in workspace, portfolio and an optional program, master record fields, a lifecycle framework version pinned at creation, and the checklist the Draft project must complete before commitment.

### Content

    ID | Project | Program | Owner | Sponsor | Stage | Health | Framework
    PRJ-001 | MSME Payment | MSME Transformation | A. Wong | Linh T. | Development | On track | v2.1
    PRJ-002 | Merchant Onboarding | MSME Transformation | M. Johnson | A. Wong | Solution | At risk | v2.1
    PRJ-003 | Digital Sales | Customer | M. Johnson | Linh T. | Design | At risk | v2.1
    PRJ-004 | Mobile App | Customer | A. Wong | Linh T. | Development | At risk | v2.1
    PRJ-005 | Core Platform | Platform | L. Wang | Linh T. | Development | Off track | v1.9
    PRJ-006 | Data Platform | Platform | L. Wang | A. Wong | Development | At risk | v1.9
    PRJ-007 | AML Upgrade | Regulatory | A. Wong | Linh T. | Test | On track | v2.1
    PRJ-008 | CRM Refresh | Customer | M. Johnson | A. Wong | Discovery | On track | v2.1
    New project Digital Products Close
    Workspace [1] Digital Products
    Project ID Assigned when created
    Portfolio * Growth
    Program optional MSME Transformation
    Project name * [2] MSME Lending Pilot
    ✓ No other project in Digital Products has this name
    Client or business unit * Internal · MSME Banking
    Description Pilot of small-business loans through the merchant app for 200 merchants.
    Project manager * MJ M. Johnson
    Project owner * AW A. Wong
    Executive sponsor [4] Select sponsor
    Optional now, required before commitment
    Strategic objective MSME revenue +20%
    Record an exemption instead
    Lifecycle framework * ? [3]
    Company A Digital Delivery v2.1 Published
    Pinned at creation. The project keeps v2.1 and its 7 stages, Discovery to Retro. The v2.2 draft and later versions never change it. What is a lifecycle framework?
    Project template Planned V2 Start from a saved project with its WBS and charter
    After you create it [5]
    The project starts in Draft at stage 1, Discovery, of the pinned framework.
    Needed before commitment
    ✓ Project owner
    A. Wong, from this form
    ✕ Executive sponsor
    Missing · every committed project needs one
    ✓ Strategic objective or exemption
    MSME revenue +20%
    ○ Charter sections I to IV
    Identification, key contacts, description and objectives, scope
    ○ Business case, approved
    Problem, opportunity, benefits, assumptions
    ○ Approved budget
    Actuals and forecast follow later
    This list stays on the project overview until every item is done.
    Required: portfolio, name, client or business unit, project manager, owner, framework Cancel Create as Draft

### Annotations

1. CHR-17, BR-13 A project is always created inside a workspace, here the current one, and placed in a portfolio and, when used, a program of the navigation tree (programs are optional, BRD 7.1); the ID is assigned on creation.
2. REG-01 The master record checks required fields and duplicates before creation: the name is checked against the workspace while you type.
3. GOV-12, BR-15, PLT-20 Only published framework versions can be chosen; the project stores the exact version and keeps it when v2.2 is published. Inline help explains the term and links to the glossary.
4. CHR-14, BR-01 Owner is required now; the sponsor may follow, but the project cannot be committed without both.
5. CHR-17, CHR-15 The Draft project gets a setup checklist of what commitment needs: owner and sponsor, strategic objective or exemption (BR-02), charter I to IV, approved business case (CHR-12) and budget. Starting from a project template is planned for V2.

## 38 My approvals

- File: screens/38-my-approvals.html · image: png/38-my-approvals.png
- Area: Personal & collaboration · Phase: MVP · POC screenshots: none
- Requirements: OVW-09, CHG-04, GOV-08, GOV-13, CHR-08, MCP-08, PLT-09, BR-35, BR-42
- Context: data-nav=approvals, data-workspace=Creative Studio
- Purpose: One queue of everything waiting for the signed-in approver: CR decisions, gate votes, waivers and charter sign-offs, with requester, due date, blocker and a deep link; drafts prepared through MCP are marked as not decided.

### Content

    My approvals · H. Le
    Requests waiting for your decision or signature · 3 ready, 2 blocked · sorted by due date
    Waiting (5) Decided by me
    Type All types
    Project All projects
    Due Any time
    Sort Oldest waiting first
    Saved views My daily round: gates and major change requests
    Show blocked items
    J and K, or the arrow keys, move to the next and previous request without leaving the keyboard.
    Waiting for you [1] The sidebar count shows the 3 you can act on now
    Type | Item | Project | Requested by | Due | Blocker |
    Waiver
    W-02 · waive "Client brief sign-off" until 2 Oct
    Reason: Contoso signs the brief at the 29 Sep kickoff. When it expires the criterion blocks the gate again. [3]
    Spring Catalogue Renders
    NR Nadia R. 21 Sep
    24 Sep in 2 days
    None
    Review waiver
    Gate vote
    Planning gate · Creative Production v1.2
    Votes 1/3 · quorum 2/3 · Sasha W. voted Rework
    Spring Catalogue Renders
    NR Nadia R. 18 Sep
    25 Sep in 3 days
    Not eligible [2] 2 of 4 mandatory artifacts missing: Shot list, Client brief sign-off. Pass and Pass with conditions are unavailable; Rework, Hold and Reject stay open.
    Open gate review
    CR decision
    CR-001 · Add a 4th hero render angle
    Scope · 3 days schedule impact · affects 1.1 (baseline v1)
    AI Prepared via MCP, not decided. Draft "Approve" from your assistant (token Studio assistant) at 08:50. It counts only when you confirm it here. [4]
    Meridian CGI Campaign
    NR Nadia R. 2 Jul
    No due date Waiting 82 days
    None
    Decide
    Charter sign-off
    Charter Rev 2 · adds the 4th hero angle
    You sign as Project Owner, with J. Park and Nadia R.
    Meridian CGI Campaign
    NR Nadia R.
    After CR-001
    Waiting on CR-001 Rev 2 is issued for signature once CR-001 is decided.
    Open charter
    Deliverable approval
    1.3 Walkthrough Script · Approval Gate
    You are the item's Approver; the Reviewer signs off first
    Northwind Showroom VR
    SW Sasha W.
    After review
    Waiting on review Nadia R. reviews first
    Open item
    Why Pass is unavailable [5]
    A gate is eligible for Pass only when every mandatory artifact is complete or covered by an approved waiver that has not expired.
    Metis checks this on the server, so a Pass sent from the API or an AI client is rejected the same way.
    Approving W-02 leaves 1 artifact missing: the Planning gate stays not eligible until the shot list is attached.
    Decided by you, last 7 days
    Approved CR-002 · Move render farm to overnight queue
    22 Sep 08:40 · "overnight queue frees the farm"
    Every decision keeps its rationale, actor and time in the item history.
    Empty state [6]
    Nothing waits for you.
    New requests appear here and in your notifications. Requests from projects you cannot open never show.

### Annotations

1. OVW-09 One queue for CR decisions, gate votes, waivers, charter sign-offs and deliverable approvals (items labelled Approval Gate where the person is Approver) assigned to the signed-in person, with requester, due date, blocker and a link that opens the item where the decision is taken; filters by type, project and due date.
2. GOV-08, BR-42 An ineligible gate still shows in the queue with the reason; Pass and Pass with conditions are unavailable while Rework, Hold and Reject stay possible.
3. GOV-13 A waiver request shows the rule, reason and expiry; an expired waiver re-blocks the criterion and raises an attention item.
4. MCP-08, BR-35 An AI client can prepare a decision but never take it: the draft is marked "Prepared via MCP, not decided" with the square AI avatar and the token name until the approver confirms it in the app.
5. BR-42, CHG-04, CHR-08 Eligibility is enforced on the server. CR decisions need a rationale and the requester cannot approve their own CR (BR-28); a charter sign-off records signer, time and revision.
6. PLT-09 Every request also arrives as a notification that cannot be muted; the empty state says where new requests will appear.

## 39 Notifications and preferences

- File: screens/39-notifications-preferences.html · image: png/39-notifications-preferences.png
- Area: Personal & collaboration · Phase: MVP · POC screenshots: 31
- Requirements: PLT-09, PLT-10, PLT-18
- Context: data-workspace=Creative Studio
- Purpose: Notification drawer with unread markers and deep links for each trigger, and the personal preferences page: channels per trigger with approval requests locked on, digest and chat channels planned for V2, display name, default landing tab, default WBS view and language.

### Content

    Notifications and preferences
    Signed in as Nadia R. · the bell in the top bar opens the same list as a drawer
    All changes saved · 09:41
    Notifications [1] Mark all as read
    All Unread (3) Mentions Approvals
    @ Sasha W. mentioned you on 1.2 3D Film (2 to 3 minutes)
    "Can J. Park review the animatic on Thursday?"
    Meridian CGI Campaign · 09:20 · Open comment
    ✓ H. Le approved CR-002 Move render farm to overnight queue
    Ready to apply to the baseline · Meridian CGI Campaign · 08:40 · Open CR-002
    ◇ Sasha W. voted Rework on the Planning gate
    Votes 1/3 · quorum 2/3 · Spring Catalogue Renders · 08:15 · Open gate review
    → H. Le made you Reviewer of 1.3 Walkthrough Script
    Northwind Showroom VR · yesterday 17:30 · Open item
    ! 3 items you own are overdue
    3.2 Client Approval Gate, 6.1 Client Feedback Risk, 1.3 Final Delivery · Meridian CGI Campaign · Mon 08:00 · Open My focus
    ▤ Weekly status missing for Spring Catalogue Renders
    Not published by the Friday deadline; it now shows on the executive attention list · Fri 18 Sep · Write status
    What notifies me, and where [2]
    Trigger | In-app | Email |
    @mentions | | |
    Assigned as PIC, Reviewer or Approver | | |
    A CR decision or gate vote is requested from you | | | 🔒 Always on
    A waiver or charter sign-off is requested from you | | | 🔒 Always on
    Decisions and votes on your requests | | |
    Items you own due soon or overdue | | |
    Weekly status missing on your projects | | |
    Each event notifies you once, even when it matches more than one trigger. Approval requests cannot be muted so no decision gets stuck.
    Daily digest [3] Planned V2
    Morning email of my Focus items Overdue, due today and due this week, sent at 08:00 in my timezone.
    Chat channel Planned V2
    Slack or Microsoft Teams
    Send the same notifications to a chat app.
    Personal preferences [4]
    Display name Nadia R.
    Shown in activity, for example "Nadia R. changed Status"
    Language English
    Default landing tab Overview
    Opens first when you open or switch projects
    Default WBS view Table Tree

### Annotations

1. PLT-09 The drawer lists @mentions, assignments, decisions and gate votes, overdue items and missing weekly status, newest first; unread rows carry a dot and a bold title, the bell shows the unread count, and every row links to the item.
2. PLT-09 Channels per trigger for in-app and email. Requests for a decision, vote, waiver or sign-off are locked on in both channels; every other trigger can be switched off.
3. PLT-10 The morning digest and Slack or Microsoft Teams delivery are P1 and planned for V2.
4. PLT-18 Display name, default landing tab and default WBS view apply when a project is opened or switched, as in the POC Settings, General; preferences autosave.

## 40 Search results

- File: screens/40-search-results.html · image: png/40-search-results.png
- Area: Personal & collaboration · Phase: MVP · POC screenshots: 02, 30
- Requirements: PLT-12, PLT-13, PLT-04
- Context: data-workspace=Creative Studio
- Purpose: Search by project name and WBS code or name, grouped into projects and WBS items with status, keyboard navigation, results limited to records the user can open, full-text search planned for V2 and an empty state that explains what is searched.

### Content

    ⌕ render 5 results in Creative Studio
    / search ↑ ↓ move Enter open Esc close [2]
    [3]
    Results include only records you can open. Projects you are not a member of and other workspaces are never searched, and the counts do not include them.
    Projects · 1 [1] matched on name
    ≡ Spring Catalogue Render s
    Client Delivery › Contoso Retail · PM Nadia R. · stage Planning
    Enter to open
    WBS items · 4 matched on code or name
    1.1 51 Render Images
    Meridian CGI Campaign · Deliverable · Denny K.
    In Progress Overdue 43 days
    1.1.1 Phase 1 Render Delivery
    Meridian CGI Campaign · Task · Denny K.
    In Progress Overdue 60 days
    1.1.2 Phase 2 Render Delivery
    Meridian CGI Campaign · Task · Denny K.
    Not Started Overdue 43 days
    5.1 Render Farm Allocation
    Meridian CGI Campaign · under 5.0 Resource
    Done
    Search inside text [4] Planned V2
    Full-text search across item descriptions, comments, journal entries and change requests, with the same access rules.
    Until then, "render" in a description, a comment or a change request title is not found here.
    Empty state [5] query "kiosk"
    No projects or WBS items in Creative Studio match "kiosk".
    Search looks at project names and WBS codes and names. Check the spelling or try a code such as 1.1.2.

### Annotations

1. PLT-12 Results are grouped as Projects and WBS items with code, name, project, type, PIC and status; overdue follows Section 12 (not Done and target before today). Selecting a result opens the project or the item.
2. PLT-12 Fully usable from the keyboard: / focuses search, arrow keys move through results, Enter opens and Esc closes. Focus stays in the search field (focus ring) while the active result uses the selection fill.
3. PLT-04 The server filters results by permission before counting them, so a hidden project never shows up as a result, a count or an empty group.
4. PLT-13 Full-text search across descriptions, comments, journal entries and change requests is P1 and planned for V2.
5. PLT-12 The empty state says what is searched and suggests a next step; it never hints that a match exists somewhere the user cannot see.

## 41 Project Docs & Links

- File: screens/41-docs-links.html · image: png/41-docs-links.png
- Area: Project execution · Phase: MVP · POC screenshots: 30
- Requirements: PLT-08, PLT-07, PLT-11
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=overview
- Purpose: Links, notes and files of one project, opened from the project node in the navigation tree: upload states (scanning, uploaded, blocked type, too large) against the workspace limits, access-controlled downloads and an audited removal.

### Content

    Docs & Links [1]
    7 entries · links, notes and files for everyone on Meridian CGI Campaign · also under the project in the sidebar tree
    + Add link + Add note Upload files
    Entries All 7 Files 4 Links 2 Notes 1
    Filter by name
    Name | Kind | Owner | Added | Size | Actions
    Client brief: Northwind spring campaign
    northwind.example/briefs/spring-2026
    | Link | NR Nadia R. | 2 Jul 2026 | Link | Open ⋯
    Meridian charter Rev 1, signed.pdf
    Download link valid 15 minutes [2]
    | File | NR Nadia R. | 26 Jun 2026 | 1.2 MB | Download ⋯
    Lighting direction notes
    Warm key light for living room set, no blue cast
    | Note | AL Art Lead | 14 Jul 2026 | Note | Open ⋯
    CAD package v3.zip
    Input for 2.1 CAD / Design Files
    | File | JP J. Park (client) | 3 Jul 2026 | 186 MB | Download ⋯
    Final render delivery folder
    Shared drive link Planned V2
    | Link | DK Denny K. | 18 Aug 2026 | Link | Open ⋯
    Phase 1 contact sheet.pdf
    25 renders, review copy
    | File | DK Denny K. | 24 Jul 2026 | 24.6 MB | Download ⋯
    Render farm schedule.xlsx
    Superseded by CR-002
    | File | SW Sasha W. | 30 Jun 2026 | 0.4 MB | Remove? [4]
    Remove "Render farm schedule.xlsx" for everyone on this project?
    The file leaves Docs & Links at once. The removal is recorded in the audit log with your name, the time and the file name.
    Cancel Remove
    Recent changes from the audit log, read-only Open audit log
    NR Nadia R. removed "Old scope draft.docx"
    21 Sep 2026, 16:05 · file kept in storage for the retention period, then deleted
    DK Denny K. renamed "contact sheet v1" to "Phase 1 contact sheet.pdf"
    25 Jul 2026, 10:12
    JP J. Park uploaded "CAD package v3.zip"
    3 Jul 2026, 08:47 · malware scan passed
    Upload [3] 4 files
    Drop files here or browse Up to 250 MB per file · PDF, Office, images, ZIP, MP4
    Phase 2 render previews.zip
    182 MB · uploaded, checking for malware
    Scanning
    Lighting moodboard.pdf
    6.4 MB · scan passed · added to Entries
    Uploaded
    render setup.exe
    Program files (EXE) are not allowed in Creative Studio. Nothing was stored.
    Blocked type
    3D film master v2.mp4
    3.8 GB is over the 250 MB limit. Share it as a link to your drive instead.
    Add as link
    Too large
    Upload rules set by the Workspace Owner
    Workspace Creative Studio
    Largest file 250 MB
    Allowed types PDF, Office documents, images (JPG, PNG, TIFF), ZIP, MP4
    Always blocked Programs and scripts (EXE, BAT, CMD, JS)
    Malware scan Every upload, before anyone can open it
    Download links Personal, valid 15 minutes
    Tenant storage 62 of 200 GB used (plan)
    Who can open these files [5]
    Everyone with access to Meridian CGI Campaign, including J. Park as invited client. A copied download link does not work for anyone else, and it expires.

### Annotations

1. PLT-08 Docs & Links is opened from the project node in the navigation tree, as in the POC sidebar. Links, notes and files can be added, opened, renamed and removed by project members.
2. PLT-07 Files live in managed storage, not in the browser as in the POC. Each download uses a personal link that expires; the server checks project access on every request.
3. PLT-07 Every upload shows its state in words and a chip: scanning, uploaded, blocked type, too large. Each failure says what happened and what to do next; the limits are a workspace setting shown on the same page.
4. PLT-08, PLT-11 Removal asks for confirmation in place and names the file. The audit entry records actor, time and file name and cannot be edited or deleted.
5. PLT-07 A user without access to the project cannot download its files even with a copied link. Large media is shared as a plain link in the MVP; the cloud storage integration is planned for V2.

## 42 Editor states: save failed and edit conflict

- File: screens/42-editor-states.html · image: png/42-editor-states.png
- Area: Project execution · Phase: MVP · POC screenshots: none
- Requirements: PLT-05, PLT-06, MCP-07, MCP-14, MCP-19, WBS-11, BR-34, BR-04
- Context: data-workspace=Creative Studio, data-project=Meridian CGI Campaign, data-tab=wbs
- Purpose: WBS item 1.1.2 editor after a failed save and a retry that found newer versions: the save state, the conflicting field marked in place, a compare table (yours, theirs, current) with Reload, Keep mine and Merge, a change made through MCP with Undo, and the one version and idempotency rule shared by the application, MCP and the API.

### Content

    WBS | Description | Type | Phase | PIC | Start | Target | Status
    1.0 Deliverables | All client-facing outputs | Category | | | 6 Jul | 28 Aug | Rolled up
    1.1 51 Render Images | Full still-frame render set | Deliverable | Production | Denny K. | 6 Jul | 10 Aug | In Progress
    1.1.1 Phase 1 Render Delivery | First 25 renders | Task | Production | Denny K. | 6 Jul | 24 Jul | In Progress
    1.1.2 Phase 2 Render Delivery | Remaining 26 renders | Task | Production | Denny K. | 25 Jul | 10 Aug | In Progress
    Edit WBS item · 1.1.2 Phase 2 Render Delivery [7]
    DK Denny K. is also on this item
    Couldn't save · 09:41 [1]
    Close
    1 Save failed → 2 Retry found newer versions
    Your changes were not saved at 09:41
    The connection dropped while saving. Your edits are still in this form, nothing was lost. Closing the form now asks before discarding them.
    Keep my changes: they stay here and are sent again when the connection is back.
    Retry Keep my changes
    Start date 25 Jul 2026
    Target date 10 Aug 2026
    Baseline v1 · change through a CR
    Status In Progress
    Updated via MCP at 09:40
    Description Remaining 26 renders; client preview first.
    Planned effort [2] 24h
    Denny K. saved 32h at 09:38 · compare below
    Activity updates live, no reload
    AI Status: Not Started → In Progress
    via MCP · token "Denny's assistant" · acting for Denny K.
    22 Sep 2026, 09:40 · version 14 · reversible write
    Undo stays available while Status is still In Progress
    Undo [6]
    DK Denny K. set Planned effort to 32h
    22 Sep 2026, 09:38 · version 13
    NR You opened this item
    22 Sep 2026, 09:31 · version 12
    ◇ Baseline v1 captured
    Target 10 Aug 2026 locked · 25 Jun 2026
    This item changed while you were editing [3] 1 conflict You started from version 12 · now version 14
    Field | Yours (not saved) | Theirs | Current (v14) | Outcome
    Planned effort | 24h | DK 32h Denny K. · 09:38 · version 13
    | 32h | Conflict Keep mine Take theirs
    Status | Not changed by you | AI In Progress [4] via MCP · token "Denny's assistant" for Denny K. · 09:40 · version 14
    | In Progress | Kept, no conflict
    Description | Remaining 26 renders; client preview first. | Not changed | Remaining 26 renders delivered. | Yours applies
    Merge saves your edits and your choice for each conflict as version 15. Nothing is overwritten without a choice. The compare table is reachable with the keyboard alone, each row announces the field and whose value is selected, and the choice can be made without a pointer.
    Reload Keep mine Merge
    One write rule for every channel [5]
    The application, MCP tools and the API send the version they started from and an idempotency key with every save. A save based on an old version is rejected and shows the newer values, as above. A retried save with the same key is applied once, so Retry can never create a duplicate change.
    Leaving with unsaved changes asks first Discard my changes Merge and save

### Annotations

1. PLT-05 The save state sits in the same place on every editor (project header and form header): saving, saved with time, or failed with the reason and Retry. Failed edits stay in the form and leaving warns first.
2. WBS-11, PLT-06 The conflicting field is marked where it is, with who changed it and when. Fields of the item form behave as on the WBS item screen; the target date stays read-only, locked by baseline v1, and changes only through a change request (BR-04).
3. PLT-06 Compare per field: yours, theirs, current saved value and the outcome. Edits that do not collide merge on their own; a collision needs a choice. Reload drops your edits, Keep mine replaces theirs, Merge combines. Nothing is overwritten silently.
4. MCP-07, BR-34 A change made through MCP is a normal save with its own version. It shows the square AI avatar, the token name and the person the token acts for, and stays within that person's permissions and the token's scopes. MCP update tools arrive at Release 1 milestone 1B.
5. MCP-14, PLT-06 One write contract for the application, MCP and the API: record version plus idempotency key. A stale write is rejected with the newer values; a repeated key changes nothing the second time.
6. MCP-19, BR-04 A status change through MCP is a reversible write, so its activity entry offers Undo to people with edit rights on the item, here Nadia R. as PM. Undo stays available while the field still holds the value the MCP call wrote; after a later change to that field, Undo is replaced by a normal edit. An undo is itself a new versioned write, shown in the activity as "Undone by Nadia R." while the original MCP entry stays. MCP writes never touch baseline-locked fields such as the target date, so an undo never changes the baseline.
7. WBS-11 Dialog accessibility (style guide 7a): focus starts on the first field, Tab stays inside the dialog, Esc closes it, and focus returns to the WBS row it was opened from.

## 43 Access and session states

- File: screens/43-access-states.html · image: png/43-access-states.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: PLT-04, TEN-02, WSP-02, WSP-05, TEN-06, PLT-01, BR-38, PLT-03, TEN-03
- Context: data-workspace=Digital Products
- Purpose: Seven states people meet when access is missing, limited or interrupted, each with its reason and next step: no permission for a project, an archived workspace that is read-only, an expired session that keeps unsaved input, a suspended tenant that can still read and export, a forgotten password, a failed single sign-on and an expired invitation.

### Content

    Access and session states
    What people see when access is missing, limited or expired. Each state says why and what to do next, and shows no data the person may not see.
    1 · No permission for a project [1] 403
    Digital Products / Growth / MSME Transformation / Merchant Onboarding
    🔒
    You don't have access to Merchant Onboarding
    You need a role on this project: Team member to work on it, or Viewer to read it. No project data is shown until access is granted.
    MJ Project manager: M. Johnson
    Request access Back to My focus
    After you ask: "Request sent to M. Johnson. You get an email when it is decided."
    Same link, other cases [2]
    Workspace you are not in "You are not a member of this workspace. Ask its owner to invite you." The project name and path are not shown.
    Another organization "Page not found. Check the link or ask the person who sent it." Same answer as a link that never existed.
    2 · Archived workspace, read-only [3] Archived
    Retail Pilot 2025 / Projects
    🔒
    Read-only: this workspace is archived
    Retail Pilot 2025 was archived on 30 Jun 2026 by a tenant admin. You can open, search and export everything, including configuration and gate decisions. Nothing can be edited.
    Export workspace data Ask a tenant admin to restore
    Project | Status | Last change |
    Store Refit Pilot | Closed | 28 Jun 2026 | Open
    Loyalty Kiosk Trial | Closed | 15 Jun 2026 | Open
    No New, Edit, Upload or Raise change request controls appear in an archived workspace.
    3 · Session expired [4] Signed out
    Your session expired
    Acme Holdings signs you out after 12 hours, a setting of your tenant admin. Sign in again to carry on where you were.
    Your unsaved draft comment is kept in this window and comes back after you sign in.
    Signing in as someone else discards it.
    Sign out Sign in again with SSO
    4 · Tenant suspended, at sign-in [5] Suspended
    Orchid Retail
    This organization's account is suspended
    You can sign in, open and export your data. Editing, invitations and uploads are paused until the account is reactivated.
    Still available Read, search, export
    Paused Edit, invite, upload, MCP writes
    Who can fix it Your tenant admin, with the provider
    Continue read-only
    Tenant admins export everything from Tenant admin › Data export
    5 · Forgot password [6] Sign-in help
    Reset your password
    Enter the email you sign in with. We send a reset link that works once.
    Email j.park@northwind.example
    Send reset link
    If an account exists for this address, a reset link is on its way. Check your inbox.
    Lost your second sign-in factor? Your tenant admin resets it for you.
    Your organization signs in with SSO? Change your password with its sign-in service.
    6 · Single sign-on failed [7] SSO error
    Acme Holdings
    Your organization's sign-in service did not respond
    We could not finish signing you in. Your Metis account is not affected.
    Try again Contact your tenant admin
    Reference for support: SSO-7F3K2
    Other answers from the sign-in service
    Refused "Your organization's sign-in service did not accept this sign-in. Your account there may be disabled."
    7 · Invitation expired [8] Expired
    This invitation has expired
    Q. Tran invited you to the Creative Studio workspace of Acme Holdings on 2 Sep 2026. Invitation links are valid for a limited time, and this one has run out.
    Request a new invitation
    After you ask: "Request sent to Q. Tran. You get a new invitation by email when it is approved."
    Already joined from another invitation? Sign in instead.

### Annotations

1. PLT-04 Missing access is explained, never an empty page: the resource, the role it needs and who decides. Request access notifies the project manager. The server rejects the same request from the application, the API or MCP, even if the screen is bypassed.
2. WSP-02, TEN-02 A link into a workspace the person is not in does not reveal the project name. A link to another organization's record gets the same answer as a link that never existed, so nothing proves it exists.
3. WSP-05 An archived workspace stays readable, searchable, exportable and auditable. The banner says who archived it and when; editing controls are absent rather than greyed out.
4. PLT-01, PLT-04 Sessions last until expiry or sign-out; the lifetime is a tenant setting. Expiry asks the person to sign in again and keeps unsaved input in the window.
5. TEN-06, BR-38 A suspended tenant is read-only: people can still sign in, read and export. The notice lists what is paused and who can lift it.
6. PLT-01, TEN-03 Password reset applies to email and password accounts. The answer is the same whether or not the address has an account, so the page never reveals who is registered. The link works once. A lost second factor is reset by a tenant admin; people whose tenant uses SSO are sent to their organization's sign-in service.
7. PLT-01, TEN-03 When the tenant's identity provider refuses the sign-in or does not answer, the message names the category in plain words and offers Try again and Contact your tenant admin. A reference code lets support find the event in the logs; no technical detail of the identity provider is shown.
8. PLT-03 An expired invitation names who invited the person and to which workspace. Request a new invitation notifies the inviter, who sends a fresh one; nothing is joined until the new invitation is accepted.

## 44 Workspace settings: export, import and delete

- File: screens/44-data-export-delete.html · image: png/44-data-export-delete.png
- Area: Workspace & governance · Phase: MVP · POC screenshots: 36
- Requirements: PLT-14, PLT-15, TEN-07, BR-27
- Context: data-nav=settings, data-workspace=Creative Studio
- Purpose: Workspace Data settings: export a project or the whole workspace with job status, import a project file as a new project after a validation report, delete a project with typed confirmation, and restore it from Recently deleted before the retention period ends.

### Content

    Data
    Export, import and delete for the 3 projects of Creative Studio. Every action here is recorded in the audit log.
    General Fields & options Team & roles Frameworks Data
    Owner view, signed in as H. Le. Delete, Clear workspace and Recently deleted appear only for Workspace Owners. Project members see Export for their projects; people who can create projects also see Import.
    Export [1] JSON data plus files, as one ZIP
    A project Meridian CGI Campaign
    Export project
    The whole workspace 3 projects, configuration, frameworks and files
    Export workspace
    Job | Status | Size |
    Workspace · Creative Studio
    H. Le · 22 Sep 09:12
    | Ready | 3.1 GB | Download link until 29 Sep
    Project · Meridian CGI Campaign
    Nadia R. · 22 Sep 09:35
    | Running · 64%
    | Pending |
    Project · Spring Catalogue Renders
    Nadia R. · 21 Sep 17:02
    | Failed File store timed out
    | None | Retry
    An export holds work items, dependencies, charter and revisions, change requests, journal, activity and files. Leaving the platform? Tenant admins export the whole organization from Tenant admin › Data export.
    Import a project file [2] always creates a new project
    northwind-showroom-vr-export.zip 412 MB · uploaded and scanned 0 errors 2 warnings
    Contents found: 64 work items, 58 dependencies, charter Rev 2, 2 change requests, 31 journal entries, 18 files.
    Warning A. Wong is not a member of Creative Studio
    3 items import without a PIC. Invite A. Wong or assign them after import.
    Warning Phase "Post-production" is not a stage of Creative Production v1.2
    5 items import with an empty Phase; pick a stage for them later.
    New project name Northwind Showroom VR (imported 22 Sep)
    Program Northwind Furniture Co.
    The existing Northwind Showroom VR project is not touched. Cancel Import as new project
    Delete a project [3] Workspace Owner only
    Project Spring Catalogue Renders
    The project disappears for everyone at once and moves to Recently deleted for 30 days, where it can be restored with its items, files and history. After that it is purged.
    Type the project name to confirm Spring Catalogue Renders
    ✓ Name matches
    Cancel Delete project
    Clear workspace
    Deletes all 3 projects together; needs "clear Creative Studio" typed; restorable for 30 days
    Clear workspace…
    Recently deleted [4] restore before the date shown
    Project | Restore until |
    Contoso Lookbook Test
    Deleted by H. Le · 15 Sep
    | 15 Oct 2026 | Restore
    Northwind Teaser Draft
    Deleted by H. Le · 2 Sep
    | 2 Oct 2026 10 days left
    | Restore
    Purging leaves only a deletion record in the audit log. The retention period is a tenant setting.
    Leaving or moving the organization [5]
    A tenant admin exports all workspaces, files and history in one package from Tenant admin › Data export. The same package restores into a new tenant.
    Open tenant data export

### Annotations

1. PLT-14 Export a project or the whole workspace as JSON data plus files. Exports run as jobs with a visible status, a failed job can be retried, and the download link expires. Export then import reproduces items, dependencies, charter, change requests and journal.
2. PLT-14, BR-27 Import never overwrites: it always creates a new project. A validation report comes first; errors block the import, warnings say what will happen to the affected items.
3. PLT-15 Only Workspace Owners can delete a project or clear the workspace. Both need the name typed and both go to Recently deleted, so a mistake can be undone. The POC cleared the whole workspace with one click.
4. PLT-15 Restore brings back the project with items, files and history until the retention period ends. The 30 days shown are sample values until the retention periods are decided.
5. TEN-07 Offboarding is a tenant admin task: the full export of the organization restores into a new tenant with the same projects, files and history.

## 45 Client view of an invited project

- File: screens/45-client-view.html · image: png/45-client-view.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: PLT-02, PLT-04, PLT-07, CHR-06, CHR-08, WBS-12, WBS-16, WBS-17, RPT-05
- Context: none
- Purpose: What an invited client representative sees after signing in: only the invited project, the inputs they owe, the approvals waiting for them, charter sign-off, comments on their items, reports shared with them (planned), and a plain list of what stays internal.

### Content

    Meridian CGI Campaign [1]
    Northwind Furniture Co. · invited to Meridian CGI Campaign
    JP
    J. Park
    Client · j.park@northwind.example
    Sign out
    Hello, J. Park
    Your project with Acme Holdings, run by project manager Nadia R. You see this project only.
    Nothing due from you 1 approval not ready yet
    What we need from you [2] All delivered
    2.1 Input Required CAD / Design Files
    Product CAD geometry from the client · target 3 Jul 2026 · you are the person in charge
    ZIP
    CAD package v3.zip · 186 MB
    Uploaded by you, 3 Jul 2026, 08:47 · malware scan passed
    Download
    Done
    Add a revised file: drop it here or browse Up to 250 MB per file · PDF, Office documents, images, ZIP, MP4 · scanned before anyone can open it
    Nothing else is due from you. New requests from the project team appear here with a target date, and you get an email.
    Waiting for your approval [3] Not ready for review
    3.2 Approval Gate Client Approval Gate
    Client approval of final set · requested by Nadia R. · you are the approver · planned 20 Aug to 28 Aug 2026
    Opens when the final set is ready: 1.1 51 Render Images and 1.2 3D Film (2 to 3 minutes) are not delivered yet.
    Approve Request changes Available once the final set is ready for your review
    Comment for the project team Add a comment, for example what you expect in the final set
    Post comment The project team sees it on item 3.2
    Comments on your items [4] 3.2 Client Approval Gate
    JP J. Park (you)
    Please include the top-down angle we discussed today.
    18 Sep 2026
    NR Nadia R. · Project Manager
    Noted. We are confirming the impact of a 4th angle and hold the Phase 2 renders until it is decided. The final set comes to you for approval after that.
    19 Sep 2026
    Reply to Nadia R.; @mention someone on the project team
    Charter sign-off [5]
    Rev 1 Signed by you
    25 Jun 2026 · in-app sign-off, with H. Le (Project Owner) and Nadia R. (Project Manager) · frozen
    PDF Meridian charter Rev 1, signed.pdf · 1.2 MB
    Open
    Rev 2 Not issued yet
    Adds a 4th hero render angle. It waits for the decision on the angle you asked for on 18 Sep; once Nadia R. issues it, you sign it here.
    Sign Rev 2 Available when Rev 2 is issued
    Reports shared with you [6] Planned V2
    Weekly Status: 15 Sep to 22 Sep 2026 · client copy
    Health summary, Coming up and Milestones · data as of 22 Sep 2026 09:40 · metrics v1 · read-only
    Open PDF
    Until report sharing is available, Nadia R. sends reports to you as PDF.
    What you never see here [7]
    Other projects and workspaces of Acme Holdings
    Budget, contract value and invoices
    Internal risks and the risk register
    Team workload and internal assignments
    Change requests and the internal journal
    Workspace settings, members and the audit log
    Your access: role Client · Meridian CGI Campaign only · managed by the project team.

### Annotations

1. PLT-02 This view exists only if decision D-02 approves client access, at Release 1 milestone 1B. An external user signs in with a magic link or a local account (01-sign-in) and lands here: one invited project, no sidebar, no workspace switcher, no search across the tenant. The dashed round avatar marks an external person everywhere in the product.
2. CHR-06, WBS-12, WBS-17, PLT-07 The client's commitments are the WBS items labelled Input Required where the client is the person in charge, the same list as charter section VI. The client can attach files to these items only; uploads follow the workspace rules (250 MB per file, allowed types, malware scan before anyone can open them) and downloads use time-limited links.
3. WBS-12 Approval items are WBS items labelled Approval Gate where the client is named approver. Approve and Request changes stay disabled with the reason until the work is ready for review; a disabled button means "not allowed yet". Both decisions need a comment and are recorded in the item's activity with the signer and time.
4. WBS-16 The client reads and writes comments only on items they are involved in, posted as the signed-in user; @mentions reach people on the project team, who are notified as usual.
5. CHR-08 Sign-off is recorded per authenticated signer, date and revision. A signed revision is frozen; a new revision is signed here once the project manager issues it.
6. RPT-05 Sharing saved reports with external users is a later-phase feature (decision D-02). A shared report would be a read-only client copy made from selected sections, with its as-of time and metric version; it never includes the internal journal, item notes or change requests.
7. PLT-04, PLT-02 What stays internal is enforced by the server, not only hidden in this view: a request for anything outside the invited project is rejected, and the project team can revoke the client's access at once.

## 46 Onboarding: frame

- File: screens/46-onboarding-frame.html · image: png/46-onboarding-frame.png
- Area: Onboarding · Phase: MVP · POC screenshots: none
- Requirements: ONB-01, ONB-02, ONB-03, ONB-04, ONB-09, ONB-22, ONB-27
- Context: none
- Purpose: First onboarding screen for a new client's executive: four pre-filled facts collapsed to chips, three outside-in questions with only the governance one expanded, a one-sentence override, the drop zone as the primary action, and the AI processing authorization that opens when the first file is ready to send.

### Content

    Frame Drop Draft Launch
    Step 1 of 4 · Saved · resume any time
    Welcome, Rosa. Let's set up Nova Energy.
    Metis already knows a few things from your conversations with our team. Confirm them, change anything, then drop what you have.
    Resume later
    We already filled in 4 details from your discovery call [1] Review 4 details
    Scope: all of Nova Energy
    Work: engineering, construction and capital projects
    Currency: EUR
    Fiscal year: January to December
    From the Metis team, D. Lindqvist, 1 Oct 2026. Starting pack: Capital projects (Identify to Close).
    Currency and fiscal year cannot change once budgets are imported. Confirm them before you drop files.
    Three questions about how you lead [2]
    When you review the portfolio, what grouping helps you make decisions fastest?
    By business unit or subsidiary
    Pre-selected from your conversations · 6 other answers
    Change
    Your home: Generation · Grid · Retail & Digital · Corporate (from your documents after reading)
    Which project decisions should come to you personally?
    Only the big or strategic projects; my team handles the rest
    Pre-selected from your conversations · expanded, because this answer sets your governance
    Every project before it starts, and any major change
    Only the big or strategic projects; my team handles the rest Pre-selected
    Our executive committee decides together; I am one member
    Only the exceptions that need me
    Use the rules in our governance documents
    Let Metis work it out
    This means: projects above the boundary Metis computes from your data will wait for your approval. You see the boundary before launch and can change it.
    When you open Metis, what should you see first?
    Which projects may slip or overrun
    Pre-selected from your conversations · 4 other answers
    Change
    Your home opens on projects that may slip or overrun, dates and budgets first.
    Or describe it in your own words [3]
    I want to see it by subsidiary, I only decide the big bets, and I want to know what is about to slip.
    Saved as you choose. You can change all three before you launch.
    Drop what you have [4]
    Drop your project list and governance documents here · or paste a table or text
    This is the step that produces your portfolio. Metis starts reading at once and shows the first findings while it reads.
    Helps most for your answers
    Your project list or portfolio tracker
    Budgets or a Capex plan
    Status reports from the last two months
    Your PMO or governance handbook
    Your org chart
    Read: Excel, CSV, Word, PDF, PowerPoint, MS Project and Project Online exports, images, saved emails. Limits follow your plan.
    Forward to Metis: Planned V2 Voice note: Planned V2
    Enable AI processing for this tenant [5] Opens when your first file is ready to send
    Nothing is sent until you enable this. Your files are already being read by the exact parsers, which never leave Metis. You are Nova Energy's first admin.
    Provider LLM provider named here once chosen (D-33)
    Region EU
    What is sent Only the passages each step needs; never other companies' data
    Training Not used for training, as a term of our agreement with the provider. Open the agreement
    Provider retention As agreed in the data processing agreement
    Metis keeps Your files, in your own tenant storage. After launch you can delete the files, or the files and the quoted passages
    Switch off Any time, in Admin: AI onboarding policy
    Legal basis This switch is a product setting. Your lawful basis, privacy notice and data processing agreement sit outside it. Open your agreement
    Mask salaries, bank details, credentials and private phone numbers, in columns and in text
    Enable and let Metis read
    Continue without AI Use our own AI
    Your session [6] Start over
    Saved as you go · resume from any device until launch · reading continues even if you close this tab · started 5 Oct 2026, 10:00

### Annotations

1. ONB-02, ONB-27 The Metis team records these facts at tenant creation (TEN-01) from the sales discovery; the executive only confirms or changes them. They are collapsed into four chips with one Review action, because the executive has nothing to decide here unless something is wrong. Each chip names where the value came from, so a pre-filled answer cannot anchor the executive without showing its origin. Currency and fiscal year are flagged before the drop because they cannot change once budgets are imported. The main kind of work selects the starting pack.
2. ONB-03 Three questions asked outside-in. Only one is expanded: the question that sets who approves what, because it is the one with governance consequences, and its selected answer states that consequence in a line. The other two show the selected answer with Change, so the screen holds one visible decision instead of seventeen choices before the executive has seen any value. Answers are pre-selected from the sales discovery, autosaved as they are chosen, and no question presets a number or a cadence; the wording avoids "look at", "how involved" and "every morning" for the reasons in the design section.
3. ONB-03 One sentence can replace the three questions and sets the same values. It is an override offered below them, not a fourth option of equal weight.
4. ONB-04 The drop zone is the primary action of the screen: it accepts many files, folders and zip archives, or pasted text, and the list of what helps most follows the executive's answers. Caps on size, pages, archive expansion and nesting apply (ONB-24). Forwarding and voice notes come after Release 1 (ONB-29, ONB-28).
5. ONB-22 Nothing is sent to the LLM provider before the tenant enables AI processing. The panel opens when the first file is ready to send, not before the executive has any reason to read it, and the exact parsers run meanwhile. It is called enabling AI processing rather than consent, because it is a product setting: the lawful basis, the privacy notice and the data processing agreement sit outside it and are linked from it. Masking covers named fields and content a scanner finds in text. The two alternatives stay secondary: continue without AI leads to the rule-based path (ONB-20), use our own AI to the bring-your-own-AI path (ONB-21).
6. ONB-01, ONB-09 The onboarding session saves every step and resumes from any device until launch, with reading continuing on the server while the session is closed, so leaving the tab neither loses work nor flatters the clock. The header therefore shows the step and the saved state, not a stopwatch: the five clocks run in telemetry (ONB-26). Start over deletes every record the session's batch created in the Draft workspace; the audit log and the session's inputs remain.

## 47 Onboarding: reading

- File: screens/47-onboarding-reading.html · image: png/47-onboarding-reading.png
- Area: Onboarding · Phase: MVP · POC screenshots: none
- Requirements: ONB-01, ONB-04, ONB-05, ONB-06, ONB-07, ONB-08, ONB-09, ONB-11, ONB-12
- Context: none
- Purpose: Metis reads the dropped files: a live feed per file of what was found and how, running totals, provenance on every value, cards that stream in while reading, items already sent to owners, and the resumable session.

### Content

    Frame Drop Draft Launch
    Step 2 of 4 · Saved · you can leave and resume
    Reading your 7 files
    Cards appear as soon as Metis finds something only you can settle. Answer them now or later. Reading 7 files, 5 read so far, and your first draft is forming.
    First signal, after your first file [7] 2 min 10 s into reading
    34 projects found source
    3 budgets conflict source
    7 projects without a sponsor source
    2 projects overdue since August source
    Projects found
    34
    People found
    86
    Budget found
    EUR 214.6M
    3 conflicts
    Questions
    6 for you · 3 for owners
    What Metis is finding [1]
    ▦ Portfolio tracker Q3 2026.xlsx 34 projects, owners, dates; status colours read as health
    Exact parser Read
    ▦ Capex plan 2026-2028.xlsx Budgets for 31 projects; 3 differ from the tracker
    Exact parser 3 conflicts
    ⇥ Almeria Solar Phase 2 schedule.xml 412 tasks and 389 dependencies, ready as a plan
    Exact parser Read
    ▤ PMO Handbook v3.pdf 6 stages and 4 approval points; closest to the Capital projects pack (92%)
    Metis AI Read
    ▭ ExCo pack September 2026.pptx Executive committee of 5, 3 strategic objectives, top risks; 1 passage set aside
    Metis AI 1 passage set aside
    ▨ Org chart 2026.png 86 people with titles; 8 to check
    Metis AI, vision Read
    ▣ Status reports Aug to Sep 2026.zip Declared health and dates per project
    Metis AI Reading 7 of 12
    ▤ Board minutes 2025 scan.pdf This file is password protected, so nothing was read from it. Remove the password and drop it again, or skip it: your draft is built from the other 7 files.
    Exact parser Not read Retry
    How each value is kept [2]
    North Grid Substation Upgrade · budget Conflicting
    Portfolio tracker Q3 2026.xlsx · sheet Projects, row 14 · EUR 12.4M
    Capex plan 2026-2028.xlsx · sheet 2026, row 9 · EUR 13.1M
    Almeria Solar Phase 2 · schedule Read
    Almeria Solar Phase 2 schedule.xml: 412 tasks and 389 dependencies
    Smart Meter Rollout Wave 3 · sponsor Lucia Ferrer Check
    Named only on slide 12 of the ExCo pack
    For you now [3] 4 answered · 2 waiting · cap 10
    Is this your executive committee?
    Best guess Henrik Dahl, Rosa Okafor, Tomas Iwata, Amara Diallo, Lucia Ferrer · quorum 3 of 5 from ExCo pack September 2026.pptx, slide 2
    Use this Change Ask someone
    Which budget is right for North Grid Substation Upgrade?
    EUR 12.4M · Portfolio tracker, row 14
    EUR 13.1M · Capex plan, row 9
    Use the tracker Use the Capex plan
    Ask Tomas Iwata (CFO, owner of the Capex plan)
    Currency and fiscal year confirmed
    Your view: by business unit
    Your 3 strategic objectives, as in the ExCo pack (slide 4)
    J. Mensah leads 6 projects: keep as is for now
    Already sent to owners [4]
    TI Budgets of 2 projects
    Due 12 Oct
    SV Sponsors of 4 committed projects
    Due 12 Oct
    PD Capacity of the delivery teams
    Due 12 Oct
    Your session [5]
    Saved as you go · Draft workspace Nova Energy Portfolio · batch NE-2026-10-05-01
    Pause and resume later Start over
    [6] Metis writes only into your Draft workspace, through its setup tools. Nothing is live until you launch.

### Annotations

1. ONB-04, ONB-05, ONB-06 Each row names which reader produced it, and the AI rows name the path rather than only "AI": Metis AI with its provider on this path, Customer AI with its client on the bring-your-own-AI path, where Metis never read the file itself. A live feed per file: exact parsers read the tracker, the Capex plan and the MS Project export without AI; the AI reads the handbook, the deck, the image and the reports, resolves the same project across files and matches the handbook to the Capital projects pack. A passage that reads like instructions to an AI is set aside and reported. The subtitle shows the time left until the draft is ready.
2. ONB-08 Every value keeps its source, confidence and status: two sources that disagree make a conflict, a weak source gets a check badge, a strong one reads quietly.
3. ONB-11, ONB-12 Cards stream in while reading, irreversible and launch-blocking first, within the cap of 10; a bulk card and a contradiction card; "Ask someone" pre-fills the owner found in the documents.
4. ONB-11 Items that a named owner knows better are delegated at once; launch will not wait for them (ONB-17).
5. ONB-01, ONB-09 The session saves as it goes, with its batch ID; start over deletes every record the batch created in the Draft workspace; the audit log and the session's inputs remain.
6. ONB-07 The agent writes only through the setup tool group into the Draft workspace; nothing is live until launch.
7. ONB-13 The first signal appears as soon as one supported source is read, about two minutes in, and states what Metis found in the client's own data with a source behind each figure. Without it the executive sees only progress until the draft cockpit at around minute 15, which is where the review found the value arriving too late to hold attention. Each figure opens its source in one click.

## 48 Onboarding: draft cockpit

- File: screens/48-onboarding-draft-cockpit.html · image: png/48-onboarding-draft-cockpit.png
- Area: Onboarding · Phase: MVP · POC screenshots: none
- Requirements: ONB-03, ONB-08, ONB-09, ONB-11, ONB-13, EXE-01, EXE-02, BR-39
- Context: data-nav=cockpit, data-workspace=Nova Energy Portfolio
- Purpose: The executive cockpit of the Draft workspace, built from the client's own files: Draft banner, figures with source badges and as-of time, the projects that may slip first, the business units, the Portfolio X-ray with owners, and the to-confirm rail.

### Content

    Executive cockpit
    Nova Energy Portfolio · by business unit · built from your 7 files
    Draft · only you and admins can see this workspace. Every figure comes from your files: one click opens the file and the passage it came from. Of the values behind this page, 92% were read from your documents, 6% are assumed or set by default and 2% were asked. [1]
    Back to setup Review launch
    Projects
    34
    Read
    Total budget
    EUR 214.6M
    3 in conflict
    Committed
    21 of 34
    Read
    Declared health
    18 green 10 amber 4 red
    2 not reported
    Read
    May slip or overrun
    5
    Read
    North Grid Substation Upgrade · budget
    Capex plan 2026-2028.xlsx · sheet 2026, row 9 · EUR 13.1M · differs from Portfolio tracker row 14: EUR 12.4M
    [2] As of 30 Sep 2026 status reports · partial: 2 projects not reported (Wind Repowering Study, Outage Prediction Pilot) · metric version 1
    Projects that may slip or overrun · your first question [3] Showing 4 of 5
    Project | Business unit | Stage | Budget | Declared | Signal | Source
    Smart Meter Rollout Wave 3 | Retail & Digital | Execute | EUR 9.6M | Red | Target moved 30 Nov 2026 → 15 Feb 2027 (77 days) | 2 status reports
    Almeria Solar Phase 2 | Generation | Execute Check | EUR 18.0M | Amber | 2 milestones late in the schedule | schedule.xml
    ERP Finance Migration | Corporate | Execute | EUR 4.8M | Amber | Last status older than 30 days | Assumed
    North Grid Substation Upgrade | Grid | Define | EUR 12.4M or 13.1M | Green | Budget in conflict | Conflicting
    By business unit
    Generation 12 projects
    EUR 118.2M Read
    Grid 9 projects
    EUR 54.3M Read
    Retail & Digital 8 projects
    EUR 27.4M Read
    Corporate 5 projects
    EUR 14.7M Read
    Portfolio X-ray · 8 findings in your documents [4]
    Missing accountability
    4 committed projects have no sponsor
    SV Becomes an attention item at launch
    No strategic link
    9 projects are linked to none of your 3 objectives
    RO Becomes an attention item at launch
    Conflicting figures
    3 budgets differ between the tracker and the Capex plan
    TI Becomes an attention item at launch
    Slipped dates
    5 projects moved their target date between August and September
    PM Becomes an attention item at launch
    Possible duplicates
    Grid Outage Analytics and Outage Prediction Pilot
    SV Becomes an attention item at launch
    Overloaded people
    J. Mensah leads 6 projects
    PD Becomes an attention item at launch
    Stale status
    7 projects have a last status older than 30 days
    PM Becomes an attention item at launch
    Suspicious content
    1 passage in the ExCo pack (slide 27 notes) reads like instructions to an AI; it was set aside
    RO Becomes an attention item at launch
    To confirm [5]
    6 questions resolved · 2 can be delegated or left flagged for later
    14 projects will come to you: review the approval flow
    34 projects to adopt: review
    8 people to check

### Annotations

1. ONB-09 This is the product itself, the executive cockpit of the Draft workspace; before launch only owners and admins can open it.
2. ONB-08, BR-39 Every figure carries its source badge (read, check, assumed, conflicting) and opens its file and quoted passage in one click, which is what turns a surprising number from a reason to distrust the draft into a reason to trust it. The banner states the split between read, assumed and asked values for the page as a whole, so the executive knows how much of what they are seeing is their own data. The as-of time and metric version are shown, and missing data is marked partial. Computed health waits for imported plans (ONB-10).
3. EXE-01, ONB-03 The KPI tiles (EXE-01) follow the executive's answers (ONB-03): grouped by business unit, and opened on the projects that may slip or overrun.
4. ONB-13, EXE-02 The Portfolio X-ray lists eight kinds of finding from the client's own documents, each with its sources and suggested owner; each open finding becomes an attention item at launch.
5. ONB-08, ONB-11 The to-confirm rail counts the cards within the cap and leads to the approval flow, the projects to adopt and the people to check.

## 49 Onboarding: approval flow

- File: screens/49-onboarding-approval-flow.html · image: png/49-onboarding-approval-flow.png
- Area: Onboarding · Phase: MVP · POC screenshots: none
- Requirements: ONB-03, ONB-14, ONB-27, GOV-03, GOV-05, GOV-06, GOV-21, CHG-10
- Context: data-nav=framework, data-workspace=Nova Energy Portfolio
- Purpose: How a project gets approved, in business words for the executive: the lifecycle read from the PMO handbook and matched to the Capital projects pack, the big-or-strategic boundary computed from the client's data, the differences from the pack, and the dry run on three real projects.

### Content

    How a project gets approved at Nova Energy
    Draft v1.0 [1]
    Read from PMO Handbook v3.pdf · closest to the Capital projects pack (92% match)
    Open the full designer (PMO)
    Identify
    Assess
    Concept approval
    Define
    Final investment decision
    Execute
    Ready to energize
    Commission
    Handover acceptance
    Close
    Who approves what [2]
    Approval point | After | Who decides | How | Source
    Concept approval | Assess | PMO portfolio board (chair Sam Varga) | Majority of 3 | Handbook p. 14
    Final investment decision | Define | Big or strategic projects: executive committee | 3 of 5 approvers must agree Metis calls this a quorum | Handbook p. 17; ExCo pack slide 2
    Final investment decision | Define | Other projects: PMO portfolio board | Majority of 3 | Capital projects pack
    Ready to energize | Execute | Engineering director (no person named) | Single approver | Handbook p. 22 names the role only
    Handover acceptance | Commission | Operations director | Single approver | Handbook p. 25
    Big or strategic: worked out from your data [3]
    In your data, the 11 largest projects hold 66% of the budget; they start at EUR 4.5M. With the 3 smaller projects your ExCo pack ties to a strategic objective, 14 projects will come to you.
    11 largest projects · 66% of budget 23 other projects · 34%
    Keep these 14 Adjust
    Adjust shows fewer or more projects with the share of budget for each choice; you never type an amount.
    Major changes to these 14 projects also come to you; your team sets what counts as major (CHG-10).
    Three differences from the Capital projects pack [4]
    Commission is its own stage
    Keep Use the pack's way
    The final investment decision goes to the executive committee for big or strategic projects
    Keep Use the pack's way
    There is no approval point after Identify
    Keep Use the pack's way
    Dry run on three of your projects [5]
    Project | Why this one | Next approval | Who | Can they decide? | Documents that become mandatory
    Almeria Solar Phase 2 | Largest (EUR 18.0M) | Ready to energize | Engineering director | No person holds the role | Commissioning plan; grid connection test report
    North Grid Substation Upgrade | Comes to you | Final investment decision | Executive committee | Yes: 5 named, 3 needed | Business case; cost estimate; permit status
    Customer App Relaunch | Typical | Final investment decision | PMO portfolio board | Yes: 3 named | Business case; cost estimate
    1 failure to fix before launch: nobody holds the Engineering director role.
    Let Amara Diallo approve meanwhile Ask Sam Varga to name the director
    AI This draft is published at launch: Metis is its author and you are its reviewer.

### Annotations

1. ONB-03, GOV-21 The approval flow in business words for the executive; the full designer (wireframe 11) stays for the PMO. It is published at launch with the AI as author and the executive as reviewer.
2. GOV-03, GOV-05 Approvers, committee and how many must agree for each approval point, each with its source badge; a role named without a person is shown as assumed. The column says "how many approvers must agree" and keeps the word quorum as a note, because the executive setting this up is not a PMO administrator. Everything on this screen except the irreversible settings can be changed after launch, which the screen says, so a high-stakes feeling does not stall the session.
3. ONB-14, GOV-06, CHG-10 The boundary of big or strategic projects is computed from the client's data and shown as a consequence, never asked as an amount; it becomes a budget-based routing rule and also routes major changes (CHG-10, raised to P0 by the addendum).
4. ONB-27 Each difference between the handbook and the starting pack is kept or replaced in one tap.
5. ONB-14 The dry run uses the largest project, one routed to the executive and one typical project: who approves next, whether they can decide, which documents become mandatory. A failure carries its one-click fix.

## 50 Onboarding: questions and conversation

- File: screens/50-onboarding-questions.html · image: png/50-onboarding-questions.png
- Area: Onboarding · Phase: MVP · POC screenshots: none
- Requirements: ONB-11, ONB-12, ONB-17, ONB-28
- Context: none
- Purpose: The cards an executive answers in the 30-minute path: a single card with its sourced best guess, a bulk card, a contradiction card sent to its owner, the cap, the conversation panel, and the same card on a phone.

### Content

    Frame Drop Draft Launch
    Step 3 of 4 · Saved · you can leave and resume
    6 of your 10 cards answered
    [1]
    Everything else is assumed, set to a safe default, sent to its owner or kept for later. You will see the full list before launch.
    Is Almeria Solar Phase 2 in the Execute stage? [2]
    Best guess Execute, since 14 Jul 2026 from Status report September 2026 (Almeria), page 1
    Use this Change Ask someone About 10 seconds
    We matched 78 of 86 people to roles. Check the 8 we are unsure about? [3]
    K. Brandt: project manager or product owner?
    A. Haddad: project manager (named in one status report)
    Engineering director: title in the handbook, no name in the org chart
    and 5 more
    Confirm the 78 Review the 8
    Which budget is right for North Grid Substation Upgrade?
    EUR 12.4M · Portfolio tracker, row 14
    EUR 13.1M · Capex plan, row 9
    ✓ Sent to Tomas Iwata, CFO, owner of the Capex plan · due 12 Oct · the tracker value stays assumed until he answers
    [4]
    Talk to Metis [5]
    RO For projects below the big ones, Sam takes the investment decision alone. No board.
    AI
    Done: for projects that do not come to you, the final investment decision now has one approver, Sam Varga.
    Source: your message at 10:16. Undo
    RO Who approves the Ready to energize step?
    AI
    The handbook names the role, Engineering director, but no person. Shall I ask Sam Varga to name them?
    Ask Sam I'll name them
    Ask or tell Metis anything about your company
    Voice: Planned V2 [6]
    Nova Energy setup · 6 resolved, 2 can wait [7]
    Is Battery Storage Pilot committed?
    Best guess Not committed: no approved budget in the Capex plan from Capex plan 2026-2028.xlsx, row 18
    Use this Ask someone

### Annotations

1. ONB-11 The executive answers at most 10 cards in the 30-minute path; every other gap gets another treatment and is listed on the launch summary.
2. ONB-12 A card asks one question in business words, with the best guess pre-selected and its quoted source; "Use this" marks the value as assumed by the executive, or as confirmed when only the executive knows the answer.
3. ONB-12 A bulk card confirms the matched items and shows only the exceptions.
4. ONB-12, ONB-17 A contradiction card shows both sources; "Ask someone" creates a task for the suggested owner and the current value stays assumed meanwhile.
5. ONB-12 The conversation takes free answers, turns them into changes and says what changed, with its source and Undo.
6. ONB-28 Voice answers come after Release 1.
7. ONB-12 Cards also work on a phone as responsive web, with no native app in the MVP (D-19), so the executive can finish the remaining ones from mobile.

## 51 Onboarding: projects to adopt

- File: screens/51-onboarding-adoption.html · image: png/51-onboarding-adoption.png
- Area: Onboarding · Phase: MVP · POC screenshots: none
- Requirements: ONB-10, ONB-08, BR-46, BR-47, CHG-06, CHR-16
- Context: data-nav=registry, data-workspace=Nova Energy Portfolio
- Purpose: Bringing 34 running projects into Metis, reviewed by exception: four counts, then the 7 projects whose source authority, sponsor or stage needs the executive, each with its action; the 27 ready ones sit behind a tab, and one project panel shows the stages completed before Metis and what the imported baseline will lock.

### Content

    Bring 34 running projects into Metis
    [1]
    Ready, with an approved source
    21
    board or investment decision
    Not committed yet
    6
    advisory change control
    Need a sponsor
    4
    to Sam Varga
    Budget or date in conflict
    3
    two sources disagree
    Stages before the current one are recorded as completed before Metis , never as passed: no gate decision is invented. A budget or a date becomes a locked baseline only where a named authority approved it [5]
    Needs your attention (7)
    Ready to bring in (27)
    All 34
    Business unit All
    Exception All
    Committed All
    Badge All
    Project [2] | Unit | Current stage | Committed | Approved by (source authority) | What needs you | Action
    North Grid Substation Upgrade | Grid | Define Read | Yes | Investment committee pack, 4 Feb 2026 budget disagrees with the Capex plan | Tracker says EUR 12.4M, Capex plan says EUR 13.1M. Which locks the baseline? | Use 12.4M Use 13.1M
    Almeria Solar Phase 2 | Generation | Execute Assumed | Yes | Final investment decision, 12 Mar 2026 | Current stage was inferred from a status report, not stated anywhere | Confirm Execute
    Harbour Substation Rebuild | Grid | Execute | Yes evidence unclear | Capex plan 2026 only no approval marker | No board or committee approval found, so a locked baseline would rest on a planning sheet | Adopt uncommitted Delegate
    Smart Meter Rollout Wave 3 | Retail & Digital | Execute | Yes | Board minutes, 18 Dec 2025 | Sponsor named on one slide only: Lucia Ferrer | Confirm sponsor
    Wind Repowering Study | Generation | Identify | No | none | No sponsor found anywhere | Delegate to Sam
    ERP Finance Migration | Corporate | Execute Assumed | Yes | Board minutes, 6 Nov 2025 | Last status is 7 weeks old, so the stage may have moved | Confirm Ask the PM
    Coastal Wind Tie-in | Generation | Assess | Yes two dates | Investment committee pack, 9 Jan 2026 finish date disagrees | Finish 31 Mar 2027 in the pack, 30 Sep 2027 in the tracker | Use the pack Leave flagged
    7 exceptions of 34 projects. The other 27 have an approved source, a sponsor and no conflict; open "Ready to bring in" to scan or bulk confirm them. Review 7 exceptions Open all 34
    Almeria Solar Phase 2 at adoption [3]
    Identify · completed before Metis · source: ExCo pack slide 9
    Before Metis
    Assess · completed before Metis · source: ExCo pack slide 9
    Before Metis
    Define · completed before Metis · final investment decision of 12 Mar 2026, ExCo pack slide 9
    Before Metis
    Execute · current since 14 Jul 2026 · source: status report September · assumed until someone confirms it
    Current
    Commission
    Close
    No gate decision is created for the stages before Metis. The Decision Log gets one entry: Adopted at Execute at launch, approved by Rosa Okafor.
    Lock the approved budget and dates from this source as the starting baseline [4] · budget EUR 18.0M · finish 30 Jun 2027 · source authority: final investment decision of 12 Mar 2026 · after launch these two values change only through a change request. What will be locked?
    Progress and health computed by Metis: not available yet
    Import the plan now (412 tasks ready)
    Declared status: Amber, as of 30 Sep 2026

### Annotations

1. ONB-10, CHR-16 Each running project is adopted at its current stage, read from the documents or asked; the stages come from the drafted lifecycle and the project shows its lifecycle position from launch. The screen opens on the exceptions, not on all 34 rows: four counts say what the set looks like, and the executive is asked to decide only where a source disagrees, an approval is missing or a value was inferred. The 27 projects with an approved source, a sponsor and no conflict sit behind their own tab with a bulk action. The label says bringing projects into Metis, because "adopt" reads like taking ownership.
2. ONB-08 Every value keeps its source; the badges show how it was obtained, and assumed, conflicting or missing values stand out. Each exception row carries the source authority behind the proposal and one action per route: use source A, use source B, delegate, or leave flagged. Conflicts and missing sponsors become cards or owner tasks.
3. ONB-10, BR-46 Stages before the current one are recorded as completed before Metis with their sources; no gate decision is created; one Decision Log entry records the adoption and who approved it.
4. BR-47, CHG-06 A committed project gets a baseline captured at launch from the imported values, labelled from import; after launch it changes only through change requests. The panel says what will be locked, so the executive knows the consequence before approving. Computed metrics wait for an imported plan (BR-39).
5. ONB-10, BR-53 A budget or a date counts as approved only on a source authority: a document class the client names as authoritative, carrying an approval marker and its date, and the approver where the document states one. Model confidence never establishes approval, and two authoritative sources that disagree become an exception for the executive rather than a choice the model makes. A project whose only evidence is a planning sheet is offered as uncommitted instead of locking a baseline that nobody approved.

## 52 Onboarding: launch

- File: screens/52-onboarding-launch.html · image: png/52-onboarding-launch.png
- Area: Onboarding · Phase: MVP · POC screenshots: none
- Requirements: ONB-15, ONB-16, WSP-14, GOV-21, BR-44, PLT-03
- Context: none
- Purpose: Launch summary that leads with the four outcomes reached, then the exceptions: access changes with privileged roles approved by name and their access difference, unconfirmed values grouped by risk class with two blocking the launch, the load per owner, the readiness results, and what an undo would not remove.

### Content

    Frame Drop Draft Launch
    Step 4 of 4 · Saved · you can leave and resume
    Your portfolio is ready to run
    From seven of your own files, in one session. One approval makes it live; below it, the four things that need you first.
    Workspace and governance
    Nova Capital Projects v1.0
    from your PMO handbook
    Your people
    86
    from your org chart
    Projects in the portfolio
    34
    21 with an approved baseline
    Live metrics
    EUR 214.6M
    your cockpit, your figures
    What your approval will do [1] View the technical transaction
    Publish your approval flow, with Metis as the author and you as the reviewer
    Bring in your 34 running projects, with their history before Metis
    Open the workspace and invite your people with the roles below
    Send 31 pre-filled tasks to 6 owners, and turn 8 findings into attention items
    All of it in one transaction: if any check fails, nothing changes at all.
    Access changes [7] 3 need your name on them
    Privileged Sam Varga · Portfolio Manager, whole portfolio
    Now: no access. After: approve portfolio change requests, see every project, assign roles. Source: PMO handbook, page 4, "Head of PMO owns the portfolio"
    Approve for Sam
    Privileged Tomas Iwata · Tenant Admin
    Now: no access. After: users, sign-in policy, AI policy, audit log for the whole tenant. Source: assumed from the title Chief Financial Officer Assumed
    Approve for Tomas Remove
    Privileged Amara Diallo · Executive, approves Ready to energize
    Now: no access. After: gate decisions on 14 projects. Source: ExCo pack, slide 3
    Approve for Amara
    Standard 83 team roles: 11 project managers, 52 team members, 16 viewers, 4 control functions
    Each from a named source. No approval, publish or permission rights.
    Approve all 83 Review
    Values still not confirmed, by what they affect [2]
    High impact · 2 These two must be settled before launch
    Amara Diallo as the approver of Ready to energize, assumed from a slide; the Tenant Admin role for Tomas Iwata, assumed from a title. Both decide who can approve or change access, so neither can stay assumed.
    Settle both
    Normal · 64 Applied with a badge, owned by a person, correctable any time
    For example: Almeria Solar Phase 2 in Execute, from the September status report; the tracker budget kept for North Grid Substation Upgrade until Tomas Iwata answers.
    See all 64
    Informational · 7 Defaults from the Capital projects pack, nothing depends on them yet
    Stage owner roles and mandatory artifacts, as the pack defines them.
    See all 7
    Assumed means inferred for your company. Default means taken from the starting pack. Both stay flagged until someone confirms them.
    What goes to owners [3]
    Owner | Items | Due
    Sam Varga | 9 | 12 Oct 2026
    Tomas Iwata | 7 | 12 Oct 2026
    J. Mensah | 5 | 12 Oct 2026
    Priya Duarte | 4 | 12 Oct 2026
    L. Novak | 3 | 12 Oct 2026
    K. Brandt | 3 | 12 Oct 2026
    Total | 31 items | 12 Oct 2026
    Sam Varga carries 9 of the 31 items on top of his own work. Move some to another owner, or extend the due date.
    Launch does not wait for these. A normal value applied today is kept unchanged after its due date if nobody answers; a high-impact value is never kept that way, it escalates.
    Who will finish the rest for you? [4]
    SV Sam Varga, Head of PMO
    Suggested from the org chart and the PMO handbook
    Readiness [5]
    ✓ Owner set: Rosa Okafor
    Passed
    ✓ Default lifecycle ready to publish: the draft passes the publish check
    Passed
    ✓ Every status mapped to a system state
    Passed
    ✓ At least one portfolio: 4
    Passed
    ✓ Every approval point has approvers who can decide: fixed at 10:21 (Amara Diallo approves Ready to energize meanwhile)
    Passed
    ✓ Dry run: 3 of 3 projects pass
    Passed
    Approve and launch
    After launch [6]
    You can undo this launch until 19 Oct 2026. Records nobody changed are removed; records someone changed stay, and are listed with who changed them.
    An undo will not remove: invitations already sent, a published approval flow once a gate decision has used it, a baseline a change request has since changed. See what cannot be undone
    Each step is in the audit log: Metis as author of each proposal, you as approver, each granted role with your name, channel onboarding.

### Annotations

1. ONB-15, PLT-03 The page leads with the four outcomes reached, because this is the end of the journey and the moment the executive remembers; the consequences follow as exceptions to check, not as a list of counts to absorb. What the approval does is stated in business words, with the seven-step transaction behind one link. At launch the invitations go out and the approved roles take effect, and invitations are queued so that a rolled-back launch sends none.
2. ONB-15, ONB-08 Unconfirmed values are grouped by what they affect, never shown as one number: a count of 73 tells the executive nothing about which of them can hurt. The two high-impact ones, an approver and an access grant, block the launch until they are confirmed or delegated; the rest are applied with a badge and an owner. The two badges are explained in one sentence on the screen, because assumed and default read alike to someone seeing them for the first time.
3. ONB-15, ONB-17 Owners, their items and the due date; launch does not wait for them. The owner carrying the heaviest load is named before the approval, so a launch that is fast for the executive does not quietly become a long queue for the organization. A normal value left past its due date is kept unchanged, which the screen says in those words; a high-impact value escalates instead.
4. ONB-15 The person who finishes the rest becomes the default owner of delegated items.
5. WSP-14, GOV-21, BR-44 The activation rules, the publish check and the dry run run again on the server when the executive approves; any failure stops the launch, nothing changes, and the failing rule is named with its one-click fix (here the approval fix applied at 10:21). The lifecycle is published with the executive as reviewer and the AI as author, and launch needs this person's approval.
6. ONB-16 The undo window, 14 days by default, removes the batch's unchanged records and lists and keeps the others. What an undo cannot remove is named here, before the approval, rather than discovered afterwards: sent invitations, a published approval flow a gate decision has used, and a baseline a change request has changed.
7. ONB-15, BR-44, BR-51 Every role the launch would grant is a proposal with its source and the difference between the person's current and proposed access. Standard team roles are approved in bulk. A privileged role, one that can approve, publish or change access, is listed by person and approved against that name, because approving 86 invitations in one gesture is not an informed approval of three administrators. The server re-checks every grant against the permission matrix when the launch commits, so a proposal the matrix refuses stops the launch instead of being granted.

## 53 Onboarding: owner tasks

- File: screens/53-onboarding-owner-tasks.html · image: png/53-onboarding-owner-tasks.png
- Area: Onboarding · Phase: MVP · POC screenshots: none
- Requirements: ONB-08, ONB-17, ONB-18, ONB-19, BR-48, PLT-09
- Context: data-nav=setup-tasks, data-workspace=Nova Energy Portfolio
- Purpose: After launch: the finisher's task list with pre-filled values and sources, the completeness bar the executive sees, the rule that keeps launch values by default at the due date, a suggestion from a new document waiting for a person, and a task raised at the moment of need.

### Content

    Delegated follow-through: 39% of the handed-over items closed
    [1]
    12 of 31 delegated items closed, as of 7 Oct 2026 · due 12 Oct 2026 · the launch itself completed on 5 Oct; this bar is only the work handed to owners, and Rosa Okafor sees it on her home until it closes
    Accountability and process (Sam Varga)
    3 of 9
    Budgets (Tomas Iwata)
    4 of 7
    Capacity (Priya Duarte)
    0 of 4
    Project details (PMs)
    5 of 11
    Your tasks, Sam [2]
    Name a sponsor for 4 committed projects
    Suggested: North Grid Substation Upgrade, Amara Diallo (sponsor of a related project)
    Accept the suggestions Edit Reassign
    Due 12 Oct
    Are Grid Outage Analytics and Outage Prediction Pilot the same project?
    Merge Keep both I don't know
    Due 12 Oct
    Name the Engineering director for Ready to energize
    Amara Diallo approves meanwhile Assumed
    Name a person Reassign
    Due 12 Oct
    Adapt the Capital projects pack's process frameworks
    Raised on 6 Oct, when J. Mensah first opened them; not one of the 31 setup items
    Start Reassign
    Due 12 Oct
    Concept approval board members confirmed
    Done
    Programs of the Grid unit confirmed
    Done
    Status list mapping confirmed
    Done
    At the due date [3]
    On 12 Oct, a normal value applied at launch that nobody confirmed stays as it is: its badge becomes kept unchanged after the due date and it stays in Sam Varga's attention list. Nothing new is applied automatically, and a high-impact value is never kept this way: it escalates and stays unconfirmed.
    Kept unchanged after the due date
    Suggestion waiting for a person [4]
    From 'Almeria status report October.docx', uploaded by J. Mensah on 6 Oct: target date 30 Jun 2027 → 31 Aug 2027.
    This is a baselined date: accepting it opens a change request.
    Accept and raise a change request Dismiss
    Suggestions never apply themselves.
    Asked at the moment of need [5]
    J. Mensah opened deliverable process frameworks for the first time on 6 Oct; none is set up yet, so a task to adapt the Capital projects pack's frameworks went to Sam Varga, due 12 Oct. It is not one of the 31 setup items.
    [6] Reminders by email and in the app on 9 Oct and on the morning of 12 Oct; overdue items go to Sam Varga, then appear in Rosa Okafor's attention queue. Each owner's assumed values awaiting confirmation, such as Amara Diallo approving Ready to energize, are counted in that owner's item there until someone confirms or changes them.

### Annotations

1. ONB-17, ONB-26 The bar is the share of delegated items closed and is labelled as such, because "39% of setup complete" reads as if the launch were unfinished when in fact it completed on day one. The two figures are never merged: the executive's launch completed at the commit, and this is the follow-through. Load per owner, queue age and overdue items at day 7 and day 14 are measured, so a short executive session that leaves a long organizational queue shows up as the cost it is.
2. ONB-17 Tasks carry pre-filled values and their sources; accept, edit, reassign or "I don't know"; each has a due date.
3. BR-48, BR-52 At the due date a normal value applied at launch is kept unchanged, badged in those words rather than as "kept by default", which read like a default value, and it stays in the finisher's attention list; nothing new applies itself, and a high-impact value is never kept this way but escalates.
4. ONB-18 After launch a new document produces a suggestion that a person accepts; a change to a baselined value goes through a change request.
5. ONB-19 Deferred items become tasks at the moment of need, here when deliverable process frameworks are first opened; they are not counted in the setup items of launch.
6. PLT-09, ONB-08 Reminders and escalations use the Release 1 channels, in-app and email; an overdue item goes to the default owner, then to the executive's attention queue, which also counts each owner's assumed values awaiting confirmation until someone confirms or changes them.

## 54 Onboarding: rule-based import

- File: screens/54-onboarding-rule-based.html · image: png/54-onboarding-rule-based.png
- Area: Onboarding · Phase: MVP · POC screenshots: none
- Requirements: ONB-05, ONB-20
- Context: none
- Purpose: Setup with the Metis onboarding AI switched off: columns of a project list mapped by header rules, status colours read as health, an MS Project plan read exactly, and the kept-and-dropped report before anything is written.

### Content

    Frame Drop Draft Launch
    Step 2 of 4 · Saved · mapping kept for next time
    Check how Metis reads your 4 files
    Metis AI is off for Kite Logistics (tenant policy). Structured files are read by exact rules; PDFs and slide decks are listed but not read. [1]
    Map the columns of Fleet projects 2026.xlsx [2]
    Column in your file | Sample | Metis field | How it was matched
    Project | Hub expansion Rotterdam | Project name
    | Header name
    Owner | T. Berger | Project manager
    | Header name; 14 of 15 names match people, 1 placeholder
    Budget (EUR k) | 2,400 | Approved budget
    | Header name; thousands converted to euros
    Go-live | 30/06/2027 | Target date
    | Header name; day/month/year
    RAG (cell colour) | red cell | Declared health
    | Cell colour: red, amber, green
    Phase | Build | Current stage
    Check
    | Value list: Build maps to Execute
    Notes | Waiting for the port authority | Not imported
    | Free text has no field
    Fleet telematics rollout.mpp [3] Read
    MS Project file read exactly: 186 tasks, 171 dependencies, 4 milestones. It becomes the WBS of Fleet telematics rollout at launch.
    Kept and dropped [4]
    Kept
    15 projects
    15 owners: 14 matched, 1 placeholder
    15 budgets
    186 plan tasks
    Dropped
    Column Notes: free text, no matching field
    Sheet Archive 2024: not selected
    Ops handbook 2025.pdf and Board deck Q3.pptx: not read on this path. Handbooks, decks and minutes need the Metis AI or your own AI; this path reads structured files only
    Ask your admin to turn on Metis AI Use your own AI
    Your mapping is saved for these headers: the next file with the same columns opens already mapped, and you can leave this screen and come back to it.
    Write to the Draft workspace
    Nothing is written before you press this; nothing is sent to an AI provider.

### Annotations

1. ONB-20 With the onboarding AI switched off, the same session works with exact rules; unstructured documents are listed but not read, and nothing reaches an LLM provider.
2. ONB-05, ONB-20 Columns are matched by header names, value lists, units and cell colours; the executive can change any mapping. A mapping is saved per set of headers and offered for the next matching file, so a long mapping can be interrupted and resumed rather than repeated. The dropped list says plainly that unstructured documents are not read here: this path is not equivalent to the AI path for handbooks and decks, and the screen does not imply that it is.
3. ONB-05 An MS Project file is read exactly into WBS items with dates, dependencies and milestones.
4. ONB-20 The kept-and-dropped report comes before anything is written, and names the paths that can read what was dropped.

## 55 Set up with your own AI

- File: screens/55-onboarding-own-ai.html · image: png/55-onboarding-own-ai.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: ONB-07, ONB-21, MCP-15, MCP-20, ONB-39
- Context: data-workspace=Kite Logistics Portfolio
- Purpose: The bring-your-own-AI path: the admin switch for the setup tool group, an onboarding token limited to the setup tools and the Draft workspace, the connection test, the copy-ready prompt pack and a live feed of what the client's AI proposes; launch stays in Metis.

### Content

    Set up with your own AI
    Your AI reads your files where they are and sends Metis what it finds. Metis records every value as Customer AI with the passage your AI reported, and does not claim to have read the document itself, so a value that locks a budget or grants access is confirmed by a person here. You review and launch in Metis.
    Profile Notifications AI access
    1 · Allowed by your admin [1]
    Setup tools for MCP clients
    Switched on by your tenant admin on 2 Oct 2026 · MCP clients allowed by your client policy (MCP-20)
    2 · Connect [2] OAuth recommended
    https://kite.mcp.metis.example/mcp
    Copy
    or
    Onboarding token · name Kite setup · tools: setup tools only · workspace: Kite Logistics Portfolio (Draft) · expires in 7 days
    Test connection: connected as Omar Sato · 13 setup tools allowed · Draft workspace only
    3 · Paste one prompt [3]
    Use the Metis tools to set up our company from these files. Start with get_setup_context and follow it.
    Copy
    Add the projects in this file to our Metis setup, with their owners, dates, budgets and status.
    Copy
    From this handbook, describe in Metis how our projects get approved and who approves them.
    Copy
    Add the people in this org chart to our Metis setup with their titles and suggested roles.
    Copy
    Fill in the budgets of our Metis projects from this finance sheet.
    Copy
    Get the open Metis setup questions and answer the ones these files can answer by proposing the values with the setup tools; leave the others.
    Copy
    In your AI's prompt menu and preview: Planned V2 [4]
    4 · What your AI is proposing [5]
    ▤ Read Ops handbook 2025.pdf: approval flow of 5 stages and 3 approval points (pages 6 to 11)
    Reported by your AI
    ▭ Read Board deck Q3.pptx: 3 strategic objectives (slide 4)
    Reported by your AI
    ? Raised 2 questions: who chairs the investment board? Is Hub expansion Rotterdam committed?
    Reported by your AI
    ↻ Corrected itself after a Metis check: the approval point Investment board had no approver
    Reported by your AI Fixed
    Launch happens in Metis only. Your AI cannot launch, invite people or grant roles. [6]
    Verified clients [7]
    Client | Sign-in | Status
    Desktop LLM app | Token | Verified for onboarding
    Chat assistant (OAuth) | OAuth | Verified for onboarding
    Code editor | Token | Verified, not for onboarding
    Internal agent | Token | Not yet verified

### Annotations

1. ONB-07, MCP-20 The setup tool group is off by default for external clients; the tenant admin switches it on within the client policy.
2. ONB-21 OAuth, or an onboarding token limited to the setup tools and one Draft workspace, valid 7 days by default; the test shows exactly what the token allows.
3. ONB-21 Prompts stay short because the first call returns the setup context served by Metis.
4. ONB-39 Serving the pack as MCP prompts and previewing inside the client come after Release 1.
5. ONB-21, ONB-07 The live feed shows what the client's AI proposes, with the sources it reports; Metis validation errors let it correct itself.
6. ONB-21 Launch stays in Metis; the client's AI cannot launch, invite or grant roles (BR-35).
7. MCP-15, ONB-21 Verified clients gain a "verified for onboarding" mark once they pass Metis's onboarding test scenario.

## 56 Tenant admin: AI onboarding policy

- File: screens/56-tenant-admin-ai-onboarding.html · image: png/56-tenant-admin-ai-onboarding.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: ONB-07, ONB-22, ONB-23, ONB-24, ONB-25, ONB-26, TEN-04, MCP-11, BR-49, BR-50
- Context: data-nav=admin-ai
- Purpose: Tenant admin page for the onboarding AI: consent and processing, masking, what happens to uploaded files, quotas and spend cap, the setup tool switch for external clients, security events, the assurance evidence of the current release, and the onboarding metrics of the tenant's own sessions.

### Content

    AI onboarding policy
    Applies to every onboarding session of Nova Energy · last changed by Rosa Okafor on 5 Oct 2026, 10:01
    AI processing for this tenant [1] Enabled by Rosa Okafor, 5 Oct 2026, 10:01
    Provider Named here once chosen (D-33)
    Region EU
    What is sent The passages each step needs; never other companies' data
    Training Never
    Provider retention As agreed in the data processing agreement
    Metis keeps Uploaded files in your tenant storage
    Switch the onboarding AI off
    Masking before sending [2]
    Salaries and pay Masked
    Private phone numbers Masked
    Home addresses Masked
    Personal email addresses Not masked: switched off by the tenant admin
    Add a category
    Uploaded files after launch [3]
    Keep them as the sources behind each value
    Delete the original files after launch: the stored files go, and provenance keeps the file name and the quoted passage
    Delete the source content after launch: the files, the extracted text and the quoted passages all go; each value keeps a source identifier, a hash and the mark "source removed"
    Quotas and spend [4]
    Files, this onboarding: 7 of 500
    Pages read, this onboarding: 211 of 5,000
    AI calls, this onboarding: 1,940 of 20,000
    Provider spend cap for the tenant: 23% used
    Audio minutes Planned V2
    At the cap AI reading stops with a clear message; rule-based import keeps working.
    Setup tools for MCP clients [5]
    External clients may use the setup tools
    Off: Nova Energy onboards with the Metis AI. When on, onboarding tokens are limited to one Draft workspace and, by default, 7 days.
    Security events [6]
    Time | Event | Detail | Status
    5 Oct 10:02 | Suspicious content | ExCo pack September 2026.pptx, slide 27 notes: text addressed to an AI was removed from reading | Reviewed
    5 Oct 10:31 | Out-of-scope questions | 2 questions about how Metis is built got the fixed reply | No action
    6 Oct 14:32 | Unknown identifier | An MCP client using K. Brandt's token asked for a project identifier that is not in this tenant; it got the same answer as for an identifier that does not exist | Reviewed
    Assurance evidence of the current release [7]
    Suite | Run | Result
    Boundary suite | release 1.4.2, 1 Oct 2026 | Passed: 0 findings
    Agent red-team suite | 1 Oct 2026 | Passed: 0 leaks, 0 writes outside a Draft workspace, 0 person-only actions
    Extraction accuracy | 1 Oct 2026 | Passed: above the threshold for every record type
    Onboarding metrics [9]
    Session of 5 Oct 2026, as of 7 Oct 2026: to draft 14 min · to launch 27 min · 6 cards answered · values 92% read, 6% assumed or default, 2% asked · 12 of 31 delegated items closed
    The provider console shows the same figures for your tenant, without any business data.
    [8] Every AI call, tool call, refusal and security event is in the audit log; full content is kept only for security events, for 90 days. Open the audit log

### Annotations

1. ONB-22, BR-49, D-43 Customer content reaches the LLM provider only after a tenant admin enables AI processing here. It is called enabling AI processing, not consent, because consent reads as the legal basis for processing personal data: that basis, the privacy notice and the data processing agreement sit outside the product and are linked from this page. The no-training term is a contractual commitment of the selected provider, shown with a link to the agreement rather than as something Metis verifies itself. Switching this off blocks the next tool call at once, and a staged write already in flight re-checks the policy before it commits, so it is not applied.
2. ONB-22 Masking before sending is on by default; the tenant admin switches categories on or off.
3. ONB-22, D-38 Uploaded files stay in tenant storage under the retention policy, and deletion is offered as two named actions, because one word cannot mean both: deleting the original files removes the stored binaries and keeps the quoted passages, which are themselves content from the document; deleting the source content removes the binaries, the extracted text and those passages, leaving each value a source identifier, a hash and the mark "source removed". Neither action reaches what audit retention (D-34) or the backup purge period still holds, and the page says what remains and until when rather than promising that the data is gone.
4. ONB-24 Quotas per onboarding and a provider spend cap per tenant (TEN-10); at the cap AI reading stops and the rule-based path keeps working.
5. ONB-07, TEN-04 The setup tool group stays off for external clients unless switched on here, in the tenant admin console.
6. ONB-23, ONB-24, BR-50 Security events: suspicious content removed, a guessed identifier answered exactly like a missing one, and out-of-scope questions answered with the fixed reply.
7. ONB-25 The three assurance suites gate every release; the tenant sees the latest results.
8. MCP-11 Every call is in the audit log; full content is kept only for security events, for 90 days (D-34).
9. ONB-26 The tenant admin sees the same onboarding metrics for the tenant's own sessions; the provider console shows them without business data (TEN-08).

## 57 Provider console: tenant pre-fill and onboarding metrics

- File: screens/57-provider-onboarding.html · image: png/57-provider-onboarding.png
- Area: Access & tenancy · Phase: MVP · POC screenshots: none
- Requirements: ONB-02, ONB-26, TEN-01, TEN-08
- Context: data-nav=provider-tenants
- Purpose: Provider console: onboarding metrics per tenant without any business data, and the create-tenant dialog extended with the facts and answers recorded from the sales discovery.

### Content

    Onboarding
    Provider operations · data as of 7 Oct 2026, 09:00
    Onboarding per tenant [1]
    Tenant | Path | To draft | To launch | Cards | Read / assumed / asked | Delegated closed | Abandoned at
    Nova Energy | Metis AI | 14 min | 27 min | 6 | 92% / 6% / 2% | 12 of 31 | none
    Kite Logistics | Rule-based and own AI | 22 min | 41 min | 9 | 81% / 14% / 5% | 5 of 18 | none
    Sable Foods (trial) | Metis AI | 19 min | not launched | 4 | 88% / 9% / 3% | none | Draft step
    Metrics only: no project names, figures or documents. Eligible sessions this month: 2 of 2 activated. Active open time to launch: median 34 min, 75th percentile 41 min, 90th percentile 41 min, 50% within 30 minutes. The trial tenant waiting for single sign-on is not eligible and is reported separately, not against the target.
    Create tenant [2]
    Organization name * Nova Energy
    Email domains nova.example
    First tenant admin * r.okafor@nova.example (Rosa Okafor, COO)
    IT contact for sign-in setup it.admin@nova.example
    Plan Business
    Start as Trial Active
    Trial length 30 days
    Region Region choice: Planned V2 EU
    From the sales discovery [3] Recorded by D. Lindqvist, 1 Oct 2026
    Scope All of Nova Energy
    Main kind of work Engineering, construction and capital projects
    Starting pack: Capital projects
    Currency EUR
    Fiscal year January to December
    Answers, only where the customer said them
    Reviews the portfolio by business unit or subsidiary
    Source: discovery call of 28 Sep, Rosa Okafor
    Decides only the big or strategic projects
    Source: discovery call of 28 Sep, Rosa Okafor
    Not asked
    Leave unanswered rather than guess: the executive answers it on the framing screen
    Record only what the customer actually said. A guessed answer arrives pre-selected and becomes the answer the executive confirms without thinking.
    Propose AI processing (the customer's admin still enables it) On
    Cancel Create tenant

### Annotations

1. ONB-26, TEN-08 Onboarding metrics per tenant for provider operators, with no tenant business data. The table separates what the measure needs: whether the session was eligible, whether it activated, the active open time, and the elapsed time beside it, so a session that waited three days for single sign-on is visible as a dependency rather than as a slow executive. Distribution figures replace a single median, and ineligible sessions are reported separately instead of being counted against the target.
2. TEN-01 The create-tenant dialog of wireframe 07, extended with the IT contact; the first tenant admin is the executive who will onboard, and the IT administrator named in wireframe 07 becomes the IT contact.
3. ONB-02 Each pre-filled value names who recorded it and when, and a question the customer did not answer is left unanswered rather than guessed, because a pre-selected guess anchors the executive to it. Facts and, when known, answers from the sales discovery are recorded here, so the executive only confirms them; the onboarding AI can be proposed, but the customer's admin accepts it.

## 58 Process framework editor

- File: screens/58-process-framework-editor.html · image: png/58-process-framework-editor.png
- Area: Workspace & governance · Phase: MVP · POC screenshots: 35
- Requirements: BLD-09, BLD-12, BLD-13, BLD-14, BLD-15, BLD-16, BR-41, PLT-05
- Context: data-nav=templates, data-workspace=Creative Studio
- Purpose: Author a process framework outside any project: lanes with their label and type, node templates on a relative day axis with offsets, durations and roles, typed connections with lag, a sub-item and a connection point, a check that keeps Publish disabled while a dependency cycle remains, and a list view for the keyboard.

### Content

    Process framework CGI Still Renders, 5 angles Draft v0.1 [1]
    Copy of CGI Still Renders v1.1 · drafted by Nadia R. (Project Manager) on 21 Sep 2026 · used by 0 projects · workspace Creative Studio
    All changes saved · 10:12
    Delete draft
    Submit for review Planned V2
    Publish v1.0
    Check: 4 of 5 pass. A dependency cycle runs Prefinal Approval → Final Quality Check → Prefinal Approval. Publish v1.0 stays disabled until every check passes. [2]
    At least one node (17)
    Every node named and in a lane
    Offsets and durations of zero or more
    No dependency cycle: 1 found
    Sub-items within the WBS depth
    Project Managers draft process frameworks; the Workspace Owner publishes them. Publishing creates v1.0 with its effective date; Blueprints and items already built from other versions never change.
    Canvas Canvas List Day 0 is the Start Date chosen in the Deliverable Builder · this workspace counts working days [4]
    17 nodes · 17 connections · 1 connection point
    Working days
    Day 0 Day 5 Day 10 Day 15 Day 20 Day 25
    Deliverables
    Camera Angle 3d
    Angle 5 2d [5]
    Draft 5d
    Pre-Finals 5d
    Final 3d
    Approval
    C.A. Approval 1d
    Draft Approval 2d
    Prefinal Approval 2d
    Input required
    Confirmed Modeling 2d
    Payment Deposit 1 1d
    Payment Deposit 2 1d
    Quality gate
    Quality Check 1 1d
    Final Quality Check 1d
    Milestones
    Milestone 1: Angles locked
    Milestone 2: Prefinal locked
    Risk
    Risk Mitigation #1 1d
    Communication 1d
    FF
    Cycle [6]
    Mouse: drag a node along its lane to change its offset, drag its right edge to change its duration, click to edit, drag the link handle onto another node to connect, double-click a lane line to add a connection point, select an arrow to change its type, lag or route, Delete removes, + adds a node or a sub-item. Every action has a keyboard equivalent and the List view.
    Lanes [3] + Add lane
    Lane | Label | Type | Nodes
    ⋮⋮ Deliverables | None | Work Package | 5
    ⋮⋮ Approval | Approval Gate | Task | 3
    ⋮⋮ Input required | Input Required | Task | 3
    ⋮⋮ Quality gate | Checkpoint | Task | 2
    ⋮⋮ Milestones | Milestone | Task | 2
    ⋮⋮ Risk | Risk Related | Task | 2
    Rename in place, drag to reorder. A lane can be removed only when it has no nodes.
    Node template · Draft Approval [7] Remove node
    Name * Draft Approval
    Lane Approval
    Parent node None (top level)
    Type Task
    Labels Approval Gate from the lane · + add a label
    Offset Day 13
    Duration 2 working days
    PIC: workspace role or member title Role: Project Manager
    Matches 1 member in this workspace
    Approver: workspace role or member title Title: Client
    No matching member yet; the build will leave it empty and list it
    Reviewer: workspace role or member title Title: Art Director
    3 members hold this title the project manager chooses at build time
    Planned effort 2h
    Description Client approves the draft renders of all five angles.
    Input required (list) Draft renders
    Output produced (list) Approved draft
    Priority High
    Risk level Medium
    Status, dates, named people, effort spent and files are set on the WBS items a build creates, never in the framework.
    Connection [8] Arrow selected
    Prefinal Approval → Final Quality Check
    Dependency type FS SS FF SF
    Lag 0 days
    Route 1 bend · connection points only route arrows
    This connection closes a cycle with Final Quality Check → Prefinal Approval. Reverse it or delete it to pass the check.
    Reverse Delete
    A connection always joins two nodes of this framework; project items cannot be chosen.
    Canvas, keyboard and list: one row per operation [10] The matrix the build tests; every row works in the list view with the keyboard alone
    Operation | Canvas gesture | Keyboard | List view
    Create a node | "+" on a lane | Alt+N on the focused lane | Add row, lane preselected
    Edit a node | Click the node | Enter on the focused row or node | Edit in the row, or open the full form
    Move a node between lanes | Drag along or across lanes | Alt plus arrow up or down | Change the Lane cell
    Change the offset or duration | Drag the node or its right edge | Arrow keys in the cell | Change the Offset or Duration cell
    Set or clear a parent | Drop onto a node | Alt+P, then choose | Change the Parent cell
    Add, rename, reorder or remove a lane | Lane header menu and drag | Alt+L, F2, Alt plus arrow | Lane list above the table
    Create a connection | Drag the link handle | C on the source, then choose the target | Add in the Connected from cell
    Set the type and the lag | Select the arrow, edit its label | Enter on the connection, then Tab | Edit the type and lag in the cell
    Delete a connection | Select the arrow, Delete | Delete on the connection | Remove from the Connected from cell
    Add, move or delete a route point | Double-click a lane line and drag | Alt+R, arrows, Delete | Route points list per connection; geometry only, no dependency
    What the build preview will say about the roles on this framework [11]
    Resolved PIC, role Project Manager, in Harbour Rebrand: A. Nguyen
    Missing Approver, title Client: no member holds it, so the generated item is left unassigned and listed here
    Ambiguous Reviewer, title Art Director: 3 members hold it (M. Rossi, T. Berger, S. Ito). The project manager chooses one before the build runs; Metis never picks the first match
    Choose
    List view of the same framework [9] Shown after Canvas / List is switched to List; both views edit one model
    Lane | Node | Parent | Offset | Duration | Label | Connected from
    Input required | Confirmed Modeling | None | Day 0 | 2d | Input Required | Start of flow
    Risk | Risk Mitigation #1 | None | Day 0 | 1d | Risk Related | Start of flow
    Deliverables | Camera Angle | None | Day 2 | 3d | None | Confirmed Modeling FS 0, Risk Mitigation #1 FS 0
    Deliverables | Angle 5 | Camera Angle | Day 3 | 2d | None | Start of flow
    Approval | Draft Approval | None | Day 13 | 2d | Approval Gate | Quality Check 1 FS 0, Payment Deposit 1 FS 0
    Milestones | Milestone 2: Prefinal locked | None | Day 23 | 0d | Milestone | Prefinal Approval FF 0
    11 more nodes and 12 more connections
    Keyboard: Tab moves through nodes lane by lane · arrow keys move the selected node by one day or one lane · Shift with arrow keys changes the duration · Enter edits · C connects · T changes the type of the selected connection · Delete removes · ? lists every shortcut.

### Annotations

1. BLD-13, BLD-16, BLD-09 The editor opens from the template library with New framework, Edit a copy or Open, never inside a project. A Project Manager drafted this copy; the Workspace Owner, signed in here, publishes it as v1.0 once the check passes. Review before publishing is Planned V2 (BLD-11). A draft that was never published can be deleted; a published framework is deprecated instead, so the items built from it keep their provenance. Drafts autosave and show their save state (PLT-05).
2. BLD-16 Publishing runs the check: at least one node, every node named and in a lane, offsets and durations of zero or more, no dependency cycle, sub-items within the WBS depth. A cycle fails here, so Publish v1.0 stays disabled and the banner names the reason; the server runs the same check when Publish is pressed. Publishing creates an immutable version; Blueprints and items already built never change.
3. BLD-13 Lanes belong to the framework: add, rename and reorder them, and remove a lane only when it is empty. Each lane maps to one label or none and optionally a type, which its nodes take by default (BLD-06). A new framework starts with the six default lanes.
4. BLD-13, BLD-14 The canvas uses a relative day axis: day 0 is the Start Date chosen in the Deliverable Builder, and the workspace counts working days (its duration setting). A node sits at its offset and shows its duration; no calendar date and no named person appears in a framework, unlike the POC, which stored both.
5. BLD-14 Angle 5 is a sub-item of Camera Angle: the build creates it as a child of the Camera Angle item. The dashed line is the hierarchy, not a dependency.
6. BLD-15 Arrows are connections between two nodes of this framework, each with a dependency type and a lag; types other than FS are written on the arrow (FF here). The circle on the Input required lane is a connection point: it only routes the arrow from Draft and creates no item and no dependency. The red arrow closes the cycle that the check reports.
7. BLD-14 A node keeps its name, lane, parent, type, labels, offset, duration, planned effort, description, input and output lists, priority, risk level, and its PIC, Reviewer and Approver as a team role or title. When the framework is built, a role or title resolves to the one project member who holds it; when nobody or several people hold it, the build preview lists the item for the PM.
8. BLD-15, BLD-16 Selecting an arrow shows its type and lag. The selected arrow closes the cycle that blocks publishing; Reverse or Delete fixes it. A connection can never end on a project item.
9. BLD-12, BR-41 The List view edits the same framework without a pointer: offsets, durations, parents, labels and connections with their type and lag. Switching between Canvas and List never loses work. The focused row shows the focus ring; the selected row uses the selection fill.
10. BLD-13, BR-41 "Every editor action can be done in the list view" is one sentence that cannot be tested, so it is decomposed into a parity matrix: one row per operation, with its canvas gesture, its keyboard command, its list action and the server command all three call. The matrix is the artifact the keyboard tests are generated from, and an operation that is not in it does not exist in the canvas either.
11. BLD-14, BLD-12 A node names a workspace role or a member title, not a person, so a build has three possible outcomes and the preview says which: resolved to one member, missing when nobody holds it, and ambiguous when several do. The previous wording, "resolves to the one project member holding it; otherwise it stays empty", collapsed nobody and several into the same empty field, which left the project manager unable to tell a vacancy from a choice. Metis never picks the first match, and renaming a title keeps the selector working through an alias or lists it as missing.
