import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Read the latest news and articles from Calvary Mission HPC.',
};

type StrapiImage = {
  data?: {
    attributes?: {
      url?: string;
      width?: number;
      height?: number;
      alternativeText?: string;
    };
  };
};

type Post = {
  id: number;
  attributes: {
    title?: string;
    slug?: string;
    excerpt?: string;
    description?: any;
    cover?: StrapiImage;
    publishedAt?: string;
  };
};

async function fetchPosts(): Promise<Post[]> {
  try {
    const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
    const token = process.env.STRAPI_API_TOKEN;
    const res = await fetch(
      `${STRAPI_URL}/api/posts?populate=*&sort[0]=publishedAt:desc&pagination[limit]=12`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // Revalidate periodically for freshness
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) throw new Error('Failed to fetch posts');
    const data = await res.json();
    return data.data as Post[];
  } catch {
    return [];
  }
}

export default async function PostsIndexPage() {
  const posts = await fetchPosts();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Latest Posts</h1>

      {posts.length === 0 && (
        <p className="text-gray-600">No posts available yet. Please check back soon.</p>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const attrs = post.attributes || {};
          const slug = attrs.slug || String(post.id);
          const title = attrs.title || 'Untitled';
          const publishedAt = attrs.publishedAt
            ? new Date(attrs.publishedAt).toLocaleDateString()
            : '';
          const imageUrl = attrs.cover?.data?.attributes?.url || '/img-1.jpg';
          const alt = attrs.cover?.data?.attributes?.alternativeText || title;

          return (
            <article key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
              <Link href={`/posts/${slug}`}>
                <div className="relative h-48 w-full">
                  <Image src={imageUrl} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
              </Link>
              <div className="p-4">
                <h2 className="text-xl font-medium mb-2">
                  <Link href={`/posts/${slug}`}>{title}</Link>
                </h2>
                {publishedAt && <p className="text-sm text-gray-500 mb-2">{publishedAt}</p>}
                {attrs.excerpt && (
                  <p className="text-gray-700 line-clamp-3">{attrs.excerpt}</p>
                )}
                <div className="mt-3">
                  <Link href={`/posts/${slug}`} className="text-blue-700 hover:underline">Read more</Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}


