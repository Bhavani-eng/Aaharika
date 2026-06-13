import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import DonorDashboard from './pages/donor/DonorDashboard';
import CreateDonation from './pages/donor/CreateDonation';
import DonorDonations from './pages/donor/DonorDonations';

import NGODashboard from './pages/ngo/NGODashboard';
import BrowseDonations from './pages/ngo/BrowseDonations';
import NGOClaims from './pages/ngo/NGOClaims';

import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerTasks from './pages/volunteer/VolunteerTasks';
import QRScannerPage from './pages/volunteer/QRScannerPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminNGO from './pages/admin/AdminNGO';
import AdminDonations from './pages/admin/AdminDonations';
import AdminComplaints from './pages/admin/AdminComplaints';

import DonationDetails from './pages/DonationDetails';
import AnalyticsPage from './pages/AnalyticsPage';
import EmergencyPage from './pages/EmergencyPage';
import ReviewsPage from './pages/ReviewsPage';
import CertificatesPage from './pages/CertificatesPage';
import ComplaintsPage from './pages/ComplaintsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/donor" element={<ProtectedRoute roles={['donor']}><DonorDashboard /></ProtectedRoute>} />
            <Route path="/donor/create" element={<ProtectedRoute roles={['donor']}><CreateDonation /></ProtectedRoute>} />
            <Route path="/donor/donations" element={<ProtectedRoute roles={['donor']}><DonorDonations /></ProtectedRoute>} />

            <Route path="/ngo" element={<ProtectedRoute roles={['ngo']}><NGODashboard /></ProtectedRoute>} />
            <Route path="/ngo/donations" element={<ProtectedRoute roles={['ngo']}><BrowseDonations /></ProtectedRoute>} />
            <Route path="/ngo/claims" element={<ProtectedRoute roles={['ngo']}><NGOClaims /></ProtectedRoute>} />

            <Route path="/volunteer" element={<ProtectedRoute roles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />
            <Route path="/volunteer/tasks" element={<ProtectedRoute roles={['volunteer']}><VolunteerTasks /></ProtectedRoute>} />
            <Route path="/volunteer/scanner" element={<ProtectedRoute roles={['volunteer']}><QRScannerPage /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/ngos" element={<ProtectedRoute roles={['admin']}><AdminNGO /></ProtectedRoute>} />
            <Route path="/admin/donations" element={<ProtectedRoute roles={['admin']}><AdminDonations /></ProtectedRoute>} />
            <Route path="/admin/complaints" element={<ProtectedRoute roles={['admin']}><AdminComplaints /></ProtectedRoute>} />

            <Route path="/donations/:id" element={<ProtectedRoute><DonationDetails /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute><EmergencyPage /></ProtectedRoute>} />
            <Route path="/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
            <Route path="/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute><ComplaintsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
