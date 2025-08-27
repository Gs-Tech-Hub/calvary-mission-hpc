## Strapi REST API Endpoints (User Dashboard)

This document lists the REST endpoints used by the user-facing dashboard. It focuses on read endpoints for displaying existing content and selective write endpoints where users submit data (e.g., onboarding and prayer requests).

Base URL examples:
- Local: `http://localhost:1337`
- Production: `https://<your-domain>`

All endpoints below are prefixed by `/api`.

Notes:
- Add `?populate=*` to include relations and media fields where needed, or use fine-grained `populate[field]=*`.
- Use common query params: `pagination[page]`, `pagination[pageSize]`, `sort`, `fields`, `filters`.
- Only published entries are returned unless authenticated with permissions to see drafts.

### Authentication (Users & Permissions)

- POST `/api/auth/local` — Login
  - Body: `{ identifier: string (email or username), password: string }`
  - Response: `{ jwt, user }`

- POST `/api/auth/local/register` — Register (if allowed in admin)
  - Body: `{ username, email, password }`
  - Response: `{ jwt, user }`

- GET `/api/users/me` — Current user
  - Headers: `Authorization: Bearer <jwt>`
  - Response: user profile

Permissions: Ensure the public/authenticated roles are configured to allow the needed operations.

---

### Sermons
Content type: `api::sermon.sermon`

- GET `/api/sermons` — List sermons
  - Common: `?populate=thumbnail&sort=date:desc`

- GET `/api/sermons/:id` — Sermon by id
  - Common: `?populate=thumbnail`

- GET `/api/sermons?filters[slug][$eq]=<slug>` — Sermon by slug
  - Common: `&populate=thumbnail`

Fields snapshot: `title`, `speaker`, `date`, `youtubeId`, `description` (blocks), `typeOfContent` (video|text), `textContent` (blocks), `thumbnail` (media), `slug`.

---

### Entertainment
Content type: `api::entertainment.entertainment`

- GET `/api/entertainments` — List items
  - Common: `?populate=thumbnail&sort=publishedAt:desc`

- GET `/api/entertainments/:id`
  - Common: `?populate=thumbnail`

- GET `/api/entertainments?filters[slug][$eq]=<slug>`
  - Common: `&populate=thumbnail`

- Filter by category:
  - `/api/entertainments?filters[category][$eq]=music`

Fields: `title`, `description` (blocks), `youtubeId`, `thumbnail` (media), `category`, `slug`, `publishedAt`.

---

### News
Content type: `api::news-item.news-item`

- GET `/api/news-items` — List news
  - Common: `?populate=thumbnail&sort=publishedAt:desc`

- GET `/api/news-items/:id` — By id
  - Common: `?populate=thumbnail`

- GET `/api/news-items?filters[slug][$eq]=<slug>` — By slug
  - Common: `&populate=thumbnail`

Fields: `title`, `content` (blocks), `thumbnail` (media), `slug`, `publishedAt`.

---

### Live TV (2 channels)
Content type: `api::live-tv.live-tv`

- GET `/api/live-tvs` — List channels
  - Common: `?filters[isActive][$eq]=true&populate=thumbnail&sort=name:asc`

- GET `/api/live-tvs/:id` — Channel by id
  - Common: `?populate=thumbnail`

- GET `/api/live-tvs?filters[channelKey][$eq]=<key>` — By channel key/slug

Fields: `name`, `channelKey` (uid), `streamUrl`, `backupStreamUrl`, `thumbnail` (media), `isActive`.

---

### Testimonials
Content type: `api::testimonial.testimonial`

- GET `/api/testimonials` — List testimonials
  - Common: `?sort=id:desc`

- GET `/api/testimonials/:id`

Fields: `name`, `role`, `image`, `quote`.

---

### Bible Study / School
Content type: `api::bible-study.bible-study`

- GET `/api/bible-studies` — List studies
  - Common: `?sort=lessonDate:desc`

- GET `/api/bible-studies/:id`

- GET `/api/bible-studies?filters[slug][$eq]=<slug>`

Fields: `title`, `lessonDate`, `outline` (blocks), `teacher`, `materials` (files), `slug`.

---

### Events (Upcoming & Past)
Content type: `api::event.event`

- GET `/api/events` — List events
  - Common: `?populate=thumbnail&sort=date:desc`

- GET `/api/events/:id`
  - Common: `?populate=thumbnail`

- GET `/api/events?filters[slug][$eq]=<slug>`
  - Common: `&populate=thumbnail`

- Upcoming only: `/api/events?filters[date][$gte]=<ISO_NOW>&sort=date:asc`
- Past only: `/api/events?filters[date][$lt]=<ISO_NOW>&sort=date:desc`

Fields: `title`, `description` (blocks), `date` (datetime), `location`, `thumbnail` (media), `slug`.

---

### Pray With Us
Content types: `api::prayer.prayer`, `api::prayer-session.prayer-session`

- GET `/api/prayers` — List prayer requests (typically restricted)
  - Filters by status: `?filters[status][$eq]=new`

- POST `/api/prayers` — Submit a prayer request (public-allowed)
  - Body (JSON):
    ```json
    {
      "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1...",
        "request": "Please pray for...",
        "status": "new",
        "session": <prayer-session-id or omit>
      }
    }
    ```

- GET `/api/prayer-sessions` — List sessions (if exposed)

Prayer fields: `name`, `email`, `phone`, `request`, `status` (new|in-progress|prayed), `session` (relation).

---

### Departments & Volunteering
Content type: `api::department.department`

- GET `/api/departments` — List departments
  - Common: `?populate=thumbnail&sort=name:asc`

- GET `/api/departments/:id` — By id
  - Common: `?populate=thumbnail`

- GET `/api/departments?filters[slug][$eq]=<slug>` — By slug
  - Common: `&populate=thumbnail`

Fields: `name`, `description`, `lead`, `email`, `thumbnail` (image), `slug`.

If volunteering uses onboarding, submit via onboarding endpoint below (with a chosen department).

---

### Donations & Giving
Content type: `api::donation.donation`

- GET `/api/donations` — List donations (usually restricted)

- POST `/api/donations` — Create a donation record (if exposed)
  - Body:
    ```json
    {
      "data": {
        "donor": "Jane Doe",
        "amount": 100.00,
        "type": "Tithe",
        "method": "Online",
        "reference": "PAY-12345",
        "notes": "Monthly tithe",
        "date": "2025-01-01"
      }
    }
    ```

Fields: `donor`, `amount` (decimal), `type` (Tithe|Offering|Building|Fund|Missions|Special), `method` (Cash|Bank Transfer|Online|Mobile Money|Cheque), `reference`, `notes`, `date`.

Tip: If using an external payment gateway, handle payment off-platform and POST a confirmed record here.

---

### Onboarding / Registration
Content type: `api::onboarding.onboarding`

- POST `/api/onboardings` — Submit onboarding form (public-allowed)
  - Body:
    ```json
    {
      "data": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1...",
        "address": "...",
        "isMember": true,
        "churchBranch": "Main",
        "department": <department-id>,
        "isChristian": true,
        "previousChurch": "...",
        "notes": "...",
        "followUpNeeded": true
      }
    }
    ```

- GET `/api/onboardings` — List submissions (restricted)

Fields: `fullName`, `email`, `phone`, `address`, `isMember`, `churchBranch`, `department` (relation), `isChristian`, `previousChurch`, `notes`, `followUpNeeded`.

---

### Members (Profile-like data)
Content type: `api::member.member`

- GET `/api/members` — List (restricted)
- GET `/api/members/:id` — By id (restricted)

Fields: `name`, `email`, `phone`, `address`, `joinDate`, `member_status` (Active|Inactive|Visitor), `department`, `birthDate`, `maritalStatus`.

---

### About Us (Public)
Content type: `api::about-us.about-us` (single type or collection type depending on config)

- If collection:
  - GET `/api/about-uses` — List
  - GET `/api/about-uses/:id`
- If single type (typical):
  - GET `/api/about-us` — Single

Also see components under `components/about-us/*`.

---

### Common Query Examples

- Pagination: `?pagination[page]=1&pagination[pageSize]=10`
- Sorting: `?sort=createdAt:desc`
- Field selection: `?fields[0]=title&fields[1]=slug`
- Filtering by slug: `?filters[slug][$eq]=my-slug`
- Populate all: `?populate=*`
- Populate selective: `?populate[thumbnail]=*&populate[materials]=*`

Combine params, e.g.:
`/api/sermons?filters[slug][$eq]=hope&populate[thumbnail]=*&fields[0]=title&fields[1]=speaker`

---

### Media URLs
Media fields return an object with a `url` that may be relative. Prepend your base URL when needed.

---

### Permissions Checklist (Dashboard)

- Public role:
  - GET for content types shown publicly (sermons, entertainment, news, live-tvs, events, about-us, testimonials, departments)
  - POST for `prayers` and `onboardings`

- Authenticated role (if using login-restricted dashboard):
  - GET additional data as needed (e.g., members, donations)

Configure in Strapi Admin → Settings → Users & Permissions → Roles.


