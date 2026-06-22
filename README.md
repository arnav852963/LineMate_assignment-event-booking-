# LineMate Event Booking System

A full-stack, real-time event booking platform built with React, Node.js, MongoDB, and Socket.io. This system handles high-concurrency seat booking, ensuring users can view live seat availability, temporarily lock seats, and purchase them without overlapping conflicts.

## 🚀 Live Links
* **Live Website:** [click here to view live website](https://line-mate-assignment-event-booking.vercel.app/)
* **Walkthrough Video:** [click here to view vido](https://drive.google.com/file/d/1sDabBF3btCA_0IAf34R5iW074fO7y01k/view?usp=sharing)

---

## ✅ Assignment Requirements Fulfilled
This project strictly adheres to all core requirements of the assignment:
1. **Real-Time Seat Locking:** When a user clicks an available seat, it is instantly locked and turns red for all other users viewing the same event via Socket.io broadcasts.
2. **2-Minute Lock Expiry:** A resilient backend cron job runs every second, checking for seats that have been locked for more than 2 minutes. Expired seats are automatically unlocked and broadcasted as available to all connected clients.
3. **Concurrency Control:** Utilizes MongoDB atomic updates (`findOneAndUpdate`) and Socket.io rooms to guarantee that two users can never lock or book the exact same seat simultaneously.
4. **Authentication:** Secure Google OAuth integration for user login.
5. **Production Deployment:** Backend deployed robustly to AWS Elastic Beanstalk (Single Instance with custom Nginx WebSocket proxying and Let's Encrypt SSL). Frontend deployed on Vercel.

---

## 🛠️ Project Setup & Walkthrough

### Prerequisites
* Node.js (v18+)
* Docker & Docker Compose (for local database)

### 1. Database Setup (Optional Docker vs Atlas)

**Note to Reviewers:** You can skip Docker entirely! The `.env` configurations provided at the bottom of this README already contain a live MongoDB Atlas URL. You can simply copy-paste those variables and jump straight to Step 2.

*If you prefer to run a clean local database instead, you can use Docker:*
You can instantly spin up a local MongoDB database and a visual UI (Mongo Express) using the provided Docker configuration.
```bash
cd backend
docker compose up -d
```
* **Database URL:** `mongodb://localhost:27017/linemate`
* **Visual UI:** Open `http://localhost:8081` in your browser.

### 2. Backend Setup
```bash
cd backend
npm install
```

*Note: Before starting the server, ensure you run the seed script to populate the database with initial events:*
```bash
node src/utilities/seedEvents.js 
```

Now, start the backend server:
```bash
npm run dev
```
The backend will start on `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

---

## 🔐 Environment Variables

For reviewers to quickly test the application, copy and paste these exact configurations into your `.env` files.

### Backend (`backend/.env`)
Create a `.env` file inside the `backend` folder:
```env
PORT=8000
MONGO_URL=mongodb+srv://linemate:arnav23100@linemate.gxjwczu.mongodb.net/
ACCESS_TOKEN_SECRET=linemate-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=linemate-refresh-secret
REFRESH_TOKEN_EXPIRY=7d
CLOUD_NAME=dyld0tdro
CLOUDINARY_API_KEY=877244288559417
CLOUDINARY_API_SECRET=qqvMPZo466eDBUHd164bMPqrmC4
CORS_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=179235111523-fo2rojt2jtqjd6ihgjnecbjmvlh9dju0.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### Frontend (`frontend/.env`)
Create a `.env` file inside the `frontend` folder:
```env
VITE_BACKEND_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=179235111523-fo2rojt2jtqjd6ihgjnecbjmvlh9dju0.apps.googleusercontent.com
```

---

## 🏛️ System Architecture Highlights
* **Socket.io Transports:** Forced WebSocket transports are used to bypass sticky-session requirements and prevent "Session ID unknown" polling errors on AWS.
* **Smart Reconnections:** The React frontend explicitly listens for hidden Socket.io reconnections to automatically re-join Event Rooms, preventing "ghost bugs" where users miss live updates after a network hiccup.
* **AWS Nginx Hardening:** Custom `.ebextensions` and `postdeploy` hooks completely configure Nginx with 24-hour proxy timeouts to sustain long-lived WebSocket connections through AWS Elastic Beanstalk.

### Backend Folder Structure
The `backend` directory follows a clean, modular MVC-like architecture:
* **`src/controllers/`**: Contains the core business logic and request handling for each route.
* **`src/models/`**: Defines the MongoDB schemas (Events, Users, Bookings) using Mongoose.
* **`src/routes/`**: Defines the Express API endpoints and maps them to controllers.
* **`src/middlewares/`**: Contains reusable logic like JWT authentication verification and Multer file uploads.
* **`src/socket/`**: Houses all real-time Socket.io event listeners and the background cron job for seat expiration.
* **`src/db/`**: Handles the connection initialization to MongoDB.
* **`src/utilities/`**: Contains helper classes (ApiError, ApiResponse) and the database seeding scripts.
* **`.platform/`**: Contains AWS Elastic Beanstalk configuration scripts (Nginx overrides and Let's Encrypt SSL certificates).

### REST API Endpoints
**Auth (`/api/v1/auth`)**
* `POST /register`: 🌍 **[Public]** Registers a new user.
* `POST /login`: 🌍 **[Public]** Authenticates a user and returns JWT tokens.
* `POST /googleAuth`: 🌍 **[Public]** Handles Google OAuth login/registration.
* `POST /logout`: 🔒 **[Protected]** Clears user cookies and invalidates session.

**User (`/api/v1/user`)**
* `GET /getUser`: 🔒 **[Protected]** Fetches the currently authenticated user's profile.
* `POST /addProfilePhoto`: 🔒 **[Protected]** Uploads and updates a user's avatar via Cloudinary.
* `POST /refreshToken`: 🌍 **[Public]** Generates a new access token using a valid refresh token.

**Event (`/api/v1/event`)**
* `GET /getAllEvents`: 🌍 **[Public]** Retrieves a list of all available events.
* `GET /getEventById/:eventId`: 🔒 **[Protected]** Retrieves detailed information and the full seat layout for a specific event.

**Booking (`/api/v1/booking`)**
* `POST /createBooking`: 🔒 **[Protected]** Finalizes the purchase of locked seats and marks them as `BOOKED`.
* `GET /getMyBookings`: 🔒 **[Protected]** Fetches all historical bookings for the logged-in user.
* `POST /cancelBooking`: 🔒 **[Protected]** Cancels an existing booking and frees up the seats.

### Socket.io Events & Architecture
**Events Used:**
* `joinEventRoom`: Client requests to join a specific event's isolated broadcast room.
* `leaveEventRoom`: Client leaves the room when navigating away from the seat map.
* `lockSeat`: Client attempts to temporarily lock a seat.
* `unlockSeat`: Client manually unlocks a seat they previously locked.
* `seatLocked`: Server broadcasts to the room that a seat is now red/locked.
* `seatUnlocked`: Server broadcasts to the room that a seat is now green/available.

**Why WebSockets? Solving Real-Time Conflicts:**
Traditional HTTP polling falls short for high-demand ticket sales, leading to double-bookings and massive server strain. By leveraging persistent WebSocket connections, this system guarantees that the exact millisecond a user clicks an available seat, it is visually locked for hundreds of competing users simultaneously, effectively eliminating checkout race conditions.

**Pub/Sub Pattern for Efficiency:**
Instead of broadcasting seat updates globally to every connected user, the socket architecture implements a strict Publish/Subscribe (Pub/Sub) model. When a user views an event, they "subscribe" to a specific isolated "Room" (using the Event ID). Seat updates are only published to that specific room, ensuring the network isn't flooded with irrelevant data from other events.

**Architectural Socket Improvements:**
* **`io.to()` Broadcast Fix:** Initially, the system used `socket.to()`, which broadcasts events to everyone *except* the sender, causing the sender's UI to appear frozen. This was upgraded to `io.to()` so the sender receives immediate visual feedback alongside everyone else.
* **Concurrency Locking:** The background cron job was upgraded with an `isRunning` lock to prevent overlapping MongoDB queries if network latency spikes, ensuring the Node.js event loop never crashes under heavy load.

### Security & Middleware Architecture
* **Two-Token Authentication System:** For heightened security, the application uses a dual JWT (JSON Web Token) strategy. Short-lived **Access Tokens** (1 day) are used for API authorization, while long-lived **Refresh Tokens** (7 days) are securely stored in HTTP-only cookies to seamlessly issue new access tokens without forcing the user to log in repeatedly.
* **Audit Logging Middleware:** Every critical API request passes through a custom `auditLogMiddleware` which tracks and logs user activity, IP addresses, and request endpoints, creating an immutable trail for security monitoring and debugging.

---

## 💻 Frontend Architecture & Folder Structure

The frontend is built using **React** and **Vite**, utilizing a highly modular component structure with **Tailwind CSS** for styling and **Zustand** for global state management.

### Frontend Folder Structure
* **`src/pages/`**: Contains the top-level route components (Home, Login, Register, Profile, EventDetails).
* **`src/components/`**: Houses all reusable UI components, logically grouped into subfolders:
  * `events/`: Contains the core complex components like `SeatMap`, `CheckoutBar`, and `EventCard`.
  * `auth/`: Login and registration forms.
  * `profile/`: User profile and booking history displays.
  * `layout/`: Global layout wrappers like `Navbar`.
* **`src/store/`**: Contains Zustand stores (`authStore`, `bookingStore`) for managing global user state and currently selected seats across components.
* **`src/socket/`**: Initializes the global Socket.io client instance and configures the WebSocket transports.
* **`src/api/`**: Configures Axios instances with interceptors to automatically handle token attaching and silent refresh-token rotation on 401 errors.

### Core Pages
* **Home (`/`)**: 🌍 **[Public]** Displays a searchable, filterable list of all upcoming events.
* **Event Details (`/event/:id`)**: 🔒 **[Protected]** The core booking page containing the interactive seat map and checkout bar. (Requires login).
* **Profile (`/profile`)**: 🔒 **[Protected]** Displays the user's details, profile photo, and a history of their active and past bookings.
* **Login/Register (`/login`, `/register`)**: 🌍 **[Public]** Standard email/password authentication pages with Google OAuth integration.

### The "BookMyShow" Style Seat Map & Real-Time Tracking
The crown jewel of the frontend is the `SeatMap` component, designed to mimic modern ticket booking platforms like BookMyShow.
* **Visual Grid Layout:** Seats are dynamically rendered in a tiered grid (Premium, Gold, Silver).
* **Color-Coded Status:** Seats visually update instantly based on their status:
  * 🟨 **Beige:** Available
  * 🟧 **Orange:** Selected by the current user
  * 🟫 **Tan / Light Brown:** Locked (currently being purchased by someone else)
  * ⬛ **Dark Gray:** Sold Out / Booked
* **Real-Time Tracking:** Because the frontend listens to the `seatLocked` and `seatUnlocked` Socket.io events, the React state array updates instantly. If another user clicks a seat, you see it turn tan/locked on your screen within milliseconds—no page refresh required.

### Frontend Socket.io Usage
The frontend uses a singleton socket instance to interact with the backend in real-time.
* **`joinEventRoom`**: Emitted when the `EventDetails` page mounts so the user only receives data for that specific event.
* **`lockSeat` / `unlockSeat`**: Emitted the moment a user clicks on an available seat (or unclicks a selected seat).
* **`seatLocked` / `seatUnlocked` (Listeners)**: The frontend passively listens for these broadcasts. When received, the `SeatMap` component instantly updates the specific seat's status in the UI, enforcing real-time visual conflict prevention.

---

## 📌 Project Assumptions & Constraints
To keep the scope of the project focused on the core real-time booking engine, the following assumptions were made in the UI layout:
1. **Grid Layout:** We assume a strict seating grid of exactly **10 seats per row** for every event, dynamically calculating the total number of rows based on the event's total seat capacity.
2. **Tiered Pricing:** We assume a strict 3-tier pricing model (Premium, Gold, Silver). The pricing tiers are visually and logically split exactly **every 5 rows** (e.g., Rows 1-5 are Premium, Rows 6-10 are Gold, and Row 11+ is Silver).
