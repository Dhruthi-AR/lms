import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { Loader2, X, AlertCircle, CheckCircle, Brain } from 'lucide-react';

const QuizModal = ({ isOpen, onClose, lessonNotes, lessonId }) => {
  const [quizzes, setQuizzes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const { token } = useAuthStore();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'https://lms-3xy9.onrender.com/api/ai/generate-quiz',
        { lessonNotes, count: 3 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuizzes(res.data);
    } catch (err) {
      setError('Failed to generate quiz from notes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qIndex, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    let currentScore = 0;
    quizzes.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) currentScore++;
    });
    
    const finalScore = (currentScore / quizzes.length) * 100;
    setScore(finalScore);
    setSubmitted(true);

    try {
      // Optional: Since AI generated this ad-hoc, it might not exist in Prisma DB natively unless we saved it during generation. 
      // For this demo, let's just show them the result on screen.
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-primary-50">
          <div className="flex items-center space-x-2 text-primary-700 font-bold text-lg">
            <Brain size={24} />
            <h2>AI Knowledge Check</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          {!quizzes && !isLoading && (
            <div className="text-center py-12">
              <Brain size={48} className="mx-auto text-primary-500 mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to test yourself?</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Our AI will analyze the lesson content and generate a personalized quiz for you right now.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-primary-700 transition transform hover:-translate-y-0.5"
              >
                Generate Quiz
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={48} className="animate-spin text-primary-500 mb-4" />
              <p className="text-gray-600 font-medium">AI is reading the notes and spinning up questions...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center">
              <AlertCircle size={20} className="mr-3 shrink-0" />
              {error}
            </div>
          )}

          {quizzes && (
            <div className="space-y-8">
              {submitted && (
                <div className={`p-6 rounded-2xl flex items-center justify-between shadow-sm ${score >= 70 ? 'bg-green-50' : 'bg-orange-50'}`}>
                  <div>
                    <h3 className={`font-bold text-2xl ${score >= 70 ? 'text-green-700' : 'text-orange-700'}`}>
                      You scored {score.toFixed(0)}%
                    </h3>
                    <p className={`text-sm mt-1 ${score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                      {score >= 70 ? 'Great job! You mastered this topic.' : 'Keep reviewing! Practice makes perfect.'}
                    </p>
                  </div>
                  <CheckCircle size={48} className={`opacity-20 ${score >= 70 ? 'text-green-900' : 'text-orange-900'}`} />
                </div>
              )}

              {quizzes.map((q, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-lg text-gray-900 mb-4"><span className="text-primary-600 mr-2">Q{idx + 1}.</span> {q.question}</h4>
                  <div className="space-y-3">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[idx] === opt;
                      const isCorrect = submitted && opt === q.correctAnswer;
                      const isWrong = submitted && isSelected && !isCorrect;

                      let btnClass = "w-full text-left p-4 rounded-xl border transition "
                      if (!submitted) {
                        btnClass += isSelected ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-gray-700";
                      } else {
                        if (isCorrect) btnClass += "border-green-500 bg-green-50 text-green-800 font-medium";
                        else if (isWrong) btnClass += "border-red-500 bg-red-50 text-red-800 line-through opacity-70";
                        else btnClass += "border-gray-100 bg-gray-50 opacity-50";
                      }

                      return (
                        <button 
                          key={oIdx}
                          onClick={() => handleSelectOption(idx, opt)}
                          disabled={submitted}
                          className={btnClass}
                        >
                          <div className="flex items-center justify-between">
                            <span>{opt}</span>
                            {submitted && isCorrect && <CheckCircle size={18} className="text-green-600" />}
                            {submitted && isWrong && <X size={18} className="text-red-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {quizzes && !submitted && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <button 
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== quizzes.length}
              className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:hover:bg-primary-600"
            >
              Submit Answers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
