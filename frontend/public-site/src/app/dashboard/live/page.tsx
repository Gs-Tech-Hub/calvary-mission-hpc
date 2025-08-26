"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LiveComments from "@/components/LiveComments";
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function DashboardLivePage() {
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const liveRes = await fetch('/api/strapi?endpoint=live-streams&filters[isLive][$eq]=true&populate=*');
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          if (liveData.data.length > 0) {
            const live = liveData.data[0];
            let videoUrl = live.watchUrl;
            if (live.watchUrl && live.watchUrl.includes('youtube.com/watch?v=')) {
              const videoId = live.watchUrl.split('v=')[1];
              videoUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
            }
            setCurrentVideo({
              id: `live-${live.id}`,
              title: `🔴 ${live.title} (LIVE)`,
              description: "Currently streaming live",
              videoUrl,
              isLive: true,
            });
            setLoading(false);
            return;
          }
        }

        const sermonsRes = await fetch('/api/strapi?endpoint=sermons&populate=*&sort[0]=date:desc&pagination[limit]=1');
        if (sermonsRes.ok) {
          const sermonsData = await sermonsRes.json();
          if (sermonsData.data.length > 0) {
            const sermon = sermonsData.data[0];
            setCurrentVideo({
              id: sermon.id,
              title: sermon.title,
              description: sermon.description?.[0]?.children?.[0]?.text || "Latest sermon",
              videoUrl: sermon.youtubeId ? `https://www.youtube.com/embed/${sermon.youtubeId}?rel=0&modestbranding=1` : '#',
              isLive: false,
            });
          }
        }
      } catch (err) {
        console.log(`Failed to fetch video: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <section className="pt-4 pb-4 bg-gray-50">
              <div className="text-center">Loading...</div>
            </section>
          ) : (
            <section className="pt-4 pb-4 bg-gray-50">
              <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Live Service</h1>
                <p className="text-gray-600 mt-2">Join the stream and engage with the community.</p>
              </header>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-xl overflow-hidden shadow bg-white">
                    {currentVideo ? (
                      <iframe
                        width="100%"
                        height="400"
                        src={currentVideo.videoUrl}
                        title={currentVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full"
                        frameBorder="0"
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                      ></iframe>
                    ) : (
                      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">No video available</p>
                      </div>
                    )}
                    {currentVideo && (
                      <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900">{currentVideo.title}</h2>
                        <p className="mt-2 text-gray-600">{currentVideo.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl shadow bg-white p-4 md:p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Live Chat</h2>
                    <LiveComments />
                  </div>
                </div>

                <aside className="space-y-6">
                  <div className="rounded-xl shadow bg-white p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Support the Mission</h3>
                    <p className="text-gray-600 mb-4">Your generosity helps us reach more people.</p>
                    <Link href="/dashboard/giving">
                      <Button className="w-full h-11" size="lg">Donate</Button>
                    </Link>
                  </div>
                </aside>
              </div>
            </section>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}


