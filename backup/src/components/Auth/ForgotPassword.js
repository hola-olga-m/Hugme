import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setIsSubmitted(true);
        toast.success('Password reset instructions sent to your email');
      } else {
        toast.error(result.message || 'Failed to send reset instructions');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>Reset Password</h2>
        <p>Enter your email to receive password reset instructions</p>
      </div>

      {isSubmitted ? (
        <div className="auth-success-message">
          <i className="fas fa-check-circle"></i>
          <h3>Check Your Email</h3>
          <p>
            We've sent password reset instructions to <strong>{email}</strong>. Please check
            your inbox and follow the link to reset your password.
          </p>
          <p className="small-text">
            Don't see the email? Check your spam folder or{' '}
            <button 
              className="text-button" 
              onClick={() => setIsSubmitted(false)}
            >
              try again
            </button>
          </p>
          <Link to="/auth/login" className="auth-button">
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>
      )}

      <div className="auth-footer">
        <p>
          Remember your password?{' '}
          <Link to="/auth/login" className="auth-link">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;