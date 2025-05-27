import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import './styles/CompetitionStyles.css';

// ---- MOCKS ----
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function calculateTimeLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Завершено';
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  if (d > 0) return `${d} д. ${h} ч.`;
  if (h > 0) return `${h} ч. ${m} мин.`;
  return `${m} мин.`;
}

function getStatusLabel(status: string, endDate: string) {
  switch (status) {
    case 'scheduled':
      return 'Ожидается';
    case 'active':
      return calculateTimeLeft(endDate);
    case 'completed':
      return 'Завершено';
    default:
      return status;
  }
}

export interface CompetitionCriteria {
  topCount: number;
  minVolume: string;
  duration: string;
  prizeDistribution: number[];
}

export interface TradingCompetition {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  logoUrl: string;
  prizePool: string;
  description: string;
  criteria: CompetitionCriteria;
  participants: number;
  createdAt: string;
  endDate: string;
  status: 'scheduled' | 'active' | 'completed';
  creatorAddress: string;
  winners?: {
    address: string;
    place: number;
    prize: string;
    volume: string;
  }[];
}

export interface UserCompetitionStats {
  competitionId: string;
  address: string;
  rank: number;
  volume: string;
  eligibleForPrize: boolean;
}

// ---- MOCK DATA ----
const MOCK_COMPETITIONS: TradingCompetition[] = [
  {
    id: '1',
    tokenSymbol: 'TON',
    tokenName: 'Toncoin',
    logoUrl: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/toncoin-toncoin-6888837-5645461.png',
    prizePool: '10000',
    description: 'Торгуй TON и получи шанс выиграть часть призового фонда!',
    criteria: {
      topCount: 5,
      minVolume: '100',
      duration: '7d',
      prizeDistribution: [40, 25, 15, 10, 10]
    },
    participants: 37,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'active',
    creatorAddress: 'EQC1example...',
    winners: undefined
  },
  {
    id: '2',
    tokenSymbol: 'JET',
    tokenName: 'Jetton',
    logoUrl: 'https://img.cryptorank.io/coins/jet_ton_games1704976992995.png',
    prizePool: '35000',
    description: 'Jetton: награды для топ-10 трейдеров.',
    criteria: {
      topCount: 10,
      minVolume: '200',
      duration: '10d',
      prizeDistribution: [30, 20, 15, 10, 7, 6, 4, 3, 3, 2]
    },
    participants: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'completed',
    creatorAddress: 'EQC1example...',
    winners: [
      { address: 'EQC1aaaaabbbbbb', place: 1, prize: '10500', volume: '8500' },
      { address: 'EQC1ccccccdddddd', place: 2, prize: '7000', volume: '7700' },
      { address: 'EQC1eeeeeeffffff', place: 3, prize: '5250', volume: '6700' },
      { address: 'EQC1gggggghhhhhh', place: 4, prize: '3500', volume: '6200' },
      { address: 'EQC1iiiiiiijjjjj', place: 5, prize: '2450', volume: '5400' },
      // ...
    ]
  }
];

const MOCK_USER_STATS: UserCompetitionStats = {
  competitionId: '1',
  address: 'EQC1UserAddress',
  rank: 3,
  volume: '1650',
  eligibleForPrize: true,
};

const Competition: React.FC<{ creatorMode: boolean }> = ({ creatorMode }) => {
  const { walletAddress } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [competitions, setCompetitions] = useState<TradingCompetition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<TradingCompetition | null>(null);
  const [userStats, setUserStats] = useState<UserCompetitionStats | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      setLoading(true);
      setTimeout(() => {
        setCompetitions(MOCK_COMPETITIONS);
        setUserStats(!creatorMode ? MOCK_USER_STATS : null);
        setLoading(false);
      }, 500);
    }
  }, [walletAddress, creatorMode]);

  const handleCompetitionClick = (competition: TradingCompetition) => {
    setSelectedCompetition(competition);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCompetition(null);
  };

  const navigateToCreateCompetition = () => {
    navigate('/competition/creator');
  };

  const handleTradeClick = (tokenSymbol: string) => {
    navigate(`/trade/swap?token=${tokenSymbol}`);
    closeDetailsModal();
  };

  return (
    <div className="competition-container">
      <div className="competition-content container mx-auto">
        <div className="content-wrapper">
          <div className="header">
            <h1 className="title">
              Trading Competition {creatorMode ? 'для создателя токена' : 'для трейдера'}
            </h1>
            {creatorMode && (
              <button onClick={navigateToCreateCompetition} className="create-button">
                Создать соревнование
              </button>
            )}
          </div>

          {!walletAddress ? (
            <div className="no-wallet-card">
              <h2 className="no-wallet-title">Подключите кошелек</h2>
              <p className="no-wallet-text">
                Для просмотра соревнований необходимо подключить кошелек
              </p>
            </div>
          ) : loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : competitions.length === 0 ? (
            <div className="no-competitions-card">
              <h2 className="no-competitions-title">Нет доступных соревнований</h2>
              <p className="no-competitions-text">
                {creatorMode
                  ? 'У вас пока нет созданных соревнований. Создайте новое соревнование!'
                  : 'В данный момент нет доступных соревнований. Проверьте позже.'}
              </p>
            </div>
          ) : (
            <>
              {!creatorMode && userStats && (
                <div className="user-stats-card">
                  <h2 className="user-stats-title">Ваши результаты</h2>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Текущее место</span>
                      <span className="stat-value">{userStats.rank}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Объем торгов</span>
                      <span className="stat-value">{userStats.volume} TON</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">До призовой зоны</span>
                      <span className="stat-value">
                        {userStats.rank <= 5 ? 'В призовой зоне' : `${userStats.rank - 5} мест`}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Статус</span>
                      <span
                        className={`stat-status ${
                          userStats.eligibleForPrize ? 'stat-status-eligible' : 'stat-status-not-eligible'
                        }`}
                      >
                        {userStats.eligibleForPrize ? 'Участвует' : 'Не участвует'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="competitions-grid">
                {competitions.map((competition) => (
                  <div
                    key={competition.id}
                    onClick={() => handleCompetitionClick(competition)}
                    className="competition-card"
                  >
                    <div className="card-header">
                      <img
                        src={competition.logoUrl}
                        alt={competition.tokenName}
                        className="token-logo"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
                        }}
                      />
                      <div className="token-info">
                        <div className="token-header">
                          <h3 className="token-name">{competition.tokenName}</h3>
                          <span
                            className={`status-badge ${
                              competition.status === 'active'
                                ? 'status-active'
                                : competition.status === 'completed'
                                ? 'status-completed'
                                : 'status-scheduled'
                            }`}
                          >
                            {getStatusLabel(competition.status, competition.endDate)}
                          </span>
                        </div>
                        <p className="token-symbol">{competition.tokenSymbol}</p>
                      </div>
                    </div>
                    <p className="description">{competition.description}</p>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Призовой фонд:</span>
                        <span>{parseInt(competition.prizePool).toLocaleString()} {competition.tokenSymbol}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Участников:</span>
                        <span>{competition.participants}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Мин. объем торгов:</span>
                        <span>{competition.criteria.minVolume} TON</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Окончание:</span>
                        <span>{formatDate(competition.endDate)}</span>
                      </div>
                      {competition.status === 'active' && (
                        <div className="detail-item">
                          <span className="detail-label">Осталось:</span>
                          <span className="time-left">{calculateTimeLeft(competition.endDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showDetailsModal && selectedCompetition && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-inner">
              <div className="modal-header">
                <div className="modal-token-header">
                  <img
                    src={selectedCompetition.logoUrl}
                    alt={selectedCompetition.tokenName}
                    className="modal-token-logo"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
                    }}
                  />
                  <div className="modal-token-info">
                    <h2 className="modal-token-name">{selectedCompetition.tokenName}</h2>
                    <span
                      className={`status-badge ${
                        selectedCompetition.status === 'active'
                          ? 'status-active'
                          : selectedCompetition.status === 'completed'
                          ? 'status-completed'
                          : 'status-scheduled'
                      }`}
                    >
                      {getStatusLabel(selectedCompetition.status, selectedCompetition.endDate)}
                    </span>
                  </div>
                </div>
                <button onClick={closeDetailsModal} className="modal-close">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="modal-close-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="modal-details">
                <p className="modal-description">{selectedCompetition.description}</p>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <p className="modal-info-label">Призовой фонд</p>
                    <p className="modal-info-value">
                      {parseInt(selectedCompetition.prizePool).toLocaleString()} {selectedCompetition.tokenSymbol}
                    </p>
                  </div>
                  <div className="modal-info-item">
                    <p className="modal-info-label">Дата начала</p>
                    <p className="modal-info-value">{formatDate(selectedCompetition.createdAt)}</p>
                  </div>
                  <div className="modal-info-item">
                    <p className="modal-info-label">Дата окончания</p>
                    <p className="modal-info-value">{formatDate(selectedCompetition.endDate)}</p>
                  </div>
                  <div className="modal-info-item">
                    <p className="modal-info-label">Участников</p>
                    <p className="modal-info-value">{selectedCompetition.participants}</p>
                  </div>
                  <div className="modal-info-item">
                    <p className="modal-info-label">Мин. объем торгов</p>
                    <p className="modal-info-value">{selectedCompetition.criteria.minVolume} TON</p>
                  </div>
                  <div className="modal-info-item">
                    <p className="modal-info-label">Призовых мест</p>
                    <p className="modal-info-value">{selectedCompetition.criteria.topCount}</p>
                  </div>
                </div>
                <div>
                  <h3 className="modal-section-title">Распределение призов</h3>
                  <div className="prize-distribution">
                    <div className="space-y-2">
                      {selectedCompetition.criteria.prizeDistribution.map((percent, index) => (
                        <div key={index} className="prize-item">
                          <span className="prize-place">
                            Место {index + 1} ({percent}%)
                          </span>
                          <span className="prize-amount">
                            {((parseInt(selectedCompetition.prizePool) * percent) / 100).toLocaleString()}{' '}
                            {selectedCompetition.tokenSymbol}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedCompetition.status === 'completed' && selectedCompetition.winners && (
                  <div>
                    <h3 className="modal-section-title">Результаты соревнования</h3>
                    <div className="results-table-container">
                      <table className="results-table">
                        <thead>
                          <tr className="table-header">
                            <th>Место</th>
                            <th>Адрес</th>
                            <th className="table-right">Объем</th>
                            <th className="table-right">Награда</th>
                          </tr>
                        </thead>
                        <tbody className="table-body">
                          {selectedCompetition.winners.map((winner) => (
                            <tr key={winner.address}>
                              <td>{winner.place}</td>
                              <td className="table-address">
                                {winner.address.substring(0, 6)}...{winner.address.substring(winner.address.length - 4)}
                              </td>
                              <td className="table-right">{winner.volume} TON</td>
                              <td className="table-right">
                                {parseInt(winner.prize).toLocaleString()} {selectedCompetition.tokenSymbol}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {!creatorMode && selectedCompetition.status === 'active' && (
                  <>
                    {userStats && (
                      <div className="user-stats-modal">
                        <h3 className="modal-section-title">Ваши результаты</h3>
                        <div className="user-stats-grid">
                          <div>
                            <p className="user-stat-label">Текущая позиция</p>
                            <p className="user-stat-value">{userStats.rank}</p>
                          </div>
                          <div>
                            <p className="user-stat-label">Ваш объем торгов</p>
                            <p className="user-stat-value">{userStats.volume} TON</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTradeClick(selectedCompetition.tokenSymbol);
                      }}
                      className="trade-button"
                    >
                      Торговать {selectedCompetition.tokenSymbol}
                    </button>
                  </>
                )}

                {creatorMode && (
                  <div className="button-group">
                    {selectedCompetition.status === 'active' && (
                      <button className="end-button">Завершить досрочно</button>
                    )}
                    {selectedCompetition.status === 'completed' && (
                      <button className="new-competition-button">Создать новое соревнование</button>
                    )}
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

export default Competition;
