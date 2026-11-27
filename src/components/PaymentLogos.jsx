'use client';

import React, { useEffect, useState } from 'react';
import { getPaymentSettingsAction } from '@/actions/server/settings';

const LOGO_CONFIG = {
  bkash: {
    name: 'bKash',
    defaultLogo: '/bkash.png',
    bg: 'bg-[#E2136E]',
    text: 'text-white',
    ring: 'border-[#E2136E]/30',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M12 2L4 9.5l5.5 2.5L7 22l13-11-6-2.5L12 2z" />
      </svg>
    ),
  },
  nagad: {
    name: 'Nagad',
    defaultLogo: '/nogad.jpg',
    bg: 'bg-gradient-to-r from-[#ED1C24] to-[#F6921E]',
    text: 'text-white',
    ring: 'border-orange-400/30',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <circle cx="12" cy="12" r="9" opacity="0.25" />
        <path d="M8 16V8h2.2l3.8 5V8H16v8h-2.2L10 11v5H8z" />
      </svg>
    ),
  },
  rocket: {
    name: 'Rocket',
    defaultLogo: '/roketpay.png',
    bg: 'bg-[#8C3494]',
    text: 'text-white',
    ring: 'border-purple-400/30',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M13.5 3C16.5 3 20 6 20 6s-1 4-4 7l-3.5 3.5-3-3L13 10c1.5-1.5 2.5-3.5 2.5-3.5S13.5 5 11.5 6.5L8 10 5.5 7.5 9 4c1.5-1 3-1 4.5-1zM6 15l3 3-4 2 1-5z" />
      </svg>
    ),
  },
  upay: {
    name: 'Upay',
    defaultLogo: '/upay.png',
    bg: 'bg-[#0072BC]',
    text: 'text-[#FFD100]',
    ring: 'border-sky-400/30',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M6 6h3v7.5a3 3 0 0 0 6 0V6h3v7.5a6 6 0 0 1-12 0V6z" />
      </svg>
    ),
  },
  cod: {
    name: 'COD',
    bg: 'bg-emerald-600',
    text: 'text-white',
    ring: 'border-emerald-400/30',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M3 6h18v12H3V6zm2 2v8h14V8H5zm7 1.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
      </svg>
    ),
  },
};

export function PaymentMethodLogo({ id, logoUrl, size = 'sm' }) {
  const cfg = LOGO_CONFIG[id];
  if (!cfg) return null;

  const resolvedLogo = logoUrl || cfg.defaultLogo;

  if (resolvedLogo) {
    const imgSizeClass = size === 'md' ? 'h-9 px-2.5 py-1' : 'h-7 px-2 py-0.5';
    return (
      <span
        className={`inline-flex items-center gap-1.5 bg-white rounded-md border border-gray-200 shadow-xs ${imgSizeClass}`}
      >
        <img
          src={resolvedLogo}
          alt={cfg.name}
          referrerPolicy="no-referrer"
          className="h-full w-auto max-w-[44px] object-contain rounded-xs"
        />
        <span className="text-[11px] font-bold text-gray-800">{cfg.name}</span>
      </span>
    );
  }

  const sizeClass =
    size === 'md'
      ? 'px-2.5 py-1 text-xs gap-1.5 rounded-lg'
      : 'px-2 py-0.5 text-[11px] gap-1 rounded-md';

  return (
    <span
      className={`inline-flex items-center font-bold shadow-xs border ${cfg.bg} ${cfg.text} ${cfg.ring} ${sizeClass}`}
    >
      {cfg.icon}
      <span>{cfg.name}</span>
    </span>
  );
}

export function FooterPaymentLogos() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let active = true;
    getPaymentSettingsAction().then((data) => {
      if (active && data) {
        setSettings(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-slate-400">Payment Methods:</span>
      <PaymentMethodLogo id="bkash" logoUrl={settings?.bkash?.logoUrl} />
      <PaymentMethodLogo id="nagad" logoUrl={settings?.nagad?.logoUrl} />
      <PaymentMethodLogo id="rocket" logoUrl={settings?.rocket?.logoUrl} />
      <PaymentMethodLogo id="upay" logoUrl={settings?.upay?.logoUrl} />
      <PaymentMethodLogo id="cod" />
    </div>
  );
}
