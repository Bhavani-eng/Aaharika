# Aaharika – From Excess to Access

A production-ready MERN food redistribution platform connecting Restaurants, Hotels, Bakeries, Supermarkets, and Event Organizers with NGOs, Orphanages, Shelters, and Community Kitchens.

## Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, Recharts, Socket.io Client, Leaflet Maps, HTML5 QR Scanner
- **Backend:** Node.js + Express, MongoDB + Mongoose, JWT, Cloudinary, Socket.io, Nodemailer, QR Code

## Features

- Role-based authentication (Donor, NGO, Volunteer, Admin)
- Food donation creation with image upload and map location
- Donation discovery, search, and claim workflow
- Pickup scheduling and volunteer delivery system
- QR-based pickup & delivery verification
- Real-time notifications via Socket.io
- Analytics dashboard with charts
- Emergency food requests
- Reviews & ratings
- Downloadable certificates
- Admin panel (user management, NGO verification, complaints)

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (optional, for image uploads)
- Gmail SMTP (optional, for email notifications)

## Setup

### 1. Clone and install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** – copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aaharika
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Aaharika <noreply@aaharika.org>
```

**Frontend** – copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed admin user

```bash
cd backend
node seed.js
```

Default admin credentials:
- Email: `admin@aaharika.org`
- Password: `admin123456`

### 4. Start the application

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## User Roles

| Role | Description |
|------|-------------|
| **Donor** | Restaurants, hotels, bakeries – create food donations |
| **NGO** | Shelters, orphanages – browse and claim donations |
| **Volunteer** | Pick up and deliver food between locations |
| **Admin** | Manage users, verify NGOs, handle complaints |

## API Endpoints

| Module | Base Path |
|--------|-----------|
| Auth | `/api/auth` |
| Donations | `/api/donations` |
| Claims | `/api/claims` |
| Volunteer | `/api/volunteer` |
| Notifications | `/api/notifications` |
| Reviews | `/api/reviews` |
| Certificates | `/api/certificates` |
| Emergency | `/api/emergency` |
| Complaints | `/api/complaints` |
| Admin | `/api/admin` |
| Analytics | `/api/analytics` |

## Theme Colors

- Primary: `#D97706` (Saffron Orange)
- Secondary: `#2F855A` (Leaf Green)
- Accent: `#0F766E` (Deep Teal)
- Background: `#FFF7ED`
- Text: `#1F2937`

## Project Structure

```
├── backend/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, validation, upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Email, QR, notifications
│   ├── socket/          # Socket.io handler
│   ├── validators/      # Request validation
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth & Socket providers
│   │   ├── pages/       # All page components
│   │   ├── services/    # API client
│   │   └── utils/       # Constants & helpers
│   └── index.html
└── README.md
```

## License

ISC
