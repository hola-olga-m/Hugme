import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  // Get the current date in the format "Month Day, Year"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="legal-container">
      <div className="legal-header">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: {formattedDate}</p>
      </div>
      
      <div className="legal-content">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to HugMood ("we," "our," or "us"). At HugMood, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Service").
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
          </p>
        </section>
        
        <section>
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <p>We may collect the following personal information from you:</p>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, password, and profile picture.</li>
            <li><strong>Social Media Information:</strong> If you choose to connect your social media accounts, we may collect information from those accounts, such as your friends list, profile information, and activity.</li>
            <li><strong>User Content:</strong> Information you provide through the Service, including mood entries, messages, hug requests, and group hug invitations.</li>
            <li><strong>Transaction Information:</strong> If you purchase premium features, we collect payment information, billing address, and transaction history.</li>
          </ul>
          
          <h3>2.2 Automatically Collected Information</h3>
          <p>When you use our Service, we automatically collect certain information, including:</p>
          <ul>
            <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers, IP address, and mobile network information.</li>
            <li><strong>Usage Information:</strong> How you use our Service, including features you access, time spent, and interaction patterns.</li>
            <li><strong>Location Information:</strong> With your permission, we may collect precise location information from your device.</li>
            <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to enhance your experience and collect information about how you interact with our Service.</li>
          </ul>
        </section>
        
        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including:</p>
          <ul>
            <li>Providing, maintaining, and improving our Service</li>
            <li>Processing and fulfilling your requests, such as sending and receiving hugs</li>
            <li>Facilitating communication between users</li>
            <li>Personalizing your experience based on your mood history and preferences</li>
            <li>Processing payments and providing customer support</li>
            <li>Sending you important notifications and updates</li>
            <li>Conducting analytics and research to better understand how users interact with our Service</li>
            <li>Detecting, investigating, and preventing fraudulent transactions and unauthorized access</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>
        
        <section>
          <h2>4. Sharing Your Information</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul>
            <li><strong>With Other Users:</strong> Information you share with other users, such as mood updates, hugs, and group activities, will be visible to those users according to your privacy settings.</li>
            <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law, or if we believe that such action is necessary to comply with the law or to protect our rights or the safety of others.</li>
            <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
          </ul>
        </section>
        
        <section>
          <h2>5. Your Privacy Choices</h2>
          <p>You have several choices regarding your personal information:</p>
          <ul>
            <li><strong>Account Information:</strong> You can update your account information through the app settings.</li>
            <li><strong>Privacy Settings:</strong> You can adjust your privacy preferences to control who sees your mood updates and activities.</li>
            <li><strong>Marketing Communications:</strong> You can opt out of receiving promotional emails from us by following the instructions in those emails.</li>
            <li><strong>Push Notifications:</strong> You can choose to disable push notifications through your device settings.</li>
            <li><strong>Data Deletion:</strong> You can request deletion of your account and personal data by contacting us at privacy@hugmood.app.</li>
          </ul>
        </section>
        
        <section>
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>
        
        <section>
          <h2>7. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete such information as soon as possible.
          </p>
        </section>
        
        <section>
          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. If you are located outside the United States and choose to provide information to us, please be aware that we transfer the information to the United States and process it there.
          </p>
        </section>
        
        <section>
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>
        
        <section>
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <p className="contact-info">
            <strong>Email:</strong> privacy@hugmood.app<br />
            <strong>Address:</strong> HugMood Inc., 123 Emotion Street, Suite 456, San Francisco, CA 94103, USA
          </p>
        </section>
      </div>
      
      <div className="legal-footer">
        <p>
          By using HugMood, you consent to our Privacy Policy and agree to its terms.
        </p>
        <div className="legal-links">
          <Link to="/terms-of-service">Terms of Service</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/contact-support">Contact Support</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;