import { Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CareerStrategist from '../pages/CareerStrategist';
import UpdateLinkedIn from '../pages/UpdateLinkedin';
import ScrapeLinkedIn from '../pages/ScrapeLinkedin';
import ProtectedRoute from '../components/ProtectedRoute';
import Jobs from '../pages/Jobs';
import Advice from '../pages/Advice';
import MorningBriefing from '../pages/MorningBriefing';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/career-strategist" element={<CareerStrategist />} />
        <Route path="/update-linkedin" element={<UpdateLinkedIn />} />
        <Route path="/scrape-linkedin" element={<ScrapeLinkedIn />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/advice" element={<Advice />} />
        <Route path="/morning-briefing" element={<MorningBriefing />} />
              </Route>
    </Routes>
  );
};

export default AppRoutes;