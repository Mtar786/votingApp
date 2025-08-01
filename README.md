Voting App (MERN Stack)
This project is a simple voting application built with the MERN stack (MongoDB, Express.js, React.js, and Node.js). It allows users to register, log in, create polls, view existing polls, vote on poll options, and see voting results in real time.

Features
User Authentication: Users can register and log in via JWT-based authentication.

Poll Management:

Create new polls with a question and multiple options.

View a list of all available polls.

Open a poll to see details, including options and current vote counts.

Vote on a poll (one vote per user per poll).

Real-time Results: After voting, users can immediately see updated vote counts and percentages for each option.

Project Structure
bash
Copy
Edit
voting-app/
├── backend/
│   ├── models/        # Mongoose models (User and Poll)
│   ├── routes/        # API route definitions for auth and polls
│   ├── package.json   # Backend dependencies and scripts
│   └── server.js      # Express server setup
└── frontend/
    ├── src/
    │   ├── components/ # React components (Login, Register, PollsList, etc.)
    │   ├── App.js       # Main React app with routing
    │   ├── api.js       # Axios instance with JWT handling
    │   └── index.js     # React entry point
    └── package.json     # Frontend dependencies and scripts
Prerequisites
Node.js (v16 or later recommended)

npm or yarn

MongoDB running locally or accessible via connection string

Getting Started
Clone the repository (or extract the provided archive) and navigate to the project root:

bash
Copy
Edit
cd voting-app
Backend Setup

Go into the backend directory and install dependencies:

bash
Copy
Edit
cd backend
npm install
(Optional) Configure environment variables by creating a .env file in the backend folder. You can override the defaults for MONGODB_URI, JWT_SECRET, and PORT.

Example .env:

env
Copy
Edit
MONGODB_URI=mongodb://localhost:27017/votingApp
JWT_SECRET=your_custom_jwt_secret
PORT=5000
Start the backend server:

bash
Copy
Edit
npm start
The API will run on http://localhost:5000 by default.

Frontend Setup

Open a new terminal, go into the frontend directory, and install dependencies:

bash
Copy
Edit
cd ../frontend
npm install
Start the React development server:

bash
Copy
Edit
npm start
The frontend will run on http://localhost:3000 and proxy API requests to the backend (configured via the proxy field in frontend/package.json).

Using the Application

Open http://localhost:3000 in your browser.

Register a new user account or log in if you already have one.

Create polls, vote on them, and view results!

API Endpoints Overview
Authentication
POST /api/auth/register – Register a new user. Body parameters: { "username": string, "password": string }.

POST /api/auth/login – Log in a user. Body parameters: { "username": string, "password": string }. Returns a JWT token.

Polls
GET /api/polls – Retrieve all polls (excludes voters list for privacy).

GET /api/polls/:id – Get details for a specific poll, including vote counts.

POST /api/polls – Create a new poll. Requires authentication. Body parameters: { "question": string, "options": string[] } (at least two options).

POST /api/polls/:id/vote – Vote on a poll. Requires authentication. Body parameter: { "choice": number } (index of the selected option).

Customization & Deployment
Database: You can point MONGODB_URI to any MongoDB instance (local or cloud like MongoDB Atlas).

Authentication: The JWT secret and token expiration can be adjusted in backend/routes/auth.js or via environment variables.

Deployment: For production, build the React app (npm run build inside frontend) and serve the static files using a Node/Express static server or another web server.

Feel free to modify and extend this project to suit your needs. Contributions and feedback are welcome!
