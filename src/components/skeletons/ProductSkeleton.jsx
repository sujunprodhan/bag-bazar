import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col animate-pulse">
      <div className="w-full h-64 sm:h-72 bg-gray-200/80 relative">
        <div className="absolute top-3 left-3 w-12 h-5 rounded-lg bg-gray-300/70" />
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-300/70" />
        <div className="absolute bottom-3 left-3 w-16 h-4 rounded-full bg-gray-300/70" />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="w-16 h-3 rounded bg-orange-100" />
        <div className="space-y-1.5">
          <div className="w-4/5 h-4 rounded bg-gray-200" />
          <div className="w-3/5 h-4 rounded bg-gray-200" />
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gray-200" />
          <div className="w-4 h-4 rounded-full bg-gray-200" />
          <div className="w-4 h-4 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-16 h-5 rounded bg-gray-200" />
            <div className="w-12 h-3.5 rounded bg-gray-100" />
          </div>
          <div className="w-10 h-5 rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 rounded-xl bg-gray-100" />
          <div className="h-9 rounded-xl bg-orange-200/70" />
        </div>
      </div>
    </div>
  );
}

export function HomeProductsSkeleton() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 animate-pulse">
          <div className="space-y-2">
            <div className="w-24 h-3 rounded bg-orange-100" />
            <div className="w-56 h-8 rounded-lg bg-gray-200" />
            <div className="w-40 h-4 rounded bg-gray-200/80" />
          </div>
          <div className="w-32 h-5 rounded bg-orange-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {Array.from({ length: 9 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2 animate-pulse">
          <div className="w-32 h-3 rounded bg-orange-100" />
          <div className="w-60 h-9 rounded-lg bg-gray-200" />
          <div className="w-36 h-4 rounded bg-gray-200/80" />
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block w-60 shrink-0 bg-white rounded-2xl border border-gray-100 p-4 space-y-3 h-fit animate-pulse">
            <div className="w-28 h-5 rounded bg-gray-200 mb-4" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-9 rounded-xl bg-gray-100" />
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-3 mb-5 animate-pulse">
              <div className="w-64 h-10 rounded-xl bg-white border border-gray-100" />
              <div className="w-40 h-10 rounded-xl bg-white border border-gray-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="w-32 h-5 rounded bg-gray-200 mb-6" />

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          <div className="space-y-3">
            <div className="w-full h-96 md:h-[480px] rounded-2xl bg-gray-200/80" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between">
              <div className="w-24 h-4 rounded bg-orange-100" />
              <div className="w-20 h-6 rounded-full bg-gray-200" />
            </div>
            <div className="w-4/5 h-8 rounded-lg bg-gray-200" />
            <div className="flex items-baseline gap-3">
              <div className="w-28 h-9 rounded bg-orange-100" />
              <div className="w-20 h-5 rounded bg-gray-200" />
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="w-full h-4 rounded bg-gray-200" />
              <div className="w-5/6 h-4 rounded bg-gray-200" />
              <div className="w-2/3 h-4 rounded bg-gray-200" />
            </div>
            <div className="flex gap-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-gray-200" />
              ))}
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-14 h-9 rounded-xl bg-gray-200" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="h-12 rounded-xl bg-orange-200/70" />
              <div className="h-12 rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
