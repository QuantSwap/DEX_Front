import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options?: { label: string; path: string }[]; 
  children?: React.ReactNode; 
}

const BottomModal: React.FC<BottomModalProps> = ({ isOpen, onClose, title, options, children }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-blue-900 w-full max-w-screen-xl p-4 rounded-t-lg animate-slide-up">
        <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
        {options && options.length > 0 ? (
          <div className="flex flex-col space-y-2">
            {options.map((option) => (
              <button
                key={option.path}
                onClick={() => {
                  navigate(option.path);
                  onClose();
                }}
                className="p-2 text-left text-gray-300 hover:text-blue-400 hover:bg-blue-800 rounded"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <div>{children}</div> 
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default BottomModal;
