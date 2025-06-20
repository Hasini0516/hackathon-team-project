import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { LogOut, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { token, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setEditData(res.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    if (token) fetchProfile();
    else navigate('/'); // Redirect to login if not authenticated
    // eslint-disable-next-line
  }, [token]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await api.put('/api/profile', editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {user.fullName}
            </h2>
            <p className="text-gray-600">{user.headline || 'No headline set'}</p>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>
          <div className="ml-auto flex space-x-2">
            
            <button
              className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg shadow hover:bg-red-100 transition"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Profile Details */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 font-medium">Location</label>
                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={editData.location || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                ) : (
                  <div className="text-gray-800">{user.location || 'Not specified'}</div>
                )}
              </div>
              <div>
                <label className="block text-gray-600 font-medium">Skills</label>
                {editing ? (
                  <input
                    type="text"
                    name="skills"
                    value={editData.skills ? editData.skills.join(', ') : ''}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        skills: e.target.value.split(',').map((s) => s.trim())
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.length > 0
                      ? user.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))
                      : <span className="text-gray-400">No skills listed</span>}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-600 font-medium">Headline</label>
                {editing ? (
                  <input
                    type="text"
                    name="headline"
                    value={editData.headline || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                ) : (
                  <div className="text-gray-800">{user.headline || 'No headline set'}</div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Account Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 font-medium">User ID</label>
                <div className="text-gray-800">{user.userId}</div>
              </div>
              <div>
                <label className="block text-gray-600 font-medium">Email</label>
                <div className="text-gray-800">{user.email}</div>
              </div>
              <div>
                <label className="block text-gray-600 font-medium">Joined</label>
                <div className="text-gray-800">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Profile;