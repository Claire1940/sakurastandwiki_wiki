"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [userStarted, setUserStarted] = useState(false);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // Auto-play (muted) when the player scrolls into view, with a click-to-play fallback
  const embedUrl = useMemo(() => {
    const base = `https://www.youtube.com/embed/${videoId}`;
    if (userStarted) {
      // User-initiated playback: sound on, single play
      return `${base}?autoplay=1&rel=0`;
    }
    // Background autoplay when in viewport: muted + looped
    return `${base}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;
  }, [videoId, userStarted]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Respect users who prefer reduced motion — skip auto-play entirely
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const shouldShowIframe = visible || userStarted;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black/40"
        style={{ paddingBottom: "56.25%" }}
      >
        {shouldShowIframe ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          // Placeholder cover before the player enters the viewport — click to start with sound
          <button
            type="button"
            onClick={() => setUserStarted(true)}
            aria-label={`Play video: ${title}`}
            className="absolute inset-0 flex w-full h-full items-center justify-center bg-[hsl(var(--nav-theme)/0.15)] transition-colors hover:bg-[hsl(var(--nav-theme)/0.25)]"
          >
            <span className="flex items-center gap-2 rounded-full bg-[hsl(var(--nav-theme))] px-6 py-3 text-white font-semibold shadow-lg">
              <Play className="h-5 w-5 fill-current" />
              Play
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
