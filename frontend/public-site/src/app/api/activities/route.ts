import { NextResponse } from 'next/server';
import { formatRelativeTime } from '@/lib/utils';

// Activity Type Definition
export type Activity = {
  id: number;
  type: 'sermon' | 'event' | 'prayer' | 'donation' | 'news' | 'bible-study' | 'live-tv';
  title: string;
  description: string;
  time: string;
  user: string;
  action: 'View' | 'Details' | 'Receipt' | 'Read' | 'Study' | 'Watch';
};

export async function GET() {
  try {
    // In a real application, this would fetch from your database
    // For now, we'll fetch from Strapi CMS
    const response = await fetch(`${process.env.STRAPI_API_URL}/api/activities?populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }

    const data = await response.json();

    // Transform the data to match our Activity type
    const activities = data.data.map((item: any) => ({
      id: item.id,
      type: item.attributes.type,
      title: item.attributes.title,
      description: item.attributes.description,
      time: formatRelativeTime(item.attributes.createdAt),
      user: item.attributes.user,
      action: item.attributes.action,
    }));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
