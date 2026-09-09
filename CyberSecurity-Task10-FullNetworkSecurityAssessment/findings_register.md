
# Findings Register

| Finding ID | Description | Severity | Affected Asset | Recommended Fix |
|---|---|---|---|---|
| F-001 | HTTP traffic was observed in the network capture, indicating that some application traffic is being transmitted without transport encryption. | Medium | 192.168.64.4 / Observed HTTP service | Prefer HTTPS/TLS for application traffic and disable unnecessary plaintext HTTP where possible. |
| F-002 | ARP traffic was observed during the assessment. ARP is inherently unauthenticated and can be susceptible to spoofing on a local network. | Low | Local network / 192.168.64.0/24 | Use network segmentation and appropriate switch protections such as Dynamic ARP Inspection where supported. |
| F-003 | DNS queries were observed in the captured traffic. DNS traffic should be reviewed to ensure that sensitive information is not exposed through query contents and that trusted DNS infrastructure is used. | Low | Local network / DNS traffic | Use trusted DNS resolvers and consider encrypted DNS where appropriate; monitor for anomalous DNS activity. |
| F-004 | The Nmap assessment identified the target host but did not identify responsive open TCP ports among the scanned 1000 ports. This is a positive security observation, but filtered ports should still be reviewed against the intended firewall policy. | Info | 192.168.64.4 | Confirm that firewall rules intentionally restrict unnecessary inbound services and periodically review exposed services. |

## Severity Methodology

Severity ratings are based on the observed impact and exposure during this limited local-network assessment. 
They are qualitative and should be refined using CVSS where sufficient technical information is available.

## Evidence

- Nmap results: `nmap_results.txt`
- Nmap discovery: `nmap_discovery.txt`
- Network capture: `wireshark_capture.pcapng`
