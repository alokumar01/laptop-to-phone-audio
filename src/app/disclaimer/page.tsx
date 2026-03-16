import { Card } from "@/components/ui/card";
import { disclaimerSections, legalEffectiveDate } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Disclaimer",
  description:
    "Detailed disclaimer for Laptop Audio Share covering technical limits, third-party services, and user responsibility.",
  path: "/disclaimer",
  keywords: ["disclaimer", "technical disclaimer", "ads disclaimer"],
});

export default function DisclaimerPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-14">
      <Card className="grid gap-6">
        <h1 className="text-4xl font-semibold text-slate-50">Disclaimer</h1>
        <p className="text-sm text-slate-300">Effective date: {legalEffectiveDate}</p>
        <p className="text-sm text-slate-300">
          This disclaimer clarifies limitations of informational content, platform behavior, third-party dependencies,
          and user obligations when using the website.
        </p>

        {disclaimerSections.map((section) => (
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
