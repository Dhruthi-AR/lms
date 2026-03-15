import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Settings as SettingsIcon, User, Lock, Bell, CheckCircle2, Shield } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Settings = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <SettingsIcon className="text-primary-600" size={32} />
          Account Settings
        </h1>
        <p className="text-gray-600 mt-2">Manage your profile, security preferences, and notifications.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            {['Profile', 'Security', 'Notifications'].map((tab) => {
              const Icon = tab === 'Profile' ? User : tab === 'Security' ? Shield : Bell;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 transparent border border-transparent'
                  }`}
                >
                  <Icon size={18} className={activeTab === tab ? 'text-primary-600' : 'text-gray-400'} />
                  {tab}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
          {activeTab === 'Profile' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-3xl font-bold shadow-inner border-4 border-white mr-2 relative overflow-hidden group hover:cursor-pointer">
                  {user?.name?.charAt(0) || 'U'}
                  <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <User size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.name || 'User'}</h3>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-md inline-block">
                    {user?.role || 'Student'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <input type="text" defaultValue={user?.name || ''} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-sm font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                  <input type="email" defaultValue={user?.email || ''} readOnly className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-gray-500 outline-none focus:ring-0 shadow-sm font-medium cursor-not-allowed" />
                </div>
                <div className="col-span-full">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Bio</label>
                  <textarea rows="4" placeholder="Tell us about yourself..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-sm font-medium resize-none"></textarea>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'Security' && (
            <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4">Change Password</h3>
                <div className="space-y-5 mt-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Current Password</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                       <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-sm font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">New Password</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                       <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-sm font-medium" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4">Email Notifications</h3>
                <div className="space-y-6 mt-6">
                  {[
                    { title: 'Course Updates', desc: 'Get notified when new content is added to your enrolled courses.' },
                    { title: 'AI Recommendations', desc: 'Receive tailored learning paths based on your current progress.' },
                    { title: 'Assignment Reminders', desc: 'Weekly digests showing overdue quizzes or tasks.' }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-start justify-between">
                      <div className="pr-4">
                        <p className="font-bold text-gray-900 mb-1">{notif.title}</p>
                        <p className="text-sm text-gray-500 font-medium">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 shadow-inner"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-end">
             {isSaved && (
               <span className="text-green-600 font-bold flex items-center mr-6 animate-pulse">
                 <CheckCircle2 size={18} className="mr-2" />
                 Saved successfully
               </span>
             )}
             <button 
               onClick={handleSave}
               className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-sm hover:shadow"
             >
               Save Changes
             </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
