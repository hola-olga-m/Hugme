import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { HugContext } from '../../contexts/HugContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playHapticFeedback } from '../../utils/haptics';

const SubmissionPortal = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    hugType: '',
    description: '',
    animationCode: '',
    animationType: 'css',
    isGroupHug: false
  });
  const [error, setError] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  
  const { user } = useContext(UserContext);
  const { getArtistSubmissions, createSubmission } = useContext(HugContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  // Load existing submissions
  useEffect(() => {
    const loadSubmissions = async () => {
      setIsLoading(true);
      try {
        const artistSubmissions = await getArtistSubmissions(user.id);
        setSubmissions(artistSubmissions);
      } catch (error) {
        console.error('Error loading submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubmissions();
  }, [user.id, getArtistSubmissions]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const toggleForm = () => {
    setShowForm(!showForm);
    setError('');
    setSubmissionStatus(null);
    
    if (!showForm) {
      // Reset form when opening
      setFormData({
        hugType: '',
        description: '',
        animationCode: '',
        animationType: 'css',
        isGroupHug: false
      });
    }
    
    playHapticFeedback('selection');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmissionStatus(null);
    
    if (!formData.hugType.trim()) {
      setError('Please enter a hug type name');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Please provide a description');
      return;
    }
    
    if (!formData.animationCode.trim()) {
      setError('Animation code is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const submissionData = {
        id: `submission_${Date.now()}`,
        artistId: user.id,
        ...formData,
        timestamp: Date.now(),
        status: 'pending'
      };
      
      await createSubmission(submissionData);
      
      // Add to local state
      setSubmissions(prev => [submissionData, ...prev]);
      
      // Show success status
      setSubmissionStatus('success');
      
      // Reset form
      setFormData({
        hugType: '',
        description: '',
        animationCode: '',
        animationType: 'css',
        isGroupHug: false
      });
      
      playHapticFeedback('success');
      
      // Close form after a delay
      setTimeout(() => {
        setShowForm(false);
        setSubmissionStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error creating submission:', error);
      setError('Failed to submit. Please try again.');
      setSubmissionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`submission-portal-container theme-${theme}`}>
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/profile')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Artist Portal</h1>
        <button 
          className="new-submission-button"
          onClick={toggleForm}
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
        </button>
      </header>
      
      {showForm ? (
        <div className="submission-form-container">
          <h2>Submit New Hug Animation</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          {submissionStatus === 'success' && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <p>Submission successful!</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="submission-form">
            <div className="form-group">
              <label htmlFor="hugType">Hug Type Name</label>
              <input
                type="text"
                id="hugType"
                name="hugType"
                value={formData.hugType}
                onChange={handleInputChange}
                placeholder="e.g., Butterfly Hug, Rainbow Hug"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your hug animation..."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="animationType">Animation Type</label>
              <select
                id="animationType"
                name="animationType"
                value={formData.animationType}
                onChange={handleInputChange}
              >
                <option value="css">CSS Animation</option>
                <option value="svg">SVG Animation</option>
                <option value="js">JavaScript Animation</option>
                <option value="ar">AR Experience</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="animationCode">Animation Code</label>
              <textarea
                id="animationCode"
                name="animationCode"
                value={formData.animationCode}
                onChange={handleInputChange}
                placeholder="Paste your animation code here..."
                className="code-input"
                required
              />
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isGroupHug"
                name="isGroupHug"
                checked={formData.isGroupHug}
                onChange={handleInputChange}
              />
              <label htmlFor="isGroupHug">Supports Group Hugs</label>
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span><i className="fas fa-spinner fa-spin"></i> Submitting...</span>
              ) : (
                <span>Submit Animation</span>
              )}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="submissions-intro">
            <div className="intro-icon">
              <i className="fas fa-paint-brush"></i>
            </div>
            <h2>Create and Share Hug Animations</h2>
            <p>Submit your custom hug animations to be featured in the app</p>
            <button className="create-submission-button" onClick={toggleForm}>
              <i className="fas fa-plus"></i> New Submission
            </button>
          </div>
          
          <div className="submissions-list">
            <h2>Your Submissions</h2>
            
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : submissions.length === 0 ? (
              <div className="no-submissions-message">
                <i className="fas fa-inbox"></i>
                <p>You haven't submitted any animations yet</p>
              </div>
            ) : (
              submissions.map(submission => (
                <div key={submission.id} className="submission-card">
                  <div className="submission-header">
                    <h3>{submission.hugType}</h3>
                    <div className={`submission-status ${submission.status}`}>
                      {submission.status === 'pending' && <i className="fas fa-clock"></i>}
                      {submission.status === 'approved' && <i className="fas fa-check-circle"></i>}
                      {submission.status === 'rejected' && <i className="fas fa-times-circle"></i>}
                      <span>{submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}</span>
                    </div>
                  </div>
                  
                  <div className="submission-details">
                    <p>{submission.description}</p>
                    <div className="submission-meta">
                      <div className="submission-type">
                        <i className="fas fa-code"></i>
                        {submission.animationType.toUpperCase()}
                      </div>
                      <div className="submission-date">
                        <i className="fas fa-calendar-alt"></i>
                        {new Date(submission.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="submission-guidelines">
            <h3>Submission Guidelines</h3>
            <ul>
              <li>Animations should be responsive and mobile-friendly</li>
              <li>Keep file sizes small for optimal performance</li>
              <li>AR experiences should work with standard web AR capabilities</li>
              <li>Follow our design language for consistent user experience</li>
              <li>All submissions are reviewed by our team before being published</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SubmissionPortal;
