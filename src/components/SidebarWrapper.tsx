import React from 'react';
import { useLanguage } from '../LanguageContext';
import SidebarRU from './Sidebar';
import SidebarEN from './SidebarEN';

const SidebarWrapper: React.FC = () => {
  const { language } = useLanguage();
  return language === 'ru' ? <SidebarRU /> : <SidebarEN />;
};

export default SidebarWrapper;
