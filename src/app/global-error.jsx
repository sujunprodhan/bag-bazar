'use client';
import React from 'react';

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-lg p-8 text-center space-y-4">
          <h1 className="text-2xl font-extrabold text-[#0F2A43]">
            BagBazar — Unexpected Error
          </h1>
          <p className="text-sm text-gray-500">
            We encountered a critical error. Click below to reload the application.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-[#F26B21] text-white text-sm font-bold cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
