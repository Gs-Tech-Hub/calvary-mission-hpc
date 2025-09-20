export const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
export const YOUTUBE_CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || '';

export const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeLiveStream {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  isLive: boolean;
  actualStartTime?: string;
  scheduledStartTime?: string;
  concurrentViewers?: number;
}

export async function fetchYouTubeLiveStreams(): Promise<YouTubeLiveStream[]> {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    throw new Error('YouTube API key or Channel ID not configured');
  }

  const searchParams = new URLSearchParams({
    part: 'snippet,id,liveStreamingDetails',
    channelId: YOUTUBE_CHANNEL_ID,
    type: 'video',
    eventType: 'live',
    key: YOUTUBE_API_KEY,
  });

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?${searchParams.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch YouTube live streams');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      videoUrl: `https://www.youtube.com/embed/${item.id.videoId}?rel=0&modestbranding=1&autoplay=1`,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      isLive: true,
      actualStartTime: item.liveStreamingDetails?.actualStartTime,
      scheduledStartTime: item.liveStreamingDetails?.scheduledStartTime,
      concurrentViewers: item.liveStreamingDetails?.concurrentViewers,
    }));
  } catch (error) {
    console.error('Error fetching YouTube live streams:', error);
    throw error;
  }
}