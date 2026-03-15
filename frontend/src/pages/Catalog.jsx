import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { PlayCircle, Video, Star, Search, Filter, Plus, Check } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const YOUTUBE_COURSES = [
  {
    id: 'yt-1',
    youtubeId: 'PkZNo7MFNFg',
    title: 'Learn JavaScript - Full Course for Beginners',
    channel: 'freeCodeCamp.org',
    views: '12M',
    duration: '3h 26m',
    level: 'Beginner',
    category: 'Programming'
  },
  {
    id: 'yt-2',
    youtubeId: 'bMknfKXIFA8',
    title: 'React Course - Beginner\'s Tutorial for React JavaScript',
    channel: 'freeCodeCamp.org',
    views: '5M',
    duration: '11h 55m',
    level: 'Beginner',
    category: 'Web Development'
  },
  {
    id: 'yt-3',
    youtubeId: '_uQrJ0TkZlc',
    title: 'Python Tutorial for Beginners - Full Course',
    channel: 'Programming with Mosh',
    views: '35M',
    duration: '6h 14m',
    level: 'Beginner',
    category: 'Programming'
  },
  {
    id: 'yt-4',
    youtubeId: 'mU6anWqZJcc',
    title: 'HTML & CSS Full Course - Beginner to Pro',
    channel: 'SuperSimpleDev',
    views: '8M',
    duration: '6h 31m',
    level: 'Beginner',
    category: 'Web Development'
  },
  {
    id: 'yt-5',
    youtubeId: 'X3paOmcrTjQ',
    title: 'Data Science Full Course - Learn Data Science in 10 Hours',
    channel: 'Simplilearn',
    views: '4M',
    duration: '10h 25m',
    level: 'Beginner',
    category: 'Data Science'
  },
  {
    id: 'yt-6',
    youtubeId: 'vEQ8CXFWLZU',
    title: 'Python for Data Science - Course for Beginners',
    channel: 'freeCodeCamp.org',
    views: '3.6M',
    duration: '12h',
    level: 'Beginner',
    category: 'Data Science'
  },
  {
    id: 'yt-7',
    youtubeId: 'c9Wg6Cb_YlU',
    title: 'UI / UX Design Tutorial - Wireframe, Mockup & Design',
    channel: 'freeCodeCamp.org',
    views: '1.2M',
    duration: '1h 37m',
    level: 'Beginner',
    category: 'Design'
  },
  {
    id: 'yt-8',
    youtubeId: 'gu1WEcZKqAM',
    title: 'Figma UI Design Tutorial: Get Started in Just 24 Minutes',
    channel: 'Envato Tuts+',
    views: '2.5M',
    duration: '24m',
    level: 'Beginner',
    category: 'Design'
  }
];

const CATEGORIES = ['All Courses', 'Programming', 'Web Development', 'Data Science', 'Design'];

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Courses');
  const [savedCourseIds, setSavedCourseIds] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem(`savedCourses_${user.id}`)) || [];
      setSavedCourseIds(saved.map(c => c.id));
    }
  }, [user]);

  const handleSaveCourse = (e, course) => {
    e.stopPropagation();
    if (!user) return alert("Please login to save courses.");
    
    let saved = JSON.parse(localStorage.getItem(`savedCourses_${user.id}`)) || [];
    if (!saved.some(c => c.id === course.id)) {
      saved.push({ ...course, isYoutube: true, progress: 0 });
      localStorage.setItem(`savedCourses_${user.id}`, JSON.stringify(saved));
      setSavedCourseIds(prev => [...prev, course.id]);
    }
  };

  const filteredCourses = YOUTUBE_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.channel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All Courses' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-textMain flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Video className="text-red-500" size={32} />
                YouTube Course Catalog
              </h1>
              <p className="text-gray-600 mt-2">Discover, save, and learn from the best free courses on YouTube.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar flex-nowrap">
          {CATEGORIES.map((filter, i) => (
            <button 
              key={i} 
              onClick={() => setActiveCategory(filter)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition flex items-center gap-2 ${activeCategory === filter ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 hover:cursor-default">
          {filteredCourses.map(course => {
            const isSaved = savedCourseIds.includes(course.id);
            return (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full bg-opacity-100 hover:shadow-xl transition-all duration-300 group">
              <div 
                className="relative aspect-video overflow-hidden cursor-pointer" 
                onClick={() => window.open(`https://www.youtube.com/watch?v=${course.youtubeId}`, '_blank')}
              >
                <img 
                  src={`https://img.youtube.com/vi/${course.youtubeId}/maxresdefault.jpg`} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = `https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-xl border-4 border-white/20">
                     <PlayCircle size={28} fill="white" />
                   </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2.5 py-1 rounded">
                  {course.duration}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded-md">{course.category}</span>
                    <span className="text-xs font-medium text-gray-500">{course.level}</span>
                  </div>
                </div>
                <h3 
                  className="font-bold text-gray-900 mb-2 line-clamp-2 leading-snug cursor-pointer group-hover:text-primary-600 transition-colors"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${course.youtubeId}`, '_blank')}
                >
                  {course.title}
                </h3>
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-700 font-semibold mb-1">{course.channel}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {course.views} views • <Star size={12} className="text-yellow-400 fill-yellow-400" /> 4.9
                    </p>
                  </div>
                  {user?.role === 'STUDENT' && (
                    <button 
                      onClick={(e) => handleSaveCourse(e, course)}
                      disabled={isSaved}
                      className={`shrink-0 flex items-center justify-center p-2.5 rounded-xl transition ${isSaved ? 'bg-green-50 text-green-600 cursor-default' : 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white'}`}
                      title={isSaved ? 'Saved to My Courses' : 'Save to My Courses'}
                    >
                      {isSaved ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={2.5} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
            );
          })}
          
          {filteredCourses.length === 0 && (
             <div className="col-span-full py-16 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                   <Search size={28} />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-1">No courses found matching "{searchTerm}"</p>
                <p className="text-sm">Try adjusting your search or switching categories.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
