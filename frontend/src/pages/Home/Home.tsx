import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GameList } from '@/components/GameList/GameList';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { api } from '@/services/api';
import type { Game } from '@/types/api';
import './Home.css';

export const Home = () => {
  const { t } = useTranslation();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await api.getGames();
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(query)}`;
    }
  };

  const featuredGames = games.slice(0, 4);
  const topRatedGames = games
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);
  const allGenres = [...new Set(games.map(g => g.genre_id))];

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadGames} className="btn btn-primary">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1 className="hero-title">{t('home.hero')}</h1>
            <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {featuredGames.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">{t('home.featured')}</h2>
            <div className="featured-grid">
              {featuredGames.map((game) => (
                <Link key={game.id} to={`/game/${game.id}`} className="featured-card">
                  <img
                    src={`/images/games/large/${game.id}.jpg`}
                    alt={game.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://via.placeholder.com/800x450/1a1f26/3b82f6?text=${encodeURIComponent(game.title)}`;
                    }}
                  />
                  <div className="featured-info">
                    <h3>{game.title}</h3>
                    <p>₽{game.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section-stats">
        <div className="container">
          <div className="stats-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="stat-card"
            >
              <div className="stat-number">{games.length}</div>
              <div className="stat-label">{t('home.totalGames')}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="stat-card"
            >
              <div className="stat-number">{allGenres.length}</div>
              <div className="stat-label">{t('home.genres')}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="stat-card"
            >
              <div className="stat-number">{topRatedGames.length > 0 ? topRatedGames[0].rating.toFixed(1) : '0'}</div>
              <div className="stat-label">{t('home.topRating')}</div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <GameList games={topRatedGames} title={t('home.topRated')} />
        </div>
      </section>
    </div>
  );
};
