"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LiveComments from "../../components/LiveComments";
import { useState, useEffect } from "react";

export default function LivePage() {
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      try {
        // First, check for live streams
        const liveRes = await fetch('/api/strapi?endpoint=live-streams&filters[isLive][$eq]=true&populate=*');
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          if (liveData.data.length > 0) {
            const live = liveData.data[0];
            setCurrentVideo({
              id: `live-${live.id}`,
              title: `🔴 ${live.title} (LIVE)`,
              description: "Currently streaming live",
              videoUrl: live.watchUrl,
              isLive: true
            });
            setLoading(false);
            return;
          }
        }

        // Fallback to latest sermon
        const sermonsRes = await fetch('/api/strapi?endpoint=sermons&populate=*&sort[0]=date:desc&pagination[limit]=1');
        if (sermonsRes.ok) {
          const sermonsData = await sermonsRes.json();
          if (sermonsData.data.length > 0) {
            const sermon = sermonsData.data[0];
            setCurrentVideo({
              id: sermon.id,
              title: sermon.title,
              description: sermon.description?.[0]?.children?.[0]?.text || "Latest sermon",
              videoUrl: sermon.youtubeId ? `https://www.youtube.com/embed/${sermon.youtubeId}` : '#',
              isLive: false
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

  if (loading) {
    return (
      <section className="pt-[100px] pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-[100px] pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Live Service</h1>
          <p className="text-gray-600 mt-2">Join the stream and engage with the community.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl overflow-hidden shadow bg-white">
              {currentVideo ? (
                <iframe
                  width="100%"
                  height="400"
                  src={currentVideo.videoUrl}
                  title={currentVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full"
                ></iframe>
              ) : (
                <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
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
              <Link href="/giving">
                <Button className="w-full h-11" size="lg">Donate</Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

 