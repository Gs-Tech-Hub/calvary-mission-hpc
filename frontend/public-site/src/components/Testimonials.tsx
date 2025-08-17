"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useEffect, useState } from "react";

const mockTestimonials = [
  {
    id: 1,
    name: "Jane Doe",
    role: "Member",
    quote: "This church has changed my life!",
    image: "/default-avatar.jpg",
  },
  {
    id: 2,
    name: "John Smith",
    role: "Volunteer",
    quote: "Amazing community and teachings.",
    image: "/default-avatar.jpg",
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/testimonials?populate=image`);
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        const data = await res.json();

        const formatted = data?.data?.map((item: any) => ({
          id: item.id,
          name: item?.attributes?.name || "Anonymous",
          role: item?.attributes?.role || "",
          quote: item?.attributes?.quote || "",
          image: item?.attributes?.image?.data?.attributes?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.image.data.attributes.url}`
            : "/default-avatar.jpg",
        })) || [];

        setTestimonials(formatted.length ? formatted : mockTestimonials);
      } catch (error) {
        console.warn("Failed to fetch testimonials. Using mock data.", error);
        setTestimonials(mockTestimonials);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-500 py-16 text-center text-white">
        <p>Loading testimonials...</p>
      </section>
    );
  }

  return (
    <section className="bg-gray-500 py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-10">
          What Our Members Say
        </h2>

        <Carousel
          className="w-full"
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[
            Autoplay({ delay: 3500 }),
          ]}
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="md:basis-1/3 sm:basis-1/2 basis-full p-4"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center h-full hover:shadow-xl transition-shadow">
                  <div className="w-20 h-20 relative mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    {testimonial.quote}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {testimonial.role}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
