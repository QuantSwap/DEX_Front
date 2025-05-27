import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './styles/TradeStyles.css';

// ----- MOCK DATA -----
export interface Token {
  symbol: string;
  logo: string;
}

const MOCK_TOKENS: Token[] = [
  {
    symbol: 'TON',
    logo: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/toncoin-toncoin-6888837-5645461.png',
  },
  {
    symbol: 'USDT',
    logo: 'https://cdn3d.iconscout.com/3d/premium/thumb/tether-usdt-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--cryptocurrency-pack-science-technology-icons-6044470.png?f=webp',
  },
  {
    symbol: 'JET',
    logo: 'https://img.cryptorank.io/coins/jet_ton_games1704976992995.png',
  },
  {
    symbol: 'NOT',
    logo: 'https://cdn3d.iconscout.com/3d/premium/thumb/notcoin-not-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--btc-bitcoin-cryptocurrency-pack-science-technology-icons-10300408.png?f=webp',
  },
];

const DEFAULT_SLIPPAGE_OPTIONS = [0.1, 0.5, 1];
const DEFAULT_TOKEN = MOCK_TOKENS[0];

function getTokenMockBalance(symbol: string) {
  switch (symbol) {
    case 'TON': return '543.1200';
    case 'USDT': return '1200.00';
    case 'JET': return '42100.4';
    case 'NOT': return '19900.0';
    default: return '0.00';
  }
}

function getMockRate(from: string, to: string) {
  if (from === 'TON' && to === 'USDT') return '3.25';
  if (from === 'USDT' && to === 'TON') return '0.308';
  if (from === 'TON' && to === 'JET') return '13000';
  if (from === 'JET' && to === 'TON') return '0.000076';
  if (from === 'TON' && to === 'NOT') return '5';
  if (from === 'NOT' && to === 'TON') return '0.2';
  if (from === to) return '1';
  return '0.91';
}

function calcToAmountMock(fromAmount: string, fromSymbol: string, toSymbol: string) {
  const rate = parseFloat(getMockRate(fromSymbol, toSymbol));
  const amt = parseFloat(fromAmount);
  if (!isNaN(rate) && !isNaN(amt)) return (amt * rate).toFixed(4);
  return '';
}

// ----- COMPONENT -----
const Trade: React.FC = () => {
  const { walletAddress, connectWallet } = useWallet();
  const [fromToken, setFromToken] = useState<Token>(DEFAULT_TOKEN);
  const [toToken, setToToken] = useState<Token>(MOCK_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState('0.00');
  const [fromBalance, setFromBalance] = useState('0.00');
  const [toBalance, setToBalance] = useState('0.00');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [availableTokens] = useState<Token[]>(MOCK_TOKENS);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setFromBalance(getTokenMockBalance(fromToken.symbol));
    setToBalance(getTokenMockBalance(toToken.symbol));
    setExchangeRate(getMockRate(fromToken.symbol, toToken.symbol));
  }, [fromToken, toToken]);


  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      setIsLoading(true);
      setTimeout(() => {
        setToAmount(calcToAmountMock(fromAmount, fromToken.symbol, toToken.symbol));
        setIsLoading(false);
      }, 400);
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken]);


  const handleSwapClick = async () => {
    if (!walletAddress) return connectWallet();
    setIsLoading(true);
    setTimeout(() => {
      alert('Transaction sent (mock)');
      setFromBalance(
        (parseFloat(fromBalance) - parseFloat(fromAmount || '0')).toFixed(4)
      );
      setToBalance(
        (parseFloat(toBalance) + parseFloat(toAmount || '0')).toFixed(4)
      );
      setFromAmount('');
      setToAmount('');
      setIsLoading(false);
    }, 1200);
  };


  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
    setToAmount('');
  };

  return (
    <div className="trade-container">
      <div className="trade-content container mx-auto">
        <div className="trade-wrapper">
          <div className="swap-card">
            <div className="card-header">
              <h2 className="card-title">Swap</h2>
              <div className="header-actions">
                <button className="action-button" onClick={() => window.location.reload()}>
                  <span className="icon-refresh">↻</span>
                </button>
                <button className="action-button" onClick={() => setShowSettings(!showSettings)}>
                  <span className="icon-settings">⚙️</span>
                </button>
              </div>
            </div>
            {showSettings && (
              <div className="settings-panel">
                <h3 className="settings-title">Swap Settings</h3>
                <div>
                  <label className="settings-label">Allowed Slippage</label>
                  <div className="slippage-options">
                    {DEFAULT_SLIPPAGE_OPTIONS.map((value) => (
                      <button
                        key={value}
                        className={`slippage-option ${slippage === value ? 'selected' : ''}`}
                        onClick={() => setSlippage(value)}
                      >
                        {value}%
                      </button>
                    ))}
                    <input
                      className="slippage-custom"
                      placeholder="Custom"
                      value={!DEFAULT_SLIPPAGE_OPTIONS.includes(slippage) ? slippage : ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) setSlippage(val);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* From token */}
            <div className="token-input-container">
              <div className="token-input-header">
                <span className="input-label">You Send</span>
                <span className="balance-info">Balance: {fromBalance}</span>
              </div>
              <div className="token-input-field">
                <input
                  type="number"
                  className="amount-input"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={e => setFromAmount(e.target.value)}
                  min="0"
                />
                <select
                  className="token-selector"
                  value={fromToken.symbol}
                  onChange={e => {
                    const t = MOCK_TOKENS.find(x => x.symbol === e.target.value);
                    if (t) setFromToken(t);
                  }}
                >
                  {availableTokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
                <img src={fromToken.logo} alt={fromToken.symbol} className="token-icon" />
              </div>
            </div>
            {/* Switch */}
            <div className="switch-button-container">
              <button onClick={handleSwitchTokens} className="switch-button" disabled={isLoading}>
                <span>↑↓</span>
              </button>
            </div>
            {/* To token */}
            <div className="token-input-container">
              <div className="token-input-header">
                <span className="input-label">You Receive</span>
                <span className="balance-info">Balance: {toBalance}</span>
              </div>
              <div className="token-input-field">
                <input
                  type="number"
                  className="amount-input"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                />
                <select
                  className="token-selector"
                  value={toToken.symbol}
                  onChange={e => {
                    const t = MOCK_TOKENS.find(x => x.symbol === e.target.value);
                    if (t) setToToken(t);
                  }}
                >
                  {availableTokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
                <img src={toToken.logo} alt={toToken.symbol} className="token-icon" />
              </div>
            </div>
            {/* Info */}
            <div className="swap-info-container">
              <div className="info-item">
                <span className="info-label">Rate:</span>
                <span>1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Slippage:</span>
                <span>{slippage}%</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fee:</span>
                <span>0.3%</span>
              </div>
            </div>
            <button
              onClick={handleSwapClick}
              disabled={isLoading || !walletAddress || !fromAmount || parseFloat(fromAmount) <= 0}
              className={`swap-button ${isLoading ? 'loading' : (!walletAddress || !fromAmount || parseFloat(fromAmount) <= 0) ? 'disabled' : ''}`}
            >
              {isLoading ? 'Processing...' :
                !walletAddress
                  ? 'Connect Wallet'
                  : fromAmount && parseFloat(fromAmount) > 0
                    ? 'Swap'
                    : 'Enter Amount'
              }
            </button>
          </div>
          {/* Recent transactions */}
          <div className="transactions-card">
            <h2 className="card-title">Recent Transactions</h2>
            <div className="no-transactions">
              {walletAddress
                ? 'No recent transactions'
                : 'Connect your wallet to view transactions'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;
