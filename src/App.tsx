import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useLanguage } from './LanguageContext';

import DashboardRU from './pages/Dashboard/Dashboard';
import DashboardCreatorRU from './pages/Dashboard/DashboardCreator';
import TradeRU from './pages/Trade/Trade';
import TradingOrderBookRU from './pages/Trade/TradingOrderBook';
import PoolsRU from './pages/Pools/Pools';
import AirdropRU from './pages/Airdrop/Airdrop';
import CreateAirdropRU from './pages/Airdrop/CreateAirdrop';
import CompetitionRU from './pages/Competition/Competition';
import CompetitionCreatorRU from './pages/Competition/CompetitionCreator';
import StakingRU from './pages/Staking/Staking';
import StakingCreatorRU from './pages/Staking/StakingCreator';
import BotsRU from './pages/Bot/Bots';
import TraderBotsRU from './pages/Bot/TraderBots';
import DistributionCreatorRU from './pages/Distribution/DistributionCreator';
import AdminRU from './pages/Admin/Admin';
import JettonCreateRU from './pages/JettonCreate/JettonCreate';
import PoSoMiningRU from './pages/PoSo/mining';
import MyMiningRU from './pages/PoSo/myMining';

import DashboardEN from './pagesEN/Dashboard/Dashboard';
import DashboardCreatorEN from './pagesEN/Dashboard/DashboardCreator';
import TradeEN from './pagesEN/Trade/Trade';
import TradingOrderBookEN from './pagesEN/Trade/TradingOrderBook';
import PoolsEN from './pagesEN/Pools/Pools';
import AirdropEN from './pagesEN/Airdrop/Airdrop';
import CreateAirdropEN from './pagesEN/Airdrop/CreateAirdrop';
import CompetitionEN from './pagesEN/Competition/Competition';
import CompetitionCreatorEN from './pagesEN/Competition/CompetitionCreator';
import StakingEN from './pagesEN/Staking/Staking';
import StakingCreatorEN from './pagesEN/Staking/StakingCreator';
import BotsEN from './pagesEN/Bot/Bots';
import TraderBotsEN from './pagesEN/Bot/TraderBots';
import DistributionCreatorEN from './pagesEN/Distribution/DistributionCreator';
import AdminEN from './pagesEN/Admin/Admin';
import JettonCreateEN from './pagesEN/JettonCreate/JettonCreate';
import PoSoMiningEN from './pagesEN/PoSo/mining';
import MyMiningEN from './pagesEN/PoSo/myMining';

const App: React.FC = () => {
  const { language } = useLanguage();

  const Dashboard = language === 'ru' ? DashboardRU : DashboardEN;
  const DashboardCreator = language === 'ru' ? DashboardCreatorRU : DashboardCreatorEN;
  const Trade = language === 'ru' ? TradeRU : TradeEN;
  const TradingOrderBook = language === 'ru' ? TradingOrderBookRU : TradingOrderBookEN;
  const Pools = language === 'ru' ? PoolsRU : PoolsEN;
  const Airdrop = language === 'ru' ? AirdropRU : AirdropEN;
  const CreateAirdrop = language === 'ru' ? CreateAirdropRU : CreateAirdropEN;
  const Competition = language === 'ru' ? CompetitionRU : CompetitionEN;
  const CompetitionCreator = language === 'ru' ? CompetitionCreatorRU : CompetitionCreatorEN;
  const Staking = language === 'ru' ? StakingRU : StakingEN;
  const StakingCreator = language === 'ru' ? StakingCreatorRU : StakingCreatorEN;
  const Bots = language === 'ru' ? BotsRU : BotsEN;
  const TraderBots = language === 'ru' ? TraderBotsRU : TraderBotsEN;
  const DistributionCreator = language === 'ru' ? DistributionCreatorRU : DistributionCreatorEN;
  const Admin = language === 'ru' ? AdminRU : AdminEN;
  const JettonCreate = language === 'ru' ? JettonCreateRU : JettonCreateEN;
  const PoSoMining = language === 'ru' ? PoSoMiningRU : PoSoMiningEN;
  const MyMining = language === 'ru' ? MyMiningRU : MyMiningEN;

  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* redirect */}
          <Route path="/" element={<Navigate to="/dashboard/trader" replace />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard/trader" element={<Dashboard />} />
          <Route path="/dashboard/creator" element={<DashboardCreator />} />
          <Route path="/minter" element={<DashboardCreator />} />
          
          {/* Jetton creation */}
          <Route path="/jetton/create" element={<JettonCreate />} />
          
          {/* Trade routes */}
          <Route path="/trade" element={<Navigate to="/trade/swap" replace />} />
          <Route path="/trade/swap" element={<Trade />} />
          <Route path="/trade/orderbook" element={<TradingOrderBook />} />
          
          {/* Airdrop routes */}
          <Route 
            path="/airdrop/creator" 
            element={<Airdrop creatorMode={true} />} 
          />
          <Route 
            path="/airdrop/trader" 
            element={<Airdrop creatorMode={false} />} 
          />
          <Route path="/airdrop/create" element={<CreateAirdrop />} />
          
          {/* Staking routes */}
          <Route
            path="/staking/creator"
            element={<Staking creatorMode={true} />}
          />
          <Route
            path="/staking/trader"
            element={<Staking creatorMode={false} />}
          />
          <Route path="/staking/create" element={<StakingCreator />} />
          
          {/* Competition routes */}
          <Route
            path="/competition/creator"
            element={<CompetitionCreator />}
          />
          <Route
            path="/competition/trader"
            element={<Competition creatorMode={false} />}
          />
          <Route path="/competition/create" element={<CompetitionCreator />} />
          
          {/* Distribution routes */}
          <Route path="/distribution" element={<DistributionCreator />} />
          <Route path="/distribution/create" element={<DistributionCreator />} />
          
          {/* PoSo Mining routes */}
          <Route path="/poso/mining" element={<PoSoMining />} />
          <Route path="/poso/my-mining" element={<MyMining />} />
          
          {/* Bots routes */}
          <Route path="/bots/mm" element={<Bots />} />
          <Route path="/bots/trade" element={<TraderBots />} />
          
          {/* Pools */}
          <Route path="/pools" element={<Pools />} />
          
          {/* Admin */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
