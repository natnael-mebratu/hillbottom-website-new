export function isVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (["youtube.com", "m.youtube.com", "youtu.be", "vimeo.com"].includes(host)) {
      return true;
    }
    return /\.(mp4|webm|ogg)$/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

function toEmbedUrl(url: string): { kind: "iframe" | "video"; src: string } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/shorts/")[1];
    if (id) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}` };
  }
  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    if (id) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}` };
  }
  if (host === "vimeo.com") {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    if (id) return { kind: "iframe", src: `https://player.vimeo.com/video/${id}` };
  }
  if (/\.(mp4|webm|ogg)$/i.test(parsed.pathname)) {
    return { kind: "video", src: url };
  }

  return null;
}

// For autoplaying background video (hero sections): mute/loop are required
// for autoplay to be allowed by browsers, and hides player chrome.
export function BackgroundVideo({
  url,
  className = "",
}: {
  url: string;
  className?: string;
}) {
  const embed = toEmbedUrl(url);
  if (!embed) return null;

  if (embed.kind === "video") {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className={`h-full w-full object-cover ${className}`}
      >
        <source src={embed.src} />
      </video>
    );
  }

  const bgSrc = `${embed.src}?autoplay=1&mute=1&loop=1&controls=0&playlist=${embed.src.split("/").pop()}`;
  return (
    <iframe
      src={bgSrc}
      title="Background video"
      className={`h-full w-full object-cover ${className}`}
      style={{ border: "none", pointerEvents: "none" }}
      allow="autoplay; encrypted-media"
    />
  );
}

export function VideoEmbed({
  url,
  title,
  className = "",
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const embed = toEmbedUrl(url);

  if (!embed) {
    // Unrecognized URL shape — safest fallback is still a link, but this
    // should be rare (YouTube/Vimeo/direct video files all resolve above).
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={`flex items-center justify-between px-5 py-4 text-sm text-[#c09a60] hover:text-white ${className}`}
      >
        <span>Watch video</span>
        <span aria-hidden="true">↗</span>
      </a>
    );
  }

  if (embed.kind === "video") {
    return (
      <video
        controls
        preload="metadata"
        className={`w-full h-full ${className}`}
        aria-label={title}
      >
        <source src={embed.src} />
      </video>
    );
  }

  return (
    <div className={`relative w-full aspect-video ${className}`}>
      <iframe
        src={embed.src}
        title={title}
        className="absolute inset-0 h-full w-full"
        style={{ border: "none" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
