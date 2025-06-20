import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Jobs = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    if (!title || !location) {
      toast.error('Please enter both title and location');
      return;
    }

    setLoading(true);
    try {
      const url = `/api/job-listings?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`;
      const res = await api.get(url);
      // Expecting res.data.jobs as an array of objects with keys like job_title, employer_name, etc.
      setJobs(res.data.jobs || []);
      toast.success('Jobs fetched successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchJobs();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
          <p className="text-gray-600">Discover jobs that match your skills and aspirations</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                id="job-title"
                type="text"
                placeholder="e.g. Software Engineer, Product Manager"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="e.g. New York, Remote, London"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <button
              onClick={fetchJobs}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 min-w-fit"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Search Jobs</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {jobs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
              </h2>
            </div>
            
            {jobs.map((job, index) => {
              const {
                job_title,
                employer_name,
                job_city,
                job_country,
                job_apply_link,
                job_description,
                job_required_skills,
                job_salary,
              } = job;

              const locationText = [job_city, job_country].filter(Boolean).join(', ');

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Job Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {job_title}
                      </h3>
                      {employer_name && (
                        <p className="text-blue-600 font-medium mb-2">{employer_name}</p>
                      )}
                      {locationText && (
                        <div className="flex items-center text-gray-600 mb-2">
                          <span className="mr-1">📍</span>
                          <span>{locationText}</span>
                        </div>
                      )}
                    </div>
                    
                    {job_apply_link && (
                      <a
                        href={job_apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 mt-2 sm:mt-0"
                      >
                        <span className="mr-2">🔗</span>
                        Apply Now
                      </a>
                    )}
                  </div>

                  {/* Job Details */}
                  <div className="space-y-4">
                    {job_salary && job_salary !== 'Not specified' && (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          💰 {job_salary}
                        </span>
                      </div>
                    )}

                    {job_required_skills && job_required_skills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {job_required_skills.map((skill, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {job_description && (
                      <div>
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 flex items-center">
                            <span className="mr-2 transform group-open:rotate-90 transition-transform duration-200">▶</span>
                            Job Description
                          </summary>
                          <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                              {job_description}
                            </pre>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {jobs.length === 0 && !loading && (title || location) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any jobs matching your search criteria. Try adjusting your search terms.
            </p>
            <button
              onClick={() => {
                setTitle('');
                setLocation('');
                setJobs([]);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Initial State */}
        {jobs.length === 0 && !loading && !title && !location && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">💼</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Job Search</h3>
            <p className="text-gray-600">
              Enter a job title and location to discover opportunities that match your career goals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;