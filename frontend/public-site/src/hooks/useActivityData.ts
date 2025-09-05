'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ActivityItem {
  id: number;
  type: 'sermon' | 'event' | 'prayer' | 'donation' | 'news' | 'bible-study' | 'live-tv';
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user?: string;
}

// Cache to store the fetched data
let cachedData: ActivityItem[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export function useActivityData() {
  const [activities, setActivities] = useState<ActivityItem[]>(cachedData);
  const [isLoading, setIsLoading] = useState(cachedData.length === 0);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async (force = false) => {
    // Use cached data if available and not expired
    const now = Date.now();
    if (!force && cachedData.length > 0 && now - lastFetchTime < CACHE_DURATION) {
      return;
    }

    try {
      setIsLoading(true);
      const [sermons, events, prayers, donations, news] = await Promise.all([
        fetch('/api/strapi?endpoint=sermons&sort=publishedAt:desc&pagination[limit]=5'),
        fetch('/api/strapi?endpoint=events&sort=date:desc&pagination[limit]=5'),
        fetch('/api/strapi?endpoint=prayers&sort=createdAt:desc&pagination[limit]=5'),
        fetch('/api/strapi?endpoint=donations&sort=date:desc&pagination[limit]=5'),
        fetch('/api/strapi?endpoint=news-items&sort=publishedAt:desc&pagination[limit]=5')
      ]);

      const [sermonsData, eventsData, prayersData, donationsData, newsData] = await Promise.all([
        sermons.json(),
        events.json(),
        prayers.json(),
        donations.json(),
        news.json()
      ]);

      const allActivities = [
        ...sermonsData.data.map((sermon: any) => ({
          id: sermon.id,
          type: 'sermon',
          title: 'New Sermon',
          description: sermon.attributes.title,
          createdAt: sermon.attributes.publishedAt,
          updatedAt: sermon.attributes.updatedAt,
          user: sermon.attributes.speaker
        })),
        ...eventsData.data.map((event: any) => ({
          id: event.id,
          type: 'event',
          title: 'Upcoming Event',
          description: event.attributes.title,
          createdAt: event.attributes.date,
          updatedAt: event.attributes.updatedAt,
          user: 'Church Admin'
        })),
        ...prayersData.data.map((prayer: any) => ({
          id: prayer.id,
          type: 'prayer',
          title: 'Prayer Request',
          description: prayer.attributes.request,
          createdAt: prayer.attributes.createdAt,
          updatedAt: prayer.attributes.updatedAt,
          user: prayer.attributes.name
        })),
        ...donationsData.data.map((donation: any) => ({
          id: donation.id,
          type: 'donation',
          title: 'Donation Received',
          description: `${donation.attributes.type} - ${donation.attributes.amount}`,
          createdAt: donation.attributes.date,
          updatedAt: donation.attributes.updatedAt,
          user: donation.attributes.donor
        })),
        ...newsData.data.map((news: any) => ({
          id: news.id,
          type: 'news',
          title: 'News Update',
          description: news.attributes.title,
          createdAt: news.attributes.publishedAt,
          updatedAt: news.attributes.updatedAt,
          user: 'Church Admin'
        }))
      ];

      const sortedActivities = allActivities.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Update cache
      cachedData = sortedActivities;
      lastFetchTime = now;
      
      setActivities(sortedActivities);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();

    // Set up periodic refresh
    const interval = setInterval(() => {
      fetchActivities(true);
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    error,
    refresh: () => fetchActivities(true)
  };
}
