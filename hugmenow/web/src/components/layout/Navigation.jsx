import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';

// Icons using emoji for placeholder purposes 
// In a real implementation, these would be imported from a proper icon library
const HomeIcon = () => <span>🏠</span>;
const MoodIcon = () => <span>😊</span>;
const HugIcon = () => <span>🤗</span>;
const ProfileIcon = () => <span>👤</span>;
const SettingsIcon = () => <span>⚙️</span>;
const CommunityIcon = () => <span>👥</span>;
const LogoutIcon = () => <span>🚪</span>;

const NavbarContainer = styled.nav`
  background-color: ${({ theme }) => theme.navbar.background};
  color: ${({ theme }) => theme.navbar.text};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.navbar.logoText};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  span {
    margin-left: 0.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme, active }) => (active ? theme.navbar.activeText : theme.navbar.text)};
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  background-color: ${({ theme, active }) => (active ? theme.navbar.activeBackground : 'transparent')};
  
  &:hover {
    background-color: ${({ theme }) => theme.navbar.hoverBackground};
  }
  
  span {
    margin-right: 0.5rem;
  }
`;

const MobileMenuButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.navbar.text};
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.navbar.background};
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  color: ${({ theme, active }) => (active ? theme.navbar.activeText : theme.navbar.text)};
  text-decoration: none;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  background-color: ${({ theme, active }) => (active ? theme.navbar.activeBackground : 'transparent')};
  
  &:hover {
    background-color: ${({ theme }) => theme.navbar.hoverBackground};
  }
  
  span {
    margin-right: 0.75rem;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
`;

const UserName = styled.span`
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

/**
 * Navigation Component
 * Provides top navigation bar with responsive mobile menu
 */
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    return user.name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };
  
  return (
    <>
      <NavbarContainer theme={theme}>
        <Logo to="/" theme={theme}>
          <HugIcon />
          <span>HugMeNow</span>
        </Logo>
        
        <NavLinks>
          <NavLink to="/dashboard" active={isActive('/dashboard')} theme={theme}>
            <HomeIcon />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/mood-tracker" active={isActive('/mood-tracker')} theme={theme}>
            <MoodIcon />
            <span>Mood</span>
          </NavLink>
          
          <NavLink to="/hug-send" active={isActive('/hug-send')} theme={theme}>
            <HugIcon />
            <span>Hugs</span>
          </NavLink>
          
          <NavLink to="/community" active={isActive('/community')} theme={theme}>
            <CommunityIcon />
            <span>Community</span>
          </NavLink>
        </NavLinks>
        
        <UserSection>
          {isAuthenticated && (
            <>
              <UserAvatar theme={theme}>
                {getUserInitials()}
              </UserAvatar>
              <UserName>{user?.name || 'User'}</UserName>
              
              <NavLink to="/settings" active={isActive('/settings')} theme={theme}>
                <SettingsIcon />
              </NavLink>
              
              <NavLink to="#" onClick={(e) => {
                e.preventDefault();
                logout();
              }} theme={theme}>
                <LogoutIcon />
              </NavLink>
            </>
          )}
          
          {!isAuthenticated && (
            <NavLink to="/auth/login" active={isActive('/auth/login')} theme={theme}>
              Login
            </NavLink>
          )}
        </UserSection>
        
        <MobileMenuButton onClick={toggleMobileMenu} theme={theme}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </NavbarContainer>
      
      {isMobileMenuOpen && (
        <MobileMenu
          theme={theme}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <MobileNavLink to="/dashboard" active={isActive('/dashboard')} theme={theme} onClick={closeMobileMenu}>
            <HomeIcon />
            <span>Dashboard</span>
          </MobileNavLink>
          
          <MobileNavLink to="/mood-tracker" active={isActive('/mood-tracker')} theme={theme} onClick={closeMobileMenu}>
            <MoodIcon />
            <span>Mood Tracker</span>
          </MobileNavLink>
          
          <MobileNavLink to="/mood-history" active={isActive('/mood-history')} theme={theme} onClick={closeMobileMenu}>
            <MoodIcon />
            <span>Mood History</span>
          </MobileNavLink>
          
          <MobileNavLink to="/hug-send" active={isActive('/hug-send')} theme={theme} onClick={closeMobileMenu}>
            <HugIcon />
            <span>Send Hug</span>
          </MobileNavLink>
          
          <MobileNavLink to="/hug-receive" active={isActive('/hug-receive')} theme={theme} onClick={closeMobileMenu}>
            <HugIcon />
            <span>Received Hugs</span>
          </MobileNavLink>
          
          <MobileNavLink to="/community" active={isActive('/community')} theme={theme} onClick={closeMobileMenu}>
            <CommunityIcon />
            <span>Community</span>
          </MobileNavLink>
          
          <MobileNavLink to="/profile" active={isActive('/profile')} theme={theme} onClick={closeMobileMenu}>
            <ProfileIcon />
            <span>Profile</span>
          </MobileNavLink>
          
          <MobileNavLink to="/settings" active={isActive('/settings')} theme={theme} onClick={closeMobileMenu}>
            <SettingsIcon />
            <span>Settings</span>
          </MobileNavLink>
          
          {isAuthenticated && (
            <MobileNavLink 
              to="#" 
              onClick={(e) => {
                e.preventDefault();
                logout();
                closeMobileMenu();
              }} 
              theme={theme}
            >
              <LogoutIcon />
              <span>Logout</span>
            </MobileNavLink>
          )}
          
          {!isAuthenticated && (
            <MobileNavLink to="/auth/login" active={isActive('/auth/login')} theme={theme} onClick={closeMobileMenu}>
              <span>Login</span>
            </MobileNavLink>
          )}
        </MobileMenu>
      )}
    </>
  );
};

export default Navigation;