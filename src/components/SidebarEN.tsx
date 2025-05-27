import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const SidebarEN: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const isActiveRoute = (key: string): boolean => {
    const path = location.pathname;
    return path.includes(`/${key}`);
  };

  const navItems = [
    {
      title: 'Dashboard',
      key: 'dashboard',
      isDropdown: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      links: [
        { to: '/dashboard/trader', label: 'TRADER' },
        { to: '/dashboard/creator', label: 'CREATOR' },
      ],
    },
    {
      title: 'Trade',
      key: 'trade',
      isDropdown: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      links: [
        { to: '/trade/swap', label: 'SWAP' },
        { to: '/trade/orderbook', label: 'ORDER BOOK' },
      ],
    },
    {
      title: 'Pools',
      key: 'pools',
      isDropdown: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      to: '/pools',
    },
    {
      title: 'Airdrop',
      key: 'airdrop',
      isDropdown: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      to: '/airdrop/trader',
    },
    {
      title: 'Competition',
      key: 'competition',
      isDropdown: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      to: '/competition/trader',
    },
    {
      title: 'Staking',
      key: 'staking',
      isDropdown: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      to: '/staking/trader',
    },
    {
      title: 'Bots',
      key: 'bots',
      isDropdown: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      links: [
        { to: '/bots/mm', label: 'MM BOT' },
        { to: '/bots/trade', label: 'TRADE BOT' },
      ],
    },
    {
      title: 'Distribution',
      key: 'distribution',
      isDropdown: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      links: [
        { to: '/distribution', label: 'DISTRIBUTION' },
        { to: '/distribution/slot', label: 'SLOT MACHINE' },
      ],
    },
   // SidebarEN.tsx
{
  title: 'PoSo Mining',
  key: 'poso',
  isDropdown: true,
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  links: [
    { to: '/poso/mining', label: 'Miner' },
    { to: '/poso/my-mining', label: 'My Mining' }
  ]
},


  ];

  return (
    <>
      {/* Десктоп навигация */}
      <nav className="bg-gradient-to-r from-green-950 to-green-900 shadow-lg hidden md:flex justify-center w-full text-white px-4">
        {navItems.map((item) =>
          item.isDropdown ? (
            <div key={item.key} className="relative group">
              <div 
                className={`flex items-center space-x-2 p-4 cursor-pointer transition-all duration-300 
                  ${isActiveRoute(item.key) ? 'text-green-300 border-b-2 border-green-300' : 'text-white hover:text-green-300'}`}
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div 
                className="absolute left-0 top-full w-48 
                  bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 
                  opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out 
                  pointer-events-none group-hover:pointer-events-auto z-10"
              >
                <div className="py-1 rounded-md bg-green-900 shadow-inner overflow-hidden">
                  {item.links?.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-sm ${
                          isActive
                            ? 'bg-green-700 text-white font-medium border-l-4 border-green-400'
                            : 'text-gray-200 hover:bg-green-800 hover:text-white'
                        } transition-all duration-200`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <NavLink
              key={item.key}
              to={item.to || '#'}
              className={({ isActive }) =>
                `flex items-center space-x-2 p-4 transition-all duration-300 ${
                  isActive
                    ? 'text-green-300 border-b-2 border-green-300 font-medium'
                    : 'text-white hover:text-green-300 hover:border-b-2 hover:border-green-300'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          )
        )}
      </nav>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="bg-gradient-to-r from-green-950 to-green-900 p-4 flex justify-between items-center shadow-md">
          <span className="text-xl font-bold text-white">DEX</span>
          <button 
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none focus:ring-2 focus:ring-green-400 p-1 rounded-md"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="bg-green-950 animate-fade-in-down overflow-hidden shadow-xl rounded-b-lg">
            {navItems.map((item) => (
              <div key={item.key}>
                {item.isDropdown ? (
                  <div>
                    <div
                      className={`p-4 text-white border-b border-green-800 flex justify-between items-center
                        ${isActiveRoute(item.key) ? 'bg-green-900' : ''} hover:bg-green-900 transition-all duration-200`}
                      onClick={() => toggleDropdown(item.key)}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{item.icon}</span>
                        <span className={isActiveRoute(item.key) ? 'font-medium text-green-300' : ''}>{item.title}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform duration-300 ${
                          activeDropdown === item.key ? 'transform rotate-180 text-green-300' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div 
                      className={`bg-green-900 overflow-hidden transition-all duration-300 
                      ${activeDropdown === item.key ? 'max-h-60' : 'max-h-0'}`}
                    >
                      {item.links?.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          className={({ isActive }) =>
                            `block p-4 pl-12 ${
                              isActive
                                ? 'text-green-300 bg-green-800 border-l-4 border-green-400 font-medium'
                                : 'text-gray-300 hover:bg-green-800 hover:text-white'
                            } transition-all duration-200`
                          }
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={item.to || '#'}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-4 border-b border-green-800 transition-all duration-200
                      ${
                        isActive
                          ? 'bg-green-900 text-green-300 border-l-4 border-green-400 font-medium'
                          : 'text-white hover:bg-green-900 hover:border-l-2 hover:border-green-700'
                      }`
                    }
                  >
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in-down {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-down {
    animation: fade-in-down 0.3s ease-out forwards;
  }
  /* Добавляем задержку для исчезновения */
  .group:hover .group-hover\\:opacity-100 {
    opacity: 1;
    transition-delay: 0s;
  }
  .group:not(:hover) .group-hover\\:opacity-100 {
    opacity: 0;
    transition-delay: 0.2s; /* Задержка перед исчезновением */
  }
`;
document.head.appendChild(style);

export default SidebarEN;
