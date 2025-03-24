import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserGuide = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  
  return (
    <div className="user-guide-container">
      <header className="guide-header">
        <h1>HugMood User Guide</h1>
        <p>Learn how to use HugMood to connect with friends and track your emotional wellbeing.</p>
      </header>
      
      <div className="guide-content">
        <div className="guide-sidebar">
          <ul className="guide-navigation">
            <li 
              className={activeSection === 'getting-started' ? 'active' : ''}
              onClick={() => setActiveSection('getting-started')}
            >
              <i className="fas fa-rocket"></i>
              <span>Getting Started</span>
            </li>
            <li 
              className={activeSection === 'authentication' ? 'active' : ''}
              onClick={() => setActiveSection('authentication')}
            >
              <i className="fas fa-user-lock"></i>
              <span>Logging In</span>
            </li>
            <li 
              className={activeSection === 'mood-tracking' ? 'active' : ''}
              onClick={() => setActiveSection('mood-tracking')}
            >
              <i className="fas fa-chart-line"></i>
              <span>Mood Tracking</span>
            </li>
            <li 
              className={activeSection === 'sending-hugs' ? 'active' : ''}
              onClick={() => setActiveSection('sending-hugs')}
            >
              <i className="fas fa-hand-holding-heart"></i>
              <span>Sending Hugs</span>
            </li>
            <li 
              className={activeSection === 'receiving-hugs' ? 'active' : ''}
              onClick={() => setActiveSection('receiving-hugs')}
            >
              <i className="fas fa-inbox"></i>
              <span>Viewing Received Hugs</span>
            </li>
            <li 
              className={activeSection === 'group-hugs' ? 'active' : ''}
              onClick={() => setActiveSection('group-hugs')}
            >
              <i className="fas fa-users"></i>
              <span>Group Hugs</span>
            </li>
            <li 
              className={activeSection === 'following' ? 'active' : ''}
              onClick={() => setActiveSection('following')}
            >
              <i className="fas fa-user-friends"></i>
              <span>Following Friends</span>
            </li>
            <li 
              className={activeSection === 'settings' ? 'active' : ''}
              onClick={() => setActiveSection('settings')}
            >
              <i className="fas fa-cog"></i>
              <span>Settings & Privacy</span>
            </li>
            <li 
              className={activeSection === 'premium' ? 'active' : ''}
              onClick={() => setActiveSection('premium')}
            >
              <i className="fas fa-crown"></i>
              <span>Premium Features</span>
            </li>
            <li 
              className={activeSection === 'troubleshooting' ? 'active' : ''}
              onClick={() => setActiveSection('troubleshooting')}
            >
              <i className="fas fa-question-circle"></i>
              <span>Troubleshooting</span>
            </li>
          </ul>
        </div>
        
        <div className="guide-sections">
          {activeSection === 'getting-started' && (
            <section className="guide-section">
              <h2>Getting Started with HugMood</h2>
              
              <div className="guide-subsection">
                <h3>What is HugMood?</h3>
                <p>
                  HugMood is an emotional wellbeing app that helps you connect with friends and loved ones 
                  through virtual hugs, while tracking your mood patterns over time. With HugMood, you can:
                </p>
                <ul>
                  <li>Track your daily moods and emotional patterns</li>
                  <li>Send personalized virtual hugs to friends and family</li>
                  <li>Request hugs when you need emotional support</li>
                  <li>Create and participate in group hugs for shared experiences</li>
                  <li>Follow friends' moods to stay connected with their emotional state</li>
                </ul>
              </div>
              
              <div className="guide-subsection">
                <h3>App Navigation</h3>
                <p>
                  HugMood has a simple navigation structure to help you access all features easily:
                </p>
                <ul>
                  <li><strong>Home Screen:</strong> Your main dashboard with mood tracking and recent hugs</li>
                  <li><strong>Hug Center:</strong> Send, request, and manage hugs and group hugs</li>
                  <li><strong>Mood History:</strong> View your mood patterns and insights over time</li>
                  <li><strong>Contacts:</strong> Manage your friends and connections</li>
                  <li><strong>Profile:</strong> Update your personal information and achievements</li>
                  <li><strong>Settings:</strong> Customize your app experience and privacy controls</li>
                </ul>
                <p>
                  You can access these sections through the bottom navigation bar on mobile or the 
                  sidebar on larger screens.
                </p>
              </div>
              
              <div className="guide-tip">
                <i className="fas fa-lightbulb"></i>
                <div>
                  <h4>Pro Tip</h4>
                  <p>Take a few minutes to explore each section of the app when you first sign in. This will help you understand all the features available to you.</p>
                </div>
              </div>
            </section>
          )}
          
          {activeSection === 'authentication' && (
            <section className="guide-section">
              <h2>Logging Into HugMood</h2>
              
              <div className="guide-subsection">
                <h3>Creating an Account</h3>
                <p>To create a new HugMood account:</p>
                <ol>
                  <li>Visit the <Link to="/landing">HugMood landing page</Link></li>
                  <li>Click the "Sign Up" button in the top navigation</li>
                  <li>Enter your email address, choose a username, and create a secure password</li>
                  <li>Alternatively, use social login options (Google, Facebook, or Apple) for faster registration</li>
                  <li>Accept the Terms of Service and Privacy Policy</li>
                  <li>Click "Create Account" to complete registration</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Logging In to Your Account</h3>
                <p>To log in to your existing HugMood account:</p>
                <ol>
                  <li>Go to the <Link to="/login">Login page</Link></li>
                  <li>Enter your email address and password</li>
                  <li>Click "Log In" to access your account</li>
                  <li>Or use the "Log in with Google/Facebook/Apple" buttons if you created your account with social login</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Anonymous Mode</h3>
                <p>
                  If you want to try HugMood without creating an account, you can use Anonymous Mode:
                </p>
                <ol>
                  <li>On the login page, click "Try Anonymously"</li>
                  <li>Enter a nickname (optional) or use a randomly generated name</li>
                  <li>Start using the app with limited functionality</li>
                  <li>Later, you can convert your anonymous account to a permanent one if you wish</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Password Recovery</h3>
                <p>If you forget your password:</p>
                <ol>
                  <li>Click "Forgot Password?" on the login page</li>
                  <li>Enter the email address associated with your account</li>
                  <li>Check your email for a password reset link</li>
                  <li>Click the link and create a new password</li>
                </ol>
              </div>
              
              <div className="guide-tip">
                <i className="fas fa-exclamation-triangle"></i>
                <div>
                  <h4>Important Note</h4>
                  <p>HugMood will never email you asking for your password. If you receive such emails, they are likely phishing attempts.</p>
                </div>
              </div>
            </section>
          )}
          
          {activeSection === 'mood-tracking' && (
            <section className="guide-section">
              <h2>Tracking Your Mood</h2>
              
              <div className="guide-subsection">
                <h3>Logging Your Daily Mood</h3>
                <p>To log your mood in HugMood:</p>
                <ol>
                  <li>Go to the Home screen</li>
                  <li>Find the mood tracking panel at the top</li>
                  <li>Select the emoji that best represents how you're feeling</li>
                  <li>Use the slider to indicate the intensity of your emotion</li>
                  <li>Add optional notes about why you feel this way</li>
                  <li>Choose whether to share this mood with friends or keep it private</li>
                  <li>Click "Save" to record your mood</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Viewing Your Mood History</h3>
                <p>To see your mood patterns over time:</p>
                <ol>
                  <li>Navigate to "Mood History" from the main menu</li>
                  <li>You'll see a calendar view of your mood entries</li>
                  <li>Tap on a specific day to see details and notes</li>
                  <li>Switch to "Chart View" to see mood trends over weeks or months</li>
                  <li>Use the filter options to analyze specific emotions or time periods</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Mood Insights and Patterns</h3>
                <p>
                  After tracking your mood regularly for at least two weeks, HugMood will start to show you 
                  insights and patterns:
                </p>
                <ul>
                  <li>Weekly and monthly mood summaries</li>
                  <li>Identification of potential mood triggers</li>
                  <li>Correlations between activities and emotions</li>
                  <li>Suggestions for improving emotional wellbeing based on your patterns</li>
                </ul>
              </div>
              
              <div className="guide-tip">
                <i className="fas fa-lightbulb"></i>
                <div>
                  <h4>Pro Tip</h4>
                  <p>Try to log your mood at the same time each day for the most accurate patterns. Many users find that logging first thing in the morning or before bed works best.</p>
                </div>
              </div>
            </section>
          )}
          
          {activeSection === 'sending-hugs' && (
            <section className="guide-section">
              <h2>Sending Virtual Hugs</h2>
              
              <div className="guide-subsection">
                <h3>How to Send a Hug</h3>
                <p>Sending a virtual hug is simple:</p>
                <ol>
                  <li>Navigate to the "Send Hug" option from the main menu</li>
                  <li>Choose a recipient from your contacts list (search or scroll)</li>
                  <li>Select a hug type that matches the emotional context</li>
                  <li>Adjust the intensity of the hug if needed</li>
                  <li>Add a personal message (optional but recommended)</li>
                  <li>Click "Send Hug" to deliver it to your friend</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Types of Hugs</h3>
                <p>
                  HugMood offers different types of hugs for various emotional contexts:
                </p>
                <ul>
                  <li><strong>Comfort Hug:</strong> For when someone is sad or going through a hard time</li>
                  <li><strong>Celebration Hug:</strong> For congratulations and sharing joy</li>
                  <li><strong>Calming Hug:</strong> To help someone feeling anxious or stressed</li>
                  <li><strong>Grateful Hug:</strong> To express thanks and appreciation</li>
                  <li><strong>Friendship Hug:</strong> A casual hug to let someone know you're thinking of them</li>
                  <li><strong>Media Hugs:</strong> Special hugs featuring characters from movies and TV shows (Premium feature)</li>
                  <li><strong>AR Hugs:</strong> Immersive hugs with augmented reality elements (Premium feature)</li>
                </ul>
              </div>
              
              <div className="guide-subsection">
                <h3>Customizing Your Hugs</h3>
                <p>Make your hugs more personal by adding:</p>
                <ul>
                  <li>Custom messages with up to 200 characters</li>
                  <li>Voice notes (Premium feature)</li>
                  <li>Photos or GIFs (Premium feature)</li>
                  <li>Scheduling for future delivery (Premium feature)</li>
                </ul>
              </div>
              
              <div className="guide-subsection">
                <h3>Viewing Your Sent Hugs</h3>
                <p>To see hugs you've sent previously:</p>
                <ol>
                  <li>Go to your Profile</li>
                  <li>Select "Sent Hugs" from the menu</li>
                  <li>You'll see a list of all hugs you've sent, with delivery status</li>
                  <li>Tap on any hug to view details or replay the animation</li>
                </ol>
              </div>
              
              <div className="guide-tip">
                <i className="fas fa-lightbulb"></i>
                <div>
                  <h4>Pro Tip</h4>
                  <p>When someone is going through a difficult time, it's often better to send a series of smaller hugs over several days rather than one big hug. This shows consistent support.</p>
                </div>
              </div>
            </section>
          )}
          
          {activeSection === 'receiving-hugs' && (
            <section className="guide-section">
              <h2>Viewing Received Hugs</h2>
              
              <div className="guide-subsection">
                <h3>How to View Hugs You've Received</h3>
                <p>When someone sends you a hug:</p>
                <ol>
                  <li>You'll receive a notification on your device</li>
                  <li>Open the notification to view the hug immediately</li>
                  <li>Or go to your "Inbox" from the main menu to see all received hugs</li>
                  <li>Tap on any hug to see details and play the hug animation</li>
                  <li>You can reply with a thank you message or send a hug back</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Organizing Your Received Hugs</h3>
                <p>
                  You can organize your inbox of received hugs:
                </p>
                <ul>
                  <li>Filter by sender, date, or hug type</li>
                  <li>Mark special hugs as favorites to find them easily later</li>
                  <li>Archive hugs you want to keep but remove from your main inbox</li>
                  <li>Delete hugs you no longer want to keep</li>
                </ul>
              </div>
              
              <div className="guide-subsection">
                <h3>Replaying Hugs</h3>
                <p>
                  You can replay received hugs anytime:
                </p>
                <ol>
                  <li>Open the hug from your inbox</li>
                  <li>Tap the "Play" button to see the hug animation again</li>
                  <li>For AR hugs, tap "View in AR" to experience the immersive version</li>
                  <li>Premium users can download hugs to keep them permanently in their collection</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Responding to Received Hugs</h3>
                <p>
                  When you receive a hug, you can:
                </p>
                <ul>
                  <li>Send a thank you message with just one tap</li>
                  <li>Send a hug back by tapping "Return Hug"</li>
                  <li>Share the hug (if the sender allowed sharing) with others who might need it</li>
                  <li>React with an emoji to show how the hug made you feel</li>
                </ul>
              </div>
              
              <div className="guide-tip">
                <i className="fas fa-lightbulb"></i>
                <div>
                  <h4>Pro Tip</h4>
                  <p>Create a "Hug Journal" by saving hugs that had a significant positive impact on your mood. You can review these when you're feeling down to boost your spirits.</p>
                </div>
              </div>
            </section>
          )}
          
          {activeSection === 'group-hugs' && (
            <section className="guide-section">
              <h2>Creating and Joining Group Hugs</h2>
              
              <div className="guide-subsection">
                <h3>What are Group Hugs?</h3>
                <p>
                  Group hugs allow multiple people to participate in a shared hug experience. They're perfect for:
                </p>
                <ul>
                  <li>Celebrating achievements with a team or friend group</li>
                  <li>Supporting someone going through a difficult time</li>
                  <li>Marking special occasions like birthdays or holidays</li>
                  <li>Building community and connection among groups with shared interests</li>
                </ul>
              </div>
              
              <div className="guide-subsection">
                <h3>Creating a Group Hug</h3>
                <p>To create a new group hug:</p>
                <ol>
                  <li>Go to "Group Hugs" from the main menu</li>
                  <li>Tap "Create New Group Hug"</li>
                  <li>Select a hug type that matches the occasion</li>
                  <li>Enter a title and optional description for the group hug</li>
                  <li>Invite participants from your contacts list</li>
                  <li>Set an expiration time (how long the group will remain active)</li>
                  <li>Include an optional photo or theme (Premium feature)</li>
                  <li>Tap "Create Group Hug" to start</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Joining a Group Hug</h3>
                <p>When you're invited to a group hug:</p>
                <ol>
                  <li>You'll receive a notification on your device</li>
                  <li>Tap the notification to see details about the group hug</li>
                  <li>Choose "Join Group Hug" to participate</li>
                  <li>Add an optional message to share with the group</li>
                  <li>Tap "Send" to add your hug to the group</li>
                </ol>
                <p>
                  You can also find all group hugs you've been invited to in the "Group Hugs" section.
                </p>
              </div>
              
              <div className="guide-subsection">
                <h3>Interacting in Group Hugs</h3>
                <p>
                  Once you've joined a group hug, you can:
                </p>
                <ul>
                  <li>See who else has joined and read their messages</li>
                  <li>Send additional messages to the group</li>
                  <li>React to other participants' messages with emojis</li>
                  <li>Share photos (if enabled by the creator)</li>
                  <li>Invite additional friends (if permitted by the creator)</li>
                </ul>
              </div>
              
              <div className="guide-tip">
                <i className="fas fa-lightbulb"></i>
                <div>
                  <h4>Pro Tip</h4>
                  <p>Set up recurring group hugs for teams or friend groups to create a regular check-in routine. Weekly or monthly group hugs can help maintain connections even when everyone is busy.</p>
                </div>
              </div>
            </section>
          )}
          
          {activeSection === 'following' && (
            <section className="guide-section">
              <h2>Following Friends' Moods</h2>
              
              <div className="guide-subsection">
                <h3>Understanding Mood Following</h3>
                <p>
                  HugMood's unique "Follow Mood" feature allows you to stay connected with your friends' 
                  emotional wellbeing. When you follow someone's mood:
                </p>
                <ul>
                  <li>You'll see their mood updates in your "Following" feed</li>
                  <li>You can receive notifications when their mood changes significantly</li>
                  <li>You'll be better positioned to offer support when they might need it</li>
                </ul>
                <p>
                  This feature is designed with privacy in mind - friends only share what they choose to make public.
                </p>
              </div>
              
              <div className="guide-subsection">
                <h3>How to Follow Someone's Mood</h3>
                <p>To start following a friend's mood:</p>
                <ol>
                  <li>Go to their profile either from your contacts or by searching for them</li>
                  <li>Tap the "Follow Mood" button</li>
                  <li>Choose your notification preferences for their mood updates</li>
                  <li>The person will receive a notification that you're now following their mood</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Viewing Your Following Feed</h3>
                <p>To check on friends whose moods you follow:</p>
                <ol>
                  <li>Go to "Mood Following" from the main menu</li>
                  <li>You'll see a feed of recent mood updates from people you follow</li>
                  <li>Tap on anyone's entry to see more details or send them a hug</li>
                  <li>Use the filter options to sort by time, mood type, or specific friends</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Mood Notifications</h3>
                <p>
                  You can customize when you receive notifications about friends' moods:
                </p>
                <ul>
                  <li><strong>All Updates:</strong> Notify for every mood change</li>
                  <li><strong>Significant Changes:</strong> Only notify for major mood shifts</li>
                  <li><strong>Low Mood Alerts:</strong> Only notify when someone reports feeling sad, stressed, etc.</li>
                  <li><strong>No Notifications:</strong> Check the feed manually when you want</li>
                </ul>
                <p>
                  Adjust these settings by tapping the settings icon in the "Mood Following" section.
                </p>
              </div>
              
              <div className="guide-tip">
                <i className="fas fa-heart"></i>
                <div>
                  <h4>Empathy Tip</h4>
                  <p>When you notice a friend's mood has dipped, reach out thoughtfully. Sometimes just knowing someone noticed can make a big difference. Try sending a simple message like "I saw you're feeling down today. I'm here if you want to talk, or I can just send virtual hugs."</p>
                </div>
              </div>
            </section>
          )}
          
          {activeSection === 'settings' && (
            <section className="guide-section">
              <h2>Settings & Privacy</h2>
              
              <div className="guide-subsection">
                <h3>Account Settings</h3>
                <p>To manage your account settings:</p>
                <ol>
                  <li>Go to your Profile</li>
                  <li>Tap "Settings" in the menu</li>
                  <li>From here you can update:</li>
                  <ul>
                    <li>Your profile information and photo</li>
                    <li>Email address and password</li>
                    <li>Notification preferences</li>
                    <li>Language settings</li>
                    <li>Theme and appearance options</li>
                  </ul>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Privacy Controls</h3>
                <p>
                  HugMood gives you full control over your privacy:
                </p>
                <ul>
                  <li><strong>Mood Sharing:</strong> Choose who can see your mood updates (Everyone, Friends Only, No One)</li>
                  <li><strong>Profile Visibility:</strong> Control who can find and view your profile</li>
                  <li><strong>Follow Permissions:</strong> Decide who can follow your mood (Everyone, Friends Only, Approval Required)</li>
                  <li><strong>Hug Requests:</strong> Control who can send you hug requests</li>
                  <li><strong>Activity Status:</strong> Choose whether to show when you're online</li>
                  <li><strong>Data Usage:</strong> Manage how your data is used for recommendations and insights</li>
                </ul>
                <p>
                  Access these controls in Settings under "Privacy & Security."
                </p>
              </div>
              
              <div className="guide-subsection">
                <h3>Accessibility Settings</h3>
                <p>
                  HugMood is designed to be accessible to everyone:
                </p>
                <ul>
                  <li><strong>Text Size:</strong> Adjust the size of text throughout the app</li>
                  <li><strong>Contrast Mode:</strong> Enhance visual contrast for better readability</li>
                  <li><strong>Reduced Motion:</strong> Minimize animations for those with motion sensitivity</li>
                  <li><strong>Screen Reader Support:</strong> Full compatibility with screen readers</li>
                  <li><strong>Haptic Feedback:</strong> Customize the intensity of vibration feedback</li>
                </ul>
                <p>
                  Find these options in Settings under "Accessibility."
                </p>
              </div>
              
              <div className="guide-subsection">
                <h3>Data Management</h3>
                <p>
                  You can manage your data in HugMood:
                </p>
                <ul>
                  <li><strong>Export Data:</strong> Download a copy of all your mood entries and activity</li>
                  <li><strong>Clear History:</strong> Remove past mood entries or hug activity</li>
                  <li><strong>Account Deletion:</strong> Permanently delete your account and all associated data</li>
                </ul>
                <p>
                  These options are available in Settings under "Data & Privacy."
                </p>
              </div>
              
              <div className="guide-tip">
                <i className="fas fa-lock"></i>
                <div>
                  <h4>Security Tip</h4>
                  <p>We recommend setting up two-factor authentication for additional account security. You can enable this in the "Security" section of your settings.</p>
                </div>
              </div>
            </section>
          )}
          
          {activeSection === 'premium' && (
            <section className="guide-section">
              <h2>Premium Features</h2>
              
              <div className="guide-subsection">
                <h3>HugMood Premium Benefits</h3>
                <p>
                  Upgrading to HugMood Premium unlocks enhanced features:
                </p>
                <ul>
                  <li><strong>Advanced Mood Analytics:</strong> Detailed insights and pattern recognition</li>
                  <li><strong>Media Hugs:</strong> Send hugs featuring characters from movies and TV shows</li>
                  <li><strong>AR Hugs:</strong> Create immersive augmented reality hug experiences</li>
                  <li><strong>Voice & Video Messages:</strong> Add voice notes or short videos to your hugs</li>
                  <li><strong>Unlimited Hug Storage:</strong> Save all your sent and received hugs indefinitely</li>
                  <li><strong>Custom Themes:</strong> Access exclusive visual themes for your app</li>
                  <li><strong>Priority Support:</strong> Get faster responses from our support team</li>
                  <li><strong>Ad-Free Experience:</strong> Remove all advertisements</li>
                </ul>
              </div>
              
              <div className="guide-subsection">
                <h3>Subscription Options</h3>
                <p>
                  HugMood Premium is available as:
                </p>
                <ul>
                  <li><strong>Monthly Subscription:</strong> $4.99/month</li>
                  <li><strong>Annual Subscription:</strong> $39.99/year (Save 33%)</li>
                  <li><strong>Family Plan:</strong> $79.99/year for up to 6 family members</li>
                </ul>
                <p>
                  All plans include a 7-day free trial for new subscribers.
                </p>
              </div>
              
              <div className="guide-subsection">
                <h3>How to Upgrade</h3>
                <p>To upgrade to HugMood Premium:</p>
                <ol>
                  <li>Go to your Profile</li>
                  <li>Tap "Upgrade to Premium"</li>
                  <li>Select your preferred subscription plan</li>
                  <li>Complete the payment process</li>
                  <li>Premium features will be unlocked immediately</li>
                </ol>
              </div>
              
              <div className="guide-subsection">
                <h3>Managing Your Subscription</h3>
                <p>
                  You can manage your Premium subscription at any time:
                </p>
                <ul>
                  <li>View your current plan and renewal date</li>
                  <li>Change from monthly to annual (or vice versa)</li>
                  <li>Add family members to your Family Plan</li>
                  <li>Cancel auto-renewal to prevent future charges</li>
                </ul>
                <p>
                  Find these options in Settings under "Subscription."
                </p>
              </div>
              
              <div className="guide-tip">
                <i className="fas fa-gift"></i>
                <div>
                  <h4>Gift Premium</h4>
                  <p>You can gift HugMood Premium to friends or family. Look for the "Gift Premium" option in the Premium section to send someone a subscription for 1, 3, 6, or 12 months.</p>
                </div>
              </div>
            </section>
          )}
          
          {activeSection === 'troubleshooting' && (
            <section className="guide-section">
              <h2>Troubleshooting & FAQ</h2>
              
              <div className="guide-subsection">
                <h3>Common Issues</h3>
                
                <div className="faq-item">
                  <h4>I can't log in to my account</h4>
                  <p>
                    Try these steps:
                  </p>
                  <ol>
                    <li>Verify your internet connection is working</li>
                    <li>Double-check that you're using the correct email and password</li>
                    <li>Try the "Forgot Password" option to reset your password</li>
                    <li>If you use social login, ensure you're selecting the same method you used to create your account</li>
                    <li>Clear your browser cache/cookies and try again</li>
                    <li>If still unsuccessful, contact support with your account email</li>
                  </ol>
                </div>
                
                <div className="faq-item">
                  <h4>Hugs are not sending or being received</h4>
                  <p>
                    Troubleshooting steps:
                  </p>
                  <ol>
                    <li>Check your internet connection</li>
                    <li>Verify the recipient is in your contacts list</li>
                    <li>Ensure you haven't reached your daily hug limit (free accounts)</li>
                    <li>Try closing and reopening the app</li>
                    <li>Check if the recipient has blocked hug requests in their privacy settings</li>
                  </ol>
                </div>
                
                <div className="faq-item">
                  <h4>My mood history is not saving</h4>
                  <p>
                    Try these solutions:
                  </p>
                  <ol>
                    <li>Make sure you're tapping "Save" after entering your mood</li>
                    <li>Check your internet connection</li>
                    <li>Verify you're logged in to your account</li>
                    <li>Try logging out and back in</li>
                    <li>Update to the latest version of the app</li>
                  </ol>
                </div>
                
                <div className="faq-item">
                  <h4>The app is running slowly or crashing</h4>
                  <p>
                    Troubleshooting steps:
                  </p>
                  <ol>
                    <li>Close other apps running in the background</li>
                    <li>Restart your device</li>
                    <li>Clear the app cache (in device settings)</li>
                    <li>Ensure you have the latest version of the app</li>
                    <li>Check if your device meets the minimum requirements</li>
                    <li>If using the web version, try a different browser</li>
                  </ol>
                </div>
              </div>
              
              <div className="guide-subsection">
                <h3>Frequently Asked Questions</h3>
                
                <div className="faq-item">
                  <h4>Is my data private and secure?</h4>
                  <p>
                    Yes, HugMood takes privacy and security seriously. Your mood data and personal information 
                    are encrypted and stored securely. You control what is shared with friends through privacy 
                    settings. We never sell your personal data to third parties. For more details, please review 
                    our <Link to="/privacy-policy">Privacy Policy</Link>.
                  </p>
                </div>
                
                <div className="faq-item">
                  <h4>Can I use HugMood on multiple devices?</h4>
                  <p>
                    Yes, you can use your HugMood account on any number of devices. Simply log in with the same 
                    credentials, and your data will sync across all your devices. This includes phones, tablets, 
                    and the web version.
                  </p>
                </div>
                
                <div className="faq-item">
                  <h4>How do I find and add friends?</h4>
                  <p>
                    You can find friends several ways:
                  </p>
                  <ul>
                    <li>Search by username or email</li>
                    <li>Connect your contacts (with permission)</li>
                    <li>Link your social media accounts to find friends</li>
                    <li>Scan a friend's QR code in person</li>
                    <li>Send invite links via text, email, or social media</li>
                  </ul>
                </div>
                
                <div className="faq-item">
                  <h4>What's the difference between free and Premium?</h4>
                  <p>
                    Free accounts include basic mood tracking, standard hugs, and limited storage. 
                    Premium accounts unlock advanced analytics, media hugs, AR experiences, unlimited storage, 
                    voice messages, ad-free usage, and priority support. Compare plans in the 
                    "Premium" section of the app.
                  </p>
                </div>
                
                <div className="faq-item">
                  <h4>Can I delete my account and all my data?</h4>
                  <p>
                    Yes, you can delete your account and all associated data at any time. Go to Settings 
                    then Data &amp; Privacy then Delete Account. This action is permanent and cannot be undone. Your 
                    data will be completely removed from our servers according to our data retention policy.
                  </p>
                </div>
              </div>
              
              <div className="guide-subsection">
                <h3>Getting More Help</h3>
                <p>
                  If you need additional assistance:
                </p>
                <ul>
                  <li>Visit our <Link to="/help">Help Center</Link> for detailed articles and tutorials</li>
                  <li>Contact our support team through the <Link to="/contact-support">Support page</Link></li>
                  <li>Join our community forum to connect with other users and staff</li>
                  <li>Check our social media channels for announcements and quick tips</li>
                </ul>
              </div>
              
              <div className="guide-tip">
                <i className="fas fa-headset"></i>
                <div>
                  <h4>Support Hours</h4>
                  <p>Our support team is available Monday through Friday, 9am to 6pm ET. Premium members have access to extended support hours and priority response.</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      
      <div className="guide-actions">
        <Link to="/help" className="btn btn-outline">
          <i className="fas fa-arrow-left"></i> Back to Help Center
        </Link>
        <Link to="/contact-support" className="btn btn-primary">
          Need More Help? <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default UserGuide;