"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { org } from "@/lib/org";

export default function Footer() {
  return (
    <footer className="bg-gray-100/80 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div>
          <img src={org.logo} alt={org.name} className="h-12 mb-4" />
          <p className="text-gray-600 text-sm">
            {org.description}
          </p>
        </div>

        <div>
          <h3 className="text-gray-800 font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
            <li><Link href="/sermons" className="hover:text-blue-600">Sermons</Link></li>
            <li><Link href="/ministries" className="hover:text-blue-600">Ministries</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
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
          <div className="flex space-x-4">
            <Link href={org.socials.facebook} target="_blank" className="text-gray-600 hover:text-blue-600">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href={org.socials.instagram} target="_blank" className="text-gray-600 hover:text-blue-600">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href={org.socials.youtube} target="_blank" className="text-gray-600 hover:text-blue-600">
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-[#0A1D3C] py-4 text-center text-sm text-white">
        © {new Date().getFullYear()} {org.name}. All rights reserved.
      </div>
    </footer>
  );
}
