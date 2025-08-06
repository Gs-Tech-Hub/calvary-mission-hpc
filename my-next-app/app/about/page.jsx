// app/about/page.jsx or page.tsx
'use client'
import React from 'react'
import Navbar from '../componenets/Navbar'
import Image from 'next/image'


const Page = () => {
  return (
    <div>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white text-gray-800">
          
          <section className="relative bg-[url('/Aaron.webp')] bg-cover bg-center h-72 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" />
            <h1 className="relative z-10 text-white text-4xl md:text-5xl font-bold">About Our Church</h1>
          </section>

         
          <section className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="mb-8 text-lg">
              At , our mission is to love God, love people, and transform lives through the message of Jesus Christ.
              We are committed to creating a welcoming space where everyone can grow in faith, community, and service.
            </p>

            <h2 className="text-3xl font-semibold mb-6">Our Vision</h2>
            <p className="text-lg">
              We envision a world transformed by the love of Christ—one person, one family, and one community at a time.
              We exist to help people know Jesus, find belonging, and make a lasting impact.
            </p>
          </section>

          
          <section className="bg-gray-100 py-16">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-3xl font-semibold mb-10 text-center">Meet Our Pastors</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <Image src="/pastor1.jpg"
                   alt="Lead Pastor"
                   width={160}
                     height={160}
                    className="w-40 h-40 object-cover rounded-full mx-auto mb-4" />


                  <h3 className="text-xl font-bold">Pastor John </h3>
                  <p className="text-gray-600">Lead Pastor</p>
                </div>
                <div className="text-center">
                   <Image src="/pastor1.jpg"
                   alt="Lead Pastor"
                   width={160}
                     height={160}
                    className="w-40 h-40 object-cover rounded-full mx-auto mb-4" />
                  <h3 className="text-xl font-bold">Pastor Jane </h3>
                  <p className="text-gray-600">Associate Pastor</p>
                </div>
              </div>
            </div>
          </section>

          
          <section className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-semibold mb-6 text-center">Our Core Values</h2>
            <ul className="space-y-4 text-lg list-disc list-inside">
              <li>Authentic Worship</li>
              <li>Biblical Teaching</li>
              <li>Community & Fellowship</li>
              <li>Prayer & Spiritual Growth</li>
              <li>Serving with Excellence</li>
              <li>Generosity & Stewardship</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Page
