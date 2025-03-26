import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

// Styled components
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--gray-100);
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
`;

const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--gray-600);
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-800);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 102, 255, 0.25);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: var(--danger-color);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
`;

const LoginFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  
  p {
    color: var(--gray-600);
    margin-bottom: 0.5rem;
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--gray-300);
  }
  
  span {
    padding: 0 0.75rem;
    color: var(--gray-600);
  }
`;

const AnonymousButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--gray-200);
  color: var(--gray-800);
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  margin-top: 1rem;
  
  &:hover {
    background-color: var(--gray-300);
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showAnonymousForm, setShowAnonymousForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login, anonymousLogin, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setFormError(error.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAnonymousLogin = async (e) => {
    e.preventDefault();
    
    if (!nickname) {
      setFormError('Please enter a nickname');
      return;
    }
    
    console.log('Starting anonymous login process with nickname:', nickname);
    setIsSubmitting(true);
    setFormError('');
    
    try {
      console.log('Calling anonymousLogin from AuthContext');
      const authData = await anonymousLogin(nickname);
      console.log('Anonymous login successful, received auth data:', JSON.stringify({
        ...authData,
        accessToken: authData.accessToken ? '[REDACTED]' : undefined,
        user: authData.user ? {
          ...authData.user,
          id: authData.user.id || '[MISSING ID]'
        } : null
      }));
      
      // Explicit navigation with state
      console.log('Attempting navigation to dashboard after successful login');
      navigate('/dashboard', { 
        replace: true,
        state: { 
          fromLogin: true,
          loginTime: new Date().toISOString()
        }
      });
      console.log('Navigation completed');
    } catch (error) {
      console.error('Anonymous login error:', error);
      setFormError(error.message || 'Failed to login anonymously');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen text="Checking authentication..." />;
  }
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginLogo>
          <h1>HugMeNow</h1>
          <p>Your emotional wellness companion</p>
        </LoginLogo>
        
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        
        {showAnonymousForm ? (
          <LoginForm onSubmit={handleAnonymousLogin}>
            <FormGroup>
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                required
              />
            </FormGroup>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Continue Anonymously'}
            </Button>
            
            <LoginFooter>
              <p>
                <a href="#" onClick={() => setShowAnonymousForm(false)}>
                  Back to login
                </a>
              </p>
            </LoginFooter>
          </LoginForm>
        ) : (
          <>
            <LoginForm onSubmit={handleLogin}>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </FormGroup>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </LoginForm>
            
            <OrDivider>
              <span>or</span>
            </OrDivider>
            
            <AnonymousButton 
              type="button" 
              onClick={() => setShowAnonymousForm(true)}
            >
              Continue Anonymously
            </AnonymousButton>
            
            <LoginFooter>
              <p>
                Don't have an account?{' '}
                <Link to="/register">Sign Up</Link>
              </p>
            </LoginFooter>
          </>
        )}
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;