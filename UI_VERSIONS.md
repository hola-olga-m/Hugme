# HugMeNow UI Versions

## Overview
HugMeNow has two distinct user interface implementations:

1. **Simplified UI** (Current version in `hugmenow/web/src/`)
   - Streamlined routing structure
   - Basic theme customization
   - Focused feature set

2. **Comprehensive UI** (Backup version in `backup/src/`)
   - Advanced routing with nested routes
   - Enhanced theme customization with mood-based themes
   - Additional features including:
     - Mood History & Insights
     - Accessibility Settings
     - More extensive hug-related features
     - Community page

## Key Differences

### Routing Structure
- **Simplified UI**: Flat routing structure with direct routes to pages
- **Comprehensive UI**: Nested routing with MainLayout wrapper for protected routes

### Theme Management
- **Simplified UI**: Basic theme customization (light/dark/color palettes)
- **Comprehensive UI**: Advanced theme system with mood-based dynamic themes

### Accessibility
- **Simplified UI**: Basic accessibility support
- **Comprehensive UI**: Comprehensive accessibility settings including text size, contrast mode, reduced motion, and screen reader optimization

### User Experience
- **Simplified UI**: Direct, streamlined UX focused on core functionality
- **Comprehensive UI**: Rich, personalized UX with more advanced mood-responsive interface

## Switching Between Versions
To restore the comprehensive UI version:

1. Run the provided utility script:
   ```
   ./restore-comprehensive-ui.sh
   ```

2. This will:
   - Create a backup of the current simplified UI
   - Copy the comprehensive UI components from the backup directory
   - Update imports and fix paths for compatibility

3. Restart the application to apply changes

## Development Notes
- Both versions share the same backend API and authentication system
- The comprehensive UI includes additional services and contexts
- When developing new features, consider compatibility with both UI versions