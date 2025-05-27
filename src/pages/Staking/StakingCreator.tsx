import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './styles/StakingCreatorStyles.css';

const MOCK_TOKENS = [
  { symbol: 'TON', name: 'Toncoin', balance: '1245.17' },
  { symbol: 'JET', name: 'Jetton', balance: '90000' },
  { symbol: 'USDT', name: 'Tether USD', balance: '2732' },
];

const USER_COUNT_OPTIONS = [
  { id: 'small', users: 100, label: '100 пользователей' },
  { id: 'medium', users: 500, label: '500 пользователей' },
  { id: 'large', users: 1000, label: '1,000 пользователей' },
  { id: 'xl', users: 5000, label: '5,000 пользователей' },
  { id: 'xxl', users: 10000, label: '10,000 пользователей' },
];

function calculateTonFee() {
  return 2.5;
}

function calculateTokenFee(totalReward: number) {
  return totalReward * 0.03;
}


function calculateRewardPerUser(apy: number, stake: number, period: number) {
  const daysInYear = 365;
  return stake * (apy / 100) * (period / daysInYear);
}

function calculateTotalTokensRequired(apy: number, users: number, stake: number, period: number) {
  const rewardPerUser = calculateRewardPerUser(apy, stake, period);
  return rewardPerUser * users;
}

const StakingCreator: React.FC = () => {
  const { walletAddress, connectWallet } = useWallet();
  const [stakingForm, setStakingForm] = useState({
    tokenSymbol: '',
    apy: { '7': '', '15': '', '30': '' },
    description: '',
    selectedPlan: USER_COUNT_OPTIONS[0],
    minStake: '',
    maxStake: '',
  });

  const token = MOCK_TOKENS.find(t => t.symbol === stakingForm.tokenSymbol);
  const periodOptions = ['7', '15', '30'] as const;
  const apyValues = periodOptions.map(p => Number(stakingForm.apy[p]) || 0);

  const minStake = parseFloat(stakingForm.minStake) || 0;
  const maxStake = parseFloat(stakingForm.maxStake) || minStake;
  const users = stakingForm.selectedPlan.users;

  const selectedPeriod = periodOptions.find(p => apyValues[periodOptions.indexOf(p)] > 0) || '30';
  const selectedApy = Number(stakingForm.apy[selectedPeriod]) || 0;
  const selectedPeriodDays = Number(selectedPeriod);

  const totalReward = calculateTotalTokensRequired(selectedApy, users, minStake, selectedPeriodDays);
  const tokenFee = calculateTokenFee(totalReward);
  const tonFee = calculateTonFee();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'initial' | 'pending' | 'success' | 'failed'>('initial');

  return (
    <div className="staking-creator-container">
      <div className="staking-creator-content container mx-auto">
        <div className="content-wrapper">
          <h1 className="title">Создать Стейкинг</h1>

          {!walletAddress ? (
            <div className="no-wallet-card">
              <h2 className="no-wallet-title">Подключите кошелек</h2>
              <p className="no-wallet-text">Для создания стейкинга необходимо подключить кошелек</p>
              <button onClick={connectWallet} className="connect-wallet-button">
                Подключить кошелек
              </button>
            </div>
          ) : (
            <div className="form-sections">
              <div className="cost-section">
                <h2 className="section-title">Стоимость создания стейкинга</h2>
                <div className="cost-details">
                  <div className="cost-item">
                    <span className="cost-label">Базовая стоимость в TON:</span>
                    <span className="cost-value">{tonFee.toFixed(2)} TON</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Комиссия биржи:</span>
                    <span className="cost-value">{tokenFee.toFixed(2)} {stakingForm.tokenSymbol || 'Токенов'}</span>
                  </div>
                  <div className="cost-item total">
                    <span className="cost-label">Всего токенов к оплате:</span>
                    <span className="cost-value">
                      {(totalReward + tokenFee).toFixed(2)} {stakingForm.tokenSymbol || 'Токенов'}
                    </span>
                  </div>
                  <p className="cost-note">
                    (Рассчитано для минимальной ставки и выбранного числа участников)
                  </p>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Детали стейкинга</h2>

                <div className="form-fields">
                  <div className="form-field">
                    <label className="field-label">Выберите токен для стейкинга</label>
                    <select
                      name="tokenSymbol"
                      value={stakingForm.tokenSymbol}
                      onChange={e => setStakingForm(f => ({ ...f, tokenSymbol: e.target.value }))}
                      className="field-select"
                    >
                      <option value="">Выберите токен</option>
                      {MOCK_TOKENS.map(token => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.name} (Баланс: {token.balance})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Количество пользователей</label>
                    <div className="plan-options">
                      {USER_COUNT_OPTIONS.map(option => (
                        <button
                          key={option.id}
                          onClick={() => setStakingForm(f => ({ ...f, selectedPlan: option }))}
                          className={`plan-option ${stakingForm.selectedPlan.id === option.id ? 'selected' : ''}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Годовая доходность (APY, %)</label>
                    <div className="apy-inputs">
                      {periodOptions.map(period => (
                        <div key={period} className="apy-input-group">
                          <label className="apy-label">За {period} дней</label>
                          <div className="input-with-unit">
                            <input
                              type="number"
                              name={`apy${period}`}
                              value={stakingForm.apy[period]}
                              onChange={e =>
                                setStakingForm(f => ({
                                  ...f,
                                  apy: { ...f.apy, [period]: e.target.value },
                                }))
                              }
                              className="apy-input"
                              placeholder={`Например: ${period === '30' ? '12' : period === '15' ? '6' : '3'}`}
                              min="0"
                              step="0.01"
                            />
                            <span className="input-unit">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-field-group">
                    <div className="form-field">
                      <label className="field-label">Минимальная ставка</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          name="minStake"
                          value={stakingForm.minStake}
                          onChange={e => setStakingForm(f => ({ ...f, minStake: e.target.value }))}
                          className="stake-input"
                          placeholder="Например: 10"
                          min="0"
                        />
                        <span className="input-unit">{stakingForm.tokenSymbol || 'Токены'}</span>
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="field-label">Максимальная ставка (опционально)</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          name="maxStake"
                          value={stakingForm.maxStake}
                          onChange={e => setStakingForm(f => ({ ...f, maxStake: e.target.value }))}
                          className="stake-input"
                          placeholder="Например: 1000"
                          min="0"
                        />
                        <span className="input-unit">{stakingForm.tokenSymbol || 'Токены'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Описание стейкинга</label>
                    <textarea
                      name="description"
                      value={stakingForm.description}
                      onChange={e => setStakingForm(f => ({ ...f, description: e.target.value }))}
                      className="description-textarea"
                      placeholder="Опишите условия и преимущества вашего стейкинга"
                    />
                  </div>

                  <div className="summary-section">
                    <div className="summary-item">
                      <span className="summary-label">Всего участников:</span>
                      <span className="summary-value">{users.toLocaleString()}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Награда за {selectedPeriod} дней (на пользователя):</span>
                      <span className="summary-value">
                        {calculateRewardPerUser(selectedApy, minStake, selectedPeriodDays).toFixed(4)}{' '}
                        {stakingForm.tokenSymbol}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Всего наград:</span>
                      <span className="summary-value">
                        {totalReward.toFixed(2)} {stakingForm.tokenSymbol}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Комиссия:</span>
                      <span className="summary-value">
                        {tokenFee.toFixed(2)} {stakingForm.tokenSymbol}
                      </span>
                    </div>
                    <div className="summary-item total">
                      <span className="summary-label">Итого к оплате:</span>
                      <span className="summary-value">
                        {(totalReward + tokenFee).toFixed(2)} {stakingForm.tokenSymbol}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="create-button"
                  >
                    Оплатить и создать стейкинг
                  </button>
                </div>
              </div>
            </div>
          )}

          {}
          {isPaymentModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 className="modal-title">Подтверждение оплаты</h2>
                <div className="payment-details">
                  <div className="payment-item">
                    <span className="payment-label">Сумма в TON:</span>
                    <span className="payment-value">{tonFee.toFixed(2)} TON</span>
                  </div>
                  <div className="payment-item">
                    <span className="payment-label">Сумма в токенах:</span>
                    <span className="payment-value">
                      {(totalReward + tokenFee).toFixed(2)} {stakingForm.tokenSymbol}
                    </span>
                  </div>
                  <div className="payment-item">
                    <span className="payment-label">Комиссия:</span>
                    <span className="payment-value">{tokenFee.toFixed(2)} {stakingForm.tokenSymbol}</span>
                  </div>
                </div>
                <p className="payment-disclaimer">
                  Нажимая "Оплатить", вы соглашаетесь с условиями использования и подтверждаете перевод средств.
                </p>
                {paymentStatus === 'success' && (
                  <div className="payment-success">
                    Оплата прошла успешно! Ваш стейкинг активируется в ближайшее время.
                  </div>
                )}
                {paymentStatus === 'failed' && (
                  <div className="payment-failed">
                    Ошибка при обработке платежа. Пожалуйста, попробуйте снова.
                  </div>
                )}
                <div className="modal-actions">
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="cancel-button"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => setPaymentStatus('success')}
                    className="pay-button"
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

export default StakingCreator;
