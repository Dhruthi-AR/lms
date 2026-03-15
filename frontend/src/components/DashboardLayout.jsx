import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PieChart, Sparkles, Book, Bot, ListChecks, TrendingUp, Award, Settings as SettingsIcon } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import Navbar from './Navbar';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', icon: PieChart, path: '/dashboard' },
  { name: 'Browse Catalog', icon: Sparkles, path: '/catalog' },
  { name: 'My Courses', icon: Book, path: '/my-courses' },
  { name: 'AI Tutor', icon: Bot, path: '/ai-tutor' },
  { name: 'Quizzes', icon: ListChecks, path: '/quizzes' },
  { name: 'Progress', icon: TrendingUp, path: '/progress' },
  { name: 'Certificates', icon: Award, path: '/certificates' },
  { name: 'Settings', icon: SettingsIcon, path: '/settings' },
];

const DashboardLayout = ({ children }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  return (
    <div className="h-screen bg-background text-textMain flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-gray-100 hidden md:flex flex-col h-full">
        <div className="p-6 flex items-center space-x-2 text-primary-600 shrink-0 border-b border-gray-50 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <Bot size={28} />
          <span className="text-xl font-bold tracking-tight">SmartLearn AI</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item, idx) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard');
            return (
              <button 
                key={idx} 
                onClick={() => navigate(item.path)} 
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'}`}
              >
                <item.icon size={20} className={`mr-3 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 shrink-0">
           <div className="flex items-center px-4 py-3 text-sm font-bold text-gray-900">
             <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3 font-bold">
               {user.name.charAt(0)}
             </div>
             <div className="flex-1 truncate">
                 {user.name.split(' ')[0]}
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="md:hidden"><Navbar /></div>
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
