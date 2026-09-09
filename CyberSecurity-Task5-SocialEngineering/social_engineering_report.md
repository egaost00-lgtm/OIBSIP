# OASIS INFOBYTE SIP — Cyber Security Task 5

## Research Report: Social Engineering Attacks

**Task:** Cyber Security Task 5  
**Report filename:** `social_engineering_report.md`  
**Focus:** Phishing, Pretexting, Baiting, and Quid Pro Quo

---

## 1. Introduction

Social engineering is the use of deception, impersonation, manipulation, or psychological pressure to persuade people to reveal information, grant access, or perform actions that benefit an attacker. NIST defines social engineering as an attempt to trick someone into revealing information such as a password that can be used to attack systems or networks. It is considered highly effective because it targets human trust and decision-making rather than relying only on technical vulnerabilities. Attackers can exploit urgency, authority, fear, curiosity, helpfulness, or the expectation of a reward. CISA also identifies phishing as a form of social engineering in which attackers pose as trusted colleagues, acquaintances, or organizations to obtain sensitive information or network access.

## 2. Phishing

### 2.1 What is Phishing?

Phishing is a social engineering technique in which an attacker impersonates a trustworthy person, organization, or service to persuade a victim to click a malicious link, open an attachment, provide credentials, transfer information, or otherwise perform an unsafe action.

CISA describes phishing as a form of social engineering delivered through channels such as email, text messages, and phone calls. Successful phishing can lead to data breaches, identity fraud, malware infection, ransomware, or unauthorized network access.

### 2.2 Major Types of Phishing

#### Spear Phishing

Spear phishing is targeted phishing directed at a particular person or small group. The attacker researches the victim and uses relevant details such as their name, job role, organization, projects, or coworkers to make the message more convincing.

#### Whaling

Whaling targets high-value individuals such as executives, senior managers, finance officers, or administrators. The attacker may impersonate a senior executive or trusted business partner and request sensitive information, payment, credentials, or urgent action.

#### Vishing

Vishing means voice phishing. The attacker uses a phone call or voice communication to impersonate a trusted person or organization. Common impersonations include IT support, bank representatives, company administrators, government officials, and service providers.

#### Smishing

Smishing is phishing delivered through SMS or other text messaging platforms. The attacker may claim that a package, bank account, payment, or online account requires immediate attention. A malicious link can lead to a fake login page, malware download, or credential-harvesting website.

### 2.3 How Phishing Works

1. **Target selection** — identify a person or organization.
2. **Information gathering** — collect relevant information from public profiles, company websites, social media, or previous breaches.
3. **Lure creation** — create an urgent and believable message or conversation.
4. **Delivery** — send it by email, SMS, social media, or voice.
5. **Victim interaction** — the victim clicks, opens, provides credentials, or performs the requested action.
6. **Exploitation** — the attacker uses the resulting information or access to steal data, compromise accounts, deploy malware, or move further into the organization.

### 2.4 Real-World Case Study: RSA SecurID Breach (2011)

In 2011, attackers compromised RSA after sending targeted phishing emails to employees at RSA's parent company, EMC. The emails contained a malicious Excel attachment presented as a recruitment-related document. At least one employee opened the attachment, allowing malware to exploit an Adobe Flash vulnerability and establish access to the victim's computer.

The attackers stole information related to RSA's SecurID authentication products. The incident later became significant because stolen information was used in subsequent attacks targeting organizations that relied on SecurID tokens.

**Impact:**
- Sensitive SecurID-related information was stolen.
- RSA faced significant security and reputational consequences.
- SecurID customers were subsequently targeted.
- The incident demonstrated how a low-level employee can become the entry point for a high-value attack.

Sources: WIRED and Dark Reading case reports.

### 2.5 Four Phishing Prevention Recommendations

1. **Enable strong MFA:** Use MFA for email, administrative accounts, VPNs, and other high-value systems; prefer phishing-resistant methods where practical.
2. **Verify unexpected requests independently:** Do not trust contact details or links supplied by the message. Contact the supposed sender through a known channel.
3. **Use email and endpoint security controls:** Deploy phishing filters, malicious-link protection, attachment scanning, endpoint security, and domain blocking.
4. **Conduct continuous security awareness training:** Teach employees to identify urgency, impersonation, suspicious links, unexpected attachments, and credential requests; use controlled simulations to improve awareness.

---

## 3. Pretexting

### 3.1 Definition

Pretexting is a social engineering technique in which an attacker creates a fabricated scenario and assumes a believable identity or role to persuade a victim to reveal information or perform an action.

MITRE CAPEC describes pretexting as creating an invented scenario and assuming an identity or role to persuade a target to release information or perform an action that benefits the adversary.

### 3.2 How an Attacker Builds a False Scenario

1. **Reconnaissance** — gather information about the victim, organization, job role, coworkers, vendors, or systems.
2. **Identity selection** — choose a believable role such as IT support, manager, vendor, bank employee, or coworker.
3. **Story construction** — create a plausible reason for the interaction.
4. **Trust building** — use known information, authority, urgency, or familiarity.
5. **Request** — ask for credentials, a password reset, MFA approval, sensitive data, payment, or another action.
6. **Exploitation** — use the obtained information or access.

### 3.3 Real-World Case Study: MGM Resorts Social Engineering Attack (2023)

In 2023, MGM Resorts suffered a major cyber incident that was widely reported as involving social engineering and impersonation of employees. Reporting described attackers using information about an employee and contacting the company's help desk. The social-engineering interaction was used to obtain access that contributed to the broader compromise.

The incident demonstrated the danger of help-desk and identity-verification processes. Even when strong technical security controls exist, an attacker who successfully convinces a support employee to reset credentials or MFA can bypass part of the organization's security boundary.

**Impact included:**
- Significant disruption to MGM's operations and systems.
- Problems affecting hotel and casino services.
- Financial and reputational consequences.
- Demonstration that identity-verification procedures are critical security controls.

### 3.4 Three Pretexting Prevention Measures

1. **Strong identity verification:** Help-desk employees should verify identity using independent, organization-approved methods before password or MFA resets.
2. **Separation of duties for sensitive actions:** High-risk actions such as privileged-account resets should require additional approval or verification.
3. **Train employees to resist authority and urgency:** Callers claiming to be executives, IT staff, or vendors must still pass verification; urgency should never override procedure.

---

## 4. Baiting

### 4.1 Definition

Baiting is a social engineering technique in which an attacker offers an enticing object, file, download, reward, or opportunity to persuade a victim to take an unsafe action.

Baiting can be:
- **Physical:** infected or unknown USB drives, CDs, or other removable media.
- **Digital:** fake free software, pirated media, fake downloads, promotional offers, or malicious files.

The U.S. Army Cyber Command describes baiting as leaving portable storage media in an open location to tempt a victim into examining it. Digital baiting can similarly use attractive downloads or offers to encourage unsafe interaction.

### 4.2 Physical Baiting Example

A common USB baiting scenario is:
1. An attacker leaves an unknown USB drive where employees will find it.
2. The drive is labelled or positioned to make it look interesting or important.
3. A curious or helpful employee connects it to a computer.
4. A malicious file or device behavior may attempt to compromise the computer.
5. If the computer is connected to a business network, the compromise may create opportunities for further attacks.

### 4.3 Digital Baiting

Digital baiting may involve fake free software, fake document downloads, pirated media, fake coupons or rewards, malicious browser extensions, and fake security tools. The psychological hook is often curiosity, convenience, greed, or the expectation of receiving something valuable for free.

### 4.4 Case Study: University USB Drop Experiment

A 2016 IEEE Security and Privacy study titled **“Users Really Do Plug in USB Drives They Find”** investigated whether people would connect USB drives they found in public.

Researchers dropped **297 USB drives** on a university campus. The study found an estimated **45–98% success range**, depending on how success was defined. The first drive was connected in less than six minutes. Researchers also found that people often connected drives because they wanted to identify or return them to the owner.

The experiment used inert beacon files for research rather than real malware, so it did not create a real compromise. However, the results demonstrated how effective the human component of USB baiting can be.

### 4.5 Three Baiting Prevention Measures

1. **Never connect unknown removable media:** Hand found USB devices to IT/security or lost-and-found instead of connecting them to a computer.
2. **Use endpoint device controls:** Restrict or control removable media and disable automatic execution features.
3. **Train employees about curiosity-based attacks:** Security awareness training should explicitly explain USB baiting and fake-download attacks.

---

## 5. Quid Pro Quo (Bonus)

Quid pro quo is a social engineering technique based on an exchange: the attacker offers a benefit or service in return for information or access.

Examples include a fake IT technician offering to fix an employee's computer in exchange for credentials, a fake researcher offering a reward for a survey containing sensitive information, or a fraudulent support representative promising a service while requesting login information.

**Prevention:** Verify unexpected support requests independently, never provide passwords or MFA codes to support personnel, use official support channels, and train employees to recognize suspicious offers and requests.

---

## 6. Comparison Table

| Attack Type | Primary Target | Psychological Lever Exploited | Best Countermeasure |
|---|---|---|---|
| Phishing | Employees and account holders | Urgency, fear, trust, curiosity | MFA + phishing filtering + awareness |
| Spear Phishing | Specific employees or teams | Personalization and trust | Verification + MFA + targeted training |
| Whaling | Executives and high-value staff | Authority and urgency | Executive verification + payment controls |
| Vishing | Employees and support staff | Trust and authority | Independent identity verification |
| Smishing | Mobile users | Urgency and convenience | Link filtering + user awareness |
| Pretexting | Employees, help desks, customers | Authority, familiarity, trust | Strong identity verification |
| Baiting | Employees and general users | Curiosity, reward, helpfulness | Device controls + awareness |
| Quid Pro Quo | Employees and service users | Reciprocity and promised benefit | Verification + security awareness |

---

## 7. Organisational Security Awareness Training Checklist

- [ ] **1. Recognize manipulation:** Teach employees to identify urgency, fear, authority, curiosity, and reward-based tactics.
- [ ] **2. Verify before acting:** Require independent verification for sensitive requests, password resets, payments, and account changes.
- [ ] **3. Protect credentials:** Never share passwords, MFA codes, recovery codes, or authentication approvals with callers or messages.
- [ ] **4. Report suspicious activity:** Provide a simple reporting channel for phishing, suspicious calls, unknown USB devices, and other social-engineering attempts.
- [ ] **5. Practice regularly:** Run periodic awareness exercises and update training based on real incidents and observed behavior.

---

## 8. Conclusion

Three key lessons stand out for organizations:

1. **People are a major part of the security boundary.** Strong technical controls can still be bypassed when attackers successfully manipulate a trusted employee.
2. **Verification must beat urgency.** Employees should independently verify unusual requests for credentials, access, payments, password resets, or MFA changes before acting.
3. **Awareness must be continuous.** Phishing, pretexting, and baiting techniques evolve constantly, so organizations should combine training, technical controls, clear reporting procedures, and regular testing.

---

## 9. References

1. **NIST — Social Engineering Glossary**  
   https://csrc.nist.gov/glossary/term/social_engineering
2. **CISA — Phishing Security Guidance**  
   https://www.cisa.gov/sites/default/files/2024-02/Update%20to%20Phishing%20General%20Security%20Postcard_01.01.2024.pdf
3. **CISA — Phishing Infographic**  
   https://www.cisa.gov/sites/default/files/publications/phishing-infographic-508c.pdf
4. **MITRE CAPEC — CAPEC-407: Pretexting**  
   https://capec.mitre.org/data/definitions/407.html
5. **MITRE CAPEC — CAPEC-415: Pretexting via Phone**  
   https://capec.mitre.org/data/definitions/415.html
6. **WIRED — Researchers Uncover RSA Phishing Attack, Hiding in Plain Sight**  
   https://www.wired.com/2011/08/how-rsa-got-hacked/
7. **Dark Reading — RSA Details SecurID Attack Mechanics**  
   https://www.darkreading.com/cyberattacks-data-breaches/rsa-details-securid-attack-mechanics
8. **WIRED — The Attack That Broke Twitter Is Hitting Dozens of Companies**  
   https://www.wired.com/story/phone-spear-phishing-twitter-crime-wave/
9. **Google Research — Users Really Do Plug in USB Drives They Find**  
   https://research.google/pubs/users-really-do-plug-in-usb-drives-they-find/
10. **U.S. Army Cyber Command — Cybersecurity Fact Sheet: Baiting**  
    https://www.arcyber.army.mil/Resources/Fact-Sheets/Article/1440670/cybersecurity-fact-sheet-baiting/

---

## 10. Task 5 Checklist

- [x] Report filename: `social_engineering_report.md`
- [x] Introduction and definition of social engineering
- [x] Why social engineering is effective
- [x] Phishing types: spear phishing, whaling, vishing, smishing
- [x] Phishing case study
- [x] 4 phishing prevention recommendations
- [x] Pretexting definition and attack process
- [x] Pretexting case study
- [x] 3 pretexting prevention measures
- [x] Physical and digital baiting
- [x] Baiting case study
- [x] 3 baiting prevention measures
- [x] Quid Pro Quo bonus section
- [x] Comparison table
- [x] 5-point employee security awareness checklist
- [x] 4+ credible references
- [x] No demo video required
