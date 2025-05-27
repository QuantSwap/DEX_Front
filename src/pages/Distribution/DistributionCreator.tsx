import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './styles/DistributionCreatorStyles.css';
const useWallet = () => ({
  walletAddress: 'EQB4FAKE_WALLET_123',
  connectWallet: () => alert('Мок: кошелек подключен!'),
  sendTransaction: () => Promise.resolve('mock_tx_hash'),
});


// ----- Мок типы -----
export interface Token {
  symbol: string;
  name: string;
  balance: string;
}
export interface DistributionData {
  tokenSymbol: string;
  totalTokens: string;
  addresses: string[];
  numAddresses: number;
  tonFee: number;
  tokenFee: number;
  totalTokensRequired: number;
}

// ----- Моки -----
const MOCK_USER_TOKENS: Token[] = [
  { symbol: 'USDT', name: 'Tether USD', balance: '987654.12' },
  { symbol: 'TON', name: 'Toncoin', balance: '1234.56' },
  { symbol: 'POZO', name: 'PozoToken', balance: '500000.00' },
];

const fetchUserTokens = (
  walletAddress: string,
  setUserTokens: (tokens: Token[]) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  setTimeout(() => {
    setUserTokens(MOCK_USER_TOKENS);
    setLoading(false);
  }, 100); 
};

const calculateTonFee = async (
  walletAddress: string,
  numAddresses: string
): Promise<number> => {
  return 0.05 * (parseInt(numAddresses) || 0);
};
const calculateTokenFee = async (
  walletAddress: string,
  totalTokens: string
): Promise<number> => {
  return (parseFloat(totalTokens) || 0) * 0.01;
};
const calculateTotalTokensRequired = async (
  walletAddress: string,
  totalTokens: string
): Promise<number> => {
  const fee = (parseFloat(totalTokens) || 0) * 0.01;
  return (parseFloat(totalTokens) || 0) + fee;
};
const calculateTokensPerAddress = (
  totalTokens: string,
  numAddresses: string
): number => {
  const total = parseFloat(totalTokens) || 0;
  const n = parseInt(numAddresses) || 1;
  return n ? total / n : 0;
};

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  setDistributionForm: React.Dispatch<React.SetStateAction<any>>
) => {
  const { name, value } = e.target;
  setDistributionForm((form: any) => ({
    ...form,
    [name]: value,
  }));
};
const validateForm = (form: any) => {
  if (!form.tokenSymbol) return 'Выберите токен!';
  if (!form.totalTokens || parseFloat(form.totalTokens) <= 0) return 'Введите сумму токенов!';
  if (!form.numAddresses || parseInt(form.numAddresses) <= 0) return 'Введите количество адресов!';
  return '';
};
const handlePayment = async (
  walletAddress: string,
  connectWallet: () => void,
  sendTransaction: any,
  distributionForm: any,
  setPaymentStatus: any,
  setIsPaymentModalOpen: any,
  navigate: any
) => {
  setPaymentStatus('pending');
  setTimeout(() => {
    setPaymentStatus('success');
    setTimeout(() => {
      setIsPaymentModalOpen(false);
      navigate('/distribution/success');
    }, 1200);
  }, 1500);
};

const DistributionCreator: React.FC = () => {
  const { walletAddress, connectWallet, sendTransaction } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'initial' | 'pending' | 'success' | 'failed'>('initial');
  const [distributionForm, setDistributionForm] = useState({
    tokenSymbol: '',
    totalTokens: '',
    numAddresses: '100',
  });
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [tonFee, setTonFee] = useState<number | null>(null);
  const [tokenFee, setTokenFee] = useState<number | null>(null);
  const [totalTokensRequired, setTotalTokensRequired] = useState<number | null>(null);
  const [feesLoading, setFeesLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      fetchUserTokens(walletAddress, setUserTokens, setLoading);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress || !distributionForm.numAddresses || !distributionForm.totalTokens) {
      setTonFee(null);
      setTokenFee(null);
      setTotalTokensRequired(null);
      return;
    }
    const fetchFees = async () => {
      setFeesLoading(true);
      try {
        const tonFeeValue = await calculateTonFee(walletAddress, distributionForm.numAddresses);
        const tokenFeeValue = await calculateTokenFee(walletAddress, distributionForm.totalTokens);
        const totalTokensValue = await calculateTotalTokensRequired(walletAddress, distributionForm.totalTokens);

        setTonFee(tonFeeValue);
        setTokenFee(tokenFeeValue);
        setTotalTokensRequired(totalTokensValue);
      } catch (error) {
        setTonFee(null);
        setTokenFee(null);
        setTotalTokensRequired(null);
      } finally {
        setFeesLoading(false);
      }
    };
    fetchFees();
  }, [walletAddress, distributionForm.numAddresses, distributionForm.totalTokens]);

  const handleOpenPaymentModal = () => {
    const error = validateForm(distributionForm);
    if (error) {
      alert(error);
      return;
    }
    setIsPaymentModalOpen(true);
    setPaymentStatus('initial');
  };

  return (
    <div className="distribution-creator-container">
      <div className="distribution-creator-content container mx-auto">
        <div className="content-wrapper">
          <h1 className="title">Массовое распределение токенов</h1>

          {!walletAddress ? (
            <div className="no-wallet-card">
              <h2 className="no-wallet-title">Подключите кошелек</h2>
              <p className="no-wallet-text">Для распределения токенов необходимо подключить кошелек</p>
              <button onClick={connectWallet} className="connect-button">
                Подключить кошелек
              </button>
            </div>
          ) : loading || feesLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="section">
              <div className="cost-card">
                <h2 className="card-title">Стоимость распределения токенов</h2>
                <div className="cost-details">
                  <div className="cost-item">
                    <span className="cost-label">Количество адресов:</span>
                    <span className="cost-value">{distributionForm.numAddresses}</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Комиссия за газ (TON):</span>
                    <span className="cost-value">{tonFee !== null ? tonFee.toFixed(2) : '0.00'} TON</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Комиссия в токенах:</span>
                    <span className="cost-value">
                      {tokenFee !== null ? tokenFee.toFixed(2) : '0.00'} {distributionForm.tokenSymbol || 'Токенов'}
                    </span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Всего токенов к оплате:</span>
                    <span className="cost-value">
                      {totalTokensRequired !== null ? totalTokensRequired.toFixed(2) : '0.00'}{' '}
                      {distributionForm.tokenSymbol || 'Токенов'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-card">
                <h2 className="card-title">Настройки распределения</h2>
                <div className="form-grid">
                  <div>
                    <label className="form-label">Выберите токен для распределения</label>
                    <select
                      name="tokenSymbol"
                      value={distributionForm.tokenSymbol}
                      onChange={(e) => handleInputChange(e, setDistributionForm)}
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
                    <label className="form-label">Общая сумма токенов для распределения</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        name="totalTokens"
                        value={distributionForm.totalTokens}
                        onChange={(e) => handleInputChange(e, setDistributionForm)}
                        className="form-input"
                        placeholder="Например: 1000000"
                        min="0"
                        step="0.01"
                      />
                      <span className="input-unit">{distributionForm.tokenSymbol || 'Токены'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Количество адресов для распределения</label>
                    <input
                      type="number"
                      name="numAddresses"
                      value={distributionForm.numAddresses}
                      onChange={(e) => handleInputChange(e, setDistributionForm)}
                      className="form-input"
                      placeholder="Например: 1000"
                      min="1"
                      step="1"
                    />
                    <p className="form-note">
                      Укажите количество адресов, между которыми будут распределены токены. Бэкенд автоматически выберет
                      адреса для распределения.
                    </p>
                  </div>

                  {parseInt(distributionForm.numAddresses) > 0 && distributionForm.totalTokens && (
                    <div className="summary-card">
                      <div className="summary-item">
                        <span className="summary-label">Количество адресов:</span>
                        <span className="summary-value">{distributionForm.numAddresses}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Токенов на адрес:</span>
                        <span className="summary-value">
                          {calculateTokensPerAddress(distributionForm.totalTokens, distributionForm.numAddresses).toFixed(6)}{' '}
                          {distributionForm.tokenSymbol}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Комиссия в TON:</span>
                        <span className="summary-value">{tonFee !== null ? tonFee.toFixed(2) : '0.00'} TON</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Комиссия в токенах:</span>
                        <span className="summary-value">
                          {tokenFee !== null ? tokenFee.toFixed(2) : '0.00'} {distributionForm.tokenSymbol}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Итого токенов:</span>
                        <span className="summary-value">
                          {totalTokensRequired !== null ? totalTokensRequired.toFixed(2) : '0.00'}{' '}
                          {distributionForm.tokenSymbol}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleOpenPaymentModal}
                    disabled={loading || feesLoading || parseInt(distributionForm.numAddresses) === 0}
                    className="create-button"
                  >
                    {loading || feesLoading ? 'Загрузка...' : 'Оплатить и создать распределение'}
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
                      <span className="modal-summary-label">Сумма в TON:</span>
                      <span>{tonFee !== null ? tonFee.toFixed(2) : '0.00'} TON</span>
                    </div>
                    <div className="modal-summary-item">
                      <span className="modal-summary-label">Общее количество токенов:</span>
                      <span>{distributionForm.totalTokens} {distributionForm.tokenSymbol}</span>
                    </div>
                    <div className="modal-summary-item">
                      <span className="modal-summary-label">Количество адресов:</span>
                      <span>{distributionForm.numAddresses}</span>
                    </div>
                    <div className="modal-summary-item">
                      <span className="modal-summary-label">Токенов на адрес:</span>
                      <span>
                        {calculateTokensPerAddress(distributionForm.totalTokens, distributionForm.numAddresses).toFixed(6)}{' '}
                        {distributionForm.tokenSymbol}
                      </span>
                    </div>
                    <div className="modal-summary-item">
                      <span className="modal-summary-label">Комиссия:</span>
                      <span>{tokenFee !== null ? tokenFee.toFixed(2) : '0.00'} {distributionForm.tokenSymbol}</span>
                    </div>
                    <div className="modal-summary-item">
                      <span className="modal-summary-label">Итого токенов:</span>
                      <span>
                        {totalTokensRequired !== null ? totalTokensRequired.toFixed(2) : '0.00'}{' '}
                        {distributionForm.tokenSymbol}
                      </span>
                    </div>
                  </div>

                  <p className="modal-note">
                    Нажимая "Оплатить", вы соглашаетесь перевести{' '}
                    {tonFee !== null ? tonFee.toFixed(2) : '0.00'} TON и{' '}
                    {totalTokensRequired !== null ? totalTokensRequired.toFixed(2) : '0.00'}{' '}
                    {distributionForm.tokenSymbol} на оффчейн-кошелек.
                  </p>

                  {paymentStatus === 'success' && (
                    <div className="modal-status-success">
                      Оплата прошла успешно! Распределение будет запущено в ближайшее время.
                    </div>
                  )}

                  {paymentStatus === 'failed' && (
                    <div className="modal-status-failed">
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
                    onClick={() =>
                      handlePayment(
                        walletAddress,
                        connectWallet,
                        sendTransaction,
                        distributionForm,
                        setPaymentStatus,
                        setIsPaymentModalOpen,
                        navigate
                      )
                    }
                    disabled={paymentStatus === 'pending' || paymentStatus === 'success' || feesLoading}
                    className={`modal-pay-button ${paymentStatus === 'pending' ? 'pending' : ''}`}
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

export default DistributionCreator;
