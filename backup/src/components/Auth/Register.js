
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import SocialLoginButtons from './SocialLoginButtons';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
      
      if (name === 'password') {
        checkPasswordStrength(value);
      }
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;
    
    let strength = '';
    let score = 0;
    
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    
    if (score >= 6) strength = 'strong';
    else if (score >= 4) strength = 'medium';
    else strength = 'weak';
    
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { username, email, password, confirmPassword, displayName, agreeTerms } = formData;
    
    // Validate form
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordStrength === 'weak') {
      toast.warning('Please choose a stronger password');
      return;
    }
    
    if (!agreeTerms) {
      toast.warning('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await register({
        username,
        email,
        password,
        displayName: displayName || username
      });
      
      if (result.success) {
        toast.success('Registration successful! Welcome to HugMood!');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(result.error?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>Create an Account</h2>
        <p>Join HugMood to connect and share moments</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
            autoFocus
            minLength="3"
            maxLength="30"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            minLength="8"
          />
          {formData.password && (
            <div className={`password-strength ${passwordStrength}`}>
              <span>Password strength:</span> 
              <span className="strength-text">{passwordStrength}</span>
              <div className="strength-meter">
                <div className={`strength-meter-fill ${passwordStrength}`}></div>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
          {formData.password && formData.confirmPassword && 
           formData.password !== formData.confirmPassword && (
            <div className="password-match-error">
              Passwords do not match
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="displayName">Display Name (Optional)</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="How would you like to be addressed?"
            maxLength="50"
          />
        </div>

        <div className="form-checkbox">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            required
          />
          <label htmlFor="agreeTerms">
            I agree to the{' '}
            <Link to="/terms" target="_blank" className="terms-link">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" target="_blank" className="terms-link">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button 
          type="submit" 
          className={`auth-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-divider">
        <span>or sign up with</span>
      </div>
      
      <SocialLoginButtons />

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <Link to="/auth/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
