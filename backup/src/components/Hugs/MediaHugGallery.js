import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';
import { playHapticFeedback } from '../../utils/haptics';
import { mediaHugs, mediaHugsByMood, getMediaHugsByMood, getPopularMediaHugs } from '../../assets/mediaHugs';

const MediaHugGallery = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const galleryRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMood, setSelectedMood] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ artist: '', mediaType: '', premium: false });
  const [activeTab, setActiveTab] = useState('discover'); // discover, favorites, artists
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [artists, setArtists] = useState([]);
  
  // load media items
  useEffect(() => {
    const loadMediaItems = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would call your API service
        // For now, we'll simulate a successful API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get all media hugs
        const allMediaItems = Object.entries(mediaHugs).reduce((acc, [category, items]) => {
          // Add category to each item
          const itemsWithCategory = Object.entries(items).map(([id, item]) => ({
            id,
            ...item,
            category
          }));
          
          return [...acc, ...itemsWithCategory];
        }, []);
        
        // Get featured items
        const featured = getPopularMediaHugs(6);
        
        // Get mock artists
        const mockArtists = [
          {
            id: 'artist1',
            name: 'Emma Richards',
            username: 'emma_creates',
            avatar: 'https://i.pravatar.cc/150?img=10',
            bio: 'Digital artist specializing in mood-enhancing visuals and animations',
            itemCount: 28,
            isVerified: true
          },
          {
            id: 'artist2',
            name: 'Marcus Wei',
            username: 'marcus_wei',
            avatar: 'https://i.pravatar.cc/150?img=11',
            bio: 'Sound designer creating calming audio experiences',
            itemCount: 42,
            isVerified: true
          },
          {
            id: 'artist3',
            name: 'Sophia Patel',
            username: 'ambienthugz',
            avatar: 'https://i.pravatar.cc/150?img=12',
            bio: 'Visual artist focused on creating peaceful, supportive imagery',
            itemCount: 17,
            isVerified: false
          },
          {
            id: 'artist4',
            name: 'James Torres',
            username: 'soundscape_james',
            avatar: 'https://i.pravatar.cc/150?img=13',
            bio: 'Composer creating personalized musical hugs',
            itemCount: 35,
            isVerified: true
          }
        ];
        
        // Get mock favorites from localStorage
        const savedFavorites = localStorage.getItem('favoriteMediaHugs');
        const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
        
        setMediaItems(allMediaItems);
        setFeaturedItems(featured);
        setFavorites(parsedFavorites);
        setArtists(mockArtists);
        
        // Calculate total pages
        setTotalPages(Math.ceil(allMediaItems.length / itemsPerPage));
      } catch (error) {
        console.error('Failed to load media gallery:', error);
        setError('Failed to load media gallery. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMediaItems();
  }, [itemsPerPage]);
  
  // Filtered media items
  const getFilteredItems = () => {
    let filtered = [...mediaItems];
    
    // Filter by tab
    if (activeTab === 'favorites') {
      filtered = filtered.filter(item => favorites.includes(item.id));
    } else if (activeTab === 'artists') {
      // In this mock version, we're not actually filtering by artists
      // In a real app, you would filter items created by the selected artist
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by mood
    if (selectedMood) {
      filtered = filtered.filter(item => item.moods && item.moods.includes(selectedMood));
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Filter by additional filters
    if (filters.artist) {
      filtered = filtered.filter(item => item.artist === filters.artist);
    }
    
    if (filters.mediaType) {
      filtered = filtered.filter(item => item.type === filters.mediaType);
    }
    
    if (filters.premium) {
      filtered = filtered.filter(item => item.isPremium);
    }
    
    return filtered;
  };
  
  // Get paginated items
  const getPaginatedItems = () => {
    const filtered = getFilteredItems();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    // Update total pages whenever filters change
    if (totalPages !== Math.ceil(filtered.length / itemsPerPage)) {
      setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
      
      // Reset to first page if current page is now out of bounds
      if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
        setCurrentPage(1);
      }
    }
    
    return filtered.slice(start, end);
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
    playHapticFeedback('selection');
  };
  
  const handleMoodChange = (mood) => {
    setSelectedMood(mood === selectedMood ? '' : mood);
    setCurrentPage(1); // Reset to first page on mood change
    playHapticFeedback('selection');
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page on tab change
    playHapticFeedback('selection');
  };
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedMood('');
    setSearchQuery('');
    setFilters({ artist: '', mediaType: '', premium: false });
    setCurrentPage(1);
    playHapticFeedback('impact');
  };
  
  const toggleFavorite = (itemId) => {
    let newFavorites;
    
    if (favorites.includes(itemId)) {
      newFavorites = favorites.filter(id => id !== itemId);
    } else {
      newFavorites = [...favorites, itemId];
      playHapticFeedback('success');
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteMediaHugs', JSON.stringify(newFavorites));
  };
  
  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
    playHapticFeedback('impact');
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // Scroll to top of gallery when changing pages
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleSendMediaHug = (item) => {
    navigate(`/hugs/send?type=media&mediaId=${item.id}`);
  };
  
  const renderArtistList = () => {
    return (
      <div className="artist-list">
        <div className="featured-artists">
          <h2>Featured Artists</h2>
          <div className="artist-grid">
            {artists.map(artist => (
              <div key={artist.id} className="artist-card">
                <div className="artist-header">
                  <div className="artist-avatar">
                    <img src={artist.avatar} alt={artist.name} />
                    {artist.isVerified && (
                      <div className="verified-badge" title="Verified Artist">
                        <i className="fas fa-check-circle"></i>
                      </div>
                    )}
                  </div>
                  <div className="artist-info">
                    <h3 className="artist-name">{artist.name}</h3>
                    <div className="artist-username">@{artist.username}</div>
                  </div>
                </div>
                
                <div className="artist-bio">{artist.bio}</div>
                
                <div className="artist-stats">
                  <div className="stat">
                    <i className="fas fa-image"></i> {artist.itemCount} items
                  </div>
                </div>
                
                <div className="artist-actions">
                  <button className="view-portfolio-btn">
                    <i className="fas fa-images"></i> View Portfolio
                  </button>
                  <button className="follow-btn">
                    <i className="fas fa-user-plus"></i> Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="artist-marketplace">
          <h2>Marketplace</h2>
          <p className="marketplace-info">
            Browse, purchase, and commission custom media hugs from our community of talented artists.
          </p>
          
          <div className="marketplace-actions">
            <Link to="/marketplace/browse" className="marketplace-btn browse">
              <i className="fas fa-store"></i> Browse Marketplace
            </Link>
            <Link to="/marketplace/commission" className="marketplace-btn commission">
              <i className="fas fa-paint-brush"></i> Commission Custom Hug
            </Link>
          </div>
          
          <div className="marketplace-apply">
            <h3>Are you an artist?</h3>
            <p>Join our community of creators and share your work with thousands of users.</p>
            <Link to="/artists/apply" className="apply-btn">
              <i className="fas fa-palette"></i> Apply to Become a Creator
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  const renderGallery = () => {
    const paginatedItems = getPaginatedItems();
    const filteredCount = getFilteredItems().length;
    
    return (
      <div className="gallery-content" ref={galleryRef}>
        {activeTab === 'discover' && (
          <div className="featured-section">
            <h2>Featured Media</h2>
            <div className="featured-grid">
              {featuredItems.map(item => (
                <div 
                  key={item.id} 
                  className="featured-item"
                  onClick={() => openModal(item)}
                >
                  <div className="featured-thumbnail">
                    <img src={item.thumbnail} alt={item.title} />
                    <div className="media-type-badge">
                      <i className={`fas fa-${item.type === 'audio' ? 'music' : item.type === 'video' ? 'video' : 'image'}`}></i>
                    </div>
                  </div>
                  <div className="featured-info">
                    <h3>{item.title}</h3>
                    <div className="featured-creator">By {item.creator}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'artists' ? (
          renderArtistList()
        ) : (
          <>
            <div className="gallery-header">
              <h2>
                {activeTab === 'favorites' ? 'Your Favorites' : 'Media Hugs Gallery'}
                {filteredCount > 0 && <span className="item-count">({filteredCount} items)</span>}
              </h2>
              <button 
                className="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className={`fas fa-${showFilters ? 'times' : 'filter'}`}></i>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {(showFilters || selectedCategory !== 'all' || selectedMood || searchQuery || 
              filters.artist || filters.mediaType || filters.premium) && (
              <div className={`gallery-filters ${showFilters ? 'expanded' : ''}`}>
                {showFilters && (
                  <>
                    <div className="filter-row category-filter">
                      <div className="filter-label">Categories:</div>
                      <div className="filter-options">
                        <button 
                          className={`filter-option ${selectedCategory === 'all' ? 'active' : ''}`}
                          onClick={() => handleCategoryChange('all')}
                        >
                          All
                        </button>
                        {Object.keys(mediaHugs).map(category => (
                          <button 
                            key={category}
                            className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category)}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="filter-row mood-filter">
                      <div className="filter-label">Mood:</div>
                      <div className="filter-options">
                        {['happy', 'calm', 'inspired', 'reflective', 'energetic', 'peaceful'].map(mood => (
                          <button 
                            key={mood}
                            className={`filter-option mood-${mood} ${selectedMood === mood ? 'active' : ''}`}
                            onClick={() => handleMoodChange(mood)}
                          >
                            {mood.charAt(0).toUpperCase() + mood.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="filter-row type-filter">
                      <div className="filter-label">Media Type:</div>
                      <div className="filter-options">
                        <button 
                          className={`filter-option ${filters.mediaType === '' ? 'active' : ''}`}
                          onClick={() => handleFilterChange('mediaType', '')}
                        >
                          All
                        </button>
                        <button 
                          className={`filter-option ${filters.mediaType === 'image' ? 'active' : ''}`}
                          onClick={() => handleFilterChange('mediaType', 'image')}
                        >
                          <i className="fas fa-image"></i> Images
                        </button>
                        <button 
                          className={`filter-option ${filters.mediaType === 'audio' ? 'active' : ''}`}
                          onClick={() => handleFilterChange('mediaType', 'audio')}
                        >
                          <i className="fas fa-music"></i> Audio
                        </button>
                        <button 
                          className={`filter-option ${filters.mediaType === 'video' ? 'active' : ''}`}
                          onClick={() => handleFilterChange('mediaType', 'video')}
                        >
                          <i className="fas fa-video"></i> Videos
                        </button>
                      </div>
                    </div>
                    
                    <div className="filter-row premium-filter">
                      <div className="premium-toggle">
                        <label className="toggle-label">
                          <input
                            type="checkbox"
                            checked={filters.premium}
                            onChange={() => handleFilterChange('premium', !filters.premium)}
                          />
                          <span className="toggle-switch"></span>
                          <span>Premium Content Only</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="active-filters">
                  {(selectedCategory !== 'all' || selectedMood || searchQuery || 
                   filters.artist || filters.mediaType || filters.premium) && (
                    <div className="filter-tags">
                      <div className="tags-label">Active Filters:</div>
                      <div className="tags-list">
                        {selectedCategory !== 'all' && (
                          <div className="filter-tag">
                            Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                            <button onClick={() => handleCategoryChange('all')}><i className="fas fa-times"></i></button>
                          </div>
                        )}
                        
                        {selectedMood && (
                          <div className="filter-tag">
                            Mood: {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
                            <button onClick={() => handleMoodChange(selectedMood)}><i className="fas fa-times"></i></button>
                          </div>
                        )}
                        
                        {searchQuery && (
                          <div className="filter-tag">
                            Search: "{searchQuery}"
                            <button onClick={() => setSearchQuery('')}><i className="fas fa-times"></i></button>
                          </div>
                        )}
                        
                        {filters.mediaType && (
                          <div className="filter-tag">
                            Type: {filters.mediaType.charAt(0).toUpperCase() + filters.mediaType.slice(1)}
                            <button onClick={() => handleFilterChange('mediaType', '')}><i className="fas fa-times"></i></button>
                          </div>
                        )}
                        
                        {filters.premium && (
                          <div className="filter-tag">
                            Premium Only
                            <button onClick={() => handleFilterChange('premium', false)}><i className="fas fa-times"></i></button>
                          </div>
                        )}
                        
                        <button className="clear-filters-btn" onClick={clearFilters}>
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="search-bar">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search media hugs..."
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            
            {paginatedItems.length > 0 ? (
              <div className="media-grid">
                {paginatedItems.map(item => (
                  <div key={item.id} className="media-card">
                    <div 
                      className="media-thumbnail"
                      onClick={() => openModal(item)}
                    >
                      <img src={item.thumbnail} alt={item.title} />
                      <div className="media-overlay">
                        <div className="media-type">
                          <i className={`fas fa-${item.type === 'audio' ? 'music' : item.type === 'video' ? 'video' : 'image'}`}></i>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </div>
                        
                        {item.isPremium && (
                          <div className="premium-badge" title="Premium Content">
                            <i className="fas fa-crown"></i>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="media-info">
                      <div className="media-title-row">
                        <h3 className="media-title">{item.title}</h3>
                        <button 
                          className={`favorite-btn ${favorites.includes(item.id) ? 'favorited' : ''}`}
                          onClick={() => toggleFavorite(item.id)}
                          aria-label={favorites.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <i className={`fas fa-${favorites.includes(item.id) ? 'heart' : 'heart'}`}></i>
                        </button>
                      </div>
                      
                      <div className="media-category">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</div>
                      
                      <div className="media-creator">By {item.creator}</div>
                      
                      <div className="media-actions">
                        <button 
                          className="preview-btn"
                          onClick={() => openModal(item)}
                        >
                          <i className="fas fa-eye"></i> Preview
                        </button>
                        <button 
                          className="send-btn"
                          onClick={() => handleSendMediaHug(item)}
                        >
                          <i className="fas fa-paper-plane"></i> Send
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h3>No media hugs found</h3>
                <p>
                  {activeTab === 'favorites' ? 
                    'You haven\'t added any favorites yet.' : 
                    'Try adjusting your filters or search terms.'
                  }
                </p>
                {Object.keys(filters).some(key => filters[key]) || selectedCategory !== 'all' || selectedMood || searchQuery ? (
                  <button className="reset-filters-btn" onClick={clearFilters}>
                    Reset Filters
                  </button>
                ) : null}
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn previous"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    
                    // Show first page, last page, current page, and one page before and after current
                    if (
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      pageNum === currentPage || 
                      pageNum === currentPage - 1 || 
                      pageNum === currentPage + 1
                    ) {
                      return (
                        <button 
                          key={pageNum}
                          className={`page-num ${pageNum === currentPage ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === 2 && currentPage > 3) || 
                      (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      // Show ellipsis
                      return <span key={pageNum} className="page-ellipsis">...</span>;
                    }
                    
                    return null;
                  })}
                </div>
                
                <button 
                  className="page-btn next"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };
  
  const renderMediaModal = () => {
    if (!selectedItem) return null;
    
    return (
      <div className={`media-modal ${showModal ? 'active' : ''}`}>
        <div className="modal-overlay" onClick={closeModal}></div>
        <div className="modal-content">
          <button className="close-modal-btn" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </button>
          
          <div className="modal-header">
            <h2>{selectedItem.title}</h2>
            <div className="modal-creator">By {selectedItem.creator}</div>
          </div>
          
          <div className="modal-body">
            <div className="media-preview">
              {selectedItem.type === 'image' && (
                <img src={selectedItem.content || selectedItem.thumbnail} alt={selectedItem.title} />
              )}
              
              {selectedItem.type === 'video' && (
                <div className="video-container">
                  <video 
                    src={selectedItem.content} 
                    poster={selectedItem.thumbnail}
                    controls
                  ></video>
                </div>
              )}
              
              {selectedItem.type === 'audio' && (
                <div className="audio-container">
                  <div className="audio-artwork">
                    <img src={selectedItem.thumbnail} alt={selectedItem.title} />
                  </div>
                  <audio 
                    src={selectedItem.content} 
                    controls
                  ></audio>
                </div>
              )}
            </div>
            
            <div className="media-details">
              <div className="media-description">
                <h3>Description</h3>
                <p>{selectedItem.description}</p>
              </div>
              
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div className="media-tags">
                  <h3>Tags</h3>
                  <div className="tags-list">
                    {selectedItem.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedItem.moods && selectedItem.moods.length > 0 && (
                <div className="media-moods">
                  <h3>Moods</h3>
                  <div className="moods-list">
                    {selectedItem.moods.map(mood => (
                      <span key={mood} className={`mood mood-${mood}`}>{mood}</span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  className="send-media-btn"
                  onClick={() => handleSendMediaHug(selectedItem)}
                >
                  <i className="fas fa-paper-plane"></i> Send as Hug
                </button>
                
                <button 
                  className={`favorite-btn ${favorites.includes(selectedItem.id) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(selectedItem.id)}
                >
                  <i className={`fas fa-${favorites.includes(selectedItem.id) ? 'heart' : 'heart'}`}></i>
                  {favorites.includes(selectedItem.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return <Loading text="Loading media gallery..." />;
  }
  
  return (
    <div className="media-gallery-container">
      <div className="gallery-header-main">
        <h1>Media Hug Gallery</h1>
        <p className="subtitle">
          Discover and share visual and audio content to express support and connection
        </p>
      </div>
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      <div className="gallery-tabs">
        <button 
          className={`tab-button ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => handleTabChange('discover')}
        >
          <i className="fas fa-compass"></i> Discover
        </button>
        <button 
          className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => handleTabChange('favorites')}
        >
          <i className="fas fa-heart"></i> Favorites
          {favorites.length > 0 && (
            <span className="count-badge">{favorites.length}</span>
          )}
        </button>
        <button 
          className={`tab-button ${activeTab === 'artists' ? 'active' : ''}`}
          onClick={() => handleTabChange('artists')}
        >
          <i className="fas fa-palette"></i> Artists
        </button>
      </div>
      
      {renderGallery()}
      {renderMediaModal()}
      
      <div className="virality-feature">
        <div className="challenge-card">
          <div className="challenge-header">
            <div className="challenge-icon">
              <i className="fas fa-share-alt"></i>
            </div>
            <h3>Media Challenge</h3>
          </div>
          <div className="challenge-content">
            <p>Share 3 different media hugs this week to friends who need support!</p>
            <p className="challenge-reward">Reward: Unlock premium media hug content for one week</p>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '33%' }}></div>
              </div>
              <div className="progress-text">1/3 shared</div>
            </div>
            <button className="challenge-button">
              <i className="fas fa-medal"></i> View All Challenges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaHugGallery;