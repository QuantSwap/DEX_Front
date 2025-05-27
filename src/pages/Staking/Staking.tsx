import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import './styles/StakingStyles.css';

export type StakingPeriod = '7' | '15' | '30';

export interface StakingPool {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  logoUrl: string;
  creatorAddress: string;
  description: string;
  apy: { [key in StakingPeriod]: number };
  usersCount: number;
  minStake: string;
  maxStake: string | null;
  totalStaked: string;
  createdAt: string;
  status: 'active' | 'paused' | 'completed';
}

export interface UserStake {
  poolId: string;
  tokenSymbol: string;
  amount: string;
  period: StakingPeriod;
  startDate: string;
  endDate: string;
  reward: string;
  status: 'active' | 'completed' | 'claimed';
}

// ==== Моки =======
const MOCK_POOLS: StakingPool[] = [
  {
    id: 'pool1',
    tokenSymbol: 'TON',
    tokenName: 'Toncoin',
    logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
    creatorAddress: 'EQAxabc...',
    description: 'Стейкинг TON: безопасно, быстро и выгодно.',
    apy: { '7': 3, '15': 7, '30': 12 },
    usersCount: 97,
    minStake: '10',
    maxStake: '1000',
    totalStaked: '84522',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: 'active',
  },
  {
    id: 'pool2',
    tokenSymbol: 'JET',
    tokenName: 'Jetton',
    logoUrl: 'https://img.cryptorank.io/coins/jet_ton_games1704976992995.png',
    creatorAddress: 'EQBxyza...',
    description: 'Пул Jetton для активных пользователей!',
    apy: { '7': 2, '15': 5, '30': 8 },
    usersCount: 41,
    minStake: '100',
    maxStake: null,
    totalStaked: '51000',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: 'active',
  },
  {
    id: 'pool3',
    tokenSymbol: 'NOT',
    tokenName: 'Notcoin',
    logoUrl: 'https://cdn3d.iconscout.com/3d/premium/thumb/notcoin-not-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--btc-bitcoin-cryptocurrency-pack-science-technology-icons-10300408.png?f=webp',
    creatorAddress: 'EQCklmn...',
    description: 'Попробуйте стейкинг Notcoin!',
    apy: { '7': 1, '15': 3, '30': 4 },
    usersCount: 24,
    minStake: '5',
    maxStake: '300',
    totalStaked: '8400',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    status: 'paused',
  },
];

const MOCK_USER_STAKES: UserStake[] = [
  {
    poolId: 'pool1',
    tokenSymbol: 'TON',
    amount: '42',
    period: '15',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    reward: '1.77',
    status: 'active',
  },
  {
    poolId: 'pool2',
    tokenSymbol: 'JET',
    amount: '222',
    period: '7',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    reward: '0.82',
    status: 'completed',
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
function calculateTimeLeft(endDate: string) {
  const ms = new Date(endDate).getTime() - Date.now();
  if (ms < 0) return '0 дней';
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return `${days} дн.`;
}
function calculateStakingReward(amount: string, apy: number, period: number) {
  const a = parseFloat(amount || '0');
  return ((a * apy) / 100) * (period / 365);
}

const Staking: React.FC<{ creatorMode: boolean }> = ({ creatorMode }) => {
  const { walletAddress } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeForm, setStakeForm] = useState({ amount: '', period: '7' as StakingPeriod });

  useEffect(() => {
    if (walletAddress) {
      setLoading(true);
      setTimeout(() => {
        setStakingPools(MOCK_POOLS);
        setUserStakes(MOCK_USER_STAKES);
        setLoading(false);
      }, 150); 
    }
  }, [walletAddress, creatorMode]);

  return (
    <div className="staking-container">
      <div className="staking-content container mx-auto">
        <div className="content-wrapper">
          <div className="header">
            <h1 className="title">Staking {creatorMode ? 'для создателя токена' : 'для трейдера'}</h1>
            {creatorMode && (
              <button onClick={() => navigate('/staking/creator')} className="create-button">
                Создать стейкинг
              </button>
            )}
          </div>

          {!walletAddress ? (
            <div className="no-wallet-card">
              <h2 className="no-wallet-title">Подключите кошелек</h2>
              <p className="no-wallet-text">Для доступа к стейкингу необходимо подключить кошелек</p>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <>
              {!creatorMode && userStakes.length > 0 && (
                <div className="stakes-section">
                  <h2 className="section-title">Ваши активные стейки</h2>
                  <div className="stakes-grid">
                    {userStakes.map((stake, index) => (
                      <div key={index} className="stake-card">
                        <div className="stake-header">
                          <h3 className="stake-title">{stake.tokenSymbol}</h3>
                          <span
                            className={`status-badge ${
                              stake.status === 'active'
                                ? 'status-active'
                                : stake.status === 'completed'
                                ? 'status-completed'
                                : 'status-claimed'
                            }`}
                          >
                            {stake.status === 'active'
                              ? 'Активен'
                              : stake.status === 'completed'
                              ? 'Завершен'
                              : 'Получен'}
                          </span>
                        </div>
                        <div className="stake-details">
                          <div className="detail-item">
                            <span className="detail-label">Сумма:</span>
                            <span>{stake.amount} {stake.tokenSymbol}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Период:</span>
                            <span>{stake.period} дней</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Дата окончания:</span>
                            <span>{formatDate(stake.endDate)}</span>
                          </div>
                          {stake.status === 'active' && (
                            <div className="detail-item">
                              <span className="detail-label">Осталось:</span>
                              <span className="detail-value-green">{calculateTimeLeft(stake.endDate)}</span>
                            </div>
                          )}
                          <div className="detail-item">
                            <span className="detail-label">Вознаграждение:</span>
                            <span className="detail-value-green">{stake.reward} {stake.tokenSymbol}</span>
                          </div>
                          {stake.status === 'completed' && (
                            <button
                              onClick={() => alert('Мок: Получено!')}
                              className="claim-button"
                            >
                              Получить вознаграждение
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pools-section">
                <h2 className="section-title">{creatorMode ? 'Ваши пулы стейкинга' : 'Доступные пулы стейкинга'}</h2>
                {stakingPools.length === 0 ? (
                  <div className="no-pools-card">
                    <h3 className="no-pools-title">Нет доступных пулов стейкинга</h3>
                    <p className="no-pools-text">
                      {creatorMode
                        ? 'У вас пока нет созданных пулов стейкинга. Создайте новый пул!'
                        : 'В данный момент нет доступных пулов стейкинга. Проверьте позже.'}
                    </p>
                  </div>
                ) : (
                  <div className="pools-grid">
                    {stakingPools.map((pool) => (
                      <div
                        key={pool.id}
                        onClick={() => {
                          if (!creatorMode) {
                            setSelectedPool(pool);
                            setShowStakeModal(true);
                            setStakeForm({ amount: '', period: '7' });
                          }
                        }}
                        className={`pool-card ${!creatorMode ? 'hoverable' : ''}`}
                      >
                        <div className="pool-header">
                          <img
                            src={pool.logoUrl}
                            alt={pool.tokenName}
                            className="pool-logo"
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50')}
                          />
                          <div className="pool-info">
                            <div className="flex justify-between items-center">
                              <h3 className="pool-title">{pool.tokenName}</h3>
                              <span
                                className={`status-badge ${
                                  pool.status === 'active'
                                    ? 'status-active'
                                    : pool.status === 'paused'
                                    ? 'status-paused'
                                    : 'status-completed'
                                }`}
                              >
                                {pool.status === 'active'
                                  ? 'Активен'
                                  : pool.status === 'paused'
                                  ? 'Приостановлен'
                                  : 'Завершен'}
                              </span>
                            </div>
                            <p className="pool-symbol">{pool.tokenSymbol}</p>
                          </div>
                        </div>
                        <p className="pool-description">{pool.description}</p>
                        <div className="apy-grid">
                          {(['7', '15', '30'] as StakingPeriod[]).map(
                            (period) =>
                              pool.apy[period] > 0 && (
                                <div key={period} className="apy-item">
                                  <span className="apy-label">{period} дней</span>
                                  <span className="apy-value">{pool.apy[period]}%</span>
                                </div>
                              )
                          )}
                        </div>
                        <div className="pool-stats">
                          <div className="stat-item">
                            <span className="detail-label">Мин. стейк:</span>
                            <span>{parseInt(pool.minStake).toLocaleString()} {pool.tokenSymbol}</span>
                          </div>
                          {pool.maxStake && (
                            <div className="stat-item">
                              <span className="detail-label">Макс. стейк:</span>
                              <span>{parseInt(pool.maxStake).toLocaleString()} {pool.tokenSymbol}</span>
                            </div>
                          )}
                          <div className="stat-item">
                            <span className="detail-label">Всего застейкано:</span>
                            <span>{parseInt(pool.totalStaked).toLocaleString()} {pool.tokenSymbol}</span>
                          </div>
                          <div className="stat-item">
                            <span className="detail-label">Участников:</span>
                            <span>{pool.usersCount}</span>
                          </div>
                        </div>
                        {creatorMode && (
                          <div className="pool-actions">
                            <button
                              className="action-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/staking/details/${pool.id}`);
                              }}
                            >
                              Статистика
                            </button>
                            <button
                              className={`toggle-button ${pool.status === 'active' ? 'active' : 'paused'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(pool.status === 'active' ? 'Стейкинг приостановлен' : 'Стейкинг активирован');
                              }}
                            >
                              {pool.status === 'active' ? 'Приостановить' : 'Активировать'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showStakeModal && selectedPool && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-padding">
              <div className="modal-header">
                <div className="flex items-center">
                  <img
                    src={selectedPool.logoUrl}
                    alt={selectedPool.tokenName}
                    className="pool-logo"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50')}
                  />
                  <div>
                    <h2 className="modal-title">{selectedPool.tokenName}</h2>
                    <p className="modal-symbol">{selectedPool.tokenSymbol}</p>
                  </div>
                </div>
                <button onClick={() => setShowStakeModal(false)} className="close-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="modal-description">{selectedPool.description}</p>
              <div className="modal-apy-grid">
                {(['7', '15', '30'] as StakingPeriod[]).map(
                  (period) =>
                    selectedPool.apy[period] > 0 && (
                      <div key={period} className="text-center">
                        <span className="apy-label">{period} дней</span>
                        <span className="apy-value">{selectedPool.apy[period]}%</span>
                      </div>
                    )
                )}
              </div>
              <div className="modal-form">
                <div className="form-group">
                  <label className="form-label">Сумма стейкинга</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amount"
                      value={stakeForm.amount}
                      onChange={e => setStakeForm(f => ({ ...f, amount: e.target.value }))}
                      className="form-input"
                      placeholder={`Мин. ${selectedPool.minStake}`}
                      min={selectedPool.minStake}
                      max={selectedPool.maxStake || undefined}
                    />
                    <span className="input-unit">{selectedPool.tokenSymbol}</span>
                  </div>
                  <div className="form-limits">
                    <span>Мин: {selectedPool.minStake} {selectedPool.tokenSymbol}</span>
                    {selectedPool.maxStake && (
                      <span>Макс: {selectedPool.maxStake} {selectedPool.tokenSymbol}</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Период стейкинга</label>
                  <select
                    name="period"
                    value={stakeForm.period}
                    onChange={e => setStakeForm(f => ({ ...f, period: e.target.value as StakingPeriod }))}
                    className="form-select"
                  >
                    {(['7', '15', '30'] as StakingPeriod[]).map(
                      (period) =>
                        selectedPool.apy[period] > 0 && (
                          <option key={period} value={period}>
                            {period} дней - {selectedPool.apy[period]}% APY
                          </option>
                        )
                    )}
                  </select>
                </div>
                {stakeForm.amount && (
                  <div className="summary-card">
                    <div className="summary-item">
                      <span className="detail-label">Сумма:</span>
                      <span>{parseFloat(stakeForm.amount).toLocaleString()} {selectedPool.tokenSymbol}</span>
                    </div>
                    <div className="summary-item">
                      <span className="detail-label">Период:</span>
                      <span>{stakeForm.period} дней</span>
                    </div>
                    <div className="summary-item">
                      <span className="detail-label">APY:</span>
                      <span className="detail-value-green">
                        {selectedPool.apy[stakeForm.period as StakingPeriod]}%
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="detail-label">Вознаграждение:</span>
                      <span className="detail-value-green">
                        {calculateStakingReward(
                          stakeForm.amount,
                          selectedPool.apy[stakeForm.period as StakingPeriod],
                          parseInt(stakeForm.period)
                        ).toFixed(4)}{' '}
                        {selectedPool.tokenSymbol}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    alert('Мок: Стейк отправлен!');
                    setShowStakeModal(false);
                  }}
                  className="stake-button"
                >
                  Стейкнуть {selectedPool.tokenSymbol}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staking;
