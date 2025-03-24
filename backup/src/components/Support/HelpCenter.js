import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const HelpCenter = () => {
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  
  // FAQ data
  const faqCategories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: 'fa-rocket',
      color: '#4DB380'
    },
    {
      id: 'hugs',
      name: 'Sending Hugs',
      icon: 'fa-hand-holding-heart',
      color: '#FF6B6B'
    },
    {
      id: 'mood',
      name: 'Mood Tracking',
      icon: 'fa-chart-line',
      color: '#46B3E6'
    },
    {
      id: 'account',
      name: 'Account & Privacy',
      icon: 'fa-user-shield',
      color: '#8A79AF'
    },
    {
      id: 'premium',
      name: 'Premium Features',
      icon: 'fa-crown',
      color: '#FFD700'
    },
    {
      id: 'technical',
      name: 'Technical Issues',
      icon: 'fa-wrench',
      color: '#6C757D'
    }
  ];
  
  // FAQ items
  const faqItems = {
    'getting-started': [
      {
        id: 'gs-1',
        question: 'What is HugMood?',
        answer: 'HugMood is a digital platform that combines mood tracking with virtual hugs, allowing users to connect emotionally with friends and loved ones, share their emotional state, and provide comfort through various types of virtual hugs.'
      },
      {
        id: 'gs-2',
        question: 'How do I set up my account?',
        answer: 'You can create an account using your email, or sign in with Google, Facebook, or Apple. Once registered, you can set up your profile, customize your theme, and start connecting with friends.'
      },
      {
        id: 'gs-3',
        question: 'Is there a way to try HugMood without creating an account?',
        answer: 'Yes! You can use Anonymous Mode to try the core features without creating an account. Your data will only be stored locally on your device and will be deleted when you log out.'
      },
      {
        id: 'gs-4',
        question: 'How do I add friends on HugMood?',
        answer: 'You can add friends by searching for their username, connecting your social media accounts to find friends who already use HugMood, or by sending invite links to your contacts.'
      }
    ],
    'hugs': [
      {
        id: 'hug-1',
        question: 'What are the different types of hugs?',
        answer: 'HugMood offers various types of hugs including Comfort Hugs, Celebration Hugs, Support Hugs, Energizing Hugs, Bear Hugs, Healing Hugs, and Friendship Hugs. Each type is designed for specific emotional contexts.'
      },
      {
        id: 'hug-2',
        question: 'How do I send a hug to someone?',
        answer: 'Go to the Send Hug page, select a recipient from your contacts, choose a hug type that matches your intention, add an optional message, and tap Send. The recipient will receive a notification about your hug.'
      },
      {
        id: 'hug-3',
        question: 'What are Group Hugs?',
        answer: 'Group Hugs let you send a virtual hug to multiple people at once. It\'s perfect for celebrating team achievements, supporting a group of friends, or sharing special moments with family members.'
      },
      {
        id: 'hug-4',
        question: 'What are AR Hugs?',
        answer: 'AR Hugs use Augmented Reality to bring virtual hugs into your physical space. When viewing an AR Hug, you can see animated hug effects overlaid on your real environment through your device\'s camera.'
      }
    ],
    'mood': [
      {
        id: 'mood-1',
        question: 'How does mood tracking work?',
        answer: 'HugMood allows you to log your mood throughout the day using emoji-based mood selection and intensity levels. You can view your mood patterns over time and get insights about your emotional wellbeing.'
      },
      {
        id: 'mood-2',
        question: 'Can I see my friends\' moods?',
        answer: 'Yes, if you follow each other and they\'ve enabled mood sharing. You can view your friends\' current moods in the Mood Following section, and you\'ll receive notifications if you\'ve enabled alerts for specific friends.'
      },
      {
        id: 'mood-3',
        question: 'What is Therapeutic Mode?',
        answer: 'Therapeutic Mode is a special feature designed for users experiencing depression or anxiety. It offers guided sessions, meditation exercises, and targeted comfort content to help improve mood during difficult times.'
      }
    ],
    'account': [
      {
        id: 'acc-1',
        question: 'How do I change my password?',
        answer: 'Go to Settings > Account > Security, then select "Change Password". You\'ll need to enter your current password and then your new password twice to confirm the change.'
      },
      {
        id: 'acc-2',
        question: 'Can I delete my account?',
        answer: 'Yes. Go to Settings > Account > Privacy, scroll down to the Account Deletion section, and follow the steps. Note that account deletion is permanent and all your data will be removed.'
      },
      {
        id: 'acc-3',
        question: 'What data does HugMood collect?',
        answer: 'HugMood collects profile information, mood data, interaction history, and device information to provide and improve the service. You can review our Privacy Policy for detailed information about data collection and usage.'
      }
    ],
    'premium': [
      {
        id: 'prem-1',
        question: 'What features are included in Premium?',
        answer: 'HugMood Premium includes exclusive hug types, advanced AR effects, detailed mood analytics, unlimited hug storage, priority support, and ad-free experience.'
      },
      {
        id: 'prem-2',
        question: 'How much does Premium cost?',
        answer: 'HugMood Premium is available as a monthly subscription at $4.99/month or an annual subscription at $49.99/year (saving you about 16%).'
      },
      {
        id: 'prem-3',
        question: 'Can I cancel my Premium subscription?',
        answer: 'Yes, you can cancel your subscription at any time. Go to Settings > Premium > Manage Subscription. Your Premium benefits will remain active until the end of your current billing period.'
      }
    ],
    'technical': [
      {
        id: 'tech-1',
        question: 'HugMood is crashing on my device. What should I do?',
        answer: 'First, try restarting the app. If that doesn\'t work, update to the latest version, clear the app cache, or restart your device. If the issue persists, please contact our support team.'
      },
      {
        id: 'tech-2',
        question: 'How can I enable notifications?',
        answer: 'On iOS, go to Settings > Notifications > HugMood and enable notifications. On Android, go to Settings > Apps > HugMood > Notifications and enable them. Within the app, go to Settings > Notifications to customize which types of notifications you receive.'
      },
      {
        id: 'tech-3',
        question: 'Can I use HugMood on multiple devices?',
        answer: 'Yes, you can use your HugMood account on multiple devices. Just sign in with the same credentials, and your data will sync across all your devices.'
      }
    ]
  };
  
  // Filter FAQ items based on search query
  const filteredFaqItems = searchQuery.trim() !== '' 
    ? Object.values(faqItems).flat().filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems[activeCategory] || [];
  
  return (
    <div className="help-center-container">
      <div className="help-center-header">
        <h1>Help Center</h1>
        <p>Find answers to common questions about using HugMood</p>
        
        <div className="help-search">
          <input
            type="text"
            placeholder="Search for help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-icon">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      
      {searchQuery.trim() === '' && (
        <div className="help-categories">
          {faqCategories.map(category => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              style={{ '--category-color': category.color }}
            >
              <i className={`fas ${category.icon}`}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      )}
      
      <div className="faq-container">
        {searchQuery.trim() !== '' && (
          <h2>Search Results for "{searchQuery}"</h2>
        )}
        
        {filteredFaqItems.length === 0 ? (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No results found</h3>
            <p>Try different keywords or browse our help categories</p>
            {searchQuery.trim() !== '' && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="faq-list">
            {filteredFaqItems.map(item => (
              <FaqItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      
      <div className="help-contact-section">
        <h2>Still need help?</h2>
        <p>If you couldn't find an answer to your question, our support team is ready to help you.</p>
        <Link to="/contact-support" className="primary-button">
          Contact Support
        </Link>
      </div>
    </div>
  );
};

// FAQ Item Component with expandable answer
const FaqItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`faq-item ${isExpanded ? 'expanded' : ''}`}>
      <div className="faq-question" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{item.question}</h3>
        <button className="expand-button">
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
        </button>
      </div>
      
      {isExpanded && (
        <div className="faq-answer">
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;