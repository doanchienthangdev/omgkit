---
description: Design and configure SRE observability dashboards with SLI/SLO tracking
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <service or system>
---

# 📊 SRE Dashboard: $ARGUMENTS

Design observability dashboard for: **$ARGUMENTS**

## Agent
Uses **site-reliability-engineer** agent for dashboard design.

## Dashboard Components
- **SLI/SLO Tracking** - Error budgets, burn rates
- **Service Health** - Availability, latency
- **Infrastructure** - Resources, capacity
- **Incidents** - Alerts, MTTR tracking
- **Dependencies** - Service map, health

## Metrics Framework
- **RED** - Rate, Errors, Duration
- **USE** - Utilization, Saturation, Errors
- **Four Golden Signals** - Latency, Traffic, Errors, Saturation

## Tools
- Grafana dashboards
- Prometheus queries (PromQL)
- Datadog/New Relic
- Custom metrics exporters

## Workflow
1. **Requirements** - Define SLIs/SLOs
2. **Data Sources** - Configure metrics
3. **Design** - Layout panels
4. **Alerts** - Set thresholds
5. **Documentation** - Runbooks

## Outputs
- Dashboard JSON/YAML
- PromQL queries
- Alert rules
- SLO documentation
- Runbook templates

## Progress
- [ ] SLIs defined
- [ ] Data sources configured
- [ ] Dashboard designed
- [ ] Alerts configured
- [ ] Runbooks created

Include error budget burn rate alerts.
