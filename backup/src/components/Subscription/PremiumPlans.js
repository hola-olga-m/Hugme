import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playHapticFeedback } from '../../utils/haptics';
import { showNotification } from '../../utils/notifications';

const PremiumPlans = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [upgradeComplete, setUpgradeComplete] = useState(false);
  
  const navigate = useNavigate();
  const { user, upgradeToPremium } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  
  // Premium plans
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 4.99,
      billing: 'month',
      features: [
        'Unlimited Media Hugs',
        'Premium Hug Animations',
        'Custom AR Effects',
        'No Ads',
        'Priority Support'
      ],
      popular: false
    },
    {
      id: 'annual',
      name: 'Annual',
      price: 39.99,
      billing: 'year',
      savings: '33%',
      features: [
        'Unlimited Media Hugs',
        'Premium Hug Animations',
        'Custom AR Effects',
        'No Ads',
        'Priority Support',
        'Artist Collaborations',
        'Group Hug Creation'
      ],
      popular: true
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: 99.99,
      billing: 'one-time',
      features: [
        'Unlimited Media Hugs',
        'Premium Hug Animations',
        'Custom AR Effects',
        'No Ads',
        'Priority Support',
        'Artist Collaborations',
        'Group Hug Creation',
        'Early Access to New Features',
        'Personal Hug Creator'
      ],
      popular: false
    }
  ];
  
  // Payment methods
  const paymentMethods = [
    {
      id: 'creditcard',
      name: 'Credit Card',
      icon: 'fa-credit-card'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'fa-paypal'
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      icon: 'fa-apple-pay'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: 'fa-google-pay'
    }
  ];
  
  // Handle plan selection
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    playHapticFeedback('selection');
  };
  
  // Handle payment method selection
  const handleSelectPayment = (method) => {
    setPaymentMethod(method);
    playHapticFeedback('selection');
  };
  
  // Show payment confirmation
  const showPaymentConfirmation = () => {
    if (!selectedPlan || !paymentMethod) {
      showNotification('Error', 'Please select a plan and payment method');
      return;
    }
    
    setShowConfirmation(true);
    playHapticFeedback('selection');
  };
  
  // Cancel payment
  const cancelPayment = () => {
    setShowConfirmation(false);
    playHapticFeedback('selection');
  };
  
  // Process payment
  const processPayment = async () => {
    if (!selectedPlan || !paymentMethod) {
      showNotification('Error', 'Please select a plan and payment method');
      return;
    }
    
    try {
      setProcessingPayment(true);
      
      // In a real app, this would process the payment
      // For demo, simulate a payment process with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Upgrade user to premium
      const result = await upgradeToPremium();
      
      if (result.success) {
        setUpgradeComplete(true);
        playHapticFeedback('success');
      } else {
        throw new Error(result.error || 'Payment failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      showNotification('Payment Failed', error.message || 'Unable to process payment');
      playHapticFeedback('error');
      setShowConfirmation(false);
    } finally {
      setProcessingPayment(false);
    }
  };
  
  // Return to app after upgrade
  const returnToApp = () => {
    navigate('/');
    playHapticFeedback('selection');
  };
  
  // Render upgrade complete screen
  if (upgradeComplete) {
    return (
      <div className={`premium-plans-container theme-${theme}`}>
        <div className="upgrade-success">
          <div className="success-icon">
            <i className="fas fa-crown"></i>
          </div>
          
          <h1>Welcome to HugMood Premium!</h1>
          
          <p className="success-message">
            Your account has been successfully upgraded. Enjoy all the premium features!
          </p>
          
          <div className="premium-benefits">
            <h2>Your Premium Benefits</h2>
            
            <div className="benefits-list">
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="benefit-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button
            className="return-button"
            onClick={returnToApp}
          >
            Return to App
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`premium-plans-container theme-${theme}`}>
      <header className="page-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Premium Plans</h1>
      </header>
      
      <div className="premium-intro">
        <div className="premium-icon">
          <i className="fas fa-crown"></i>
        </div>
        
        <h2>Upgrade to Premium</h2>
        
        <p className="premium-description">
          Enhance your HugMood experience with premium features, unlimited media hugs, and exclusive content.
        </p>
      </div>
      
      {/* Plan Selection */}
      <div className="plans-container">
        <h3>Choose Your Plan</h3>
        
        <div className="plans-grid">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
              onClick={() => handleSelectPlan(plan)}
            >
              {plan.popular && (
                <div className="popular-tag">
                  <i className="fas fa-star"></i>
                  <span>Most Popular</span>
                </div>
              )}
              
              <div className="plan-name">{plan.name}</div>
              
              <div className="plan-price">
                <span className="currency">$</span>
                <span className="amount">{plan.price}</span>
                <span className="billing">/{plan.billing}</span>
              </div>
              
              {plan.savings && (
                <div className="plan-savings">
                  Save {plan.savings}
                </div>
              )}
              
              <div className="plan-features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                className={`select-plan-button ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan(plan);
                }}
              >
                {selectedPlan?.id === plan.id ? (
                  <>
                    <i className="fas fa-check-circle"></i>
                    Selected
                  </>
                ) : (
                  'Select Plan'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment Method Selection */}
      {selectedPlan && (
        <div className="payment-method-container">
          <h3>Select Payment Method</h3>
          
          <div className="payment-methods-grid">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`payment-method-card ${paymentMethod?.id === method.id ? 'selected' : ''}`}
                onClick={() => handleSelectPayment(method)}
              >
                <i className={`fab ${method.icon}`}></i>
                <span>{method.name}</span>
              </div>
            ))}
          </div>
          
          <button
            className={`continue-button ${(!selectedPlan || !paymentMethod) ? 'disabled' : ''}`}
            onClick={showPaymentConfirmation}
            disabled={!selectedPlan || !paymentMethod}
          >
            Continue to Payment
          </button>
        </div>
      )}
      
      {/* Free Features */}
      <div className="free-vs-premium">
        <h3>Free vs. Premium</h3>
        
        <div className="comparison-table">
          <div className="comparison-header">
            <div className="feature-name"></div>
            <div className="plan-type">Free</div>
            <div className="plan-type premium">Premium</div>
          </div>
          
          <div className="comparison-row">
            <div className="feature-name">Media Hugs</div>
            <div className="plan-type">3 per month</div>
            <div className="plan-type premium">Unlimited</div>
          </div>
          
          <div className="comparison-row">
            <div className="feature-name">Group Hugs</div>
            <div className="plan-type">1 per week</div>
            <div className="plan-type premium">Unlimited</div>
          </div>
          
          <div className="comparison-row">
            <div className="feature-name">Premium Animations</div>
            <div className="plan-type">
              <i className="fas fa-times"></i>
            </div>
            <div className="plan-type premium">
              <i className="fas fa-check"></i>
            </div>
          </div>
          
          <div className="comparison-row">
            <div className="feature-name">Custom AR Effects</div>
            <div className="plan-type">
              <i className="fas fa-times"></i>
            </div>
            <div className="plan-type premium">
              <i className="fas fa-check"></i>
            </div>
          </div>
          
          <div className="comparison-row">
            <div className="feature-name">Ads</div>
            <div className="plan-type">Yes</div>
            <div className="plan-type premium">No Ads</div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="testimonials">
        <h3>What Our Premium Users Say</h3>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              "The premium animations make sending hugs so much more personal. Worth every penny!"
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="author-name">Sarah K.</div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              "I love being able to send unlimited media hugs to my friends. The AR effects are amazing!"
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="author-name">Michael T.</div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              "The group hug feature has been perfect for staying connected with my family across the country."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="author-name">Elena M.</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-question">
              <h4>Can I switch between plans?</h4>
              <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">
              <p>
                Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.
              </p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h4>How do I cancel my subscription?</h4>
              <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">
              <p>
                You can cancel your subscription at any time from your account settings. Your premium benefits will remain active until the end of your current billing period.
              </p>
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">
              <h4>What happens if I cancel premium?</h4>
              <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">
              <p>
                If you cancel, you'll still have access to premium features until the end of your current billing period. After that, your account will revert to the free tier.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Confirmation Modal */}
      {showConfirmation && (
        <div className="payment-modal">
          <div className="modal-overlay" onClick={cancelPayment}></div>
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={cancelPayment}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <h2>Confirm Your Purchase</h2>
            
            <div className="purchase-summary">
              <div className="summary-item">
                <span className="item-label">Plan:</span>
                <span className="item-value">{selectedPlan.name}</span>
              </div>
              
              <div className="summary-item">
                <span className="item-label">Amount:</span>
                <span className="item-value">${selectedPlan.price}</span>
              </div>
              
              <div className="summary-item">
                <span className="item-label">Billing:</span>
                <span className="item-value">
                  {selectedPlan.billing === 'month' ? 'Monthly' : 
                   selectedPlan.billing === 'year' ? 'Annually' : 
                   'One-time Payment'}
                </span>
              </div>
              
              <div className="summary-item">
                <span className="item-label">Payment Method:</span>
                <span className="item-value">
                  <i className={`fab ${paymentMethod.icon}`}></i>
                  {paymentMethod.name}
                </span>
              </div>
            </div>
            
            <div className="payment-actions">
              <button
                className="cancel-button"
                onClick={cancelPayment}
                disabled={processingPayment}
              >
                Cancel
              </button>
              
              <button
                className="confirm-button"
                onClick={processPayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </div>
            
            <div className="payment-security">
              <i className="fas fa-lock"></i>
              <span>Secure Payment Processing</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPlans;