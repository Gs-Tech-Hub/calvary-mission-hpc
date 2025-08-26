## Strapi Content Schema (User Dashboard)

This document summarizes fields, types, requirements, enums, relations, and components for content types used by the user dashboard.

Field types are Strapi v5 types. Media fields require `populate` to retrieve file metadata.

---

### api::sermon.sermon (collectionType)
- title: string (required)
- speaker: string
- date: date
- youtubeId: text
- description: blocks
- typeOfContent: enumeration [video, text] (default: video)
- textContent: blocks
- thumbnail: media (single; images, files, videos, audios)
- slug: uid -> title

---

### api::entertainment.entertainment (collectionType)
- title: string (required)
- description: blocks
- youtubeId: text
- thumbnail: media (single; images, files, videos, audios)
- category: enumeration [music, drama, comedy, short-film, other] (default: other)
- slug: uid -> title
- publishedAt: datetime

---

### api::news-item.news-item (collectionType)
- title: string (required)
- content: blocks
- thumbnail: media (single; images, files, videos, audios)
- slug: uid -> title
- publishedAt: datetime

---

### api::live-tv.live-tv (collectionType)
- name: string (required)
- channelKey: uid -> name
- streamUrl: text (required)
- backupStreamUrl: text
- thumbnail: media (single; images)
- isActive: boolean (default: true)

---

### api::testimonial.testimonial (collectionType)
- name: string (required)
- role: string
- image: string
- quote: text

---

### api::bible-study.bible-study (collectionType)
- title: string (required)
- lessonDate: date
- outline: blocks
- teacher: string
- materials: media (multiple; files)
- slug: uid -> title

---

### api::event.event (collectionType)
- title: string (required)
- description: blocks
- date: datetime (required)
- location: string
- thumbnail: media (single; images, files, videos, audios)
- slug: uid -> title

---

### api::prayer.prayer (collectionType)
- name: string (required)
- email: email
- phone: string
- request: text (required)
- status: enumeration [new, in-progress, prayed] (default: new)
- session: relation manyToOne -> api::prayer-session.prayer-session

---

### api::prayer-session.prayer-session (collectionType)
- title: string (required)
- scheduledAt: datetime
- description: blocks
- isOpen: boolean (default: true)

---

### api::department.department (collectionType)
- name: string (required)
- description: text
- lead: string
- email: email
- thumbnail: media (single; images)
- slug: uid -> name

---

### api::departments-page.departments-page (singleType)
- intro: blocks
- featured: relation oneToMany -> api::department.department

---

### api::donation.donation (collectionType)
- donor: string (required)
- amount: decimal (required)
- type: enumeration [Tithe, Offering, Building, Fund, Missions, Special]
- method: enumeration [Cash, Bank Transfer, Online, Mobile Money, Cheque]
- reference: text
- notes: string
- date: date

---

### api::onboarding.onboarding (collectionType)
- fullName: string (required)
- email: email
- phone: string
- address: string
- isMember: boolean (default: false)
- churchBranch: string
- department: relation manyToOne -> api::department.department
- isChristian: boolean (default: true)
- previousChurch: string
- notes: text
- followUpNeeded: boolean (default: false)

---

### api::member.member (collectionType)
- name: string (required)
- email: email (required)
- phone: string
- address: string
- joinDate: date
- member_status: enumeration [Active, Inactive, Visitor]
- department: string
- birthDate: date
- maritalStatus: enumeration [Single, Married, Widowed]

---

### api::live-stream.live-stream (collectionType)
- streamUrl: text (required)
- streamKey: text (required)
- isLive: boolean (default: false)
- title: string
- startedAt: datetime
- streamId: text
- broadcastId: text
- watchUrl: text

---

### api::persistent-stream.persistent-stream (collectionType)
- title: string
- streamUrl: text
- streamKey: text
- streamId: string

---

### api::about-us.about-us (collectionType)
- title: string (required)
- description: text
- ctaText: string
- ctaLink: string
- features: component about-us.feature (repeatable)
- gallery: json

Components used:
- about-us.feature
  - title: string (required)
  - description: text

---

### api::org.org (collectionType)
- name: string (required)
- description: text
- logo: string
- heroImage: string
- address: string
- phone: string
- email: email
- socials: component org.socials
- heroText: component org.hero-text

Components used:
- org.socials
  - facebook: string
  - instagram: string
  - youtube: string
- org.hero-text
  - title: string (required)
  - subtitle: text

---

### Common system fields
All collection/single types include Strapi system fields (e.g., `id`, `createdAt`, `updatedAt`, `publishedAt`) when using REST. Use `fields` to select specific attributes and `populate` for media/relations.


