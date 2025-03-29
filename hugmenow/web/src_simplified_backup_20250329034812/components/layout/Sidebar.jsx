import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';

// Icons (you may replace these with actual icon components if available)
const DashboardIcon = () => <span>📊</span>;
const MoodIcon = () => <span>😊</span>;
const HugIcon = () => <span>🤗</span>;
const ProfileIcon = () => <span>👤</span>;
const SettingsIcon = () => <span>⚙️</span>;
const HistoryIcon = () => <span>📜</span>;
const InsightsIcon = () => <span>📈</span>;
const CommunityIcon = () => <span>👥</span>;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ isExpanded }) => (isExpanded ? '240px' : '70px')};
  height: 100%;
  background-color: ${({ theme }) => theme.sidebar.background};
  color: ${({ theme }) => theme.sidebar.text};
  transition: width 0.3s ease;
  overflow: hidden;
  border-right: 1px solid ${({ theme }) => theme.sidebar.border};
`;

const SidebarHeader = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: ${({ isExpanded }) => (isExpanded ? 'space-between' : 'center')};
  border-bottom: 1px solid ${({ theme }) => theme.sidebar.border};
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.sidebar.logoText};
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.sidebar.text};
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.sidebar.hoverText};
  }
`;

const SidebarLinks = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  flex: 1;
`;

const SidebarFooter = styled.div`
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.sidebar.border};
  display: flex;
  justify-content: center;
`;

const LinkGroup = styled.div`
  margin-bottom: 20px;
  
  h3 {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: ${({ theme }) => theme.sidebar.sectionTitle};
    margin: 10px 20px;
    opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: ${({ theme, active }) => (active ? theme.sidebar.activeText : theme.sidebar.text)};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: ${({ theme }) => theme.sidebar.hoverBackground};
    color: ${({ theme }) => theme.sidebar.hoverText};
  }
  
  ${({ active, theme }) => active && `
    background-color: ${theme.sidebar.activeBackground};
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background-color: ${theme.colors.primary};
    }
  `}
`;

const LinkIcon = styled.div`
  margin-right: ${({ isExpanded }) => (isExpanded ? '12px' : '0')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  min-width: 24px;
`;

const LinkText = styled.span`
  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
  transition: opacity 0.3s ease;
  white-space: nowrap;
`;

/**
 * Sidebar Component
 * Provides navigation and collapsible sidebar functionality
 */
const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <SidebarContainer isExpanded={isExpanded} theme={theme}>
      <SidebarHeader isExpanded={isExpanded}>
        {isExpanded && <Logo theme={theme}>HugMeNow</Logo>}
        <ToggleButton onClick={toggleSidebar} theme={theme}>
          {isExpanded ? '◀' : '▶'}
        </ToggleButton>
      </SidebarHeader>
      
      <SidebarLinks>
        <LinkGroup isExpanded={isExpanded}>
          {isExpanded && <h3 theme={theme}>Main</h3>}
          
          <NavLink to="/dashboard" active={isActive('/dashboard')} theme={theme}>
            <LinkIcon isExpanded={isExpanded}><DashboardIcon /></LinkIcon>
            <LinkText isExpanded={isExpanded}>Dashboard</LinkText>
          </NavLink>
          
          <NavLink to="/profile" active={isActive('/profile')} theme={theme}>
            <LinkIcon isExpanded={isExpanded}><ProfileIcon /></LinkIcon>
            <LinkText isExpanded={isExpanded}>Profile</LinkText>
          </NavLink>
        </LinkGroup>
        
        <LinkGroup isExpanded={isExpanded}>
          {isExpanded && <h3 theme={theme}>Mood</h3>}
          
          <NavLink to="/mood-tracker" active={isActive('/mood-tracker')} theme={theme}>
            <LinkIcon isExpanded={isExpanded}><MoodIcon /></LinkIcon>
            <LinkText isExpanded={isExpanded}>Mood Tracker</LinkText>
          </NavLink>
          
          <NavLink to="/mood-history" active={isActive('/mood-history')} theme={theme}>
            <LinkIcon isExpanded={isExpanded}><HistoryIcon /></LinkIcon>
            <LinkText isExpanded={isExpanded}>Mood History</LinkText>
          </NavLink>
          
          <NavLink to="/mood-insights" active={isActive('/mood-insights')} theme={theme}>
            <LinkIcon isExpanded={isExpanded}><InsightsIcon /></LinkIcon>
            <LinkText isExpanded={isExpanded}>Insights</LinkText>
          </NavLink>
        </LinkGroup>
        
        <LinkGroup isExpanded={isExpanded}>
          {isExpanded && <h3 theme={theme}>Hugs</h3>}
          
          <NavLink to="/hug-send" active={isActive('/hug-send')} theme={theme}>
            <LinkIcon isExpanded={isExpanded}><HugIcon /></LinkIcon>
            <LinkText isExpanded={isExpanded}>Send Hug</LinkText>
          </NavLink>
          
          <NavLink to="/hug-receive" active={isActive('/hug-receive')} theme={theme}>
            <LinkIcon isExpanded={isExpanded}><HugIcon /></LinkIcon>
            <LinkText isExpanded={isExpanded}>Received Hugs</LinkText>
          </NavLink>
          
          <NavLink to="/group-hug" active={isActive('/group-hug')} theme={theme}>
            <LinkIcon isExpanded={isExpanded}><CommunityIcon /></LinkIcon>
            <LinkText isExpanded={isExpanded}>Group Hugs</LinkText>
          </NavLink>
        </LinkGroup>
        
        <LinkGroup isExpanded={isExpanded}>
          {isExpanded && <h3 theme={theme}>Other</h3>}
          
          <NavLink to="/community" active={isActive('/community')} theme={theme}>
            <LinkIcon isExpanded={isExpanded}><CommunityIcon /></LinkIcon>
            <LinkText isExpanded={isExpanded}>Community</LinkText>
          </NavLink>
          
          <NavLink to="/settings" active={isActive('/settings')} theme={theme}>
            <LinkIcon isExpanded={isExpanded}><SettingsIcon /></LinkIcon>
            <LinkText isExpanded={isExpanded}>Settings</LinkText>
          </NavLink>
        </LinkGroup>
      </SidebarLinks>
      
      <SidebarFooter>
        {user && (
          <NavLink 
            to="#" 
            onClick={(e) => {
              e.preventDefault();
              logout();
            }} 
            theme={theme}
          >
            <LinkIcon isExpanded={isExpanded}>🚪</LinkIcon>
            {isExpanded && <LinkText isExpanded={isExpanded}>Log Out</LinkText>}
          </NavLink>
        )}
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;