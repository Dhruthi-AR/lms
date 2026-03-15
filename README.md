# LMS - Learning Management System

A full-stack Learning Management System built with Node.js backend and React frontend.

## Features

- User authentication and authorization
- Course management
- Lesson and quiz functionality
- AI-powered tutoring
- Progress tracking
- Certificate generation

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your database URL, JWT secret, and AI API keys

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend

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

## Technologies Used

- Backend: Node.js, Express, Prisma, MySQL
- Frontend: React, Vite, Tailwind CSS
- AI: OpenAI/Hugging Face integration