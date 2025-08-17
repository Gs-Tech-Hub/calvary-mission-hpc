"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { givingInfo as mockData } from "@/lib/org";

export default function GivingPage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/giving-page?populate=*`);
        if (!res.ok) throw new Error("Strapi not ready");
        const json = await res.json();
        setData(json.data.attributes);
      } catch (err) {
        console.log("Strapi fetch failed, using mock data");
        setData(mockData);
      }
    }
    fetchData();
  }, []);

  if (!data) return <p className="text-center py-20">Loading...</p>;

  return (
    <div>

      <section
        className="relative h-[70vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${data.heroImage?.data?.attributes?.url || data.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#0A1D3C]/70" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">{data.heroTitle || data.heroTitle}</h1>
          <p className="max-w-xl mx-auto px-10">{data.heroSubtitle || data.heroSubtitle}</p>
        </div>
      </section>

      <section ref={ref} className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Ways to Give
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {(data.methods || []).map((method: any, index: number) => (
            <div
              key={index}
              className={`bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg text-center transform transition-all duration-500 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <h3 className="text-xl font-semibold text-[#0A1D3C] mb-4">{method.title}</h3>
              <p className="text-gray-700">{method.details}</p>
              {method.link && (
                <Link
                  href={method.link}
                  className="inline-block mt-4 px-6 py-3 bg-[#0A1D3C] text-white rounded-lg hover:bg-blue-900 transition-all"
                >
                  {method.buttonText}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-16 text-center">
        <blockquote className="text-2xl italic text-gray-800 max-w-3xl mx-auto">
          "{data.scripture?.quote}"
        </blockquote>
        <p className="mt-4 text-gray-600">— {data.scripture?.reference}</p>
      </section>

      <section className="py-12 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {data.ctaTitle || "Support Our Mission"}
        </h2>
        <Link
          href={data.ctaLink || mockData.ctaLink}
          className="px-8 py-3 bg-[#0A1D3C] text-white rounded-lg hover:bg-blue-900 transition-all"
        >
          {data.ctaButtonText || "Give Now"}
        </Link>
      </section>
    </div>
  );
}
