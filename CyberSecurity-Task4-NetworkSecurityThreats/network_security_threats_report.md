# OASIS INFOBYTE SIP — Cyber Security Task 4
## Research Report: Common Network Security Threats

**Task:** Task 4 — Research Report: Common Network Security Threats  
**Track:** Cyber Security  
**Format:** Markdown  
**Repository filename:** `network_security_threats_report.md`

---

## 1. Introduction

Network security threats matter because modern organisations depend on connected systems for communication, business operations, cloud services, customer access, and critical infrastructure. Attacks against network availability, traffic integrity, identity, or name-resolution services can interrupt operations, expose information, redirect users, or undermine trust in legitimate systems. Effective network security therefore requires layered controls that reduce exposure, detect abnormal activity, protect communications, and provide resilient recovery mechanisms.

## 2. Denial-of-Service (DoS) and Distributed Denial-of-Service (DDoS)

### 2.1 How the attack works

A Denial-of-Service attack attempts to make a service unavailable by exhausting a target's network bandwidth, processing capacity, connection resources, or application resources.

A Distributed Denial-of-Service attack uses many systems or devices at the same time. These systems may be compromised devices in a botnet or other distributed sources. Reflection and amplification techniques can also cause third-party systems to send large amounts of traffic toward the victim.

### 2.2 Real-world example — Dyn DNS attack (2016)

In October 2016, the DNS provider Dyn suffered a major DDoS attack associated with the Mirai malware. Compromised IoT devices such as cameras and other connected equipment were used as part of the attack traffic. The incident disrupted access to a number of major Internet services and websites.

**Impact:** The incident demonstrated how insecure IoT devices can be combined into large botnets and how an attack against an important DNS provider can create downstream availability problems for many unrelated services.

### 2.3 Mitigation strategies

1. **DDoS protection and traffic filtering:** Use upstream DDoS mitigation services, firewalls, filtering, and rate controls to absorb or block malicious traffic.
2. **Network resilience and redundancy:** Use redundant services, capacity planning, failover, and distributed infrastructure so one overloaded component does not become a single point of failure.
3. **Monitoring and incident response:** Continuously monitor traffic patterns and maintain an incident-response plan with ISP/cloud-provider contacts and predefined mitigation actions.

CISA recommends understanding the nature of the attack, using packet captures and logs where appropriate, coordinating with service providers, and applying filtering and other mitigation controls. NIST also identifies source-address validation and related routing controls as important measures against spoofed traffic and DDoS.

---

## 3. Man-in-the-Middle (MITM) Attacks

### 3.1 How the attack works

A Man-in-the-Middle attack occurs when an attacker secretly places themselves between two communicating parties. Instead of communicating directly, traffic passes through the attacker, who may observe, modify, redirect, or selectively block the communication.

MITM attacks are especially dangerous when authentication and encryption are weak or incorrectly implemented.

### 3.2 Real-world example — Lenovo Superfish (2015)

In 2015, Lenovo's Superfish software on some consumer notebooks installed a trusted root certificate and intercepted HTTPS traffic. The software could decrypt and re-encrypt traffic, effectively acting as a man-in-the-middle. The U.S. Federal Trade Commission later described how the software undermined protections normally provided by HTTPS.

**Impact:** Sensitive information transmitted through affected HTTPS connections could be exposed to interception, while users could receive no normal browser warning that the connection was being tampered with.

### 3.3 Mitigation strategies

1. **Use properly configured HTTPS/TLS:** Encrypt sensitive communications and validate certificates correctly.
2. **Use secure network access:** Prefer trusted networks, VPNs where appropriate, and strong Wi-Fi security; avoid transmitting sensitive information over untrusted networks without protection.
3. **Disable insecure local protocols and monitor for MITM indicators:** Reduce protocols such as LLMNR where they are unnecessary, segment networks, and monitor suspicious ARP/DNS behavior.

---

## 4. IP Spoofing

### 4.1 How the attack works

IP spoofing occurs when an attacker sends network traffic using a forged source IP address. The receiving system may therefore believe that traffic originated from another host.

Spoofing is particularly useful in attacks where the attacker does not need to receive the response. It is commonly associated with reflection/amplification DDoS attacks and can also undermine controls that incorrectly trust source addresses.

### 4.2 Real-world example — spoofing in DDoS/reflection attacks

NIST documents IP address spoofing as a major component of many DDoS and reflection/amplification attacks. Attackers can forge source addresses so that intermediary services send responses toward the victim while obscuring the true origin of the attack traffic.

**Impact:** Spoofing can increase the scale of DDoS attacks, make attribution more difficult, and cause organisations or public services to receive malicious traffic that appears to originate from legitimate-looking addresses.

### 4.3 Mitigation strategies

1. **Source-address validation:** Apply ingress and egress filtering to prevent packets with invalid source addresses from entering or leaving networks.
2. **Do not trust source IP alone:** Use stronger authentication and authorisation controls rather than treating an IP address as proof of identity.
3. **Rate limiting and network monitoring:** Monitor abnormal traffic patterns, apply rate limits, and coordinate with upstream providers during large-scale attacks.

NIST recommends source-address validation approaches such as access-control lists and unicast Reverse Path Forwarding, along with other routing and DDoS mitigation mechanisms.

---

## 5. DNS Poisoning / DNS Spoofing

### 5.1 How the attack works

DNS poisoning, also called DNS cache poisoning, involves causing a DNS resolver or other DNS infrastructure to store or return false DNS information. A victim requesting a legitimate domain may then be directed to an attacker-controlled destination.

This can support phishing, malware delivery, traffic interception, or service disruption.

### 5.2 Real-world example — DNS cache poisoning

DNS cache poisoning has been a long-standing Internet security concern. The Kaminsky DNS cache-poisoning research demonstrated how forged DNS responses could be used to poison recursive resolver caches under vulnerable conditions. ICANN describes cache poisoning as inserting fraudulent DNS data into a resolver's cache so subsequent users can be directed to malicious destinations.

### 5.3 Mitigation strategies

1. **Deploy DNSSEC:** DNSSEC provides cryptographic validation of DNS data authenticity and integrity.
2. **Harden DNS infrastructure:** Keep DNS software updated, restrict administrative access, use secure configurations, and monitor DNS logs.
3. **Use protective/encrypted DNS where appropriate:** Use trusted recursive resolvers and appropriate encrypted DNS technologies to reduce exposure and improve confidentiality of DNS queries.

NIST's current Secure Domain Name System Deployment Guide (SP 800-81 Rev. 3, published March 2026) provides guidance for protecting DNS integrity, authenticity, confidentiality, and availability.

---

## 6. Comparison Table

| Threat | Attack Vector | Who Is at Risk? | Difficulty to Execute | Ease of Mitigation |
|---|---|---|---|---|
| DoS/DDoS | Flooding, resource exhaustion, reflection/amplification | Websites, APIs, DNS providers, network services, organisations | Medium to High depending on scale | Medium |
| MITM | Interception of traffic through compromised/trusted network position or weak authentication | Users, organisations, applications, Wi-Fi users | Medium | Medium |
| IP Spoofing | Forged source IP addresses | Networks, services, DDoS targets, systems trusting IP identity | Low to Medium for some uses | Medium |
| DNS Poisoning/Spoofing | Forged or manipulated DNS responses/records | DNS users, domains, applications, organisations | Medium | Medium to High with DNSSEC and hardened DNS |

**Note:** Difficulty and mitigation ratings are qualitative. They depend heavily on network architecture, attacker capability, available controls, and the target's exposure.

---

## 7. Conclusion — Three Key Takeaways for a Network Administrator

1. **Use layered security controls.** No single firewall, protocol, or security product can prevent every network attack. Combine segmentation, encryption, authentication, filtering, monitoring, and resilient architecture.
2. **Protect trust mechanisms.** DNS, IP addressing, certificates, and network identity are foundational services. If attackers can manipulate these mechanisms, they can redirect traffic, impersonate systems, or hide attack traffic.
3. **Prepare before an incident occurs.** Logging, monitoring, tested incident-response procedures, provider contacts, backups, and recovery plans reduce the impact of attacks such as DDoS and network interception.

---

## 8. References

1. **NIST — Secure Domain Name System (DNS) Deployment Guide, SP 800-81 Rev. 3 (2026)**  
   https://csrc.nist.gov/pubs/sp/800/81/r3/final

2. **NIST — Resilient Interdomain Traffic Exchange: BGP Security and DDoS Mitigation, SP 800-189**  
   https://www.nist.gov/publications/resilient-interdomain-traffic-exchange-bgp-security-and-ddos-mitigation

3. **CISA/FBI/MS-ISAC — Understanding and Responding to Distributed Denial-of-Service Attacks**  
   https://www.cisa.gov/sites/default/files/publications/understanding-and-responding-to-ddos-attacks_508c.pdf

4. **CISA — UDP-Based Amplification Attacks**  
   https://www.cisa.gov/ncas/alerts/ta14-017a

5. **Lenovo — SuperFish Vulnerability / Security Advisory LEN-2015-010**  
   https://support.lenovo.com/ie/en/product_security/ps500035-superfish

6. **Federal Trade Commission — Lessons from FTC's Lenovo case: Pay attention to the man in the middle**  
   https://search.ftc.gov/business-guidance/blog/2017/09/lessons-ftcs-lenovo-case-pay-attention-man-middle

7. **ICANN — Cache Poisoning Attack Definition**  
   https://www.icann.org/en/icann-acronyms-and-terms/cache-poisoning-attack-en

8. **Cloudflare — What is DNS cache poisoning? / DNS spoofing**  
   https://www.cloudflare.com/learning/dns/dns-cache-poisoning/

9. **Cloudflare — Famous DDoS attacks (Dyn/Mirai example)**  
   https://www.cloudflare.com/en-in/learning/ddos/famous-ddos-attacks/

---

## 9. Task Checklist

- [x] Report filename: `network_security_threats_report.md`
- [x] Introduction
- [x] DoS/DDoS explanation
- [x] DoS/DDoS real-world example
- [x] DoS/DDoS impact
- [x] 3 DoS/DDoS mitigation strategies
- [x] MITM explanation
- [x] MITM real-world example
- [x] MITM impact
- [x] 3 MITM mitigation strategies
- [x] IP Spoofing explanation
- [x] IP Spoofing real-world example
- [x] IP Spoofing impact
- [x] 3 IP Spoofing mitigation strategies
- [x] DNS Poisoning/Spoofing explanation
- [x] DNS Poisoning/Spoofing real-world example
- [x] DNS Poisoning/Spoofing impact
- [x] 3 DNS Poisoning/Spoofing mitigation strategies
- [x] Comparison table
- [x] 3 key takeaways
- [x] 4+ credible references
