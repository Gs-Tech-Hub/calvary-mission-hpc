"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */ 
import { useState, useEffect } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const mockStats = [
  { id: 1, value: 1200, suffix: "+", label: "Members" },
  { id: 2, value: 350, suffix: "", label: "Sermons" },
  { id: 3, value: 45, suffix: "", label: "Events" },
  { id: 4, value: 20, suffix: "K", label: "Lives Streamed" },
];

export default function StatsCounter() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/stats`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();

        const mappedStats = data?.data?.map((item: any) => ({
          id: item.id,
          value: item?.attributes?.value || 0,
          suffix: item?.attributes?.suffix || "",
          label: item?.attributes?.label || "",
        })) || [];

        setStats(mappedStats.length ? mappedStats : mockStats);
      } catch (err) {
        console.warn("Fetching stats failed, using mock data.", err);
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-gray-500 py-16 text-center text-white">
        <p>Loading stats...</p>
      </section>
    );
  }

  return (
    <section ref={ref} className="w-full bg-gray-500 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <p className="text-4xl font-bold text-blue-900">
              {inView && <CountUp end={item.value} duration={2.5} separator="," />}
              {item.suffix && inView && <span>{item.suffix}</span>}
            </p>
            <p className="text-blue-900 font-bold mt-2">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
