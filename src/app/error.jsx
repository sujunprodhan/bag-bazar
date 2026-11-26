'use client';
import React from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

export default function ErrorPage({ reset }) {
  return (
    <div className="min-h-[75vh] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-lg p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-3xl">
          <FiAlertTriangle />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-2xl text-primary">
            Something Went Wrong
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            An unexpected error occurred while loading this page. Please try again or return to
            the home page.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:opacity-90 text-white text-sm font-bold transition cursor-pointer"
          >
            <FiRefreshCw />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-primary hover:border-accent hover:text-accent text-sm font-bold transition"
          >
            <FiHome />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
