import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const CareerStrategist = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        const res = await api.get('/api/career-pathways');
        setResponse(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong fetching career pathways.');
      } finally {
        setLoading(false);
      }
    };
    fetchPathways();
  }, []);

  const refreshPathways = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/career-pathways');
      setResponse(res.data);
      toast.success('Career pathways refreshed!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to refresh career pathways.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Pathways</h1>
            <p className="text-gray-600">Discover your next career moves</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 font-medium text-lg">Loading career pathways...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Pathways</h1>
            <p className="text-gray-600">Discover your next career moves</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-4">
              We couldn't load your career pathways at this time.
            </p>
            <button
              onClick={refreshPathways}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Destructure expected fields
  const { currentRole, potentialPathways } = response;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Pathways</h1>
          <p className="text-gray-600">Discover your next career moves and growth opportunities</p>
        </div>

        {/* Current Role Section */}
        {currentRole && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">👤</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Current Role</h2>
                <p className="text-xl text-blue-600 font-medium">{currentRole}</p>
              </div>
            </div>
          </div>
        )}

        {/* Potential Pathways Section */}
        {Array.isArray(potentialPathways) && potentialPathways.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Potential Career Pathways ({potentialPathways.length})
              </h2>
              <button
                onClick={refreshPathways}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-1"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {potentialPathways.map((pw, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Pathway Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        {pw.title || `Career Path ${idx + 1}`}
                      </h3>
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center ml-3">
                        <span className="text-purple-600 text-sm font-medium">{idx + 1}</span>
                      </div>
                    </div>
                    {pw.description && (
                      <p className="text-gray-700 leading-relaxed">{pw.description}</p>
                    )}
                  </div>

                  {/* Timeline */}
                  {pw.timeline && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-green-600">⏱️</span>
                        <span className="text-sm font-medium text-gray-700">Timeline</span>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                        <p className="text-green-800 font-medium">{pw.timeline}</p>
                      </div>
                    </div>
                  )}

                  {/* Required Skills */}
                  {Array.isArray(pw.requiredSkills) && pw.requiredSkills.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-blue-600">🎯</span>
                        <span className="text-sm font-medium text-gray-700">Required Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pw.requiredSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🛤️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pathways Available</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any potential career pathways for your profile at this time.
            </p>
            <button
              onClick={refreshPathways}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Refresh Pathways
            </button>
          </div>
        )}

        {/* Additional Info Section */}
        {potentialPathways && potentialPathways.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-lg">💡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h3>
                <p className="text-blue-800 leading-relaxed">
                  Review each pathway carefully and consider which aligns best with your career goals. 
                  Focus on developing the required skills and create a timeline for your transition.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerStrategist;