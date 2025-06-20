import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Advice = () => {
  const [question, setQuestion] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const askAdvice = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question.');
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const res = await api.post('/api/career-advice', { question });
      const { advice } = res.data;
      setResult(advice);
      setLoading(false);
      toast.success('Advice received!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to request advice');
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      askAdvice();
    }
  };

  const clearAdvice = () => {
    setQuestion('');
    setResult(null);
    setTaskId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Advice</h1>
          <p className="text-gray-600">Get personalized guidance for your career journey</p>
        </div>

        {/* Question Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like advice about?
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={5}
                placeholder="Ask your career-related question... (e.g., How do I transition to a new industry? What skills should I develop? How do I negotiate salary?)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tip: Press Ctrl + Enter to submit quickly
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {question.length}/1000 characters
                </span>
                {question.length > 0 && (
                  <button
                    onClick={clearAdvice}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <button
                onClick={askAdvice}
                disabled={loading || !question.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Getting Advice...</span>
                  </>
                ) : (
                  <>
                    <span>🧠</span>
                    <span>Get Advice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Advice Result Section */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🧠</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Career Advice</h3>
                  <p className="text-green-100 text-sm">Personalized guidance for your question</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Question:</h4>
                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-400">
                  <p className="text-gray-800 leading-relaxed">{question}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Advice:</h4>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                    {result}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setQuestion('');
                    setResult(null);
                  }}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
                >
                  Ask Another Question
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-1"
                >
                  <span>📋</span>
                  <span>Copy Advice</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">💡</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Help</h3>
            <p className="text-gray-600 mb-6">
              Share your career questions and get personalized advice to help you succeed.
            </p>
            
            {/* Example Questions */}
            <div className="max-w-2xl mx-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Questions:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {[
                  "How do I negotiate my salary?",
                  "What skills should I learn for my field?",
                  "How do I transition to a new career?",
                  "What's the best way to network?"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(example)}
                    className="text-left p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Advice;