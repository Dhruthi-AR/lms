import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useAuthStore from '../store/useAuthStore';
import { BookOpen, PlayCircle, Clock, Calendar, CheckCircle, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('In Progress');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      let backendCourses = [];
      if (user.role === 'STUDENT') {
        const res = await axios.get('https://lms-3xy9.onrender.com/api/my-courses', { headers: { Authorization: `Bearer ${token}` } });
        backendCourses = res.data;
      } else {
        const res = await axios.get('https://lms-3xy9.onrender.com/api/courses', { headers: { Authorization: `Bearer ${token}` } });
        backendCourses = res.data.filter(c => c.instructorId === user.id);
      }

      let localCourses = [];
      if (user.role === 'STUDENT') {
        localCourses = JSON.parse(localStorage.getItem(`savedCourses_${user.id}`)) || [];
      }

      setCourses([...backendCourses, ...localCourses]);
    } catch (error) {
      console.error('Failed to fetch courses', error);
    } finally {
      setLoading(false);
    }
  };

  const markCourseCompleted = async (e, course) => {
    e.stopPropagation();
    try {
      if (course.isYoutube) {
        let saved = JSON.parse(localStorage.getItem(`savedCourses_${user.id}`)) || [];
        saved = saved.map(c => c.id === course.id ? { ...c, progress: 100 } : c);
        localStorage.setItem(`savedCourses_${user.id}`, JSON.stringify(saved));
        setCourses(courses.map(c => c.id === course.id ? { ...c, progress: 100 } : c));
      } else {
        await axios.put('https://lms-3xy9.onrender.com/api/enroll/progress', { courseId: course.id, progress: 100 }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(courses.map(c => c.id === course.id ? { ...c, progress: 100 } : c));
      }
    } catch (err) {
      console.error("Failed to mark completed", err);
    }
  };

  const filteredCourses = courses.filter(course => {
    const isCompleted = course.progress === 100;
    if (activeTab === 'Completed') return isCompleted;
    if (activeTab === 'In Progress') return !isCompleted;
    return true; // "All"
  });

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="text-primary-600" size={32} />
            {user.role === 'STUDENT' ? 'My Learning' : 'My Teached Courses'}
          </h1>
          <p className="text-gray-600 mt-2">Pick up exactly where you left off and track your progress.</p>
        </div>
      </div>

      {user.role === 'STUDENT' && (
        <div className="flex space-x-2 border-b border-gray-200 mb-8 pb-px overflow-x-auto hide-scrollbar">
          {['In Progress', 'Completed', 'All'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative border-b-2 ${
                activeTab === tab 
                  ? 'text-primary-600 border-primary-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <BookOpen size={36} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-8 max-w-sm">
            {activeTab === 'Completed' ? "You haven't completed any courses yet. Keep learning!" : "It looks like you haven't started any courses yet."}
          </p>
          {user.role === 'STUDENT' && activeTab !== 'Completed' && (
            <button onClick={() => navigate('/catalog')} className="bg-primary-600 text-white font-medium px-8 py-3 rounded-xl hover:bg-primary-700 transition shadow-sm">
              Explore Catalog
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
              {/* Card Header Placeholder Image */}
              <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
                {course.isYoutube ? (
                   <img 
                     src={`https://img.youtube.com/vi/${course.youtubeId}/maxresdefault.jpg`} 
                     alt={course.title}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     onError={(e) => {
                       e.target.src = `https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg`;
                     }}
                   />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen size={72} strokeWidth={1} className="text-primary-200 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
                {course.progress === 100 && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg">
                    <CheckCircle size={14} className="mr-1" />
                    Completed
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                   <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wide">{course.category || 'Course'}</span>
                   {course.isYoutube && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md uppercase tracking-wide">YouTube</span>}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
                  {course.description || course.channel || "Learn the fundamentals and advanced concepts in this comprehensive course."}
                </p>
                
                {user.role === 'STUDENT' && (
                  <div className="mt-auto">
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span className="text-gray-700">Overall Progress</span>
                      <span className={course.progress === 100 ? 'text-green-600' : 'text-primary-600'}>{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
                      <div className={`h-2.5 rounded-full transition-all duration-1000 ${course.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-indigo-500'}`} style={{ width: `${course.progress || 0}%` }}></div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        className={`flex-1 flex items-center justify-center font-medium py-3 rounded-xl transition ${course.progress === 100 ? 'bg-gray-50 text-gray-700 hover:bg-gray-100' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}
                      >
                        {course.progress > 0 && course.progress < 100 ? (
                          <>
                            <PlayCircle size={20} className="mr-2" />
                            Resume Learning
                          </>
                        ) : course.progress === 100 ? (
                           <>
                            <Calendar size={20} className="mr-2 text-gray-400" />
                            Review
                          </>
                        ) : (
                          <>
                            <PlayCircle size={20} className="mr-2" />
                            Start Course
                          </>
                        )}
                      </button>
                      
                      {course.progress !== 100 && (
                        <button 
                          onClick={(e) => markCourseCompleted(e, course)}
                          className="bg-green-50 text-green-700 hover:bg-green-100 px-4 py-3 rounded-xl transition flex items-center justify-center font-medium shadow-sm hover:shadow"
                          title="Mark as Completed"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
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

export default MyCourses;
