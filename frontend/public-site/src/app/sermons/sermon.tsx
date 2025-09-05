"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */ 
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { sermons as mockSermons, eventsDetails as mockEvents } from "@/lib/org";

type SermonItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  viewCount: number;
  slug: string;
  thumbnail: string;
};

export default function SermonsPage() {
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const sermonsRes = await fetch('/api/strapi?endpoint=sermons&populate=*');
        if (!sermonsRes.ok) throw new Error("Strapi not ready");

        const sermonsData = await sermonsRes.json();

        const sermonsFormatted = sermonsData.data.map((item: { 
          id: any; 
          attributes: { 
            title: any; 
            description: any; 
            date: any; 
            views: number;
            slug: any; 
            thumbnail: { 
              data: { 
                attributes: { 
                  url: any; 
                }; 
              }; 
            }; 
          }; 
        }) => ({
          id: item.id,
          title: item.attributes.title,
          description: item.attributes.description,
          date: item.attributes.date,
          viewCount: item.attributes.views || 0,
          slug: item.attributes.slug,
          thumbnail: item.attributes.thumbnail.data.attributes.url.startsWith("http") 
            ? item.attributes.thumbnail.data.attributes.url 
            : item.attributes.thumbnail.data.attributes.url,
        }));

        setSermons(sermonsFormatted);
      } catch (err) {
        console.log("Strapi fetch failed, using mock data");
        setSermons(
          mockSermons.map((s, i) => ({
            id: s.id || i,
            title: s.title,
            description: s.description,
            date: s.date,
            viewCount: 0,
            slug: s.link.split("/").pop() as string,
            thumbnail: s.image,
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

      <section className="max-w-8xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-lg rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <Image
                src={sermon.thumbnail}
                alt={sermon.title}
                width={600}
                height={400}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">{sermon.title}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{sermon.date}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {sermon.viewCount}
                  </p>
                </div>
                <p className="text-gray-600 mt-2">{sermon.description}</p>
                <Link
                  href={`/sermons/${sermon.slug}`}
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
