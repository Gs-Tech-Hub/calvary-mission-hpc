'use client';

import { createContext, useContext, ReactNode } from 'react';
import useSWR, { KeyedMutator } from 'swr';

export interface ActivityItem {
  id: number;
  type: 'sermon' | 'event' | 'prayer' | 'donation' | 'news' | 'bible-study' | 'live-tv';
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user?: string;
}

interface ActivityContextType {
  activities: ActivityItem[];
  isLoading: boolean;
  error: Error | null;
  mutate: KeyedMutator<ActivityItem[]>;
}

interface StrapiResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
}

interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
  };
}

interface SermonAttributes {
  title: string;
  speaker?: string;
  publishedAt: string;
  updatedAt: string;
}

interface EventAttributes {
  title: string;
  date: string;
  updatedAt: string;
}

interface PrayerAttributes {
  name: string;
  request: string;
  createdAt: string;
  updatedAt: string;
}

interface DonationAttributes {
  type: string;
  amount: number;
  donor: string;
  date: string;
  updatedAt: string;
}

interface NewsAttributes {
  title: string;
  publishedAt: string;
  updatedAt: string;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const fetcher = async (): Promise<ActivityItem[]> => {
  try {
    const responses = await Promise.all([
      fetch('/api/strapi?endpoint=sermons&sort=publishedAt:desc&pagination[limit]=5'),
      fetch('/api/strapi?endpoint=events&sort=date:desc&pagination[limit]=5'),
      fetch('/api/strapi?endpoint=prayers&sort=createdAt:desc&pagination[limit]=5'),
      fetch('/api/strapi?endpoint=donations&sort=date:desc&pagination[limit]=5'),
      fetch('/api/strapi?endpoint=news-items&sort=publishedAt:desc&pagination[limit]=5')
    ]);

    // Check responses
    responses.forEach((response, index) => {
      if (!response.ok) {
        const endpoints = ['sermons', 'events', 'prayers', 'donations', 'news-items'];
        throw new Error(`Failed to fetch ${endpoints[index]}: ${response.statusText}`);
      }
    });

    const [sermonsData, eventsData, prayersData, donationsData, newsData] = await Promise.all(
      responses.map(async (r) => (await r.json()) as StrapiResponse<any>)
    ) as [
      StrapiResponse<SermonAttributes>,
      StrapiResponse<EventAttributes>,
      StrapiResponse<PrayerAttributes>,
      StrapiResponse<DonationAttributes>,
      StrapiResponse<NewsAttributes>
    ];

    const activities: ActivityItem[] = [];

    // Transform sermons with type and null checks
    sermonsData.data.forEach(sermon => {
      if (sermon?.attributes?.title) {
        activities.push({
          id: sermon.id,
          type: 'sermon',
          title: 'New Sermon',
          description: sermon.attributes.title,
          createdAt: sermon.attributes.publishedAt || new Date().toISOString(),
          updatedAt: sermon.attributes.updatedAt || new Date().toISOString(),
          user: sermon.attributes.speaker || undefined
        });
      }
    });

    // Transform events with type and null checks
    eventsData.data.forEach(event => {
      if (event?.attributes?.title) {
        activities.push({
          id: event.id,
          type: 'event',
          title: 'Upcoming Event',
          description: event.attributes.title,
          createdAt: event.attributes.date || new Date().toISOString(),
          updatedAt: event.attributes.updatedAt || new Date().toISOString()
        });
      }
    });

    // Transform prayers with type and null checks
    prayersData.data.forEach(prayer => {
      if (prayer?.attributes?.request) {
        activities.push({
          id: prayer.id,
          type: 'prayer',
          title: 'Prayer Request',
          description: prayer.attributes.request,
          createdAt: prayer.attributes.createdAt || new Date().toISOString(),
          updatedAt: prayer.attributes.updatedAt || new Date().toISOString(),
          user: prayer.attributes.name || undefined
        });
      }
    });

    // Transform donations with type and null checks
    donationsData.data.forEach(donation => {
      if (donation?.attributes?.type && donation?.attributes?.amount) {
        activities.push({
          id: donation.id,
          type: 'donation',
          title: `${donation.attributes.type} Donation`,
          description: `$${donation.attributes.amount}${donation.attributes.donor ? ` by ${donation.attributes.donor}` : ''}`,
          createdAt: donation.attributes.date || new Date().toISOString(),
          updatedAt: donation.attributes.updatedAt || new Date().toISOString(),
          user: donation.attributes.donor || undefined
        });
      }
    });

    // Transform news with type and null checks
    newsData.data.forEach(news => {
      if (news?.attributes?.title) {
        activities.push({
          id: news.id,
          type: 'news',
          title: 'News Update',
          description: news.attributes.title,
          createdAt: news.attributes.publishedAt || new Date().toISOString(),
          updatedAt: news.attributes.updatedAt || new Date().toISOString()
        });
      }
    });

    // Sort activities by date
    return activities.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};

export function ActivityProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading, mutate } = useSWR('activities', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    dedupingInterval: 5000 // Prevent multiple requests within 5 seconds
  });

  return (
    <ActivityContext.Provider value={{
      activities: data || [],
      isLoading,
      error,
      mutate
    }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
}
