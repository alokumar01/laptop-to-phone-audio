import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/card";

export type FaqItem = {
  question: string;
  answer: string;
};

interface FaqSectionProps {
  title?: string;
  faqs: FaqItem[];
}

export function FaqSection({ title = "FAQ", faqs }: FaqSectionProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="grid gap-4">
      <JsonLd data={faqSchema} />
      <h2 className="text-3xl font-semibold text-slate-50">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((item) => (
          <Card key={item.question} className="grid gap-2 p-6">
            <h3 className="text-lg font-semibold text-slate-100">{item.question}</h3>
            <p className="text-sm leading-7 text-slate-400">{item.answer}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
