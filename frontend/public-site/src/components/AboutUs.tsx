"use client";

import { aboutUs } from "@/lib/org";
import { useInView } from "react-intersection-observer";

export default function AboutUs() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#0A1D3C] py-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        
        <div
          className={`transition-all duration-700 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            {aboutUs.title}
          </h2>
          <p className="text-white mb-6">{aboutUs.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {aboutUs.features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white/40 backdrop-blur-md p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-white">{feature.description}</p>
              </div>
            ))}
          </div>

          <a
            href={aboutUs.ctaLink}
            className="inline-block px-6 py-3 border-2 border-white text-white rounded-md transition-all hover:bg-white hover:text-[#0A1D3C]"
            style={{ boxShadow: "0 0 15px #2563eb" }}
          >
            {aboutUs.ctaText}
          </a>
        </div>

        <div
          className={`grid grid-cols-2 gap-4 transition-all duration-700 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          {aboutUs.gallery.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden bg-white rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-40 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
