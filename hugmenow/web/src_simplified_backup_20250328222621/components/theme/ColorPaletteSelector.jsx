import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  margin-bottom: 1rem;
  color: var(--gray-800);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .title-icon {
    color: var(--primary-color);
  }
`;

const Description = styled.p`
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const PaletteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PaletteOption = styled.div`
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  transition: var(--transition-base);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
  
  ${props => props.selected && `
    box-shadow: 0 0 0 3px var(--primary-color);
  `}
  
  &::after {
    content: '✓';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 24px;
    height: 24px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: ${props => props.selected ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
  }
`;

const ColorStrip = styled.div`
  height: 25px;
  width: 100%;
  background-color: ${props => props.color};
`;

const PaletteName = styled.div`
  padding: 0.75rem;
  background-color: white;
  font-weight: 500;
  color: var(--gray-700);
  text-align: center;
  font-size: 0.9rem;
`;

const CustomizeSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
`;

const CustomizeSectionTitle = styled.h4`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
`;

const ColorPickerRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ColorPickerItem = styled.div`
  flex: 1;
  min-width: 200px;
  
  label {
    display: block;
    font-size: 0.9rem;
    color: var(--gray-700);
    margin-bottom: 0.5rem;
  }
  
  input[type="color"] {
    width: 100%;
    height: 40px;
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius-sm);
    padding: 2px;
    cursor: pointer;
    
    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    &::-webkit-color-swatch {
      border: none;
      border-radius: var(--border-radius-sm);
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`;

const ResetButton = styled(Button)`
  background-color: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  
  &:hover:not(:disabled) {
    background-color: var(--gray-100);
  }
`;

const MoodSection = styled.div`
  margin-top: 2rem;
`;

const MoodTitle = styled.h4`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
`;

const MoodSelector = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const MoodOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: var(--border-radius-md);
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--gray-200)'};
  background: white;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    border-color: var(--primary-light);
    transform: translateY(-3px);
  }
  
  .mood-emoji {
    font-size: 2rem;
  }
  
  .mood-label {
    font-size: 0.9rem;
    color: var(--gray-700);
    font-weight: 500;
  }
`;

// Predefined palette options
const colorPalettes = [
  {
    id: 'ocean',
    name: 'Ocean Calm',
    description: 'Serene blues and teals that evoke calm ocean vibes',
    colors: {
      primary: '#4A90E2',
      secondary: '#50E3C2',
      tertiary: '#F8E71C',
      success: '#7ED321',
      info: '#B8E986',
      warning: '#F5A623',
      danger: '#D0021B',
      background: '#F5F8FA',
      text: '#4A4A4A'
    }
  },
  {
    id: 'lavender',
    name: 'Lavender Fields',
    description: 'Relaxing purples and lavenders for a soothing experience',
    colors: {
      primary: '#9B51E0',
      secondary: '#BD10E0',
      tertiary: '#E5ACF9',
      success: '#7ED321',
      info: '#B8E986',
      warning: '#F5A623',
      danger: '#D0021B',
      background: '#F8F7FC',
      text: '#3E236E'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm oranges, pinks and purples that evoke a peaceful sunset',
    colors: {
      primary: '#FF9500',
      secondary: '#FF2D55',
      tertiary: '#5856D6',
      success: '#4CD964',
      info: '#34AADC',
      warning: '#FF9500',
      danger: '#FF3B30',
      background: '#FFF9F5',
      text: '#4A4A4A'
    }
  },
  {
    id: 'forest',
    name: 'Forest Retreat',
    description: 'Earthy greens and browns for a natural, grounded feeling',
    colors: {
      primary: '#2E7D32',
      secondary: '#8BC34A',
      tertiary: '#FFC107',
      success: '#4CAF50',
      info: '#B2EBF2',
      warning: '#FFB300',
      danger: '#F44336',
      background: '#F1F8E9',
      text: '#33691E'
    }
  },
  {
    id: 'moonlight',
    name: 'Moonlight',
    description: 'Dark blues and purples with silver accents for a calm night feeling',
    colors: {
      primary: '#3F51B5',
      secondary: '#7986CB',
      tertiary: '#E1BEE7',
      success: '#69F0AE',
      info: '#80D8FF',
      warning: '#FFD180',
      danger: '#FF5252',
      background: '#E8EAF6',
      text: '#1A237E'
    }
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Create your own custom color palette',
    colors: {
      primary: '#4A90E2',
      secondary: '#50E3C2',
      tertiary: '#F8E71C',
      success: '#7ED321',
      info: '#B8E986',
      warning: '#F5A623',
      danger: '#D0021B',
      background: '#FFFFFF',
      text: '#4A4A4A'
    }
  }
];

// Mood presets that automatically select an appropriate palette
const moodPresets = [
  { id: 'calm', label: 'Calm', emoji: '😌', paletteId: 'ocean' },
  { id: 'happy', label: 'Happy', emoji: '😊', paletteId: 'sunset' },
  { id: 'focused', label: 'Focused', emoji: '🧠', paletteId: 'moonlight' },
  { id: 'energized', label: 'Energized', emoji: '⚡', paletteId: 'lavender' },
  { id: 'relaxed', label: 'Relaxed', emoji: '🍃', paletteId: 'forest' }
];

const ColorPaletteSelector = ({ onSave, initialPalette = 'ocean' }) => {
  const [selectedPalette, setSelectedPalette] = useState(initialPalette);
  const [customColors, setCustomColors] = useState({...colorPalettes.find(p => p.id === 'custom').colors});
  const [selectedMood, setSelectedMood] = useState(null);
  
  useEffect(() => {
    // When a palette is selected, update the custom colors
    if (selectedPalette !== 'custom') {
      const palette = colorPalettes.find(p => p.id === selectedPalette);
      setCustomColors({...palette.colors});
    }
  }, [selectedPalette]);
  
  const handlePaletteSelect = (paletteId) => {
    setSelectedPalette(paletteId);
    setSelectedMood(null); // Clear mood selection when directly selecting a palette
  };
  
  const handleColorChange = (colorKey, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
    
    // If we're editing colors, automatically switch to custom palette
    if (selectedPalette !== 'custom') {
      setSelectedPalette('custom');
    }
  };
  
  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    const mood = moodPresets.find(m => m.id === moodId);
    if (mood) {
      setSelectedPalette(mood.paletteId);
    }
  };
  
  const handleSave = () => {
    const palette = selectedPalette === 'custom' 
      ? { id: 'custom', name: 'Custom', colors: customColors }
      : colorPalettes.find(p => p.id === selectedPalette);
    
    onSave(palette);
  };
  
  const handleReset = () => {
    setSelectedPalette('ocean');
    setCustomColors({...colorPalettes.find(p => p.id === 'custom').colors});
    setSelectedMood(null);
  };
  
  return (
    <Container>
      <Title>
        <span className="title-icon">🎨</span>
        Customize Color Palette
      </Title>
      <Description>
        Choose a calming color palette that matches your mood, or create your own custom palette.
      </Description>
      
      <MoodSection>
        <MoodTitle>How are you feeling today?</MoodTitle>
        <MoodSelector>
          {moodPresets.map((mood) => (
            <MoodOption 
              key={mood.id}
              selected={selectedMood === mood.id}
              onClick={() => handleMoodSelect(mood.id)}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </MoodOption>
          ))}
        </MoodSelector>
      </MoodSection>
      
      <PaletteGrid>
        {colorPalettes.map((palette) => (
          <PaletteOption 
            key={palette.id}
            selected={selectedPalette === palette.id}
            onClick={() => handlePaletteSelect(palette.id)}
            title={palette.description}
          >
            <ColorStrip color={palette.colors.primary} />
            <ColorStrip color={palette.colors.secondary} />
            <ColorStrip color={palette.colors.tertiary} />
            <PaletteName>{palette.name}</PaletteName>
          </PaletteOption>
        ))}
      </PaletteGrid>
      
      {selectedPalette === 'custom' && (
        <CustomizeSection>
          <CustomizeSectionTitle>Customize Your Palette</CustomizeSectionTitle>
          <ColorPickerRow>
            <ColorPickerItem>
              <label htmlFor="primary-color">Primary Color</label>
              <input 
                id="primary-color"
                type="color" 
                value={customColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
            </ColorPickerItem>
            <ColorPickerItem>
              <label htmlFor="secondary-color">Secondary Color</label>
              <input 
                id="secondary-color"
                type="color" 
                value={customColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
              />
            </ColorPickerItem>
            <ColorPickerItem>
              <label htmlFor="tertiary-color">Tertiary Color</label>
              <input 
                id="tertiary-color"
                type="color" 
                value={customColors.tertiary}
                onChange={(e) => handleColorChange('tertiary', e.target.value)}
              />
            </ColorPickerItem>
          </ColorPickerRow>
          
          <ColorPickerRow>
            <ColorPickerItem>
              <label htmlFor="success-color">Success Color</label>
              <input 
                id="success-color"
                type="color" 
                value={customColors.success}
                onChange={(e) => handleColorChange('success', e.target.value)}
              />
            </ColorPickerItem>
            <ColorPickerItem>
              <label htmlFor="warning-color">Warning Color</label>
              <input 
                id="warning-color"
                type="color" 
                value={customColors.warning}
                onChange={(e) => handleColorChange('warning', e.target.value)}
              />
            </ColorPickerItem>
            <ColorPickerItem>
              <label htmlFor="danger-color">Danger Color</label>
              <input 
                id="danger-color"
                type="color" 
                value={customColors.danger}
                onChange={(e) => handleColorChange('danger', e.target.value)}
              />
            </ColorPickerItem>
          </ColorPickerRow>
          
          <ColorPickerRow>
            <ColorPickerItem>
              <label htmlFor="background-color">Background Color</label>
              <input 
                id="background-color"
                type="color" 
                value={customColors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
              />
            </ColorPickerItem>
            <ColorPickerItem>
              <label htmlFor="text-color">Text Color</label>
              <input 
                id="text-color"
                type="color" 
                value={customColors.text}
                onChange={(e) => handleColorChange('text', e.target.value)}
              />
            </ColorPickerItem>
          </ColorPickerRow>
        </CustomizeSection>
      )}
      
      <ButtonRow>
        <ResetButton onClick={handleReset}>Reset to Default</ResetButton>
        <SaveButton onClick={handleSave}>Apply Colors</SaveButton>
      </ButtonRow>
    </Container>
  );
};

export default ColorPaletteSelector;