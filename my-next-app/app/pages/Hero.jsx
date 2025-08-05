import React from 'react'
import Navbar from '../componenets/Navbar'
import Image from 'next/image'

const Hero = () => {
  return (
    <div>
      <Navbar />

      <div className="relative h-[600px] w-full">
        {/* Background Image */}
        <Image
          src="/min.webp"
          alt="Church background"
          className="absolute inset-0 object-cover w-full h-full"
          width={1920}
          height={600}
        />

        {/* Dark Overlay with partial opacity */}
        <div className="absolute inset-0 bg-black opacity-50 z-0" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Grace Community Church
            </h1>
            <p className="text-lg md:text-xl">
              Worship, Fellowship, and Grow with Us Every Week
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
