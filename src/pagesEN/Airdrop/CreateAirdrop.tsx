import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import {
  userCountOptions,
  initialSocialNetworks,
  AirdropForm,
  initialAirdropForm,
  fetchUserTokens,
  handleFormChange,
  handlePlanChange,
  handleSocialNetworkToggle,
  handleSocialNetworkChange,
  calculateTotalTokens,
  calculateFee,
  calculateTonFee,
  validateForm,
  handleCreateAirdrop,
} from '../../utils/Airdrop/airdropCreatorUtils';
import './styles/AirdropCreatorStyles.css';

export interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  link: string;
  tokensPerAction: number;
}

export interface AirdropPlanOption {
  id: string;
  users: number;
  label: string;
}

const CreateAirdrop: React.FC = () => {
  const { walletAddress, connectWallet } = useWallet();
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>(initialSocialNetworks);
  const [airdropForm, setAirdropForm] = useState<AirdropForm>(initialAirdropForm);
  const [userTokens, setUserTokens] = useState<any[]>([]);
  
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [tonFeeAmount, setTonFeeAmount] = useState<number>(15);

  useEffect(() => {
    if (walletAddress) {
      loadUserTokens();
      loadTonFee();
    }
  }, [walletAddress]);

  useEffect(() => {
    calculateRequiredTokensAndFees();
  }, [socialNetworks, airdropForm.selectedPlan, walletAddress]);

  const loadUserTokens = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    const tokens = await fetchUserTokens(walletAddress || undefined);
    setUserTokens(tokens);
    setLoading(false);
  };

  const loadTonFee = async () => {
    if (!walletAddress) return;
    
    const fee = await calculateTonFee(walletAddress || undefined);
    setTonFeeAmount(fee);
  };

  const calculateRequiredTokensAndFees = async () => {
    try {
      const total = await calculateTotalTokens(
        socialNetworks,
        airdropForm.selectedPlan,
        walletAddress || undefined
      );
      setTotalTokens(total);

      const fee = await calculateFee(total, walletAddress || undefined);
      setFeeAmount(fee);
    } catch (error) {
      console.error('Error calculating tokens and fees:', error);
    }
  };

  const handleOpenPaymentModal = async () => {
    if (!walletAddress) {
      connectWallet();
      return;
    }
    
    const error = await validateForm(airdropForm, socialNetworks, walletAddress || undefined);
    if (error) {
      alert(error);
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const onCreateAirdrop = () => {
    if (!walletAddress) {
      connectWallet();
      return;
    }
    
    handleCreateAirdrop(
      walletAddress,
      airdropForm,
      socialNetworks,
      connectWallet,
      setLoading,
      setIsPaymentModalOpen,
      navigate
    );
  };

  return (
    <div className="airdrop-creator-container">
      <div className="airdrop-creator-content container mx-auto">
        <div className="content-wrapper">
          <h1 className="title">Create Airdrop</h1>

          {!walletAddress ? (
            <div className="no-wallet-card">
              <h2 className="no-wallet-title">Connect Wallet</h2>
              <p className="no-wallet-text">You need to connect your wallet to create an airdrop.</p>
              <button onClick={connectWallet} className="connect-button">
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="section">
              <div className="cost-card">
                <h2 className="section-title">Airdrop Creation Cost</h2>
                <div className="cost-details">
                  <div className="cost-item">
                    <span className="cost-label">Base fee:</span>
                    <span>{tonFeeAmount} TON</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Platform fee:</span>
                    <span>3% of distributed tokens</span>
                  </div>
                  <div className="cost-note">
                    <p>All airdrops are automatic.</p>
                    <p>Average moderation time — 10 minutes.</p>
                  </div>
                </div>
              </div>

              <div className="form-card">
                <h2 className="section-title">Airdrop Details</h2>
                <div className="form-grid">
                  <div>
                    <label className="form-label">Airdrop Name</label>
                    <input
                      type="text"
                      name="name"
                      value={airdropForm.name}
                      onChange={(e) => handleFormChange(e, setAirdropForm)}
                      className="form-input"
                      placeholder="Example: TON Community Token Drop"
                    />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={airdropForm.description}
                      onChange={(e) => handleFormChange(e, setAirdropForm)}
                      className="form-textarea"
                      placeholder="Describe your airdrop and its purpose"
                    />
                  </div>
                  <div>
                    <label className="form-label">Select token for airdrop</label>
                    <select
                      name="tokenSymbol"
                      value={airdropForm.tokenSymbol}
                      onChange={(e) => handleFormChange(e, setAirdropForm)}
                      className="form-select"
                    >
                      <option value="">Select token</option>
                      {userTokens.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.name} (Balance: {token.balance})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="plan-card">
                <h2 className="section-title">Number of Users</h2>
                <div className="plan-grid">
                  {userCountOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handlePlanChange(option, setAirdropForm)}
                      className={`plan-button ${airdropForm.selectedPlan.id === option.id ? 'active' : ''}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="plan-note">
                  Select the maximum number of users for your airdrop
                </div>
              </div>

              <div className="conditions-card">
                <h2 className="section-title">Token Claim Conditions</h2>
                <div className="conditions-list">
                  {socialNetworks.map((network) => (
                    <div key={network.id} className="condition-item">
                      <div className="condition-header">
                        <input
                          type="checkbox"
                          id={`enable-${network.id}`}
                          checked={network.enabled}
                          onChange={() => handleSocialNetworkToggle(network.id, setSocialNetworks)}
                          className="condition-checkbox"
                        />
                        <label htmlFor={`enable-${network.id}`} className="condition-label">
                          <span className="condition-icon">{network.icon}</span>
                          <span className="condition-name">{network.name}</span>
                        </label>
                      </div>
                      {network.enabled && (
                        <div className="condition-details">
                          <div>
                            <label className="form-label">Link</label>
                            <input
                              type="text"
                              value={network.link}
                              onChange={(e) =>
                                handleSocialNetworkChange(network.id, 'link', e.target.value, setSocialNetworks)
                              }
                              className="form-input"
                              placeholder={`Link to ${network.name}`}
                            />
                          </div>
                          <div>
                            <label className="form-label">Tokens per action</label>
                            <input
                              type="number"
                              value={network.tokensPerAction}
                              onChange={(e) =>
                                handleSocialNetworkChange(
                                  network.id,
                                  'tokensPerAction',
                                  e.target.value,
                                  setSocialNetworks
                                )
                              }
                              className="form-input"
                              placeholder="e.g., 10"
                              min="0"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-card">
                <h2 className="section-title">Summary</h2>
                <div className="summary-details">
                  <div className="summary-item">
                    <span className="cost-label">Total users:</span>
                    <span>{airdropForm.selectedPlan.users.toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="cost-label">Tokens per user:</span>
                    <span>
                      {socialNetworks
                        .filter((network) => network.enabled)
                        .reduce((sum, network) => sum + network.tokensPerAction, 0)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="cost-label">Total tokens to distribute:</span>
                    <span>{totalTokens.toLocaleString()}</span>
                  </div>
                  <div className="summary-item fee">
                    <span className="cost-label">+ Platform fee (3%):</span>
                    <span>{feeAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-item total">
                    <span>TOTAL tokens:</span>
                    <span>{(totalTokens + feeAmount).toLocaleString()}</span>
                  </div>
                  <div className="summary-item ton">
                    <span>Cost in TON:</span>
                    <span>{tonFeeAmount} TON</span>
                  </div>
                </div>
                <button onClick={handleOpenPaymentModal} disabled={loading} className="create-button">
                  {loading ? 'Loading...' : 'Pay and Create Airdrop'}
                </button>
              </div>
            </div>
          )}

          {isPaymentModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 className="modal-title">Airdrop Creation Confirmation</h2>
                <div className="modal-details">
                  <div className="modal-summary">
                    <div className="modal-summary-item">
                      <span className="cost-label">Tokens to distribute:</span>
                      <span>{totalTokens.toLocaleString()}</span>
                    </div>
                    <div className="modal-summary-item">
                      <span className="cost-label">Fee (3%):</span>
                      <span>{feeAmount.toLocaleString()}</span>
                    </div>
                    <div className="modal-summary-item total">
                      <span>Total tokens:</span>
                      <span>{(totalTokens + feeAmount).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="modal-ton">
                    <div className="modal-ton-item">
                      <span>Creation fee:</span>
                      <span>{tonFeeAmount} TON</span>
                    </div>
                  </div>
                  <p className="modal-note">
                    By clicking "Create airdrop", you agree to the terms of use and confirm that the tokens will be deducted from your wallet.
                  </p>
                </div>
                <div className="modal-buttons">
                  <button onClick={() => setIsPaymentModalOpen(false)} className="modal-cancel-button">
                    Cancel
                  </button>
                  <button onClick={onCreateAirdrop} disabled={loading} className="modal-create-button">
                    {loading ? 'Creating...' : 'Create Airdrop'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAirdrop;
