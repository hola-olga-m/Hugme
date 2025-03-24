import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const ContactSupport = () => {
  const { user } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    subject: '',
    category: '',
    message: '',
    attachmentFile: null,
    attachmentName: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Support request categories
  const categories = [
    { id: 'account', name: 'Account Issues' },
    { id: 'billing', name: 'Billing & Subscription' },
    { id: 'technical', name: 'Technical Problems' },
    { id: 'feature', name: 'Feature Request' },
    { id: 'bug', name: 'Bug Report' },
    { id: 'other', name: 'Other' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        attachmentFile: file,
        attachmentName: file.name
      }));
      setError('');
    }
  };
  
  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      attachmentFile: null,
      attachmentName: ''
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim() || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call API to submit support request
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
    } catch (err) {
      setError('Failed to submit support request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitSuccess) {
    return (
      <div className="contact-support-container">
        <div className="support-success">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>Support Request Submitted</h2>
          <p>Thank you for contacting HugMood support! Your request has been received.</p>
          <div className="support-ticket-info">
            <p>
              <strong>Subject:</strong> {formData.subject}
            </p>
            <p>
              <strong>Reference Number:</strong> SUP-{Date.now().toString().slice(-10)}
            </p>
            <p>
              <strong>Confirmation:</strong> A confirmation email has been sent to {formData.email}
            </p>
          </div>
          <p className="support-notice">
            Our support team will review your request and respond as soon as possible,
            typically within 24-48 hours during business days.
          </p>
          <div className="support-actions">
            <Link to="/" className="primary-button">
              Return to Home
            </Link>
            <Link to="/help" className="secondary-button">
              Back to Help Center
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="contact-support-container">
      <div className="support-header">
        <h1>Contact Support</h1>
        <p>
          Need help with HugMood? Fill out the form below and our support team will assist you.
          Please provide as much detail as possible to help us resolve your issue quickly.
        </p>
        <div className="support-contact-info">
          <div className="contact-method">
            <i className="fas fa-envelope"></i>
            <span>support@hugmood.app</span>
          </div>
          <div className="contact-method">
            <i className="fas fa-clock"></i>
            <span>Response Time: 24-48 hours</span>
          </div>
        </div>
      </div>
      
      <form className="support-form" onSubmit={handleSubmit}>
        {error && <div className="support-error">{error}</div>}
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Enter the subject of your request"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Describe your issue or question in detail"
            rows={6}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="attachment">Attachment (Optional)</label>
          <div className="file-upload-wrapper">
            {!formData.attachmentFile ? (
              <>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                />
                <div className="file-upload-placeholder">
                  <i className="fas fa-paperclip"></i>
                  <span>Drag a file here or click to browse</span>
                  <small>Max file size: 10MB</small>
                </div>
              </>
            ) : (
              <div className="file-preview">
                <i className="fas fa-file"></i>
                <span className="file-name">{formData.attachmentName}</span>
                <button
                  type="button"
                  className="remove-file"
                  onClick={handleRemoveFile}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
          <Link to="/help" className="secondary-button">
            Back to Help Center
          </Link>
        </div>
      </form>
      
      <div className="support-faq-section">
        <h2>Frequently Asked Questions</h2>
        <p>You might find an answer to your question in our Help Center:</p>
        <div className="quick-links">
          <Link to="/help?category=account" className="quick-link">
            <i className="fas fa-user-shield"></i>
            <span>Account & Privacy</span>
          </Link>
          <Link to="/help?category=premium" className="quick-link">
            <i className="fas fa-crown"></i>
            <span>Premium Features</span>
          </Link>
          <Link to="/help?category=technical" className="quick-link">
            <i className="fas fa-wrench"></i>
            <span>Technical Issues</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;