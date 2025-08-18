"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CalloutBanner() {
  const [banner, setBanner] = useState<any>(null);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/callout-banner`
        );
        if (!res.ok) throw new Error("Failed to fetch CalloutBanner data");
        const data = await res.json();
        setBanner(data.data.attributes);
      } catch (err) {
        console.warn("Strapi fetch failed, using default banner");

        setBanner({
          heading: "Welcome to Our Church",
          subheading: "Join us for services and events",
          buttonText: "Learn More",
        });
      }
    }

    fetchBanner();
  }, []);

  if (!banner) {
    return (
      <section className="py-12 px-4 flex justify-center">
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gray-100 backdrop-blur-sm rounded-lg shadow-lg max-w-3xl w-full text-center py-10 px-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {banner.heading}
        </h2>
        <p className="text-gray-600 mb-6">{banner.subheading}</p>
        <Button className="items-center gap-2 px-6 py-3 bg-[#0A1D3C] text-white font-semibold rounded-lg hover:bg-blue-900 transition-all">
          {banner.buttonText}
        </Button>
      </motion.div>
    </section>
  );
}
