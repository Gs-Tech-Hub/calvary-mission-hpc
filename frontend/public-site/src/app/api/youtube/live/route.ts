import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeLiveStreams } from '@/lib/youtube-config';

export async function GET(request: NextRequest) {
  try {
    const liveStreams = await fetchYouTubeLiveStreams();
    return NextResponse.json(liveStreams);
  } catch (error) {
    console.error('Error in YouTube live streams API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live streams' },
      { status: 500 }
    );
  }
}