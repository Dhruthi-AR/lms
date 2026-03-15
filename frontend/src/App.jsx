import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CourseView from './pages/CourseView';
import Catalog from './pages/Catalog';
import MyCourses from './pages/MyCourses';
import AITutor from './pages/AITutor';
import Quizzes from './pages/Quizzes';
import Progress from './pages/Progress';
import Certificates from './pages/Certificates';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses/:id" element={<CourseView />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/ai-tutor" element={<AITutor />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
