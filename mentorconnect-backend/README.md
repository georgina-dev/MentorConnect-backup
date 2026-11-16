# MentorConnect - Django Backend (Authentication & Core Services)

MentorConnect is an institutional and open peer-mentorship platform designed for seamless knowledge exchange, shared collaborative workspaces, identity verification, and curated career progression tracks.

## Features
- **Custom User Model**: Unified account model supporting 4 core roles:
  - `STUDENT` (Mentees pursuing academic or technical milestones)
  - `MENTOR` (Peer mentors with proven domain experience)
  - `EXPERT` (Industry leaders, faculty, and academic researchers)
  - `ADMIN` (Platform governance, verification reviewers, domain curators)
- **Identity Verification Workflow**:
  - Unverified -> Pending Review -> Verified / Rejected
  - Multi-document submission support (Student ID, Institutional email, Certifications, Degree diplomas)
  - Admin audit queues with feedback loop
- **JWT Authentication**:
  - Secure claims embedded with user role, verification status, and avatar
  - Token refresh and rotation support
- **PostgreSQL Database Support**:
  - Configured with `psycopg2-binary`
  - Seamless zero-config fallback to SQLite for immediate local development and testing
- **CORS Enabled**: Configured for Angular front-end dev servers (`http://localhost:4200`).

## Quick Start

```powershell
# 1. Install dependencies
py -3.13 -m pip install -r requirements.txt

# 2. Run migrations
py -3.13 manage.py migrate

# 3. Seed demo accounts (Admin, Students, Mentors, Experts)
py -3.13 manage.py seed_data

# 4. Start the server
py -3.13 manage.py runserver 8000
```

### Pre-seeded Demo Accounts
All pre-seeded accounts have the password: `password123`
- **Admin**: `admin`
- **Student**: `alex_student`
- **Mentor**: `maya_mentor`
- **Expert**: `dr_marcus`
- **Mentor (Design)**: `sarah_design`
- **Expert (Finance)**: `jordan_finance`
