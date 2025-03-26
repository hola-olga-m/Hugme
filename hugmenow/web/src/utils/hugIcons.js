/**
 * Utility for accessing hug icons throughout the application
 * Provides consistent access to icon assets for all hug types
 */

// Import SVG icons
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
  standard: {
    icon: StandardHugIcon,
    name: 'Standard Hug',
    color: '#FFC107',
    description: 'A warm, friendly hug to show you care'
  },
  supportive: {
    icon: SupportiveHugIcon,
    name: 'Supportive Hug',
    color: '#FFA726',
    description: 'A reassuring hug when someone needs support'
  },
  group: {
    icon: GroupHugIcon,
    name: 'Group Hug',
    color: '#4CAF50',
    description: 'Bring everyone together with a group hug'
  },
  comforting: {
    icon: ComfortingHugIcon,
    name: 'Comforting Hug',
    color: '#5C6BC0',
    description: 'A gentle hug to comfort in difficult times'
  },
  enthusiastic: {
    icon: EnthusiasticHugIcon,
    name: 'Enthusiastic Hug',
    color: '#FF7043',
    description: 'An energetic hug to celebrate good news'
  },
  virtual: {
    icon: VirtualHugIcon,
    name: 'Virtual Hug',
    color: '#7E57C2',
    description: 'A digital hug across any distance'
  }
};

/**
 * Get hug icon by type
 * @param {string} type - Type of hug icon to retrieve
 * @returns {string} URL to the SVG icon
 */
export const getHugIconByType = (type) => {
  const hugType = type?.toLowerCase() || 'standard';
  return HUG_ICONS[hugType]?.icon || HUG_ICONS.standard.icon;
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
  const hugType = type?.toLowerCase() || 'standard';
  return HUG_ICONS[hugType]?.color || HUG_ICONS.standard.color;
};

/**
 * Get display name for hug type
 * @param {string} type - Type of hug
 * @returns {string} Display name
 */
export const getHugTypeDisplayName = (type) => {
  const hugType = type?.toLowerCase() || 'standard';
  return HUG_ICONS[hugType]?.name || HUG_ICONS.standard.name;
};

/**
 * Get description for hug type
 * @param {string} type - Type of hug
 * @returns {string} Description
 */
export const getHugTypeDescription = (type) => {
  const hugType = type?.toLowerCase() || 'standard';
  return HUG_ICONS[hugType]?.description || HUG_ICONS.standard.description;
};

export default {
  HUG_ICONS,
  getHugIconByType,
  getHugTypes,
  getHugTypeColor,
  getHugTypeDisplayName,
  getHugTypeDescription
};