import React from 'react';
import HeaderWrapper from '../components/HeaderWrapper';  
import SidebarWrapper from '../components/SidebarWrapper'; 

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <HeaderWrapper /> {/* Header  */}
      <SidebarWrapper /> {/* Sidebar  */}
      <main className="flex-1 p-4 text-white overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
