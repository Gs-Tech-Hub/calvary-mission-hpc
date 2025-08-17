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
  const [sermon, setSermon] = useState<any>(null);


  useEffect(() => {
    async function fetchSermon() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upcoming-sermon`
        );
        if (!res.ok) throw new Error("Failed to fetch upcoming sermon");
        const data = await res.json();
        setSermon(data.data.attributes);
      } catch (err) {
        console.warn("Strapi fetch failed, using mock sermon");
        setSermon(mockSermon);
      }
    }

    fetchSermon();
  }, []);


  useEffect(() => {
    if (!sermon?.date) return;

    const calculateTimeLeft = (): TimeLeft => {
      const difference = +new Date(sermon.date) - +new Date();
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
  }, [sermon]);

  if (!sermon || !timeLeft) return null;

  return (
    <section className="w-full bg-gray-500/50 py-16">
      <div className="max-w-3xl mx-auto text-center shadow-lg rounded-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{sermon.title}</h2>
        <p className="text-gray-600 mb-6">With {sermon.speaker}</p>

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
