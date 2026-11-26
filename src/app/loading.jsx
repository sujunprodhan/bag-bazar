import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
        <div className="absolute w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-accent shadow-sm">
          <FiShoppingBag className="text-lg" />
        </div>
      </div>
      <p className="font-heading font-bold text-primary text-base">
        Loading <span className="text-accent">BagBazar</span>...
      </p>
      <p className="text-muted text-xs mt-1">Please wait a moment</p>
    </div>
  );
}
