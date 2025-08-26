# Church Dashboard System

This document outlines the comprehensive user dashboard system that has been implemented for the Calvary Mission HPC church website.

## Overview

The dashboard system provides authenticated users with access to manage various aspects of church operations, including media content, events, prayer requests, and more. The system is built with Next.js and integrates with Strapi as the backend CMS.

## Features

### 🔐 Authentication System
- **User Registration**: Multi-step onboarding flow for members and non-members
- **User Login**: Secure authentication with JWT tokens
- **Protected Routes**: Dashboard access restricted to authenticated users
- **Session Management**: Persistent authentication with secure cookies

### 📱 Dashboard Sections

#### 1. **Sermons Management**
- Upload and manage sermon content
- Categorize and tag sermons
- Track view counts and engagement
- Draft, publish, and archive functionality

#### 2. **Entertainment Media**
- Manage church entertainment content
- Upload videos, music, and other media
- Organize content by category

#### 3. **News Management**
- Create and publish church news
- Manage news categories and tags
- Schedule publication dates

#### 4. **Testimonies**
- Collect and manage member testimonies
- Moderate content before publication
- Organize by themes or categories

#### 5. **Bible School/Study**
- Plan and organize bible lessons
- Manage study materials and resources
- Track student progress and attendance

#### 6. **Events Management**
- Schedule church events
- Manage upcoming and past events
- Send notifications and reminders

#### 7. **Pray with Us**
- Submit prayer requests
- Manage prayer sessions
- Track answered prayers

#### 8. **Church Departments & Volunteering**
- Manage ministry departments
- Volunteer registration and management
- Department-specific content and resources

#### 9. **Donations & Giving**
- Track financial contributions
- Generate reports and analytics
- Manage recurring donations

### 🎯 Onboarding Flow

#### For Church Members:
1. Basic information (name, email, password)
2. Contact details (phone, address)
3. Church branch and department selection

#### For Non-Members:
1. Basic information (name, email, password)
2. Contact details (phone, address)
3. Christian status verification
4. Current church information (if applicable)

## Technical Architecture

### Frontend (Next.js 15)
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management

### Authentication
- **JWT-based** authentication
- **HTTP-only cookies** for security
- **Protected route components**
- **Automatic session validation**

### API Integration
- **Strapi proxy routes** for backend communication
- **RESTful API** endpoints
- **Error handling** and validation
- **Type-safe** API calls

### File Structure
```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── sermons/page.tsx
│   └── api/
│       └── auth/
│           ├── login/route.ts
│           ├── register/route.ts
│           ├── logout/route.ts
│           └── me/route.ts
├── components/
│   ├── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── DashboardNav.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── QuickActions.tsx
│   │   └── RecentActivity.tsx
│   └── navbar.tsx
└── lib/
    └── auth-context.tsx
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Strapi backend running

### Environment Variables
```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_token
```

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Usage

#### 1. **User Registration**
- Navigate to `/auth/register`
- Complete the 3-step onboarding process
- Account is automatically created in Strapi

#### 2. **User Login**
- Navigate to `/auth/login`
- Use email/username and password
- Redirected to dashboard upon success

#### 3. **Dashboard Access**
- All dashboard routes are protected
- Unauthenticated users are redirected to login
- Session persists across browser sessions

## Security Features

- **JWT Token Validation**: All API calls validate authentication
- **Protected Routes**: Dashboard access requires valid session
- **Secure Cookies**: HTTP-only cookies prevent XSS attacks
- **Input Validation**: Form validation on both client and server
- **Error Handling**: Secure error messages without information leakage

## Strapi Integration

The system is designed to work seamlessly with Strapi:

### Content Types Needed
- **Users**: Extended with church-specific fields
- **Sermons**: Media content management
- **Events**: Calendar and event management
- **Prayer Requests**: Prayer management system
- **Donations**: Financial tracking
- **Departments**: Ministry organization

### API Endpoints
- `/api/auth/local` - User authentication
- `/api/auth/local/register` - User registration
- `/api/users/me` - User profile retrieval

## Customization

### Adding New Dashboard Sections
1. Create new page in `src/app/dashboard/`
2. Add navigation item to `DashboardNav.tsx`
3. Create corresponding API routes
4. Update Strapi content types

### Styling
- Uses Tailwind CSS utility classes
- Consistent design system with existing theme
- Responsive design for all screen sizes

### State Management
- React Context for authentication state
- Local state for component-specific data
- Strapi integration for persistent data

## Future Enhancements

- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: User engagement tracking
- **Mobile App**: React Native companion app
- **Multi-language Support**: Internationalization
- **Advanced Permissions**: Role-based access control
- **API Rate Limiting**: Enhanced security measures

## Support

For technical support or questions about the dashboard system, please refer to the development team or create an issue in the project repository.

## License

This dashboard system is part of the Calvary Mission HPC church website project.
