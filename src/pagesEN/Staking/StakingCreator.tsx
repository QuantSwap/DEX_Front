import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './styles/StakingCreatorStyles.css';


const MOCK_TOKENS = [
  { symbol: 'TON', name: 'Toncoin', balance: '1245.17' },
  { symbol: 'JET', name: 'Jetton', balance: '90000' },
  { symbol: 'USDT', name: 'Tether USD', balance: '2732' },
];


const USER_COUNT_OPTIONS = [
  { id: 'small', users: 100, label: '100 users' },
  { id: 'medium', users: 500, label: '500 users' },
  { id: 'large', users: 1000, label: '1,000 users' },
  { id: 'xl', users: 5000, label: '5,000 users' },
  { id: 'xxl', users: 10000, label: '10,000 users' },
];


function calculateTonFee() {
  return 2.5;
}


function calculateTokenFee(totalReward: number) {
  return totalReward * 0.03;
}


function calculateRewardPerUser(apy: number, stake: number, period: number) {
  const daysInYear = 365;
  return stake * (apy / 100) * (period / daysInYear);
}


function calculateTotalTokensRequired(apy: number, users: number, stake: number, period: number) {
  const rewardPerUser = calculateRewardPerUser(apy, stake, period);
  return rewardPerUser * users;
}

const StakingCreator: React.FC = () => {
  const { walletAddress, connectWallet } = useWallet();
  const [stakingForm, setStakingForm] = useState({
    tokenSymbol: '',
    apy: { '7': '', '15': '', '30': '' },
    description: '',
    selectedPlan: USER_COUNT_OPTIONS[0],
    minStake: '',
    maxStake: '',
  });


  const token = MOCK_TOKENS.find(t => t.symbol === stakingForm.tokenSymbol);
  const periodOptions = ['7', '15', '30'] as const;
  const apyValues = periodOptions.map(p => Number(stakingForm.apy[p]) || 0);

  const minStake = parseFloat(stakingForm.minStake) || 0;
  const maxStake = parseFloat(stakingForm.maxStake) || minStake;
  const users = stakingForm.selectedPlan.users;

  const selectedPeriod = periodOptions.find(p => apyValues[periodOptions.indexOf(p)] > 0) || '30';
  const selectedApy = Number(stakingForm.apy[selectedPeriod]) || 0;
  const selectedPeriodDays = Number(selectedPeriod);

  const totalReward = calculateTotalTokensRequired(selectedApy, users, minStake, selectedPeriodDays);
  const tokenFee = calculateTokenFee(totalReward);
  const tonFee = calculateTonFee();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'initial' | 'pending' | 'success' | 'failed'>('initial');

  return (
    <div className="staking-creator-container">
      <div className="staking-creator-content container mx-auto">
        <div className="content-wrapper">
          <h1 className="title">Create Staking Pool</h1>

          {!walletAddress ? (
            <div className="no-wallet-card">
              <h2 className="no-wallet-title">Connect your wallet</h2>
              <p className="no-wallet-text">You need to connect your wallet to create staking</p>
              <button onClick={connectWallet} className="connect-wallet-button">
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="form-sections">
              <div className="cost-section">
                <h2 className="section-title">Staking Creation Cost</h2>
                <div className="cost-details">
                  <div className="cost-item">
                    <span className="cost-label">Base cost in TON:</span>
                    <span className="cost-value">{tonFee.toFixed(2)} TON</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Exchange fee:</span>
                    <span className="cost-value">{tokenFee.toFixed(2)} {stakingForm.tokenSymbol || 'Tokens'}</span>
                  </div>
                  <div className="cost-item total">
                    <span className="cost-label">Total tokens to pay:</span>
                    <span className="cost-value">
                      {(totalReward + tokenFee).toFixed(2)} {stakingForm.tokenSymbol || 'Tokens'}
                    </span>
                  </div>
                  <p className="cost-note">
                    (Calculated for minimum stake and selected number of users)
                  </p>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Staking Details</h2>

                <div className="form-fields">
                  <div className="form-field">
                    <label className="field-label">Select token for staking</label>
                    <select
                      name="tokenSymbol"
                      value={stakingForm.tokenSymbol}
                      onChange={e => setStakingForm(f => ({ ...f, tokenSymbol: e.target.value }))}
                      className="field-select"
                    >
                      <option value="">Select token</option>
                      {MOCK_TOKENS.map(token => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.name} (Balance: {token.balance})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Number of users</label>
                    <div className="plan-options">
                      {USER_COUNT_OPTIONS.map(option => (
                        <button
                          key={option.id}
                          onClick={() => setStakingForm(f => ({ ...f, selectedPlan: option }))}
                          className={`plan-option ${stakingForm.selectedPlan.id === option.id ? 'selected' : ''}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Annual Percentage Yield (APY, %)</label>
                    <div className="apy-inputs">
                      {periodOptions.map(period => (
                        <div key={period} className="apy-input-group">
                          <label className="apy-label">For {period} days</label>
                          <div className="input-with-unit">
                            <input
                              type="number"
                              name={`apy${period}`}
                              value={stakingForm.apy[period]}
                              onChange={e =>
                                setStakingForm(f => ({
                                  ...f,
                                  apy: { ...f.apy, [period]: e.target.value },
                                }))
                              }
                              className="apy-input"
                              placeholder={`E.g: ${period === '30' ? '12' : period === '15' ? '6' : '3'}`}
                              min="0"
                              step="0.01"
                            />
                            <span className="input-unit">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-field-group">
                    <div className="form-field">
                      <label className="field-label">Minimum stake</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          name="minStake"
                          value={stakingForm.minStake}
                          onChange={e => setStakingForm(f => ({ ...f, minStake: e.target.value }))}
                          className="stake-input"
                          placeholder="E.g: 10"
                          min="0"
                        />
                        <span className="input-unit">{stakingForm.tokenSymbol || 'Tokens'}</span>
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="field-label">Maximum stake (optional)</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          name="maxStake"
                          value={stakingForm.maxStake}
                          onChange={e => setStakingForm(f => ({ ...f, maxStake: e.target.value }))}
                          className="stake-input"
                          placeholder="E.g: 1000"
                          min="0"
                        />
                        <span className="input-unit">{stakingForm.tokenSymbol || 'Tokens'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Staking description</label>
                    <textarea
                      name="description"
                      value={stakingForm.description}
                      onChange={e => setStakingForm(f => ({ ...f, description: e.target.value }))}
                      className="description-textarea"
                      placeholder="Describe your staking terms and benefits"
                    />
                  </div>

                  <div className="summary-section">
                    <div className="summary-item">
                      <span className="summary-label">Total participants:</span>
                      <span className="summary-value">{users.toLocaleString()}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Reward for {selectedPeriod} days (per user):</span>
                      <span className="summary-value">
                        {calculateRewardPerUser(selectedApy, minStake, selectedPeriodDays).toFixed(4)}{' '}
                        {stakingForm.tokenSymbol}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total rewards:</span>
                      <span className="summary-value">
                        {totalReward.toFixed(2)} {stakingForm.tokenSymbol}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Fee:</span>
                      <span className="summary-value">
                        {tokenFee.toFixed(2)} {stakingForm.tokenSymbol}
                      </span>
                    </div>
                    <div className="summary-item total">
                      <span className="summary-label">Total to pay:</span>
                      <span className="summary-value">
                        {(totalReward + tokenFee).toFixed(2)} {stakingForm.tokenSymbol}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="create-button"
                  >
                    Pay and Create Staking
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment modal */}
          {isPaymentModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 className="modal-title">Payment Confirmation</h2>
                <div className="payment-details">
                  <div className="payment-item">
                    <span className="payment-label">Amount in TON:</span>
                    <span className="payment-value">{tonFee.toFixed(2)} TON</span>
                  </div>
                  <div className="payment-item">
                    <span className="payment-label">Amount in tokens:</span>
                    <span className="payment-value">
                      {(totalReward + tokenFee).toFixed(2)} {stakingForm.tokenSymbol}
                    </span>
                  </div>
                  <div className="payment-item">
                    <span className="payment-label">Fee:</span>
                    <span className="payment-value">{tokenFee.toFixed(2)} {stakingForm.tokenSymbol}</span>
                  </div>
                </div>
                <p className="payment-disclaimer">
                  By clicking "Pay" you agree to the Terms of Use and confirm the transfer of funds.
                </p>
                {paymentStatus === 'success' && (
                  <div className="payment-success">
                    Payment successful! Your staking will be activated shortly.
                  </div>
                )}
                {paymentStatus === 'failed' && (
                  <div className="payment-failed">
                    Payment processing error. Please try again.
                  </div>
                )}
                <div className="modal-actions">
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setPaymentStatus('success')}
                    className="pay-button"
                  >
                    {paymentStatus === 'pending'
                      ? 'Paying...'
                      : paymentStatus === 'success'
                      ? 'Paid'
                      : 'Pay'}
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

export default StakingCreator;
