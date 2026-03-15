import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { MessageSquare, X, Send, Brain, Loader2 } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hi! I am the SmartLearn AI tutor. How can I help you understand this lesson better?' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const renderMessageText = (text) => {
    const paragraphs = text.split(/\n{2,}/);

    return paragraphs.map((para, idx) => {
      const lines = para.split('\n');
      const listLines = lines.filter((line) => line.trim().startsWith('- '));
      const isList = listLines.length === lines.filter((l) => l.trim().length > 0).length && listLines.length > 0;

      if (isList) {
        return (
          <ul key={idx} className="list-disc pl-5 space-y-1">
            {listLines.map((line, i) => (
              <li key={i} className="leading-relaxed">
                {line.replace(/^- /, '').trim()}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p
          key={idx}
          className="whitespace-pre-wrap leading-relaxed mb-2 last:mb-0"
        >
          {para}
        </p>
      );
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/ai/chat',
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the AI service right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden h-[500px] animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain size={24} />
              <div>
                <h3 className="font-bold">AI Tutor</h3>
                <p className="text-xs text-primary-100">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-primary-100 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-background flex flex-col space-y-4 relative z-0">
            {/* Neural Network Abstract Pattern */}
            <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 4px 4px, #4F46E5 2px, transparent 0), linear-gradient(to right, rgba(79, 70, 229, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 70, 229, 0.4) 1px, transparent 1px)`, backgroundSize: '24px 24px', backgroundPosition: 'center' }}></div>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
                  }`}
                >
                  {renderMessageText(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm p-3 rounded-2xl rounded-tl-none">
                  <Loader2 size={16} className="animate-spin text-primary-500" />
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask a question..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-12 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-1 w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition"
              >
                <Send size={14} className="mr-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-primary-700 hover:scale-105 transition transform"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
