"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { org} from "@/lib/org";
import { Menu, X } from "lucide-react"; 

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Sermons", href: "#" },
  { name: "Ministries", href: "#" },
  { name: "Events", href: "#" },
  { name: "Contact", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 m-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "shadow-md bg-[#0A1D3C]" : "bg-[#0A1D3C]"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto text-white">
        <div className="text-xl font-bold">{org.name}</div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="relative group">
                <span>{link.name}</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-white group-hover:w-full transition-all duration-500"></span>
              </Link>
            </li>
          ))}
        </ul>


        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 bg-[#0A1D3C] text-white">
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
