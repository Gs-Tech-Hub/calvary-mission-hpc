import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeLiveStreams } from '@/lib/youtube-config';

export async function GET(request: NextRequest) {
  console.log('Starting YouTube live streams API request...');
  
  try {
    // Log environment variable status
    console.log('Checking environment variables...');
    console.log('YOUTUBE_API_KEY exists:', !!process.env.YOUTUBE_API_KEY);
    console.log('YOUTUBE_CHANNEL_ID exists:', !!process.env.YOUTUBE_CHANNEL_ID);
    
    // Validate environment variables first
    if (!process.env.YOUTUBE_API_KEY) {
      console.error('YouTube API Key not configured');
      return NextResponse.json(
        { error: 'YouTube API Key not configured' },
        { status: 500 }
      );
    }

    if (!process.env.YOUTUBE_CHANNEL_ID) {
      console.error('YouTube Channel ID not configured');
      return NextResponse.json(
        { error: 'YouTube Channel ID not configured' },
        { status: 500 }
      );
    }

    console.log('Attempting to fetch YouTube live streams...');
    const liveStreams = await fetchYouTubeLiveStreams();
    console.log('Successfully fetched live streams:', 
      liveStreams.map(stream => ({
        id: stream.id,
        title: stream.title,
        isLive: stream.isLive
      }))
    );
    
    return NextResponse.json(liveStreams);
  } catch (error) {
    console.error('Error in YouTube live streams API:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch live streams';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}