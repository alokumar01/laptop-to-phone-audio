export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export const legalEffectiveDate = "March 13, 2026";

export const privacyPolicySections: LegalSection[] = [
  {
    heading: "1. Overview and scope",
    paragraphs: [
      "This Privacy Policy explains how Laptop Audio Share collects, uses, stores, and protects information when you visit our website and use our browser-based audio streaming features. This policy applies to all users of our marketing pages, tool pages, blog pages, and support pages. It covers interactions on desktop and mobile browsers, including when you start a sender session, join as a listener, read blog content, or contact us.",
      "Our service is designed to minimize unnecessary data collection. The core product flow is session-based and browser-native. We do not require account registration for basic use, and we do not request sensitive identity documents for routine streaming. Even with a low-data approach, technical metadata is still processed to keep the platform operational, secure, and reliable.",
      "By using this website, you agree to the practices described in this policy. If you do not agree, discontinue use of the site and related services. We may update this policy over time to reflect legal changes, product updates, and security improvements. The effective date above indicates the latest published version.",
    ],
  },
  {
    heading: "2. Information we collect",
    paragraphs: [
      "We may collect technical identifiers and diagnostics required for signaling and service stability, including room identifiers, socket identifiers, event timestamps, browser type, operating system details, approximate network data, and server log entries. These data points help us troubleshoot connection failures, rate-limit abuse, and maintain service quality.",
      "When you contact us by email or support channels, we collect the information you provide voluntarily, such as your email address, message content, and optional troubleshooting details. We use this information only to respond, improve support documentation, and resolve service issues.",
      "Audio content is transmitted using WebRTC media channels and is not intentionally stored as recorded media by default product behavior. However, network metadata associated with session setup and transport troubleshooting may be retained for operational and security purposes.",
    ],
  },
  {
    heading: "3. How we use information",
    paragraphs: [
      "We process information to provide and improve service functions, including session pairing, signaling coordination, connection troubleshooting, abuse prevention, capacity planning, and feature performance analysis. Without this processing, it would not be possible to deliver a stable browser-based streaming experience.",
      "We also use information for safety and legal compliance. This includes monitoring suspicious traffic patterns, enforcing rate limits, investigating policy abuse, and responding to valid legal requests. We may temporarily retain certain technical records when needed to protect platform integrity.",
      "In addition, we use aggregated and de-identified usage signals to prioritize product improvements. These signals may include general page performance, route popularity, and broad usage trends, but they are not intended to identify individuals.",
    ],
  },
  {
    heading: "4. Cookies, analytics, and advertising",
    paragraphs: [
      "Our site may use cookies and related technologies to improve usability, remember preferences, measure performance, and support advertising operations. Cookies are small files stored on your device by your browser. You can manage cookie behavior using browser settings, including blocking or deleting cookies, but some site features may degrade if essential cookies are disabled.",
      "We use analytics technologies, including Google Analytics, to understand how visitors interact with pages, identify content gaps, and improve user flows. Analytics data may include page visits, device type, interaction events, and approximate geography. We use this information to improve site quality and performance rather than to profile individual users.",
      "We use third-party advertising companies such as Google AdSense to serve advertisements. These companies may use cookies and web beacons to show relevant ads based on your visits to this and other websites. If AdSense is active, ad-related processing follows Google publisher policies and applicable privacy controls.",
    ],
  },
  {
    heading: "5. Third-party services and links",
    paragraphs: [
      "Our website may integrate third-party services for hosting, analytics, advertising, media connectivity, and infrastructure support. Examples include cloud hosting providers, analytics providers, and ICE infrastructure providers for WebRTC connectivity. These vendors may process limited technical data as part of service delivery.",
      "This website may also contain links to external websites, repositories, and resources. We are not responsible for the privacy practices of third-party websites. We recommend reviewing the privacy policies of any external services you visit from our site.",
      "When third-party components are used, we choose them based on reliability, security posture, and operational fit. We may replace or update providers over time if our technical or compliance requirements change.",
    ],
  },
  {
    heading: "6. Data sharing and disclosure",
    paragraphs: [
      "We do not sell personal data as part of our standard business model. We may share limited data with service providers that support hosting, analytics, advertising, and security operations, but only to the extent required for those services.",
      "We may disclose information when required by law, legal process, or valid governmental request. We may also disclose information when necessary to protect our rights, investigate abuse, enforce terms, or prevent fraud and security threats.",
      "If business structure changes, such as a merger, acquisition, or asset transfer, relevant information may be transferred as part of that transaction, subject to legal safeguards and continuity of privacy obligations.",
    ],
  },
  {
    heading: "7. Data retention",
    paragraphs: [
      "We retain data for as long as reasonably necessary to provide services, troubleshoot operations, enforce security controls, and comply with legal obligations. Retention duration varies by data category and operational purpose.",
      "Session-level signaling records are typically retained for operational diagnostics and abuse monitoring windows. Aggregated analytics may be retained longer for trend analysis and product planning. Support communications may be retained to maintain support continuity.",
      "Where possible, we reduce retention scope and remove stale records. If you contact us regarding data concerns, we will review requests and respond according to applicable legal standards.",
    ],
  },
  {
    heading: "8. Security measures",
    paragraphs: [
      "We use administrative, technical, and organizational controls intended to protect service data from unauthorized access, misuse, or disruption. These controls include HTTPS in production, access restrictions, event validation, and signaling rate limits.",
      "No internet service can guarantee absolute security. Users should also apply safe practices, such as using trusted networks, keeping browsers updated, and avoiding sharing sensitive information through open channels.",
      "If we identify a material security incident involving personal data, we will take appropriate response actions consistent with legal requirements and operational reality.",
    ],
  },
  {
    heading: "9. International use",
    paragraphs: [
      "Users may access this site from multiple jurisdictions. Depending on hosting and provider locations, technical data may be processed in countries other than your own. We take reasonable steps to ensure processing is handled with appropriate safeguards.",
      "By using this site, you understand that data transfers may occur as part of normal internet and cloud operations. Local privacy rights may vary depending on your jurisdiction and applicable legal framework.",
      "If local law grants specific rights regarding access, correction, deletion, or objection to processing, you may contact us to submit a request. We evaluate requests in good faith and respond where legally required.",
    ],
  },
  {
    heading: "10. Children’s privacy",
    paragraphs: [
      "This website is not directed to children under the age required by local law for independent consent to online services. We do not knowingly collect personal data from children in violation of applicable law.",
      "If a parent or guardian believes a child submitted personal information to us, please contact us so we can review and take appropriate action.",
      "We encourage guardians to monitor children’s online activities and use parental controls where appropriate.",
    ],
  },
  {
    heading: "11. Your choices and rights",
    paragraphs: [
      "You can control certain privacy settings directly through your browser, such as cookie preferences, tracking controls, and media permissions. You can also revoke media permissions at any time through browser settings.",
      "You may contact us to request information about personal data processing, corrections, or deletion requests where applicable. We may need to verify identity and legal basis before completing requests.",
      "For advertising controls, you may use Google ad settings and other opt-out tools offered by ad technology providers. Availability of controls can vary by region and device.",
    ],
  },
  {
    heading: "12. Contact information",
    paragraphs: [
      "For privacy questions, data requests, or policy concerns, contact us at support@laptopaudioshare.com. Include clear details so we can respond efficiently.",
      "If your request involves legal rights under data protection laws, mention your jurisdiction and the specific right you are invoking. This helps us process requests accurately.",
      "By continuing to use this site after policy updates, you acknowledge the revised privacy terms to the extent permitted by law.",
    ],
  },
  {
    heading: "13. Policy updates and consent",
    paragraphs: [
      "We may update this Privacy Policy when we introduce new features, update analytics or advertising integrations, change infrastructure providers, or respond to legal developments. We post the updated policy on this page and revise the effective date accordingly.",
      "Where legally required, we may request additional consent before applying specific processing activities, such as optional tracking features. In other contexts, continued use of the website after policy publication may constitute acceptance as permitted by applicable law.",
      "If you disagree with material updates, you should stop using the service and contact us with any clarification requests. We will provide reasonable explanations regarding the scope and effect of major changes.",
    ],
  },
  {
    heading: "14. Incident response and accountability",
    paragraphs: [
      "We maintain operational procedures for identifying, investigating, and responding to potential security incidents. These procedures include log review, event validation, access control checks, and service recovery planning.",
      "When incidents involve personal data and trigger legal obligations, we take response actions appropriate to jurisdictional requirements. This may include notifications to users, partners, or authorities within required timelines.",
      "We continuously improve privacy and security controls through post-incident analysis, infrastructure hardening, and policy updates. Our objective is to reduce recurrence risk while preserving service reliability and transparency.",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    heading: "1. Acceptance of terms",
    paragraphs: [
      "These Terms and Conditions govern your access to and use of Laptop Audio Share, including web pages, tool features, content, and related services. By accessing or using the service, you agree to be bound by these terms. If you do not agree, you must stop using the service.",
      "You represent that you are legally capable of entering into binding agreements in your jurisdiction. If you are using the service on behalf of an organization, you represent that you have authority to bind that organization to these terms.",
      "We may revise these terms at any time. Updated terms become effective when posted. Continued use after updates constitutes acceptance of revised terms.",
    ],
  },
  {
    heading: "2. Service description",
    paragraphs: [
      "Laptop Audio Share provides browser-based technology to help users pair laptop and phone devices for audio streaming. The service includes sender and listener pages, signaling coordination, educational content, and related website features.",
      "The service may include integrations with third-party providers for analytics, advertising, and infrastructure. Availability, behavior, and performance can vary by device, browser, network, and provider status.",
      "We may add, change, pause, or remove features at our discretion to improve reliability, security, or business operations.",
    ],
  },
  {
    heading: "3. Eligibility and permitted use",
    paragraphs: [
      "You may use the service only for lawful purposes and in compliance with these terms and applicable law. You must not use the service for unauthorized surveillance, copyright infringement, abusive traffic generation, or security attacks.",
      "You are responsible for maintaining device security, browser updates, and lawful use of media content. You should ensure you have rights to capture and stream any audio you transmit.",
      "If you violate these terms, we may restrict access, limit features, or terminate usage without prior notice.",
    ],
  },
  {
    heading: "4. Account model and session behavior",
    paragraphs: [
      "Basic service flows are session-based and may not require account registration. Room IDs, signaling state, and temporary session metadata are used to coordinate connections between devices.",
      "Session availability is not guaranteed. Connections can be interrupted by network changes, device sleep mode, browser policy changes, or third-party service disruptions.",
      "You are responsible for using session URLs securely. Do not share active room links publicly if you want private listening.",
    ],
  },
  {
    heading: "5. Prohibited activities",
    paragraphs: [
      "You must not attempt unauthorized access to infrastructure, reverse engineer security controls, overload signaling channels, or interfere with normal operation of the service.",
      "You must not automate abusive traffic, scrape restricted endpoints, inject malicious payloads, or use the platform for fraudulent behavior. Any such activity may result in blocking and legal escalation where appropriate.",
      "You must not impersonate other users, falsify connection identity, or attempt to bypass room/session restrictions.",
    ],
  },
  {
    heading: "6. Intellectual property",
    paragraphs: [
      "All website content, branding, code elements, and design components provided by Laptop Audio Share are protected by applicable intellectual property laws unless otherwise stated.",
      "You may not reproduce, redistribute, or commercially exploit protected content without permission. Limited personal and internal business use is allowed only as explicitly permitted by law and these terms.",
      "Open-source components remain governed by their own licenses. You are responsible for complying with applicable third-party license requirements.",
    ],
  },
  {
    heading: "7. Content and user responsibility",
    paragraphs: [
      "You are solely responsible for content you capture, transmit, or play through the service. We do not actively monitor all media content and do not assume liability for user-generated transmissions.",
      "You must ensure legal rights for any protected material you stream. This includes compliance with copyright, licensing, and platform-specific terms from content sources.",
      "We reserve the right to investigate policy violations and restrict service usage when misuse is detected.",
    ],
  },
  {
    heading: "8. Third-party advertising and analytics",
    paragraphs: [
      "The website may display advertising, including Google AdSense units. Ads may be served by third-party networks that use cookies and similar technologies to deliver relevant ads.",
      "We may use Google Analytics and related tools to understand traffic and product performance. Use of these tools is also governed by their provider terms and privacy policies.",
      "By using the website, you acknowledge that third-party technologies may process certain technical data according to their policies.",
    ],
  },
  {
    heading: "9. Availability and support",
    paragraphs: [
      "The service is provided on an as-available basis. We do not guarantee uninterrupted operation, continuous availability, or error-free behavior across all devices and networks.",
      "Support resources may include documentation, blog content, and contact channels. Response times are not guaranteed unless explicitly stated in separate agreements.",
      "Planned or unplanned maintenance may temporarily affect service availability.",
    ],
  },
  {
    heading: "10. Disclaimer of warranties",
    paragraphs: [
      "To the maximum extent permitted by law, the service is provided without warranties of any kind, express or implied. This includes implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
      "We do not guarantee that the service will meet all user expectations, work in every environment, or remain free from defects at all times.",
      "Users assume responsibility for evaluating whether the service is suitable for their intended use.",
    ],
  },
  {
    heading: "11. Limitation of liability",
    paragraphs: [
      "To the extent allowed by law, Laptop Audio Share and its operators are not liable for indirect, incidental, consequential, special, or punitive damages arising from service use or inability to use the service.",
      "Total liability, if any, is limited to the amount you paid to us for the service feature directly related to the claim in the preceding applicable period, or the minimum amount required by law when no paid amount exists.",
      "Some jurisdictions do not allow certain limitations, so portions of this section may not apply depending on local law.",
    ],
  },
  {
    heading: "12. Indemnification",
    paragraphs: [
      "You agree to defend, indemnify, and hold harmless Laptop Audio Share and its affiliates from claims, liabilities, damages, losses, and expenses arising from your use of the service, your content, or your violation of these terms.",
      "This includes reasonable legal fees and investigation costs related to claims caused by misuse, unlawful activity, or rights violations associated with your actions.",
      "We reserve the right to assume exclusive defense of matters subject to indemnification, and you agree to cooperate reasonably in such defense.",
    ],
  },
  {
    heading: "13. Governing law and dispute resolution",
    paragraphs: [
      "These terms are governed by applicable laws determined by our operating jurisdiction, unless mandatory consumer law in your jurisdiction provides otherwise.",
      "Before initiating formal proceedings, parties agree to attempt good-faith resolution by written notice. If unresolved, disputes may proceed according to applicable court or arbitration mechanisms where legally permitted.",
      "If any part of these terms is held invalid, remaining provisions remain in full force to the extent possible.",
    ],
  },
  {
    heading: "14. Contact and notices",
    paragraphs: [
      "For legal notices, terms questions, or policy concerns, contact support@laptopaudioshare.com.",
      "Official notices may be provided through website updates, email, or other reasonable communication channels.",
      "Your continued use of the service confirms your understanding and acceptance of these terms.",
    ],
  },
  {
    heading: "15. Service levels and feature roadmap",
    paragraphs: [
      "Unless stated in a separate written agreement, we do not provide contractual service-level guarantees for uptime, latency, response times, or support resolution deadlines. Public roadmap references are informational and may change without notice.",
      "Feature priorities may be adjusted based on security requirements, legal obligations, user impact, and platform sustainability. We are not obligated to implement specific feature requests, compatibility requests, or timeline commitments from individual users.",
      "Beta or experimental features may be offered for evaluation and may contain defects, performance limitations, or partial documentation. Such features may be modified or withdrawn at any time.",
    ],
  },
  {
    heading: "16. Export compliance and restricted use",
    paragraphs: [
      "You agree to comply with applicable export control and trade restrictions in your jurisdiction when using the service. You must not use the service in violation of sanctions regimes or prohibited end-use rules.",
      "You represent that neither you nor your organization is listed on prohibited party lists relevant to your jurisdiction. If legal status changes, you must discontinue use where required by law.",
      "We may suspend or terminate access when compliance concerns arise or when continuing service could expose us to legal or regulatory risk.",
    ],
  },
  {
    heading: "17. Force majeure",
    paragraphs: [
      "We are not liable for delays or failures caused by events beyond reasonable control, including internet backbone failures, cloud outages, cyber incidents, acts of government, natural disasters, labor disputes, or major utility interruptions.",
      "During force majeure events, service functionality may degrade or become unavailable. We will use commercially reasonable efforts to restore operations when conditions permit.",
      "Nothing in this section limits obligations that cannot be excluded under applicable law.",
    ],
  },
  {
    heading: "18. Assignment and transfer",
    paragraphs: [
      "We may assign or transfer these terms, in whole or in part, in connection with a merger, acquisition, restructuring, financing transaction, or sale of assets. Any successor entity will assume applicable rights and obligations.",
      "You may not assign your rights or obligations under these terms without prior written consent from us. Unauthorized assignments are void to the extent permitted by law.",
      "This section does not prevent lawful changes in control or internal organizational restructuring that does not materially reduce user protections under these terms.",
    ],
  },
  {
    heading: "19. Entire agreement and interpretation",
    paragraphs: [
      "These terms, together with incorporated policies such as the Privacy Policy and Disclaimer, constitute the entire agreement between you and Laptop Audio Share regarding service use unless a separate written contract explicitly states otherwise.",
      "Headings are provided for readability and do not limit interpretation. If a provision is unenforceable, the remaining terms continue in effect, and unenforceable language is interpreted to the maximum lawful extent.",
      "Failure to enforce a provision at one time does not waive our right to enforce it later.",
    ],
  },
  {
    heading: "20. Survival",
    paragraphs: [
      "Provisions that by their nature should survive termination will survive, including sections covering intellectual property, disclaimers, limitation of liability, indemnification, governing law, and dispute resolution.",
      "Termination of access does not eliminate obligations that accrued before termination, including obligations related to lawful investigations, dispute processes, and protection of rights.",
      "Users should retain copies of relevant records and communications if they anticipate legal or compliance review involving prior service usage.",
    ],
  },
  {
    heading: "21. Feedback and submissions",
    paragraphs: [
      "If you provide suggestions, ideas, bug reports, or feature requests, you grant us a non-exclusive, worldwide, royalty-free right to use, modify, and incorporate that feedback into the service without compensation unless otherwise agreed in writing.",
      "You should not submit confidential information unless a separate confidentiality agreement is in place. Public feedback channels may be visible to other users or indexed by search systems.",
      "We value user input and may prioritize requests based on security impact, roadmap alignment, operational feasibility, and long-term maintenance considerations.",
    ],
  },
  {
    heading: "22. Communications and electronic records",
    paragraphs: [
      "By using the service, you consent to receive electronic communications related to operation, legal updates, policy notices, and support responses. Electronic communications satisfy legal communication requirements where permitted by law.",
      "Users are responsible for providing valid contact information in direct support interactions and for checking updates posted on this website. We are not responsible for missed communications caused by invalid addresses, spam filtering, or user-side mailbox issues.",
      "You agree to retain copies of relevant communications for your records, especially when such communications involve legal notices, policy acknowledgments, or security-related instructions.",
    ],
  },
  {
    heading: "23. Compliance cooperation and audit context",
    paragraphs: [
      "Where legally required or reasonably necessary to protect platform integrity, users agree to cooperate with lawful compliance reviews related to abuse prevention, fraud mitigation, and enforcement of service restrictions. Cooperation may include clarifying usage patterns, confirming ownership of contacted accounts, or providing context for suspicious activity alerts.",
      "We may maintain internal audit trails for security and reliability operations, including event timing, validation outcomes, and moderation actions. Audit trails are used to support responsible service governance and to investigate repeated policy abuse.",
      "Nothing in this section creates a general obligation for users to disclose sensitive personal data beyond what is required by law or necessary for a specific support or enforcement process. We aim to minimize data scope while maintaining platform safety.",
    ],
  },
  {
    heading: "24. Interpretation for online operations",
    paragraphs: [
      "These terms are written for an internet-delivered software service where dependencies, browser behavior, and third-party ecosystems can evolve rapidly. Reasonable interpretation should account for technical realities while preserving user protections and legal compliance commitments.",
      "When two provisions appear to conflict, they should be interpreted in a way that best preserves lawful operation, platform security, and fair treatment of users, unless mandatory local law requires a different interpretation.",
      "This interpretation principle applies alongside all mandatory consumer protections that cannot be waived under applicable law.",
    ],
  },
];

export const disclaimerSections: LegalSection[] = [
  {
    heading: "1. General information disclaimer",
    paragraphs: [
      "Content on this website is provided for general informational purposes only. While we aim to keep information useful and practical, we make no guarantees that all content is complete, current, or suitable for every specific technical environment.",
      "Guides, checklists, and recommendations are based on typical browser behavior and operational best practices. Actual outcomes may vary due to network conditions, device performance, browser policies, and third-party service changes.",
      "You should evaluate all information in the context of your own requirements before relying on it for critical workflows.",
    ],
  },
  {
    heading: "2. No professional advice",
    paragraphs: [
      "Nothing on this website constitutes legal, financial, accounting, medical, cybersecurity, or other regulated professional advice. If you need advice in a regulated domain, consult a qualified professional.",
      "Any implementation decisions you make based on our content are your responsibility. We do not provide guarantees that following our tutorials will satisfy all legal or compliance obligations in your jurisdiction.",
      "Use content from this site as practical guidance, not as a substitute for expert counsel.",
    ],
  },
  {
    heading: "3. Technical compatibility disclaimer",
    paragraphs: [
      "Browser APIs, autoplay policies, capture permissions, codec behavior, and network routing can change without notice. Features that work in one environment may fail or degrade in another environment.",
      "We do not guarantee compatibility with every browser version, operating system, handset model, or enterprise network policy. You are responsible for testing in your target environment.",
      "Performance results such as latency and quality are estimates and not contractual guarantees.",
    ],
  },
  {
    heading: "4. Third-party services disclaimer",
    paragraphs: [
      "Our site may rely on third-party services including hosting infrastructure, analytics, advertising providers, and connectivity services. Outages, policy changes, or technical limits in these services can affect functionality.",
      "References to third-party products, brands, or providers do not imply endorsement unless explicitly stated. We are not responsible for third-party content, terms, or data practices.",
      "Users should review third-party terms and privacy notices independently.",
    ],
  },
  {
    heading: "5. Advertising and affiliate disclaimer",
    paragraphs: [
      "This website may display advertisements, including Google AdSense units. Ads are served by third-party systems and may be personalized based on browsing context and cookie behavior.",
      "Ad display does not constitute endorsement of advertised products or claims. Users should evaluate ads independently before making purchases or commitments.",
      "If affiliate links are used in future content, we may earn referral compensation at no additional cost to users.",
    ],
  },
  {
    heading: "6. Limitation of responsibility",
    paragraphs: [
      "To the fullest extent permitted by law, we are not responsible for losses resulting from direct or indirect use of this website, including lost data, business interruption, connectivity failures, or content inaccuracies.",
      "You assume responsibility for backup, testing, and safe deployment practices when implementing any technical guidance from this site.",
      "If local law limits liability disclaimers, applicable sections are interpreted to the maximum extent allowed.",
    ],
  },
  {
    heading: "7. User responsibility",
    paragraphs: [
      "Users are responsible for lawful media use, copyright compliance, and responsible handling of session links. Do not use this service for unauthorized recording, surveillance, or content redistribution that violates law or platform rules.",
      "Users are also responsible for securing their own devices and networks. Keep software updated, avoid unsafe public networks for sensitive sessions, and follow security best practices.",
      "If you do not agree with this disclaimer, discontinue use of the website and related services.",
    ],
  },
  {
    heading: "8. Contact",
    paragraphs: [
      "For questions regarding this disclaimer, contact support@laptopaudioshare.com.",
      "We may update this page periodically to reflect service changes and legal developments.",
      "Continued use after updates indicates acceptance of the revised disclaimer.",
    ],
  },
  {
    heading: "9. Results and expectations disclaimer",
    paragraphs: [
      "Any references to expected latency, quality, ranking potential, or monetization outcomes are estimates based on common scenarios and should not be interpreted as guaranteed outcomes. Actual results depend on many factors outside our control, including hardware quality, network conditions, market competition, and policy enforcement by third parties.",
      "Statements about SEO, AdSense readiness, or performance optimization are educational guidance. They do not guarantee approval by advertising networks, search engine rankings, or revenue performance.",
      "You should independently validate all assumptions through testing, analytics, and professional review where needed.",
    ],
  },
  {
    heading: "10. Platform availability disclaimer",
    paragraphs: [
      "The website and tool may experience interruptions, degraded performance, or temporary unavailability due to maintenance, deployments, upstream provider incidents, or legal constraints. We do not guarantee continuous availability.",
      "Even when service is online, specific features may not work consistently across all browsers or network paths. WebRTC behavior can vary based on NAT traversal, codec support, autoplay policy, and device resource limits.",
      "Users should maintain fallback options for critical workflows and should not rely solely on one real-time communication path for mission-critical operations.",
    ],
  },
  {
    heading: "11. Content update and correction disclaimer",
    paragraphs: [
      "We may update, correct, or remove content at any time. Older pages or cached copies may contain outdated references to features, policies, or compatibility status.",
      "If you notice an error or outdated claim, contact us so we can review and correct it. We appreciate reports that improve technical accuracy and user safety.",
      "No delay in correction should be interpreted as endorsement of inaccurate third-party claims or unauthorized use patterns.",
    ],
  },
  {
    heading: "12. Jurisdictional and regulatory variation disclaimer",
    paragraphs: [
      "Legal rights and obligations can differ significantly by country, state, and sector. Statements on this website are not guaranteed to satisfy every local legal standard. Users are responsible for evaluating whether specific use cases, content capture methods, or deployment choices are compliant in their jurisdiction.",
      "Where this disclaimer conflicts with non-waivable legal rights, those rights remain in effect. Remaining sections continue to apply to the maximum extent permitted by law.",
      "If you operate in a regulated environment, seek qualified legal review before relying on general website guidance for compliance-sensitive decisions.",
      "Regulatory guidance can change over time, and implementation details that were compliant in one period may require updates later. Users should review current rules and provider policies before deploying or monetizing production services.",
      "This section is intended to reinforce cautious, informed use of all informational content and does not replace legal due diligence for commercial or regulated deployments.",
      "Whenever local requirements are unclear, the safest approach is to pause deployment, document assumptions, and obtain advice from qualified counsel before proceeding with public launch, monetization, or cross-border service expansion.",
    ],
  },
];
