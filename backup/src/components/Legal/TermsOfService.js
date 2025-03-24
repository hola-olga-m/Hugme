import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  // Get the current date in the format "Month Day, Year"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="legal-container">
      <div className="legal-header">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: {formattedDate}</p>
      </div>
      
      <div className="legal-content">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to HugMood. These Terms of Service ("Terms") govern your access to and use of the HugMood mobile application and website (collectively, the "Service"), so please read them carefully before using the Service.
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use the Service.
          </p>
        </section>
        
        <section>
          <h2>2. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. If we make changes, we will provide notice by posting the updated Terms on our Service and updating the "Last Updated" date. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
          </p>
        </section>
        
        <section>
          <h2>3. Privacy</h2>
          <p>
            Your privacy is important to us. Our Privacy Policy describes how we collect, use, and share information about you when you use our Service. By using the Service, you consent to our collection and use of information as described in our Privacy Policy.
          </p>
        </section>
        
        <section>
          <h2>4. Account Registration</h2>
          <p>
            To access certain features of the Service, you may need to create an account. When you create an account, you must provide accurate and complete information. You are responsible for safeguarding your account password and for all activities that occur under your account.
          </p>
          <p>
            You agree to:
          </p>
          <ul>
            <li>Provide accurate and truthful information when creating your account</li>
            <li>Maintain the security of your account and password</li>
            <li>Promptly notify us if you discover any unauthorized use of your account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>
        </section>
        
        <section>
          <h2>5. User Conduct</h2>
          <p>
            When using our Service, you agree not to:
          </p>
          <ul>
            <li>Use the Service in any way that violates any applicable laws or regulations</li>
            <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity</li>
            <li>Attempt to gain unauthorized access to any part of the Service, other accounts, or computer systems</li>
            <li>Use the Service to harm, threaten, or harass other users</li>
            <li>Post or transmit any content that is obscene, offensive, threatening, or promotes illegal activities</li>
            <li>Upload or transmit viruses or any other malicious code</li>
            <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
            <li>Collect or store personal data about other users without their permission</li>
            <li>Use the Service for any commercial purposes without our prior written consent</li>
          </ul>
        </section>
        
        <section>
          <h2>6. User Content</h2>
          <p>
            Our Service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You retain all rights in, and are solely responsible for, the Content you post to the Service.
          </p>
          <p>
            By posting Content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such Content in connection with providing the Service.
          </p>
          <p>
            You represent and warrant that:
          </p>
          <ul>
            <li>You own the Content you post on the Service or have the right to post it</li>
            <li>The posting of your Content does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person</li>
          </ul>
        </section>
        
        <section>
          <h2>7. Premium Features and Payments</h2>
          <p>
            Some features of the Service may require payment of fees. If you choose to purchase premium features, you agree to pay all applicable fees as described on the Service.
          </p>
          <p>
            Subscription fees will be billed in advance on a recurring basis depending on the subscription plan you select. Subscriptions automatically renew for additional periods equal to the initial subscription period unless cancelled before the end of the current period.
          </p>
          <p>
            You may cancel your subscription at any time through your account settings or by contacting us. If you cancel, you will continue to have access to premium features until the end of your current billing period, but you will not receive a refund for the current billing period.
          </p>
        </section>
        
        <section>
          <h2>8. Intellectual Property Rights</h2>
          <p>
            The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of HugMood and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>
          <p>
            Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of HugMood.
          </p>
        </section>
        
        <section>
          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or delete your account through the app settings.
          </p>
        </section>
        
        <section>
          <h2>10. Limitation of Liability</h2>
          <p>
            In no event shall HugMood, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul>
            <li>Your access to or use of or inability to access or use the Service</li>
            <li>Any conduct or content of any third party on the Service</li>
            <li>Any content obtained from the Service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
        </section>
        
        <section>
          <h2>11. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>
          <p>
            HugMood does not warrant that the Service will function uninterrupted, secure, or available at any particular time or location, or that any errors or defects will be corrected.
          </p>
        </section>
        
        <section>
          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
        </section>
        
        <section>
          <h2>13. Dispute Resolution</h2>
          <p>
            Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the American Arbitration Association's rules. The arbitration shall take place in San Francisco, California, and shall be conducted in English.
          </p>
        </section>
        
        <section>
          <h2>14. Entire Agreement</h2>
          <p>
            These Terms constitute the entire agreement between you and HugMood regarding our Service and supersede any prior agreements we might have had between us regarding the Service.
          </p>
        </section>
        
        <section>
          <h2>15. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="contact-info">
            <strong>Email:</strong> terms@hugmood.app<br />
            <strong>Address:</strong> HugMood Inc., 123 Emotion Street, Suite 456, San Francisco, CA 94103, USA
          </p>
        </section>
      </div>
      
      <div className="legal-footer">
        <p>
          By continuing to access or use our Service, you acknowledge that you have read and understood these Terms of Service.
        </p>
        <div className="legal-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/contact-support">Contact Support</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;