import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

// Enhanced styled components with modern design
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: var(--spacing-md);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    var(--primary-lightest) 0%, 
    var(--background-color) 100%
  );
  
  &::before, &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    z-index: 0;
  }
  
  &::before {
    width: 30vw;
    height: 30vw;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    top: -8%;
    right: -8%;
    opacity: 0.05;
    animation: floatAnimation 15s ease-in-out infinite alternate;
    
    @keyframes floatAnimation {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(-30px, 30px) rotate(5deg); }
    }
  }
  
  &::after {
    width: 25vw;
    height: 25vw;
    background: linear-gradient(to right, var(--tertiary-color), var(--primary-color));
    bottom: -5%;
    left: -5%;
    opacity: 0.05;
    animation: floatAnimation2 10s ease-in-out infinite alternate-reverse;
    
    @keyframes floatAnimation2 {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(20px, -20px) rotate(-5deg); }
    }
  }
`;

const LoginCard = styled.div`
  position: relative;
  z-index: 1;
  background: var(--glassmorph-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  border-radius: var(--radius-xl);
  border: 1px solid var(--glassmorph-border);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.5s ease-out forwards;
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
  }
`;

const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s ease-in-out infinite;
    background-size: 200% 100%;
    
    @keyframes shimmer {
      0% { background-position: 100% 50%; }
      50% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
  }
  
  p {
    color: var(--text-tertiary);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    margin-top: var(--spacing-xs);
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-lg);
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  transition: color 0.3s ease;
  
  ${FormGroup}:focus-within & {
    color: var(--primary-color);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
  
  &::placeholder {
    color: var(--text-placeholder);
  }
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 3px var(--primary-alpha-10);
  }
  
  &:hover:not(:focus) {
    border-color: var(--input-border-hover);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(to right, var(--primary-dark), var(--primary-darkest));
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    background: var(--gray-400);
    cursor: not-allowed;
    box-shadow: none;
    
    &::before {
      display: none;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: var(--danger-alpha-10);
  color: var(--danger-dark);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  border-left: 4px solid var(--danger-color);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  
  &::before {
    content: "!";
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: var(--danger-color);
    border-radius: 50%;
    color: white;
    font-weight: bold;
    margin-right: var(--spacing-sm);
    flex-shrink: 0;
  }
`;

const LoginFooter = styled.div`
  text-align: center;
  margin-top: var(--spacing-lg);
  
  p {
    color: var(--text-tertiary);
    margin-bottom: var(--spacing-xs);
    font-size: var(--font-size-sm);
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    transition: all 0.3s ease;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: -2px;
      left: 0;
      background-color: var(--primary-color);
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      color: var(--primary-dark);
      
      &::after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
    }
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: var(--spacing-lg) 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--gray-200);
  }
  
  span {
    padding: 0 var(--spacing-md);
    color: var(--text-tertiary);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const AnonymousButton = styled.button`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: var(--spacing-md);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gray-100);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.5s ease;
  }
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--gray-300);
    
    &::before {
      transform: scaleX(1);
    }
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
      console.log('Starting regular login with email:', email);
      // Pass credentials as a proper loginInput object
      await login({
        email,
        password
      });
      
      console.log('Regular login successful, setting redirect flag');
      // Set flag for dashboard to know we're coming from login
      localStorage.setItem('redirectToDashboard', 'true');
      
      console.log('Navigating to dashboard after login');
      navigate('/dashboard', { 
        replace: true,
        state: { 
          fromLogin: true,
          loginTime: new Date().toISOString()
        }
      });
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
      const authData = await anonymousLogin({
        nickname: nickname
      });
      console.log('Anonymous login successful, received auth data:', JSON.stringify({
        ...authData,
        accessToken: authData.accessToken ? '[REDACTED]' : undefined,
        user: authData.user ? {
          ...authData.user,
          id: authData.user.id || '[MISSING ID]'
        } : null
      }));
      
      // Force refresh auth state and clear any cached routes
      console.log('Forcing auth state refresh before navigation');
      setTimeout(() => {
        // Explicit navigation with state and force reload
        console.log('Attempting navigation to dashboard after successful login');
        // First set a flag in localStorage to indicate we're coming from login
        localStorage.setItem('redirectToDashboard', 'true');
        
        // Then use navigate with replace to avoid back button issues
        navigate('/dashboard', { 
          replace: true,
          state: { 
            fromLogin: true,
            loginTime: new Date().toISOString()
          }
        });
        console.log('Navigation completed');
      }, 500); // Small delay to ensure state is fully updated
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