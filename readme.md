## 📜 License References

![Python](https://img.shields.io/badge/Python-3.10-blue)
![Django](https://img.shields.io/badge/Django-5.0-darkgreen)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)
![License](https://img.shields.io/badge/License-MIT-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-success)

# Overview

VitalMatch prioritizes speed, reliability, and simplicity by intelligently matching donors and ensuring requests are fulfilled efficiently.

---

![Project Thumbnail](assets/thumbnail.png)

---

## Project Url(s)
Figma Url:
Frontend URL: 
Backend API:

---

## Test Data
You can use the following seeded users:

For Hospital

Username: hospital1
Password: password123

For Donors
Username: donor0 → donor29
Password: password123

---

## Problem
Hospitals face delays in sourcing compatible blood donors during emergencies due to:

- Manual processes
- Limited visibility
- Lack of real-time matching

---

## Solution
VitalMatch connects hospitals with nearby, verified donors using intelligent matching and ensures requests are fulfilled, not just initiated.

---

## How it works
Create Request → Match Donors → Accept → Confirm → Complete or Retry

---

## Core Features
- Intelligent matching (distance + genotype + activity)
- Multi-donor acceptance
- Fulfillment tracking
- Retry mechanism
- Reward system (simulated)

---

## Matching Logic
Score = Haversine Distance - (0.1 × Reward Points)

- Lower score = better match
- Filters: blood group + genotype

---

## Verification (Interswitch)
- Donors → NIN
- Hospitals → CAC

---

## Business Model
- Hospitals pay per successful request
- Subscription model (future)

---

## Tech Stack
- **Backend**: Django + Django REST Framework
- **Database**: PostgreSQL (SQLite for local dev)
- **Frontend**: React
- **Notifications**: SMS (mocked in MVP)
- **Deployment**: Render, Vercel
- **ThirdPrty-Intehration**: Interswitch APIs

---


## Folder Structure

---


## Local Setup for backend service

```bash
# Clone the repository locally
git clone <repo-url>
cd vitalmatch-buildathon/backend


# Set up virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  

# or 
env\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run migration
python manage.py migrate

# Start the server
python manage.py runserver
```

### Access Swagger docs at

```http://127.0.0.1:8000/swagger/```

---

## Local Setup for frontend service

---

## What Makes Us Different
We don’t just match donors, we ensure fulfillment.