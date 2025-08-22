"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */ 
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { sermons as mockSermons, eventsDetails as mockEvents } from "@/lib/org";

type ListItem = {

  id: number;
  title: string;
  description: string;
  date: string;
  category: "Sermon" | "Event";
  slug: string;
  thumbnail: string;
};

export default function SermonsEventsPage() {
  const [filter, setFilter] = useState("All");
  const [sermons, setSermons] = useState<ListItem[]>([]);
  const [events, setEvents] = useState<ListItem[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sermonsRes, eventsRes] = await Promise.all([
          fetch('/api/strapi?endpoint=sermons&populate=*'),
          fetch('/api/strapi?endpoint=events&populate=*'),
        ]);

        if (!sermonsRes.ok || !eventsRes.ok) throw new Error("Strapi not ready");

        const [sermonsData, eventsData] = await Promise.all([sermonsRes.json(), eventsRes.json()]);

        const sermonsFormatted = sermonsData.data.map((item: { id: any; attributes: { title: any; description: any; date: any; slug: any; thumbnail: { data: { attributes: { url: any; }; }; }; }; }) => ({
          id: item.id,
          title: item.attributes.title,
          description: item.attributes.description,
          date: item.attributes.date,
          category: "Sermon",
          slug: item.attributes.slug,
          thumbnail: item.attributes.thumbnail.data.attributes.url.startsWith("http") ? item.attributes.thumbnail.data.attributes.url : item.attributes.thumbnail.data.attributes.url,
        }));

        const eventsFormatted = eventsData.data.map((item: { id: any; attributes: { title: any; description: any; date: any; slug: any; thumbnail: { data: { attributes: { url: any; }; }; }; }; }) => ({
          id: item.id,
          title: item.attributes.title,
          description: item.attributes.description,
          date: item.attributes.date,
          category: "Event",
          slug: item.attributes.slug,
          thumbnail: item.attributes.thumbnail.data.attributes.url.startsWith("http") ? item.attributes.thumbnail.data.attributes.url : item.attributes.thumbnail.data.attributes.url,
        }));

        setSermons(sermonsFormatted);
        setEvents(eventsFormatted);
      } catch (err) {
        console.log("Strapi fetch failed, using mock data");
        setSermons(
          mockSermons.map((s, i) => ({
            id: s.id || i,
            title: s.title,
            description: s.description,
            date: s.date,
            category: "Sermon",
            slug: s.link.split("/").pop() as string,
            thumbnail: s.image,
          }))
        );

        setEvents(
          mockEvents.map((e) => ({
            id: e.id,
            title: e.title,
            description: e.fullDescription,
            date: e.date,
            category: "Event",
            slug: e.slug,
            thumbnail: e.thumbnail,
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredSermons = filter === "All" ? [...sermons, ...events] : filter === "Sermon" ? sermons : events;

  if (loading) return <div className="p-6">Loading sermons & events...</div>;

  return (
    <div className="bg-white">
      <section
        className="relative h-[70vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url('/hero-image.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#0A1D3C]/80 z-0"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold relative inline-block">
            <span className="before:content-[''] before:absolute before:-left-10 before:top-1/2 before:w-9 before:h-[2px] before:bg-white
                            after:content-[''] after:absolute after:-right-10 after:top-1/2 after:w-9 after:h-[2px] after:bg-white">
              Sermons & Events
            </span>
          </h1>
          <p className="mt-2 text-gray-200">Inspiring messages and upcoming gatherings</p>
        </div>
      </section>

      <div className="flex justify-center gap-4 py-6">
        {["All", "Sermon", "Event"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full border transition ${filter === cat ? "bg-[#0A1D3C] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="max-w-8xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {filteredSermons.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-lg rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={600}
                height={400}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.date}</p>
                <p className="text-gray-600 mt-2">{item.description}</p>
                <Link
                  href={`/sermons/${item.slug}`}
                  className="mt-3 inline-block text-blue-600 hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
