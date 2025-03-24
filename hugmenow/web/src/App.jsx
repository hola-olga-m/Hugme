import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import HugCenterPage from './pages/HugCenterPage';
import ProfilePage from './pages/ProfilePage';
import MoodHistoryPage from './pages/MoodHistoryPage';
import NotFoundPage from './pages/NotFoundPage';

// Styles
import './styles/index.css';

// PrivateRoute component for protected routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// App component with routes
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/mood-tracker" 
        element={
          <PrivateRoute>
            <MoodTrackerPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/hug-center" 
        element={
          <PrivateRoute>
            <HugCenterPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/mood-history" 
        element={
          <PrivateRoute>
            <MoodHistoryPage />
          </PrivateRoute>
        } 
      />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Main App component
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