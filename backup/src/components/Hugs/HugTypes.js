import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../common/Loading';
import { playHapticFeedback } from '../../utils/haptics';
import { hugTypes, hugTypesByCategory } from '../../assets/hugTypes';

const HugTypes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Simulate loading delay
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Load favorites from localStorage (or in a real app, from an API)
      const savedFavorites = localStorage.getItem('favoriteHugTypes');
      
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    playHapticFeedback('selection');
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const toggleFavorite = (hugId) => {
    let newFavorites;
    
    if (favorites.includes(hugId)) {
      newFavorites = favorites.filter(id => id !== hugId);
    } else {
      newFavorites = [...favorites, hugId];
      playHapticFeedback('success');
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteHugTypes', JSON.stringify(newFavorites));
  };
  
  if (isLoading) {
    return <Loading text="Loading hug types..." />;
  }
  
  // Get list of categories
  const categories = ['all', ...Object.keys(hugTypesByCategory)];
  
  // Filter hug types based on selected category and search query
  const filteredHugTypes = Object.entries(hugTypes)
    .filter(([id, hug]) => {
      // Filter by category
      if (selectedCategory !== 'all' && hug.category !== selectedCategory) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          hug.name.toLowerCase().includes(query) ||
          hug.description.toLowerCase().includes(query) ||
          hug.category.toLowerCase().includes(query) ||
          hug.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .map(([id, hug]) => ({ id, ...hug }));
  
  // Sort filtered hugs: favorites first, then alphabetically
  const sortedHugTypes = [...filteredHugTypes].sort((a, b) => {
    // Put favorites at the top
    const aIsFavorite = favorites.includes(a.id);
    const bIsFavorite = favorites.includes(b.id);
    
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    
    // Otherwise sort alphabetically
    return a.name.localeCompare(b.name);
  });
  
  return (
    <div className="hug-types-container">
      <div className="hug-types-header">
        <h1>Express Your Support</h1>
        <p className="subtitle">
          Choose from a variety of virtual hugs to connect with others
        </p>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search hug types..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <i className="fas fa-search search-icon"></i>
      </div>
      
      <div className="categories-container">
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category === 'all' ? 'All Hugs' : getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="hug-types-grid">
        {sortedHugTypes.length > 0 ? (
          sortedHugTypes.map(hug => (
            <div 
              key={hug.id} 
              className={`hug-type-card ${favorites.includes(hug.id) ? 'favorite' : ''}`}
            >
              <div className="hug-card-header">
                <div className="hug-icon" style={{ backgroundColor: hug.color || '#3498db' }}>
                  <i className={`fas fa-${hug.icon}`}></i>
                </div>
                <div className="hug-title">
                  <h3>{hug.name}</h3>
                  <span className="hug-category">{getCategoryLabel(hug.category)}</span>
                </div>
                <button 
                  className="favorite-button"
                  onClick={() => toggleFavorite(hug.id)}
                  aria-label={favorites.includes(hug.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <i className={`fas fa-${favorites.includes(hug.id) ? 'star' : 'star-o'}`}></i>
                </button>
              </div>
              
              <div className="hug-description">
                <p>{hug.description}</p>
              </div>
              
              <div className="hug-tags">
                {hug.tags.map(tag => (
                  <span key={tag} className="hug-tag">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="hug-card-actions">
                <Link 
                  to={`/hugs/send?type=${hug.id}`} 
                  className="send-hug-btn"
                >
                  <i className="fas fa-paper-plane"></i> Send This Hug
                </Link>
                <Link 
                  to={`/hugs/preview/${hug.id}`} 
                  className="preview-btn"
                >
                  <i className="fas fa-eye"></i> Preview
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-hugs-found">
            <div className="no-hugs-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No hugs found</h3>
            <p>
              Try different search terms or categories
            </p>
            <button 
              className="reset-search-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
      
      <div className="hug-types-footer">
        <div className="custom-hug-box">
          <div className="custom-hug-icon">
            <i className="fas fa-magic"></i>
          </div>
          <div className="custom-hug-content">
            <h3>Create Your Own Hug</h3>
            <p>Premium users can create custom hugs with personalized images, animations, and messages</p>
            <Link to="/premium" className="custom-hug-btn">
              <i className="fas fa-crown"></i> Unlock Premium
            </Link>
          </div>
        </div>
      </div>
      
      <div className="virality-feature">
        <div className="challenge-card">
          <div className="challenge-header">
            <div className="challenge-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h3>Hug Challenge</h3>
          </div>
          <div className="challenge-content">
            <p>Send 5 different types of hugs this week!</p>
            <p className="challenge-reward">Reward: Unlock exclusive animated hug & earn community badge</p>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '40%' }}></div>
              </div>
              <div className="progress-text">2/5 completed</div>
            </div>
            <button className="challenge-button">
              <i className="fas fa-share-alt"></i> Share Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get category label
function getCategoryLabel(category) {
  switch (category) {
    case 'emotional':
      return 'Emotional Support';
    case 'celebration':
      return 'Celebration';
    case 'comfort':
      return 'Comfort & Reassurance';
    case 'motivation':
      return 'Motivation';
    case 'friendship':
      return 'Friendship';
    case 'love':
      return 'Love & Affection';
    case 'healing':
      return 'Healing & Wellness';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

export default HugTypes;