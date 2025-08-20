"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */ 
import { useState, useEffect } from "react";
import { org as mockOrg } from "@/lib/org";

export default function Hero() {
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/hero?populate=*`);
        if (!res.ok) throw new Error("Failed to fetch hero data");
        const data = await res.json();
        setHeroData(data.data.attributes);
      } catch (err) {
        console.log(err);
        console.warn("Strapi fetch failed, using mock org hero data");
        setHeroData(mockOrg);
      }
    }

    fetchHero();
  }, []);

  if (!heroData) {
    return (
      <section className="pt-[80px] md:pt-[100px] text-white">
        <p className="text-center">Loading...</p>
      </section>
    );
  }


  function LiveStreamButton() {
    const [liveStream, setLiveStream] = useState<any>(null);

    useEffect(() => {
      async function checkLiveStream() {
        try {
          const res = await fetch('/api/strapi?endpoint=live-streams?filters[isLive][$eq]=true&populate=*');
          if (res.ok) {
            const data = await res.json();
            if (data.data.length > 0) {
              setLiveStream(data.data[0]);
            }
          }
        } catch (err) {
          console.log(err);
          console.log("No live stream available");
        }
      }

      checkLiveStream();
      const interval = setInterval(checkLiveStream, 30000);
      return () => clearInterval(interval);
    }, []);

    if (liveStream) {
      return (
        <a
          href={liveStream.watchUrl}
          className="px-6 py-3 bg-red-600 text-white rounded-md transition-all hover:bg-red-700 flex items-center gap-2"
        >
          🔴 Watch Live Now
        </a>
      );
    }

    return (
      <button className="px-6 py-3 border-2 border-white text-white rounded-md transition-all hover:bg-white hover:text-[#0A1D3C]">
        Live Service
      </button>
    );
  }

  return (
    <section
      className="relative pt-[80px] md:pt-[100px] text-white"
      style={{
        backgroundImage: `url(${heroData.heroImage || "/hero-fallback.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#0A1D3C]/80 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between gap-10">

        <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 relative inline-block">
            <span className="before:absolute before:-left-8 before:top-1/2 before:w-8 before:h-[6px] before:bg-[#dbdbdd] after:absolute after:-right-8 after:top-1/2 after:w-8 after:h-[6px] after:bg-[#dbdbdd] relative">
              {heroData.name || heroData.heroText?.title}
            </span>
          </h1>
          <p className="text-lg mb-6">{heroData.description || heroData.heroText?.subtitle}</p>

          <div className="flex flex-col md:flex-row gap-4">
            <button className="px-6 py-3 border-2 border-white text-white rounded-md transition-all hover:bg-white hover:text-[#0A1D3C]">
              Go to Sermons
            </button>
            <LiveStreamButton />
          </div>

        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="rounded-lg overflow-hidden shadow-lg max-w-sm w-full">
            <video
              className="w-full h-auto rounded-lg"
              controls
              poster="/video-thumbnail.jpg"
            >
              <source src="/sermon-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
