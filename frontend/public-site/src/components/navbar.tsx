"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { org } from "@/lib/org";

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
  const [orgName, setOrgName] = useState(org.name);
  const [logoUrl, setLogoUrl] = useState(org.logo);
  const [logoError, setLogoError] = useState(false);
  const [isApiLogo, setIsApiLogo] = useState(false);
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
        setOrgName(data.data[0].name || org.name);
        // If the API returns a logo, use it; otherwise keep the default
        if (data.data[0].logo) {
          setLogoUrl(data.data[0].logo);
          setIsApiLogo(true);
        } else {
          // Fallback to local logo if API doesn't provide one
          setLogoUrl(org.logo);
          setIsApiLogo(false);
        }

      } catch (err) {
        console.error(err);
      }
    }
    fetchOrg();
  }, []);



  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "shadow-md bg-[#0A1D3C]" : "bg-[#0A1D3C]"}`}>
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto text-white">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          {!logoError && (
            <Image
              src={logoUrl}
              alt={`${orgName} Logo`}
              width={50}
              height={50} 
              color="white"
              className="w-10 h-10"
              priority
              onError={() => {
                if (isApiLogo) {
                  // If API logo fails, fall back to local logo
                  setLogoUrl(org.logo);
                  setIsApiLogo(false);
                  setLogoError(false);
                } else {
                  // If local logo also fails, hide logo
                  setLogoError(true);
                }
              }}
            />
          )}
          <div className="text-xl font-bold">{orgName}</div>
        </Link>

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
