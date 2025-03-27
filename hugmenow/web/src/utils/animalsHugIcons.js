/**
 * Utility for accessing animal-themed hug icons throughout the application
 * Provides consistent access to animal icon assets
 */

// Import SVG icons - Main Icons
import FoxHug from '../assets/icons/StandardHug.svg';
import BearHug from '../assets/icons/SupportiveHug.svg';
import HedgehogHug from '../assets/icons/ComfortingHug.svg';
import RabbitHug from '../assets/icons/GroupHug.svg';
import PenguinHug from '../assets/icons/EnthusiasticHug.svg';
import YinYangHug from '../assets/icons/VirtualHug.svg';

// Import additional animal hugs
import SlothHug from '../assets/icons/hug-icons/SlothHug.svg';
import PandaHug from '../assets/icons/hug-icons/PandaHug.svg';
import CatHug from '../assets/icons/hug-icons/CatHug.svg';
import UnicornHug from '../assets/icons/hug-icons/UnicornHug.svg';

/**
 * Object containing all animal-themed hug icons mapped by their type
 */
export const ANIMAL_HUG_ICONS = {
  fox: {
    icon: FoxHug,
    name: 'Fox Hug',
    color: '#FF8C00',
    description: 'A friendly fox hug for daily warmth'
  },
  bear: {
    icon: BearHug,
    name: 'Bear Hug',
    color: '#A67C52',
    description: 'A strong, supportive bear hug when times are tough'
  },
  hedgehog: {
    icon: HedgehogHug,
    name: 'Hedgehog Hug',
    color: '#A89383',
    description: 'A gentle, comforting hedgehog hug for emotional support'
  },
  rabbit: {
    icon: RabbitHug,
    name: 'Rabbit Hug',
    color: '#D4C1A9',
    description: 'A group rabbit hug to bring friends together'
  },
  penguin: {
    icon: PenguinHug,
    name: 'Penguin Hug',
    color: '#2D3E50',
    description: 'An enthusiastic penguin hug to celebrate good news'
  },
  yinyang: {
    icon: YinYangHug,
    name: 'Virtual Balance Hug',
    color: '#7E57C2',
    description: 'A digital hug representing balance and harmony across any distance'
  },
  sloth: {
    icon: SlothHug,
    name: 'Sloth Hug',
    color: '#9E8F7F',
    description: 'A slow, patient hug that lasts as long as you need'
  },
  panda: {
    icon: PandaHug,
    name: 'Panda Hug',
    color: '#333333',
    description: 'A cozy panda hug that brings calm and peace'
  },
  cat: {
    icon: CatHug,
    name: 'Cat Hug',
    color: '#333333',
    description: 'A playful and affectionate cat hug'
  },
  unicorn: {
    icon: UnicornHug,
    name: 'Unicorn Hug',
    color: '#A990E4',
    description: 'A magical unicorn hug to inspire wonder and joy'
  }
};

/**
 * Map the standard hug types to animal hugs for backwards compatibility
 */
export const STANDARD_TO_ANIMAL_MAP = {
  'standard': 'fox',
  'supportive': 'bear',
  'comforting': 'hedgehog',
  'group': 'rabbit',
  'enthusiastic': 'penguin',
  'virtual': 'yinyang'
};

/**
 * Get animal hug icon by type
 * @param {string} type - Type of animal hug icon to retrieve
 * @returns {string} URL to the SVG icon
 */
export const getAnimalHugIconByType = (type) => {
  const hugType = type?.toLowerCase() || 'fox';
  return ANIMAL_HUG_ICONS[hugType]?.icon || ANIMAL_HUG_ICONS.fox.icon;
};

/**
 * Convert standard hug type to animal hug type
 * @param {string} standardType - Standard hug type
 * @returns {string} Animal hug type
 */
export const convertToAnimalType = (standardType) => {
  const type = standardType?.toLowerCase() || 'standard';
  return STANDARD_TO_ANIMAL_MAP[type] || 'fox';
};

/**
 * Get all available animal hug types
 * @returns {Array<string>} Array of animal hug type names
 */
export const getAnimalHugTypes = () => {
  return Object.keys(ANIMAL_HUG_ICONS);
};

/**
 * Get color associated with animal hug type
 * @param {string} type - Type of animal hug 
 * @returns {string} Hex color code
 */
export const getAnimalHugTypeColor = (type) => {
  const hugType = type?.toLowerCase() || 'fox';
  return ANIMAL_HUG_ICONS[hugType]?.color || ANIMAL_HUG_ICONS.fox.color;
};

/**
 * Get display name for animal hug type
 * @param {string} type - Type of animal hug
 * @returns {string} Display name
 */
export const getAnimalHugTypeDisplayName = (type) => {
  const hugType = type?.toLowerCase() || 'fox';
  return ANIMAL_HUG_ICONS[hugType]?.name || ANIMAL_HUG_ICONS.fox.name;
};

/**
 * Get description for animal hug type
 * @param {string} type - Type of animal hug
 * @returns {string} Description
 */
export const getAnimalHugTypeDescription = (type) => {
  const hugType = type?.toLowerCase() || 'fox';
  return ANIMAL_HUG_ICONS[hugType]?.description || ANIMAL_HUG_ICONS.fox.description;
};

export default {
  ANIMAL_HUG_ICONS,
  STANDARD_TO_ANIMAL_MAP,
  getAnimalHugIconByType,
  convertToAnimalType,
  getAnimalHugTypes,
  getAnimalHugTypeColor,
  getAnimalHugTypeDisplayName,
  getAnimalHugTypeDescription
};