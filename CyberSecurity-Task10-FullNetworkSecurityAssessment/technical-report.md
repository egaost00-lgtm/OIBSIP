# Full Network Security Assessment – Technical Report

## 1. Executive Summary

This report documents a controlled network security assessment performed against an authorized local test host within a private lab environment.

The assessment focused on network reconnaissance, traffic observation, and identification of potential security exposures. Testing was performed using Nmap and Wireshark, with supporting evidence retained for documentation and review.

The assessment identified observable network traffic including HTTP, ARP, and DNS activity. The Nmap assessment did not identify any responsive open TCP ports on the target during the documented scan.

No exploitation or destructive testing was performed.

---

## 2. Assessment Scope

### Target

- Target IP: `192.168.64.4`
- Network: `192.168.64.0/24`
- Assessment Type: Local test-network security assessment
- Assessment Date: 19 August 2026

### Scope Limitation

Testing was limited to the identified authorized local test host and the network traffic available within the assessment environment.

No external systems were intentionally targeted.

---

## 3. Objectives

The objectives of this assessment were:

1. Identify the target host and confirm network reachability.
2. Perform network reconnaissance using Nmap.
3. Determine whether TCP services were externally reachable from the assessment system.
4. Observe network traffic using Wireshark.
5. Identify relevant protocols and potential security observations.
6. Document findings and supporting evidence.
7. Provide recommendations for improving network security.

---

## 4. Tools Used

### Nmap

Nmap 7.99 was used for network reconnaissance and TCP port assessment.

### Wireshark

Wireshark 4.6.6 was used to inspect and document captured network traffic.

### GNU/Linux

Assessment environment:

- Kali Linux
- Linux kernel 6.19.14+kali-arm64

---

## 5. Methodology

The assessment followed a controlled and non-destructive methodology:

1. Confirm the target IP address.
2. Perform network reconnaissance.
3. Conduct TCP port assessment.
4. Review Nmap output.
5. Capture and inspect network traffic.
6. Identify observable protocols.
7. Record findings in the findings register.
8. Prepare the technical report.
9. Preserve supporting evidence.

The assessment did not include password attacks, exploitation, persistence, privilege escalation, or denial-of-service activity.

---

## 6. Nmap Assessment Results

The documented Nmap scan identified the target host as reachable:

`192.168.64.4`

The host responded with approximately `0.000094s` latency.

The scan examined the default 1000 TCP ports.

### Result

- Host status: Up
- Ports scanned: 1000 TCP ports
- Open TCP ports identified: None
- Filtered TCP ports: 1000
- Network distance: 0 hops

The Nmap output reported:

> Not shown: 1000 filtered tcp ports (no-response)

The result indicates that the scanned TCP ports did not provide a response that allowed Nmap to classify them as open.

This result should not be interpreted as proof that the host contains no services. Firewall rules, packet filtering, host configuration, and network controls may prevent responses from reaching the scanner.

---

## 7. Network Traffic Analysis

A network traffic capture was retained as supporting evidence:

`wireshark_capture.pcapng`

The capture file size was approximately 50.4 MiB.

The traffic review identified the following protocols or traffic types as relevant observations:

- HTTP traffic
- ARP traffic
- DNS queries
- Other normal network traffic associated with the assessment environment

These observations were recorded in the findings register.

---

# 8. Findings

## F-001 – HTTP Traffic Observed

### Description

HTTP traffic was observed within the network capture.

### Severity

Informational / Low

### Affected Asset

`192.168.64.4` / local test network

### Evidence

- `wireshark_capture.pcapng`

### Security Impact

HTTP is an unencrypted application-layer protocol. Where sensitive information is transmitted over HTTP, traffic may potentially be observed by an attacker with appropriate network access.

### Recommended Fix

Where applicable, replace HTTP services with HTTPS using properly configured TLS.

Sensitive credentials, session tokens, and confidential information should not be transmitted over unencrypted HTTP.

---

## F-002 – ARP Traffic Observed

### Description

ARP traffic was observed during the assessment.

### Severity

Informational / Low

### Affected Asset

Local test network

### Evidence

- `wireshark_capture.pcapng`

### Security Impact

ARP is fundamental to IPv4 local-network communication. However, ARP does not inherently provide authentication, making ARP-based spoofing or poisoning a potential concern on networks where an attacker gains local access.

### Recommended Fix

Use appropriate network segmentation and switch security controls where applicable. Monitor for abnormal ARP activity and consider protections such as Dynamic ARP Inspection on supported network infrastructure.

---

## F-003 – DNS Queries Observed

### Description

DNS query traffic was observed within the captured network traffic.

### Severity

Informational / Low

### Affected Asset

Local test network

### Evidence

- `wireshark_capture.pcapng`

### Security Impact

Traditional DNS traffic may be observable by parties with suitable network visibility. DNS exposure can reveal information about requested domains and network activity.

### Recommended Fix

Where supported by the environment, consider secure DNS mechanisms such as DNS over TLS or DNS over HTTPS, while maintaining appropriate enterprise DNS monitoring and policy controls.

---

## F-004 – Nmap Assessment Identified the Target Host

### Description

The Nmap assessment identified the authorized target host at 192.168.64.4 during the local network security assessment. The host was confirmed as reachable within the assessment environment. The assessment was limited to identification and observation activities and did not involve destructive exploitation.
The Nmap assessment successfully identified the target host as reachable at:

`192.168.64.4`

The scan did not identify responsive open TCP ports among the 1000 default TCP ports tested.

### Severity

Informational

### Affected Asset

`192.168.64.4`

### Evidence

- `nmap_results.txt`
- `nmap_discovery.txt`

### Security Impact

Host discovery confirms that the system is reachable from the assessment environment. Although no open TCP ports were identified during this scan, host visibility itself is useful information to an attacker performing reconnaissance.

### Recommended Fix

Maintain appropriate firewall rules, network segmentation, access controls, and monitoring. Expose only services that are required for legitimate operations.

---

# 9. Risk Summary

| Finding | Severity | Status |
|---|---|---|
| F-001 – HTTP traffic observed | Low | Review |
| F-002 – ARP traffic observed | Low | Review |
| F-003 – DNS queries observed | Low | Review |
| F-004 – Host identified by reconnaissance | Informational | Review |

No high or critical vulnerabilities were established by the documented testing.

The findings represent observations from the controlled assessment and should be validated against the actual configuration and security requirements of the environment.

---

# 10. Recommendations

1. Prefer HTTPS over HTTP for web applications.
2. Protect sensitive application data using encryption in transit.
3. Maintain host-based and network firewalls.
4. Review local network segmentation.
5. Monitor for abnormal ARP activity.
6. Review DNS security and monitoring requirements.
7. Minimize unnecessary network exposure.
8. Regularly review externally reachable services.
9. Keep operating systems and network services updated.
10. Retain security assessment evidence for future comparison.

---


## 11. Evidence Files

The following evidence was retained during the assessment:

- nmap_results.txt
- nmap_discovery.txt
- findings_register.md
- wireshark_capture.pcapng
- technical-report.md

These files should be retained together as the assessment evidence set.

---

# 12. Assessment Limitations

This assessment was limited to the authorized local test environment and the techniques documented in this report.

The absence of identified open TCP ports does not guarantee that the target is free of vulnerabilities.

No claim of complete security can be made from this assessment alone.

Additional testing may be required for:

- UDP services
- Web application security
- Authentication controls
- Host configuration
- Vulnerability-specific validation
- Privilege escalation
- Wireless security
- Application-layer security

---

# 13. Conclusion

The controlled network security assessment successfully confirmed connectivity to the target host and documented the observable network environment.

Nmap identified the target host but did not identify responsive open TCP ports among the 1000 default TCP ports assessed. Wireshark provided supporting evidence of HTTP, ARP, and DNS traffic.

The identified observations are primarily informational or low severity and should be addressed according to the requirements of the environment.

All testing was performed in a controlled and authorized local assessment environment without destructive activity.

---

## Assessment Evidence

Target: `192.168.64.4`

Assessment Type: Local Network Security Assessment

Date: 19 August 2026

Prepared using:

- Nmap 7.99
- Wireshark 4.6.6
- Kali Linux

**End of Report**

## F-004 — Nmap Assessment Identified the Target Host

### Description

The Nmap assessment identified the authorized target host at 192.168.64.4 during the local network security assessment. The host was confirmed as reachable within the assessment environment. The assessment was limited to identification and observation activities and did not involve destructive exploitation.

### Severity

Informational

### Affected Asset

192.168.64.4

### Evidence

- nmap_results.txt
- nmap_discovery.txt

### Security Impact

Host identification confirms the presence of the target system within the authorized local assessment network. This information supports network inventory and security validation but does not by itself indicate a security vulnerability.

### Recommended Fix

Maintain an accurate asset inventory and regularly review network exposure. Ensure only authorized systems are connected to the assessment network and apply appropriate firewall and network segmentation controls.

---
