import { Card } from "@/components/ui/card";
import { legalEffectiveDate, privacyPolicySections } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Detailed Privacy Policy for Laptop Audio Share including AdSense, cookies, analytics, and user data handling.",
  path: "/privacy-policy",
  keywords: ["privacy policy", "google adsense privacy", "webrtc data handling"],
});

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-14">
      <Card className="grid gap-6">
        <h1 className="text-4xl font-semibold text-slate-50">Privacy Policy</h1>
        <p className="text-sm text-slate-300">Effective date: {legalEffectiveDate}</p>
        <p className="text-sm text-slate-300">
          This policy explains how we handle data, cookies, analytics, and advertising technologies including Google
          AdSense when you use Laptop Audio Share.
        </p>

        {privacyPolicySections.map((section) => (
          <section key={section.heading} className="grid gap-3 text-sm text-slate-300">
            <h2 className="text-xl font-semibold text-blue-100">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </Card>
    </main>
  );
}
