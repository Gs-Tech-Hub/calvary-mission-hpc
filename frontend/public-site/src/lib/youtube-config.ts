export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
export const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '';

export const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Cache configuration
const CACHE_DURATION = 60000; // 1 minute in milliseconds
let cachedStreams: YouTubeLiveStream[] | null = null;
let lastFetchTime = 0;

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
  console.log('Starting fetchYouTubeLiveStreams...');

  // Check cache first
  const now = Date.now();
  if (cachedStreams && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('Returning cached live streams');
    return cachedStreams;
  }
  
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    console.error('Missing credentials:', {
      hasApiKey: !!YOUTUBE_API_KEY,
      hasChannelId: !!YOUTUBE_CHANNEL_ID
    });
    throw new Error('YouTube API key or Channel ID not configured');
  }

  const searchParams = new URLSearchParams({
    part: 'snippet,id',
    channelId: YOUTUBE_CHANNEL_ID,
    type: 'video',
    eventType: 'live',
    key: YOUTUBE_API_KEY,
  });

  console.log('Making YouTube API request to:', YOUTUBE_API_BASE_URL);
  
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?${searchParams.toString()}`
    );

    console.log('YouTube API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('YouTube API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch YouTube live streams: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('YouTube API response data:', {
      kind: data.kind,
      etag: data.etag,
      pageInfo: data.pageInfo,
      itemCount: data.items?.length
    });

    // Update cache
    const streams = data.items?.length ? data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      videoUrl: `https://www.youtube.com/embed/${item.id.videoId}?rel=0&modestbranding=1&autoplay=1`,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      isLive: item.snippet.liveBroadcastContent === 'live'
    })) : [];

    cachedStreams = streams;
    lastFetchTime = Date.now();

    if (streams.length === 0) {
      console.log('No live streams found, cache will prevent reloading for', CACHE_DURATION / 1000, 'seconds');
    }

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      videoUrl: `https://www.youtube.com/embed/${item.id.videoId}?rel=0&modestbranding=1&autoplay=1`,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      isLive: item.snippet.liveBroadcastContent === 'live',
      concurrentViewers: item.liveStreamingDetails?.concurrentViewers,
    }));
  } catch (error) {
    console.error('Error fetching YouTube live streams:', error);
    throw error;
  }
}