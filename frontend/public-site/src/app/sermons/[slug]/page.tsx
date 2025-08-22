"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */ 
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { sermonsDetails as mockSermons, eventsDetails as mockEvents } from "@/lib/org";

export default function SermonEventDetail() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string | undefined);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/api/strapi?endpoint=sermons-and-events&filters[slug][$eq]=${slug}&populate=*`
        );

        if (!res.ok) throw new Error("Strapi not ready");

        const data = await res.json();
        setItem(data.data[0].attributes);
      } catch (err) {
        console.log(`Strapi fetch failed, using mock data: ${err}`);

        const allItems = [...mockSermons, ...mockEvents];
        const found = allItems.find((i) => i.slug === slug);

        if (found) {
          setItem({
            title: found.title,
            date: found.date,
            fullDescription: found.fullDescription,
            video: "video" in found ? found.video : null,
            thumbnail: { data: { attributes: { url: found.thumbnail } } },
        
          });
        }

      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Sermon/Event not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="relative h-[40vh] flex items-center justify-center text-white">
        <Image
          src={item.thumbnail.data.attributes.url.startsWith("http") ? item.thumbnail.data.attributes.url : item.thumbnail.data.attributes.url}
          alt={item.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-900 opacity-60" />
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="text-gray-200">{item.date}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {item.video && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <iframe
              src={item.video}
              title={item.title}
              width="100%"
              height="400"
              className="rounded-lg shadow-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              frameBorder="0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-700 leading-relaxed mb-6"
        >
          {item.fullDescription}
        </motion.p>

        <Link
          href="/sermons"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ← Back to Sermons & Events
        </Link>
      </div>
    </div>
  );
}
