
// Simplified React Loader for HugMood
document.addEventListener('DOMContentLoaded', function() {
  console.log('Simplified React loader initializing');
  
  // Load React and ReactDOM from CDN
  loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
    loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
      // Load Font Awesome for social media icons
      loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
      console.log('React libraries loaded, initializing app');
      initializeApp();
    });
  });
  
  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = function() {
      console.error('Failed to load script:', src);
    };
    document.head.appendChild(script);
  }
  
  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  
  function initializeApp() {
    // Create React elements
    const e = React.createElement;
    const useState = React.useState;
    const useEffect = React.useEffect;
    
    // Create a toast notification component
    const Toast = ({ message, type, onClose }) => {
      useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, 3000);
        
        return () => clearTimeout(timer);
      }, [onClose]);
      
      return e('div', {
        className: `toast ${type}`,
        style: {
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          borderRadius: '4px',
          backgroundColor: type === 'success' ? '#43a047' : '#d32f2f',
          color: 'white',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }
      }, message);
    };

    // Form input component
    const FormInput = ({ label, type, value, onChange, placeholder, required }) => {
      return e('div', { 
        className: 'form-group',
        style: {
          marginBottom: '20px'
        }
      }, [
        e('label', { 
          key: `${label}-label`,
          style: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500'
          }
        }, label),
        e('input', {
          key: `${label}-input`,
          type: type || 'text',
          value: value,
          onChange: onChange,
          placeholder: placeholder,
          required: required,
          style: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }
        })
      ]);
    };

    // Checkbox component
    const Checkbox = ({ label, checked, onChange }) => {
      return e('div', {
        className: 'checkbox-container',
        style: {
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px'
        }
      }, [
        e('input', {
          key: 'checkbox',
          type: 'checkbox',
          checked: checked,
          onChange: onChange,
          id: 'rememberMe',
          style: {
            marginRight: '10px'
          }
        }),
        e('label', {
          key: 'checkbox-label',
          htmlFor: 'rememberMe',
          style: {
            cursor: 'pointer',
            fontSize: '14px',
            color: '#666'
          }
        }, label)
      ]);
    };

    // Social Login Button component
    const SocialButton = ({ icon, name, color, onClick }) => {
      return e('button', {
        type: 'button',
        onClick: onClick,
        className: `social-btn ${name.toLowerCase()}-btn`,
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: 'white',
          cursor: 'pointer',
          color: color,
          width: '100%',
          margin: '0 5px',
          transition: 'background-color 0.2s'
        }
      }, [
        e('i', {
          key: 'icon',
          className: `fab ${icon}`,
          style: {
            marginRight: '10px',
            fontSize: '18px'
          }
        }),
        e('span', { key: 'text' }, name)
      ]);
    };

    // Social Login Buttons component
    const SocialLoginButtons = () => {
      const handleGoogleLogin = () => {
        console.log('Google login clicked');
        showToast('Google login not implemented in this demo', 'error');
      };

      const handleFacebookLogin = () => {
        console.log('Facebook login clicked');
        showToast('Facebook login not implemented in this demo', 'error');
      };

      const handleAppleLogin = () => {
        console.log('Apple login clicked');
        showToast('Apple login not implemented in this demo', 'error');
      };

      return e('div', {
        className: 'social-login-buttons',
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }
      }, [
        e('div', { key: 'google', style: { flex: 1 } }, 
          e(SocialButton, {
            icon: 'fa-google',
            name: 'Google',
            color: '#DB4437',
            onClick: handleGoogleLogin
          })
        ),
        e('div', { key: 'facebook', style: { flex: 1 } },
          e(SocialButton, {
            icon: 'fa-facebook-f',
            name: 'Facebook',
            color: '#1877F2',
            onClick: handleFacebookLogin
          })
        ),
        e('div', { key: 'apple', style: { flex: 1 } },
          e(SocialButton, {
            icon: 'fa-apple',
            name: 'Apple',
            color: '#000000',
            onClick: handleAppleLogin
          })
        )
      ]);
    };

    // Create ForgotPassword component
    const ForgotPassword = ({ onBackToLogin }) => {
      const [email, setEmail] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      
      const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate password reset email
        setTimeout(() => {
          setIsLoading(false);
          showToast('Password reset email sent!', 'success');
          onBackToLogin();
        }, 1500);
      };
      
      return e('div', { className: 'auth-form-container' }, [
        e('div', { 
          key: 'header',
          className: 'auth-form-header',
          style: {
            textAlign: 'center',
            marginBottom: '30px'
          }
        }, [
          e('h2', { key: 'title' }, 'Reset Password'),
          e('p', { key: 'subtitle' }, 'Enter your email and we\'ll send you a reset link')
        ]),
        
        e('form', { 
          key: 'form',
          onSubmit: handleSubmit
        }, [
          e(FormInput, {
            key: 'email',
            label: 'Email',
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: 'Enter your email',
            required: true
          }),
          
          e('button', {
            key: 'submit',
            type: 'submit',
            disabled: isLoading,
            style: {
              width: '100%',
              padding: '12px',
              backgroundColor: '#7c5cbf',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginBottom: '20px'
            }
          }, isLoading ? 'Sending...' : 'Send Reset Link'),
          
          e('div', {
            key: 'back',
            style: {
              textAlign: 'center'
            }
          }, e('a', {
            href: '#',
            onClick: (e) => {
              e.preventDefault();
              onBackToLogin();
            },
            style: {
              color: '#7c5cbf',
              textDecoration: 'none'
            }
          }, 'Back to Login'))
        ])
      ]);
    };

    // Create Register component
    const Register = ({ onBackToLogin }) => {
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      const [isLoading, setIsLoading] = useState(false);
      
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
      
      const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
          showToast('Passwords do not match!', 'error');
          return;
        }
        
        setIsLoading(true);
        
        // Simulate registration
        setTimeout(() => {
          setIsLoading(false);
          showToast('Registration successful!', 'success');
          onBackToLogin();
        }, 1500);
      };
      
      return e('div', { className: 'auth-form-container' }, [
        e('div', { 
          key: 'header',
          className: 'auth-form-header',
          style: {
            textAlign: 'center',
            marginBottom: '30px'
          }
        }, [
          e('h2', { key: 'title' }, 'Create an Account'),
          e('p', { key: 'subtitle' }, 'Join HugMood today')
        ]),
        
        e('form', { 
          key: 'form',
          onSubmit: handleSubmit
        }, [
          e(FormInput, {
            key: 'name',
            label: 'Full Name',
            name: 'name',
            value: formData.name,
            onChange: handleChange,
            placeholder: 'Enter your full name',
            required: true
          }),
          
          e(FormInput, {
            key: 'email',
            label: 'Email',
            type: 'email',
            name: 'email',
            value: formData.email,
            onChange: handleChange,
            placeholder: 'Enter your email',
            required: true
          }),
          
          e(FormInput, {
            key: 'password',
            label: 'Password',
            type: 'password',
            name: 'password',
            value: formData.password,
            onChange: handleChange,
            placeholder: 'Create a password',
            required: true
          }),
          
          e(FormInput, {
            key: 'confirmPassword',
            label: 'Confirm Password',
            type: 'password',
            name: 'confirmPassword',
            value: formData.confirmPassword,
            onChange: handleChange,
            placeholder: 'Confirm your password',
            required: true
          }),
          
          e('button', {
            key: 'submit',
            type: 'submit',
            disabled: isLoading,
            style: {
              width: '100%',
              padding: '12px',
              backgroundColor: '#7c5cbf',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginBottom: '20px'
            }
          }, isLoading ? 'Creating Account...' : 'Sign Up'),
          
          e('div', {
            key: 'social-divider',
            style: {
              display: 'flex',
              alignItems: 'center',
              margin: '20px 0'
            }
          }, [
            e('div', { 
              key: 'line1',
              style: {
                flex: 1,
                height: '1px',
                backgroundColor: '#ddd'
              }
            }),
            e('span', { 
              key: 'text',
              style: {
                padding: '0 10px',
                color: '#666',
                fontSize: '14px'
              }
            }, 'or continue with'),
            e('div', { 
              key: 'line2',
              style: {
                flex: 1,
                height: '1px',
                backgroundColor: '#ddd'
              }
            })
          ]),
          
          e(SocialLoginButtons, { key: 'social' }),
          
          e('div', {
            key: 'login-link',
            style: {
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '14px',
              color: '#666'
            }
          }, [
            'Already have an account? ',
            e('a', {
              key: 'link',
              href: '#',
              onClick: (e) => {
                e.preventDefault();
                onBackToLogin();
              },
              style: {
                color: '#7c5cbf',
                textDecoration: 'none',
                fontWeight: '500'
              }
            }, 'Log in')
          ])
        ])
      ]);
    };

    // Create Login component
    const Login = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [rememberMe, setRememberMe] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [view, setView] = useState('login'); // login, forgotPassword, register
      const [toast, setToast] = useState(null);
      
      // Function to show toast notifications
      window.showToast = (message, type) => {
        setToast({ message, type });
      };
      
      const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate authentication with the mock GraphQL service
        window.graphqlService.executeMutation('login', { 
          email, 
          password,
          rememberMe 
        }).then(response => {
          setIsLoading(false);
          
          if (response.login && response.login.token) {
            // Set auth token in the mock service
            window.graphqlService.setAuthToken(response.login.token);
            
            // Show success message
            showToast('Login successful!', 'success');
            
            // Redirect to dashboard (in this demo just reload the page)
            setTimeout(() => {
              console.log('Redirecting to dashboard...');
              window.location.pathname = '/dashboard';
            }, 1500);
          } else {
            showToast('Invalid email or password', 'error');
          }
        }).catch(error => {
          setIsLoading(false);
          showToast(error.message || 'Failed to login', 'error');
          console.error('Login error:', error);
        });
      };
      
      // Render appropriate view
      const renderView = () => {
        switch(view) {
          case 'forgotPassword':
            return e(ForgotPassword, {
              onBackToLogin: () => setView('login')
            });
          case 'register':
            return e(Register, {
              onBackToLogin: () => setView('login')
            });
          default:
            return e('div', { className: 'auth-form-container' }, [
              e('div', { 
                key: 'header',
                className: 'auth-form-header',
                style: {
                  textAlign: 'center',
                  marginBottom: '30px'
                }
              }, [
                e('h2', { key: 'title' }, 'Welcome Back'),
                e('p', { key: 'subtitle' }, 'Sign in to your HugMood account')
              ]),
              
              e('form', { 
                key: 'form',
                onSubmit: handleSubmit
              }, [
                e(FormInput, {
                  key: 'email',
                  label: 'Email or Username',
                  type: 'text',
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  placeholder: 'Enter your email or username',
                  required: true
                }),
                
                e(FormInput, {
                  key: 'password',
                  label: 'Password',
                  type: 'password',
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  placeholder: 'Enter your password',
                  required: true
                }),
                
                e('div', {
                  key: 'options',
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }
                }, [
                  e(Checkbox, {
                    key: 'remember',
                    label: 'Remember me',
                    checked: rememberMe,
                    onChange: () => setRememberMe(!rememberMe)
                  }),
                  
                  e('a', {
                    key: 'forgot',
                    href: '#',
                    onClick: (e) => {
                      e.preventDefault();
                      setView('forgotPassword');
                    },
                    style: {
                      color: '#7c5cbf',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }
                  }, 'Forgot Password?')
                ]),
                
                e('button', {
                  key: 'submit',
                  type: 'submit',
                  disabled: isLoading,
                  style: {
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#7c5cbf',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    marginBottom: '20px'
                  }
                }, isLoading ? 'Logging in...' : 'Log In'),
                
                e('div', {
                  key: 'social-divider',
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    margin: '20px 0'
                  }
                }, [
                  e('div', { 
                    key: 'line1',
                    style: {
                      flex: 1,
                      height: '1px',
                      backgroundColor: '#ddd'
                    }
                  }),
                  e('span', { 
                    key: 'text',
                    style: {
                      padding: '0 10px',
                      color: '#666',
                      fontSize: '14px'
                    }
                  }, 'or continue with'),
                  e('div', { 
                    key: 'line2',
                    style: {
                      flex: 1,
                      height: '1px',
                      backgroundColor: '#ddd'
                    }
                  })
                ]),
                
                e(SocialLoginButtons, { key: 'social' }),
                
                e('div', {
                  key: 'signup-link',
                  style: {
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '14px',
                    color: '#666'
                  }
                }, [
                  "Don't have an account? ",
                  e('a', {
                    key: 'link',
                    href: '#',
                    onClick: (e) => {
                      e.preventDefault();
                      setView('register');
                    },
                    style: {
                      color: '#7c5cbf',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }
                  }, 'Sign up')
                ])
              ])
            ]);
        }
      };
      
      return e('div', {
        className: 'auth-page',
        style: {
          maxWidth: '500px',
          margin: '0 auto',
          padding: '40px 20px'
        }
      }, [
        // Logo/header
        e('header', {
          key: 'header',
          style: {
            textAlign: 'center',
            marginBottom: '30px'
          }
        }, e('h1', {
          style: {
            color: '#7c5cbf',
            margin: 0
          }
        }, 'HugMood')),
        
        // Main content (login form or other views)
        renderView(),
        
        // Toast notification
        toast && e(Toast, {
          key: 'toast',
          message: toast.message,
          type: toast.type,
          onClose: () => setToast(null)
        })
      ]);
    };
    
    // Render the Login component to the root element
    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(e(Login));
    
    console.log('React login page rendered successfully');
  }
});
