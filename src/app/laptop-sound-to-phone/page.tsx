import { SeoLandingPage } from "@/components/content/SeoLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Laptop Sound To Phone",
  description:
    "Route laptop sound to phone in browser with QR pairing and WebRTC for stable near real-time playback.",
  path: "/laptop-sound-to-phone",
  keywords: ["laptop sound to phone", "stream laptop audio"],
});

export default function LaptopSoundToPhonePage() {
  return (
    <SeoLandingPage
      tag="SEO LANDING"
      title="Laptop Sound to Phone"
      subtitle="A practical browser workflow to send laptop audio to your phone speaker without installing extra software."
      points={[
        "Simple setup built for non-technical users.",
        "Room-based signaling keeps sessions isolated.",
        "Works on local network and can extend with TURN.",
      ]}
      checklist={[
        "Start share mode on laptop.",
        "Play audio from selected tab source.",
        "Join listener room from phone.",
        "Confirm WebRTC connected state for live sound.",
      ]}
      faqs={[
        {
          question: "Can I stream Netflix or YouTube audio this way?",
          answer: "If browser allows capture and tab audio sharing, yes. DRM restrictions may vary by platform.",
        },
        {
          question: "Why is there delay in sound?",
          answer: "Default jitter buffers and network instability can add delay. Use low-latency settings and strong Wi-Fi.",
        },
        {
          question: "Can I use this over mobile hotspot?",
          answer: "Yes, but quality and latency depend on signal and network path conditions.",
        },
        {
          question: "Do I need account login?",
          answer: "No. Pairing is session-based using room ID and QR links.",
        },
      ]}
    />
  );
}
