import { useState, useEffect, useContext } from 'react';
import { User, LogOut } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
      const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSignOut = () => {
      setIsProfileOpen(false); 
    logout();
    navigate('/');
  };

  // Helper to get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    const initials = parts.map(p => p[0]).join('').toUpperCase();
    return initials.slice(0, 2);
  };

  const initials = user ? getInitials(user.fullName) : '';

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Logo/Brand */}
      <div className="flex items-center space-x-3">
        <span className="text-2xl font-bold text-blue-600">CareerPro</span>
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 ml-8">
          <a href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</a>
          <a href="/job-listings" className="text-gray-700 hover:text-blue-600 font-medium">Jobs</a>
          <a href="/career-advice" className="text-gray-700 hover:text-blue-600 font-medium">Career Advice</a>
          <a href="/strategist" className="text-gray-700 hover:text-blue-600 font-medium">Career Strategist</a>
        </div>
      </div>

      {/* User/Profile Dropdown */}
      {token && (
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(open => !open)}
            className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {initials || '??'}
            </div>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {initials || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.fullName || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role || '—'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => {navigate('/profile'); setIsProfileOpen(false);}}>
                  <User className="h-4 w-4 mr-3" />
                  View Profile
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;