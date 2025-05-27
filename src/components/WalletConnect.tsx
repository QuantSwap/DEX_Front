import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';

const WalletConnect: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <TonConnectButton />
    </div>
  );
};

export default WalletConnect;

