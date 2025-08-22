"use client";
import Image from "next/image";
/* eslint-disable @typescript-eslint/no-explicit-any */ 
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const mockSermons = [
  {
    id: 1,
    attributes: {
      title: "Faith in Action",
      description: "An inspiring sermon on living out your faith.",
      date: "2025-08-20",
      preacher: "Pastor Ada",
      link: "/sermons/faith-in-action",
      image: { data: { attributes: { url: "/placeholder.jpg" } } },
    },
  },
  {
    id: 2,
    attributes: {
      title: "Hope and Healing",
      description: "Discover the power of hope in difficult times.",
      date: "2025-08-13",
      preacher: "Pastor John",
      link: "/sermons/hope-and-healing",
      image: { data: { attributes: { url: "/placeholder.jpg" } } },
    },
  },
];

export default function RecentSermons() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const res = await fetch('/api/strapi?endpoint=sermons&populate=*&sort[0]=date:desc&pagination[limit]=6');
        if (!res.ok) throw new Error("Failed to fetch sermons");
        const data = await res.json();

        const formattedSermons = data.data.map((sermon: any) => ({
          id: sermon.id,
          attributes: {
            title: sermon.title,
            description: sermon.description?.[0]?.children?.[0]?.text || "Sermon description",
            date: new Date(sermon.date).toLocaleDateString(),
            preacher: sermon.speaker,
            contentType: sermon.contentType || 'video',
            youtubeId: sermon.youtubeId,
            textContent: sermon.textContent,
            link: `/sermons/${sermon.slug || sermon.id}`,
            image: {
              data: {
                attributes: {
                  url: sermon.thumbnail?.data?.url || "/placeholder.jpg",
                  width: sermon.thumbnail?.data?.attributes?.width || 100,
                  height: sermon.thumbnail?.data?.attributes?.height || 100,  
                }
              }
            },
          },
        }));

        setSermons(formattedSermons);
      } catch (error) {
        console.warn("Fetching sermons failed, using mock data.", error);
        setSermons(mockSermons);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#0A1D3C] py-16 text-center text-white">
        <p>Loading recent sermons...</p>
      </section>
    );
  }

  return (
    <section ref={ref} className="bg-[#0A1D3C] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Recent Sermons
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {sermons.map((sermon, index) => {
            const attributes = sermon.attributes || {};
            const imgUrl =
              attributes.image?.data?.attributes?.url || "/placeholder.jpg";

            return (
              <div
                key={sermon.id}
                className={`bg-white/40 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Image
                  src={imgUrl.startsWith("http") ? imgUrl : imgUrl}
                  alt={attributes.title}
                  className="w-full h-56 object-cover"
                  width={attributes.image?.data?.attributes?.width || 100}
                  height={attributes.image?.data?.attributes?.height || 100}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {attributes.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {attributes.date} • {attributes.preacher}
                  </p>
                  <p className="text-gray-700 mt-3">{attributes.description}</p>
                  {attributes.link && (
                    <a
                      href={attributes.link}
                      className="inline-block mt-4 text-blue-800 font-medium hover:underline"
                    >
                      Read More →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
