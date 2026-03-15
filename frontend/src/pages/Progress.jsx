import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import DashboardLayout from '../components/DashboardLayout';
import { TrendingUp, Clock, Flame, BookOpen, Target } from 'lucide-react';

const Progress = () => {
  const { user, token } = useAuthStore();
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let backendCourses = [];
        if (user?.role === 'STUDENT') {
          const res = await axios.get('https://lms-3xy9.onrender.com/api/my-courses', { headers: { Authorization: `Bearer ${token}` } });
          backendCourses = res.data;
        }

        let localCourses = [];
        if (user?.role === 'STUDENT') {
          localCourses = JSON.parse(localStorage.getItem(`savedCourses_${user.id}`)) || [];
        }
        
        setCourses([...backendCourses, ...localCourses]);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchCourses();
  }, [user, token]);

  const coursesDone = courses.filter(c => c.progress === 100).length;
  const hoursLearned = (courses.length * 4.5).toFixed(1); // estimating
  const avgProgress = courses.length > 0 ? (courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length).toFixed(0) : 0;
  // Calculate SVG stroke config
  const circleRadius = 88;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (avgProgress / 100) * circumference;

  const today = new Date();
  const totalDays = 42;
  const streakLength = 14;
  const streakStartIndex = totalDays - streakLength;

  const streakDays = Array.from({ length: totalDays }, (_, index) => {
    const date = new Date();
    date.setDate(today.getDate() - (totalDays - 1 - index));

    let intensity = 0;
    if (index >= streakStartIndex) {
      intensity = index > streakStartIndex + streakLength / 2 ? 3 : 2;
    } else if (index % 7 === 0) {
      intensity = 1;
    }

    return {
      date,
      intensity,
    };
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <TrendingUp className="text-primary-600" size={32} />
          Learning Analytics
        </h1>
        <p className="text-gray-600 mt-2">Track your learning journey and view your weekly momentum.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mr-4 shrink-0">
            <Flame size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Current Streak</p>
            <h3 className="text-2xl font-black text-gray-900">14 Days</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-4 shrink-0">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Hours Learned</p>
            <h3 className="text-2xl font-black text-gray-900">{hoursLearned}h</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mr-4 shrink-0">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Courses Done</p>
            <h3 className="text-2xl font-black text-gray-900">{coursesDone}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 mr-4 shrink-0">
            <Target size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Goal Reached</p>
            <h3 className="text-2xl font-black text-gray-900">{avgProgress}%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Learning Streak Calendar
            </h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 uppercase tracking-widest">
              Last 6 Weeks
            </span>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col text-xs text-gray-400 mr-1 mt-7 space-y-5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            <div className="grid grid-cols-6 gap-2 flex-1">
              {Array.from({ length: 6 }).map((_, col) => (
                <div key={col} className="flex flex-col gap-2">
                  {streakDays.slice(col * 7, col * 7 + 7).map((day, rowIndex) => {
                    const isToday =
                      day.date.toDateString() === today.toDateString();

                    const colorClass =
                      day.intensity === 0
                        ? 'bg-gray-100'
                        : day.intensity === 1
                        ? 'bg-emerald-100'
                        : day.intensity === 2
                        ? 'bg-emerald-300'
                        : 'bg-emerald-500';

                    return (
                      <div
                        key={day.date.toISOString()}
                        className={`w-4 h-4 rounded-sm ${colorClass} ${
                          isToday ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                        } transition-colors`}
                        title={day.date.toDateString()}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-sm bg-gray-100" />
                <span className="w-3 h-3 rounded-sm bg-emerald-100" />
                <span className="w-3 h-3 rounded-sm bg-emerald-300" />
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              </div>
              <span>More</span>
            </div>
            <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-medium">
              <Flame size={16} className="text-orange-500" />
              <span>{streakLength}-day learning streak</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center justify-between">
            Path Completion
            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 uppercase tracking-widest">Full Stack</span>
          </h3>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Fake SVG Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" strokeWidth="16" stroke="#f3f4f6" fill="transparent" />
                <circle cx="96" cy="96" r="88" strokeWidth="16" stroke="#4F46E5" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-8 shadow-inner border border-gray-50">
                <span className="text-4xl font-black text-gray-900 tracking-tighter">{avgProgress}%</span>
              </div>
            </div>
            
            <div className="w-full mt-10 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-600 flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-full"></div> Enrolled Items</span>
                <span className="text-gray-900">{courses.length} total</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-600 flex items-center gap-2"><div className="w-3 h-3 bg-gray-200 rounded-full"></div> Completed Items</span>
                <span className="text-gray-900">{coursesDone} courses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Progress;
