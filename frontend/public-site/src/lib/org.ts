
export const org = {
  name: "Calvary Mission HPC",
  description: "A place of worship, community and spiritual growth ",
  logo: "/logo.svg", 
  heroImage: "/img-1.jpg",
  address: "26 Dein Street, Agbor, Nigeria",
  phone: "+234 808 870 8005",
  email: "info@calvarymissionhpc.org",
  socials: {
    facebook: "https://facebook.com/calvarymissionhpc",
    instagram: "https://instagram.com/calvarymissionhpc",
    youtube: "https://youtube.com/calvarymissionhpc",
  }, 
  heroText: {
    title: "ARISE & SHINE",
    subtitle: "A small river named Duden flows by their place...",
  },
};
export const upcomingSermon = {
  title: "The Power of Faith",
  speaker: "Pastor John Doe",
  date: "2025-08-15T10:00:00", 
};
export const stats = [
  { id: 1, label: "Lives Saved", value: 36000, suffix: "+" },
  { id: 2, label: "Ministries", value: 3 },
  { id: 3, label: "Sermons", value: 120 },
  { id: 4, label: "Pastors", value: 50 },
];
export const sermons = [
  {
    id: 1,
    title: "Faith Over Fear",
    preacher: "Pastor John",
    date: "July 15, 2025",
    image: "/images/sermon1.jpg",
    description: "Discover how faith can overcome even the deepest fears in life.",
    link: "/sermons/faith-over-fear"
  },
  {
    id: 2,
    title: "Walking in Grace",
    preacher: "Pastor Jane ",
    date: "July 8, 2025",
    image: "/images/sermon2.jpg",
    description: "Learn how to walk boldly in the grace that God freely gives.",
    link: "/sermons/walking-in-grace"
  },
  {
    id: 3,
    title: "The Power of Prayer",
    preacher: "Pastor Mark",
    date: "July 1, 2025",
    image: "/images/sermon3.jpg",
    description: "Explore the incredible power of prayer to change lives.",
    link: "/sermons/power-of-prayer"
  }
];
export const churchTV = {
  nowPlaying: {
    title: "Sunday Worship Service",
    description:
      "Join us for a spirit-filled worship service led by our choir and pastors.",
    videoThumbnail: "/images/nowplaying.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
  },
  moreToWatch: [
    {
      id: 1,
      title: "Bible Study Live",
      thumbnail: "/images/biblestudy.jpg",
      link: "/media/bible-study"
    },
    {
      id: 2,
      title: "Youth Fellowship",
      thumbnail: "/images/youth.jpg",
      link: "/media/youth-fellowship"
    },
    {
      id: 3,
      title: "Prayer Night Service",
      thumbnail: "/images/prayer.jpg",
      link: "/media/prayer-night"
    }
  ]
};
export const aboutUs = {
  title: "Welcome to TheChurch",
  description:
    "We are a vibrant community of believers dedicated to spreading love, faith, and hope. Our mission is to guide people towards a deeper relationship with God through worship, fellowship, and service.",
  ctaText: "Learn More",
  ctaLink: "/about",
  features: [
    { id: 1, title: "Faith", description: "Strong belief in God’s promises." },
    { id: 2, title: "Love", description: "Showing unconditional love to all." },
    { id: 3, title: "Courage", description: "Standing firm in our faith." },
    { id: 4, title: "Community", description: "Serving together in unity." },
  ],
  gallery: [
    "/images/gallery1.jpg",
    "/images/gallery2.jpg",
    "/images/gallery3.jpg",
    "/images/gallery4.jpg",
    "/images/gallery5.jpg",
    "/images/gallery6.jpg",
  ],
};
export const testimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "Church Member",
    image: "/images/testimonials/member1.jpg",
    quote:
      "TheChurch has been a blessing to me and my family. The sermons are uplifting and the community is truly supportive.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Youth Leader",
    image: "/images/testimonials/member2.jpg",
    quote:
      "I have grown so much spiritually since joining TheChurch. I’m grateful for the opportunities to serve.",
  },
  {
    id: 3,
    name: "Michael Smith",
    role: "Volunteer",
    image: "/images/testimonials/member3.jpg",
    quote:
      "The warmth and love in this church are unmatched. Everyone truly feels like family here.",
  },
];

// lib/org.ts
export const sermonsDetails = [
  {
    id: 1,
    slug: "power-of-faith",
    title: "The Power of Faith",
    date: "2025-08-15",
    category: "Sermon",
    thumbnail: "/images/placeholder.jpg",
    description: "Discover how faith transforms lives in this inspiring message.",
    fullDescription:
      "Faith is the substance of things hoped for and the evidence of things not seen. In this sermon, we dive deep into the meaning of faith, how to apply it daily, and how it shapes your future.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    slug: "walking-in-love",
    title: "Walking in Love",
    date: "2025-08-08",
    category: "Sermon",
    thumbnail: "/images/placeholder.jpg",
    description: "Love is the greatest commandment—learn to live it daily.",
    fullDescription:
      "Love is patient, love is kind. This message reminds us of the importance of showing genuine love to everyone we meet.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 3,
    slug: "hope-in-darkness",
    title: "Hope in Darkness",
    date: "2025-08-01",
    category: "Sermon",
    thumbnail: "/images/placeholder.jpg",
    description: "Finding light when the world seems dark.",
    fullDescription:
      "Even in our darkest times, God's light shines through. This sermon explores how to hold onto hope when all seems lost.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 4,
    slug: "god-of-breakthrough",
    title: "God of Breakthrough",
    date: "2025-07-25",
    category: "Sermon",
    thumbnail: "/images/placeholder.jpg",
    description: "Your breakthrough is closer than you think.",
    fullDescription:
      "God specializes in making a way where there seems to be no way. This sermon focuses on biblical examples of breakthrough and how to claim yours.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 5,
    slug: "joy-of-salvation",
    title: "The Joy of Salvation",
    date: "2025-07-18",
    category: "Sermon",
    thumbnail: "/images/placeholder.jpg",
    description: "Reignite your joy in the Lord.",
    fullDescription:
      "Salvation is the greatest gift—this message will reignite your passion for the things of God.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 6,
    slug: "prayer-that-moves-mountains",
    title: "Prayer that Moves Mountains",
    date: "2025-07-11",
    category: "Sermon",
    thumbnail: "/images/placeholder.jpg",
    description: "Learn to pray with power and purpose.",
    fullDescription:
      "Prayer is not just words—it is spiritual warfare. This sermon equips you to pray effectively and see results.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

export const eventsDetails = [
  {
    id: 1,
    slug: "youth-conference-2025",
    title: "Youth Conference 2025",
    date: "2025-09-01",
    category: "Event",
    thumbnail: "/images/placeholder.jpg",
    description: "A gathering for the next generation of believers.",
    fullDescription:
      "Join us for a life-changing youth conference filled with worship, the Word, and fellowship.",
  },
  {
    id: 2,
    slug: "community-outreach",
    title: "Community Outreach",
    date: "2025-09-15",
    category: "Event",
    thumbnail: "/images/placeholder.jpg",
    description: "Bringing hope and help to our local community.",
    fullDescription:
      "Be part of our mission to serve and uplift our community through practical acts of kindness and love.",
  },
  {
    id: 3,
    slug: "thanksgiving-service",
    title: "Annual Thanksgiving Service",
    date: "2025-11-01",
    category: "Event",
    thumbnail: "/images/placeholder.jpg",
    description: "Giving thanks for all God has done.",
    fullDescription:
      "Celebrate God's faithfulness with us in a joyful service of worship and thanksgiving.",
  },
];
export const mediaVideos = [
  {
    id: 1,
    title: "Sunday Worship Service",
    videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    thumbnail: "https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg",
    duration: "1:05:32",
    description: "Join us for our uplifting Sunday Worship Service."
  },
  {
    id: 2,
    title: "Bible Study – The Book of John",
    videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
    thumbnail: "https://i.ytimg.com/vi/tgbNymZ7vqY/hqdefault.jpg",
    duration: "48:10",
    description: "Deep dive into the Book of John with Pastor James."
  },
  {
    id: 3,
    title: "Youth Fellowship Highlights",
    videoUrl: "https://www.youtube.com/embed/LXb3EKWsInQ",
    thumbnail: "https://i.ytimg.com/vi/LXb3EKWsInQ/hqdefault.jpg",
    duration: "25:50",
    description: "Celebrating our vibrant youth community."
  }
];
export const givingInfo = {
  heroImage: "/images/giving-hero.jpg",
  heroTitle: "Your Giving Makes a Difference",
  heroSubtitle: "Support our mission to spread love, faith, and hope.",
  methods: [
    {
      title: "Bank Transfer",
      details: "Account Name: The Church\nAccount No: 1234567890\nBank: Zenith Bank",
    },
    {
      title: "Give Online",
      details: "Secure online giving via our donation form with multiple payment options.",
      link: "#donation-form",
      buttonText: "Give Online",
    },
    {
      title: "Mobile Money",
      details: "MTN MoMo: +234 800 123 4567",
    },
  ],
  scripture: {
    quote: "Each of you should give what you have decided in your heart to give...",
    reference: "2 Corinthians 9:7",
  },
  ctaLink: "#donation-form",
};
export const aboutContent = {
  welcome: {
    title: "Welcome to Our Church",
    description:
      "Our mission is to bring people closer to God through worship, service, and love. Since our foundation, we have been a community of believers united by faith, hope, and charity. We open our doors to everyone seeking a deeper relationship with Christ and a meaningful place in a loving spiritual family.",
    images: [
      "/images/gallery1.jpg",
      "/images/gallery2.jpg",
      "/images/gallery3.jpg",
      "/images/gallery4.jpg",
      "/images/gallery5.jpg",
      "/images/gallery6.jpg",
    ],
  },

  timeline: [
    { year: "1995", event: "Church founded with a small prayer group in a living room." },
    { year: "2000", event: "Built our first worship hall to accommodate our growing community." },
    { year: "2008", event: "Started our Youth Ministry and outreach programs." },
    { year: "2015", event: "Launched community development projects and charity drives." },
    { year: "2022", event: "Introduced online streaming and global prayer meetings." },
  ],

  timelineImage: "/images/timeline.jpg",

  contact: {
    description: "Whether you have a question, prayer request, or want to join our community, we’d love to hear from you.",
    phone: "+234 800 000 0000",
    email: "info@thechurch.com",
    address: "123 Faith Avenue, Lagos, Nigeria",
  },
};


