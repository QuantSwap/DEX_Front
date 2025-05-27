import { useTranslation } from 'react-i18next';
// src/pages/OrderBook.tsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import PriceChart from '../../components/PriceChart';
import TimeframeSelector from '../../components/TimeframeSelector';
import {
  Order,
  OrderFormData,
  fetchOrderBook,
  handleInputChange,
  handleTypeChange,
  handleOrderTypeChange,
  handleCreateOrder,
  getBaseSymbol,
  getQuoteSymbol
} from '../../utils/Trade/orderBookUtils';
import './styles/OrderBookStyles.css';

const OrderBook: React.FC = () => {
  const { walletAddress, connectWallet } = useWallet();
  const [selectedPair, setSelectedPair] = useState('TON/USDT');
  const [activeTimeframe, setActiveTimeframe] = useState('1h');
  const [loading, setLoading] = useState(false);
  
  const [mobileActiveTab, setMobileActiveTab] = useState('chart'); 
  
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    type: 'buy', 
    price: '',
    amount: '',
    total: '',
  });
  
  const [orderType, setOrderType] = useState('limit');
  
  const [availablePairs, setAvailablePairs] = useState<string[]>(['TON/USDT', 'TON/USDC', 'TON/DAI']);
  
  useEffect(() => {
    if (selectedPair) {
      fetchOrderBook(selectedPair, walletAddress, setLoading, setBuyOrders, setSellOrders);
    }
  }, [selectedPair]);
  
  const OrderBookComponent = () => (
    <div className="orderbook-grid">
      {/* Ордера на продажу */}
      <div className="orderbook-panel">
        <div className="panel-header">
          <div className="sell-header">Ордера на продажу</div>
        </div>
        <div className="orders-container">
          <table className="orders-table">
            <thead className="table-header">
              <tr>
                <th className="header-cell align-left">Цена</th>
                <th className="header-cell align-right">Количество</th>
                <th className="header-cell align-right">Всего</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="loading-cell">
                    Загрузка...
                  </td>
                </tr>
              ) : sellOrders.length > 0 ? (
                sellOrders.map((order, index) => (
                  <tr key={index} className="order-row">
                    <td className="cell align-left sell-price">{order.price}</td>
                    <td className="cell align-right">{order.amount}</td>
                    <td className="cell align-right">{order.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="empty-message">
                    Нет активных ордеров на продажу
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Ордера на покупку */}
      <div className="orderbook-panel">
        <div className="panel-header">
          <div className="buy-header">Ордера на покупку</div>
        </div>
        <div className="orders-container">
          <table className="orders-table">
            <thead className="table-header">
              <tr>
                <th className="header-cell align-left">Цена</th>
                <th className="header-cell align-right">Количество</th>
                <th className="header-cell align-right">Всего</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="loading-cell">
                    Загрузка...
                  </td>
                </tr>
              ) : buyOrders.length > 0 ? (
                buyOrders.map((order, index) => (
                  <tr key={index} className="order-row">
                    <td className="cell align-left buy-price">{order.price}</td>
                    <td className="cell align-right">{order.amount}</td>
                    <td className="cell align-right">{order.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="empty-message">
                    Нет активных ордеров на покупку
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  const CreateOrderComponent = () => (
    <div className="create-order-panel">
      <h2 className="panel-title">Создать ордер</h2>
      
      {/* Переключатель типа ордера (лимитный/рыночный) */}
      <div className="order-type-selector">
        <button
          className={`selector-button left ${orderType === 'limit' ? 'active' : ''}`}
          onClick={() => handleOrderTypeChange('limit', setOrderType)}
        >
          Лимитный
        </button>
        <button
          className={`selector-button right ${orderType === 'market' ? 'active' : ''}`}
          onClick={() => handleOrderTypeChange('market', setOrderType)}
        >
          Рыночный
        </button>
      </div>
      
      {/* Переключатель buy/sell */}
      <div className="buy-sell-selector">
        <button
          className={`selector-button left ${orderForm.type === 'buy' ? 'buy-active' : ''}`}
          onClick={() => handleTypeChange('buy', setOrderForm)}
        >
          Покупка
        </button>
        <button
          className={`selector-button right ${orderForm.type === 'sell' ? 'sell-active' : ''}`}
          onClick={() => handleTypeChange('sell', setOrderForm)}
        >
          Продажа
        </button>
      </div>
      
      <div className="form-fields">
        {/* Поле цены (скрывается для рыночного ордера) */}
        {orderType === 'limit' && (
          <div className="form-field">
            <label className="field-label">Цена</label>
            <div className="input-wrapper">
              <input
                type="number"
                name="price"
                value={orderForm.price}
                onChange={(e) => handleInputChange(e, orderForm, setOrderForm)}
                className="input-field"
                placeholder="0.00"
              />
              <span className="input-suffix">{getQuoteSymbol(selectedPair)}</span>
            </div>
          </div>
        )}
        
        <div className="form-field">
          <label className="field-label">Количество</label>
          <div className="input-wrapper">
            <input
              type="number"
              name="amount"
              value={orderForm.amount}
              onChange={(e) => handleInputChange(e, orderForm, setOrderForm)}
              className="input-field"
              placeholder="0.00"
            />
            <span className="input-suffix">{getBaseSymbol(selectedPair)}</span>
          </div>
        </div>
        
        {/* Поле "всего" (для лимитного ордера) */}
        {orderType === 'limit' && (
          <div className="form-field">
            <label className="field-label">Всего</label>
            <div className="input-wrapper">
              <input
                type="number"
                name="total"
                value={orderForm.total}
                onChange={(e) => handleInputChange(e, orderForm, setOrderForm)}
                className="input-field"
                placeholder="0.00"
              />
              <span className="input-suffix">{getQuoteSymbol(selectedPair)}</span>
            </div>
          </div>
        )}
        
        {/* Слайдер процента баланса */}
        <div className="form-field">
          <div className="slider-labels">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            className="percent-slider"
          />
        </div>
        
        {/* Баланс */}
        <div className="balance-info">
          <span>Доступно:</span>
          <span>
            0.00 {orderForm.type === 'buy' ? getQuoteSymbol(selectedPair) : getBaseSymbol(selectedPair)}
          </span>
        </div>
        
        <button
          onClick={() => handleCreateOrder(walletAddress, orderForm, orderType, connectWallet, selectedPair)}
          className={`order-button ${orderForm.type === 'buy' ? 'buy-button' : 'sell-button'}`}
        >
          {orderForm.type === 'buy' 
            ? `Купить ${getBaseSymbol(selectedPair)}` 
            : `Продать ${getBaseSymbol(selectedPair)}`
          }
        </button>
      </div>
      
      {/* Недавние ордера */}
      <div className="user-orders">
        <h3 className="section-title">Ваши ордера</h3>
        <div className="no-orders-message">
          У вас нет активных ордеров
        </div>
      </div>
    </div>
  );
  
  const ChartComponent = () => (
    <div className="chart-panel">
      <div className="chart-header">
        <div className="chart-title">График {selectedPair}</div>
        <TimeframeSelector 
          activeTimeframe={activeTimeframe} 
          onChange={setActiveTimeframe} 
        />
      </div>
      <div className="chart-container">
        <PriceChart pair={selectedPair} timeframe={activeTimeframe} />
      </div>
    </div>
  );
  
  return (
    <div className="orderbook-container">
      <div className="content-wrapper container mx-auto">
        {/* Заголовок и селектор пары */}
        <div className="page-header">
          <h1 className="page-title">Торговля {selectedPair}</h1>
          <div className="pair-selector-wrapper">
            <select 
              className="pair-selector"
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
            >
              {availablePairs.map((pair) => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>
        </div>
        
        {!walletAddress ? (
          <div className="connect-wallet-card">
            <h2 className="connect-wallet-title">Подключите кошелек</h2>
            <p className="connect-wallet-text">Для торговли необходимо подключить кошелек</p>
            <button 
              onClick={connectWallet}
              className="connect-wallet-button"
            >
              Подключить кошелек
            </button>
          </div>
        ) : (
          <>
            {/* Десктопная версия - скрывается на мобильных */}
            <div className="desktop-layout">
              {/* Левая колонка (3/4 ширины) */}
              <div className="main-column">
                {/* Чарт */}
                <ChartComponent />
                
                {/* Книга ордеров */}
                <OrderBookComponent />
              </div>
              
              {/* Правая колонка (1/4 ширины) */}
              <div className="sidebar-column">
                <CreateOrderComponent />
              </div>
            </div>
            
            {/* Мобильная версия - скрывается на десктопах */}
            <div className="mobile-layout">
              {/* Мобильные табы для переключения между разделами */}
              <div className="mobile-tabs">
                <button
                  className={`tab-button ${mobileActiveTab === 'chart' ? 'active' : ''}`}
                  onClick={() => setMobileActiveTab('chart')}
                >
                  График
                </button>
                <button
                  className={`tab-button ${mobileActiveTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setMobileActiveTab('orders')}
                >
                  Ордера
                </button>
                <button
                  className={`tab-button ${mobileActiveTab === 'create' ? 'active' : ''}`}
                  onClick={() => setMobileActiveTab('create')}
                >
                  Создать
                </button>
              </div>
              
              {/* Контент для выбранного таба */}
              <div className="mobile-content">
                {mobileActiveTab === 'chart' && <ChartComponent />}
                {mobileActiveTab === 'orders' && <OrderBookComponent />}
                {mobileActiveTab === 'create' && <CreateOrderComponent />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderBook;
