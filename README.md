# 🧠 System Overview  

## Role-Based Mood Content API with Personalization & Tracking  

A scalable backend system that delivers mood-based personalized content with role-based access control, tracking, and recommendation logic.

---

# 🧩 Core Modules

- Authentication  
- User Management  
- Mood System  
- Content Engine  
- Likes / Save System  
- Mood Tracking System  
- Admin Control  

---

# 👥 Team Split (5 People)

---

## 👑 1️⃣ Backend Architect — Auth + System Core

**You control the foundation of the system.**

### ✅ A. Project Architecture

- Folder structure design  
- Express setup  
- MongoDB connection  
- Environment configurations  
- Centralized error handling  
- Global response structure  

---

### ✅ B. Authentication System

- Register  
- Login  
- JWT implementation  
- Password hashing  
- Token verification middleware  

---

### ✅ C. Authorization (RBAC)

**Roles:**
- `user`
- `admin`

**Middleware:**
- `protect()`
- `authorize("admin")`

---

### ✅ D. Security

- Rate limiting  
- Input validation  
- Prevent duplicate emails  
- Secure password policies  

> You are responsible for ensuring the system is clean, scalable, and secure.

---

## 🗄 2️⃣ Dev A — Database Architect

**Focus: Schema design and database structure only.**

### 📌 Models Needed

### 1️⃣ User Model

- name  
- email  
- password  
- role  
- savedContent (ref → Content)  
- createdAt  

---

### 2️⃣ Content Model

- title  
- body  
- type (`joke | quote | story | message`)  
- moods (`happy`, `sad`, etc.)  
- tags  
- author (ref → User)  
- likesCount  
- isApproved  
- createdAt  

---

### 3️⃣ MoodLog Model

- user (ref → User)  
- mood  
- date  

---

### 4️⃣ Like Model (Optional Advanced)

- user (ref)  
- content (ref)  

---

### 📌 Additional Responsibilities

- Add database indexes  
- Set relationships  
- Configure populate structure  

---

## 📝 3️⃣ Dev B — Content Engine (Core Feature)

**This is the heart of the application.**

---

### 1️⃣ Mood Filter System

**Route:**

GET /api/content/mood/:mood


**Logic:**

- Find content matching mood  
- Only approved content  
- Return random result  

---

### 2️⃣ Random Content Generator

**Route:**

GET /api/content/random


- Use MongoDB aggregation pipeline  
- Return a random approved document  

---

### 3️⃣ Submit Content

**Route:**

POST /api/content


**Rules:**

- Only logged-in users  
- Content enters pending state  
- Admin approval required  

---

### 📌 Responsibilities

- Controllers  
- Business logic  
- Validation  

---

## 👮 4️⃣ Dev C — Like / Save + Personalization

---

### 1️⃣ Like Content

POST /api/content/:id/like


---

### 2️⃣ Save Content

POST /api/content/:id/save


---

### 3️⃣ Get Saved Content

GET /api/user/saved


---

### 4️⃣ Remove Saved Content

DELETE /api/user/saved/:id


---

### 📌 Rules

- Cannot like twice  
- Cannot save duplicate content  

---

### 📌 Responsibilities

- Favorite system  
- User personalization layer  

---

## 📊 5️⃣ Dev D — Mood Tracker + Recommendation Logic

**This is where the system becomes intelligent.**

---

### 1️⃣ Daily Mood Tracker

POST /api/mood


User logs:
- mood  
- date  

---

### 2️⃣ Get Mood History

GET /api/mood/history


---

### 3️⃣ Recommendation Logic

When a user logs a mood:

System automatically suggests content based on:

- Current mood  
- Previously liked content  
- Saved items  
- Most liked content in that mood  

---

### 📌 Responsibilities

- Rule-based recommendation algorithm  
- Aggregation queries  
- Smart content delivery  

---

# 👑 Admin Features  
*(Shared between Dev C + Dev B)*

### Admin Routes

GET /admin/content/pending
PATCH /admin/content/:id/approve
DELETE /admin/content/:id
GET /admin/users
PATCH /admin/users/:id/ban


---

# 🏗 Suggested Folder Structure

```bash
Mood-Based-Content-Generator-API/
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── utils/
└── server.js
```

---

# 🔐 Permission Matrix

| Action                | Guest | User | Admin |
|------------------------|--------|------|--------|
| View public content    | ✅     | ✅   | ✅     |
| Submit content         | ❌     | ✅   | ✅     |
| Like content           | ❌     | ✅   | ✅     |
| Save content           | ❌     | ✅   | ✅     |
| Approve content        | ❌     | ❌   | ✅     |
| Delete any content     | ❌     | ❌   | ✅     |

---

# 🚀 3-Week Sprint Plan

## Week 1
- Architecture setup  
- Authentication system  
- Database models  

---

## Week 2
- Content engine  
- Submit system  
- Like / Save system  

---

## Week 3
- Mood tracker  
- Recommendation logic  
- Admin system  
- Testing  
- API documentation  
