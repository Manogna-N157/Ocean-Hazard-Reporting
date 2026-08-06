# Ocean Hazard Platform Backend

A simple MVC backend prototype for the SIH project **Integrated Platform for Crowdsourced Ocean Hazard Reporting and Social Media Analytics**.

## Tech stack

Node.js, Express.js, MySQL, Sequelize ORM, JWT, bcrypt, Multer, dotenv, and CORS.

## Setup

1. Create the database and tables with `mysql -u root -p < database/schema.sql`.
2. Add sample records with `mysql -u root -p < database/seed.sql`.
3. Copy `.env.example` to `.env` and enter your MySQL credentials and a secure JWT secret.
4. Run `npm install` and then `npm run dev`.

The API starts at `http://localhost:5000`. Uploaded images are served at `http://localhost:5000/uploads/<filename>`.

Seeded accounts use password `password`:

| Role | Email |
| --- | --- |
| Citizen | citizen@example.com |
| Authority | authority@example.com |
| Admin | admin@example.com |

## Authorization

Send `Authorization: Bearer <JWT_TOKEN>` for protected endpoints. Registration always creates a Citizen account. The seeded Authority/Admin accounts demonstrate role-based access.

## API reference

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a Citizen |
| POST | /api/auth/authority-application | Public | Submit a pending Authority application |
| POST | /api/auth/login | Public | Login and get JWT |
| POST | `/api/reports` | Logged in | Create report; use `multipart/form-data`, optional `image` file |
| GET | `/api/reports` | Public | List reports |
| GET | `/api/reports/map` | Public | Leaflet-friendly report coordinates |
| GET | `/api/reports/:id` | Public | Get one report |
| PUT | `/api/reports/:id` | Owner/Authority/Admin | Update report; optional `image` file |
| DELETE | `/api/reports/:id` | Owner/Authority/Admin | Delete report |
| GET | `/api/admin/reports` | Authority/Admin | List reports for moderation |
| PUT | `/api/admin/reports/:id/verify` | Authority/Admin | Mark Verified |
| PUT | /api/admin/reports/:id/reject | Authority/Admin | Mark Rejected |
| GET | /api/admin/pending-authorities | Admin | List pending Authority applications |
| PUT | /api/admin/approve-authority/:id | Admin | Approve a pending Authority application |
| PUT | /api/admin/reject-authority/:id | Admin | Reject a pending Authority application |
| POST | `/api/alerts` | Authority/Admin | Create alert |
| GET | `/api/alerts` | Public | List alerts |
| GET | `/api/dashboard/statistics` | Authority/Admin | Summary counts |
| GET | `/api/analytics/social` | Public | Dummy social media analytics |

Allowed hazard types: `Oil Spill`, `Cyclone`, `High Waves`, `Plastic Pollution`, `Marine Animal Death`, `Other`.

Allowed severity values: `Low`, `Medium`, `High`, `Critical`. Report statuses are `Pending`, `Verified`, and `Rejected`.

## Example requests and responses

Register:

```json
POST /api/auth/register
{ "name": "Asha Rao", "email": "asha@example.com", "password": "secret123" }
```

```json
{ "message": "User registered successfully.", "token": "eyJ...", "user": { "id": 4, "name": "Asha Rao", "email": "asha@example.com", "role": "Citizen" } }
```

Create a report (fields sent as `multipart/form-data` when including an image):

```json
POST /api/reports
{ "hazard_type": "Oil Spill", "description": "Oil visible near shore", "latitude": 18.938771, "longitude": 72.835335, "location": "Mumbai Harbour", "severity": "High" }
```

```json
{ "message": "Hazard report created.", "report": { "id": 4, "user_id": 4, "hazard_type": "Oil Spill", "status": "Pending", "image_url": "/uploads/1710000000-photo.jpg" } }
```

Map response:

```json
{ "reports": [{ "id": 1, "latitude": "18.9387710", "longitude": "72.8353350", "hazard_type": "Oil Spill", "severity": "High", "status": "Verified", "location": "Mumbai Harbour, Maharashtra" }] }
```

Dashboard response:

```json
{ "totalReports": 3, "verifiedReports": 1, "pendingReports": 2, "rejectedReports": 0, "activeAlerts": 1 }
```

## Notes

- Images are limited to image MIME types and 5 MB.
- Sequelize model relationships mirror the foreign keys in `database/schema.sql`.
- The analytics endpoint reads seeded dummy data, ready to be replaced by a social media collection service later.
