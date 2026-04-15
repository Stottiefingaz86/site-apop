# Data Model: Change deposit to say Wallet

## Entities

### 1. WalletNavTrackingEvent

- **Description**: Telemetry payload emitted for APOP feature performance tracking.
- **Fields**:
  - `featureId` (string, required) — fixed feature identifier: `cmo0gy5qw0015dd0etheq96fg`
  - `eventType` (`impression` | `click`, required)
  - `route` (string, optional) — pathname where event occurred
  - `elementId` (string, optional) — identifier for clicked/impressed wallet nav element
- **Validation Rules**:
  - `featureId` must be non-empty.
  - `eventType` must be either `impression` or `click`.
  - Empty event arrays are invalid at API boundary.

### 2. WalletNavElement

- **Description**: Existing main-nav button block extended with APOP attributes.
- **Fields**:
  - `label` (string, required) — now `WALLET` (previously `DEPOSIT`)
  - `data-apop-feature-id` (string, required for instrumented roots)
  - `data-apop-element-id` (string, recommended for stable event dimensions)
  - `action` (callback, required) — existing `openDepositDrawer` behavior retained
- **Validation Rules**:
  - Label should be semantically updated without changing button style/position.
  - Interaction must remain functional if tracking submission fails.

## Relationships

- A `WalletNavElement` interaction emits one or more `WalletNavTrackingEvent` records.
- Events are normalized at `/api/tracking/events` and inserted into existing tracking
  storage using the shared tracking pipeline.
