import React from 'react';
import { Plus, Minus } from 'lucide-react';

type QuantitySelectorProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  maxQuantity?: number;
  manageInventory?: boolean | null;
  allowBackorder?: boolean | null; 
  disabled?: boolean;
  size?: 'mobile' | 'desktop';
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  maxQuantity,
  manageInventory = true, 
  allowBackorder = false, 
  disabled = false,
  size = 'desktop',
}) => {
  const shouldManageInventory = manageInventory ?? true;
  const canBackorder = allowBackorder ?? false;
  
  const isDecrementDisabled = quantity <= 1 || disabled;
  const isIncrementDisabled = disabled || (shouldManageInventory && !canBackorder && maxQuantity !== undefined && quantity >= maxQuantity);

  const displayClasses = size === 'mobile' ? 'w-12 h-10' : 'w-12 h-8 sm:w-16 sm:h-10';
  const textClasses = size === 'mobile' ? 'text-base' : 'text-sm sm:text-base';

  if (size === 'desktop') {
    return (
      <div className="flex items-center border py-1.5 border-lightgray rounded-base shadow-sm overflow-hidden bg-white">
        <button
          onClick={onDecrement}
          disabled={isDecrementDisabled}
          className="w-10 h-10 flex items-center justify-center bg-white text-secondary border-none hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
        >
          <Minus className="w-4 h-4 stroke-[2]" />
        </button>
        <div className="flex items-center justify-center w-12 h-10  flex-shrink-0">
          <span className="font-semibold text-base text-secondary">{quantity}</span>
        </div>
        <button
          onClick={onIncrement}
          disabled={isIncrementDisabled}
          className="w-10 h-10 flex items-center justify-center bg-white text-secondary border-none hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center border border-lightgray rounded-base shadow-sm overflow-hidden bg-white py-1.5">
      <button
        onClick={onDecrement}
        disabled={isDecrementDisabled}
        className="w-10 h-10 flex items-center justify-center bg-white text-secondary border-none hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
      >
        <Minus className="w-4 h-4 stroke-[2]" />
      </button>
      <div className="flex items-center justify-center w-12 h-10  flex-shrink-0">
        <span className="font-semibold text-base text-secondary">{quantity}</span>
      </div>
      <button
        onClick={onIncrement}
        disabled={isIncrementDisabled}
        className="w-10 h-10 flex items-center justify-center bg-white text-secondary border-none hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
      >
        <Plus className="w-4 h-4 stroke-[2]" />
      </button>
    </div>
  );
};

export default QuantitySelector;