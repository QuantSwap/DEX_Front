import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import './styles/DashboardCreatorStyles.css';

export interface TokenInfo {
  symbol: string;
  name: string;
  totalSupply: string;
  price: string;
  liquidity: string;
  holders: number;
}
export interface AirdropInfo {
  totalDistributed: string;
  recipients: number;
  status: 'active' | 'completed' | 'scheduled';
  endDate?: string;
}
export interface StakingInfo {
  totalStaked: string;
  apy: string;
  stakersCount: number;
  rewards: string;
}
export interface CompetitionInfo {
  status: 'active' | 'completed' | 'scheduled';
  participants: number;
  prizePool: string;
  endDate?: string;
}
export interface DistributionInfo {
  totalDistributed: string;
  recipients: number;
  lastDistribution: string;
}
export interface OrderInfo {
  type: 'buy' | 'sell';
  price: string;
  amount: string;
  total: string;
  filled: string;
  status: 'open' | 'partial' | 'filled' | 'cancelled';
}

// ======= DEMO MOCKS =======
const DEMO_TOKEN: TokenInfo = {
  symbol: 'JET',
  name: 'Jetton',
  totalSupply: '1,000,000',
  price: '0.035',
  liquidity: '23,100',
  holders: 1314,
};
const DEMO_AIRDROP: AirdropInfo = {
  totalDistributed: '120,000',
  recipients: 511,
  status: 'completed',
};
const DEMO_STAKING: StakingInfo = {
  totalStaked: '23,420',
  apy: '14.2%',
  stakersCount: 55,
  rewards: '2,550',
};
const DEMO_COMPETITION: CompetitionInfo = {
  status: 'scheduled',
  participants: 40,
  prizePool: '7,500',
  endDate: '2024-06-15',
};
const DEMO_DISTRIBUTION: DistributionInfo = {
  totalDistributed: '37,200',
  recipients: 401,
  lastDistribution: '2024-05-23',
};
const DEMO_ORDERBOOK: OrderInfo[] = [
  { type: 'buy', price: '0.034', amount: '1200', total: '40.8', filled: '0', status: 'open' },
  { type: 'buy', price: '0.033', amount: '950', total: '31.35', filled: '0', status: 'open' },
  { type: 'sell', price: '0.038', amount: '700', total: '26.6', filled: '0', status: 'open' },
  { type: 'sell', price: '0.040', amount: '380', total: '15.2', filled: '0', status: 'open' },
];


const DashboardCreator: React.FC = () => {
  const navigate = useNavigate();
  const { walletAddress, connectWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(DEMO_TOKEN);
  const [airdropInfo, setAirdropInfo] = useState<AirdropInfo | null>(DEMO_AIRDROP);
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(DEMO_STAKING);
  const [competitionInfo, setCompetitionInfo] = useState<CompetitionInfo | null>(DEMO_COMPETITION);
  const [distributionInfo, setDistributionInfo] = useState<DistributionInfo | null>(DEMO_DISTRIBUTION);
  const [orderbook, setOrderbook] = useState<OrderInfo[]>(DEMO_ORDERBOOK);

  const handleCreateAction = (_addr: string, _connect: any, nav: any, path: string) => {
    nav(path);
  };

  const NoDataPlaceholder = () => (
    <div className="no-data">No data available or loading...</div>
  );

  return (
    <div className="dashboard-creator-container">
      <div className="dashboard-creator-content container mx-auto">
        <div className="content-wrapper">
          <h1 className="title">Creator Panel</h1>

          {!walletAddress ? (
            <div className="no-wallet-card">
              <h2 className="no-wallet-title">Connect Wallet</h2>
              <p className="no-wallet-text">Connect your wallet to access the creator panel</p>
              <button onClick={connectWallet} className="connect-button">Connect Wallet</button>
            </div>
          ) : (
            <div className="section">
              <div className="card">
                <h2 className="card-title">Create Jetton</h2>
                <button onClick={() => handleCreateAction(walletAddress, connectWallet, navigate, '/jetton/create')} className="action-button">Create new Jetton</button>
              </div>

              <div className="card">
                <h2 className="card-title">Your Token</h2>
                {tokenInfo ? (
                  <div className="token-grid">
                    <div className="token-item"><div className="token-label">Token</div><div className="token-value">{tokenInfo.symbol} - {tokenInfo.name}</div></div>
                    <div className="token-item"><div className="token-label">Total Supply</div><div className="token-value">{tokenInfo.totalSupply}</div></div>
                    <div className="token-item"><div className="token-label">Current Price</div><div className="token-value">{tokenInfo.price}</div></div>
                  </div>
                ) : (<NoDataPlaceholder />)}
              </div>

              <div className="info-grid">
                <div className="card">
                  <h2 className="card-title">Airdrop</h2>
                  {airdropInfo ? (
                    <div className="info-item">
                      <div className="info-row"><span className="info-label">Total Distributed:</span><span>{airdropInfo.totalDistributed}</span></div>
                      <button onClick={() => handleCreateAction(walletAddress, connectWallet, navigate, '/airdrop/create')} className="action-button mt-4">{airdropInfo.status === 'active' ? 'Manage Airdrop' : 'Create Airdrop'}</button>
                    </div>
                  ) : (
                    <div className="info-item"><NoDataPlaceholder /><button onClick={() => handleCreateAction(walletAddress, connectWallet, navigate, '/airdrop/create')} className="action-button">Create Airdrop</button></div>
                  )}
                </div>
                <div className="card">
                  <h2 className="card-title">Staking</h2>
                  {stakingInfo ? (
                    <div className="info-item">
                      <div className="info-row"><span className="info-label">Staked:</span><span>{stakingInfo.totalStaked}</span></div>
                      <button onClick={() => handleCreateAction(walletAddress, connectWallet, navigate, '/staking/create')} className="action-button mt-4">{stakingInfo ? 'Manage Staking' : 'Create Staking'}</button>
                    </div>
                  ) : (
                    <div className="info-item"><NoDataPlaceholder /><button onClick={() => handleCreateAction(walletAddress, connectWallet, navigate, '/staking/create')} className="action-button">Create Staking</button></div>
                  )}
                </div>
              </div>

              <div className="info-grid">
                <div className="card">
                  <h2 className="card-title">Competition</h2>
                  {competitionInfo ? (
                    <div className="info-item">
                      <div className="info-row"><span className="info-label">Participants:</span><span>{competitionInfo.participants}</span></div>
                      <button onClick={() => handleCreateAction(walletAddress, connectWallet, navigate, '/competition/create')} className="action-button mt-4">{competitionInfo.status === 'active' ? 'Manage Competition' : 'Create Competition'}</button>
                    </div>
                  ) : (
                    <div className="info-item"><NoDataPlaceholder /><button onClick={() => handleCreateAction(walletAddress, connectWallet, navigate, '/competition/create')} className="action-button">Create Competition</button></div>
                  )}
                </div>
                <div className="card">
                  <h2 className="card-title">Distribution</h2>
                  {distributionInfo ? (
                    <div className="info-item">
                      <div className="info-row"><span className="info-label">Total Distributed:</span><span>{distributionInfo.totalDistributed}</span></div>
                      <button onClick={() => handleCreateAction(walletAddress, connectWallet, navigate, '/distribution/create')} className="action-button mt-4">Manage Distribution</button>
                    </div>
                  ) : (
                    <div className="info-item"><NoDataPlaceholder /><button onClick={() => handleCreateAction(walletAddress, connectWallet, navigate, '/distribution/create')} className="action-button">Create Distribution</button></div>
                  )}
                </div>
              </div>

              <div className="orderbook-card">
                <div className="orderbook-header">
                  <h2 className="orderbook-title">Token Orderbook</h2>
                  <p className="orderbook-subtitle">Active buy and sell orders for your token</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="orderbook-table">
                    <thead><tr><th>Type</th><th className="text-right">Price</th><th className="text-right">Amount</th></tr></thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={3} className="no-orders">Loading...</td></tr>
                      ) : orderbook.length > 0 ? (
                        orderbook.map((order, index) => (
                          <tr key={index}><td>{order.type}</td><td className="text-right">{order.price}</td><td className="text-right">{order.amount}</td></tr>
                        ))
                      ) : (
                        <tr><td colSpan={3} className="no-orders">No active orders</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCreator;
