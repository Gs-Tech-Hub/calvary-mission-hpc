"use client";

import { useEffect, useState } from "react";
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
    let mounted = true;
    let pollInterval: NodeJS.Timeout;
    const POLL_INTERVAL = 60000; // Poll every 1 minute
    
    // Initial fetch
    fetchVideos();
    
    // Set up polling
    pollInterval = setInterval(fetchVideos, POLL_INTERVAL);
    
    // Cleanup function
    return () => {
      mounted = false;
      clearInterval(pollInterval);
    };
    
    async function fetchVideos() {
      if (!mounted) return;
      
      try {
        setError(null);
        
        // Only show loading state on initial load
        if (liveStreams.length === 0) {
          setLoading(true);
        }

        // First try to fetch YouTube live streams
        const youtubeRes = await fetch('/api/youtube/live');
        if (!mounted) return;
        
        if (!youtubeRes.ok) {
          throw new Error('Failed to fetch YouTube streams');
        }

        const youtubeStreams = await youtubeRes.json();
        if (!mounted) return;
        
        if (Array.isArray(youtubeStreams)) {
          setLiveStreams(youtubeStreams);
          if (youtubeStreams.length > 0 && !currentVideo) {
            setCurrentVideo(youtubeStreams[0]);
          }
          setLoading(false);
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">YouTube Live Streams</h1>
                <p className="text-gray-600 mt-2">Watch our live YouTube broadcasts and engage with the community.</p>
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


