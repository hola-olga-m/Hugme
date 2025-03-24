import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const SocialLogin = () => {
  const [isLoading, setIsLoading] = useState({
    google: false,
    facebook: false,
    apple: false
  });
  const [error, setError] = useState('');
  const { socialLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle social login callback
  useEffect(() => {
    const handleCallback = async () => {
      // Check if this is a social login callback by checking for 'code' or 'token' in URL
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const token = params.get('token');
      const provider = params.get('provider');
      const error = params.get('error');
      
      if (error) {
        setError(`Authentication failed: ${error}`);
        return;
      }
      
      if ((code || token) && provider) {
        try {
          setIsLoading(prev => ({ ...prev, [provider]: true }));
          
          // Process the social login callback
          const result = await socialLogin(provider, { code, token });
          
          // Redirect to dashboard on success
          navigate('/dashboard');
        } catch (err) {
          console.error(`${provider} login failed:`, err);
          setError(err.message || `${provider} login failed. Please try again.`);
          setIsLoading(prev => ({ ...prev, [provider]: false }));
        }
      }
    };
    
    handleCallback();
  }, [location, socialLogin, navigate]);
  
  const handleSocialLogin = async (provider) => {
    setError('');
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      // Get the auth URL for the selected provider
      const authUrl = await getSocialAuthUrl(provider);
      
      // Redirect to the provider's auth page
      window.location.href = authUrl;
    } catch (err) {
      console.error(`${provider} login initiation failed:`, err);
      setError(err.message || `Failed to start ${provider} login. Please try again.`);
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };
  
  const getSocialAuthUrl = async (provider) => {
    try {
      // Use GraphQL to get the auth URL
      const { getSocialAuthUrl } = await socialLogin(provider, { getUrl: true });
      return getSocialAuthUrl;
    } catch (error) {
      throw new Error(`Failed to get authentication URL for ${provider}`);
    }
  };
  
  return (
    <div className="social-login">
      {error && (
        <div className="auth-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      <div className="social-login-buttons">
        <button 
          className="social-button google" 
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading.google || isLoading.facebook || isLoading.apple}
        >
          {isLoading.google ? (
            <Loading type="spinner" size="small" />
          ) : (
            <>
              <i className="fab fa-google"></i>
              <span>Google</span>
            </>
          )}
        </button>
        
        <button 
          className="social-button facebook" 
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading.google || isLoading.facebook || isLoading.apple}
        >
          {isLoading.facebook ? (
            <Loading type="spinner" size="small" />
          ) : (
            <>
              <i className="fab fa-facebook-f"></i>
              <span>Facebook</span>
            </>
          )}
        </button>
        
        <button 
          className="social-button apple" 
          onClick={() => handleSocialLogin('apple')}
          disabled={isLoading.google || isLoading.facebook || isLoading.apple}
        >
          {isLoading.apple ? (
            <Loading type="spinner" size="small" />
          ) : (
            <>
              <i className="fab fa-apple"></i>
              <span>Apple</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;