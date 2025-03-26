import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { GET_USER_MOODS, GET_MOOD_STREAK, GET_RECEIVED_HUGS, GET_USER_STATS } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import LoadingScreen from '../components/common/LoadingScreen';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  
  // Get time-based greeting
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return t('dashboard.welcomeMorning');
      if (hour < 18) return t('dashboard.welcomeAfternoon');
      return t('dashboard.welcomeEvening');
    };
    
    setGreeting(getGreeting());
  }, [t]);
  
  // GraphQL queries - only execute if user is logged in
  const { loading: loadingMoods, data: moodData } = useQuery(GET_USER_MOODS, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });
  
  const { loading: loadingStreak, data: streakData } = useQuery(GET_MOOD_STREAK, {
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });
  
  const { loading: loadingHugs, data: hugsData } = useQuery(GET_RECEIVED_HUGS, {
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });
  
  const { loading: loadingStats, data: statsData } = useQuery(GET_USER_STATS, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });
  
  // Show loading screen if data is loading
  const isLoading = loadingMoods || loadingStreak || loadingHugs || loadingStats;
  if (isLoading && user) {
    return (
      <AppLayout>
        <LoadingScreen message={t('dashboard.loading')} />
      </AppLayout>
    );
  }
  
  // Extract data from queries
  const moods = moodData?.userMoods || [];
  const latestMood = moods[0]; // Assuming moods are sorted by date desc
  const streak = streakData?.moodStreak || 0;
  const receivedHugs = hugsData?.receivedHugs || [];
  const stats = statsData?.userStats || { totalMoods: 0, totalHugs: 0 };
  
  // Get mood text and emoji based on score
  const getMoodDisplay = (score) => {
    if (!score) return { text: '', emoji: '' };
    
    if (score >= 9) return { text: t('moods.excellent'), emoji: '😁' };
    if (score >= 7) return { text: t('moods.great'), emoji: '🙂' };
    if (score >= 5) return { text: t('moods.good'), emoji: '😐' };
    if (score >= 3) return { text: t('moods.okay'), emoji: '😕' };
    return { text: t('moods.notGood'), emoji: '😞' };
  };
  
  return (
    <AppLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>
            {user 
              ? `${greeting}, ${user.name || user.username}!` 
              : t('dashboard.welcomeGeneric')}
          </h1>
          {!user && (
            <p className="login-prompt">
              {t('dashboard.pleaseLogin')}
            </p>
          )}
        </div>
        
        {user ? (
          <>
            {/* Dashboard content for logged in users */}
            <div className="dashboard-grid">
              {/* Mood tracker section */}
              <div className="dashboard-card mood-tracking-card">
                <h2>{t('dashboard.checkinPrompt')}</h2>
                <div className="card-content">
                  <Link to="/mood-tracker" className="btn btn-primary">
                    {t('moodTracker.title')}
                  </Link>
                  
                  {latestMood && (
                    <div className="latest-mood">
                      <h3>{t('dashboard.latestMood')}</h3>
                      <div className="mood-display">
                        <span className="mood-emoji">
                          {getMoodDisplay(latestMood.score).emoji}
                        </span>
                        <span className="mood-score">
                          {latestMood.score}/10
                        </span>
                        <span className="mood-text">
                          {getMoodDisplay(latestMood.score).text}
                        </span>
                        <span className="mood-date">
                          {new Date(latestMood.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Stats section */}
              <div className="dashboard-card stats-card">
                <h2>{t('dashboard.currentStreak')}</h2>
                <div className="card-content">
                  <div className="stat-value streak">
                    <span className="stat-number">{streak}</span>
                    <span className="stat-label">{t('dashboard.daysTracked')}</span>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-card stats-card">
                <h2>{t('dashboard.totalMoods')}</h2>
                <div className="card-content">
                  <div className="stat-value moods">
                    <span className="stat-number">{stats.totalMoods || moods.length}</span>
                    <span className="stat-label">{t('dashboard.moodsRecorded')}</span>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-card stats-card">
                <h2>{t('dashboard.hugActivity')}</h2>
                <div className="card-content">
                  <div className="stat-value hugs">
                    <span className="stat-number">{stats.totalHugs || receivedHugs.length}</span>
                    <span className="stat-label">{t('dashboard.hugsReceived')}</span>
                  </div>
                  <Link to="/hug-center" className="btn btn-outline">
                    {t('hugCenter.title')}
                  </Link>
                </div>
              </div>
              
              {/* Daily suggestion */}
              <div className="dashboard-card suggestion-card">
                <h2>{t('dashboard.dailySuggestion')}</h2>
                <div className="card-content">
                  <p className="suggestion-text">
                    {t('dashboard.suggestionText')}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Dashboard content for guests */
          <div className="guest-content">
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-primary">
                {t('auth.login')}
              </Link>
              <Link to="/register" className="btn btn-outline">
                {t('auth.register')}
              </Link>
            </div>
            <div className="app-description">
              <h2>{t('app.tagline')}</h2>
              <ul className="feature-list">
                <li>
                  <div className="feature-icon">📊</div>
                  <div className="feature-text">
                    <h3>{t('moodTracker.title')}</h3>
                    <p>{t('moodTracker.subtitle')}</p>
                  </div>
                </li>
                <li>
                  <div className="feature-icon">🫂</div>
                  <div className="feature-text">
                    <h3>{t('hugCenter.title')}</h3>
                    <p>{t('hugCenter.subtitle')}</p>
                  </div>
                </li>
                <li>
                  <div className="feature-icon">🔒</div>
                  <div className="feature-text">
                    <h3>Privacy-First</h3>
                    <p>Your emotional data stays private and secure with our privacy-focused design.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;