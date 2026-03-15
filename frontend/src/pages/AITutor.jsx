import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import DashboardLayout from '../components/DashboardLayout';
import { Send, Brain, Loader2, Sparkles, BookOpen, User, Lightbulb, Code } from 'lucide-react';

const SUGGESTIONS = [
  { icon: Lightbulb, text: "Explain React hooks simply" },
  { icon: Code, text: "How do I reverse a string in JavaScript?" },
  { icon: BookOpen, text: "What is the difference between SQL and NoSQL?" },
];

const AITutor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuthStore();
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMessage = textToSend.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    if (textToSend === input) setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        'https://lms-3xy9.onrender.com/api/ai/chat',
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the AI service right now. Please test your backend configuration.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-xl text-primary-600">
                <Brain size={32} />
              </div>
              Smart AI Tutor
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Your personal assistant for coding, theory, and problem-solving.</p>
          </div>
        </div>

        {/* Chat Interface Container */}
        <div className="flex-1 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative">
             {/* Decorative Background Pattern */}
             <div className="absolute inset-0 z-[0] opacity-[0.02] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #4F46E5 1px, transparent 0)`, backgroundSize: '32px 32px' }}></div>
            
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center relative z-10 p-6">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Sparkles size={40} className="text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">How can I help you today, {user.name.split(' ')[0]}?</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                  I can explain complex topics, review your code, generate practice questions, or guide you through a difficult lesson.
                </p>
                <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
                  {SUGGESTIONS.map((suggestion, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSend(suggestion.text)}
                      className="bg-white border border-gray-200 text-gray-700 hover:text-primary-600 hover:border-primary-300 px-5 py-3 rounded-xl text-sm font-medium flex items-center transition shadow-sm hover:shadow"
                    >
                      <suggestion.icon size={16} className="mr-2 text-primary-500" />
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 relative z-10 max-w-4xl mx-auto w-full pb-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex max-w-[85%] items-end gap-3">
                      {msg.role === 'ai' && (
                        <div className="w-10 h-10 shrink-0 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 shadow-sm border border-primary-50">
                          <Brain size={20} />
                        </div>
                      )}
                      <div 
                        className={`p-5 rounded-2xl text-[15px] shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-primary-600 text-white rounded-br-none' 
                            : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-none leading-relaxed'
                        }`}
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {msg.text}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-10 h-10 shrink-0 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-sm border border-gray-200 font-bold overflow-hidden">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[85%] items-end gap-3">
                      <div className="w-10 h-10 shrink-0 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 shadow-sm border border-primary-50">
                        <Brain size={20} />
                      </div>
                      <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
                        <Loader2 size={18} className="animate-spin text-primary-500" />
                        <span className="text-gray-500 text-sm font-medium">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endOfMessagesRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white border-t border-gray-50">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center max-w-4xl mx-auto w-full">
              <input
                type="text"
                placeholder="Message SmartLearn AI..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-6 pr-16 py-4 text-base outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:bg-white transition shadow-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Send size={20} className="mr-0.5" />
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-3 hidden md:block">
              SmartLearn AI can make mistakes. Consider verifying important information.
            </p>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AITutor;
