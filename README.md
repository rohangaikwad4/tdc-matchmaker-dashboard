# TDC Matchmaker Dashboard

An internal tool MVP for the TDC team to manage customers, view profiles, and assign matches. Built with React + Vite.

## Features

### Login & Signup
- New users can sign up with name, username, and password
- Returning users sign in with their credentials
- Two built-in demo accounts: `admin / admin123` and `matchmaker / match123`

### Dashboard — Customer List
- Displays customers assigned to the logged-in matchmaker
- Shows key info: Name, Age, City, Marital Status, Status Tag
- Search by name or city; filter by journey status
- Manage button to add/remove assigned customers
- Reassign button to randomly pick a new set
- Analytics cards for total customers, matches sent, active discussions, and closed

### Customer Detailed View
Full biodata for each customer:

| Field | Field | Field |
|---|---|---|
| First Name | Last Name | Gender |
| Date of Birth | Age | Country |
| City | Height | Email |
| Phone Number | Education (College + Degree) | Income (₹ LPA) |
| Current Company | Designation | Marital Status |
| Languages Known | Siblings | Caste |
| Religion | Manglik | Diet |
| Smoking | Drinking | Family Type |
| Hobbies | Want Kids | Open to Relocate |
| Open to Pets | About | |

Journey stage can be updated via dropdown (New → Profile Verified → Matches Reviewed → Meeting Scheduled → Active Discussion → Closed).

### AI Match Insights
- Score/rank matches with labels: Excellent (85+), High Potential (70+), Good (55+), Fair (40+), Low (below 40)
- Insight cards explaining compatibility across religion, age, city, diet, languages, children, and relocation

### Matching Logic (Gender-Specific)
**For male customers:** Prioritizes women who are younger, earn less, are shorter, and share views on children.

**For female customers:** Considers age compatibility, income ratio, height difference, shared values, profession alignment, and relocation preferences.

Scoring dimensions (14 total):
- Age, Income, Height, Religion, Caste, Want Kids, Relocation, Diet, Education, Languages, Hobbies, Manglik, Pets

### Personalized Introductions
When sending a match, the confirmation modal shows an AI-generated personalized intro email tailored to the customer and match profile.

### Send Match
- "Send Match" button on each suggested match
- Confirmation modal with score, location, age, and profession
- Personalized intro email preview
- Match is logged to "Sent Matches History" on the dashboard

### Meeting & Call Notes
- Record quick notes from meetings or calls for each customer
- Notes are timestamped and persisted per customer
- Displayed in reverse chronological order

### Dummy Profiles
500 dummy profiles (male and female) loaded from `src/data/profiles.js`, generated with realistic Indian names, cities, professions, and preferences.

## Tech Stack

- **React 19** — UI library
- **Vite 6** — Build tool
- **React Router DOM 7** — Client-side routing
- **Tailwind CSS 4** — Utility-first styling
- **PostCSS** with `@tailwindcss/postcss` plugin

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.jsx                  # Router config
├── main.jsx                 # React entry point
├── globals.css              # Tailwind import + base styles
├── pages/
│   ├── LoginPage.jsx        # Sign in
│   ├── SignupPage.jsx       # Register
│   ├── DashboardLayout.jsx  # Dashboard shell with header
│   ├── DashboardPage.jsx    # Customer list + analytics
│   └── CustomerDetailPage.jsx # Full biodata + matches + notes
├── components/              # Reusable UI components
│   ├── Avatar.jsx
│   ├── BiodataField.jsx
│   ├── BiodataGrid.jsx
│   ├── ConfirmModal.jsx
│   ├── MatchCard.jsx
│   ├── ProfileDetailModal.jsx
│   ├── StatusBadge.jsx
│   └── Toast.jsx
├── data/
│   ├── matchmakers.js       # Built-in demo credentials
│   └── profiles.js          # 500 dummy profiles
└── lib/
    ├── ai.js                # Score labels, insights, personalized intros
    └── matching.js          # Compatibility scoring engine
```
