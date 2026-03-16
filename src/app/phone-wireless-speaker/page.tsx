import { SeoLandingPage } from "@/components/content/SeoLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Phone Wireless Speaker",
  description:
    "Turn phone into a wireless speaker for laptop media using secure browser WebRTC and session pairing.",
  path: "/phone-wireless-speaker",
  keywords: ["phone wireless speaker", "phone as wireless speaker"],
});

export default function PhoneWirelessSpeakerPage() {
  return (
    <SeoLandingPage
      tag="SEO LANDING"
      title="Phone as Wireless Speaker"
      subtitle="Use your phone speaker output as a wireless extension of your laptop media stream in browser."
      points={[
        "Strong option for small rooms and desk setups.",
        "No device pairing friction with QR flow.",
        "Designed for music, video, and spoken audio streams.",
      ]}
      checklist={[
        "Launch sender page and allow audio capture.",
        "Keep laptop tab active while broadcasting.",
        "Scan QR and start listener on phone.",
        "Use volume slider for comfortable output level.",
      ]}
      faqs={[
        {
          question: "Can one laptop stream to more than one phone?",
          answer: "Yes, multiple listeners can join the same room up to configured room limits.",
        },
        {
          question: "Does it replace a dedicated Bluetooth speaker?",
          answer: "For convenience yes, but audio quality depends on phone speaker hardware and network quality.",
        },
        {
          question: "Will call interruptions stop playback?",
          answer: "On mobile devices, incoming calls or focus changes can pause media and require resume action.",
        },
        {
          question: "Is this suitable for meetings?",
          answer: "It can be used for meetings, but you should test latency and echo behavior for your setup first.",
        },
      ]}
    />
  );
}
