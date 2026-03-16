import { Card } from "@/components/ui/card";
import { legalEffectiveDate, termsSections } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms and Conditions",
  description:
    "Detailed Terms and Conditions for Laptop Audio Share including service use, responsibilities, and limitations.",
  path: "/terms-and-conditions",
  keywords: ["terms and conditions", "service terms", "adsense terms notice"],
});

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-14">
      <Card className="grid gap-6">
        <h1 className="text-4xl font-semibold text-slate-50">Terms and Conditions</h1>
        <p className="text-sm text-slate-300">Effective date: {legalEffectiveDate}</p>
        <p className="text-sm text-slate-300">
          These terms govern access to Laptop Audio Share, including tool pages, content pages, and services connected
          to analytics, advertising, and third-party infrastructure.
        </p>

        {termsSections.map((section) => (
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
