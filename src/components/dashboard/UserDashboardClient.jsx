'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiShoppingCart,
  FiLogOut,
  FiArrowRight,
  FiClock,
  FiLock,
  FiCheckCircle,
  FiLoader,
} from 'react-icons/fi';
import Container from '@/layout/Container';
import ProductCard from '@/components/ProductCard';
import InvoiceActions from '@/components/InvoiceActions';
import { setUserPasswordAction } from '@/actions/server/auth';

const statusColors = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function UserDashboardClient({ user, initialData }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [imgError, setImgError] = useState(false);
  const { orders = [], favorites = [], cartCount = 0 } = initialData || {};
  const [hasPassword, setHasPassword] = useState(Boolean(initialData?.hasPassword));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });
  const [savingPass, setSavingPass] = useState(false);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });
    if (newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPass) {
      setPassMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setSavingPass(true);
    const res = await setUserPasswordAction({ password: newPassword });
    setSavingPass(false);
    if (res?.success) {
      setHasPassword(true);
      setNewPassword('');
      setConfirmPass('');
      setPassMsg({
        type: 'success',
        text: 'Password saved! You can now log in using your email and password too.',
      });
    } else {
      setPassMsg({ type: 'error', text: res?.error || 'Failed to save password.' });
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'orders', label: `My Orders (${orders.length})`, icon: FiPackage },
    { id: 'wishlist', label: `Wishlist (${favorites.length})`, icon: FiHeart },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-accent text-xs font-bold tracking-widest uppercase mb-1">
              Customer Account
            </p>
            <h1 className="font-heading font-extrabold text-3xl text-primary">
              Welcome, {user?.name || 'Customer'}
            </h1>
          </div>

          <Link
            href="/product"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:opacity-90 text-white text-xs font-bold shadow-xs transition"
          >
            <span>Shop More Bags</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                {user?.image && !imgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name || 'User'}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary text-accent flex items-center justify-center font-bold text-lg">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-sm text-primary truncate">{user?.name}</p>
                  <p className="text-xs text-muted truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-orange-50 text-accent text-[10px] font-bold uppercase">
                    {user?.role || 'user'}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-accent text-white shadow-xs'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                      }`}
                    >
                      <Icon className="text-base" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-gray-100 space-y-1">
                <Link
                  href="/cart"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary transition"
                >
                  <span className="flex items-center gap-2.5">
                    <FiShoppingCart className="text-base" />
                    My Cart
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-bold text-primary">
                    {cartCount}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <FiLogOut className="text-base" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted">Total Orders</span>
                      <FiPackage className="text-accent text-lg" />
                    </div>
                    <p className="font-heading font-extrabold text-3xl text-primary">
                      {orders.length}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted">Saved Wishlist</span>
                      <FiHeart className="text-rose-500 text-lg" />
                    </div>
                    <p className="font-heading font-extrabold text-3xl text-primary">
                      {favorites.length}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted">Cart Items</span>
                      <FiShoppingCart className="text-emerald-600 text-lg" />
                    </div>
                    <p className="font-heading font-extrabold text-3xl text-primary">
                      {cartCount}
                    </p>
                  </div>
                </div>

                {!hasPassword && (
                  <div className="bg-white rounded-2xl border border-orange-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-accent flex items-center justify-center text-lg shrink-0">
                        <FiLock />
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-base text-primary">
                          Set a Password for Email Login
                        </h2>
                        <p className="text-xs text-muted mt-0.5">
                          You signed in with Google. Set a password so you can also log in directly
                          with <strong>{user?.email}</strong> and your password.
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSetPassword}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
                    >
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="New password (6+ chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-accent focus:outline-none"
                      />
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Confirm password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-accent focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={savingPass}
                        className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-accent hover:opacity-90 disabled:opacity-60 text-white text-sm font-bold transition cursor-pointer"
                      >
                        {savingPass ? (
                          <>
                            <FiLoader className="animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save Password</span>
                        )}
                      </button>
                    </form>

                    {passMsg.text && (
                      <p
                        className={`text-xs font-semibold ${
                          passMsg.type === 'error' ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {passMsg.text}
                      </p>
                    )}
                  </div>
                )}

                {passMsg.type === 'success' && hasPassword && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                    <FiCheckCircle />
                    <span>{passMsg.text}</span>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-bold text-lg text-primary">
                      Recent Orders
                    </h2>
                    {orders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                      >
                        View all
                      </button>
                    )}
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-10 space-y-3">
                      <FiClock className="text-3xl text-gray-300 mx-auto" />
                      <p className="text-sm text-muted">You haven&apos;t placed any orders yet.</p>
                      <Link
                        href="/product"
                        className="inline-block px-5 py-2 rounded-xl bg-accent text-white text-xs font-semibold"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div
                          key={order._id}
                          className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            {order.items?.[0]?.image || order.items?.[0]?.images?.[0] ? (
                              <img
                                src={order.items[0].image || order.items[0].images[0]}
                                alt={order.items[0].name || 'Order item'}
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-lg object-cover border border-gray-200 bg-white shrink-0"
                              />
                            ) : null}
                            <div>
                              <p className="font-bold text-sm text-primary">
                                Order #{order.orderId}
                              </p>
                              <p className="text-xs text-muted mt-0.5">
                                {order.items?.length || 0} items • {order.paymentName}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${
                                statusColors[order.status] || statusColors.pending
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="font-extrabold text-sm text-primary">
                              ৳{Number(order.total || 0).toLocaleString()}
                            </span>
                            <InvoiceActions order={order} compact />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
                <h2 className="font-heading font-bold text-xl text-primary">Order History</h2>

                {orders.length === 0 ? (
                  <p className="text-sm text-muted py-8 text-center">No orders found.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="rounded-2xl border border-gray-100 p-5 space-y-3 bg-gray-50/60"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200/70">
                          <div>
                            <span className="font-bold text-sm text-primary">
                              #{order.orderId}
                            </span>
                            <span className="text-xs text-muted ml-2">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : ''}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                              statusColors[order.status] || statusColors.pending
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-gray-600">
                          {order.items?.map((item, idx) => {
                            const imgSrc = item.image || item.images?.[0];
                            return (
                              <div key={idx} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {imgSrc ? (
                                    <img
                                      src={imgSrc}
                                      alt={item.name}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-white shrink-0"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                      <FiPackage />
                                    </div>
                                  )}
                                  <span className="truncate">
                                    {item.name} × {item.quantity} ({item.selectedColor},{' '}
                                    {item.selectedSize})
                                  </span>
                                </div>
                                <span className="font-semibold text-gray-900 shrink-0">
                                  ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-2 border-t border-gray-200/70 flex flex-wrap justify-between items-center gap-3 text-xs">
                          <span className="text-muted">
                            Payment: <strong className="text-primary">{order.paymentName}</strong>
                            {order.trxId ? ` (TrxID: ${order.trxId})` : ''}
                          </span>
                          <div className="flex flex-wrap items-center gap-3">
                            <InvoiceActions order={order} compact />
                            <span className="font-extrabold text-base text-accent">
                              Total: ৳{Number(order.total || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <h2 className="font-heading font-bold text-xl text-primary">
                  Saved Favorites ({favorites.length})
                </h2>
                {favorites.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-muted">
                    No saved favorites yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {favorites.map((p, idx) => (
                      <ProductCard key={p._id} product={p} index={idx} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
