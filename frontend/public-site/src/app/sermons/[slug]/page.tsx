"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function SermonRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string | undefined);

  useEffect(() => {
    if (user) {
      router.push(`/dashboard/sermons/${slug}`);
    } else {
      router.push(`/auth/login?redirect=/dashboard/sermons/${slug}`);
    }
  }, [user, router, slug]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
