
# Calendly Clone - Full Stack Scheduling Platform

A clean, modern scheduling platform inspired by Calendly. Built with a React & Tailwind CSS frontend, Node.js & Express backend, and a pure MySQL database layer (No ORMs, optimized using raw SQL queries for simplicity and interview preparation).

---

## 🌟 Key Features

1. **Event Types Management**: Full CRUD operations to create, edit, delete, and list event links with custom durations.
2. **Weekly Availability Management**: Clean weekly day-by-day scheduler supporting deactivation toggles, start/end working hours, and timezone mapping.
3. **Dynamic Slot Generation**: Core algorithm generating booking slots on-the-fly based on event durations, weekly availability, existing bookings (double-booking protection), and past time exclusions for the current day.
4. **Interactive Public Booking**: Responsive two-column booking screen `/book/:slug` with calendar date picker, time slot select, and invitee form.
5. **Scheduled Meetings Portal**: Detailed list of upcoming and past/cancelled meetings with cancellation functionality.

---

## 🗄️ Database Schema Overview

### 1. `event_types`
Stores all scheduling event configurations created by the user.

| Column Name | Type | Description |
|---|---|---|
| id | INT (PK) | Unique event identifier |
| title | VARCHAR | Event title |
| slug | VARCHAR | Public booking URL slug |
| duration | INT | Meeting duration in minutes |
| description | TEXT | Optional event description |
| created_at | TIMESTAMP | Record creation timestamp |

---

### 2. `availability`
Stores weekly working availability settings.

| Column Name | Type | Description |
|---|---|---|
| id | INT (PK) | Availability record identifier |
| day_of_week | VARCHAR | Day name (Monday-Sunday) |
| is_active | BOOLEAN | Whether bookings are enabled for the day |
| start_time | TIME | Daily working start time |
| end_time | TIME | Daily working end time |
| timezone | VARCHAR | User timezone configuration |

---

### 3. `meetings`
Stores all booked meetings and scheduling metadata.

| Column Name | Type | Description |
|---|---|---|
| id | INT (PK) | Meeting identifier |
| event_type_id | INT (FK) | Linked event type |
| invitee_name | VARCHAR | Invitee full name |
| invitee_email | VARCHAR | Invitee email |
| meeting_date | DATE | Scheduled meeting date |
| start_time | TIME | Meeting start time |
| end_time | TIME | Meeting end time |
| status | VARCHAR | scheduled / cancelled |
| created_at | TIMESTAMP | Booking creation timestamp |

---

### 🔗 Entity Relationships

- One `event_type` can have many `meetings`
- `availability` controls valid slot generation
- `meetings` are validated against:
   - active availability
   - existing bookings
   - past time restrictions

## 📁 Project Directory Structure

```
calendly-clone/
├── backend/
│   ├── src/
│   │   ├── config/        # DB Pool connection setup
│   │   ├── controllers/   # Express route controllers
│   │   ├── models/        # MySQL raw queries (Event, Availability, Meeting)
│   │   ├── routes/        # Express REST route endpoints
│   │   └── services/      # Slot generation business logic
│   ├── .env               # Server environment configurations
│   ├── package.json       # Node package manager configurations
│   └── server.js          # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios REST API services config
│   │   ├── components/    # Reusable Layout & Navigation components
│   │   ├── pages/         # Dashboard, EventTypes, Availability, Meetings, Booking
│   │   ├── App.jsx        # Routing system definitions
│   │   ├── index.css      # Core Tailwind CSS directives
│   │   └── main.jsx       # Root mount entrypoint
│   ├── package.json       # React dependencies setup
│   ├── vite.config.js     # Vite configuration
│   └── index.html         # Main template loading Inter font
├── database/
│   ├── schema.sql         # SQL schema definitions
│   └── seed.sql           # Pre-loaded mock dataset
└── README.md              # Setup & deployment manual
```

---

## ⚙️ Development Setup Instructions

### 1. Database Setup
Make sure you have **MySQL** running locally.
1. Open your MySQL client (Command Line, Workbench, or phpMyAdmin).
2. Create the database and tables using the `database/schema.sql` file:
   ```sql
   SOURCE calendly-clone/database/schema.sql;
   ```
3. Load the sample mock data using the `database/seed.sql` file:
   ```sql
   SOURCE calendly-clone/database/seed.sql;
   ```

---

### 2. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the Node.js packages:
   ```bash
   npm install
   ```
3. Verify or edit database parameters in `.env`:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=calendly_db
   DB_PORT=3306
   ```
4. Start the Node.js server in development watch mode:
   ```bash
   npm run dev
   ```
   *The server should print:* `Server is running on port 5000` & `Connected to MySQL Database successfully!`

---

### 3. Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install the React packages:
   ```bash
   npm install
   ```
3. Start the React/Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open automatically in your browser at:* `http://localhost:3000`

---



