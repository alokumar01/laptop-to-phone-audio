import { SeoLandingPage } from "@/components/content/SeoLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Turn Phone Into Speaker",
  description:
    "Turn phone into speaker for laptop audio in seconds with QR pairing and browser WebRTC streaming.",
  path: "/turn-phone-into-speaker",
  keywords: ["turn phone into speaker", "phone as laptop speaker"],
});

export default function TurnPhoneIntoSpeakerPage() {
  return (
    <SeoLandingPage
      tag="SEO LANDING"
      title="Turn Phone into Speaker"
      subtitle="Fast onboarding flow for people who want quick laptop to phone audio sharing without software installs."
      points={[
        "One-click broadcast and one-scan pairing.",
        "Clear status indicators for troubleshooting.",
        "Stable signaling design with room/session controls.",
      ]}
      checklist={[
        "Open /tool and choose Share Audio.",
        "Capture active tab with audio enabled.",
        "Scan QR from your phone browser.",
        "Tap Start Listening and resume if autoplay blocks.",
      ]}
      faqs={[
        {
          question: "Can I use this for gaming audio?",
          answer: "You can, but very low latency depends on network quality and browser buffering limits.",
        },
        {
          question: "Do I need the same Wi-Fi for both devices?",
          answer: "Same Wi-Fi gives best performance, but TURN can support different networks.",
        },
        {
          question: "Why is sender saying no listeners connected?",
          answer: "Check if phone joined the same room URL and has signaling connected before starting listen.",
        },
        {
          question: "Is this safe for private meetings?",
          answer: "Sessions are room scoped. Use trusted network and HTTPS deployment for better security posture.",
        },
      ]}
    />
  );
}
