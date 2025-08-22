"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */ 
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { givingInfo as mockData } from "@/lib/org";
import DonationForm from "@/components/DonationForm";

export default function GivingPage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/strapi?endpoint=giving-page&populate=*');
        if (!res.ok) throw new Error("Strapi not ready");
        const json = await res.json();
        setData(json.data.attributes);
      } catch (err) {
        console.log(`Strapi fetch failed, using mock data: ${err}`);
        setData(mockData);
      }
    }
    fetchData();
  }, []);

  if (!data) return <p className="text-center py-20">Loading...</p>;

  return (
    <div>

      {/* <section
        className="relative h-[70vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${data.heroImage?.data?.attributes?.url || data.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#0A1D3C]/70" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">{data.heroTitle || data.heroTitle}</h1>
          <p className="max-w-xl mx-auto px-10">{data.heroSubtitle || data.heroSubtitle}</p>
        </div>
      </section> */}

      {/* <section ref={ref} className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Ways to Give
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {(data.methods || []).map((method: any, index: number) => (
            <div
              key={index}
              className={`bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg text-center transform transition-all duration-500 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <h3 className="text-xl font-semibold text-[#0A1D3C] mb-4">{method.title}</h3>
              <p className="text-gray-700">{method.details}</p>
              {method.link && (
                method.link.startsWith('#') ? (
                  <button
                    onClick={() => {
                      const element = document.getElementById(method.link.substring(1));
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-block mt-4 px-6 py-3 bg-[#0A1D3C] text-white rounded-lg hover:bg-blue-900 transition-all"
                  >
                    {method.buttonText}
                  </button>
                ) : (
                  <Link
                    href={method.link}
                    className="inline-block mt-4 px-6 py-3 bg-[#0A1D3C] text-white rounded-lg hover:bg-blue-900 transition-all"
                  >
                    {method.buttonText}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
      </section> */}

      <section className="bg-gray-100 py-16 text-center">
        <blockquote className="text-2xl italic text-gray-800 max-w-3xl mx-auto">
          {`"${data.scripture?.quote}"`}
        </blockquote>
        <p className="mt-4 text-gray-600">— {data.scripture?.reference}</p>
      </section>

      {/* Main Donation Section */}
      <section id="donation-form" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {data.ctaTitle || "Support Our Mission"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your generous donations help us continue our ministry work, support our community, 
              and spread the gospel. Every contribution makes a difference.
            </p>
            
            {/* Payment Options Summary */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Multiple Payment Methods</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Instant Confirmation</span>
              </div>
            </div>
          </div>
          
          {/* Donation Form - More Prominent */}
          <div className="max-w-4xl mx-auto">
            <DonationForm />
          </div>
        </div>
      </section>

      {/* Alternative Payment Methods */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Other Ways to Give</h3>
            <p className="text-gray-600">Prefer a different payment method? We offer multiple options for your convenience.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bank Transfer */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800">Bank Transfer</h4>
              </div>
              <p className="text-gray-600 mb-4">Direct bank transfer to our account. Contact us for account details.</p>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Get Account Details
              </button>
            </div>

            {/* Mobile Money */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800">Mobile Money</h4>
              </div>
              <p className="text-gray-600 mb-4">Send money via mobile money platforms. Available on all major networks.</p>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Get Mobile Numbers
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
