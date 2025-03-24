import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import MoodHistoryPage from './pages/MoodHistoryPage';
import HugCenterPage from './pages/HugCenterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Import styles
import './styles/index.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner centered" />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mood-tracker" 
        element={
          <ProtectedRoute>
            <MoodTrackerPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mood-history" 
        element={
          <ProtectedRoute>
            <MoodHistoryPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hug-center" 
        element={
          <ProtectedRoute>
            <HugCenterPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ApolloProvider>
    </Router>
  );
}

export default App;