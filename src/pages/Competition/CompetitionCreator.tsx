import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import {
  CompetitionForm,
  initialCompetitionForm,
  fetchUserTokens,
  calculateTonFee,
  calculateTokenFee,
  calculateTotalTokensRequired,
  isDistributionValid,
  handleInputChange,
  validateForm,
  handlePayment,
} from '../../utils/Сompetition/competitionCreatorUtils';
import './styles/CompetitionCreatorStyles.css';

export interface Token {
  symbol: string;
  name: string;
  balance: string;
}

export interface CompetitionCriteria {
  topCount: number;
  minVolume: string;
  duration: string;
  prizeDistribution: number[];
}

const CompetitionCreator: React.FC = () => {
  const { walletAddress, connectWallet, sendTransaction } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'initial' | 'pending' | 'success' | 'failed'>('initial');
  const [competitionForm, setCompetitionForm] = useState<CompetitionForm>(initialCompetitionForm);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [tonFee, setTonFee] = useState<number>(0);
  const [tokenFee, setTokenFee] = useState<number>(0);
  const [totalTokens, setTotalTokens] = useState<number>(0);

  useEffect(() => {
    if (walletAddress) {
      loadUserTokens();
      updateFees();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      updateFees();
    }
  }, [competitionForm.prizePool]);

  const loadUserTokens = async () => {
    if (!walletAddress) return;
    setLoading(true);
    const tokens = await fetchUserTokens(walletAddress);
    setUserTokens(tokens);
    setLoading(false);
  };

  const updateFees = async () => {
    if (!walletAddress) return;
    const ton = await calculateTonFee(walletAddress);
    const token = await calculateTokenFee(competitionForm.prizePool, walletAddress);
    setTonFee(ton);
    setTokenFee(token);
    setTotalTokens(calculateTotalTokensRequired(competitionForm.prizePool, token));
  };

  const handleOpenPaymentModal = () => {
    const error = validateForm(competitionForm);
    if (error) {
      alert(error);
      return;
    }
    setIsPaymentModalOpen(true);
    setPaymentStatus('initial');
  };

  const onPaymentClick = () => {
    if (!walletAddress) return;
    handlePayment(
      walletAddress,
      competitionForm,
      sendTransaction,
      setPaymentStatus,
      connectWallet,
      navigate,
      setIsPaymentModalOpen
    );
  };

  return (
    <div className="creator-container">
      <div className="creator-content container mx-auto">
        <div className="content-wrapper">
          <h1 className="title">Создать Trading Competition</h1>

          {!walletAddress ? (
            <div className="no-wallet-card">
              <h2 className="no-wallet-title">Подключите кошелек</h2>
              <p className="no-wallet-text">
                Для создания соревнования необходимо подключить кошелек
              </p>
              <button onClick={connectWallet} className="connect-button">
                Подключить кошелек
              </button>
            </div>
          ) : (
            <div className="section">
              <div className="cost-card">
                <h2 className="section-title">Стоимость создания соревнования</h2>
                <div className="cost-details">
                  <div className="cost-item">
                    <span className="cost-label">Базовая стоимость в TON:</span>
                    <span className="cost-value">{tonFee} TON</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Комиссия в токенах (5%):</span>
                    <span className="cost-value">
                      {tokenFee.toFixed(2)} {competitionForm.tokenSymbol || 'Токенов'}
                    </span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Всего токенов к оплате:</span>
                    <span className="cost-value-bold">
                      {totalTokens.toFixed(2)} {competitionForm.tokenSymbol || 'Токенов'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-card">
                <h2 className="section-title">Настройки соревнования</h2>
                <div className="form-grid">
                  <div>
                    <label className="form-label">Выберите токен для призов</label>
                    <select
                      name="tokenSymbol"
                      value={competitionForm.tokenSymbol}
                      onChange={(e) => handleInputChange(e, competitionForm, setCompetitionForm)}
                      className="form-select"
                    >
                      <option value="">Выберите токен</option>
                      {userTokens.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.name} (Баланс: {token.balance})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Призовой фонд (в токенах)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="prizePool"
                        value={competitionForm.prizePool}
                        onChange={(e) => handleInputChange(e, competitionForm, setCompetitionForm)}
                        className="form-input form-input-with-unit"
                        placeholder="Например: 1000"
                        min="0"
                        step="0.01"
                      />
                      <span className="form-unit">{competitionForm.tokenSymbol || 'Токены'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Количество победителей (Top N)</label>
                    <input
                      type="number"
                      name="topCount"
                      value={competitionForm.criteria.topCount}
                      onChange={(e) => handleInputChange(e, competitionForm, setCompetitionForm)}
                      className="form-input"
                      placeholder="Например: 5"
                      min="1"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="form-label">Распределение призов (%)</label>
                    <div className="distribution-grid">
                      {Array.from({ length: competitionForm.criteria.topCount }, (_, i) => (
                        <div key={i}>
                          <label className="distribution-label">Место {i + 1}</label>
                          <div className="relative">
                            <input
                              type="number"
                              name={`prizeDist_${i}`}
                              value={competitionForm.criteria.prizeDistribution[i] || 0}
                              onChange={(e) => handleInputChange(e, competitionForm, setCompetitionForm)}
                              className="form-input form-input-with-unit"
                              placeholder="Например: 50"
                              min="0"
                              step="0.1"
                            />
                            <span className="form-unit">%</span>
                          </div>
                        </div>
                      ))}
                      <p
                        className={`distribution-status ${
                          isDistributionValid(competitionForm.criteria.prizeDistribution)
                            ? 'distribution-valid'
                            : 'distribution-invalid'
                        }`}
                      >
                        Сумма:{' '}
                        {competitionForm.criteria.prizeDistribution.reduce(
                          (sum: number, p: number) => sum + (p || 0),
                          0
                        )}
                        % (должно быть 100%)
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Минимальный объем торгов (TON)</label>
                    <input
                      type="number"
                      name="minVolume"
                      value={competitionForm.criteria.minVolume}
                      onChange={(e) => handleInputChange(e, competitionForm, setCompetitionForm)}
                      className="form-input"
                      placeholder="Например: 100"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="form-label">Длительность (дни)</label>
                    <input
                      type="number"
                      name="duration"
                      value={competitionForm.criteria.duration}
                      onChange={(e) => handleInputChange(e, competitionForm, setCompetitionForm)}
                      className="form-input"
                      placeholder="Например: 7"
                      min="1"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="form-label">Описание соревнования</label>
                    <textarea
                      name="description"
                      value={competitionForm.description}
                      onChange={(e) => handleInputChange(e, competitionForm, setCompetitionForm)}
                      className="form-textarea"
                      placeholder="Опишите условия и преимущества вашего соревнования"
                    />
                  </div>

                  <div className="summary-card">
                    <div className="summary-item">
                      <span className="cost-label">Призовой фонд:</span>
                      <span>
                        {competitionForm.prizePool} {competitionForm.tokenSymbol}
                      </span>
                    </div>
                    {competitionForm.criteria.prizeDistribution.map((percent: number, i: number) =>
                      percent > 0 && (
                        <div key={i} className="summary-item">
                          <span className="cost-label">
                            Место {i + 1} ({percent}%):
                          </span>
                          <span>
                            {((parseFloat(competitionForm.prizePool || '0') * percent) / 100).toFixed(2)}{' '}
                            {competitionForm.tokenSymbol}
                          </span>
                        </div>
                      )
                    )}
                    <div className="summary-item">
                      <span className="cost-label">Комиссия (5%):</span>
                      <span>
                        {tokenFee.toFixed(2)} {competitionForm.tokenSymbol}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="cost-label">Итого токенов:</span>
                      <span className="cost-value-bold">
                        {totalTokens.toFixed(2)} {competitionForm.tokenSymbol}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="cost-label">Стоимость в TON:</span>
                      <span className="cost-value-bold">{tonFee} TON</span>
                    </div>
                  </div>

                  <button onClick={handleOpenPaymentModal} disabled={loading} className="create-button">
                    {loading ? 'Загрузка...' : 'Оплатить и создать соревнование'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isPaymentModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 className="modal-title">Подтверждение оплаты</h2>
                <div className="modal-details">
                  <div className="modal-summary">
                    <div className="modal-summary-item">
                      <span className="cost-label">Сумма в TON:</span>
                      <span>{tonFee} TON</span>
                    </div>
                    <div className="modal-summary-item">
                      <span className="cost-label">Призовой фонд:</span>
                      <span>
                        {competitionForm.prizePool} {competitionForm.tokenSymbol}
                      </span>
                    </div>
                    {competitionForm.criteria.prizeDistribution.map((percent: number, i: number) =>
                      percent > 0 && (
                        <div key={i} className="modal-summary-item">
                          <span className="cost-label">
                            Место {i + 1} ({percent}%):
                          </span>
                          <span>
                            {((parseFloat(competitionForm.prizePool || '0') * percent) / 100).toFixed(2)}{' '}
                            {competitionForm.tokenSymbol}
                          </span>
                        </div>
                      )
                    )}
                    <div className="modal-summary-item">
                      <span className="cost-label">Комиссия (5%):</span>
                      <span>
                        {tokenFee.toFixed(2)} {competitionForm.tokenSymbol}
                      </span>
                    </div>
                    <div className="modal-summary-item">
                      <span className="cost-label">Итого токенов:</span>
                      <span className="cost-value-bold">
                        {totalTokens.toFixed(2)} {competitionForm.tokenSymbol}
                      </span>
                    </div>
                  </div>

                  <p className="modal-note">
                    Нажимая "Оплатить", вы соглашаетесь перевести {tonFee} TON и токены на оффчейн-кошелек.
                  </p>

                  {paymentStatus === 'success' && (
                    <div className="modal-success">
                      Оплата прошла успешно! Соревнование будет запущено в ближайшее время.
                    </div>
                  )}

                  {paymentStatus === 'failed' && (
                    <div className="modal-error">
                      Ошибка при обработке платежа. Пожалуйста, попробуйте снова.
                    </div>
                  )}
                </div>

                <div className="modal-buttons">
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    disabled={paymentStatus === 'pending' || paymentStatus === 'success'}
                    className="modal-cancel-button"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={onPaymentClick}
                    disabled={paymentStatus === 'pending' || paymentStatus === 'success'}
                    className={`modal-pay-button ${paymentStatus}`}
                  >
                    {paymentStatus === 'pending'
                      ? 'Оплата...'
                      : paymentStatus === 'success'
                      ? 'Оплачено'
                      : 'Оплатить'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitionCreator;
