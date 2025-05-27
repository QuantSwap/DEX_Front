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
      {/* Sell orders */}
      <div className="orderbook-panel">
        <div className="panel-header">
          <div className="sell-header">Sell Orders</div>
        </div>
        <div className="orders-container">
          <table className="orders-table">
            <thead className="table-header">
              <tr>
                <th className="header-cell align-left">Price</th>
                <th className="header-cell align-right">Amount</th>
                <th className="header-cell align-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="loading-cell">
                    Loading...
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
                    No active sell orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Buy orders */}
      <div className="orderbook-panel">
        <div className="panel-header">
          <div className="buy-header">Buy Orders</div>
        </div>
        <div className="orders-container">
          <table className="orders-table">
            <thead className="table-header">
              <tr>
                <th className="header-cell align-left">Price</th>
                <th className="header-cell align-right">Amount</th>
                <th className="header-cell align-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="loading-cell">
                    Loading...
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
                    No active buy orders
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
      <h2 className="panel-title">Create Order</h2>
      
      {/* Order type selector (limit / market) */}
      <div className="order-type-selector">
        <button
          className={`selector-button left ${orderType === 'limit' ? 'active' : ''}`}
          onClick={() => handleOrderTypeChange('limit', setOrderType)}
        >
          Limit
        </button>
        <button
          className={`selector-button right ${orderType === 'market' ? 'active' : ''}`}
          onClick={() => handleOrderTypeChange('market', setOrderType)}
        >
          Market
        </button>
      </div>
      
      {/* Buy/Sell selector */}
      <div className="buy-sell-selector">
        <button
          className={`selector-button left ${orderForm.type === 'buy' ? 'buy-active' : ''}`}
          onClick={() => handleTypeChange('buy', setOrderForm)}
        >
          Buy
        </button>
        <button
          className={`selector-button right ${orderForm.type === 'sell' ? 'sell-active' : ''}`}
          onClick={() => handleTypeChange('sell', setOrderForm)}
        >
          Sell
        </button>
      </div>
      
      <div className="form-fields">
        {/* Price input (hidden for market orders) */}
        {orderType === 'limit' && (
          <div className="form-field">
            <label className="field-label">Price</label>
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
          <label className="field-label">Amount</label>
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
        
        {/* Total input (for limit orders) */}
        {orderType === 'limit' && (
          <div className="form-field">
            <label className="field-label">Total</label>
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
        
        {/* Balance percentage slider */}
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
        
        {/* Balance info */}
        <div className="balance-info">
          <span>Available:</span>
          <span>
            0.00 {orderForm.type === 'buy' ? getQuoteSymbol(selectedPair) : getBaseSymbol(selectedPair)}
          </span>
        </div>
        
        <button
          onClick={() => handleCreateOrder(walletAddress, orderForm, orderType, connectWallet, selectedPair)}
          className={`order-button ${orderForm.type === 'buy' ? 'buy-button' : 'sell-button'}`}
        >
          {orderForm.type === 'buy' 
            ? `Buy ${getBaseSymbol(selectedPair)}` 
            : `Sell ${getBaseSymbol(selectedPair)}`
          }
        </button>
      </div>
      
      {/* User's recent orders */}
      <div className="user-orders">
        <h3 className="section-title">Your Orders</h3>
        <div className="no-orders-message">
          You have no active orders
        </div>
      </div>
    </div>
  );
  
  // Price chart component
  const ChartComponent = () => (
    <div className="chart-panel">
      <div className="chart-header">
        <div className="chart-title">Chart {selectedPair}</div>
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
        {/* Header and pair selector */}
        <div className="page-header">
          <h1 className="page-title">Trading {selectedPair}</h1>
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
            <h2 className="connect-wallet-title">Connect Wallet</h2>
            <p className="connect-wallet-text">You need to connect your wallet to trade</p>
            <button 
              onClick={connectWallet}
              className="connect-wallet-button"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Desktop layout - hidden on mobile */}
            <div className="desktop-layout">
              {/* Left column (3/4 width) */}
              <div className="main-column">
                {/* Chart */}
                <ChartComponent />
                
                {/* Order book */}
                <OrderBookComponent />
              </div>
              
              {/* Right column (1/4 width) */}
              <div className="sidebar-column">
                <CreateOrderComponent />
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="mobile-layout">
              {/* Mobile tabs to switch sections */}
              <div className="mobile-tabs">
                <button
                  className={`tab-button ${mobileActiveTab === 'chart' ? 'active' : ''}`}
                  onClick={() => setMobileActiveTab('chart')}
                >
                  Chart
                </button>
                <button
                  className={`tab-button ${mobileActiveTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setMobileActiveTab('orders')}
                >
                  Orders
                </button>
                <button
                  className={`tab-button ${mobileActiveTab === 'create' ? 'active' : ''}`}
                  onClick={() => setMobileActiveTab('create')}
                >
                  Create
                </button>
              </div>
              
              {/* Content for active tab */}
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
