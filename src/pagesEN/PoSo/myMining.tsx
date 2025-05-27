import { useTranslation } from 'react-i18next';
import React from 'react';
import './MiningStyles.css';

import b1 from '../../assets/miner/b1.png';
import b5 from '../../assets/miner/b5.png';
import b10 from '../../assets/miner/b10.png';


const posoUsdtPrice = 5;
const tonUsdtPrice = 3.15;
const posoTonPrice = +(posoUsdtPrice / tonUsdtPrice).toFixed(3); // 1.587

const MOCK_MINERS = [
  {
    type: 'ASIC_MINER_B10',
    name: 'ASIC Miner B10',
    image: b10,
    amount: 2,
    earned: 340.789,
    startDate: '2023-10-12',
    tonPrice: 100,
    roi: 180,
  },
  {
    type: 'ASIC_MINER_B5',
    name: 'ASIC Miner B5',
    image: b5,
    amount: 1,
    earned: 97.52,
    startDate: '2024-03-05',
    tonPrice: 50,
    roi: 230,
  },
  {
    type: 'ASIC_MINER_B1',
    name: 'ASIC Miner B1',
    image: b1,
    amount: 0,
    earned: 0,
    startDate: '-',
    tonPrice: 10,
    roi: 365,
  },
];

function getDaysSince(date: string) {
  if (!date || date === '-' || date === '—') return '—';
  const start = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 31) return `${diff} days`;
  return `${Math.floor(diff / 30)} mo.`;
}

const formatNumber = (num: number, decimals = 4) =>
  num.toLocaleString('en-US', { maximumFractionDigits: decimals });

const MyMining: React.FC = () => (
  <div className="mining-main-bg">
    <div className="mining-hero">
      <div className="mining-hero__content">
        <h1 className="mining-hero__title">My Mining</h1>
        <div className="mining-hero__desc">
          Your PoSO miners and full income report. Track profitability, accruals and operation time for each ASIC type.
        </div>
      </div>
      <img className="mining-hero__img" src={b10} alt="Mining Banner" />
    </div>

    <div className="miner-list-pro">
      {MOCK_MINERS.map((miner) => {
        const earnedTON = miner.earned * posoTonPrice;
        const earnedUSDT = miner.earned * posoUsdtPrice;
        const priceUSDT = miner.tonPrice * tonUsdtPrice;
        return (
          <div key={miner.type} className="miner-card-pro" style={{ minHeight: 280 }}>
            <div className="miner-card-pro__img-block">
              <img src={miner.image} alt={miner.name} className="miner-card-pro__img" />
              <div className="miner-card-pro__badge">
                {miner.tonPrice} TON
                <span style={{ marginLeft: 7, color: '#26c892', fontWeight: 500, fontSize: '0.97em' }}>
                  (~{formatNumber(priceUSDT, 2)} USDT)
                </span>
              </div>
            </div>
            <div className="miner-card-pro__content">
              <div className="miner-card-pro__header">
                <span className="miner-card-pro__title">{miner.name}</span>
                <span className="miner-card-pro__roi">
                  ROI ~{miner.roi} days
                </span>
              </div>
              <div className="miner-card-pro__stats">
                <div>
                  <div className="miner-card-pro__stats-label">Your miners</div>
                  <div className="miner-card-pro__stats-value">{miner.amount || '—'}</div>
                </div>
                <div>
                  <div className="miner-card-pro__stats-label">POSO Earned</div>
                  <div className="miner-card-pro__stats-value">
                    {miner.amount > 0 ? formatNumber(miner.earned, 4) : '—'}
                    <div style={{
                      fontSize: '0.94em', color: '#43e5ac', fontWeight: 500, marginTop: 2
                    }}>
                      {miner.amount > 0
                        ? <>
                            {formatNumber(earnedTON, 3)} TON
                            {' · '}
                            {formatNumber(earnedUSDT, 2)} USDT
                          </>
                        : ''}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="miner-card-pro__stats-label">Operating time</div>
                  <div className="miner-card-pro__stats-value">{miner.amount > 0 ? getDaysSince(miner.startDate) : '—'}</div>
                </div>
                <div>
                  <div className="miner-card-pro__stats-label">Cost</div>
                  <div className="miner-card-pro__stats-value">
                    {miner.tonPrice} <span className="ton-unit">TON</span><br />
                    <span style={{ color: '#43e5ac', fontWeight: 500 }}>{formatNumber(priceUSDT, 2)} USDT</span>
                  </div>
                </div>
              </div>
              <div className="miner-card-pro__desc" style={{ color: miner.amount > 0 ? '#c7ffe5' : '#ffb3b3', fontWeight: miner.amount > 0 ? 400 : 500 }}>
                {miner.amount > 0
                  ? `Miner running since ${miner.startDate}`
                  : `You don't own this miner yet`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default MyMining;
