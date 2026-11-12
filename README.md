# 🌱 EcoTrack – AI-Powered Carbon Footprint Tracker
🌍 Live Demo: https://eco-track-carbon-footprint-tracker-five.vercel.app

EcoTrack is a MERN stack web application designed to help users monitor, analyze, and reduce their carbon footprint through activity tracking, data visualization, and AI-powered recommendations.

## 🚀 Features

- **User Authentication:** Secure registration and login using JWT.
- **Carbon Footprint Tracking:** Record daily activities related to transport, electricity, food, and shopping.
- **Dashboard:** View total carbon emissions and activity statistics.
- **Analytics:** Visualize carbon emissions using interactive charts.
- **AI Assistant:** Get AI-powered suggestions and answers about sustainable living.
- **Personalized Recommendations:** Receive recommendations to reduce your environmental impact.
- **AI Eco Challenges:** Generate sustainability challenges.
- **Admin Dashboard:** Monitor registered users, activities, and total emissions.
- **User Profile:** View account information and manage your session.

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Gemini AI API

## 📁 Project Structure

```text
EcoTrack/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd EcoTrack
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the client folder if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## 🌍 Project Objective

The main objective of EcoTrack is to encourage environmentally responsible behavior by helping individuals understand their carbon emissions and make sustainable lifestyle choices.

## 🔐 Security

- Environment variables are excluded from Git.
- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Protected routes restrict access to authorized users.

## 👨‍💻 Project

**Project Name:** EcoTrack – AI-Powered Carbon Footprint Tracker  
**Project Type:** MERN Stack Web Application  
**Category:** Environmental Sustainability / Artificial Intelligence

---

*Building a greener future, one activity at a time. 🌱*
