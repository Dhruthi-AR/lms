import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { BookOpen, Sparkles, PlusCircle, Video } from 'lucide-react';

const Dashboard = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      if (user.role === 'STUDENT') {
        const [courseRes, recRes] = await Promise.all([
          axios.get('https://lms-3xy9.onrender.com/api/my-courses', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://lms-3xy9.onrender.com/api/ai/recommendations', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCourses(courseRes.data);
        setRecommendation(recRes.data.recommendation);
      } else if (user.role === 'INSTRUCTOR') {
        const res = await axios.get('https://lms-3xy9.onrender.com/api/courses', { headers: { Authorization: `Bearer ${token}` } });
        // Filter by instructor
        setCourses(res.data.filter(c => c.instructorId === user.id));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-600 mt-2">Ready to {user.role === 'STUDENT' ? 'continue learning' : 'manage your courses'} today?</p>
        </div>

        {user.role === 'STUDENT' && recommendation && (
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 text-white mb-8 shadow-lg flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shrink-0">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">AI Recommendation</h3>
              <p className="text-primary-50 leading-relaxed">{recommendation}</p>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <BookOpen className="mr-2 text-primary-600" size={24}/>
            {user.role === 'STUDENT' ? 'Enrolled Courses' : 'Your Courses'}
          </h2>
          {user.role === 'INSTRUCTOR' && (
            <button className="flex items-center text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition shadow-sm font-medium">
              <PlusCircle size={18} className="mr-2" />
              Create Course
            </button>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              {user.role === 'STUDENT' ? <BookOpen size={28} /> : <Video size={28} />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6">
              {user.role === 'STUDENT' 
                ? "You haven't enrolled in any courses yet." 
                : "You haven't created any courses yet."}
            </p>
            {user.role === 'STUDENT' && (
               <button onClick={() => navigate('/catalog')} className="bg-primary-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-primary-700 transition">
                 Browse Catalog
               </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  {/* Decorative placeholder image */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <BookOpen size={64} className="text-gray-800" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">{course.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                  
                  {user.role === 'STUDENT' && (
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-primary-600">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </DashboardLayout>
  );
};

export default Dashboard;
