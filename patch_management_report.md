# Research Report: The Importance of Patch Management

**OASIS INFOBYTE SIP Internship — Cyber Security**  
**Task 6 — Research Report: The Importance of Patch Management**

---

## 1. Introduction

Patch management is the structured process of identifying, prioritising, acquiring, testing, deploying, and verifying software and firmware updates across an organisation. Patches may fix security vulnerabilities, software defects, compatibility problems, or reliability issues.

NIST defines enterprise patch management as the process of identifying, prioritising, acquiring, installing, and verifying patches, updates, and upgrades throughout an organisation. NIST SP 800-40 Rev. 4 treats patching as preventive maintenance and a necessary operational activity for reducing security and business risk.

Patch management is closely connected to the vulnerability lifecycle:

1. A vulnerability is discovered.
2. The issue is analysed and, where appropriate, assigned a CVE identifier.
3. The vendor develops and releases a fix or mitigation.
4. Organisations assess whether they are affected and how risky the vulnerability is.
5. The patch is tested and deployed.
6. The organisation verifies that affected systems are actually protected.

A vulnerability therefore does not become safe simply because a patch exists. The organisation must know which assets are affected, prioritise the risk, deploy the fix, and verify the result.

---

## 2. Why Patches Matter

Unpatched software creates an avoidable attack surface. Attackers can use publicly documented vulnerabilities to obtain initial access, execute code, steal information, deploy ransomware, or move further through a network.

### 2.1 CVEs and vulnerability disclosure

The Common Vulnerabilities and Exposures (CVE) system provides standard identifiers for publicly known cybersecurity vulnerabilities. A CVE record helps organisations consistently track a vulnerability across security tools, vendors, advisories, and remediation processes.

However, not every CVE represents the same practical risk. Patch prioritisation should consider factors such as:

- Whether the vulnerability is actively exploited.
- Severity and technical impact.
- Whether exploitation is remotely possible.
- Exposure of the affected asset to the internet.
- Importance of the affected system or data.
- Availability of compensating controls.
- Availability and maturity of the vendor patch.

CISA's Known Exploited Vulnerabilities (KEV) Catalog is particularly useful for prioritisation because it focuses on vulnerabilities known to have been exploited in the wild.

### 2.2 Real-world case study: WannaCry and EternalBlue

The May 2017 WannaCry ransomware outbreak demonstrated how dangerous delayed patching can be.

Microsoft had released security update **MS17-010** on March 14, 2017 to address vulnerabilities in SMB. WannaCry later used the EternalBlue exploit against vulnerable Windows systems. Microsoft reported that the ransomware affected computers that had not applied the available security update.

The outbreak spread rapidly. UK government reporting described the incident as affecting around 300,000 computers in 150 countries, while the UK's National Cyber Security Centre reported more than 230,000 infected computers globally. In England, at least 34% of NHS trusts were disrupted.

The key lesson is that a patch being available does not automatically protect an organisation. Assets must be identified, the patch must reach them, and deployment must be verified.

**Lesson:** A known vulnerability with an available security update can remain a serious risk when organisations delay deployment, operate unsupported systems, or lack accurate asset inventories.

### 2.3 Real-world case study: Equifax breach

The 2017 Equifax breach is another major example of patch-management failure.

The vulnerability involved **Apache Struts**. Equifax received a security notification in March 2017, but the vulnerable system was not successfully identified and patched. A U.S. Government Accountability Office investigation found that the vulnerability remained on the online dispute portal and attackers later used it to gain access to sensitive information.

The breach exposed personal information belonging to at least **145.5 million individuals**.

The incident demonstrates that patch management is not only about installing updates. Effective patching also requires:

- Accurate asset inventory.
- Reliable communication of security advisories.
- Clear ownership of systems.
- Vulnerability scanning.
- Verification after deployment.
- Monitoring for failed or missed patches.

**Lesson:** A patching policy is ineffective if an organisation cannot reliably determine which systems require the patch and confirm that remediation actually occurred.

---

## 3. Consequences of Not Patching

Failure to patch can result in several categories of organisational harm.

### 3.1 Data breaches

Attackers may exploit vulnerabilities to access databases, credentials, personal information, intellectual property, or other sensitive data.

### 3.2 Ransomware and operational disruption

Wormable vulnerabilities can allow malware to spread automatically between vulnerable systems. WannaCry demonstrated how an unpatched vulnerability could disrupt healthcare and other organisations at scale.

### 3.3 Compliance and regulatory exposure

Organisations handling regulated information may have security and vulnerability-management obligations. A failure to apply reasonable security controls can contribute to regulatory findings, contractual consequences, or legal exposure.

### 3.4 Financial impact

A security incident can create costs for investigation, incident response, system restoration, legal support, customer notification, lost productivity, and reputational damage.

### 3.5 Loss of availability and business continuity

Critical applications may become unavailable during an attack or emergency remediation effort. Even when data is not stolen, downtime can affect customers, employees, and business operations.

### Statistics and evidence

- The Equifax breach exposed personal information of at least **145.5 million people**, according to the U.S. Government Accountability Office.
- WannaCry affected **hundreds of thousands of computers across more than 150 countries** according to U.S. and UK government reporting.
- The UK government reported that at least **34% of NHS trusts in England were disrupted** during the WannaCry incident.

These cases show why patch management should be treated as an ongoing security and operational process rather than an occasional IT maintenance task.

---

## 4. Patch Management Lifecycle

An effective patching programme can be organised into five practical phases.

### Phase 1 — Discovery

**Goal:** Determine what assets and software exist.

Activities include:

- Maintain an inventory of servers, workstations, network devices, applications, cloud workloads, and firmware.
- Record operating-system and application versions.
- Identify asset owners and business criticality.
- Detect unknown or unmanaged devices.
- Map software to the systems on which it is installed.

**Why it matters:** An organisation cannot patch an asset it does not know exists.

---

### Phase 2 — Assessment

**Goal:** Determine which vulnerabilities and patches require priority.

Activities include:

- Review vendor security advisories.
- Track CVEs affecting deployed software.
- Check CISA's Known Exploited Vulnerabilities Catalog.
- Consider severity and exploitability.
- Determine whether affected systems are internet-facing.
- Consider business criticality and data sensitivity.
- Identify temporary compensating controls when immediate patching is not possible.

**Output:** A prioritised remediation queue.

---

### Phase 3 — Testing

**Goal:** Reduce the risk that a patch will break an important service.

Activities include:

- Test patches on representative systems.
- Check application compatibility.
- Verify integrations and dependencies.
- Test backup and rollback procedures.
- Use a staged or pilot deployment for critical environments.
- Document exceptions where testing cannot be completed before emergency deployment.

Testing should reduce operational risk without becoming an excuse for indefinite patch delays.

---

### Phase 4 — Deployment

**Goal:** Install approved patches on affected systems.

Activities include:

- Schedule routine maintenance windows.
- Use centralised patch-management tools where appropriate.
- Prioritise actively exploited and internet-facing vulnerabilities.
- Deploy emergency patches using an expedited process when necessary.
- Record deployment success and failure.
- Escalate systems that repeatedly fail to patch.

For unsupported or legacy systems, organisations should consider isolation, compensating controls, replacement, or decommissioning.

---

### Phase 5 — Verification

**Goal:** Confirm that the vulnerability has actually been remediated.

Activities include:

- Confirm the installed software or patch version.
- Re-scan systems for the vulnerability.
- Review patch-management logs.
- Check for failed deployments.
- Confirm that critical services still operate correctly.
- Update the asset/vulnerability inventory.
- Produce metrics showing remediation progress.

Verification closes the loop. Without it, an organisation may incorrectly assume that a patch was successfully deployed.

---

## 5. Prioritised 7-Step Patch Management Checklist

### 1. Maintain a complete asset inventory — Critical priority

Know which hardware, operating systems, applications, cloud workloads, and firmware are present.

### 2. Continuously identify vulnerabilities — Critical priority

Monitor vendor advisories, CVEs, vulnerability scanners, and CISA KEV entries.

### 3. Prioritise based on real risk — Critical priority

Prioritise actively exploited vulnerabilities, internet-facing assets, critical systems, and high-impact vulnerabilities.

### 4. Test patches appropriately — High priority

Use representative test systems, compatibility checks, backups, and rollback procedures.

### 5. Deploy through a controlled process — High priority

Use automated or centrally managed deployment where possible, with emergency procedures for critical vulnerabilities.

### 6. Verify remediation — Critical priority

Re-scan systems, confirm versions, investigate failures, and make sure the vulnerable component is actually fixed.

### 7. Measure and improve — High priority

Track patch latency, coverage, failed deployments, exceptions, and the number of overdue critical vulnerabilities. Use these metrics to improve the programme.

---

## 6. Challenges Organisations Face

### Challenge 1: Legacy systems

Older applications or devices may no longer receive vendor support.

**Solution:** Create a replacement plan. Until replacement is possible, isolate legacy assets, restrict access, apply compensating controls, and monitor them closely.

### Challenge 2: Downtime concerns

Business teams may fear that patching will interrupt critical operations.

**Solution:** Use maintenance windows, redundancy, staged deployments, testing, and rollback plans. Emergency vulnerabilities should have an accelerated process.

### Challenge 3: Incomplete asset inventory

Unknown or unmanaged devices can remain vulnerable.

**Solution:** Combine asset discovery, endpoint management, network discovery, vulnerability scanning, and ownership records.

### Challenge 4: Failed or incomplete deployment

A patch may fail because of connectivity problems, incompatible software, insufficient disk space, or configuration differences.

**Solution:** Monitor deployment results, automatically retry where appropriate, and create an exception/escalation process for persistent failures.

### Challenge 5: Patch volume and prioritisation

Security teams may receive more vulnerability information than they can immediately remediate.

**Solution:** Prioritise based on exploitation, exposure, asset criticality, severity, and available mitigations instead of treating every vulnerability identically.

### Challenge 6: Third-party dependencies

Applications can depend on libraries, frameworks, plugins, or vendor-managed components.

**Solution:** Maintain a software inventory and define security responsibilities with vendors and service providers.

---

## 7. Recommended Organisational Patch Policy

A practical organisational policy should establish:

- **Asset ownership:** Every important system has a responsible owner.
- **Risk-based SLAs:** Critical and actively exploited vulnerabilities receive the fastest remediation.
- **Emergency patching:** A defined process exists for zero-day and actively exploited vulnerabilities.
- **Testing requirements:** Critical patches are tested appropriately before broad deployment when time permits.
- **Verification:** Patches are validated through endpoint data, vulnerability scans, or both.
- **Exception management:** Delays require documented justification, an owner, an expiry date, and compensating controls.
- **Metrics:** Management receives regular reports on patch coverage and overdue vulnerabilities.

---

## 8. Conclusion

Patch management is a fundamental cybersecurity control because it reduces exposure to vulnerabilities that attackers may already know how to exploit.

The WannaCry outbreak showed how quickly an available security patch can become a major security issue when vulnerable systems remain unpatched. The Equifax breach showed that even when an organisation receives a vulnerability notification, weak asset identification, communication, scanning, and verification can allow a vulnerable system to remain exposed.

A mature patch-management programme therefore goes beyond simply clicking “Update.” It requires accurate asset discovery, risk-based assessment, appropriate testing, controlled deployment, and verification.

The most important principle is simple:

> **A patch is only useful when it is successfully applied to every affected asset that needs it and the organisation verifies the result.**

---

## 9. References

1. National Institute of Standards and Technology (NIST). **SP 800-40 Rev. 4 — Guide to Enterprise Patch Management Planning: Preventive Maintenance for Technology.** 2022.  
   https://csrc.nist.gov/pubs/sp/800/40/r4/final

2. NIST. **Guide to Enterprise Patch Management Planning: Preventive Maintenance for Technology.**  
   https://www.nist.gov/publications/guide-enterprise-patch-management-planning-preventive-maintenance-technology

3. Cybersecurity and Infrastructure Security Agency (CISA). **Known Exploited Vulnerabilities Catalog.**  
   https://www.cisa.gov/known-exploited-vulnerabilities-catalog

4. Microsoft Security. **WannaCrypt ransomware worm targets out-of-date systems.** May 2017.  
   https://www.microsoft.com/en-us/security/blog/2017/05/12/wannacrypt-ransomware-worm-targets-out-of-date-systems/

5. National Cyber Security Centre (NCSC). **Ransomware: 'WannaCry' guidance for home users and small businesses.**  
   https://www.ncsc.gov.uk/guidance/wannacry-guidance-for-home-users-and-small-businesses

6. Government Accountability Office (GAO). **Data Protection: Actions Taken by Equifax and Federal Agencies in Response to the 2017 Breach. GAO-18-559.**  
   https://www.gao.gov/products/gao-18-559

7. Government of the United Kingdom. **A cyber resilient health and adult social care system in England: cyber security strategy to 2030 — WannaCry case study.**  
   https://www.gov.uk/government/publications/cyber-security-strategy-for-health-and-social-care-2023-to-2030/

8. MITRE. **Common Vulnerabilities and Exposures (CVE) / CVE Program.**  
   https://www.cve.org/

---

## 10. Task 6 Completion Checklist

- [x] Report saved as `patch_management_report.md`
- [x] Introduction and vulnerability lifecycle explained
- [x] CVEs and vulnerability prioritisation explained
- [x] WannaCry/EternalBlue case study included
- [x] Equifax/Apache Struts case study included
- [x] Consequences and statistics included
- [x] Five-phase patch management lifecycle explained
- [x] Prioritised 7-step checklist included
- [x] Common patching challenges and solutions included
- [x] References include more than 4 credible sources
- [x] No demo video required
