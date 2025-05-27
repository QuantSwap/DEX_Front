import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import {
  userCountOptions,
  initialSocialNetworks,
  AirdropForm,
  initialAirdropForm,
  fetchUserTokens,
  handleFormChange,
  handlePlanChange,
  handleSocialNetworkToggle,
  handleSocialNetworkChange,
  calculateTotalTokens,
  calculateFee,
  calculateTonFee,
  validateForm,
  handleCreateAirdrop,
} from '../../utils/Airdrop/airdropCreatorUtils';
import './styles/AirdropCreatorStyles.css';

export interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  link: string;
  tokensPerAction: number;
}

export interface AirdropPlanOption {
  id: string;
  users: number;
  label: string;
}

const CreateAirdrop: React.FC = () => {
  const { walletAddress, connectWallet } = useWallet();
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>(initialSocialNetworks);
  const [airdropForm, setAirdropForm] = useState<AirdropForm>(initialAirdropForm);
  const [userTokens, setUserTokens] = useState<any[]>([]);
  
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [tonFeeAmount, setTonFeeAmount] = useState<number>(15);

  useEffect(() => {
    if (walletAddress) {
      loadUserTokens();
      loadTonFee();
    }
  }, [walletAddress]);

  useEffect(() => {
    calculateRequiredTokensAndFees();
  }, [socialNetworks, airdropForm.selectedPlan, walletAddress]);

  const loadUserTokens = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    const tokens = await fetchUserTokens(walletAddress || undefined);
    setUserTokens(tokens);
    setLoading(false);
  };

  const loadTonFee = async () => {
    if (!walletAddress) return;
    
    const fee = await calculateTonFee(walletAddress || undefined);
    setTonFeeAmount(fee);
  };

  const calculateRequiredTokensAndFees = async () => {
    try {
      const total = await calculateTotalTokens(
        socialNetworks,
        airdropForm.selectedPlan,
        walletAddress || undefined
      );
      setTotalTokens(total);

      const fee = await calculateFee(total, walletAddress || undefined);
      setFeeAmount(fee);
    } catch (error) {
      console.error('Ошибка при расчете токенов и комиссий:', error);
    }
  };

  const handleOpenPaymentModal = async () => {
    if (!walletAddress) {
      connectWallet();
      return;
    }
    
    const error = await validateForm(airdropForm, socialNetworks, walletAddress || undefined);
    if (error) {
      alert(error);
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const onCreateAirdrop = () => {
    if (!walletAddress) {
      connectWallet();
      return;
    }
    
    handleCreateAirdrop(
      walletAddress,
      airdropForm,
      socialNetworks,
      connectWallet,
      setLoading,
      setIsPaymentModalOpen,
      navigate
    );
  };

  return (
    <div className="airdrop-creator-container">
      <div className="airdrop-creator-content container mx-auto">
        <div className="content-wrapper">
          <h1 className="title">Создать Аирдроп</h1>

          {!walletAddress ? (
            <div className="no-wallet-card">
              <h2 className="no-wallet-title">Подключите кошелек</h2>
              <p className="no-wallet-text">Для создания аирдропа необходимо подключить кошелек</p>
              <button onClick={connectWallet} className="connect-button">
                Подключить кошелек
              </button>
            </div>
          ) : (
            <div className="section">
              <div className="cost-card">
                <h2 className="section-title">Стоимость создания аирдропа</h2>
                <div className="cost-details">
                  <div className="cost-item">
                    <span className="cost-label">Базовая стоимость:</span>
                    <span>{tonFeeAmount} TON</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Комиссия биржи:</span>
                    <span>3% от распределяемых токенов</span>
                  </div>
                  <div className="cost-note">
                    <p>Все аирдропы автоматически.</p>
                    <p>Средняя скорость модерации - 10 минут.</p>
                  </div>
                </div>
              </div>

              <div className="form-card">
                <h2 className="section-title">Детали аирдропа</h2>
                <div className="form-grid">
                  <div>
                    <label className="form-label">Название аирдропа</label>
                    <input
                      type="text"
                      name="name"
                      value={airdropForm.name}
                      onChange={(e) => handleFormChange(e, setAirdropForm)}
                      className="form-input"
                      placeholder="Например: Раздача токенов TON Community"
                    />
                  </div>
                  <div>
                    <label className="form-label">Описание</label>
                    <textarea
                      name="description"
                      value={airdropForm.description}
                      onChange={(e) => handleFormChange(e, setAirdropForm)}
                      className="form-textarea"
                      placeholder="Опишите ваш аирдроп и его цели"
                    />
                  </div>
                  <div>
                    <label className="form-label">Выберите токен для аирдропа</label>
                    <select
                      name="tokenSymbol"
                      value={airdropForm.tokenSymbol}
                      onChange={(e) => handleFormChange(e, setAirdropForm)}
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
                </div>
              </div>

              <div className="plan-card">
                <h2 className="section-title">Количество пользователей</h2>
                <div className="plan-grid">
                  {userCountOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handlePlanChange(option, setAirdropForm)}
                      className={`plan-button ${airdropForm.selectedPlan.id === option.id ? 'active' : ''}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="plan-note">
                  Выберите максимальное количество пользователей для аирдропа
                </div>
              </div>

              <div className="conditions-card">
                <h2 className="section-title">Условия получения токенов</h2>
                <div className="conditions-list">
                  {socialNetworks.map((network) => (
                    <div key={network.id} className="condition-item">
                      <div className="condition-header">
                        <input
                          type="checkbox"
                          id={`enable-${network.id}`}
                          checked={network.enabled}
                          onChange={() => handleSocialNetworkToggle(network.id, setSocialNetworks)}
                          className="condition-checkbox"
                        />
                        <label htmlFor={`enable-${network.id}`} className="condition-label">
                          <span className="condition-icon">{network.icon}</span>
                          <span className="condition-name">{network.name}</span>
                        </label>
                      </div>
                      {network.enabled && (
                        <div className="condition-details">
                          <div>
                            <label className="form-label">Ссылка</label>
                            <input
                              type="text"
                              value={network.link}
                              onChange={(e) =>
                                handleSocialNetworkChange(network.id, 'link', e.target.value, setSocialNetworks)
                              }
                              className="form-input"
                              placeholder={`Ссылка на ${network.name}`}
                            />
                          </div>
                          <div>
                            <label className="form-label">Токенов за действие</label>
                            <input
                              type="number"
                              value={network.tokensPerAction}
                              onChange={(e) =>
                                handleSocialNetworkChange(
                                  network.id,
                                  'tokensPerAction',
                                  e.target.value,
                                  setSocialNetworks
                                )
                              }
                              className="form-input"
                              placeholder="Например: 10"
                              min="0"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-card">
                <h2 className="section-title">Итоговый расчет</h2>
                <div className="summary-details">
                  <div className="summary-item">
                    <span className="cost-label">Всего пользователей:</span>
                    <span>{airdropForm.selectedPlan.users.toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="cost-label">Токенов на одного пользователя:</span>
                    <span>
                      {socialNetworks
                        .filter((network) => network.enabled)
                        .reduce((sum, network) => sum + network.tokensPerAction, 0)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="cost-label">Всего токенов для раздачи:</span>
                    <span>{totalTokens.toLocaleString()}</span>
                  </div>
                  <div className="summary-item fee">
                    <span className="cost-label">+ Комиссия биржи (3%):</span>
                    <span>{feeAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-item total">
                    <span>ИТОГО токенов:</span>
                    <span>{(totalTokens + feeAmount).toLocaleString()}</span>
                  </div>
                  <div className="summary-item ton">
                    <span>Стоимость в TON:</span>
                    <span>{tonFeeAmount} TON</span>
                  </div>
                </div>
                <button onClick={handleOpenPaymentModal} disabled={loading} className="create-button">
                  {loading ? 'Загрузка...' : 'Оплатить и создать аирдроп'}
                </button>
              </div>
            </div>
          )}

          {isPaymentModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 className="modal-title">Подтверждение создания аирдропа</h2>
                <div className="modal-details">
                  <div className="modal-summary">
                    <div className="modal-summary-item">
                      <span className="cost-label">Токены для раздачи:</span>
                      <span>{totalTokens.toLocaleString()}</span>
                    </div>
                    <div className="modal-summary-item">
                      <span className="cost-label">Комиссия (3%):</span>
                      <span>{feeAmount.toLocaleString()}</span>
                    </div>
                    <div className="modal-summary-item total">
                      <span>Итого токенов:</span>
                      <span>{(totalTokens + feeAmount).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="modal-ton">
                    <div className="modal-ton-item">
                      <span>Стоимость создания:</span>
                      <span>{tonFeeAmount} TON</span>
                    </div>
                  </div>
                  <p className="modal-note">
                    Нажимая кнопку "Создать аирдроп", вы соглашаетесь с условиями использования и подтверждаете,
                    что токены будут списаны с вашего кошелька.
                  </p>
                </div>
                <div className="modal-buttons">
                  <button onClick={() => setIsPaymentModalOpen(false)} className="modal-cancel-button">
                    Отмена
                  </button>
                  <button onClick={onCreateAirdrop} disabled={loading} className="modal-create-button">
                    {loading ? 'Создание...' : 'Создать аирдроп'}
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

export default CreateAirdrop;
