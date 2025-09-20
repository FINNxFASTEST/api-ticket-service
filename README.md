# 🎫 NestJS Tickets + BullMQ Starter

Backend สำหรับ **Ticket Management System**

- ✅ CRUD Tickets
- ✅ BullMQ Queues (Notify, SLA)
- ✅ Queue Metrics (`/admin/queues/:name/stats`)
- ✅ Validation & Swagger
- ✅ SQLite + Prisma ORM
- ✅ e2e Tests (CRUD + concurrent cases)

---

## 🚀 Tech Stack

- [NestJS](https://nestjs.com/) + TypeScript
- [Prisma](https://www.prisma.io/) + SQLite (เปลี่ยนเป็น Postgres/MySQL ได้)
- [BullMQ](https://docs.bullmq.io/) + Redis
- [Swagger](https://swagger.io/) (API Docs)
- [Jest](https://jestjs.io/) (unit/e2e tests)

---

## 📂 Project Structure

```text
project-root
├─ prisma/
│  ├─ schema.prisma         # DB schema
│  └─ migrations/           # Prisma migrations
├─ src/
│  ├─ tickets/              # Tickets CRUD
│  ├─ queues/               # BullMQ queues
│  ├─ admin/                # Queue metrics endpoint
│  ├─ app.controller.ts     # Root + uptime
│  ├─ app.module.ts
│  └─ main.ts
└─ test/                    # e2e tests
```
---


## ⚙️ Setup

### 1. Clone repo & install deps

git clone <repo-url>
cd project
npm install

### 2. Setup env

สร้างไฟล์ `.env` (ใช้ SQLite และ Redis local)

DATABASE_URL="file:./dev.db"
REDIS_HOST=localhost
REDIS_PORT=6379

### 3. Start Redis (ถ้าไม่มี ให้ใช้ Docker)

docker run --name redis -p 6379:6379 -d redis:6-alpine

### 4. Prisma migrate

npx prisma migrate dev --name init

### 5. Run app

npm run dev

Server จะรันที่:

- API → http://localhost:3000
- Swagger → http://localhost:3000/api/docs#/

---

## 🧪 Run Tests

### e2e Tests

npm run test:e2e

ผลลัพธ์ (ตัวอย่าง):

PASS test/tickets.e2e-spec.ts
PASS test/races.e2e-spec.ts

### Unit Tests

npm run test

---

## 📌 API Endpoints

### Tickets

- POST /tickets → create
- GET /tickets → list (filter + pagination)
- GET /tickets/:id → get one
- PATCH /tickets/:id → update (title, description, priority, status)
- DELETE /tickets/:id → remove

**Example (POST /tickets):**
{
"title": "Coldplay World Tour 2025",
"description": "VIP Zone",
"seatNumber": "A12",
"price": 3500,
"priority": "HIGH"
}

### Admin

- GET /admin/queues/:name/stats → queue metrics

### Root

- GET / → Hello World
- GET /uptime → server uptime

---

## 🔥 Notes

- Jobs มี idempotent jobId (`notify:{ticketId}`, `sla:{ticketId}`)
- SLA job auto remove เมื่อ ticket → RESOLVED
- Validation: title ≥ 5 chars, description ≤ 5000, enums check
- DB default: SQLite (`dev.db`) → เปลี่ยนไปใช้ Postgres/MySQL ได้ง่าย ๆ แค่แก้ `.env` + `schema.prisma`

---

## 📜 License

MIT
