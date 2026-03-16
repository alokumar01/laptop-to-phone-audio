import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact Laptop Audio Share for support, feedback, partnership, and technical issues.",
  path: "/contact",
  keywords: ["contact laptop audio share", "webrtc support"],
});

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 md:p-10">
        <p className="text-xs tracking-[0.24em] text-blue-200/80">CONTACT</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-50">Support and Business Contact</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          For technical support, partnerships, policy clarifications, or reporting issues, use the contact information
          below. This page is provided for transparency, trust, and AdSense compliance.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="grid gap-3">
          <h2 className="text-xl font-semibold text-slate-50">General support</h2>
          <p className="text-sm text-slate-300">Email: support@laptopaudioshare.com</p>
          <p className="text-sm text-slate-300">Use for streaming errors, setup help, and account-free usage issues.</p>
          <p className="text-sm text-slate-300">Typical response window: within 48 business hours.</p>
        </Card>

        <Card className="grid gap-3">
          <h2 className="text-xl font-semibold text-slate-50">Partnerships and media</h2>
          <p className="text-sm text-slate-300">Email: partnerships@laptopaudioshare.com</p>
          <p className="text-sm text-slate-300">
            Use for product integrations, press mentions, educational content partnerships, and collaboration requests.
          </p>
        </Card>
      </section>

      <section className="mt-8">
        <Card className="grid gap-2">
          <h2 className="text-xl font-semibold text-slate-50">Before you contact us</h2>
          <p className="text-sm text-slate-300">
            Include your browser version, device type, and a short description of the issue. This helps us troubleshoot
            faster and provide accurate guidance.
          </p>
          <p className="text-sm text-slate-300">
            Do not send passwords, payment details, or sensitive identity data by email.
          </p>
          <p className="text-sm text-slate-300">
            Review <Link href="/privacy-policy" className="text-blue-200 underline">Privacy Policy</Link> and{" "}
            <Link href="/terms-and-conditions" className="text-blue-200 underline">Terms and Conditions</Link>{" "}
            before sharing information.
          </p>
        </Card>
      </section>

      <section className="mt-8">
        <Card className="grid gap-2">
          <h2 className="text-xl font-semibold text-slate-50">For faster technical help</h2>
          <p className="text-sm text-slate-300">
            If your issue is related to signaling, include connection state details from sender and listener screens.
            If your issue is related to audio, include whether track capture succeeded and whether manual resume worked
            on mobile playback. These details reduce back-and-forth and help us deliver direct fixes quickly.
          </p>
        </Card>
      </section>
    </main>
  );
}
