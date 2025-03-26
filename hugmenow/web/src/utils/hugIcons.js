/**
 * Utility module for hug icons
 * Provides centralized access to all hug icon types
 */

// Import all hug SVG icons
import StandardHugIcon from '../assets/icons/StandardHug.svg';
import SupportiveHugIcon from '../assets/icons/SupportiveHug.svg';
import GroupHugIcon from '../assets/icons/GroupHug.svg';
import ComfortingHugIcon from '../assets/icons/ComfortingHug.svg';
import EnthusiasticHugIcon from '../assets/icons/EnthusiasticHug.svg';
import VirtualHugIcon from '../assets/icons/VirtualHug.svg';

/**
 * Object containing all hug icons mapped by their type
 */
export const HUG_ICONS = {
  standard: StandardHugIcon,
  supportive: SupportiveHugIcon,
  group: GroupHugIcon,
  comforting: ComfortingHugIcon,
  enthusiastic: EnthusiasticHugIcon,
  virtual: VirtualHugIcon
};

/**
 * Get hug icon by type
 * @param {string} type - Type of hug icon to retrieve
 * @returns {string} URL to the SVG icon
 */
export const getHugIconByType = (type) => {
  return HUG_ICONS[type] || HUG_ICONS.standard;
};

/**
 * Get all available hug types
 * @returns {Array<string>} Array of hug type names
 */
export const getHugTypes = () => {
  return Object.keys(HUG_ICONS);
};

/**
 * Get color associated with hug type
 * @param {string} type - Type of hug 
 * @returns {string} Hex color code
 */
export const getHugTypeColor = (type) => {
  const colors = {
    standard: '#FF6E40',
    supportive: '#FFA726',
    group: '#4CAF50',
    comforting: '#5C6BC0',
    enthusiastic: '#FDD835',
    virtual: '#AB47BC'
  };
  
  return colors[type] || colors.standard;
};

/**
 * Get display name for hug type
 * @param {string} type - Type of hug
 * @returns {string} Display name
 */
export const getHugTypeDisplayName = (type) => {
  const names = {
    standard: 'Standard Hug',
    supportive: 'Supportive Hug',
    group: 'Group Hug',
    comforting: 'Comforting Hug',
    enthusiastic: 'Enthusiastic Hug',
    virtual: 'Virtual Hug'
  };
  
  return names[type] || 'Unknown Hug Type';
};