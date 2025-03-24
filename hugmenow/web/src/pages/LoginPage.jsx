import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, anonymousLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Generate a random nickname
      const randomNickname = `Guest${Math.floor(Math.random() * 10000)}`;
      await anonymousLogin(randomNickname);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Anonymous login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="auth-page">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Log in to continue your wellness journey.</p>

          {error && (
            <div className="alert alert-error">
              <div className="alert-content">
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-loader"></span> Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </button>
            </div>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button
            onClick={handleAnonymousLogin}
            className="btn btn-outline btn-block"
            disabled={loading}
          >
            Continue as Guest
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default LoginPage;