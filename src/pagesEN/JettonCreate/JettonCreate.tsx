import { useTranslation } from 'react-i18next';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateContainerHeight } from '../../utils/JettonCreate/jettonCreateUtils';
import './styles/JettonCreateStyles.css';

const JettonCreate: React.FC = () => {
  const navigate = useNavigate();
  const [containerHeight, setContainerHeight] = useState('calc(100vh - 120px)');

  useEffect(() => {
    const cleanup = updateContainerHeight(setContainerHeight);
    return cleanup;
  }, []);

  return (
    <div className="jetton-create-container">
      <div className="jetton-create-content container mx-auto">
        <div className="content-wrapper">
          <div className="header">
            <h1 className="title">Create New Jetton</h1>
          </div>
          <div className="iframe-container" style={{ height: containerHeight }}>
            <iframe
              id="jetton-iframe"
              src="http://193.203.162.185:4070"
              title="Jetton Minter"
              className="iframe"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              allow="clipboard-write"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JettonCreate;
