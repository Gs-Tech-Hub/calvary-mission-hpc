"use client";

import { useState } from "react";
import { churchTV } from "@/lib/org";
import { useInView } from "react-intersection-observer";
import { FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function ChurchTV() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [showVideo, setShowVideo] = useState(false);

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
          <div className="relative cursor-pointer" onClick={() => setShowVideo(true)}>
            <img
              src={churchTV.nowPlaying.videoThumbnail}
              alt={churchTV.nowPlaying.title}
              className="w-full h-96 object-cover"
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6">
              <h3 className="text-white text-2xl font-bold mb-4">
                {churchTV.nowPlaying.title}
              </h3>
              <p className="text-white max-w-xl mb-6">
                {churchTV.nowPlaying.description}
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#0A1D3C] text-white font-semibold rounded-lg hover:bg-blue-900 transition-all">
                <FaPlay /> Watch Now
              </button>
            </div>
          </div>
        </div>

        {/* More to Watch */}
        <div className="grid gap-6 md:grid-cols-3">
          {churchTV.moreToWatch.map((video, index) => (
            <a
              key={video.id}
              href={video.link}
              className={`bg-white/30 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
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
            </a>
          ))}
        </div>
      </div>

      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[90%] max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={churchTV.nowPlaying.videoUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen"
            ></iframe>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            >
              <IoClose />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
