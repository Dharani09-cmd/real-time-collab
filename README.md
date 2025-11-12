# Real-Time Collaboration Tool (Basic Starter)

This is a minimal starter project for a real-time collaborative text editor using:
- Frontend: React, Quill
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB (used to persist documents)

This package is intended for local development. Replace `MONGO_URI` in server/.env with your MongoDB connection string.

## Quick Start (local)

### 1. Backend
```
cd server
npm install
# create a .env file with MONGO_URI and PORT (optional)
# e.g. MONGO_URI="mongodb://localhost:27017/realtime-collab"
npm start
```

### 2. Frontend
```
cd client
npm install
npm start
```

The client expects the backend at http://localhost:5000 by default. Edit `client/src/socket.js` if your backend runs elsewhere.

## Deployment
- Backend can be deployed to Render, Railway, etc.
- Frontend can be built (`npm run build`) and deployed to Vercel/Netlify; update socket URL accordingly.

