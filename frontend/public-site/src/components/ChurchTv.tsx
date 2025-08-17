"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { churchTV as mockChurchTV } from "@/lib/org"; 

export default function ChurchTV() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [churchTV, setChurchTV] = useState<any>(null);

  useEffect(() => {
    async function fetchChurchTV() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/church-tv?populate=*`
        );
        if (!res.ok) throw new Error("Failed to fetch ChurchTV data");
        const data = await res.json();
        setChurchTV(data.data.attributes);
      } catch (err) {
        console.warn("Strapi fetch failed, using mock ChurchTV data");
        setChurchTV(mockChurchTV);
      }
    }

    fetchChurchTV();
  }, []);

  if (!churchTV) {
    return (
      <section className="bg-gray-100 py-16 text-center">
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section ref={ref} className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Watch Live & On Demand
        </h2>

        <div
          className={`rounded-lg overflow-hidden shadow-lg mb-12 transform transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative w-full aspect-video">
            <iframe
              src={`${churchTV.nowPlaying?.videoUrl}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; fullscreen"
            ></iframe>
          </div>
          <div className="bg-[#0A1D3C] text-white p-6">
            <h3 className="text-2xl font-bold mb-2">
              {churchTV.nowPlaying?.title}
            </h3>
            <p className="mb-4">{churchTV.nowPlaying?.description}</p>
            <Link
              href="/media"
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#0A1D3C] font-semibold rounded-lg hover:bg-gray-200 transition-all w-fit"
            >
              <FaPlay /> View All Media
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {churchTV.moreToWatch?.map((video: any, index: number) => (
            <Link
              key={video.id}
              href={`/media?video=${encodeURIComponent(video.id)}`}
              className={`bg-white/30 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative">
                <img
                  src={video.thumbnail?.data?.attributes?.url}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <FaPlay className="text-white text-3xl" />
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {video.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
