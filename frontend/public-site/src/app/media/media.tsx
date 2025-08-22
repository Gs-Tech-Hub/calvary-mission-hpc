"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */ 
import { useState, useEffect } from "react";
import { mediaVideos as mockVideos } from "@/lib/org";
import Image from "next/image";

export default function MediaPage() {
  const [mediaVideos, setMediaVideos] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        let allVideos: any[] = [];

        // First, check for live streams
        const liveRes = await fetch('/api/strapi?endpoint=live-streams?filters[isLive][$eq]=true&populate=*');
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          if (liveData.data.length > 0) {
            const live = liveData.data[0];
            allVideos.push({
              id: `live-${liveData.data[0].id}`,
              title: `🔴 ${live.title} (LIVE)`,
              description: "Currently streaming live",
              videoUrl: live.watchUrl,
              thumbnail: "/placeholder.jpg",
              duration: "LIVE",
              isLive: true
            });
          }
        }

        // Then get regular sermons
        const sermonsRes = await fetch('/api/strapi?endpoint=sermons&populate=*&sort[0]=date:desc');
        if (sermonsRes.ok) {
          const sermonsData = await sermonsRes.json();
          const sermonVideos = sermonsData.data.map((sermon: any) => ({
            id: sermon.id,
            title: sermon.title,
            description: sermon.description?.[0]?.children?.[0]?.text || "Sermon description",
            videoUrl: sermon.youtubeId ? `https://www.youtube.com/embed/${sermon.youtubeId}` : '#',
            thumbnail: sermon.thumbnail?.data?.url || "/placeholder.jpg",
            duration: "Sermon",
            contentType: sermon.contentType,
            textContent: sermon.textContent,
            isLive: false
          }));
          allVideos = [...allVideos, ...sermonVideos];
        }

        setMediaVideos(allVideos.length > 0 ? allVideos : mockVideos);
        setCurrentVideo(allVideos.length > 0 ? allVideos[0] : mockVideos[0]);

      } catch (err) {
        console.log(`Strapi fetch failed, using mock data: ${err}`);
        setMediaVideos(mockVideos);
        setCurrentVideo(mockVideos[0]);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading videos...</div>;
  if (!currentVideo) return <div className="p-6 text-center">No videos available.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 mt-30">
      <div className="flex-1">
        <div className="rounded-lg overflow-hidden shadow-lg bg-white">
          {currentVideo.contentType === 'text' ? (
            <div className="w-full h-[500px] p-8 bg-gray-50 overflow-y-auto">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: currentVideo.textContent || 'Text content not available'
                }}
              />
            </div>
          ) : (
            <iframe
              width="100%"
              height="500"
              src={currentVideo.videoUrl}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
            ></iframe>
          )}
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{currentVideo.title}</h2>
        <p className="mt-2 text-gray-600">{currentVideo.description}</p>
      </div>

      <div className="lg:w-96 flex flex-col gap-4 mt-20">
        {mediaVideos.map((video) => (
          <div
            key={video.id}
            className="flex gap-3 items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
            onClick={() => setCurrentVideo(video)}
          >
            <Image
              src={video.thumbnail}
              alt={video.title}
              width={100}
              height={100}
              className="w-32 h-20 object-cover rounded-lg"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">{video.title}</span>
              <span className="text-sm text-gray-500">{video.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
