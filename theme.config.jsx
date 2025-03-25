import React from 'react';

const config = {
  logo: <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>🤗 HugMeNow</span>,
  project: {
    link: 'https://github.com/yourusername/hugmenow',
  },
  docsRepositoryBase: 'https://github.com/yourusername/hugmenow/blob/main',
  footer: {
    text: `© ${new Date().getFullYear()} HugMeNow - Emotional Wellness Platform`,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – HugMeNow'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="HugMeNow: Your emotional wellness platform for virtual support, mood tracking, and connecting with others" />
      <meta name="og:title" content="HugMeNow" />
    </>
  ),
  banner: {
    key: 'hugmenow-launch',
    text: <a href="#" target="_blank">🚀 HugMeNow is launching soon! Join our waitlist →</a>,
  },
  feedback: {
    content: null,
  },
  editLink: {
    text: null
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    titleComponent: ({ title, type }) => {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    }
  }
};

export default config;