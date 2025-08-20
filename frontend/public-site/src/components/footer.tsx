"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [org, setOrg] = useState({
    name: "TheChurch",
    description: "Welcome to our church website.",
    logo: "/logo.png",
    address: "123 Church Street, City",
    phone: "+234 800 000 0000",
    email: "info@thechurch.com",
    socials: {
      facebook: "#",
      instagram: "#",
      youtube: "#",
    },
  });

  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/org?populate=*`);
        if (!res.ok) throw new Error("Failed to fetch org");
        const data = await res.json();
        const orgData = data.data.attributes;
        setOrg({
          name: orgData.name || "TheChurch",
          description: orgData.description || org.description,
          logo: orgData.logo?.data?.attributes?.url || org.logo,
          address: orgData.address || org.address,
          phone: orgData.phone || org.phone,
          email: orgData.email || org.email,
          socials: {
            facebook: orgData.socials?.facebook || org.socials.facebook,
            instagram: orgData.socials?.instagram || org.socials.instagram,
            youtube: orgData.socials?.youtube || org.socials.youtube,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchOrg();
  }, []);

  const socials = [
    { name: "Facebook", icon: Facebook, url: org.socials.facebook },
    { name: "Instagram", icon: Instagram, url: org.socials.instagram },
    { name: "YouTube", icon: Youtube, url: org.socials.youtube },
  ];

  return (
    <footer className="bg-gray-100/80 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">

        <div>
          <Image
           src={org.logo} 
           alt={org.name} 
           className="h-12 mb-4 mx-auto sm:mx-0" />
          <p className="text-gray-600 text-sm">{org.description}</p>
        </div>

        <div>
          <h3 className="text-gray-800 font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/about", label: "About Us" },
              { href: "/sermons", label: "Sermons" },
              { href: "/ministries", label: "Ministries" },
              { href: "/contact", label: "Contact" },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blue-600">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-gray-800 font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>{org.address}</li>
            <li>{org.phone}</li>
            <li><a href={`mailto:${org.email}`} className="hover:text-blue-600">{org.email}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-800 font-semibold mb-3">Follow Us</h3>
          <div className="flex justify-center sm:justify-start space-x-4">
            {socials.map(({ name, icon: Icon, url }) => (
              <Link key={name} href={url} target="_blank" aria-label={name} className="text-gray-600 hover:text-blue-600">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-[#0A1D3C] py-4 text-center text-sm text-white">
        © {new Date().getFullYear()} {org.name}. All rights reserved.
      </div>
    </footer>
  );
}
