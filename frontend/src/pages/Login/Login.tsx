import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/useUserStore';
import { api } from '@/services/api';
import './Login.css';

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await api.login({
          email: formData.email,
          password: formData.password,
        });

        const users = await api.getUsers();
        const user = users.find((u) => u.email === formData.email);

        if (user) {
          setUser(user);
          navigate('/');
        }
      } else {
        await api.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        const users = await api.getUsers();
        const user = users.find((u) => u.email === formData.email);

        if (user) {
          setUser(user);
          navigate('/');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({
      name: '',
      email: '',
      password: '',
    });
  };

  return (
    <div className="login-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="login-container"
        >
          <div className="login-header">
            <Link to="/" className="login-logo">
              <span className="logo-icon">🎮</span>
              <span>Game Store</span>
            </Link>
            <h1>{isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}</h1>
            <p className="login-subtitle">
              {isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">{t('auth.name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={4}
                  className="form-input"
                  placeholder={t('auth.namePlaceholder')}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">{t('auth.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('auth.password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={4}
                className="form-input"
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? t('common.loading') : isLogin ? t('auth.login') : t('auth.register')}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
              <button onClick={toggleMode} className="link-button">
                {isLogin ? t('auth.register') : t('auth.login')}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
