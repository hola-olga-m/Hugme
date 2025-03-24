import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('');
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate token format (basic validation)
    if (token && !/^[a-zA-Z0-9_-]{10,}$/.test(token)) {
      setTokenValid(false);
    }
  }, [token]);

  const checkPasswordStrength = (password) => {
    if (!password) return '';

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

    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength === 'weak') {
      toast.warning('Your password is too weak. Please choose a stronger password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token, password);

      if (result.success) {
        setIsSuccess(true);
        toast.success('Password reset successful');
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } else {
        toast.error(result.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-form-container">
        <div className="auth-form-header">
          <h2>Reset Password</h2>
          <p>No reset token provided</p>
        </div>
        <div className="auth-error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>
            The password reset link is invalid or has expired. Please request a new password reset link.
          </p>
          <Link to="/auth/forgot-password" className="auth-button">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="auth-form-container">
        <div className="auth-form-header">
          <h2>Reset Password</h2>
          <p>Invalid reset token</p>
        </div>
        <div className="auth-error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>
            The password reset link is invalid or has expired. Please request a new password reset link.
          </p>
          <Link to="/auth/forgot-password" className="auth-button">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="auth-form-container">
        <div className="auth-form-header">
          <h2>Password Reset Complete</h2>
        </div>
        <div className="auth-success-message">
          <i className="fas fa-check-circle"></i>
          <p>
            Your password has been successfully reset. You will be redirected to the login page in a moment.
          </p>
          <Link to="/auth/login" className="auth-button">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>Reset Your Password</h2>
        <p>Please enter a new password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            required
            autoFocus
            minLength="8"
          />
          {password && (
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
          {password && confirmPassword && password !== confirmPassword && (
            <div className="password-match-error">
              Passwords do not match
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className={`auth-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

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

export default ResetPassword;