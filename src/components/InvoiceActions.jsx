'use client';

import React from 'react';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import { downloadOrderInvoice, printOrderInvoice } from '@/lib/invoice';

export default function InvoiceActions({ order, compact = false }) {
  if (!order) return null;

  const btnClass = compact
    ? 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-accent hover:text-accent text-xs font-semibold text-gray-700 transition cursor-pointer'
    : 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-orange-400 hover:text-orange-500 text-xs sm:text-sm font-semibold text-gray-700 transition cursor-pointer';

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => printOrderInvoice(order)}
        className={btnClass}
        title="Print or Save as PDF"
      >
        <FiPrinter className="text-sm shrink-0" />
        <span>{compact ? 'Print' : 'Print / Save PDF'}</span>
      </button>
      <button
        type="button"
        onClick={() => downloadOrderInvoice(order)}
        className={btnClass}
        title="Download Invoice"
      >
        <FiDownload className="text-sm shrink-0" />
        <span>{compact ? 'Download' : 'Download Invoice'}</span>
      </button>
    </div>
  );
}
