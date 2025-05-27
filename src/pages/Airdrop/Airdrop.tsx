import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import './styles/AirdropStyles.css';

export interface TokenAirdrop {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  logoUrl: string;
  totalAmount: string;
  remainingAmount: string;
  description: string;
  requirements: {
    type: string;
    url: string;
    description: string;
  }[];
  createdAt: string;
  endDate: string;
  creatorAddress: string;
}

// === MOCK DATA ===
const MOCK_AIRDROPS: TokenAirdrop[] = [
  {
    id: '1',
    tokenSymbol: 'TON',
    tokenName: 'Toncoin',
    logoUrl: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/toncoin-toncoin-6888837-5645461.png',
    totalAmount: '500000',
    remainingAmount: '122450',
    description: 'Аирдроп для держателей TON! Участвуйте и получите свои Toncoin.',
    requirements: [
      {
        type: 'telegram',
        url: 'https://t.me/toncoin_official',
        description: 'Подпишитесь на официальный Telegram TON',
      },
      {
        type: 'website',
        url: 'https://ton.org/',
        description: 'Посетите сайт проекта',
      },
    ],
    createdAt: '2025-05-01T12:00:00Z',
    endDate: '2025-07-01T12:00:00Z',
    creatorAddress: 'EQAx...',
  },
  {
    id: '2',
    tokenSymbol: 'NOT',
    tokenName: 'Notcoin',
    logoUrl: 'https://cdn3d.iconscout.com/3d/premium/thumb/notcoin-not-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--btc-bitcoin-cryptocurrency-pack-science-technology-icons-10300408.png?f=webp',
    totalAmount: '25000000',
    remainingAmount: '16600000',
    description: 'Раздача NOTCOIN для всех подписчиков Telegram-канала NOT!',
    requirements: [
      {
        type: 'telegram',
        url: 'https://t.me/notcoin',
        description: 'Подпишитесь на канал Notcoin',
      },
      {
        type: 'twitter',
        url: 'https://twitter.com/notcoin_crypto',
        description: 'Подпишитесь на Twitter Notcoin',
      },
    ],
    createdAt: '2025-04-15T13:00:00Z',
    endDate: '2025-06-30T14:00:00Z',
    creatorAddress: 'EQBt...',
  },
  {
    id: '3',
    tokenSymbol: 'JET',
    tokenName: 'Jetton',
    logoUrl: 'https://img.cryptorank.io/coins/jet_ton_games1704976992995.png',
    totalAmount: '1000000',
    remainingAmount: '320000',
    description: 'Jetton для активных пользователей! Не забудьте выполнить все задания.',
    requirements: [
      {
        type: 'website',
        url: 'https://jetton.games/',
        description: 'Пройдите регистрацию на сайте Jetton',
      },
    ],
    createdAt: '2025-05-12T11:00:00Z',
    endDate: '2025-08-01T11:00:00Z',
    creatorAddress: 'EQCk...',
  },
];

// === MOCK HELPERS ===
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}
function calculateRemainingPercent(total: string, left: string): number {
  const t = parseFloat(total), l = parseFloat(left);
  if (!t) return 0;
  return Math.round(((t - l) / t) * 100);
}
// --- Mock  ---
function mockCheckAirdropRequirements() {
  return Promise.resolve({ completed: true, requirements: [{ completed: true }, { completed: true }] });
}
// --- Mock claim  ---
function mockClaimAirdrop() { return Promise.resolve(true); }
// --- Mock end (всегда успех) ---
function mockEndAirdrop() { return Promise.resolve(true); }

const Airdrop: React.FC<{ creatorMode: boolean }> = ({ creatorMode }) => {
  const { walletAddress } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [airdrops, setAirdrops] = useState<TokenAirdrop[]>([]);
  const [selectedAirdrop, setSelectedAirdrop] = useState<TokenAirdrop | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [requirementsStatus, setRequirementsStatus] = useState<any>(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      setLoading(true);
      setTimeout(() => {
        setAirdrops(MOCK_AIRDROPS);
        setLoading(false);
      }, 400);
    }
  }, [walletAddress, creatorMode]);

  const handleAirdropClick = async (airdrop: TokenAirdrop) => {
    setSelectedAirdrop(airdrop);
    setShowDetailsModal(true);
    if (walletAddress && !creatorMode) {
      try {
        const status = await mockCheckAirdropRequirements();
        setRequirementsStatus(status);
      } catch (error) {
        setRequirementsStatus(null);
      }
    }
  };
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAirdrop(null);
    setRequirementsStatus(null);
  };
  const navigateToCreateAirdrop = () => { navigate('/airdrop/create'); };
  const navigateToEditAirdrop = (airdropId: string) => { navigate(`/airdrop/edit/${airdropId}`); };
  const handleClaimAirdrop = async () => {
    if (!walletAddress || !selectedAirdrop) return;
    setClaimLoading(true);
    try {
      const success = await mockClaimAirdrop();
      if (success) {
        alert('Токены успешно получены!');
        closeDetailsModal();
      } else {
        alert('Не удалось получить токены. Пожалуйста, проверьте, что вы выполнили все требования.');
      }
    } catch (error) {
      alert('Произошла ошибка при получении токенов');
    } finally {
      setClaimLoading(false);
    }
  };
  const handleEndAirdrop = async () => {
    if (!walletAddress || !selectedAirdrop) return;
    if (!window.confirm('Вы уверены, что хотите завершить аирдроп? Это действие нельзя отменить.')) return;
    setEndLoading(true);
    try {
      const success = await mockEndAirdrop();
      if (success) {
        alert('Аирдроп успешно завершен!');
        closeDetailsModal();
      } else {
        alert('Не удалось завершить аирдроп.');
      }
    } catch (error) {
      alert('Произошла ошибка при завершении аирдропа');
    } finally {
      setEndLoading(false);
    }
  };

  return (
    <div className="airdrop-container">
      <div className="airdrop-content container mx-auto">
        <div className="airdrop-wrapper">
          <div className="airdrop-header">
            <h1 className="airdrop-title">
              Airdrop {creatorMode ? 'для создателя токена' : 'для трейдера'}
            </h1>
            {creatorMode && (
              <button onClick={navigateToCreateAirdrop} className="create-button">Создать Airdrop</button>
            )}
          </div>

          {!walletAddress ? (
            <div className="card">
              <h2 className="card-title">Подключите кошелек</h2>
              <p className="card-text">Для просмотра доступных аирдропов необходимо подключить кошелек</p>
            </div>
          ) : loading ? (
            <div className="loading-spinner-container"><div className="loading-spinner"></div></div>
          ) : airdrops.length === 0 ? (
            <div className="card">
              <h2 className="card-title">Нет доступных аирдропов</h2>
              <p className="card-text">
                {creatorMode
                  ? 'У вас пока нет созданных аирдропов. Создайте новый аирдроп, чтобы начать распределение токенов.'
                  : 'В данный момент нет доступных аирдропов. Проверьте позже.'}
              </p>
            </div>
          ) : (
            <div className="airdrop-grid">
              {airdrops.map((airdrop) => (
                <div key={airdrop.id} onClick={() => handleAirdropClick(airdrop)} className="airdrop-item">
                  <div className="token-info">
                    <img src={airdrop.logoUrl} alt={airdrop.tokenName} className="token-logo" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50'; }} />
                    <div>
                      <h3 className="token-name">{airdrop.tokenName}</h3>
                      <p className="token-symbol">{airdrop.tokenSymbol}</p>
                    </div>
                  </div>
                  <p className="description">{airdrop.description}</p>
                  <div className="stats">
                    <div className="stat-row">
                      <span className="stat-label">Всего токенов:</span>
                      <span>{parseInt(airdrop.totalAmount).toLocaleString()} {airdrop.tokenSymbol}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Осталось:</span>
                      <span>{parseInt(airdrop.remainingAmount).toLocaleString()} {airdrop.tokenSymbol}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${calculateRemainingPercent(airdrop.totalAmount, airdrop.remainingAmount)}%` }}></div>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Дата окончания:</span>
                      <span>{formatDate(airdrop.endDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showDetailsModal && selectedAirdrop && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-inner">
              <div className="modal-header">
                <div className="modal-token-info">
                  <img src={selectedAirdrop.logoUrl} alt={selectedAirdrop.tokenName} className="modal-token-logo" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50'; }} />
                  <div>
                    <h2 className="modal-token-name">{selectedAirdrop.tokenName}</h2>
                    <p className="modal-token-symbol">{selectedAirdrop.tokenSymbol}</p>
                  </div>
                </div>
                <button onClick={closeDetailsModal} className="close-button">
                  <svg xmlns="http://www.w3.org/2000/svg" className="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <p className="modal-description">{selectedAirdrop.description}</p>
                <div className="stats-card">
                  <div className="modal-stat-row">
                    <span className="stat-label">Всего токенов:</span>
                    <span>{parseInt(selectedAirdrop.totalAmount).toLocaleString()} {selectedAirdrop.tokenSymbol}</span>
                  </div>
                  <div className="modal-stat-row">
                    <span className="stat-label">Осталось:</span>
                    <span>{parseInt(selectedAirdrop.remainingAmount).toLocaleString()} {selectedAirdrop.tokenSymbol}</span>
                  </div>
                  <div className="modal-progress-bar">
                    <div className="modal-progress-fill" style={{ width: `${calculateRemainingPercent(selectedAirdrop.totalAmount, selectedAirdrop.remainingAmount)}%` }}></div>
                  </div>
                  <div className="modal-stat-row">
                    <span className="stat-label">Дата создания:</span>
                    <span>{formatDate(selectedAirdrop.createdAt)}</span>
                  </div>
                  <div className="modal-stat-row">
                    <span className="stat-label">Дата окончания:</span>
                    <span>{formatDate(selectedAirdrop.endDate)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="requirements-title">Требования для получения токенов</h3>
                  <div className="requirements-list">
                    {selectedAirdrop.requirements.map((req, index) => (
                      <div key={index} className="requirement-item">
                        <h4 className="requirement-title">
                          {req.description}
                          {requirementsStatus && requirementsStatus.requirements && requirementsStatus.requirements[index] && requirementsStatus.requirements[index].completed && (
                            <span className="completed-badge">✓ Выполнено</span>
                          )}
                        </h4>
                        <a href={req.url} target="_blank" rel="noopener noreferrer" className="requirement-link">
                          {req.type === 'twitter' && 'Перейти в Twitter'}
                          {req.type === 'telegram' && 'Перейти в Telegram'}
                          {req.type === 'discord' && 'Перейти в Discord'}
                          {req.type === 'website' && 'Перейти на сайт'}
                          {!['twitter', 'telegram', 'discord', 'website'].includes(req.type) && 'Перейти по ссылке'}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                {!creatorMode && (
                  <button className={`claim-button ${claimLoading ? 'loading' : ''} ${requirementsStatus && !requirementsStatus.completed ? 'disabled' : ''}`}
                    onClick={handleClaimAirdrop}
                    disabled={claimLoading || (requirementsStatus && !requirementsStatus.completed)}>
                    {claimLoading ? 'Получение...' : requirementsStatus && !requirementsStatus.completed ? 'Выполните все требования' : 'Получить токены'}
                  </button>
                )}
                {creatorMode && (
                  <div className="button-group">
                    <button className="edit-button" onClick={() => navigateToEditAirdrop(selectedAirdrop.id)}>Редактировать аирдроп</button>
                    <button className={`end-button ${endLoading ? 'loading' : ''}`} onClick={handleEndAirdrop} disabled={endLoading}>
                      {endLoading ? 'Завершение...' : 'Завершить аирдроп'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Airdrop;
