import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import Navbar from '../components/Navbar';
import ChatbotWidget from '../components/ChatbotWidget';
import { PlayCircle, CheckCircle, FileText, Sparkles } from 'lucide-react';
import QuizModal from '../components/QuizModal';

const CourseView = () => {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Try backend first
        let courseData = null;
        try {
          const res = await axios.get(`https://lms-3xy9.onrender.com/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          courseData = res.data;
        } catch (backendErr) {
          // If not found in backend, fall back to localStorage saved YouTube courses
          const savedLocal = JSON.parse(localStorage.getItem(`savedCourses_${user?.id}`)) || [];
          courseData = savedLocal.find(c => c.id === id);
        }

        if (courseData) {
          setCourse(courseData);
          if (courseData.lessons && courseData.lessons.length > 0) {
            setActiveLesson(courseData.lessons[0]);
          } else if (courseData.isYoutube) {
            // Treat the youtube video itself as a single lesson
            setActiveLesson({
               id: courseData.youtubeId,
               title: courseData.title,
               videoUrl: `https://www.youtube.com/embed/${courseData.youtubeId}?autoplay=1`,
               notes: `This is a saved YouTube masterclass: ${courseData.title}.\n\nTake notes while you watch this free programming content! Test your knowledge below when you are finished.`
            });
          }
        }
      } catch (error) {
        console.error("Failed to load course", error);
      }
    };
    if (id) fetchCourse();
  }, [id, token, user]);
  
  useEffect(() => {
    setSummary(''); // Reset summary when lesson changes
  }, [activeLesson]);

  const handleSummarize = async () => {
    if (!activeLesson?.notes) return;
    setIsSummarizing(true);
    try {
      const res = await axios.post('https://lms-3xy9.onrender.com/api/ai/summarize', { notes: activeLesson.notes }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setSummary("Failed to generate summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  if (!course) return <div className="min-h-screen bg-gray-50 pt-20 text-center">Loading Course...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col space-y-6">
          <div className="bg-black aspect-video rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg">
            {activeLesson?.videoUrl ? (
              <iframe 
                src={activeLesson.videoUrl} 
                className="w-full h-full" 
                allowFullScreen 
                title={activeLesson.title}
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <PlayCircle size={64} className="mb-4 opacity-50" />
                <p>No video available for this lesson.</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{activeLesson?.title || course.title}</h1>
              {activeLesson?.notes && (
                <button 
                  onClick={handleSummarize}
                  disabled={isSummarizing || summary !== ''}
                  className="bg-blue-50 text-primary-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSummarizing ? 'Summarizing...' : summary ? 'Summarized' : '✨ Summarize Notes'}
                </button>
              )}
            </div>
            
            {summary && (
              <div className="mb-6 bg-yellow-50 border border-yellow-100 p-5 rounded-xl">
                <h3 className="font-bold text-yellow-800 mb-2 flex items-center">
                  <Sparkles size={18} className="mr-2" /> AI Summary
                </h3>
                <div className="text-yellow-900 text-sm whitespace-pre-wrap leading-relaxed">{summary}</div>
              </div>
            )}

            <div className="text-gray-600 leading-relaxed text-sm break-words whitespace-pre-wrap">
              {activeLesson?.notes ? activeLesson.notes : course.description}
            </div>
          </div>
          
          {activeLesson?.notes && (
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary-800">Ready to test your knowledge?</h3>
                <p className="text-primary-600 text-sm mt-1">Generate an AI Quiz based on this lesson's notes.</p>
              </div>
              <button onClick={() => setIsQuizOpen(true)} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:bg-primary-700 transition">
                Take AI Quiz
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 shrink-0 self-start sticky top-24">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Course Content</h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
              {course.lessons?.length > 0 ? course.lessons.map((lesson, idx) => (
                <button 
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left p-4 hover:bg-gray-50 flex items-start transition ${activeLesson?.id === lesson.id ? 'bg-blue-50 hover:bg-blue-50 border-l-4 border-primary-500' : 'border-l-4 border-transparent'}`}
                >
                  <div className={`shrink-0 mr-3 mt-0.5 ${activeLesson?.id === lesson.id ? 'text-primary-600' : 'text-gray-400'}`}>
                    {idx === 0 ? <CheckCircle size={18} className="text-green-500" /> : <PlayCircle size={18} />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium pr-2 ${activeLesson?.id === lesson.id ? 'text-primary-700' : 'text-gray-700'}`}>
                      {idx + 1}. {lesson.title}
                    </h4>
                    <span className="text-xs text-gray-500 flex items-center mt-1">
                      <FileText size={12} className="mr-1"/> Notes included
                    </span>
                  </div>
                </button>
              )) : course.isYoutube ? (
                 <button 
                  className={`w-full text-left p-4 bg-blue-50 border-l-4 border-primary-500 flex items-start transition`}
                >
                  <div className={`shrink-0 mr-3 mt-0.5 text-primary-600`}>
                    <PlayCircle size={18} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium pr-2 text-primary-700`}>
                      1. Youtube Full Course
                    </h4>
                    <span className="text-xs text-primary-500 flex items-center mt-1">
                      <Sparkles size={12} className="mr-1"/> Real-time AI mode active
                    </span>
                  </div>
                </button>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm">No lessons found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ChatbotWidget />
      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
        lessonNotes={activeLesson?.notes} 
        lessonId={activeLesson?.id} 
      />
    </div>
  );
};

export default CourseView;
