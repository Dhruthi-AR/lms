import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Sparkles, ArrowRight, PlayCircle, Star, Users } from 'lucide-react';
import axios from 'axios';

const LandingPage = () => {
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('https://lms-3xy9.onrender.com/api/courses');
        setPopularCourses(res.data.slice(0, 3)); // Display top 3 courses
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="relative min-h-screen font-sans bg-[#F8FAFC] overflow-hidden">
      {/* Professional LMS Background Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <div className="absolute left-0 right-0 top-[-10%] m-auto h-[400px] w-[600px] rounded-full bg-primary-400 opacity-20 blur-[120px]"></div>
        <div className="absolute right-[-5%] top-[20%] h-[300px] w-[300px] rounded-full bg-purple-400 opacity-20 blur-[100px]"></div>
        <div className="absolute left-[-5%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-blue-400 opacity-20 blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/50">
          <div className="flex items-center space-x-2 text-primary-600">
            <Brain size={32} className="text-primary-600" />
            <span className="text-2xl font-bold tracking-tight">SmartLearn AI</span>
          </div>
        <div className="flex space-x-6">
          <Link to="/login" className="px-5 py-2.5 text-gray-700 hover:text-primary-600 font-medium transition">Login</Link>
          <Link to="/register" className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition shadow-md hover:shadow-lg">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-blue-100">
            <Sparkles size={16} />
            <span>AI-Powered Learning Management System</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Master Any Subject with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">SmartLearn AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the future of education. Interactive lessons, AI-generated quizzes, personalized study recommendations, and a 24/7 AI tutor chatbot to guide you.
          </p>
          <div className="flex justify-center flex-wrap gap-4 pt-4">
            <Link to="/register" className="flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold text-lg transition transform hover:-translate-y-1 shadow-xl hover:shadow-2xl">
              Start Learning for Free
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link to="#features" className="flex items-center px-8 py-4 bg-white text-gray-800 rounded-xl hover:bg-gray-50 font-bold text-lg transition border border-gray-200 shadow-sm hover:shadow-md">
              <PlayCircle className="mr-2 text-gray-500" size={20} />
              See How It Works
            </Link>
          </div>
        </div>

        <div id="courses" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Start learning today from our top-rated instructors.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
            {popularCourses.length > 0 ? popularCourses.map(course => (
              <div key={course.id} className="bg-card rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <BookOpen size={64} className="text-gray-800" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-textMain mb-2 group-hover:text-primary-600 transition">{course.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <div className="flex items-center"><Users size={16} className="mr-1"/> {course.instructor?.name || 'Instructor'}</div>
                    <div className="flex items-center text-yellow-500"><Star size={16} className="mr-1 fill-current"/> 4.9</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-1 md:col-span-3 text-center text-gray-400 py-12">No courses available right now.</div>
            )}
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          {[
            { title: "24/7 AI Tutor", desc: "Stuck on a concept? Ask the built-in AI tutor for clear, instant explanations anytime.", icon: <Brain size={28} /> },
            { title: "Smart Quizzes", desc: "Test your knowledge with auto-generated quizzes based entirely on the lesson notes.", icon: <BookOpen size={28} /> },
            { title: "Personalized Path", desc: "Get dynamic study recommendations based on your performance and goals.", icon: <Sparkles size={28} /> }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white hover:shadow-xl transition duration-300 transform hover:-translate-y-2 group cursor-pointer z-10 relative">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition shrink-0 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
      </div>
    </div>
  );
};

export default LandingPage;
