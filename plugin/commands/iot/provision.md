---
description: Provision and configure IoT devices with secure fleet management
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <device type or fleet>
---

# 📡 IoT Provisioning: $ARGUMENTS

Provision IoT devices: **$ARGUMENTS**

## Agent
Uses **iot-engineer** agent for device provisioning.

## Provisioning Methods
- **Just-in-Time** - On first connect
- **Bulk** - Pre-registered devices
- **Fleet** - Template-based
- **Self** - Device-initiated
- **Claim** - Transfer ownership

## Security Components
- X.509 certificates
- Device identity
- Secure boot
- Hardware security modules
- Key rotation

## Platforms
- AWS IoT Core
- Azure IoT Hub
- Google Cloud IoT
- Custom MQTT brokers

## Workflow
1. **Template** - Define device config
2. **Certificates** - Generate/provision
3. **Registration** - Add to platform
4. **Configuration** - Apply settings
5. **Verification** - Test connectivity

## Device Lifecycle
- Manufacture → Provision → Operate → Update → Decommission

## Outputs
- Provisioning templates
- Certificate chain
- Device configuration
- Fleet policies
- Monitoring setup

## Progress
- [ ] Templates created
- [ ] Certificates generated
- [ ] Devices registered
- [ ] Configuration applied
- [ ] Connectivity verified

Include device attestation for security.
