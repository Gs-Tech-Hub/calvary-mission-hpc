"use client";

import { useState, useEffect } from "react";
import { upcomingSermon } from "@/lib/org";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = +new Date(upcomingSermon.date) - +new Date();
      const defaultTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return defaultTime;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <section className="w-full bg-gray-500/50 py-16">
      <div className="max-w-3xl mx-auto text-center shadow-lg rounded-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{upcomingSermon.title}</h2>
        <p className="text-gray-600 mb-6">With {upcomingSermon.speaker}</p>

        <div className="flex justify-center gap-6 mb-6">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-bold text-blue-900">{value.toString().padStart(2, "0")}</p>
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
