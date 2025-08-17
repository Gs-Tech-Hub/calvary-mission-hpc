"use client";

import { useState, useEffect } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const mockSermon = {
  title: "Sunday Morning Service",
  speaker: "Pastor Ada",
  date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
};

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    async function checkContent() {
      try {
        // First check if there's a live stream
        const liveRes = await fetch('/api/strapi?endpoint=live-streams&filters[isLive][$eq]=true&populate=*');
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          if (liveData.data.length > 0) {
            setContent({
              ...liveData.data[0],
              isLive: true,
              title: liveData.data[0].title || "Live Service"
            });
            return;
          }
        }

        // If no live stream, fetch upcoming sermon (you'll need to create this content type)
        // For now, using mock data
        setContent({ ...mockSermon, isLive: false });
      } catch (err) {
        console.warn("Strapi fetch failed, using mock sermon");
        setContent({ ...mockSermon, isLive: false });
      }
    }

    checkContent();
    const interval = setInterval(checkContent, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!content?.date || content.isLive) return;

    const calculateTimeLeft = (): TimeLeft => {
      const difference = +new Date(content.date) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [content]);

  if (!content) return null;

  // Show live stream banner
  if (content.isLive) {
    return (
      <section className="w-full bg-red-600/90 py-16">
        <div className="max-w-3xl mx-auto text-center shadow-lg rounded-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-white mb-2">🔴 {content.title}</h2>
          <p className="text-white mb-6">LIVE NOW</p>
          <a
            href={content.watchUrl}
            className="px-6 py-3 bg-white text-red-600 rounded-lg shadow hover:bg-gray-100 transition inline-block"
          >
            Join Live Stream
          </a>
        </div>
      </section>
    );
  }

  // Show countdown for upcoming sermon
  if (!timeLeft) return null;

  return (
    <section className="w-full bg-gray-500/50 py-16">
      <div className="max-w-3xl mx-auto text-center shadow-lg rounded-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-600 mb-6">With {content.speaker}</p>

        <div className="flex justify-center gap-6 mb-6">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-bold text-blue-900">
                {value.toString().padStart(2, "0")}
              </p>
              <p className="text-sm uppercase text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <button className="px-6 py-3 bg-[#0A1D3C] text-white rounded-lg shadow hover:bg-blue-800 transition">
          Join This Sermon
        </button>
      </div>
    </section>
  );
}