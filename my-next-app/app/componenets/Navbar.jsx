'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)

  const isActive = (path) => pathname === path

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-black">
          Church
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/" className={isActive('/') ? 'text-gray-400 font-semibold' : 'text-gray-700'}>
            Home
          </Link>
          <Link href="/about" className={isActive('/about') ? 'text-gray-400 font-semibold' : 'text-gray-700'}>
            About
          </Link>
          <Link href="/sermons" className={isActive('/sermons') ? 'text-gray-400 font-semibold' : 'text-gray-700'}>
            Sermons
          </Link>
          <Link href="/events" className={isActive('/events') ? 'text-gray-400 font-semibold' : 'text-gray-700'}>
            Events
          </Link>
          <Link href="/contact" className={isActive('/contact') ? 'text-gray-400 font-semibold' : 'text-gray-700'}>
            Contact
          </Link>
          <Link
            href="/giving"
            className="ml-4 bg-black text-white px-4 py-2 rounded"
          >
            Give Online
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4">
          <button
            className="text-gray-700 mb-4"
            onClick={toggleMenu}
          >
            <X size={28} />
          </button>

          <Link href="/" className={isActive('/') ? 'block text-blue-600 font-semibold' : 'block text-gray-700 hover:text-blue-600'} onClick={toggleMenu}>Home</Link>
          <Link href="/about" className={isActive('/about') ? 'block text-blue-600 font-semibold' : 'block text-gray-700 hover:text-blue-600'} onClick={toggleMenu}>About</Link>
          <Link href="/sermons" className={isActive('/sermons') ? 'block text-blue-600 font-semibold' : 'block text-gray-700 hover:text-blue-600'} onClick={toggleMenu}>Sermons</Link>
          <Link href="/events" className={isActive('/events') ? 'block text-blue-600 font-semibold' : 'block text-gray-700 hover:text-blue-600'} onClick={toggleMenu}>Events</Link>
          <Link href="/contact" className={isActive('/contact') ? 'block text-blue-600 font-semibold' : 'block text-gray-700 hover:text-blue-600'} onClick={toggleMenu}>Contact</Link>
          <Link
            href="/giving"
            className="block bg-black text-white px-4 py-2 rounded hover:bg-black"
            onClick={toggleMenu}
          >
            Give Online
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
