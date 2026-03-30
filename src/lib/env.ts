function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

const DEFAULT_BASE_URL = "https://phonespeaker.vercel.app";
const DEFAULT_SIGNALING_URL = "https://signal.whoisalok.tech";

function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export const publicEnv = {
  baseUrl: trimTrailingSlash(readEnv("NEXT_PUBLIC_BASE_URL") || DEFAULT_BASE_URL),
  googleAnalyticsId: readEnv("NEXT_PUBLIC_GOOGLE_ANALYTICS_ID"),
  googleSiteVerification: readEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),
  adsenseClient: readEnv("NEXT_PUBLIC_ADSENSE_CLIENT"),
  adsenseEnabled: readEnv("NEXT_PUBLIC_ADSENSE_ENABLED") === "true",
  signalingUrl: trimTrailingSlash(readEnv("NEXT_PUBLIC_SIGNALING_URL") || DEFAULT_SIGNALING_URL),
  stunUrl: readEnv("NEXT_PUBLIC_STUN_URL") || "stun:stun.l.google.com:19302",
  turnUrl: readEnv("NEXT_PUBLIC_TURN_URL"),
  turnUsername: readEnv("NEXT_PUBLIC_TURN_USERNAME"),
  turnCredential: readEnv("NEXT_PUBLIC_TURN_CREDENTIAL"),
};
