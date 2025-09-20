"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LiveComments from "@/components/LiveComments";
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import type { YouTubeLiveStream } from '@/lib/youtube-config';

export default function DashboardLivePage() {
  const [liveStreams, setLiveStreams] = useState<YouTubeLiveStream[]>([]);
  const [currentVideo, setCurrentVideo] = useState<YouTubeLiveStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setError(null);
        setLoading(true);

        // First try to fetch YouTube live streams
        const youtubeRes = await fetch('/api/youtube/live');
        if (!youtubeRes.ok) {
          throw new Error('Failed to fetch YouTube streams');
        }

        const youtubeStreams = await youtubeRes.json();
        if (Array.isArray(youtubeStreams) && youtubeStreams.length > 0) {
          setLiveStreams(youtubeStreams);
          if (!currentVideo) {
            setCurrentVideo(youtubeStreams[0]);
          }
          setLoading(false);
          return;
        }

        // Fallback to Strapi live streams
        const liveRes = await fetch('/api/strapi?endpoint=live-streams&filters[isLive][$eq]=true&populate=*');
        if (!liveRes.ok) {
          throw new Error('Failed to fetch Strapi live streams');
        }

        const liveData = await liveRes.json();
        
        interface StrapiLiveStream {
          id: string;
          title: string;
          description: string;
          watchUrl: string;
        }
        
        const streams = liveData.data.map((live: StrapiLiveStream) => {
          let videoUrl = live.watchUrl;
          let videoId = '';
          if (live.watchUrl && live.watchUrl.includes('youtube.com/watch?v=')) {
            videoId = live.watchUrl.split('v=')[1];
            videoUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
          }
          return {
            id: `live-${live.id}`,
            title: `🔴 ${live.title} (LIVE)`,
            description: live.description || "Currently streaming live",
            videoUrl,
            thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '',
            isLive: true,
          };
        });

        setLiveStreams(streams);
        if (streams.length > 0 && !currentVideo) {
          setCurrentVideo(streams[0]);
          setLoading(false);
          return;
        }

        // If no live streams, fetch latest sermon
        const sermonsRes = await fetch('/api/strapi?endpoint=sermons&populate=*&sort[0]=date:desc&pagination[limit]=1');
        if (!sermonsRes.ok) {
          throw new Error('Failed to fetch latest sermon');
        }

        const sermonsData = await sermonsRes.json();
        
        interface StrapiSermon {
          id: string;
          title: string;
          description: { children: { text: string }[] }[];
          youtubeId: string;
        }
        
        if (sermonsData.data.length > 0) {
          const sermon = sermonsData.data[0] as StrapiSermon;
          const thumbnailUrl = `https://img.youtube.com/vi/${sermon.youtubeId}/hqdefault.jpg`;
          setCurrentVideo({
            id: sermon.id,
            title: sermon.title,
            description: sermon.description?.[0]?.children?.[0]?.text || "Latest sermon",
            videoUrl: `https://www.youtube.com/embed/${sermon.youtubeId}?rel=0&modestbranding=1`,
            thumbnailUrl,
            isLive: false,
          });
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [currentVideo]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {loading ? (
            <section className="pt-4 pb-4 bg-gray-50">
              <div className="text-center">
                <div className="animate-pulse">Loading...</div>
              </div>
            </section>
          ) : (
            <section className="pt-4 pb-4 bg-gray-50">
              <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Live Streams</h1>
                <p className="text-gray-600 mt-2">Watch live services and engage with the community.</p>
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
                        <h2 className="text-2xl font-bold text-gray-900">
                          {currentVideo.isLive && '🔴 '}{currentVideo.title}
                        </h2>
                        <p className="mt-2 text-gray-600">{currentVideo.description}</p>
                      </div>
                    )}
                  </div>

                  {liveStreams.length > 1 && (
                    <div className="rounded-xl shadow bg-white p-4">
                      <h3 className="text-lg font-semibold mb-4">Other Live Streams</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {liveStreams
                          .filter(stream => stream.id !== currentVideo?.id)
                          .map(stream => (
                            <button
                              key={stream.id}
                              onClick={() => setCurrentVideo(stream)}
                              className="text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="aspect-video relative rounded-lg overflow-hidden mb-2">
                                <img
                                  src={stream.thumbnailUrl}
                                  alt={stream.title}
                                  className="w-full h-full object-cover"
                                />
                                {stream.isLive && (
                                  <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <h4 className="font-medium text-gray-900 line-clamp-2">{stream.title}</h4>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="rounded-xl shadow bg-white p-4 md:p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Live Chat</h2>
                    <LiveComments />
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}


