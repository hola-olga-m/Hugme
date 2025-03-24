
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SocialLoginButtons = () => {
  const { loginWithGoogle, loginWithFacebook, loginWithApple } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
    } catch (error) {
      console.error('Apple login error:', error);
    }
  };

  return (
    <div className="social-login-buttons">
      <button 
        type="button"
        onClick={handleGoogleLogin}
        className="social-btn google-btn"
      >
        <i className="fab fa-google"></i>
        <span>Google</span>
      </button>
      
      <button 
        type="button"
        onClick={handleFacebookLogin}
        className="social-btn facebook-btn"
      >
        <i className="fab fa-facebook-f"></i>
        <span>Facebook</span>
      </button>
      
      <button 
        type="button"
        onClick={handleAppleLogin}
        className="social-btn apple-btn"
      >
        <i className="fab fa-apple"></i>
        <span>Apple</span>
      </button>
    </div>
  );
};

export default SocialLoginButtons;
