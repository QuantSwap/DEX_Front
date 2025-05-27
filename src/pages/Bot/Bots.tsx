import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './style/BotsStyles.css';

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  value: number;
  logo: string;
}
export interface LiquidityConfig {
  tokenA: string;
  tokenB: string;
  amountA: string;
  amountB: string;
  priceThreshold: number;
  manualMode: boolean;
}
export interface SwapConfig {
  swapMode: 'tonToJetton' | 'jettonToTon' | 'both';
  swapInterval: number;
  swapCount: number;
  dailyVolume: string;
  spread: number;
}
export interface Trade {
  id: string;
  type: 'liquidity' | 'swap';
  tokenA: string;
  tokenB: string;
  amountA: string;
  amountB: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}
export interface BotStats {
  swapCount: number;
  liquidityCount: number;
  totalSwapsTonSpent: string;
  totalLiquidityTonSpent: string;
  totalJettonSpent: string;
  lastUpdate: string;
}

// ---- Моки ----
const MOCK_TOKENS: Token[] = [
  {
    symbol: 'JET',
    name: 'Jetton',
    balance: '7000',
    price: 2,
    value: 14000,
    logo: 'https://img.cryptorank.io/coins/jet_ton_games1704976992995.png',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    balance: '1200',
    price: 3.2,
    value: 3840,
    logo: 'https://cdn3d.iconscout.com/3d/premium/thumb/tether-usdt-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--cryptocurrency-pack-science-technology-icons-6044470.png?f=webp',
  },
];
const MOCK_TRADES: Trade[] = [
  {
    id: '1', type: 'liquidity', tokenA: 'TON', tokenB: 'JET',
    amountA: '10', amountB: '1000', timestamp: new Date().toISOString(), status: 'completed',
  },
  {
    id: '2', type: 'swap', tokenA: 'TON', tokenB: 'USDT',
    amountA: '5', amountB: '15.7', timestamp: new Date(Date.now() - 3600 * 1000).toISOString(), status: 'pending',
  },
];
const MOCK_BOT_STATS: BotStats = {
  swapCount: 14,
  liquidityCount: 7,
  totalSwapsTonSpent: '48',
  totalLiquidityTonSpent: '40',
  totalJettonSpent: '9000',
  lastUpdate: new Date().toISOString(),
};
const MOCK_STATUS = {
  isPaid: true,
  startDate: new Date(Date.now() - 86400000).toISOString(),
  liquidityActive: true,
  swapActive: false,
};

function formatNumber(val: string | number, decimals = 2) {
  if (typeof val === 'string') val = parseFloat(val);
  if (isNaN(val)) return '0';
  return val.toLocaleString('ru-RU', { maximumFractionDigits: decimals });
}
function calculateDaysElapsed(startDate: string) {
  return Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
}
const fetchWalletData = async (walletAddress: string) => {
  return {
    tonBalance: '126.24',
    tokens: MOCK_TOKENS,
  };
};
const fetchBotStatus = async () => MOCK_STATUS;
const fetchTrades = async () => MOCK_TRADES;
const fetchBotStats = async () => MOCK_BOT_STATS;
const handlePayment = async () => {
  await new Promise(res => setTimeout(res, 1000));
  return true;
};
const startLiquidity = async () => true;
const stopLiquidity = async () => true;
const startSwap = async () => true;
const stopSwap = async () => true;
const validateConfig = (..._args: any[]) => true;

function getLogoBySymbol(symbol: string): string {
  if (symbol === 'TON') {
    return 'https://cdn.iconscout.com/icon/premium/png-256-thumb/toncoin-toncoin-6888837-5645461.png';
  }
  const found = MOCK_TOKENS.find((t) => t.symbol === symbol);
  return found?.logo || '';
}

const Bots: React.FC = () => {
  const { walletAddress, walletBalance, getBalance, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tonBalance, setTonBalance] = useState<string>('0');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [botStats, setBotStats] = useState<BotStats>({
    swapCount: 0,
    liquidityCount: 0,
    totalSwapsTonSpent: '0',
    totalLiquidityTonSpent: '0',
    totalJettonSpent: '0',
    lastUpdate: '',
  });
  const [liquidityConfig, setLiquidityConfig] = useState<LiquidityConfig>({
    tokenA: 'TON',
    tokenB: '',
    amountA: '',
    amountB: '',
    priceThreshold: 5,
    manualMode: false,
  });
  const [swapConfig, setSwapConfig] = useState<SwapConfig>({
    swapMode: 'tonToJetton',
    swapInterval: 10,
    swapCount: 10,
    dailyVolume: '',
    spread: 0.5,
  });
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'initial' | 'pending' | 'success' | 'failed'>('initial');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [liquidityStatus, setLiquidityStatus] = useState<'inactive' | 'active'>('inactive');
  const [swapStatus, setSwapStatus] = useState<'inactive' | 'active'>('inactive');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [daysElapsed, setDaysElapsed] = useState<number>(0);

  useEffect(() => {
    if (walletAddress) {
      loadData();
    } else {
      setLoading(false);
    }

  }, [walletAddress, walletBalance]);

  const loadData = async () => {
    if (!walletAddress) return;

    setLoading(true);
    try {
      const { tonBalance: newTonBalance, tokens: newTokens } = await fetchWalletData(walletAddress);
      setTonBalance(newTonBalance);
      setTokens(newTokens);
      if (newTokens.length > 0) {
        setLiquidityConfig((prev) => ({ ...prev, tokenB: newTokens[0].symbol }));
      }
      const status = await fetchBotStatus();
      setIsPaid(status.isPaid);
      setStartDate(status.startDate);
      if (status.startDate) setDaysElapsed(calculateDaysElapsed(status.startDate));
      setLiquidityStatus(status.liquidityActive ? 'active' : 'inactive');
      setSwapStatus(status.swapActive ? 'active' : 'inactive');
      setTrades(await fetchTrades());
      setBotStats(await fetchBotStats());
    } catch (err) {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleLiquidityConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLiquidityConfig((prev) => ({ ...prev, [name]: value }));
  };
  const handleSwapConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSwapConfig((prev) => ({ ...prev, [name]: value }));
  };
  const toggleManualMode = () => {
    setLiquidityConfig((prev) => ({ ...prev, manualMode: !prev.manualMode }));
  };
  const handlePaymentClick = async () => {
    if (!walletAddress) return;
    setPaymentStatus('pending');
    const success = await handlePayment();
    setPaymentStatus(success ? 'success' : 'failed');
    if (success) {
      setIsPaid(true);
      const newStartDate = new Date().toISOString();
      setStartDate(newStartDate);
      setDaysElapsed(calculateDaysElapsed(newStartDate));
      setTimeout(() => setIsPaymentModalOpen(false), 2000);
    } else {
      setError('Не удалось активировать бота');
    }
  };
  const handleStartLiquidity = async () => {
    if (!walletAddress || !validateConfig(liquidityConfig, 'liquidity', tonBalance, tokens)) {
      setError('Проверьте настройки ликвидности');
      return;
    }
    const success = await startLiquidity();
    if (success) setLiquidityStatus('active');
    else setError('Ошибка запуска ликвидности');
  };
  const handleStopLiquidity = async () => {
    if (!walletAddress) return;
    const success = await stopLiquidity();
    if (success) setLiquidityStatus('inactive');
    else setError('Ошибка остановки ликвидности');
  };
  const handleStartSwap = async () => {
    if (!walletAddress || !validateConfig(swapConfig, 'swap', tonBalance, tokens)) {
      setError('Проверьте настройки свопов');
      return;
    }
    const success = await startSwap();
    if (success) setSwapStatus('active');
    else setError('Ошибка запуска свопов');
  };
  const handleStopSwap = async () => {
    if (!walletAddress) return;
    const success = await stopSwap();
    if (success) setSwapStatus('inactive');
    else setError('Ошибка остановки свопов');
  };

  return (
    <div className="bots-container">
      <div className="bots-content container mx-auto">
        <header className="header">
          <h1 className="title">Маркет-Мейкер Бот</h1>
          <p className="subtitle">Автоматизация ликвидности и свопов для вашего DEX</p>
          {isPaid && startDate && (
            <p className="status-text">Активен: {daysElapsed} / 30 дней</p>
          )}
        </header>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : !walletAddress ? (
          <div className="no-wallet-card">
            <p className="no-wallet-text">Подключите кошелек для начала работы</p>
          </div>
        ) : (
          <div className="main-content">
            <section className="section">
              <h2 className="section-title">Баланс</h2>
              <div className="balance-grid">
                <div className="balance-item">
                  <span className="flex items-center gap-2">
                    <img
                      src={getLogoBySymbol('TON')}
                      alt="TON"
                      className="token-logo-img"
                      style={{ width: 32, height: 32, borderRadius: '50%' }}
                    />
                    TON
                  </span>
                  <span className="balance-value">
                    <p>{formatNumber(tonBalance, 4)}</p>
                    <p className="balance-usd">${formatNumber(parseFloat(tonBalance) * 3.25)}</p>
                  </span>
                </div>
                {tokens.length > 0 ? (
                  tokens.map((token) => (
                    <div key={token.symbol} className="balance-item balance-divider">
                      <span className="flex items-center gap-2">
                        <img
                          src={token.logo}
                          alt={token.symbol}
                          className="token-logo-img"
                          style={{ width: 32, height: 32, borderRadius: '50%' }}
                        />
                        {token.name}
                      </span>
                      <span className="balance-value">
                        <p>{formatNumber(token.balance, 4)}</p>
                        <p className="balance-usd">${formatNumber(token.value)}</p>
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="no-tokens">Токены не найдены</p>
                )}
              </div>
            </section>

            {/* Состояние бота */}
            <section className="section">
              <h2 className="section-title">Состояние бота</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <p className="stat-label">Выполнено свопов</p>
                  <p className="stat-value">{botStats.swapCount}</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Операций с ликвидностью</p>
                  <p className="stat-value">{botStats.liquidityCount}</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Затрачено TON на свопы</p>
                  <p className="stat-value">{formatNumber(botStats.totalSwapsTonSpent)} TON</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Затрачено TON на ликвидность</p>
                  <p className="stat-value">{formatNumber(botStats.totalLiquidityTonSpent)} TON</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Затрачено Jetton</p>
                  <p className="stat-value">{formatNumber(botStats.totalJettonSpent)}</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Последнее обновление</p>
                  <p className="stat-value">
                    {botStats.lastUpdate ? new Date(botStats.lastUpdate).toLocaleString('ru-RU') : 'Н/Д'}
                  </p>
                </div>
              </div>
            </section>

            {/* Ликвидность */}
            <section className="section">
              <h2 className="section-title">Ликвидность</h2>
              {error && liquidityStatus === 'inactive' && (
                <p className="error-message">{error}</p>
              )}
              <div className="config-grid">
                <div>
                  <label className="label">Токен A</label>
                  <input
                    value="TON"
                    disabled
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Токен B</label>
                  <select
                    name="tokenB"
                    value={liquidityConfig.tokenB}
                    onChange={handleLiquidityConfigChange}
                    className="select"
                    disabled={tokens.length === 0}
                  >
                    {tokens.length === 0 ? (
                      <option value="">Токены недоступны</option>
                    ) : (
                      tokens.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.name} ({token.symbol})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="label">TON</label>
                  <input
                    type="number"
                    name="amountA"
                    value={liquidityConfig.amountA}
                    onChange={handleLiquidityConfigChange}
                    placeholder="0.00"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">{liquidityConfig.tokenB || 'Jetton'}</label>
                  <input
                    type="number"
                    name="amountB"
                    value={liquidityConfig.amountB}
                    onChange={handleLiquidityConfigChange}
                    placeholder="0.00"
                    className="input"
                  />
                </div>
                {!liquidityConfig.manualMode && (
                  <div className="full-width">
                    <label className="label">Порог цены (%)</label>
                    <input
                      type="number"
                      name="priceThreshold"
                      value={liquidityConfig.priceThreshold}
                      onChange={handleLiquidityConfigChange}
                      className="input"
                    />
                  </div>
                )}
                <div className="full-width checkbox-container">
                  <input
                    type="checkbox"
                    checked={liquidityConfig.manualMode}
                    onChange={toggleManualMode}
                    className="checkbox"
                  />
                  <span className="checkbox-label">Ручной режим</span>
                </div>
              </div>
              {isPaid && (
                <div className="button-group">
                  <button
                    onClick={handleStartLiquidity}
                    disabled={liquidityStatus === 'active'}
                    className={`button ${liquidityStatus === 'active' ? 'active-button' : 'start-button'}`}
                  >
                    {liquidityStatus === 'active' ? 'Активен' : 'Запустить'}
                  </button>
                  {liquidityStatus === 'active' && (
                    <button
                      onClick={handleStopLiquidity}
                      className="button stop-button"
                    >
                      Стоп
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Свопы */}
            <section className="section">
              <h2 className="section-title">Свопы</h2>
              {error && swapStatus === 'inactive' && (
                <p className="error-message">{error}</p>
              )}
              <div className="config-grid">
                <div className="full-width">
                  <label className="label">Режим</label>
                  <select
                    name="swapMode"
                    value={swapConfig.swapMode}
                    onChange={handleSwapConfigChange}
                    className="select"
                  >
                    <option value="tonToJetton">TON → Jetton</option>
                    <option value="jettonToTon">Jetton → TON</option>
                    <option value="both">Оба</option>
                  </select>
                </div>
                <div>
                  <label className="label">Интервал (мин)</label>
                  <input
                    type="number"
                    name="swapInterval"
                    value={swapConfig.swapInterval}
                    onChange={handleSwapConfigChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Количество</label>
                  <input
                    type="number"
                    name="swapCount"
                    value={swapConfig.swapCount}
                    onChange={handleSwapConfigChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Объем (TON)</label>
                  <input
                    type="number"
                    name="dailyVolume"
                    value={swapConfig.dailyVolume}
                    onChange={handleSwapConfigChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Спред (%)</label>
                  <input
                    type="number"
                    name="spread"
                    value={swapConfig.spread}
                    onChange={handleSwapConfigChange}
                    className="input"
                  />
                </div>
              </div>
              {isPaid && (
                <div className="button-group">
                  <button
                    onClick={handleStartSwap}
                    disabled={swapStatus === 'active'}
                    className={`button ${swapStatus === 'active' ? 'active-button' : 'start-button'}`}
                  >
                    {swapStatus === 'active' ? 'Активен' : 'Запустить'}
                  </button>
                  {swapStatus === 'active' && (
                    <button
                      onClick={handleStopSwap}
                      className="button stop-button"
                    >
                      Стоп
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* History */}
            <section className="section">
              <h2 className="section-title">История сделок</h2>
              {trades.length === 0 ? (
                <p className="no-tokens">Сделок пока нет</p>
              ) : (
                <div className="trades-container">
                  {trades.map((trade) => (
                    <div key={trade.id} className="trade-item">
                      <div className="trade-info">
                        <p className="trade-type">
                          {trade.type === 'liquidity' ? 'Ликвидность' : 'Своп'}: {trade.tokenA} → {trade.tokenB}
                        </p>
                        <p className="trade-timestamp">
                          {new Date(trade.timestamp).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <div className="trade-details">
                        <p className="trade-amount">
                          {formatNumber(trade.amountA)} {trade.tokenA}
                        </p>
                        <p className="trade-amount">
                          {formatNumber(trade.amountB)} {trade.tokenB}
                        </p>
                        <p
                          className={`trade-status-${
                            trade.status === 'completed' ? 'completed' : trade.status === 'pending' ? 'pending' : 'failed'
                          }`}
                        >
                          {trade.status === 'completed' ? 'Завершено' : trade.status === 'pending' ? 'В процессе' : 'Ошибка'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Модалка оплаты */}
            {!isPaid && (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="pay-button"
              >
                Оплатить 15 TON
              </button>
            )}
          </div>
        )}

        {isPaymentModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Оплата</h2>
              <p className="modal-text">
                Комиссия: <span className="modal-fee">15 TON</span> за 30 дней
              </p>
              {paymentStatus === 'success' && (
                <p className="modal-status-success">Бот активирован!</p>
              )}
              {paymentStatus === 'failed' && (
                <p className="modal-status-failed">Ошибка оплаты</p>
              )}
              <div className="modal-buttons">
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  disabled={paymentStatus === 'pending'}
                  className="modal-button cancel-button"
                >
                  Отмена
                </button>
                <button
                  onClick={handlePaymentClick}
                  disabled={paymentStatus === 'pending' || paymentStatus === 'success'}
                  className={`modal-button ${
                    paymentStatus === 'pending' || paymentStatus === 'success' ? 'disabled-button' : 'confirm-button'
                  }`}
                >
                  {paymentStatus === 'pending' ? 'Обработка...' : paymentStatus === 'success' ? 'Готово' : 'Оплатить'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Bots;
