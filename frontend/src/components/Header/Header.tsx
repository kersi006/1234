import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import { useThemeStore } from '@/stores/useThemeStore';
import './Header.css';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const itemsCount = useCartStore((state) => state.getItemsCount());
  const currentUser = useUserStore((state) => state.currentUser);
  const { theme, toggleTheme } = useThemeStore();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">Game Store</span>
          </Link>

          <nav className="nav">
            <Link to="/catalog" className="nav-link">
              {t('nav.catalog')}
            </Link>
          </nav>

          <div className="header-actions">
            <button
              onClick={toggleTheme}
              className="icon-button"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <button
              onClick={toggleLanguage}
              className="icon-button"
              aria-label="Toggle language"
            >
              {i18n.language === 'en' ? '🇷🇺' : '🇺🇸'}
            </button>

            <Link to="/cart" className="cart-button">
              <span className="cart-icon">🛒</span>
              {itemsCount > 0 && (
                <span className="cart-badge">{itemsCount}</span>
              )}
            </Link>

            {currentUser ? (
              <Link to="/profile" className="profile-button">
                <span className="profile-icon">👤</span>
                <span className="profile-name">{currentUser.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary">
                {t('profile.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
