"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { aboutContent, org } from "@/lib/org";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<any>(null);
  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: timelineRef, inView: timelineInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/about?populate=*`);
        if (!res.ok) throw new Error("Strapi not ready");
        const json = await res.json();
        setAboutData(json.data.attributes);
      } catch (err) {
        console.log("Strapi fetch failed, using mock data");
        setAboutData({
          heroImage: { url: org.heroImage },
          welcomeTitle: aboutContent.welcome.title,
          welcomeDescription: aboutContent.welcome.description,
          welcomeImages: { data: aboutContent.welcome.images.map((url) => ({ attributes: { url } })) },
          timeline: aboutContent.timeline,
          timelineImage: { url: aboutContent.timelineImage },
          contactDescription: aboutContent.contact.description,
          contactPhone: aboutContent.contact.phone,
          contactEmail: aboutContent.contact.email,
          contactAddress: aboutContent.contact.address,
          mapEmbed: "https://maps.google.com/maps?q=Lagos&t=&z=13&ie=UTF8&iwloc=&output=embed",
        });
      }
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent!");
  };

  if (!aboutData) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-white">

      <section
        className="relative h-[60vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(10,29,60,0.7), rgba(10,29,60,0.7)), url(${aboutData.heroImage.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold relative before:content-[''] before:absolute before:-bottom-3 before:left-1/2 before:-translate-x-1/2 before:w-16 before:h-1 before:bg-white after:content-[''] after:absolute after:-bottom-5 after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-1 after:bg-white"
        >
          About Us
        </motion.h1>
      </section>

      <section ref={aboutRef} className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={aboutInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{aboutData.welcomeTitle}</h2>
            <p className="text-gray-700 mb-6">{aboutData.welcomeDescription}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={aboutInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-3 gap-2"
          >
            {aboutData.welcomeImages.data.map((img: any, i: number) => (
              <img
                key={i}
                src={img.attributes.url}
                alt={`Gallery ${i + 1}`}
                className="w-full h-32 object-cover rounded-lg shadow-md"
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section ref={timelineRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Journey</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative border-l-4 border-blue-900 pl-6">
              {aboutData.timeline.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="mb-10"
                >
                  <div className="absolute -left-3 w-6 h-6 bg-blue-900 rounded-full border-4 border-white"></div>
                  <h3 className="text-xl font-semibold text-gray-800">{item.year}</h3>
                  <p className="text-gray-600">{item.event}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={timelineInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <img
                src={aboutData.timelineImage.url}
                alt="Timeline"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10 px-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-700 mb-4">{aboutData.contactDescription}</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3"><FaPhone /> {aboutData.contactPhone}</li>
              <li className="flex items-center gap-3"><FaEnvelope /> {aboutData.contactEmail}</li>
              <li className="flex items-center gap-3"><FaMapMarkerAlt /> {aboutData.contactAddress}</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
            <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} className="w-full mb-4 px-4 py-2 border rounded-lg" required />
            <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} className="w-full mb-4 px-4 py-2 border rounded-lg" required />
            <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} className="w-full mb-4 px-4 py-2 border rounded-lg" rows={4} required></textarea>
            <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-all">
              Send Message
            </button>
          </form>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={aboutData.mapEmbed}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
