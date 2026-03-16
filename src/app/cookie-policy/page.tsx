import { Card } from "@/components/ui/card";
import { legalEffectiveDate } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cookie Policy",
  description: "Cookie Policy for Laptop Audio Share including analytics and advertising cookie usage details.",
  path: "/cookie-policy",
  keywords: ["cookie policy", "adsense cookies", "analytics cookies"],
});

const cookieSections = [
  {
    heading: "1. What are cookies",
    paragraphs: [
      "Cookies are small text files stored by your browser when you visit a website. They help websites remember preferences, maintain basic functionality, and understand usage behavior.",
      "We use cookies to improve site experience, measure performance, and support advertising features where enabled.",
    ],
  },
  {
    heading: "2. Types of cookies we use",
    paragraphs: [
      "Essential cookies: required for core website behavior such as session flow and basic security checks.",
      "Analytics cookies: used to understand page performance and visitor behavior trends, including Google Analytics where configured.",
      "Advertising cookies: may be used by Google AdSense and partners to show relevant ads and measure ad performance.",
    ],
  },
  {
    heading: "3. Third-party cookies",
    paragraphs: [
      "Third-party providers such as Google may set cookies to deliver analytics and advertising services. Their use of cookies is governed by their own policies.",
      "We recommend reviewing Google policies for AdSense and Analytics to understand how those systems process data.",
    ],
  },
  {
    heading: "4. How to manage cookies",
    paragraphs: [
      "You can control cookie settings in your browser, including blocking all cookies, deleting existing cookies, or limiting third-party cookies.",
      "Disabling some cookies may impact page behavior, analytics quality, and ad relevance.",
    ],
  },
  {
    heading: "5. Contact",
    paragraphs: [
      "For cookie-related questions, contact support@laptopaudioshare.com.",
      "We may update this policy over time. The effective date reflects the latest version.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-14">
      <Card className="grid gap-6">
        <h1 className="text-4xl font-semibold text-slate-50">Cookie Policy</h1>
        <p className="text-sm text-slate-300">Effective date: {legalEffectiveDate}</p>

        {cookieSections.map((section) => (
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
