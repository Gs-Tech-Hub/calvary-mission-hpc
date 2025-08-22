"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.includes("/watch")) {
        return u.searchParams.get("v");
      }
      if (u.pathname.includes("/live")) {
        return u.searchParams.get("v");
      }
    }
  } catch (_) {
    return null;
  }
  return null;
}

export default function LiveComments() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    async function resolveVideo() {
      try {
        // Check live stream first
        const liveRes = await fetch('/api/strapi?endpoint=live-streams&filters[isLive][$eq]=true&populate=*');
        if (liveRes.ok) {
          const live = await liveRes.json();
          const entry = live?.data?.[0];
          if (entry?.watchUrl) {
            const id = extractYouTubeId(entry.watchUrl);
            if (id) {
              setVideoId(id);
              setIsLive(true);
              return;
            }
          }
        }

        // Fallback to latest sermon
        const sermonsRes = await fetch('/api/strapi?endpoint=sermons&populate=*&sort[0]=date:desc&pagination[limit]=1');
        if (sermonsRes.ok) {
          const sermons = await sermonsRes.json();
          const sermon = sermons?.data?.[0];
          if (sermon?.youtubeId) {
            setVideoId(sermon.youtubeId);
            setIsLive(false);
          } else if (sermon?.watchUrl) {
            const id = extractYouTubeId(sermon.watchUrl);
            if (id) setVideoId(id);
            setIsLive(false);
          }
        }
      } catch (err) {
        console.warn('Failed to resolve video for comments');
      }
    }

    resolveVideo();
  }, []);

  const embedDomain = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.location.hostname;
  }, []);

  if (!videoId) {
    return <p className="text-sm text-gray-600">Loading comments…</p>;
  }

  if (isLive && embedDomain) {
    return (
      <div className="h-[480px] w-full overflow-hidden rounded-md border">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${embedDomain}`}
          allow="autoplay; encrypted-media"
        />
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-700">
      <p className="mb-3">Comments are available on YouTube.</p>
      <a
        href={`https://www.youtube.com/watch?v=${videoId}&lc=Ug`}
        target="_blank"
        rel="noreferrer noopener"
        className="text-primary underline"
      >
        View comments on YouTube
      </a>
    </div>
  );
}

 