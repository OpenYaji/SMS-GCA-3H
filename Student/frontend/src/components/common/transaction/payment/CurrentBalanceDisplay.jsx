import React from 'react';
import { Wallet } from 'lucide-react';

const CurrentBalanceDisplay = ({ balance }) => (
  <div className="relative rounded-2xl p-6 text-white bg-gradient-to-br from-[#F3D67D] via-[#F3B77D] to-[#F3A07D] overflow-hidden shadow-lg h-full flex flex-col justify-center min-h-[150px]">
    <div className="relative z-10">
      <h2 className="text-sm font-medium text-stone-800 mb-1">
        Current Balance
      </h2>
      <p className="text-3xl font-bold text-stone-900">
        ₱ {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 text-stone-900 -mr-4">
      <Wallet size={120} strokeWidth={1} />
    </div>
  </div>
);

export default CurrentBalanceDisplay;
