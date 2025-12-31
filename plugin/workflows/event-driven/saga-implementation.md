---
description: Implement distributed transactions using saga pattern
triggers:
  - manual
  - transaction:distributed
agents:
  - architect
  - fullstack-developer
  - tester
---

# Saga Implementation Workflow

Implement distributed transactions with compensation.

## Prerequisites
- [ ] Business process requiring multi-service transaction
- [ ] Services identified for participation
- [ ] Failure scenarios documented

## Phase 1: Saga Design

### Step 1.1: Choose Saga Type
```yaml
agent: architect
action: design
types:
  choreography:
    pros:
      - Simple, loosely coupled
      - No central coordinator
    cons:
      - Hard to track flow
      - Difficult to debug
    use_when: Simple, few participants
  orchestration:
    pros:
      - Clear flow visibility
      - Easier debugging
      - Centralized logic
    cons:
      - Single point of failure
      - More complexity
    use_when: Complex, many participants
```

### Step 1.2: Define Saga Steps
```yaml
agent: architect
action: define
steps:
  - name: step_name
    service: service_name
    action: forward_action
    compensation: rollback_action
    timeout: duration
    retries: count
example:
  - name: ReserveInventory
    service: inventory
    action: reserve
    compensation: releaseReservation
  - name: ProcessPayment
    service: payment
    action: charge
    compensation: refund
  - name: ConfirmOrder
    service: order
    action: confirm
    compensation: cancel
```

## Phase 2: Implementation - Choreography

### Step 2.1: Define Events
```yaml
agent: fullstack-developer
action: define
events:
  - forward_events:
      - InventoryReserved
      - PaymentProcessed
      - OrderConfirmed
  - compensation_events:
      - InventoryReleased
      - PaymentRefunded
      - OrderCancelled
  - failure_events:
      - InventoryReservationFailed
      - PaymentFailed
```

### Step 2.2: Implement Event Handlers
```yaml
agent: fullstack-developer
action: implement
per_service:
  - Listen for trigger event
  - Execute local transaction
  - Publish result event
  - Handle compensation trigger
```

## Phase 3: Implementation - Orchestration

### Step 3.1: Create Orchestrator
```yaml
agent: fullstack-developer
action: implement
components:
  - Saga definition (steps, compensations)
  - State machine
  - Step executor
  - Compensation executor
patterns:
  - Process Manager
  - State machine
```

### Step 3.2: Implement Saga State
```yaml
agent: fullstack-developer
action: implement
state_management:
  - Saga instance ID
  - Current step
  - Completed steps
  - Compensation state
  - Payload data
persistence:
  - Database
  - Event store
```

## Phase 4: Error Handling

### Step 4.1: Implement Retries
```yaml
agent: fullstack-developer
action: implement
retry_strategy:
  - Exponential backoff
  - Max retries
  - Idempotency keys
  - Dead letter handling
```

### Step 4.2: Implement Timeouts
```yaml
agent: fullstack-developer
action: implement
timeout_handling:
  - Per-step timeouts
  - Overall saga timeout
  - Timeout triggers compensation
```

### Step 4.3: Implement Compensation
```yaml
agent: fullstack-developer
action: implement
compensation_rules:
  - Execute in reverse order
  - Handle partial failures
  - Idempotent compensations
  - Report final status
```

## Phase 5: Testing

### Step 5.1: Unit Test Steps
```yaml
agent: tester
action: test
coverage:
  - Forward action success
  - Forward action failure
  - Compensation action
  - Idempotency
```

### Step 5.2: Integration Test Saga
```yaml
agent: tester
action: test
scenarios:
  - Happy path completion
  - Failure at each step
  - Timeout handling
  - Concurrent sagas
  - Recovery after crash
```

## Outputs
- [ ] Saga definition
- [ ] Orchestrator/event handlers
- [ ] Compensation logic
- [ ] State persistence
- [ ] Test suite

## Quality Gates
- All steps have compensations
- Idempotency verified
- Timeout handling tested
- State recovery works
- Concurrent execution safe
