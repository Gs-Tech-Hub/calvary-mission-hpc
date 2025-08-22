"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Sermons", href: "/sermons" },
  { name: "About", href: "/about" },
  { name: "Media", href: "/media" },
  { name: "Giving", href: "/giving" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orgName, setOrgName] = useState("TheChurch"); 
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch('/api/strapi?endpoint=orgs&populate=*');
        if (!res.ok) throw new Error("Failed to fetch org");
        const data = await res.json();
        console.log(data.data[0].name);
        setOrgName(data.data[0].name || "TheChurch");
      } catch (err) {
        console.error(err);
      }
    }
    fetchOrg();
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "shadow-md bg-[#0A1D3C]" : "bg-[#0A1D3C]"}`}>
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto text-white">
        <div className="text-xl font-bold">{orgName}</div>

        <ul className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`
                  relative group px-1 py-1
                  ${pathname === link.href ? "text-yellow-400" : ""}
                `}
              >
                <span>{link.name}</span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                <span className="absolute left-0 -bottom-3 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 delay-75"></span>
              </Link>
            </li>
          ))}
        </ul>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div className={`md:hidden bg-[#0A1D3C] text-white overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} onClick={() => setMobileMenuOpen(false)} className={pathname === link.href ? "text-yellow-400" : ""}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
