"use client";

import { stats } from "@/lib/org";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function StatsCounter() {
  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.3, 
  });

  return (
    <section ref={ref} className="w-full bg-gray-500 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <p className="text-4xl font-bold text-blue-900">
              {inView && (
                <CountUp end={item.value} duration={2.5} separator="," />
              )}
              {item.suffix && inView && <span>{item.suffix}</span>}
            </p>
            <p className="text-blue-900 font-bold mt-2">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
