import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import './styles/DashboardStyles.css';

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  priceChange24h: number;
  value: number;
  logo: string;
}
export interface Trade {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  type: 'buy' | 'sell';
  amount: string;
  price: string;
  total: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}
export interface Pool {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  liquidity: string;
  yourShare: string;
  apr: number;
}
export interface PnLData {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
}

// ====== DEMO MOCKS ======
const DEMO_TOKENS: Token[] = [
  {
    symbol: 'USDT',
    name: 'Tether USD',
    balance: '1500',
    price: 1.00,
    priceChange24h: 0.08,
    value: 1500,
    logo: 'https://cdn3d.iconscout.com/3d/premium/thumb/tether-usdt-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--cryptocurrency-pack-science-technology-icons-6044470.png?f=webp',
  },
  {
    symbol: 'NOT',
    name: 'Notcoin',
    balance: '125000',
    price: 0.0031,
    priceChange24h: 2.4,
    value: 387.5,
    logo: 'https://cdn3d.iconscout.com/3d/premium/thumb/notcoin-not-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--btc-bitcoin-cryptocurrency-pack-science-technology-icons-10300408.png?f=webp',
  },
  {
    symbol: 'JET',
    name: 'Jetton',
    balance: '24710',
    price: 0.031,
    priceChange24h: 1.2,
    value: 765,
    logo: 'https://img.cryptorank.io/coins/jet_ton_games1704976992995.png',
  },
];
const DEMO_TRADES: Trade[] = [
  {
    id: 't1',
    tokenSymbol: 'TON',
    tokenName: 'Toncoin',
    type: 'buy',
    amount: '120',
    price: '3.22',
    total: '386.4',
    timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    status: 'completed',
  },
  {
    id: 't2',
    tokenSymbol: 'NOT',
    tokenName: 'Notcoin',
    type: 'sell',
    amount: '10000',
    price: '0.003',
    total: '30',
    timestamp: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
    status: 'completed',
  },
];
const DEMO_POOLS: Pool[] = [
  {
    id: 'p1',
    tokenSymbol: 'TON/USDT',
    tokenName: 'Toncoin / Tether',
    liquidity: '11024',
    yourShare: '110',
    apr: 11.2,
  },
  {
    id: 'p2',
    tokenSymbol: 'NOT/TON',
    tokenName: 'Notcoin / Toncoin',
    liquidity: '92300',
    yourShare: '800',
    apr: 7.5,
  },
];
const DEMO_PNL: PnLData = {
  daily: 14.33,
  weekly: -12.2,
  monthly: 201.7,
  total: 1065,
};
const DEMO_BALANCES = { ton: '543', tokens: DEMO_TOKENS };
const DEMO_AIRDROP = 2;
const DEMO_STAKING = 1;
const DEMO_COMPETITION = 1;
// =========================

function formatNumber(num: number | string, decimals: number = 2): string {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  return isNaN(value)
    ? '0'
    : value.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
function getTotalBalance(balances: { ton: string; tokens: Token[] }) {
  const tonValue = parseFloat(balances.ton) * 3.25;
  return tonValue + balances.tokens.reduce((sum, t) => sum + t.value, 0);
}

// Получить логотип для TON
function getLogoBySymbol(symbol: string): string {
  if (symbol === 'TON') {
    return 'https://cdn.iconscout.com/icon/premium/png-256-thumb/toncoin-toncoin-6888837-5645461.png';
  }
  const found = DEMO_TOKENS.find((t) => t.symbol === symbol);
  return found?.logo || '';
}

const Dashboard: React.FC = () => {
  const { walletAddress, connectWallet } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState(DEMO_BALANCES);
  const [recentTrades, setRecentTrades] = useState(DEMO_TRADES);
  const [activePools, setActivePools] = useState(DEMO_POOLS);
  const [pnlData, setPnlData] = useState(DEMO_PNL);
  const [airdropCount, setAirdropCount] = useState(DEMO_AIRDROP);
  const [stakingCount, setStakingCount] = useState(DEMO_STAKING);
  const [competitionCount, setCompetitionCount] = useState(DEMO_COMPETITION);

  useEffect(() => {
    setBalances(DEMO_BALANCES);
    setRecentTrades(DEMO_TRADES);
    setActivePools(DEMO_POOLS);
    setPnlData(DEMO_PNL);
    setAirdropCount(DEMO_AIRDROP);
    setStakingCount(DEMO_STAKING);
    setCompetitionCount(DEMO_COMPETITION);
  }, [walletAddress]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content container mx-auto">
        <h1 className="title">Главная</h1>
        {!walletAddress ? (
          <div className="no-wallet-card">
            <h2 className="no-wallet-title">Подключите кошелек</h2>
            <p className="no-wallet-text">Для просмотра вашего дашборда необходимо подключить кошелек</p>
            <button onClick={connectWallet} className="connect-button">Подключить кошелек</button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="section">
            {/* Базовые показатели */}
            <div className="stats-grid">
              <div className="stat-card">
                <h2 className="stat-label">Общий баланс</h2>
                <p className="stat-value">${formatNumber(getTotalBalance(balances))}</p>
              </div>
              <div className="stat-card">
                <h2 className="stat-label">Прибыль/убыток (24ч)</h2>
                <p className={`stat-value ${pnlData.daily >= 0 ? 'stat-positive' : 'stat-negative'}`}>{pnlData.daily >= 0 ? '+' : ''}{formatNumber(pnlData.daily)}$</p>
              </div>
              <div className="stat-card">
                <h2 className="stat-label">Активные пулы</h2>
                <p className="stat-value">{activePools.length}</p>
              </div>
              <div className="stat-card">
                <h2 className="stat-label">Активные аирдропы</h2>
                <p className="stat-value">{airdropCount}</p>
              </div>
            </div>
            {/* Баланс + PnL */}
            <div className="balance-pnl-grid">
              <div className="balance-card">
                <div className="card-header">
                  <h2 className="card-title">Баланс</h2>
                  <button onClick={() => navigate('/wallet')} className="card-link">Подробнее</button>
                </div>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Токен</th>
                        <th className="text-right">Баланс</th>
                        <th className="text-right">Цена</th>
                        <th className="text-right hidden sm:table-cell">Изменение (24ч)</th>
                        <th className="text-right">Стоимость</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* TON */}
                      <tr>
                        <td>
                          <div className="flex items-center">
                            <img src={getLogoBySymbol('TON')} alt="TON" className="token-logo-img" />
                            <span style={{ marginLeft: 8 }}>TON</span>
                          </div>
                        </td>
                        <td className="text-right">{formatNumber(balances.ton, 4)}</td>
                        <td className="text-right">$3.25</td>
                        <td className="text-right text-green-400 hidden sm:table-cell">+1.8%</td>
                        <td className="text-right">${formatNumber(parseFloat(balances.ton) * 3.25)}</td>
                      </tr>
                      {/* Остальные токены */}
                      {balances.tokens.map((token) => (
                        <tr key={token.symbol}>
                          <td>
                            <div className="flex items-center">
                              <img src={token.logo} alt={token.symbol} className="token-logo-img" />
                              <span style={{ marginLeft: 8 }}>{token.name}</span>
                            </div>
                          </td>
                          <td className="text-right">{formatNumber(token.balance, 4)}</td>
                          <td className="text-right">${formatNumber(token.price, 4)}</td>
                          <td className={`text-right hidden sm:table-cell ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{token.priceChange24h >= 0 ? '+' : ''}{formatNumber(token.priceChange24h)}%</td>
                          <td className="text-right">${formatNumber(token.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Всего</td><td></td><td></td><td className="hidden sm:table-cell"></td>
                        <td className="text-right">${formatNumber(getTotalBalance(balances))}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              {/* PnL-карточка */}
              <div className="pnl-card">
                <h2 className="card-title">Прибыль/убыток</h2>
                <div className="pnl-grid">
                  <div className="pnl-item"><h3 className="pnl-label">За день</h3><p className={`pnl-value ${pnlData.daily >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlData.daily >= 0 ? '+' : ''}{formatNumber(pnlData.daily)}$</p></div>
                  <div className="pnl-item"><h3 className="pnl-label">За неделю</h3><p className={`pnl-value ${pnlData.weekly >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlData.weekly >= 0 ? '+' : ''}{formatNumber(pnlData.weekly)}$</p></div>
                  <div className="pnl-item"><h3 className="pnl-label">За месяц</h3><p className={`pnl-value ${pnlData.monthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlData.monthly >= 0 ? '+' : ''}{formatNumber(pnlData.monthly)}$</p></div>
                  <div className="pnl-item"><h3 className="pnl-label">За всё время</h3><p className={`pnl-value ${pnlData.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlData.total >= 0 ? '+' : ''}{formatNumber(pnlData.total)}$</p></div>
                </div>
                <div className="pnl-chart">График PnL</div>
              </div>
            </div>
            {/* Транзакции и пулы */}
            <div className="trades-pools-grid">
              <div className="trades-card">
                <div className="card-header"><h2 className="card-title">Последние транзакции</h2><button onClick={() => navigate('/transactions')} className="card-link">Все транзакции</button></div>
                {recentTrades.length === 0 ? (<p className="empty-text">Нет транзакций</p>) : (
                  <div className="table-container">
                    <table className="table">
                      <thead><tr><th>Токен</th><th className="text-right">Тип</th><th className="text-right">Количество</th><th className="text-right hidden sm:table-cell">Цена</th><th className="text-right">Время</th></tr></thead>
                      <tbody>{recentTrades.map((trade) => (
                        <tr key={trade.id}><td>{trade.tokenSymbol}</td><td className={`text-right ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{trade.type === 'buy' ? 'Покупка' : 'Продажа'}</td><td className="text-right">{formatNumber(trade.amount, 4)}</td><td className="text-right hidden sm:table-cell">${trade.price}</td><td className="text-right">{formatDate(trade.timestamp)}</td></tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="pools-card">
                <div className="card-header"><h2 className="card-title">Активные пулы ликвидности</h2><button onClick={() => navigate('/pools')} className="card-link">Все пулы</button></div>
                {activePools.length === 0 ? (<p className="empty-text">Нет активных пулов</p>) : (
                  <div className="table-container">
                    <table className="table">
                      <thead><tr><th>Токен</th><th className="text-right">Ваша доля</th><th className="text-right hidden sm:table-cell">Ликвидность</th><th className="text-right">APR</th></tr></thead>
                      <tbody>{activePools.map((pool) => (
                        <tr key={pool.id}><td>{pool.tokenSymbol}</td><td className="text-right">{formatNumber(pool.yourShare)} {pool.tokenSymbol}</td><td className="text-right hidden sm:table-cell">{formatNumber(pool.liquidity)} {pool.tokenSymbol}</td><td className="text-right text-green-400">{formatNumber(pool.apr)}%</td></tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            {/* Активности */}
            <div className="activity-grid">
              <div className="activity-card"><div className="activity-header"><h2 className="activity-title">Стейкинг</h2><span className="activity-count">{stakingCount} активных</span></div><p className="activity-text">Зарабатывайте доход от ваших токенов</p><button onClick={() => navigate('/staking/trader')} className="activity-button">Перейти к стейкингу</button></div>
              <div className="activity-card"><div className="activity-header"><h2 className="activity-title">Соревнования</h2><span className="activity-count">{competitionCount} активных</span></div><p className="activity-text">Участвуйте и выигрывайте призы</p><button onClick={() => navigate('/competition/trader')} className="activity-button">Перейти к соревнованиям</button></div>
              <div className="activity-card"><div className="activity-header"><h2 className="activity-title">Аирдропы</h2><span className="activity-count">{airdropCount} активных</span></div><p className="activity-text">Получите бесплатные токены</p><button onClick={() => navigate('/airdrop/trader')} className="activity-button">Перейти к аирдропам</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
