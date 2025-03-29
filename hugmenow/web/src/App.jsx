import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { HugProvider } from './contexts/HugContext';
// Use GraphQL API instead of WebSocket-based hugmoodAPI
import * as graphqlService from './services/graphqlService';
import GraphQLAppProvider from './components/GraphQLAppProvider';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Common Components
import Loading from './components/common/Loading';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Notifications from './components/common/Notifications';
import AuthDebugOverlay from './components/common/AuthDebugOverlay'; // Added import

// Eager-loaded Pages
import LandingPage from './pages/LandingPage';
import ErrorPage from './pages/ErrorPage';
import OnboardingPage from './pages/OnboardingPage';

// Lazy-loaded Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const MoodTrackerPage = lazy(() => import('./pages/MoodTrackerPage'));
const MoodHistoryPage = lazy(() => import('./pages/MoodHistoryPage'));
const MoodInsightsPage = lazy(() => import('./pages/MoodInsightsPage'));
const HugSendPage = lazy(() => import('./pages/HugSendPage'));
const HugReceivePage = lazy(() => import('./pages/HugReceivePage'));
const HugRequestPage = lazy(() => import('./pages/HugRequestPage'));
const GroupHugPage = lazy(() => import('./pages/GroupHugPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));

// GraphQL client configuration
const graphqlOptions = {
  httpUrl: '/graphql',       // Default GraphQL HTTP endpoint
  wsUrl: '',                 // Disable WebSocket and use polling instead
  useSubscriptions: false,   // Disable WebSocket subscriptions
  usePollFallback: true      // Enable polling for real-time updates
};

function AppContent() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    console.log('App component mounted, preparing application...');
    setAppReady(true);
  }, []);

  // Show loading screen while initializing
  if (!appReady) {
    return <Loading fullScreen message="Initializing application..." />;
  }

  return (
    <Router>
      <Suspense fallback={<Loading fullScreen />}>
        <AuthDebugOverlay /> {/* Added AuthDebugOverlay */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/*" element={
            <AuthLayout>
              <AuthPage />
            </AuthLayout>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/mood/track" element={
            <ProtectedRoute>
              <MainLayout>
                <MoodTrackerPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/mood/history" element={
            <ProtectedRoute>
              <MainLayout>
                <MoodHistoryPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/mood/insights" element={
            <ProtectedRoute>
              <MainLayout>
                <MoodInsightsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/hug/send" element={
            <ProtectedRoute>
              <MainLayout>
                <HugSendPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/hug/receive" element={
            <ProtectedRoute>
              <MainLayout>
                <HugReceivePage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/hug/request" element={
            <ProtectedRoute>
              <MainLayout>
                <HugRequestPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/group-hug" element={
            <ProtectedRoute>
              <MainLayout>
                <GroupHugPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile/:userId" element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <MainLayout>
                <CommunityPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Error/Not Found Route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>

      {/* Global Components */}
      <Notifications />
    </Router>
  );
}

function App() {
  console.log('Rendering App component with providers');
  return (
    <div className="app">
      <GraphQLAppProvider options={graphqlOptions}>
        <ThemeProvider>
          <AuthProvider>
            <HugProvider>
              <AppContent />
            </HugProvider>
          </AuthProvider>
        </ThemeProvider>
      </GraphQLAppProvider>
    </div>
  );
}

export default App;