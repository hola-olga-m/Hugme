import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { GET_USER_MOODS, GET_MOOD_STREAK, GET_USER_STATS } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import LoadingScreen from '../components/common/LoadingScreen';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // Fetch user mood data
  const { loading: loadingMoods, data: moodData } = useQuery(GET_USER_MOODS, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });

  // Fetch mood streak
  const { loading: loadingStreak, data: streakData } = useQuery(GET_MOOD_STREAK, {
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });

  // Fetch user stats
  const { loading: loadingStats, data: statsData } = useQuery(GET_USER_STATS, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });

  // Determine welcome message based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let message = '';
    
    if (hour < 12) {
      message = t('dashboard.welcomeMorning');
    } else if (hour < 18) {
      message = t('dashboard.welcomeAfternoon');
    } else {
      message = t('dashboard.welcomeEvening');
    }
    
    setWelcomeMessage(message);
  }, [t]);

  // Check if all data is loading
  const isLoading = loadingMoods || loadingStreak || loadingStats;

  // If no user is found, show generic dashboard content
  if (!user) {
    return (
      <AppLayout>
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>{t('dashboard.welcomeGeneric')}</h1>
            <p>{t('dashboard.pleaseLogin')}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show loading screen while data is being fetched
  if (isLoading) {
    return (
      <AppLayout>
        <LoadingScreen message={t('dashboard.loading')} />
      </AppLayout>
    );
  }

  // Extract data
  const moods = moodData?.userMoods || [];
  const streak = streakData?.moodStreak || 0;
  const stats = statsData?.userStats || {
    sentHugs: 0,
    receivedHugs: 0,
    totalMoods: 0
  };

  // Get latest mood if available
  const latestMood = moods.length > 0 ? moods[0] : null;
  
  return (
    <AppLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>{welcomeMessage}, {user.name || user.username}!</h1>
          <p>{t('dashboard.checkinPrompt')}</p>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{t('dashboard.currentStreak')}</h3>
            <div className="stat-value">{streak}</div>
            <p>{t('dashboard.daysTracked')}</p>
          </div>
          
          <div className="stat-card">
            <h3>{t('dashboard.totalMoods')}</h3>
            <div className="stat-value">{stats.totalMoods}</div>
            <p>{t('dashboard.moodsRecorded')}</p>
          </div>
          
          <div className="stat-card">
            <h3>{t('dashboard.hugActivity')}</h3>
            <div className="stat-value">{stats.receivedHugs}</div>
            <p>{t('dashboard.hugsReceived')}</p>
          </div>
        </div>
        
        <div className="dashboard-sections">
          {latestMood && (
            <div className="dashboard-section mood-section">
              <h2>{t('dashboard.latestMood')}</h2>
              <div className="mood-card">
                <div className="mood-score-display">
                  <span className="mood-number">{latestMood.score}</span>
                  <span className="mood-label">
                    {latestMood.score > 7 
                      ? t('moods.great') 
                      : latestMood.score > 5 
                      ? t('moods.good') 
                      : latestMood.score > 3 
                      ? t('moods.okay') 
                      : t('moods.notGood')}
                  </span>
                </div>
                {latestMood.note && (
                  <div className="mood-note">
                    <p>{latestMood.note}</p>
                  </div>
                )}
                <div className="mood-date">
                  {new Date(latestMood.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
          
          <div className="dashboard-section suggestions-section">
            <h2>{t('dashboard.dailySuggestion')}</h2>
            <div className="suggestion-card">
              <p>{t('dashboard.suggestionText')}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;