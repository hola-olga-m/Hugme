import React from 'react';
import Icon from './ui/IconComponent';

const HugIconTest = () => {
  const hugTypes = [
    'ComfortingHug',
    'EnthusiasticHug',
    'GroupHug',
    'StandardHug',
    'SupportiveHug',
    'VirtualHug',
    'RelaxingHug',
    'WelcomeHug',
    'FriendlyHug',
    'GentleHug',
    'FamilyHug',
    'SmilingHug'
  ];

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Hug Icon Test</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
        {hugTypes.map(hugType => (
          <div key={hugType} style={{ textAlign: 'center' }}>
            <Icon type={hugType} size={80} animate={false} />
            <p style={{ marginTop: '10px' }}>{hugType}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HugIconTest;