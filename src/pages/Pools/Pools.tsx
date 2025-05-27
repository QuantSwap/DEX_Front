import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './styles/PoolsStyles.css';

export interface Token {
  id: string;
  symbol: string;
  name: string;
  logo: string;
}

export interface Pool {
  id: string;
  token1: string;
  token2: string;
  tvl?: string;
  apr?: string;
  volume24h?: string;
}

export interface UserPool extends Pool {
  token1Amount: string;
  token2Amount: string;
  share: string;
  value: string;
}

const mockTokens: Token[] = [
  {
    id: '1',
    symbol: 'TON',
    name: 'Toncoin',
    logo: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/toncoin-toncoin-6888837-5645461.png',
  },
  {
    id: '2',
    symbol: 'USDT',
    name: 'Tether USD',
    logo: 'https://cdn3d.iconscout.com/3d/premium/thumb/tether-usdt-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--cryptocurrency-pack-science-technology-icons-6044470.png?f=webp',
  },
  {
    id: '3',
    symbol: 'USDC',
    name: 'USD Coin',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  },
  {
    id: '4',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMTGOR5XjlW24XyeuXyC7aw1l-zdundL27Pd4SEYLuibIzs8TB1O8Yw1-i8Xj9NtfXzEk&usqp=CAU',
  },
];

const mockPools: Pool[] = [
  { id: '1', token1: 'TON', token2: 'USDT', tvl: '100,000', apr: '11.2%', volume24h: '20,000' },
  { id: '2', token1: 'TON', token2: 'DAI', tvl: '65,500', apr: '14.0%', volume24h: '9,500' },
  { id: '3', token1: 'USDT', token2: 'DAI', tvl: '54,200', apr: '8.5%', volume24h: '5,800' },
];

const mockMyPools: UserPool[] = [
  {
    id: '1',
    token1: 'TON',
    token2: 'USDT',
    tvl: '100,000',
    apr: '11.2%',
    volume24h: '20,000',
    token1Amount: '35',
    token2Amount: '120',
    share: '1.12%',
    value: '$550',
  },
];

function getTokenBySymbol(symbol: string) {
  return mockTokens.find(token => token.symbol === symbol);
}

const Pools: React.FC = () => {
  const { walletAddress, connectWallet } = useWallet();
  const [activeTab, setActiveTab] = useState('pools');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [allPools, setAllPools] = useState<Pool[]>([]);
  const [myPools, setMyPools] = useState<UserPool[]>([]);
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [createPoolForm, setCreatePoolForm] = useState({
    token1: '',
    token2: '',
    amount1: '',
    amount2: '',
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAllPools(mockPools);
      setAvailableTokens(mockTokens);
      if (walletAddress && activeTab === 'myPools') setMyPools(mockMyPools);
      setLoading(false);
    }, 400);
  }, [walletAddress, activeTab]);

  const refreshMyPools = () => setMyPools(mockMyPools);

  const addLiquidity = (poolId: string) => {
    if (!walletAddress) connectWallet();
    else alert('Ликвидность добавлена (заглушка)');
  };

  const removeLiquidity = (poolId: string) => {
    if (!walletAddress) connectWallet();
    else {
      alert('Ликвидность удалена (заглушка)');
      refreshMyPools();
    }
  };

  return (
    <div className="pools-container">
      <div className="pools-content container mx-auto">
        <div className="content-wrapper">
          <div className="header">
            <h1 className="title">Пулы ликвидности</h1>
            {walletAddress && (
              <div className="tab-container">
                <div className="tabs">
                  <button
                    className={`tab-button ${activeTab === 'pools' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pools')}
                  >
                    Все пулы
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'myPools' ? 'active' : ''}`}
                    onClick={() => setActiveTab('myPools')}
                  >
                    Мои пулы
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab('create')}
                  >
                    Создать пул
                  </button>
                </div>
              </div>
            )}
          </div>

          {!walletAddress ? (
            <div className="no-wallet-card">
              <h2 className="no-wallet-title">Подключите кошелек</h2>
              <p className="no-wallet-text">Для взаимодействия с пулами ликвидности необходимо подключить кошелек</p>
              <button onClick={connectWallet} className="connect-button">
                Подключить кошелек
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'pools' && (
                <>
                  <div className="search-filter">
                    <div className="search-container">
                      <div className="search-input-wrapper">
                        <input
                          type="text"
                          className="search-input"
                          placeholder="Поиск пула..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                      </div>
                      <select className="sort-select">
                        <option value="tvl">Сортировать по TVL</option>
                        <option value="apr">Сортировать по APR</option>
                        <option value="volume">Сортировать по объему</option>
                      </select>
                    </div>
                  </div>

                  <div className="pools-table">
                    <div className="table-header">
                      <div>Пул</div>
                      <div className="text-right">TVL</div>
                      <div className="text-right">APR</div>
                      <div className="text-right">Объем (24ч)</div>
                      <div className="text-right">Действия</div>
                    </div>
                    {loading ? (
                      <div className="no-data">Загрузка...</div>
                    ) : allPools.length > 0 ? (
                      allPools
                        .filter((pool) =>
                          pool.token1.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pool.token2.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((pool) => (
                          <div key={pool.id} className="table-row">
                            <div className="pool-info">
                              <div className="token-icons">
                                <img
                                  src={getTokenBySymbol(pool.token1)?.logo}
                                  alt={pool.token1}
                                  className="token-logo-img"
                                />
                                <img
                                  src={getTokenBySymbol(pool.token2)?.logo}
                                  alt={pool.token2}
                                  className="token-logo-img"
                                />
                              </div>
                              <span>{pool.token1}/{pool.token2}</span>
                            </div>
                            <div className="text-right">{pool.tvl || '-'}</div>
                            <div className="text-right text-green">{pool.apr || '-'}</div>
                            <div className="text-right">{pool.volume24h || '-'}</div>
                            <div className="text-right">
                              <button onClick={() => addLiquidity(pool.id)} className="action-button">
                                Добавить ликвидность
                              </button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="no-data">Пулы не найдены</div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'myPools' && (
                <div className="pools-table">
                  <div className="my-pools-header">
                    <div>Пул</div>
                    <div className="text-right">Токен 1</div>
                    <div className="text-right">Токен 2</div>
                    <div className="text-right">Доля в пуле</div>
                    <div className="text-right">Стоимость</div>
                    <div className="text-right">Действия</div>
                  </div>
                  {loading ? (
                    <div className="no-data">Загрузка...</div>
                  ) : myPools.length > 0 ? (
                    myPools.map((pool) => (
                      <div key={pool.id} className="my-pools-row">
                        <div className="pool-info">
                          <div className="token-icons">
                            <img
                              src={getTokenBySymbol(pool.token1)?.logo}
                              alt={pool.token1}
                              className="token-logo-img"
                            />
                            <img
                              src={getTokenBySymbol(pool.token2)?.logo}
                              alt={pool.token2}
                              className="token-logo-img"
                            />
                          </div>
                          <span>{pool.token1}/{pool.token2}</span>
                        </div>
                        <div className="text-right">{pool.token1Amount}</div>
                        <div className="text-right">{pool.token2Amount}</div>
                        <div className="text-right">{pool.share}</div>
                        <div className="text-right">{pool.value}</div>
                        <div className="text-right">
                          <button onClick={() => removeLiquidity(pool.id)} className="remove-button">
                            Удалить ликвидность
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data">У вас нет активных пулов</div>
                  )}
                </div>
              )}

              {activeTab === 'create' && (
                <div className="create-card">
                  <h2 className="create-title">Создать новый пул ликвидности</h2>
                  <div className="form-grid">
                    <div className="token-grid">
                      <div>
                        <label className="form-label">Токен 1</label>
                        <select
                          name="token1"
                          value={createPoolForm.token1}
                          onChange={(e) => setCreatePoolForm(f => ({ ...f, token1: e.target.value }))}
                          className="form-select"
                        >
                          <option value="">Выберите токен</option>
                          {mockTokens.map((token) => (
                            <option key={token.id} value={token.symbol}>
                              {token.symbol} - {token.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Количество</label>
                        <input
                          type="number"
                          name="amount1"
                          value={createPoolForm.amount1}
                          onChange={(e) => setCreatePoolForm(f => ({ ...f, amount1: e.target.value }))}
                          className="form-input"
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                    <div className="token-grid">
                      <div>
                        <label className="form-label">Токен 2</label>
                        <select
                          name="token2"
                          value={createPoolForm.token2}
                          onChange={(e) => setCreatePoolForm(f => ({ ...f, token2: e.target.value }))}
                          className="form-select"
                        >
                          <option value="">Выберите токен</option>
                          {mockTokens
                            .filter(token => token.symbol !== createPoolForm.token1)
                            .map((token) => (
                              <option key={token.id} value={token.symbol}>
                                {token.symbol} - {token.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Количество</label>
                        <input
                          type="number"
                          name="amount2"
                          value={createPoolForm.amount2}
                          onChange={(e) => setCreatePoolForm(f => ({ ...f, amount2: e.target.value }))}
                          className="form-input"
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-item">
                        <span className="summary-label">Комиссия пула:</span>
                        <span>3%</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Начальный курс:</span>
                        <span>
                          {createPoolForm.amount1 && createPoolForm.amount2
                            ? `1 к ${(Number(createPoolForm.amount2) / Number(createPoolForm.amount1)).toFixed(3)}`
                            : '-'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        alert('Пул создан (заглушка)');
                        setCreatePoolForm({
                          token1: '',
                          token2: '',
                          amount1: '',
                          amount2: '',
                        });
                        setActiveTab('myPools');
                        refreshMyPools();
                      }}
                      disabled={
                        loading ||
                        !createPoolForm.token1 ||
                        !createPoolForm.token2 ||
                        !createPoolForm.amount1 ||
                        !createPoolForm.amount2
                      }
                      className={`create-button ${
                        loading ||
                        !createPoolForm.token1 ||
                        !createPoolForm.token2 ||
                        !createPoolForm.amount1 ||
                        !createPoolForm.amount2
                          ? 'disabled'
                          : 'enabled'
                      }`}
                    >
                      {loading ? 'Создание...' : 'Создать пул ликвидности'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pools;
