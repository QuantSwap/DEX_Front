import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './style/TraderBotsStyles.css';

export type PaymentStatus = 'initial' | 'pending' | 'success' | 'failed';

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  value: number;
  logo: string;
}

export interface TradeSingleConfig {
  tokenSymbol: string;
  amount: string;
  interval: string;       
  tradesPerHour: string;   
  tradesPerDay: string;   
}

export interface TradeConfig {
  mode: 'tonToJetton' | 'jettonToTon' | 'both';
  tonToJetton: TradeSingleConfig;
  jettonToTon: TradeSingleConfig;
}

const MOCK_TOKENS: Token[] = [
  {
    symbol: 'JET',
    name: 'Jetton',
    balance: '4000',
    price: 2.05,
    value: 8200,
    logo: 'https://img.cryptorank.io/coins/jet_ton_games1704976992995.png',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    balance: '2000',
    price: 3.15,
    value: 6300,
    logo: 'https://cdn3d.iconscout.com/3d/premium/thumb/tether-usdt-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--cryptocurrency-pack-science-technology-icons-6044470.png?f=webp',
  },
];

function formatNumber(val: string | number, decimals = 2) {
  if (typeof val === 'string') val = parseFloat(val);
  if (isNaN(val)) return '0';
  return val.toLocaleString('en-US', { maximumFractionDigits: decimals });
}
function getLogoBySymbol(symbol: string): string {
  if (symbol === 'TON') {
    return 'https://cdn.iconscout.com/icon/premium/png-256-thumb/toncoin-toncoin-6888837-5645461.png';
  }
  const found = MOCK_TOKENS.find((t) => t.symbol === symbol);
  return found?.logo || '';
}

const fetchWalletData = async (
  walletAddress: string,
  setTonBalance: (b: string) => void,
  setTokens: (t: Token[]) => void,
  setTradeConfig: (cfg: TradeConfig) => void,
  setError: (e: string | null) => void,
  setLoading: (l: boolean) => void
) => {
  setTonBalance('154.10');
  setTokens(MOCK_TOKENS);
  setTradeConfig({
    mode: 'tonToJetton',
    tonToJetton: {
      tokenSymbol: MOCK_TOKENS[0].symbol,
      amount: '',
      interval: '',
      tradesPerHour: '',
      tradesPerDay: '',
    },
    jettonToTon: {
      tokenSymbol: MOCK_TOKENS[0].symbol,
      amount: '',
      interval: '',
      tradesPerHour: '',
      tradesPerDay: '',
    },
  });
  setError(null);
  setLoading(false);
};

const handleTradeConfigChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  setTradeConfig: (cfg: any) => void,
  section: 'tonToJetton' | 'jettonToTon'
) => {
  const { name, value } = e.target;
  setTradeConfig((prev: any) => ({
    ...prev,
    [section]: { ...prev[section], [name]: value }
  }));
};

const handleModeChange = (
  e: React.ChangeEvent<HTMLSelectElement>,
  setTradeConfig: (cfg: any) => void
) => {
  const { value } = e.target;
  setTradeConfig((prev: any) => ({
    ...prev,
    mode: value
  }));
};

const validateTradeConfig = () => true;
const calculateTradeFees = async (_: string) => ({ tonFee: 10 });
const startBot = async (
  _walletAddress: string,
  _tradeConfig: TradeConfig,
  _tokens: Token[],
  _validateTradeConfig: any,
  setError: (e: string | null) => void,
  setIsPaymentModalOpen: (b: boolean) => void,
  setPaymentStatus: (s: PaymentStatus) => void
) => {
  setError(null);
  setIsPaymentModalOpen(true);
  setPaymentStatus('initial');
};
const handlePayment = async (
  _walletAddress: string,
  _tradeConfig: TradeConfig,
  _sendTransaction: any,
  setPaymentStatus: (s: PaymentStatus) => void,
  setIsPaymentModalOpen: (b: boolean) => void,
  setError: (e: string | null) => void
) => {
  setPaymentStatus('pending');
  await new Promise((res) => setTimeout(res, 1000));
  setPaymentStatus('success');
  setTimeout(() => setIsPaymentModalOpen(false), 1500);
};
const subscribeToBotUpdates = (_walletAddress: string, _cb: any) => {
  return () => {};
};

const TraderBots: React.FC = () => {
  const { walletAddress } = useWallet();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tonBalance, setTonBalance] = useState<string>('0');
  const [tradeConfig, setTradeConfig] = useState<TradeConfig>({
    mode: 'tonToJetton',
    tonToJetton: {
      tokenSymbol: '',
      amount: '',
      interval: '',
      tradesPerHour: '',
      tradesPerDay: '',
    },
    jettonToTon: {
      tokenSymbol: '',
      amount: '',
      interval: '',
      tradesPerHour: '',
      tradesPerDay: '',
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('initial');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [botFee, setBotFee] = useState<number>(10);

  useEffect(() => {
    if (walletAddress) {
      fetchWalletData(walletAddress, setTonBalance, setTokens, setTradeConfig, setError, setLoading);
      loadBotFee();
      const unsubscribe = subscribeToBotUpdates(walletAddress, (updatedData: any) => {
        console.log("Bot updates received:", updatedData);
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, [walletAddress]);

  const loadBotFee = async () => {
    if (walletAddress) {
      try {
        const fees = await calculateTradeFees(walletAddress);
        setBotFee(fees.tonFee);
      } catch (error) {
        console.error("Error loading bot fee:", error);
      }
    }
  };

  const handleStartBot = async () => {
    if (!walletAddress) return;
    await startBot(
      walletAddress,
      tradeConfig,
      tokens,
      validateTradeConfig,
      setError,
      setIsPaymentModalOpen,
      setPaymentStatus
    );
  };

  const processPayment = async () => {
    if (!walletAddress) return;
    await handlePayment(
      walletAddress,
      tradeConfig,
      () => {},
      setPaymentStatus,
      setIsPaymentModalOpen,
      setError
    );
  };

  const tokenOptions = tokens.map((token) => (
    <option key={token.symbol} value={token.symbol}>
      {token.name} ({token.symbol})
    </option>
  ));

  return (
    <div className="trader-bots-container">
      <div className="trader-bots-content container mx-auto">
        <h1 className="page-title">Trade Bot</h1>
        {!walletAddress ? (
          <div className="no-wallet-card">
            <p className="no-wallet-text">
              Connect your wallet to manage bots
            </p>
          </div>
        ) : loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="content-sections">
            {/* Wallet Balance */}
            <div className="balance-card">
              <h2 className="section-title">Wallet Balance</h2>
              <div className="table-container">
                <table className="balance-table">
                  <thead>
                    <tr className="table-header">
                      <th className="header-cell">Token</th>
                      <th className="header-cell text-right">Balance</th>
                      <th className="header-cell text-right hidden-mobile">Price</th>
                      <th className="header-cell text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="table-row">
                      <td className="cell">
                        <div className="token-info">
                          <img
                            src={getLogoBySymbol('TON')}
                            alt="TON"
                            className="token-logo-img"
                            style={{ width: 28, height: 28, borderRadius: '50%' }}
                          />
                          <span style={{ marginLeft: 8 }}>TON</span>
                        </div>
                      </td>
                      <td className="cell text-right">{formatNumber(tonBalance, 4)}</td>
                      <td className="cell text-right hidden-mobile">$3.25</td>
                      <td className="cell text-right">${formatNumber(parseFloat(tonBalance) * 3.25)}</td>
                    </tr>
                    {tokens.map((token) => (
                      <tr key={token.symbol} className="table-row">
                        <td className="cell">
                          <div className="token-info">
                            <img
                              src={token.logo}
                              alt={token.symbol}
                              className="token-logo-img"
                              style={{ width: 28, height: 28, borderRadius: '50%' }}
                            />
                            <span style={{ marginLeft: 8 }}>{token.name}</span>
                          </div>
                        </td>
                        <td className="cell text-right">{formatNumber(token.balance, 4)}</td>
                        <td className="cell text-right hidden-mobile">${formatNumber(token.price, 4)}</td>
                        <td className="cell text-right">${formatNumber(token.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* --- Bot Config --- */}
            <div className="bot-config-card">
              <h2 className="section-title">Trade Bot Settings</h2>
              {error && (
                <p className="error-message">{error}</p>
              )}
              <div className="form-fields">
                <div className="form-field">
                  <label className="field-label">Mode</label>
                  <select
                    name="mode"
                    value={tradeConfig.mode}
                    onChange={(e) => handleModeChange(e, setTradeConfig)}
                    className="field-select"
                  >
                    <option value="tonToJetton">TON → Jetton</option>
                    <option value="jettonToTon">Jetton → TON</option>
                    <option value="both">Both directions</option>
                  </select>
                </div>
                {(tradeConfig.mode === 'tonToJetton' || tradeConfig.mode === 'both') && (
                  <div style={{ border: "1px solid #232", borderRadius: 10, padding: 16, marginBottom: 8 }}>
                    <div className="section-title">TON → Jetton</div>
                    <div className="form-field">
                      <label className="field-label">Jetton to Buy</label>
                      <select
                        name="tokenSymbol"
                        value={tradeConfig.tonToJetton.tokenSymbol}
                        onChange={(e) => handleTradeConfigChange(e, setTradeConfig, 'tonToJetton')}
                        className="field-select"
                      >
                        {tokenOptions}
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="field-label">TON Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={tradeConfig.tonToJetton.amount}
                        onChange={(e) => handleTradeConfigChange(e, setTradeConfig, 'tonToJetton')}
                        className="field-input"
                        placeholder="Enter TON amount"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="form-field">
                      <label className="field-label">Trade interval (min.)</label>
                      <input
                        type="number"
                        name="interval"
                        value={tradeConfig.tonToJetton.interval}
                        onChange={(e) => handleTradeConfigChange(e, setTradeConfig, 'tonToJetton')}
                        className="field-input"
                        min="0"
                      />
                    </div>
                    <div className="form-field">
                      <label className="field-label">Trades per hour</label>
                      <input
                        type="number"
                        name="tradesPerHour"
                        value={tradeConfig.tonToJetton.tradesPerHour}
                        onChange={(e) => handleTradeConfigChange(e, setTradeConfig, 'tonToJetton')}
                        className="field-input"
                        min="0"
                      />
                    </div>
                    <div className="form-field">
                      <label className="field-label">Trades per day</label>
                      <input
                        type="number"
                        name="tradesPerDay"
                        value={tradeConfig.tonToJetton.tradesPerDay}
                        onChange={(e) => handleTradeConfigChange(e, setTradeConfig, 'tonToJetton')}
                        className="field-input"
                        min="0"
                      />
                    </div>
                  </div>
                )}
                {(tradeConfig.mode === 'jettonToTon' || tradeConfig.mode === 'both') && (
                  <div style={{ border: "1px solid #232", borderRadius: 10, padding: 16 }}>
                    <div className="section-title">Jetton → TON</div>
                    <div className="form-field">
                      <label className="field-label">Jetton to Sell</label>
                      <select
                        name="tokenSymbol"
                        value={tradeConfig.jettonToTon.tokenSymbol}
                        onChange={(e) => handleTradeConfigChange(e, setTradeConfig, 'jettonToTon')}
                        className="field-select"
                      >
                        {tokenOptions}
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="field-label">Jetton Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={tradeConfig.jettonToTon.amount}
                        onChange={(e) => handleTradeConfigChange(e, setTradeConfig, 'jettonToTon')}
                        className="field-input"
                        placeholder="Enter Jetton amount"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="form-field">
                      <label className="field-label">Trade interval (min.)</label>
                      <input
                        type="number"
                        name="interval"
                        value={tradeConfig.jettonToTon.interval}
                        onChange={(e) => handleTradeConfigChange(e, setTradeConfig, 'jettonToTon')}
                        className="field-input"
                        min="0"
                      />
                    </div>
                    <div className="form-field">
                      <label className="field-label">Trades per hour</label>
                      <input
                        type="number"
                        name="tradesPerHour"
                        value={tradeConfig.jettonToTon.tradesPerHour}
                        onChange={(e) => handleTradeConfigChange(e, setTradeConfig, 'jettonToTon')}
                        className="field-input"
                        min="0"
                      />
                    </div>
                    <div className="form-field">
                      <label className="field-label">Trades per day</label>
                      <input
                        type="number"
                        name="tradesPerDay"
                        value={tradeConfig.jettonToTon.tradesPerDay}
                        onChange={(e) => handleTradeConfigChange(e, setTradeConfig, 'jettonToTon')}
                        className="field-input"
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleStartBot}
                className="start-bot-button"
              >
                Start Trade Bot
              </button>
            </div>
          </div>
        )}
        {isPaymentModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">
                Payment Confirmation
              </h2>
              <div className="payment-details">
                <div className="payment-info">
                  <span className="payment-label">Amount in TON:</span>
                  <span className="payment-value">{botFee} TON</span>
                </div>
                <p className="payment-disclaimer">
                  By clicking "Pay", you send funds to an on-chain wallet to activate the bot.
                </p>
                {paymentStatus === 'success' && (
                  <p className="success-message">Bot started successfully!</p>
                )}
                {paymentStatus === 'failed' && (
                  <p className="error-message text-center">Payment failed. Please try again.</p>
                )}
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  disabled={paymentStatus === 'pending' || paymentStatus === 'success'}
                  className={`cancel-button ${paymentStatus === 'pending' || paymentStatus === 'success' ? 'disabled' : ''}`}
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={paymentStatus === 'pending' || paymentStatus === 'success'}
                  className={`confirm-button ${paymentStatus === 'pending' ? 'pending' : paymentStatus === 'success' ? 'success' : ''}`}
                >
                  {paymentStatus === 'pending' ? 'Processing...' : paymentStatus === 'success' ? 'Success' : 'Pay'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraderBots;
