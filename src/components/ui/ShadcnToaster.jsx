'use client';
import React from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiLoader, FiAlertCircle, FiX } from 'react-icons/fi';

export default function ShadcnToaster({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      className="fixed top-24 right-4 z-[120] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-white border border-gray-200/90 rounded-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] p-4 flex items-start gap-3 animate-card-in"
        >
          <div className="mt-0.5 shrink-0">
            {t.status === 'loading' && (
              <FiLoader className="text-orange-500 text-lg animate-spin" />
            )}
            {t.status === 'success' && (
              <FiCheckCircle className="text-emerald-600 text-lg" />
            )}
            {t.status === 'error' && (
              <FiAlertCircle className="text-rose-500 text-lg" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {t.title}
            </p>
            {t.description && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {t.description}
              </p>
            )}
          </div>

          {t.action?.href && (
            <Link
              href={t.action.href}
              onClick={() => onDismiss(t.id)}
              className="shrink-0 self-center px-2.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition"
            >
              {t.action.label}
            </Link>
          )}

          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Close notification"
            className="shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <FiX className="text-sm" />
          </button>
        </div>
      ))}
    </div>
  );
}
