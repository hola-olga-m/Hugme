#!/bin/bash

# Script to restore the comprehensive UI from the backup directory

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting restoration of comprehensive UI from backup...${NC}"

# Create a backup of the current version
echo -e "${YELLOW}Creating backup of current simplified UI...${NC}"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
mkdir -p hugmenow/web/src_simplified_backup_$TIMESTAMP

# Copy current version to backup
cp -r hugmenow/web/src/* hugmenow/web/src_simplified_backup_$TIMESTAMP/
echo -e "${GREEN}Backed up current UI to hugmenow/web/src_simplified_backup_$TIMESTAMP/${NC}"

# Create required directories for the comprehensive UI
echo -e "${YELLOW}Creating required directories...${NC}"
mkdir -p hugmenow/web/src/layouts
mkdir -p hugmenow/web/src/components/Settings
mkdir -p hugmenow/web/src/services

# List of core files to restore
echo -e "${YELLOW}Restoring core application files...${NC}"

# Move over the important infrastructure files
cp backup/src/App.js hugmenow/web/src/App.jsx
echo -e "${GREEN}Restored App.js to hugmenow/web/src/App.jsx${NC}"

# Copy styles if they exist
if [ -d "backup/src/styles" ]; then
  mkdir -p hugmenow/web/src/styles
  cp -r backup/src/styles/* hugmenow/web/src/styles/
  echo -e "${GREEN}Restored styles directory${NC}"
fi

# Copy over the theme context and service
cp backup/src/contexts/ThemeContext.js hugmenow/web/src/contexts/ThemeContext.jsx
echo -e "${GREEN}Restored ThemeContext.js to ThemeContext.jsx${NC}"

# Copy over the themeService
cp backup/src/services/themeService.js hugmenow/web/src/services/themeService.js
echo -e "${GREEN}Restored themeService.js${NC}"

# Copy over the layout components
echo -e "${YELLOW}Restoring layout components...${NC}"
cp -r backup/src/layouts/* hugmenow/web/src/layouts/
echo -e "${GREEN}Restored layout components${NC}"

# Copy over the settings components
echo -e "${YELLOW}Restoring settings components...${NC}"
cp -r backup/src/components/Settings/* hugmenow/web/src/components/Settings/
echo -e "${GREEN}Restored settings components${NC}"

# Create HugContext if it exists
if [ -f "backup/src/contexts/HugContext.js" ]; then
  cp backup/src/contexts/HugContext.js hugmenow/web/src/contexts/HugContext.jsx
  echo -e "${GREEN}Restored HugContext.js to HugContext.jsx${NC}"
fi

# Copy over the GraphQL app provider if it exists
if [ -f "backup/src/components/GraphQLAppProvider.js" ]; then
  cp backup/src/components/GraphQLAppProvider.js hugmenow/web/src/components/GraphQLAppProvider.jsx
  echo -e "${GREEN}Restored GraphQLAppProvider.js to GraphQLAppProvider.jsx${NC}"
fi

# Copy over the pages
echo -e "${YELLOW}Restoring page components...${NC}"
# Make sure files exist before copying
if [ -f "backup/src/pages/SettingsPage.js" ]; then
  cp backup/src/pages/SettingsPage.js hugmenow/web/src/pages/Settings.jsx
fi
if [ -f "backup/src/pages/MoodHistoryPage.js" ]; then
  cp backup/src/pages/MoodHistoryPage.js hugmenow/web/src/pages/MoodHistory.jsx
fi
if [ -f "backup/src/pages/MoodInsightsPage.js" ]; then
  cp backup/src/pages/MoodInsightsPage.js hugmenow/web/src/pages/MoodInsights.jsx
fi
if [ -f "backup/src/pages/HugSendPage.js" ]; then
  cp backup/src/pages/HugSendPage.js hugmenow/web/src/pages/HugSend.jsx
fi
if [ -f "backup/src/pages/HugReceivePage.js" ]; then
  cp backup/src/pages/HugReceivePage.js hugmenow/web/src/pages/HugReceive.jsx
fi
if [ -f "backup/src/pages/HugRequestPage.js" ]; then
  cp backup/src/pages/HugRequestPage.js hugmenow/web/src/pages/HugRequest.jsx
fi
if [ -f "backup/src/pages/GroupHugPage.js" ]; then
  cp backup/src/pages/GroupHugPage.js hugmenow/web/src/pages/GroupHug.jsx
fi
if [ -f "backup/src/pages/CommunityPage.js" ]; then
  cp backup/src/pages/CommunityPage.js hugmenow/web/src/pages/Community.jsx
fi
if [ -f "backup/src/pages/LandingPage.js" ]; then
  cp backup/src/pages/LandingPage.js hugmenow/web/src/pages/Landing.jsx
fi
if [ -f "backup/src/pages/AuthPage.js" ]; then
  cp backup/src/pages/AuthPage.js hugmenow/web/src/pages/Auth.jsx
fi
if [ -f "backup/src/pages/OnboardingPage.js" ]; then
  cp backup/src/pages/OnboardingPage.js hugmenow/web/src/pages/Onboarding.jsx
fi
if [ -f "backup/src/pages/ErrorPage.js" ]; then
  cp backup/src/pages/ErrorPage.js hugmenow/web/src/pages/Error.jsx
fi

echo -e "${GREEN}Restored page components${NC}"

# Fix imports to maintain application compatibility
echo -e "${YELLOW}Fixing import paths for compatibility...${NC}"
# Update all jsx file extensions in imports across the project
find hugmenow/web/src -type f -name "*.jsx" -exec sed -i 's/from "\.\.\/contexts\/ThemeContext"/from "\.\.\/contexts\/ThemeContext.jsx"/g' {} \;
find hugmenow/web/src -type f -name "*.jsx" -exec sed -i "s/from '\.\.\/contexts\/ThemeContext'/from '\.\.\/contexts\/ThemeContext.jsx'/g" {} \;

echo -e "${YELLOW}Checking for additional required services...${NC}"

# Copy GraphQL service if it exists
if [ -f "backup/src/services/graphqlService.js" ]; then
  cp backup/src/services/graphqlService.js hugmenow/web/src/services/graphqlService.js
  echo -e "${GREEN}Restored graphqlService.js${NC}"
fi

# Update package.json if needed for any dependencies
echo -e "${GREEN}UI restoration complete!${NC}"
echo -e "${YELLOW}You may need to manually adjust some imports and file paths to match the current project structure.${NC}"
echo -e "${YELLOW}Restart the application to see the changes.${NC}"