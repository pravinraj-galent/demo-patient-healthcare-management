# Healthcare Management System

A demo application for managing patient's healthcare with a modern full-stack architecture.

## Project Structure

```
demo-patient-healthcare-management/
├── backend/          # Node.js backend with Express
│   ├── package.json  # Backend dependencies
│   └── server.js     # Main server file
├── frontend/         # Next.js frontend application
│   ├── app/          # Next.js 13+ app directory
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── package.json  # Frontend dependencies
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── tsconfig.json
└── README.md         # This file
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:3000`

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **Next.js 14** - React framework with app directory
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

## Features

This is a basic setup with:
- ✅ Backend API server with health check endpoints
- ✅ Frontend with modern Next.js 13+ app directory structure
- ✅ TypeScript configuration
- ✅ Tailwind CSS for styling
- ✅ Development scripts for both frontend and backend

## Development

- Backend runs on port 5000
- Frontend runs on port 3000
- Both include hot reload for development
