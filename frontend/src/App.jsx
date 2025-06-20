import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Advice from './components/CareerAdvice';
import Jobs from './components/Jobs';
import Profile from './components/Profile';
import Register from './components/Register';
import CareerStrategist from './components/Strategist';
import { AuthProvider } from './contexts/AuthContext';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  return token ? children : <Navigate to="/" state={{ from: location }} replace />;
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/job-listings"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Jobs />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/career-advice"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Advice />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/strategist"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CareerStrategist />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;