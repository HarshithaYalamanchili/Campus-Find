# 🎓 CampusFind - College Lost & Found Platform with AI Matching

> A modern, full-stack **MERN** application designed for college and university campuses to report, locate, and recover lost and found valuables with an automated multi-factor matching engine.

---

## 🌟 Highlights & Standout Feature

### 🧠 Intelligent Multi-Factor Matching Algorithm
Unlike traditional bulletin boards that require manual scrolling, CampusFind features an automated algorithm that pairs **Lost Items** with **Found Items** across 4 key dimensions:

$$\text{Match Score} = \text{Category} (35\%) + \text{Keywords/Title} (30\%) + \text{Campus Location} (20\%) + \text{Date Proximity} (15\%)$$

- **Category Match (35 pts)**: Exact taxonomy match or related category grouping.
- **Semantic / Keyword Similarity (30 pts)**: Tokenized Jaccard similarity on title, description, brand, and color tokens.
- **Campus Zone Proximity (20 pts)**: Primary campus zone and specific study desk/room overlap.
- **Date Proximity (15 pts)**: Time-decay scoring based on days elapsed between lost and found incidents.
- **Live Output**: Generates clean badges like `"Possible Match: 85%"` with side-by-side comparison modals and dashboard match alerts!

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router DOM v6, date-fns |
| **Backend** | Node.js, Express.js (MVC Pattern), Mongoose ODM, JWT, Multer |
| **Database** | MongoDB / MongoDB Atlas (with automatic in-memory fallback for local dev) |
| **Storage** | Cloudinary (with local disk storage fallback) |
| **Security** | bcryptjs password hashing, JWT protected routes, sanitize queries |

---

## 📱 10 Dedicated Responsive Pages

1. **Landing Page (`/`)**: Hero section with lost/found quick toggle search, live campus stats counter, 3-step guide, and recent reports ticker.
2. **Login (`/login`)**: Authentication with 1-click Quick Demo logins (Alex, Sarah, Admin).
3. **Register (`/register`)**: Student registration with Student ID/Roll number, Department, Phone, WhatsApp, and avatar.
4. **Dashboard (`/dashboard`)**: Student metrics, recovery rate %, and active AI match alerts.
5. **Lost Items Directory (`/lost`)**: Searchable list with category, campus location, date, and status filters.
6. **Found Items Directory (`/found`)**: Found feed with filter tools and instant claim buttons.
7. **Post Item (`/post`)**: Form to report Lost or Found items with drag-and-drop image upload, campus zones, and contact preferences.
8. **Item Details (`/item/:id`)**: High-res image gallery, poster contact modal (WhatsApp/Call/Email), and automated matching recommendations.
9. **My Posts (`/my-posts`)**: Tabbed manager to edit, delete, mark resolved, or view matches for your posts.
10. **Profile (`/profile`)**: Update student info, contact details, randomize avatar, and inspect personal recovery stats.

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Clone & Install Dependencies
```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Backend: Copy `.env.example` to `.env`:
```bash
PORT=5000
MONGODB_URI= # Leave empty to use auto in-memory MongoDB, or provide your Atlas URI
JWT_SECRET=campusfind_jwt_super_secret_key_2024
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Frontend: Copy `.env.example` to `.env`:
```bash
VITE_API_URL=
```

### 3. Run Development Servers
Start backend:
```bash
cd backend
npm start
```

Start frontend:
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser!

---

## 🔑 Demo Accounts

The database comes pre-seeded with realistic lost & found test items designed to demonstrate the matching algorithm immediately:

| Role | Email | Password | Pre-seeded Posts |
|---|---|---|---|
| **Student 1** | `alex@campus.edu` | `password123` | AirPods Pro (Lost), Dell Charger (Found), Brown Wallet (Lost) |
| **Student 2** | `sarah@campus.edu` | `password123` | AirPods Pro (Found - ~90% Match!), Casio Calculator (Lost) |
| **Admin** | `admin@campus.edu` | `admin123` | Campus Security Handed-in Items |

---

## 📖 API Documentation
For exhaustive endpoint specifications, request payloads, and sample responses, check [`docs/API_DOCUMENTATION.md`](./docs/API_DOCUMENTATION.md).

---

## 📄 License
MIT License. Created for University Campus Communities.
