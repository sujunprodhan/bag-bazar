'use client';
import React from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useShop } from '@/context/ShopContext';
import Container from '@/layout/Container';

export default function CartPage() {
  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart } = useShop();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-1">
              Shopping Bag
            </p>
            <h1 className="font-heading font-extrabold text-3xl text-gray-900">
              Your Cart ({cartCount})
            </h1>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
            >
              <FiTrash2 />
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto text-2xl">
              <FiShoppingCart />
            </div>
            <h2 className="font-heading font-bold text-xl text-gray-900">Your cart is empty</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Looks like you haven&apos;t added any bags yet. Explore our collection and add your favorites!
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition shadow-sm"
            >
              Browse Products
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item, idx) => (
                <div
                  key={item.key}
                  style={{ animationDelay: `${idx * 45}ms` }}
                  className="animate-card-in bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xs"
                >
                  <Link
                    href={`/product/${item.productId || item._id}`}
                    className="w-24 h-24 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 relative"
                  >
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FiShoppingCart className="text-2xl" />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                      {item.category?.replace(/-/g, ' ')}
                    </span>
                    <Link
                      href={`/product/${item.productId || item._id}`}
                      className="block font-bold text-base text-gray-900 hover:text-orange-500 transition-colors truncate"
                    >
                      {item.name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="px-2 py-0.5 rounded bg-gray-100">
                        Color: <strong className="capitalize">{item.selectedColor}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-100">
                        Size: <strong>{item.selectedSize}</strong>
                      </span>
                    </div>
                    <p className="font-extrabold text-orange-500 text-base mt-2">
                      ৳{(item.price || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                      >
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="px-3 text-sm font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="p-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        <FiPlus className="text-xs" />
                      </button>
                    </div>

                    <div className="text-right min-w-20">
                      <p className="font-extrabold text-gray-900 text-sm">
                        ৳{((item.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.key)}
                      aria-label="Remove item"
                      className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </div>
                </div>
              ))}

              <Link
                href="/product"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-orange-500 transition pt-2"
              >
                <FiArrowLeft /> Continue Shopping
              </Link>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs sticky top-24 space-y-5">
                <h2 className="font-heading font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-semibold text-gray-900">
                      ৳{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charge</span>
                    <span className="text-gray-400">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                    <span>Estimated Total</span>
                    <span className="text-orange-500">৳{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all"
                >
                  Proceed to Checkout
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
