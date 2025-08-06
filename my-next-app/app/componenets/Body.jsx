import React from 'react'

const data = [
  {
    title: 'Sermons & Podcasts',
    description: 'Listen to past messages or tune in live every Sunday.',
  },
  {
    title: 'Upcoming Events',
    description: 'Join us in worship, outreach, or community events every week.',
  },
  {
    title: 'Connect & Serve',
    description: 'Sign up to volunteer and be part of something bigger than yourself.',
  },
  {
    title: 'Online Giving',
    description: 'Support the ministry by giving your tithes and offerings securely online.',
  },
  {
    title: 'Prayer Requests',
    description: 'Share your prayer needs and let our team lift you up in prayer.',
  },
  {
    title: 'New Here?',
    description: 'Get to know our church, what we believe, and how to get involved.',
  },
];


const Body = () => {
  return (
    <div className="bg-gray-50 sm:h-[400px] h-[1100px] py-10 px-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
            <p className="text-base text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Body
