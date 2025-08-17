"use client";
import { useState, useEffect } from "react";
import { mediaVideos as mockVideos } from "@/lib/org";

export default function MediaPage() {
  const [mediaVideos, setMediaVideos] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/media-videos?populate=*`);
        if (!res.ok) throw new Error("Strapi not ready");
        const data = await res.json();

        const videos = data.data.map((item: any) => ({
          id: item.id,
          title: item.attributes.title,
          description: item.attributes.description,
          videoUrl: item.attributes.videoUrl,
          thumbnail: `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.thumbnail.data.attributes.url}`,
          duration: item.attributes.duration,
        }));

        setMediaVideos(videos);
        setCurrentVideo(videos[0]);
      } catch (err) {
        console.log("Strapi fetch failed, using mock data");

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
          <iframe
            width="100%"
            height="500"
            src={currentVideo.videoUrl}
            title={currentVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full"
          ></iframe>
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
            <img
              src={video.thumbnail}
              alt={video.title}
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
