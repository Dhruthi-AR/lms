import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import DashboardLayout from '../components/DashboardLayout';
import { ListChecks, Clock, CheckCircle2, PlayCircle, Trophy, Target, Award } from 'lucide-react';
import QuizModal from '../components/QuizModal';

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState('Available');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { user, token } = useAuthStore();

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
        
        const combined = [...backendCourses, ...localCourses];
        
        // Transform courses into Quiz objects
        const dynamicQuizzes = combined.map((course, idx) => ({
           id: course.id,
           title: `Final Knowledge Check: ${course.title}`,
           course: course.title,
           questions: 5,
           duration: '10 Min',
           status: course.progress === 100 ? 'completed' : 'available',
           score: course.progress === 100 ? 100 : null,
           notes: `Generate a quiz testing the primary concepts taught in this course titled: ${course.title}. Ensure it covers beginner to intermediate ${course.category || 'programming'} topics.`
        }));

        setEnrolledCourses(dynamicQuizzes);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchCourses();
  }, [user, token]);

  const filteredQuizzes = enrolledCourses.filter(q => 
    activeTab === 'Available' ? q.status === 'available' : q.status === 'completed'
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ListChecks className="text-primary-600" size={32} />
          Knowledge Checks & Quizzes
        </h1>
        <p className="text-gray-600 mt-2">Test your understanding and earn points to unlock certificates.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
            <Target size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Average Score</p>
            <h3 className="text-2xl font-bold text-gray-900">96%</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600 mr-4">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Quizzes Passed</p>
            <h3 className="text-2xl font-bold text-gray-900">2</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 mr-4">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Points</p>
            <h3 className="text-2xl font-bold text-gray-900">192</h3>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 mb-8 pb-px">
        {['Available', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab 
                ? 'text-primary-600 border-primary-600' 
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab} Quizzes
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md uppercase tracking-wide mb-2 inline-block">
                  {quiz.course}
                </span>
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{quiz.title}</h3>
              </div>
              {quiz.status === 'completed' && (
                <div className="flex items-center space-x-1 font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 size={16} />
                  <span>{quiz.score}%</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 font-medium">
              <span className="flex items-center gap-1.5"><ListChecks size={16} className="text-gray-400"/> {quiz.questions} Questions</span>
              <span className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400"/> {quiz.duration}</span>
            </div>
            
            <div className="mt-auto">
              {quiz.status === 'available' ? (
                <button 
                  onClick={() => setSelectedQuiz(quiz)}
                  className="w-full flex items-center justify-center font-medium py-2.5 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition"
                >
                  <PlayCircle size={18} className="mr-2" />
                  Take Quiz
                </button>
              ) : (
                <button className="w-full flex items-center justify-center font-medium py-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition">
                  <Award size={18} className="mr-2 text-gray-400" />
                  Review Results
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reusing existing QuizModal but passing dynamic data */}
      {selectedQuiz && (
        <QuizModal 
          isOpen={true}
          quizId={selectedQuiz.id}
          lessonNotes={selectedQuiz.notes}
          lessonId={null} 
          onClose={() => setSelectedQuiz(null)} 
        />
      )}
    </DashboardLayout>
  );
};

export default Quizzes;
