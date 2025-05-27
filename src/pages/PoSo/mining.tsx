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
    description: 'Базовая модель для новичков в PoSO. Доступен для всех.',
  },
  {
    type: 'ASIC_MINER_B5',
    name: 'ASIC Miner B5',
    image: b5,
    priceTon: 50,
    speed: 0.00005,
    roi: 230,
    available: true,
    description: 'Оптимальный баланс цены и доходности.',
  },
  {
    type: 'ASIC_MINER_B10',
    name: 'ASIC Miner B10',
    image: b10,
    priceTon: 100,
    speed: 0.0001,
    roi: 180,
    available: true,
    description: 'Для продвинутых майнеров, максимальный аптайм.',
  },
  {
    type: 'ASIC_MINER_B20',
    name: 'ASIC Miner B20',
    image: b20,
    priceTon: 200,
    speed: 0.0002,
    roi: 150,
    available: true,
    description: 'Профессиональная модель. Лучший доход для крупных игроков.',
  }
];

const formatNumber = (num: number, decimals = 5) =>
  num.toLocaleString('ru-RU', { maximumFractionDigits: decimals });

const DOCS = [
  {
    title: 'Бизнес-план PoSO Mining',
    content: (
      <div>
        <b>PoSO — это революция в блокчейне TON:</b> первый “реальный” майнинг через смарт-контракты.<br /><br />
        <ul>
          <li>Вы покупаете PoSO-ASIC (SMART-майнер) — он навсегда закреплён за вашим кошельком</li>
          <li>Каждый майнер ежедневно приносит доход в токенах <b>POSO</b></li>
          <li>Доход начисляется <b>на смарт-контракте</b> — нет человеческого фактора</li>
          <li>POSO токены можно вывести и продать прямо <b>на нашей бирже PoSO DEX</b></li>
        </ul>
        <br />
        <b>Платите только один раз — получаете доход каждый день!</b>
      </div>
    ),
  },
  {
    title: 'Техническая документация',
    content: (
      <div>
        <b>PoSO-майнер</b> — это SMART-контракт, который каждую минуту начисляет <b>POSO</b> на ваш адрес TON.<br /><br />
        <ul>
          <li>Начисления идут каждую минуту, автоматически, без вмешательства</li>
          <li>Любой может проверить работу майнера и историю начислений</li>
          <li>Инфляция POSO токена регулируется смарт-контрактом</li>
          <li>Скорость добычи — согласно мощности ASIC</li>
        </ul>
        <br />
        <b>Вся экономика PoSO Mining полностью on-chain, прозрачна и автоматизирована.</b>
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
    alert(`Покупка майнера: ${miner.name} за ${miner.priceTon} TON\nСкорость: ${miner.speed}/ч`);
  };

  return (
    <div className="mining-main-bg">
      <div className="mining-hero">
        <div className="mining-hero__content">
          <h1 className="mining-hero__title">
            PoSO Mining — Ваш майнинг на TON
          </h1>
          <div className="mining-hero__desc">
            SMART-майнеры PoSO работают на смарт-контрактах: купил — и каждый день получай POSO.<br />
            <b>POSO можно вывести и сразу продать на нашей бирже PoSO DEX!</b>
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
                <span className="miner-card-pro__roi">ROI ~{miner.roi} дней</span>
              </div>
              <div className="miner-card-pro__stats">
                <div>
                  <div className="miner-card-pro__stats-label">Скорость</div>
                  <div className="miner-card-pro__stats-value">{formatNumber(miner.speed, 5)} <span className="mine-unit">POSO/ч</span></div>
                </div>
                <div>
                  <div className="miner-card-pro__stats-label">Цена</div>
                  <div className="miner-card-pro__stats-value">{miner.priceTon} <span className="ton-unit">TON</span></div>
                </div>
              </div>
              <div className="miner-card-pro__desc">{miner.description}</div>
              <button
                className="miner-card-pro__btn"
                disabled={!miner.available}
                onClick={() => handleBuy(miner)}
              >
                {miner.available ? `Купить за ${miner.priceTon} TON` : 'Нет в наличии'}
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
