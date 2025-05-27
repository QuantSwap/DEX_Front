import React from 'react';

interface TimeframeSelectorProps {
  activeTimeframe: string;
  onChange: (timeframe: string) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ activeTimeframe, onChange }) => {
  const timeframes = [
    { value: '1m', label: '1м' },
    { value: '5m', label: '5м' },
    { value: '15m', label: '15м' },
    { value: '1h', label: '1ч' },
    { value: '4h', label: '4ч' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
      {timeframes.map((tf) => (
        <button
          key={tf.value}
          className={`px-3 py-1 text-sm rounded-md ${
            activeTimeframe === tf.value
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:bg-gray-700'
          }`}
          onClick={() => onChange(tf.value)}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
};

export default TimeframeSelector;
