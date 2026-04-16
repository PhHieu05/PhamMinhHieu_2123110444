import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Subjects from './pages/Subjects';
import Grades from './pages/Grades';
import Attendances from './pages/Attendances';
import Schedules from './pages/Schedules';
import AdminLeaveRequests from './pages/AdminLeaveRequests';

// Student Pages
import StudentSchedule from './pages/StudentSchedule';
import StudentGrades from './pages/StudentGrades';
import StudentLeave from './pages/StudentLeave';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/students" element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        } />
        <Route path="/classes" element={
          <ProtectedRoute>
            <Classes />
          </ProtectedRoute>
        } />
        <Route path="/subjects" element={
          <ProtectedRoute>
            <Subjects />
          </ProtectedRoute>
        } />
        <Route path="/grades" element={
          <ProtectedRoute>
            <Grades />
          </ProtectedRoute>
        } />
        <Route path="/attendances" element={
          <ProtectedRoute>
            <Attendances />
          </ProtectedRoute>
        } />
        <Route path="/schedules" element={
          <ProtectedRoute>
            <Schedules />
          </ProtectedRoute>
        } />
        <Route path="/leave-requests" element={
          <ProtectedRoute>
            <AdminLeaveRequests />
          </ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/schedule" element={
          <ProtectedRoute>
            <StudentSchedule />
          </ProtectedRoute>
        } />
        <Route path="/my-grades" element={
          <ProtectedRoute>
            <StudentGrades />
          </ProtectedRoute>
        } />
        <Route path="/leave-request" element={
          <ProtectedRoute>
            <StudentLeave />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
