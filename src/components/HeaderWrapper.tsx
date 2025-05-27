import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import { useLanguage } from '../LanguageContext';
import './Header.css';

const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const titleContainer = document.querySelector('.header-title');
    if (titleContainer && !titleContainer.querySelector('.quantum-spark')) {
      for (let i = 0; i < 10; i++) {
        const spark = document.createElement('div');
        spark.classList.add('quantum-spark');
        spark.style.position = 'absolute';
        spark.style.width = '4px';
        spark.style.height = '4px';
        spark.style.borderRadius = '50%';
        spark.style.backgroundColor = '#64ffda';
        spark.style.filter = 'blur(1px)';
        spark.style.opacity = '0';
        spark.style.zIndex = '1';
        spark.style.left = `${Math.random() * 100}%`;
        spark.style.top = `${Math.random() * 100}%`;
        spark.style.animation = `sparkle 1.5s linear infinite`;
        spark.style.animationDelay = `${Math.random() * 2}s`;
        titleContainer.appendChild(spark);
      }
    }
    return () => {
      if (titleContainer) {
        titleContainer.querySelectorAll('.quantum-spark').forEach(s => s.remove());
      }
    };
  }, []);

  return (
    <header className="header-root">
      <div className="header-title">
        <div className="title-bg"></div>
        <Link to="/">
          <span className="quantum-title">Quantum Swap</span>
        </Link>
      </div>
      <div className="header-actions">
        <WalletConnect />
        <div className="lang-switcher" aria-label="Language switcher">
          {['ru', 'en'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang as 'ru' | 'en')}
              className={`lang-btn${language === lang ? ' active' : ''}`}
              aria-pressed={language === lang}
              aria-label={lang === 'ru' ? 'Русский' : 'English'}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
