import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/sermons',
    '/media',
    '/live',
    '/giving',
    '/convention',
    '/posts',
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path || '/'}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  // Try to include latest posts from Strapi
  try {
    const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
    const token = process.env.STRAPI_API_TOKEN;
    const res = await fetch(`${STRAPI_URL}/api/posts?fields[0]=slug&sort[0]=publishedAt:desc&pagination[limit]=50`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // Cache for some time
      next: { revalidate: 600 },
    });
    if (res.ok) {
      const data = await res.json();
      const posts: Array<{ attributes?: { slug?: string; updatedAt?: string } }> = data.data || [];
      for (const p of posts) {
        const slug = p.attributes?.slug;
        if (slug) {
          entries.push({
            url: `${siteUrl}/posts/${slug}`,
            lastModified: p.attributes?.updatedAt ? new Date(p.attributes.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      }
    }
  } catch {
    // ignore and return static entries only
  }

  return entries;
}


