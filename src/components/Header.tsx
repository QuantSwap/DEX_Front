import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import { useLanguage } from '../LanguageContext'; 

const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes titleGradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      .quantum-title {
        background: linear-gradient(90deg, #64ffda, #48b8d0, #2979ff, #5e35b1, #2979ff, #48b8d0, #64ffda);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: titleGradient 6s ease infinite;
        text-shadow: 0 0 5px rgba(100, 255, 218, 0.3), 0 0 10px rgba(100, 255, 218, 0.2);
        font-weight: 800;
        letter-spacing: 0.5px;
      }
      
      .title-container {
        position: relative;
        padding: 4px 12px;
        border-radius: 6px;
      }
      
      .title-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to right, rgba(0, 30, 60, 0.5), rgba(0, 60, 40, 0.5));
        border-radius: 6px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 8px rgba(100, 255, 218, 0.2);
        z-index: 0;
        backdrop-filter: blur(4px);
      }
      
      .quantum-spark {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #64ffda;
        filter: blur(1px);
        opacity: 0;
        z-index: 1;
        animation: sparkle 1.5s linear infinite;
      }
      
      @keyframes sparkle {
        0% {
          opacity: 0;
          transform: scale(0);
        }
        50% {
          opacity: 0.8;
          transform: scale(1);
        }
        100% {
          opacity: 0;
          transform: scale(0);
        }
      }

    `;
    document.head.appendChild(style);
    
    const titleContainer = document.querySelector('.title-container');
    if (titleContainer) {
      for (let i = 0; i < 10; i++) {
        const spark = document.createElement('div');
        spark.classList.add('quantum-spark');
        
        spark.style.left = `${Math.random() * 100}%`;
        spark.style.top = `${Math.random() * 100}%`;
        
        spark.style.animationDelay = `${Math.random() * 2}s`;
        
        titleContainer.appendChild(spark);
      }
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center">
        <Link to="/" className="title-container flex items-center relative">
          <div className="title-bg"></div>
          <span className="quantum-title text-2xl relative z-10">Quantum Swap</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <WalletConnect />

        {/* Language */}
        <div className="lang-switcher" aria-label="Language switcher">
          {['ru', 'en'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang as 'ru' | 'en')}
              className={`lang-btn ${language === lang ? 'active' : ''}`}
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
