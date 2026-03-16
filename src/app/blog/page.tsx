import Link from "next/link";
import { FaqSection } from "@/components/content/FaqSection";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/card";
import { blogPosts, blogTopicIdeas30 } from "@/content/blog-posts";
import { buildMetadata } from "@/lib/seo";
import { toAbsoluteUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "SEO-focused guides on using phone as speaker for laptop, WebRTC audio optimization, and troubleshooting.",
  path: "/blog",
  keywords: ["use phone as speaker for laptop", "laptop sound to phone", "webrtc audio blog"],
});

export default function BlogIndexPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: blogPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: toAbsoluteUrl(`/blog/${post.slug}`),
      name: post.title,
    })),
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <JsonLd data={itemListSchema} />

      <Reveal>
        <section className="rounded-[2rem] border border-slate-800 bg-slate-950 p-8 md:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Content Hub</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-50">Laptop Audio Share Blog</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Long-form practical guides targeting high-intent laptop-to-phone audio queries. Each article is structured
            for readability, internal linking, and featured-snippet friendly FAQ coverage.
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.06} className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-4">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="grid gap-3 p-6">
              <p className="text-xs font-medium tracking-[0.18em] text-slate-500">
                {post.publishedAt} • {post.readingMinutes} min read • {post.targetWords} words
              </p>
              <h2 className="text-2xl font-semibold text-slate-50">
                <Link href={`/blog/${post.slug}`} className="transition hover:text-indigo-300">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm leading-7 text-slate-400">{post.description}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {post.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-slate-700 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="grid gap-3 p-6">
          <h2 className="text-xl font-semibold text-slate-50">Topic backlog</h2>
          <div className="grid max-h-[620px] gap-2 overflow-auto pr-1 text-sm text-slate-400">
            {blogTopicIdeas30.map((topic) => (
              <p key={topic} className="rounded-2xl border border-slate-800 bg-white/[0.03] px-3 py-2">
                {topic}
              </p>
            ))}
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.12} className="mt-10">
        <FaqSection
          title="Blog FAQ"
          faqs={[
            {
              question: "How long is each blog article?",
              answer: "Each guide targets long-form depth around 1200-1500 words with practical steps and FAQs.",
            },
            {
              question: "Do blog posts link to the live tool?",
              answer: "Yes. Each article includes internal links to tool, sender, and listener pages.",
            },
          ]}
        />
      </Reveal>
    </main>
  );
}
