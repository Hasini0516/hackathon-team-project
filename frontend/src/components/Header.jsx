import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ padding: '1rem', background: '#f0f0f0' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/dashboard">Dashboard</Link>{" | "}
          {token && (
            <>
              <Link to="/career-strategist">Career Strategist</Link>{" | "}
              <Link to="/update-linkedin">Update LinkedIn</Link>{" | "}
              <Link to="/scrape-linkedin">Scrape LinkedIn</Link>{" | "}
              <Link to="/jobs">Jobs</Link>{" | "}
              <Link to="/advice">Advice</Link>{" | "}
              <Link to="/morning-briefing">Briefing</Link>
            </>
          )}
        </div>
        <div>
          {token ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>{" | "}
              <Link to="/register">Register</Link>

            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;