![Python](https://img.shields.io/badge/Python-3.10-blue)
![Django](https://img.shields.io/badge/Django-5.2-darkgreen)
![React](https://img.shields.io/badge/React-19-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)
![License](https://img.shields.io/badge/License-MIT-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-success)

# VitalMatch

A real-time blood donor matching platform designed to connect hospitals with nearby, compatible donors quickly and efficiently.

The system prioritizes proximity, donor reliability, and availability to ensure faster response times and increased chances of successful blood donations.

---

![Project Thumbnail](assets/thumbnail.png)

---

## Project URLs

- **Figma**: [Design Prototype](https://www.figma.com/design/CQYK9CjaA0rYmjD1FiB8im/Vitalmatch?node-id=2-208)
- **Frontend**: [vitalmatch-buildathon.vercel.app](https://vitalmatch-buildathon.vercel.app)
- **Backend**: [vitalmatch-backend-service.onrender.com](https://vitalmatch-backend-service.onrender.com)
- **PRD**: [Product Requirements Document](https://docs.google.com/document/d/1-61HKvhlMHySqrSDV67Hc3hSKzDIaIvC2sdiOl5x_Tc/edit?tab=t.0#heading=h.z0dpv950mw29)

---

## Problem

Hospitals often struggle to find compatible blood donors quickly during emergencies. Traditional methods are:

- Slow
- Inefficient
- Manual
- Unreliable

VitalMatch solves this by providing intelligent, real-time donor matching.

---

## Solution

VitalMatch enables hospitals to:

- Create blood requests instantly
- Automatically find nearby donors
- Notify and receive responses from donors
- Track fulfillment progress in real time
- Confirm donations and reward donors

---

## Core Features

**Hospital Features**
- Create blood requests
- View all requests (dashboard)
- Track fulfillment progress (open → partial → completed)
- View matched donors with contact details
- Retry matching when no donors are available
- Confirm donations

**Donor Features**
- Register and login
- Set availability
- Receive blood donation requests
- Accept requests
- View donation history
- Earn reward points

**Intelligent Matching Engine**
- Distance-based matching (Haversine formula)
- Reliability scoring (successful donations)
- Activity scoring (reward points)
- Explainable matching (“why this donor”)

**Notifications**
- Donor receives confirmation notifications
- Hospital sees donor responses
- Keeps both parties informed in real-time

---

## How It Works

1. Hospital creates a blood request
2. System finds and ranks nearby donors (dynamic radius expansion from 5 km to 500 km)
3. Donors receive notifications and accept or ignore requests
4. Hospital views accepted donors
5. Hospital confirms donation
6. System:
   - Updates fulfillment progress (atomic, race-condition safe)
   - Rewards donor with points
   - Updates donor reliability score
   - Marks donor as available again

---

## Verification

- **Interswitch API** — CAC (Corporate Affairs Commission) verification for hospitals

---

## System Design

- Secure authentication (JWT with token rotation and blacklisting)
- Role-based access control (Hospital vs Donor)
- Service-based architecture (matching logic separated from views)
- Atomic transactions on critical paths (donation confirmation, donor matching)
- CORS origin whitelisting (environment-configurable)
- Django admin panel for data inspection
- Structured logging per app

---

## Tech Stack

- **Backend**: Django 5.2 + Django REST Framework
- **Database**: PostgreSQL (SQLite for local dev)
- **Frontend**: React 19 + Vite + Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Notifications**: In-app (mocked in MVP)
- **Deployment**: Render (backend), Vercel (frontend)
- **Third-Party Integration**: Interswitch API

---

## Team Contributions

- **Olajide Ojo** (Backend Engineer)
  - Designed system architecture
  - Built authentication (JWT)
  - Implemented matching engine (Haversine + scoring)
  - Developed APIs (requests, retry, confirmation, notifications)
  - Integrated CAC verification API

- **Sangogade Ayomide** (Frontend Developer)
  - Built user interface
  - Integrated backend APIs
  - Designed dashboards

- **Kauna Ishaya** (UI/UX Designer)
  - Designed Figma prototypes
  - Created user flows and experience

- **Tosin Oladele** (Product/Research)
  - Defined problem scope
  - Conducted user research
  - Shaped product direction
  - Managed PRD, Sprint planning, and task coordination
  - Product vision and execution

---

## Future Improvements

- Real-time notifications (WebSockets)
- Payment/reward withdrawal system
- AI-based demand prediction
- Integration with national blood banks
- Full NIN verification integration

---

## Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (optional — SQLite works for local dev)

### Backend

```bash
# Clone the repository
git clone <repo-url>
cd vitalmatch-buildathon/backend

# Set up virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Create a .env file (see Environment Variables below)
cp .env.example .env

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

Swagger docs: http://127.0.0.1:8000/

### Frontend

```bash
cd frontend/vitalmatch-buildathon

# Install dependencies
npm install

# Start the development server
npm run dev
```

App: http://localhost:5173

---

## Environment Variables

### Backend (`.env`)

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=postgres://user:password@host:port/dbname
ALLOWED_HOSTS=localhost,127.0.0.1

CORS_ALLOWED_ORIGINS=http://localhost:5173,https://vitalmatch-buildathon.vercel.app
CSRF_TRUSTED_ORIGINS=http://localhost:5173,https://vitalmatch-buildathon.vercel.app

INTERSWITCH_AUTH_URL=https://sandbox.interswitchng.com/...
INTERSWITCH_CLIENT_ID=your-client-id
INTERSWITCH_CLIENT_SECRET=your-client-secret
INTERSWITCH_VERIFY_CAC_URL=https://sandbox.interswitchng.com/...
INTERSWITCH_SANDBOX_TEST_NAME=your-test-company
```

### Frontend

Create a `.env.local` in `frontend/vitalmatch-buildathon/`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

> **Note**: The frontend connects to the production backend by default. Set `VITE_API_URL` to point to your local backend during development.

---

## What Makes Us Different

- Intelligent donor ranking (not random matching)
- Retry system for failed matches with dynamic radius expansion
- Real-time fulfillment tracking
- Explainable matching decisions (“why this donor”)
- Race-condition safe donation confirmation
