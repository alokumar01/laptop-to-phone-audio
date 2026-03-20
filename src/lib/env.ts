function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export const publicEnv = {
  baseUrl: trimTrailingSlash(
    readEnv("NEXT_PUBLIC_BASE_URL", "NEXT_PUBLIC_SITE_URL") || "https://laptop-audio-share.vercel.app"
  ),
  googleAnalyticsId: readEnv("NEXT_PUBLIC_GOOGLE_ANALYTICS_ID", "NEXT_PUBLIC_GA_ID"),
  googleSiteVerification: readEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),
  adsenseClient: readEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "NEXT_PUBLIC_ADSENSE_ID"),
  adsenseEnabled: readEnv("NEXT_PUBLIC_ADSENSE_ENABLED") === "true",
  signalingUrl: readEnv("NEXT_PUBLIC_SIGNALING_URL"),
  stunUrl: readEnv("NEXT_PUBLIC_STUN_URL") || "stun:stun.l.google.com:19302",
  turnUrl: readEnv("NEXT_PUBLIC_TURN_URL"),
  turnUsername: readEnv("NEXT_PUBLIC_TURN_USERNAME"),
  turnCredential: readEnv("NEXT_PUBLIC_TURN_CREDENTIAL"),
};
