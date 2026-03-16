function getDisplayMediaFn() {
  const legacyNavigator = navigator as Navigator & {
    getDisplayMedia?: (constraints: DisplayMediaStreamOptions) => Promise<MediaStream>;
  };

  if (navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === "function") {
    return (constraints: DisplayMediaStreamOptions) => navigator.mediaDevices.getDisplayMedia(constraints);
  }

  if (typeof legacyNavigator.getDisplayMedia === "function") {
    return (constraints: DisplayMediaStreamOptions) => legacyNavigator.getDisplayMedia!(constraints);
  }

  return null;
}

function getCaptureUnavailableMessage() {
  if (!window.isSecureContext) {
    return "Screen/audio capture is unavailable here. Open sender on http://localhost:3000/share or HTTPS.";
  }
  return "Screen/audio capture is unavailable in this browser. Use latest Chrome or Edge on laptop.";
}

export async function captureDisplayAudio(): Promise<MediaStream> {
  const capture = getDisplayMediaFn();
  if (!capture) {
    throw new Error(getCaptureUnavailableMessage());
  }

  const audioConstraints: MediaTrackConstraints & { latency?: number } = {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
    latency: 0,
    channelCount: 2,
    sampleRate: 48000,
  };

  let stream: MediaStream;
  try {
    stream = await capture({
      video: true,
      audio: audioConstraints,
    });
  } catch (err) {
    if ((err as Error).name === "TypeError" || (err as Error).name === "OverconstrainedError") {
      stream = await capture({ video: true, audio: true });
    } else {
      throw err;
    }
  }

  if (!stream.getAudioTracks().length) {
    throw new Error("No audio track found. In Chrome tab picker, enable 'Share tab audio'.");
  }

  for (const track of stream.getVideoTracks()) {
    track.enabled = false;
  }

  for (const track of stream.getAudioTracks()) {
    track.contentHint = "music";
    try {
      await track.applyConstraints({
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      });
    } catch {
      // Browser may ignore these constraints for display-capture tracks.
    }
  }

  return stream;
}

function parseParams(raw: string) {
  const out = new Map<string, string>();
  for (const entry of raw.split(";")) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const [k, v = ""] = trimmed.split("=");
    out.set(k.trim(), v.trim());
  }
  return out;
}

function encodeParams(map: Map<string, string>) {
  return Array.from(map.entries())
    .map(([k, v]) => (v ? `${k}=${v}` : k))
    .join(";");
}

export function forceLowLatencyOpus(sdp: string) {
  if (!sdp) return sdp;

  const lines = sdp.split("\r\n");
  const audioIndex = lines.findIndex((line) => line.startsWith("m=audio "));
  if (audioIndex === -1) return sdp;

  const nextMediaOffset = lines.slice(audioIndex + 1).findIndex((line) => line.startsWith("m="));
  let audioEnd = nextMediaOffset === -1 ? lines.length : audioIndex + 1 + nextMediaOffset;

  let opusPt: string | null = null;
  for (let i = audioIndex + 1; i < audioEnd; i += 1) {
    const m = lines[i].match(/^a=rtpmap:(\d+)\s+opus\/48000/i);
    if (m) {
      opusPt = m[1];
      break;
    }
  }
  if (!opusPt) return sdp;

  let hasPtime = false;
  let hasMaxptime = false;
  let fmtpUpdated = false;

  for (let i = audioIndex + 1; i < audioEnd; i += 1) {
    if (lines[i].startsWith("a=ptime:")) {
      lines[i] = "a=ptime:10";
      hasPtime = true;
      continue;
    }
    if (lines[i].startsWith("a=maxptime:")) {
      lines[i] = "a=maxptime:10";
      hasMaxptime = true;
      continue;
    }

    if (lines[i].startsWith(`a=fmtp:${opusPt} `)) {
      const params = parseParams(lines[i].slice(`a=fmtp:${opusPt} `.length));
      params.set("minptime", "10");
      params.set("stereo", "1");
      params.set("sprop-stereo", "1");
      params.set("maxplaybackrate", "48000");
      params.set("maxaveragebitrate", "128000");
      params.set("useinbandfec", "0");
      lines[i] = `a=fmtp:${opusPt} ${encodeParams(params)}`;
      fmtpUpdated = true;
    }
  }

  let insertAt = audioIndex + 1;
  if (!hasPtime) {
    lines.splice(insertAt, 0, "a=ptime:10");
    insertAt += 1;
    audioEnd += 1;
  }
  if (!hasMaxptime) {
    lines.splice(insertAt, 0, "a=maxptime:10");
    audioEnd += 1;
  }

  if (!fmtpUpdated) {
    lines.splice(
      audioEnd,
      0,
      `a=fmtp:${opusPt} minptime=10;stereo=1;sprop-stereo=1;maxplaybackrate=48000;maxaveragebitrate=128000;useinbandfec=0`
    );
  }

  return lines.join("\r\n");
}
