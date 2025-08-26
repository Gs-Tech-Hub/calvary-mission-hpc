import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
    content?: any;
    excerpt?: string;
    cover?: StrapiImage;
    publishedAt?: string;
  };
};

async function fetchPostBySlug(slug: string): Promise<Post | null> {
  try {
    const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
    const token = process.env.STRAPI_API_TOKEN;
    const res = await fetch(
      `${STRAPI_URL}/api/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) throw new Error('Failed to fetch post');
    const data = await res.json();
    const item = (data.data as Post[])[0];
    return item || null;
  } catch {
    return null;
  }
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return { title: 'Post not found' };
  const title = post.attributes.title || 'Post';
  const description = post.attributes.excerpt || undefined;
  const imageUrl = post.attributes.cover?.data?.attributes?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const attrs = post.attributes || {};
  const title = attrs.title || 'Post';
  const publishedAt = attrs.publishedAt ? new Date(attrs.publishedAt).toLocaleDateString() : '';
  const imageUrl = attrs.cover?.data?.attributes?.url;
  const alt = attrs.cover?.data?.attributes?.alternativeText || title;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">{title}</h1>
        {publishedAt && <p className="text-sm text-gray-500">{publishedAt}</p>}
      </header>

      {imageUrl && (
        <div className="relative w-full h-80 mb-6">
          <Image src={imageUrl} alt={alt} fill className="object-cover rounded" />
        </div>
      )}

      {attrs.content && (
        <div className="prose max-w-none">
          {/* Assuming Strapi rich text content is HTML. Adjust if using Blocks/MDX. */}
          <div dangerouslySetInnerHTML={{ __html: attrs.content }} />
        </div>
      )}
    </article>
  );
}


