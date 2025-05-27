import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import './MiningStyles.css';

import b1 from '../../assets/miner/b1.png';
import b5 from '../../assets/miner/b5.png';
import b10 from '../../assets/miner/b10.png';
import b20 from '../../assets/miner/b20.png';

const MINERS = [
  {
    type: 'ASIC_MINER_B1',
    name: 'ASIC Miner B1',
    image: b1,
    priceTon: 10,
    speed: 0.00001,
    roi: 365,
    available: true,
    description: 'Basic model for PoSO mining beginners. Available to everyone.',
  },
  {
    type: 'ASIC_MINER_B5',
    name: 'ASIC Miner B5',
    image: b5,
    priceTon: 50,
    speed: 0.00005,
    roi: 230,
    available: true,
    description: 'Optimal balance of price and profitability.',
  },
  {
    type: 'ASIC_MINER_B10',
    name: 'ASIC Miner B10',
    image: b10,
    priceTon: 100,
    speed: 0.0001,
    roi: 180,
    available: true,
    description: 'For advanced miners, maximum uptime.',
  },
  {
    type: 'ASIC_MINER_B20',
    name: 'ASIC Miner B20',
    image: b20,
    priceTon: 200,
    speed: 0.0002,
    roi: 150,
    available: true,
    description: 'Professional model. The best yield for large-scale users.',
  }
];

const formatNumber = (num: number, decimals = 5) =>
  num.toLocaleString('en-US', { maximumFractionDigits: decimals });

const DOCS = [
  {
    title: 'PoSO Mining Business Plan',
    content: (
      <div>
        <b>PoSO is a revolution in TON blockchain:</b> the first “real” mining via smart contracts.<br /><br />
        <ul>
          <li>You buy a PoSO-ASIC (SMART-miner) — it is permanently linked to your wallet</li>
          <li>Each miner brings daily income in <b>POSO</b> tokens</li>
          <li>Rewards are credited <b>by smart contract</b> — no human factor involved</li>
          <li>You can withdraw and sell POSO tokens instantly <b>on our PoSO DEX exchange</b></li>
        </ul>
        <br />
        <b>Pay once — earn every day!</b>
      </div>
    ),
  },
  {
    title: 'Technical Documentation',
    content: (
      <div>
        <b>PoSO Miner</b> is a SMART contract that accrues <b>POSO</b> to your TON address every minute.<br /><br />
        <ul>
          <li>Accruals every minute, automatically, with no intervention needed</li>
          <li>Anyone can check the miner’s operation and reward history</li>
          <li>POSO token inflation is regulated by the smart contract</li>
          <li>Mining speed depends on ASIC power</li>
        </ul>
        <br />
        <b>The entire PoSO Mining economy is fully on-chain, transparent and automated.</b>
      </div>
    ),
  },
];

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mining-accordion">
      <button className="mining-accordion__btn" onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <svg className={`mining-accordion__icon${open ? ' open' : ''}`} width="20" height="20" viewBox="0 0 20 20">
          <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>
      <div className={`mining-accordion__content${open ? ' open' : ''}`}>{open && children}</div>
    </div>
  );
};

const Mining: React.FC = () => {
  const handleBuy = (miner: any) => {
    alert(`Buy miner: ${miner.name} for ${miner.priceTon} TON\nSpeed: ${miner.speed}/h`);
  };

  return (
    <div className="mining-main-bg">
      <div className="mining-hero">
        <div className="mining-hero__content">
          <h1 className="mining-hero__title">
            PoSO Mining — Your Mining on TON
          </h1>
          <div className="mining-hero__desc">
            PoSO SMART-miners work via smart contracts: buy one — and get POSO every day.<br />
            <b>You can withdraw and instantly sell POSO on our PoSO DEX exchange!</b>
          </div>
        </div>
      </div>

      <div className="miner-list-pro">
        {MINERS.map((miner) => (
          <div key={miner.type} className={`miner-card-pro${!miner.available ? ' miner-card-pro--disabled' : ''}`}>
            <div className="miner-card-pro__img-block">
              <img src={miner.image} alt={miner.name} className="miner-card-pro__img" />
              <div className="miner-card-pro__badge">
                {miner.priceTon} TON
              </div>
            </div>
            <div className="miner-card-pro__content">
              <div className="miner-card-pro__header">
                <span className="miner-card-pro__title">{miner.name}</span>
                <span className="miner-card-pro__roi">ROI ~{miner.roi} days</span>
              </div>
              <div className="miner-card-pro__stats">
                <div>
                  <div className="miner-card-pro__stats-label">Speed</div>
                  <div className="miner-card-pro__stats-value">{formatNumber(miner.speed, 5)} <span className="mine-unit">POSO/h</span></div>
                </div>
                <div>
                  <div className="miner-card-pro__stats-label">Price</div>
                  <div className="miner-card-pro__stats-value">{miner.priceTon} <span className="ton-unit">TON</span></div>
                </div>
              </div>
              <div className="miner-card-pro__desc">{miner.description}</div>
              <button
                className="miner-card-pro__btn"
                disabled={!miner.available}
                onClick={() => handleBuy(miner)}
              >
                {miner.available ? `Buy for ${miner.priceTon} TON` : 'Out of stock'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mining-docs-section">
        {DOCS.map((doc, i) => (
          <Accordion title={doc.title} key={i}>
            {doc.content}
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default Mining;

