# 🌊 OceanGuard: Integrated Platform for Crowdsourced Ocean Hazard Reporting & Social Media Analytics

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://sih.gov.in)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/ORM-Sequelize-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

> **Smart India Hackathon (SIH) Prototype**  
> An end-to-end web application empowering citizens and coastal authorities to report, track, verify, and monitor marine hazards in real-time through interactive maps, analytical dashboards, and social media sentiment monitoring.

---

## 📌 Problem Statement & Overview

Ocean hazards such as **oil spills, plastic pollution, cyclones, high waves, and marine animal deaths** pose severe threats to coastal ecosystems and maritime communities. Traditional disaster reporting often suffers from response delays and fragmented communication.

**OceanGuard** bridges this gap by combining:
1. **Crowdsourced Citizen Reporting**: Allowing people on coastal shores to upload geo-tagged photo reports.
2. **Authority Moderation**: Enabling disaster management officials to verify or reject reports in real-time.
3. **Interactive GIS Mapping**: Visualizing active incidents on live maps using Leaflet.
4. **Social Media Analytics**: Early warning detection via NLP sentiment tracking and trending hazard keywords.

---

## 🎨 UI & Features Showcase

### 1. 🌐 Landing Page & Public Hub
- System statistics (Total Reports, Verified Reports, Active Alerts, Registered Users).
- System overview cards explaining crowdsourced reporting and social media tracking.

### 2. 🔐 Authentication & Role-Based Access Control
- JWT-based authentication system supporting **Citizen**, **Authority**, and **Admin** roles.

### 3. 📝 Crowdsourced Hazard Reporting
- Citizen reporting form with hazard category dropdowns (`Oil Spill`, `Cyclone`, `High Waves`, `Plastic Pollution`, `Marine Animal Death`, `Other`).
- Image upload preview, severity level selection (`Low`, `Medium`, `High`), and browser geolocation integration (`Latitude` & `Longitude`).

### 4. 🗺️ Interactive Live Ocean Hazard Map
- Built with **Leaflet.js** for real-time visualization of reported and verified hazards across coastal coordinates.
- Interactive popups showing location, severity, status, and description.

### 5. 🚨 Emergency Public Alerts
- Real-time warning board for high-priority hazard announcements issued by coastal disaster management authorities.

### 6. 📊 Social Media Analytics Dashboard
- Interactive **Recharts** visualizations (Bar Charts & Sentiment Pie Charts).
- Tracks public sentiment (`Emergency`, `Concerned`, `Neutral`) and trending hazard hashtags (`#OilSpill`, `#MarineLife`, `#SaveOurOceans`).

### 7. 🛡️ Authority & Admin Control Panel
- Moderation queue for authorities to review crowdsourced submissions with one-click **Verify** or **Reject** actions.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | React.js (Vite) | Modern, fast UI rendering |
| **Routing** | React Router DOM v6 | Single-Page Application (SPA) navigation |
| **State & HTTP** | Axios | REST API integration with JWT interceptors |
| **Mapping** | Leaflet / React Leaflet | Interactive GIS map component |
| **Analytics** | Recharts | Responsive charts and data visualization |
| **Styling** | Custom Ocean Theme CSS | Clean government disaster management design system |
| **Icons** | Lucide React | Modern SVG icons |
| **Backend** | Node.js & Express.js | RESTful API server architecture |
| **Database** | MySQL | Relational database storage |
| **ORM** | Sequelize | Model definitions and SQL query abstraction |
| **Auth & Security**| JWT & bcrypt | Secure password hashing and token authentication |
| **File Storage** | Multer | Multipart photo upload handling |

---

## 📁 Repository Structure

```
SIH 2026/
├── backend/                  # Node.js & Express.js API Server
│   ├── database/             # Database SQL scripts
│   │   ├── schema.sql        # MySQL table definitions
│   │   └── seed.sql          # Sample data (Users, Reports, Analytics)
│   ├── src/
│   │   ├── config/           # Database configuration (Sequelize)
│   │   ├── controllers/      # Route controllers (Auth, Reports, Admin, Alerts, Analytics)
│   │   ├── middleware/       # JWT auth & error handling middleware
│   │   ├── models/           # Sequelize data models
│   │   ├── routes/           # API routes
│   │   └── server.js         # Express server entry point
│   └── .env.example          # Environment variable template
│
└── frontend/                 # React.js Frontend App (Vite)
    ├── src/
    │   ├── components/       # Reusable UI components (Navbar, Sidebar, Map, Cards, Charts)
    │   ├── pages/            # View pages (Home, Login, Register, Dashboard, Report, Map, Alerts, Analytics, Admin)
    │   ├── services/         # Axios API service configuration (`api.js`)
    │   ├── App.jsx           # App layout & protected routes
    │   ├── index.css         # Ocean theme design system
    │   └── main.jsx          # React DOM entry point
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL Server](https://www.mysql.com/) installed and running on port 3306

---

### Step 1: Database Setup

1. Open your terminal or MySQL command line and create the database tables:
   ```bash
   "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < backend/database/schema.sql
   ```

2. Seed initial test data (sample users, reports, and analytics):
   ```bash
   "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < backend/database/seed.sql
   ```

---

### Step 2: Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ocean_hazard_platform
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=sih2026_super_secret_jwt_key_ocean_hazard_platform
JWT_EXPIRES_IN=7d
```

---

### Step 3: Run the Project (VS Code / Terminal)

Open **two terminal windows**:

#### ⚙️ Terminal 1 — Backend API
```bash
cd backend
npm install
npm start
```
*API will run at `http://localhost:5000`*

#### 🎨 Terminal 2 — Frontend UI
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run at `http://localhost:5173`*

---

## 🔑 Pre-configured Seeded Accounts

For testing different user roles during demonstration:

| Role | Email | Password | Allowed Capabilities |
| --- | --- | --- | --- |
| **Citizen** | `citizen@example.com` | `password` | Submit hazard reports, view dashboard & maps |
| **Authority** | `authority@example.com` | `password` | Review & verify reports, publish emergency alerts |
| **Admin** | `admin@example.com` | `password` | Full system moderation & administrative dashboard |

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a new Citizen account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/reports` | Public | Fetch list of active hazard reports |
| `POST` | `/api/reports` | Bearer Token | Submit a new hazard report (with image upload) |
| `GET` | `/api/reports/map` | Public | Get geo-coordinates formatted for Leaflet Map |
| `GET` | `/api/admin/reports` | Admin/Authority | List all reports for moderation |
| `PUT` | `/api/admin/reports/:id/verify` | Admin/Authority | Mark a report as Verified |
| `PUT` | `/api/admin/reports/:id/reject` | Admin/Authority | Mark a report as Rejected |
| `GET` | `/api/alerts` | Public | Fetch emergency alerts |
| `POST` | `/api/alerts` | Admin/Authority | Create a new emergency alert broadcast |
| `GET` | `/api/analytics/social` | Public | Fetch social media sentiment & keyword data |

---

## 🔮 Future Enhancements (AI Integration Roadmap)

- 🤖 **Computer Vision Hazard Detection**: Automatic verification of uploaded photos using Google Gemini Vision API to detect oil slicks and marine debris.
- 🗣️ **Real-time Social Media Crawler**: Automated Twitter/X & news web scraper with LLM sentiment analysis.
- 📱 **Mobile Application**: Flutter/React Native mobile client with offline GPS caching for fishermen at sea.

---

## 📄 License

This project was developed as a prototype for **Smart India Hackathon (SIH) 2026**.
