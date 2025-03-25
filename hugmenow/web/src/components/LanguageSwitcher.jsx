import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const LanguageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 1rem;
`;

const LanguageButton = styled.button`
  background: ${(props) => (props.active ? 'var(--color-primary)' : 'transparent')};
  color: ${(props) => (props.active ? 'white' : 'var(--color-text)')};
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.active ? 'var(--color-primary)' : 'var(--color-background-hover)')};
  }
`;

const Label = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

/**
 * Language Switcher component that allows users to switch between supported languages
 */
function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageContainer>
      <Label>{t('common.language')}:</Label>
      <LanguageButton
        active={currentLanguage === 'en'}
        onClick={() => changeLanguage('en')}
      >
        {t('common.english')}
      </LanguageButton>
      <LanguageButton
        active={currentLanguage === 'ru'}
        onClick={() => changeLanguage('ru')}
      >
        {t('common.russian')}
      </LanguageButton>
    </LanguageContainer>
  );
}

export default LanguageSwitcher;