"use client";

import { sermons } from "@/lib/org";
import { useInView } from "react-intersection-observer";

export default function RecentSermons() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#0A1D3C] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Recent Sermons
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {sermons.map((sermon, index) => (
            <div
              key={sermon.id}
              className={`bg-white/40 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <img
                src={sermon.image}
                alt={sermon.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {sermon.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {sermon.date} • {sermon.preacher}
                </p>
                <p className="text-gray-700 mt-3">{sermon.description}</p>
                <a
                  href={sermon.link}
                  className="inline-block mt-4 text-blue-800 font-medium hover:underline"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
