# MentorConnect - Peer Mentorship, Identity Verification & Collaborative Learning

MentorConnect is an institutional and open peer-mentorship ecosystem that connects ambitious students, verified peer mentors, and world-class domain experts across academic and industry disciplines.

## Project Structure

```text
MentorConnect/
├── mentorconnect-frontend/    # Modern Angular Single Page Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Navbar (with instant Role Switcher), Footer
│   │   │   ├── models/        # TypeScript interfaces (User, Mentorship, Workspaces, Resources)
│   │   │   ├── pages/         # 10 core pages (Home, Login, Register, Dashboard, Profile, 
│   │   │   │                  # Explore, Mentorship, Messages & Workspaces, Settings, Admin Dashboard)
│   │   │   ├── services/      # AuthService (JWT + Demo Switcher), MentorshipService, CollaborationService, ContentService
│   │   │   ├── app.routes.ts  # Client-side routing configuration
│   │   │   ├── app.config.ts  # HTTP client with fetch API configuration
│   │   │   └── app.ts         # Root shell component
│   │   └── styles.css         # Custom Design System with strict color palette variables
│   └── package.json
└── mentorconnect-backend/     # Django REST Framework + PostgreSQL / SQLite Backend
    ├── authentication/        # User model, roles, verification workflow, JWT endpoints, serializers
    │   ├── management/commands/seed_data.py # Test seed data generator
    │   ├── models.py          # Custom User model (STUDENT, MENTOR, EXPERT, ADMIN) & Verification requests
    │   ├── serializers.py     # Registration, login, profile, and verification serializers
    │   ├── urls.py            # REST endpoints for authentication and user management
    │   └── views.py           # JWT token generation, registration, profile, and admin audit views
    ├── config/                # Django project settings, CORS, and root URL router
    ├── requirements.txt       # Python dependencies (Django, DRF, SimpleJWT, psycopg2-binary, django-cors-headers)
    └── manage.py
```

---

## Color Palette Applied

| Color Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| **Deep Forest Green** | `#183F35` | Primary brand color, headers, primary action buttons, dark accents |
| **Warm Cream** | `#F3F0E6` | Base page background, card surfaces, badge highlights |
| **Muted Gold** | `#C5A45D` | Call-to-action highlights, rating stars, milestone progress accents |
| **Sage Green** | `#789B78` | Verified identity badges, study workspace accents, secondary pills |
| **White** | `#FFFFFF` | Card backgrounds, inputs, modal containers |
| **Charcoal** | `#303832` | High-contrast body typography and dark border accents |

---

## 4 Core Platform Objectives Implemented

1. **User Registration, Profile Creation & Identity Verification**:
   - Custom User model supporting roles: `STUDENT`, `MENTOR`, `EXPERT`, and `ADMIN`.
   - Identity verification workflow with document submission (`STUDENT_ID`, `ACADEMIC_EMAIL`, `DIPLOMA_DEGREE`, `EMPLOYMENT_PROOF`, `GOVERNMENT_ID`).
   - Audit states: `UNVERIFIED` ➔ `PENDING` ➔ `VERIFIED` / `REJECTED`.
   - Admin audit queue with Approve and Reject actions.

2. **Content Sharing Across Educational and Professional Domains**:
   - Filterable resource repository spanning *Computer Science*, *Artificial Intelligence*, *Product Design*, *Business & Finance*, *Bioinformatics*, and *Career Navigation*.
   - Community-submitted architectural blueprints, code snippets, research paper breakdowns, and templates.
   - Upvoting and contribution forms.

3. **Peer Collaboration via Shared Workspaces and Discussion Channels**:
   - Technical channels: `#general-mentorship`, `#system-design`, `#algorithms-and-ds`, `#ai-and-deep-learning`, `#career-guidance`, `#computational-biology`.
   - Shared study workspaces (e.g. *Distributed Systems Study Lab*) with live task Kanban boards (`TODO`, `IN_PROGRESS`, `DONE`) and synchronized collaborative notes.
   - Code snippet sharing with inline formatting and copy-to-clipboard.

4. **Continuous Learning & Career Development through Progress Tracking**:
   - Structured competency milestones with target due dates, category tags, and mentor verification sign-offs.
   - Visual progress bars reflecting completion percentages.
   - 1-on-1 session scheduling and video room links.

---

## Running the Application

### 1. Django Backend
```powershell
cd MentorConnect/mentorconnect-backend

# Install dependencies (if not already installed)
py -3.13 -m pip install -r requirements.txt

# Run migrations
py -3.13 manage.py migrate

# Seed test accounts & initial verification requests
py -3.13 manage.py seed_data

# Start server on http://localhost:8000
py -3.13 manage.py runserver 8000
```

### 2. Angular Frontend
```powershell
cd MentorConnect/mentorconnect-frontend

# Start development server
npm start
# or: ng serve --open
```
The frontend will launch at `http://localhost:4200`.

---

## Pre-seeded Demo Accounts
All pre-seeded demo accounts share the password: `password123`

- **Student / Mentee**: `alex_student` (Alex Chen, UC Berkeley)
- **Peer Mentor**: `maya_mentor` (Maya Patel, Stripe / CMU Alum)
- **Domain Expert**: `dr_marcus` (Dr. Marcus Rossi, Oxford / DeepMind Fellow)
- **Platform Admin**: `admin` (Eleanor Vance, Stanford / MentorConnect HQ)
- **Peer Mentor (Design)**: `sarah_design` (Sarah Kim, RISD / Figma Community)
- **Domain Expert (Finance)**: `jordan_finance` (Jordan Lee, BlackRock / Wharton)

*Tip: You can also use the **Role Preview dropdown** in the navigation bar or on the dashboard to immediately test any role's experience without signing in and out.*
