import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut, User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition">
        <Brain size={28} />
        <span className="text-xl font-bold tracking-tight">SmartLearn</span>
      </Link>
      
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <div className="flex items-center space-x-2 text-gray-700">
              <User size={20} className="text-gray-400" />
              <span className="font-medium text-sm">{user.name}</span>
              <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {user.role}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
