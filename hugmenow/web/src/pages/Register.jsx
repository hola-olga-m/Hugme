import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

// Styled components
const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--gray-100);
`;

const RegisterCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
`;

const RegisterLogo = styled.div`
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

const RegisterForm = styled.form`
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

const RegisterFooter = styled.div`
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

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [nickname, setNickname] = useState('');
  const [showAnonymousForm, setShowAnonymousForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { register, anonymousLogin, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.name || !formData.password) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      await register({
        username: formData.username,
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setFormError(error.message || 'Registration failed');
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
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      await anonymousLogin(nickname);
      navigate('/dashboard');
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
    <RegisterContainer>
      <RegisterCard>
        <RegisterLogo>
          <h1>HugMeNow</h1>
          <p>Create your account</p>
        </RegisterLogo>
        
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        
        {showAnonymousForm ? (
          <RegisterForm onSubmit={handleAnonymousLogin}>
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
            
            <RegisterFooter>
              <p>
                <a href="#" onClick={() => setShowAnonymousForm(false)}>
                  Back to registration
                </a>
              </p>
            </RegisterFooter>
          </RegisterForm>
        ) : (
          <>
            <RegisterForm onSubmit={handleRegister}>
              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min. 6 characters)"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </FormGroup>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </RegisterForm>
            
            <OrDivider>
              <span>or</span>
            </OrDivider>
            
            <AnonymousButton 
              type="button" 
              onClick={() => setShowAnonymousForm(true)}
            >
              Continue Anonymously
            </AnonymousButton>
            
            <RegisterFooter>
              <p>
                Already have an account?{' '}
                <Link to="/login">Sign In</Link>
              </p>
            </RegisterFooter>
          </>
        )}
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;