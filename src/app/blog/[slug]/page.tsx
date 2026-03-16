import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/card";
import { blogPosts, getBlogPostBySlug } from "@/content/blog-posts";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, toAbsoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Article Not Found",
      description: "The requested article does not exist.",
      path: "/blog",
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const canonicalUrl = toAbsoluteUrl(`/blog/${post.slug}`);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: canonicalUrl,
    keywords: post.keywords.join(", "),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: toAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: toAbsoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <article className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-4">
          <Card className="grid gap-3 p-7">
            <p className="text-xs font-medium tracking-[0.18em] text-slate-500">
              {post.publishedAt} • Updated {post.updatedAt} • {post.readingMinutes} min read • {post.targetWords} words
            </p>
            <nav className="text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-300">
                Home
              </Link>{" "}
              /{" "}
              <Link href="/blog" className="hover:text-slate-300">
                Blog
              </Link>{" "}
              / <span className="text-slate-400">{post.title}</span>
            </nav>
            <h1 className="text-balance text-4xl font-semibold text-slate-50 md:text-5xl">{post.title}</h1>
            <p className="text-base leading-8 text-slate-400">{post.description}</p>
          </Card>

          <Card className="grid gap-3 p-7">
            <h2 className="text-2xl font-semibold text-slate-50">Introduction</h2>
            <div className="grid gap-4 text-base leading-8 text-slate-300">
              {post.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Card>

          {post.sections.map((section, index) => (
            <div key={section.heading} className="grid gap-4">
              <Card className="grid gap-3 p-7">
                <h2 className="text-2xl font-semibold text-slate-50">{section.heading}</h2>
                <div className="grid gap-4 text-base leading-8 text-slate-300">
                  {section.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Card>
              {(index + 1) % 2 === 0 ? <AdSlot slot={`blog-inline-${index + 1}`} minHeight={150} /> : null}
            </div>
          ))}

          <Card className="grid gap-3 border border-indigo-400/20 bg-indigo-500/10 p-7">
            <h2 className="text-2xl font-semibold text-slate-50">Use the live tool</h2>
            <p className="text-sm leading-7 text-slate-300">
              Open the live dashboard to test the exact flow described in this article. Start from sender on laptop,
              then join from phone.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/tool" className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-slate-50">
                Open Tool
              </Link>
              <Link href="/share" className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">
                Open Sender
              </Link>
              <Link
                href="/listen"
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100"
              >
                Open Listener
              </Link>
            </div>
          </Card>

          <Card className="grid gap-3 p-7">
            <h2 className="text-2xl font-semibold text-slate-50">FAQ</h2>
            <div className="grid gap-3">
              {post.faq.map((item) => (
                <div key={item.question} className="rounded-2xl border border-slate-800 bg-white/[0.03] p-4">
                  <h3 className="text-lg font-semibold text-slate-100">{item.question}</h3>
                  <p className="mt-1 text-sm leading-7 text-slate-400">{item.answer}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="grid gap-3 p-7">
            <h2 className="text-2xl font-semibold text-slate-50">Conclusion</h2>
            <div className="grid gap-4 text-base leading-8 text-slate-300">
              {post.conclusion.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Card>
        </div>

        <aside className="grid gap-4">
          <Card className="grid gap-3 p-6">
            <h2 className="text-xl font-semibold text-slate-50">Related keywords</h2>
            <div className="grid gap-2 text-sm text-slate-400">
              {post.keywords.map((keyword) => (
                <p key={keyword} className="rounded-2xl border border-slate-800 bg-white/[0.03] px-3 py-2">
                  {keyword}
                </p>
              ))}
            </div>
          </Card>
        </aside>
      </article>
    </main>
  );
}
