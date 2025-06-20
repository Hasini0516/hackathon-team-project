import { useState, useEffect } from 'react';
const mockApi = {
  post: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            greeting: "Hey! Ready to accelerate your career journey today?",
            careerInsights: [
              {
                title: "Market Opportunity Alert",
                content:
                  "The demand for your skill set has increased by 23% this month. Consider exploring senior-level positions in tech companies that are actively hiring.",
              },
              {
                title: "Skill Gap Analysis",
                content:
                  "Based on current market trends, adding cloud architecture certification could boost your earning potential by up to 35%.",
              },
              {
                title: "Network Growth",
                content:
                  "You've expanded your professional network by 15% this quarter. Time to leverage these connections for strategic career moves.",
              },
            ],
            recommendedActions: [
              "Update your LinkedIn profile with recent project achievements",
              "Schedule informational interviews with 3 industry leaders this week",
              "Complete the AWS certification course you bookmarked",
              "Apply to 5 senior positions that match your enhanced skill profile",
              "Share a thought leadership post about your recent project successes",
            ],
          },
        });
      }, 2000);
    }),
};

const Dashboard = () => {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBriefing = async () => {
    setLoading(true);
    setBriefing(null);
    try {
      const res = await mockApi.post('/api/morning-briefing');
      setBriefing(res.data);
    } catch (err) {
      console.error('Error fetching briefing:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefing();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl mb-6 transform hover:scale-105 transition-transform duration-300">
              <span className="text-3xl">🚀</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
              Career Command Center
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your personalized career intelligence dashboard for strategic growth and opportunity discovery
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Market Data</h3>
                <p className="text-gray-600">Generating your personalized career insights...</p>
              </div>
            </div>
          )
          }

          {/* Main Content */}
          {briefing && (
            <div className="space-y-8 animate-fade-in">
              {/* Greeting Hero Section */}
              {briefing.greeting && (
                  <>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 md:p-12 shadow-2xl">
<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>        
          <div className="relative flex items-center space-x-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">👋</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                        {briefing.greeting}
                      </p>
                    </div>
                  </div>
                </div>
                </>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Career Insights */}
                {Array.isArray(briefing.careerInsights) && briefing.careerInsights.length > 0 && (
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl">💡</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Strategic Insights</h2>
                    </div>
                    <div className="space-y-6">
                      {briefing.careerInsights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-amber-600 font-bold text-sm">{idx + 1}</span>
                              </div>
                              <div className="flex-1">
                                {insight.title && (
                                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">{insight.title}</h3>
                                )}
                                <p className="text-gray-700 leading-relaxed">{insight.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Actions */}
                {Array.isArray(briefing.recommendedActions) && briefing.recommendedActions.length > 0 && (
                  <div className="lg:col-span-1">
                    <div className="sticky top-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">🎯</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Action Plan</h2>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                        <div className="space-y-4">
                          {briefing.recommendedActions.map((action, idx) => (
                            <div
                              key={idx}
                              className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-emerald-50/50 transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-200">
                                <span className="text-emerald-600 text-sm font-bold">{idx + 1}</span>
                              </div>
                              <p className="text-gray-700 leading-relaxed flex-1 text-sm">{action}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Stay Ahead of the Curve</h3>
                    <p className="text-gray-600 text-sm">Updated insights delivered fresh every morning</p>
                  </div>
                </div>
                <button
                  onClick={fetchBriefing}
                  disabled={loading}
                  className="group relative bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center space-x-3"
                >
                  <span className={`text-xl transition-transform duration-300 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`}>
                    🔄
                  </span>
                  <span>Refresh Intelligence</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Animation CSS */}
        <style>
          {`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.6s ease-out;
            }
          `}
        </style>
      </div>
    </>
  );
};
export default Dashboard;