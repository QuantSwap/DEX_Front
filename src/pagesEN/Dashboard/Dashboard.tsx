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

function formatNumber(num: number | string, decimals: number = 2): string {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  return isNaN(value)
    ? '0'
    : value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
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
        <h1 className="title">Dashboard</h1>
        {!walletAddress ? (
          <div className="no-wallet-card">
            <h2 className="no-wallet-title">Connect Wallet</h2>
            <p className="no-wallet-text">Connect your wallet to view your dashboard</p>
            <button onClick={connectWallet} className="connect-button">Connect Wallet</button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="section">
            {/* Basic stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <h2 className="stat-label">Total Balance</h2>
                <p className="stat-value">${formatNumber(getTotalBalance(balances))}</p>
              </div>
              <div className="stat-card">
                <h2 className="stat-label">PnL (24h)</h2>
                <p className={`stat-value ${pnlData.daily >= 0 ? 'stat-positive' : 'stat-negative'}`}>{pnlData.daily >= 0 ? '+' : ''}{formatNumber(pnlData.daily)}$</p>
              </div>
              <div className="stat-card">
                <h2 className="stat-label">Active Pools</h2>
                <p className="stat-value">{activePools.length}</p>
              </div>
              <div className="stat-card">
                <h2 className="stat-label">Active Airdrops</h2>
                <p className="stat-value">{airdropCount}</p>
              </div>
            </div>
            {/* Balance + PnL */}
            <div className="balance-pnl-grid">
              <div className="balance-card">
                <div className="card-header">
                  <h2 className="card-title">Balance</h2>
                  <button onClick={() => navigate('/wallet')} className="card-link">View Details</button>
                </div>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Token</th>
                        <th className="text-right">Balance</th>
                        <th className="text-right">Price</th>
                        <th className="text-right hidden sm:table-cell">24h Change</th>
                        <th className="text-right">Value</th>
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
                      {/* Other tokens */}
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
                        <td>Total</td><td></td><td></td><td className="hidden sm:table-cell"></td>
                        <td className="text-right">${formatNumber(getTotalBalance(balances))}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              {/* PnL Card */}
              <div className="pnl-card">
                <h2 className="card-title">PnL</h2>
                <div className="pnl-grid">
                  <div className="pnl-item"><h3 className="pnl-label">Day</h3><p className={`pnl-value ${pnlData.daily >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlData.daily >= 0 ? '+' : ''}{formatNumber(pnlData.daily)}$</p></div>
                  <div className="pnl-item"><h3 className="pnl-label">Week</h3><p className={`pnl-value ${pnlData.weekly >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlData.weekly >= 0 ? '+' : ''}{formatNumber(pnlData.weekly)}$</p></div>
                  <div className="pnl-item"><h3 className="pnl-label">Month</h3><p className={`pnl-value ${pnlData.monthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlData.monthly >= 0 ? '+' : ''}{formatNumber(pnlData.monthly)}$</p></div>
                  <div className="pnl-item"><h3 className="pnl-label">All time</h3><p className={`pnl-value ${pnlData.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlData.total >= 0 ? '+' : ''}{formatNumber(pnlData.total)}$</p></div>
                </div>
                <div className="pnl-chart">PnL chart</div>
              </div>
            </div>
            {/* Trades & Pools */}
            <div className="trades-pools-grid">
              <div className="trades-card">
                <div className="card-header"><h2 className="card-title">Recent Transactions</h2><button onClick={() => navigate('/transactions')} className="card-link">All Transactions</button></div>
                {recentTrades.length === 0 ? (<p className="empty-text">No transactions</p>) : (
                  <div className="table-container">
                    <table className="table">
                      <thead><tr><th>Token</th><th className="text-right">Type</th><th className="text-right">Amount</th><th className="text-right hidden sm:table-cell">Price</th><th className="text-right">Time</th></tr></thead>
                      <tbody>{recentTrades.map((trade) => (
                        <tr key={trade.id}><td>{trade.tokenSymbol}</td><td className={`text-right ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{trade.type === 'buy' ? 'Buy' : 'Sell'}</td><td className="text-right">{formatNumber(trade.amount, 4)}</td><td className="text-right hidden sm:table-cell">${trade.price}</td><td className="text-right">{formatDate(trade.timestamp)}</td></tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="pools-card">
                <div className="card-header"><h2 className="card-title">Active Liquidity Pools</h2><button onClick={() => navigate('/pools')} className="card-link">All Pools</button></div>
                {activePools.length === 0 ? (<p className="empty-text">No active pools</p>) : (
                  <div className="table-container">
                    <table className="table">
                      <thead><tr><th>Token</th><th className="text-right">Your share</th><th className="text-right hidden sm:table-cell">Liquidity</th><th className="text-right">APR</th></tr></thead>
                      <tbody>{activePools.map((pool) => (
                        <tr key={pool.id}><td>{pool.tokenSymbol}</td><td className="text-right">{formatNumber(pool.yourShare)} {pool.tokenSymbol}</td><td className="text-right hidden sm:table-cell">{formatNumber(pool.liquidity)} {pool.tokenSymbol}</td><td className="text-right text-green-400">{formatNumber(pool.apr)}%</td></tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            {/* Activities */}
            <div className="activity-grid">
              <div className="activity-card"><div className="activity-header"><h2 className="activity-title">Staking</h2><span className="activity-count">{stakingCount} active</span></div><p className="activity-text">Earn income from your tokens</p><button onClick={() => navigate('/staking/trader')} className="activity-button">Go to Staking</button></div>
              <div className="activity-card"><div className="activity-header"><h2 className="activity-title">Competitions</h2><span className="activity-count">{competitionCount} active</span></div><p className="activity-text">Participate and win prizes</p><button onClick={() => navigate('/competition/trader')} className="activity-button">Go to Competitions</button></div>
              <div className="activity-card"><div className="activity-header"><h2 className="activity-title">Airdrops</h2><span className="activity-count">{airdropCount} active</span></div><p className="activity-text">Get free tokens</p><button onClick={() => navigate('/airdrop/trader')} className="activity-button">Go to Airdrops</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
