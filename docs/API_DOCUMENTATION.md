# CampusFind REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### POST `/api/auth/register`
Create a new student or campus member account.

**Request Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@campus.edu",
  "password": "password123",
  "studentId": "CS-2024-042",
  "department": "Computer Science",
  "phone": "+1 (555) 234-5678",
  "whatsapp": "+15552345678"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65e2b4...",
    "name": "Alex Johnson",
    "email": "alex@campus.edu",
    "studentId": "CS-2024-042",
    "department": "Computer Science",
    "phone": "+1 (555) 234-5678",
    "whatsapp": "+15552345678",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
    "role": "student"
  }
}
```

---

### POST `/api/auth/login`
Authenticate user and return JWT bearer token.

**Request Body:**
```json
{
  "email": "alex@campus.edu",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65e2b4...",
    "name": "Alex Johnson",
    "email": "alex@campus.edu",
    "role": "student"
  }
}
```

---

### GET `/api/auth/me` *(Protected)*
Fetch authenticated user profile details from token.

---

## 2. Items Endpoints (`/api/items`)

### GET `/api/items`
Retrieve lost/found items with filtering, search keywords, and pagination.

**Query Parameters:**
- `type`: `lost` | `found`
- `category`: `Electronics` | `Keys` | `Bags & Wallets` | etc.
- `location`: `Central Library` | `Main Cafeteria & Food Court` | etc.
- `status`: `active` | `resolved`
- `search`: Keyword query string
- `sort`: `newest` | `oldest` | `date_lost_desc` | `views`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 12,
  "total": 48,
  "totalPages": 4,
  "currentPage": 1,
  "items": [
    {
      "_id": "65e2c1...",
      "title": "Apple AirPods Pro 2 in White Case",
      "type": "lost",
      "category": "Electronics",
      "location": "Central Library",
      "specificLocation": "2nd Floor Study Desk #14",
      "date": "2026-08-20T10:00:00.000Z",
      "description": "Lost white AirPods Pro 2 case...",
      "status": "active",
      "images": [{ "url": "https://..." }],
      "postedBy": {
        "name": "Alex Johnson",
        "email": "alex@campus.edu"
      }
    }
  ]
}
```

---

### GET `/api/items/:id`
Fetch complete single item details. Automatically increments view counter.

---

### POST `/api/items` *(Protected, Multipart/Form-Data)*
Create a new Lost or Found item post with image upload.

**Form Fields:**
- `type`: `lost` or `found`
- `title`: String
- `category`: String
- `location`: String
- `specificLocation`: String
- `date`: ISO Date string
- `description`: String
- `brand`: String
- `color`: String
- `tags`: Comma-separated string or array
- `contactPreference`: `in_app` | `whatsapp` | `phone` | `email`
- `contactPhone`: String
- `reward`: String (Optional)
- `images`: Image file(s) (JPEG/PNG/WEBP)

---

### PATCH `/api/items/:id/status` *(Protected)*
Mark an item as `resolved` (recovered/returned) or reactivate it.

**Request Body:**
```json
{
  "status": "resolved"
}
```

---

### DELETE `/api/items/:id` *(Protected, Owner only)*
Permanently delete an item report.

---

## 3. Intelligent Match Algorithm Endpoints (`/api/matches`)

### GET `/api/matches/:itemId`
Computes match scores between the target item and all opposite active candidates across campus.

**Response (200 OK):**
```json
{
  "success": true,
  "targetItem": {
    "_id": "65e2c1...",
    "title": "Apple AirPods Pro 2 in White Case",
    "type": "lost",
    "category": "Electronics",
    "location": "Central Library"
  },
  "count": 2,
  "matches": [
    {
      "item": {
        "_id": "65e2c5...",
        "title": "Found Apple AirPods in White Case",
        "type": "found",
        "category": "Electronics",
        "location": "Central Library"
      },
      "matchScore": 88,
      "matchLabel": "Possible Match: 88%",
      "confidence": "High",
      "breakdown": {
        "categoryScore": 35,
        "keywordScore": 23,
        "locationScore": 20,
        "dateScore": 10,
        "sharedKeywords": ["airpods", "apple", "case", "white"],
        "locationMatch": true,
        "daysDiff": 1
      }
    }
  ]
}
```

---

### GET `/api/matches/user/dashboard` *(Protected)*
Returns top high-confidence match recommendations across all active posts owned by the authenticated student.

---

### POST `/api/matches/compare`
Compares two specific items directly side-by-side with full score breakdown.

---

## 4. User & Claim Endpoints (`/api/users`)

### GET `/api/users/profile` *(Protected)*
Get user profile and personal recovery statistics.

### PUT `/api/users/profile` *(Protected)*
Update user name, phone, WhatsApp, roll number, department, or avatar.

### GET `/api/users/stats/campus`
Get aggregate campus metrics (Total items, Active lost, Active found, Resolved count, Recovery rate %).

### POST `/api/users/claims` *(Protected)*
Submit an in-app claim request or ownership proof directly to the poster.
