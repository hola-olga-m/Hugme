import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Styled components for the layout
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--background-color, #f8f9fa);
`;

const Sidebar = styled.aside`
  width: 260px;
  background-color: var(--sidebar-background, white);
  border-right: 1px solid var(--border-color, #eaeaea);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: 20px;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const NavHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color, #eaeaea);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-color, #333);
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: var(--primary-color, #635BFF);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0;
  flex: 1;
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color, #eaeaea);
  }
`;

const NavSectionTitle = styled.h3`
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: var(--text-secondary-color, #666);
  padding: 0 1.5rem;
  margin-bottom: 0.75rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1.5rem;
  color: ${props => props.active 
    ? 'var(--primary-color, #635BFF)' 
    : 'var(--text-color, #333)'};
  background-color: ${props => props.active 
    ? 'var(--primary-light-color, rgba(99, 91, 255, 0.1))' 
    : 'transparent'};
  text-decoration: none;
  font-weight: ${props => props.active ? '600' : '400'};
  border-left: 3px solid ${props => props.active 
    ? 'var(--primary-color, #635BFF)' 
    : 'transparent'};
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: var(--hover-color, #f0f0f0);
    color: ${props => props.active 
      ? 'var(--primary-color, #635BFF)' 
      : 'var(--text-color, #333)'};
  }
`;

const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Header = styled.header`
  height: 60px;
  border-bottom: 1px solid var(--border-color, #eaeaea);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background-color: var(--header-background, white);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-color, #333);
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-color, #333);
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--hover-color, #f0f0f0);
  }
`;

const UserDropdown = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  
  &:hover {
    background-color: var(--hover-color, #f0f0f0);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color, #635BFF);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const UserInfo = styled.div`
  text-align: left;
  display: none;
  
  @media (min-width: 576px) {
    display: block;
  }
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--text-color, #333);
  font-size: 0.9rem;
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary-color, #666);
`;

const ContentWrapper = styled.div`
  padding: 2rem;
  background-color: var(--container-background, white);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-height: calc(100vh - 140px);
`;

/**
 * MainLayout Component
 * Primary layout for authenticated users with sidebar navigation 
 */
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toggleDarkMode, isDarkMode } = useTheme();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Generate user avatar text from name
  const getAvatarText = () => {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };
  
  // Check if a nav link is active
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    if (path !== '/dashboard' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  return (
    <LayoutContainer>
      {/* Sidebar overlay (mobile only) */}
      <SidebarOverlay isOpen={sidebarOpen} onClick={closeSidebar} />
      
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen}>
        <NavHeader>
          <Logo to="/dashboard">
            <LogoIcon>H</LogoIcon>
            <span>HugMood</span>
          </Logo>
        </NavHeader>
        
        <NavLinks>
          <NavSection>
            <NavSectionTitle>Main</NavSectionTitle>
            <NavLink to="/dashboard" active={isActive('/dashboard')}>
              <NavIcon>📊</NavIcon>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/profile/me" active={isActive('/profile')}>
              <NavIcon>👤</NavIcon>
              <span>My Profile</span>
            </NavLink>
            <NavLink to="/settings" active={isActive('/settings')}>
              <NavIcon>⚙️</NavIcon>
              <span>Settings</span>
            </NavLink>
          </NavSection>
          
          <NavSection>
            <NavSectionTitle>Mood Tracking</NavSectionTitle>
            <NavLink to="/mood/track" active={isActive('/mood/track')}>
              <NavIcon>📝</NavIcon>
              <span>Track Mood</span>
            </NavLink>
            <NavLink to="/mood/history" active={isActive('/mood/history')}>
              <NavIcon>📅</NavIcon>
              <span>Mood History</span>
            </NavLink>
            <NavLink to="/mood/insights" active={isActive('/mood/insights')}>
              <NavIcon>💡</NavIcon>
              <span>Insights</span>
            </NavLink>
          </NavSection>
          
          <NavSection>
            <NavSectionTitle>Hug Features</NavSectionTitle>
            <NavLink to="/hug/send" active={isActive('/hug/send')}>
              <NavIcon>❤️</NavIcon>
              <span>Send a Hug</span>
            </NavLink>
            <NavLink to="/hug/receive" active={isActive('/hug/receive')}>
              <NavIcon>🤗</NavIcon>
              <span>Received Hugs</span>
            </NavLink>
            <NavLink to="/hug/request" active={isActive('/hug/request')}>
              <NavIcon>🙏</NavIcon>
              <span>Request a Hug</span>
            </NavLink>
            <NavLink to="/group-hug" active={isActive('/group-hug')}>
              <NavIcon>👥</NavIcon>
              <span>Group Hugs</span>
            </NavLink>
          </NavSection>
          
          <NavSection>
            <NavSectionTitle>Community</NavSectionTitle>
            <NavLink to="/community" active={isActive('/community')}>
              <NavIcon>🌍</NavIcon>
              <span>Community</span>
            </NavLink>
          </NavSection>
          
          <NavSection>
            <NavLink to="#" onClick={handleLogout}>
              <NavIcon>🚪</NavIcon>
              <span>Logout</span>
            </NavLink>
          </NavSection>
        </NavLinks>
      </Sidebar>
      
      {/* Main content area */}
      <MainContent>
        <Header>
          <MobileMenuButton onClick={toggleSidebar}>
            ☰
          </MobileMenuButton>
          
          <HeaderActions>
            <ThemeToggle onClick={toggleDarkMode} title="Toggle theme">
              {isDarkMode ? '🌞' : '🌙'}
            </ThemeToggle>
            
            <UserDropdown>
              <UserButton>
                <UserAvatar>{getAvatarText()}</UserAvatar>
                <UserInfo>
                  <UserName>{user?.name || 'User'}</UserName>
                  <UserRole>Member</UserRole>
                </UserInfo>
              </UserButton>
            </UserDropdown>
          </HeaderActions>
        </Header>
        
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;