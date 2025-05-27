import React from 'react';
import { useWallet } from '../../hooks/useWallet';

const Admin: React.FC = () => {
  const { walletAddress } = useWallet();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      {!walletAddress ? (
        <p className="text-center text-gray-400">Подключите кошелек для просмотра данных</p>
      ) : (
        <p>Страница Admin в разработке</p>
      )}
    </div>
  );
};

export default Admin;
