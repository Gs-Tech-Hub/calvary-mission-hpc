# Church Manager API

A comprehensive REST API for church management systems, built with NestJS and Prisma.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Pastor, Staff, Member, Guest)
- Secure password hashing with bcrypt
- User registration and login

### 👥 Membership Management
- Member registration and profiles
- Membership types (Regular, Youth, Senior, Visitor, Online)
- Member search and filtering
- Automatic member number generation

### 💰 Donations & Payments
- Multiple donation types (Tithing, Offering, Special Offering, Mission, Building Fund)
- Donation categories (General, Youth Ministry, Music Ministry, etc.)
- Payment processing with multiple methods
- Anonymous donation support
- Comprehensive reporting and analytics

### 📺 Livestream Management
- Stream key generation and management
- RTMP URL configuration
- Live stream status tracking
- Start/stop stream controls

### 📅 Event Management
- Event creation and scheduling
- Member registration for events
- Capacity management
- Upcoming events filtering

### 📊 Reporting & Analytics
- Donation statistics by type and category
- Payment processing statistics
- Member attendance tracking
- Financial reporting

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- SQLite (or configure for other databases)

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend/api
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp env.example .env
```

4. Update the `.env` file with your configuration:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

5. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Members
- `GET /members` - Get all members
- `GET /members/:id` - Get member by ID
- `POST /members` - Create member
- `PATCH /members/:id` - Update member
- `DELETE /members/:id` - Delete member

### Donations
- `GET /donations` - Get all donations
- `GET /donations/stats` - Get donation statistics
- `GET /donations/:id` - Get donation by ID
- `POST /donations` - Create donation
- `PATCH /donations/:id` - Update donation
- `DELETE /donations/:id` - Delete donation

### Livestreams
- `GET /livestreams` - Get all livestreams
- `GET /livestreams/active` - Get active livestream
- `GET /livestreams/:id` - Get livestream by ID
- `POST /livestreams` - Create livestream
- `PATCH /livestreams/:id` - Update livestream
- `POST /livestreams/:id/start` - Start livestream
- `POST /livestreams/:id/stop` - Stop livestream
- `DELETE /livestreams/:id` - Delete livestream

### Payments
- `GET /payments` - Get all payments
- `GET /payments/stats` - Get payment statistics
- `GET /payments/:id` - Get payment by ID
- `POST /payments` - Create payment
- `PATCH /payments/:id` - Update payment
- `POST /payments/:id/process` - Process payment
- `DELETE /payments/:id` - Delete payment

### Events
- `GET /events` - Get all events
- `GET /events/upcoming` - Get upcoming events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create event
- `PATCH /events/:id` - Update event
- `POST /events/:id/register/:memberId` - Register member for event
- `POST /events/:id/unregister/:memberId` - Unregister member from event
- `DELETE /events/:id` - Delete event

## Database Schema

The application uses Prisma with the following main models:

- **User**: Authentication and user management
- **Member**: Church membership information
- **Donation**: Financial contributions
- **Payment**: Payment processing
- **Livestream**: Streaming management
- **Event**: Event scheduling and registration
- **Service**: Church service schedules
- **Ministry**: Ministry group management
- **Attendance**: Member attendance tracking

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Development

### Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

## Production Deployment

1. Set production environment variables
2. Use a production database (PostgreSQL, MySQL)
3. Configure proper JWT secrets
4. Set up SSL/TLS certificates
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging
7. Configure backup strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
