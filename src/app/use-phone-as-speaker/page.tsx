import { SeoLandingPage } from "@/components/content/SeoLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Use Phone As Speaker",
  description:
    "Use your phone as speaker for laptop with browser streaming, QR pairing, and low-latency WebRTC playback.",
  path: "/use-phone-as-speaker",
  keywords: ["use phone as speaker", "use phone as speaker for laptop"],
});

export default function UsePhoneAsSpeakerPage() {
  return (
    <SeoLandingPage
      tag="SEO LANDING"
      title="Use Phone as Speaker for Laptop"
      subtitle="Convert your phone into a wireless speaker in minutes using browser-based WebRTC streaming with QR pairing."
      points={[
        "No app installation required on laptop or phone.",
        "Fast pairing with room ID and QR scan.",
        "Low-latency playback optimized for live listening.",
      ]}
      checklist={[
        "Open sender on laptop and start broadcast.",
        "Select tab audio or system audio source.",
        "Scan QR from phone and open listener page.",
        "Tap Start Listening and adjust volume.",
      ]}
      faqs={[
        {
          question: "Can I use phone as speaker for laptop without Bluetooth?",
          answer: "Yes. This tool uses WebRTC over browser networking instead of Bluetooth audio sink mode.",
        },
        {
          question: "Is this method free to use?",
          answer: "Yes for self-hosted or free-tier usage. You only need a browser and network connectivity.",
        },
        {
          question: "Does it support Android and iPhone?",
          answer: "It works on most modern mobile browsers that support WebRTC audio playback.",
        },
        {
          question: "What if capture starts but no audio is sent?",
          answer: "Make sure you selected the correct tab and enabled tab audio in the share picker.",
        },
      ]}
    />
  );
}
