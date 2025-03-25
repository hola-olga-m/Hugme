import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register, anonymousLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError(t('errors.auth.passwordMismatch'));
      return false;
    }
    
    if (formData.password.length < 6) {
      setError(t('errors.auth.weakPassword'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { username, email, name, password } = formData;
      // Pass individual fields to match the register function signature
      await register(username, email, name, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Generate a random nickname
      const randomNickname = `${t('auth.nickname')}${Math.floor(Math.random() * 10000)}`;
      await anonymousLogin(randomNickname);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="auth-page">
        <div className="auth-card">
          <h2>{t('auth.register')}</h2>
          <p className="auth-subtitle">{t('auth.startJourney')}</p>

          {error && (
            <div className="alert alert-error">
              <div className="alert-content">
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                {t('auth.username')}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                placeholder={t('auth.username')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                {t('auth.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.email')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">
                {t('auth.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('auth.name')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                {t('auth.password')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.password')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('auth.confirmPassword')}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-loader"></span> {t('common.loading')}...
                  </>
                ) : (
                  t('auth.signUp')
                )}
              </button>
            </div>
          </form>

          <div className="auth-divider">
            <span>{t('common.or')}</span>
          </div>

          <button
            onClick={handleAnonymousLogin}
            className="btn btn-outline btn-block"
            disabled={loading}
          >
            {t('auth.anonymousLogin')}
          </button>

          <div className="auth-footer">
            <p>
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="auth-link">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default RegisterPage;