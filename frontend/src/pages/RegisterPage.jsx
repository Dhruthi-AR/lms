import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User, Briefcase } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://lms-3xy9.onrender.com/api/auth/register', { name, email, password, role });
      setAuth(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-background to-secondary-50 px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 pointer-events-none"></div>

      <div className="max-w-md w-full bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white overflow-hidden relative z-10">
        <div className="p-8">
          <div className="text-center mb-8">
            <Brain size={48} className="text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">Join SmartLearn AI today</p>
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  placeholder="John Doe"
                  value={name} onChange={(e) => setName(e.target.value)} required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`py-3 rounded-xl border font-medium flex justify-center items-center space-x-2 transition ${role === 'STUDENT' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  <User size={18} /><span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('INSTRUCTOR')}
                  className={`py-3 rounded-xl border font-medium flex justify-center items-center space-x-2 transition ${role === 'INSTRUCTOR' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  <Briefcase size={18} /><span>Instructor</span>
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-700 transition transform hover:-translate-y-0.5 shadow-lg mt-4">
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
