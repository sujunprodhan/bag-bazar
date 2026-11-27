'use client';
import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import InvoiceActions from '@/components/InvoiceActions';
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiPlus,
  FiTrash2,
  FiLogOut,
  FiLoader,
  FiCheckCircle,
  FiCheck,
  FiMessageSquare,
  FiSend,
  FiEdit2,
  FiCreditCard,
} from 'react-icons/fi';
import Container from '@/layout/Container';
import { PaymentMethodLogo } from '@/components/PaymentLogos';
import { updatePaymentSettingsAction } from '@/actions/server/settings';
import {
  updateOrderStatusAction,
  deleteOrderAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
  updateUserRoleAction,
  deleteUserAction,
} from '@/actions/server/dashboard';
import {
  getAdminChatThreadsAction,
  sendChatMessageAction,
} from '@/actions/server/chat';

const orderStatuses = ['pending', 'approved', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const defaultCategories = [
  'new-arrival',
  'backpack',
  'travel-bag',
  'ladies-bag',
  'tote-bag',
  'handbag',
  'school-bag',
  'trolley-luggage',
  'gym-duffel-bag',
  'baby-bag',
  'umbrella',
  'raincoat',
];

const emptyProductForm = {
  name: '',
  category: 'backpack',
  customCategory: '',
  price: '',
  oldPrice: '',
  imagesText: '',
  colors: 'Black, Navy',
  sizes: 'Standard',
  material: '',
  sku: '',
  shortDescription: '',
  description: '',
  keyFeaturesText: '',
  highlightsText: 'Spacious | প্রচুর জায়গা\nDurable | টেকসই ফ্যাব্রিক\nEasy Carry | মজবুত হ্যান্ডেল\nSmart Zips | সহজে খোলা-বন্ধ',
  inStock: true,
  isNewArrival: true,
};

export default function AdminDashboardClient({ user, initialData }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState(initialData?.orders || []);
  const [products, setProducts] = useState(initialData?.products || []);
  const [users, setUsers] = useState(initialData?.users || []);
  const [chatThreads, setChatThreads] = useState(initialData?.chatThreads || []);
  const [selectedThreadId, setSelectedThreadId] = useState(
    initialData?.chatThreads?.[0]?.conversationId || null
  );
  const [chatReply, setChatReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [paymentSettings, setPaymentSettings] = useState(
    initialData?.paymentSettings || {
      bkash: { number: '01608-054610', accountType: 'Personal', enabled: true, logoUrl: '/bkash.png' },
      nagad: { number: '01608-054610', accountType: 'Personal', enabled: true, logoUrl: '/nogad.jpg' },
      rocket: { number: '01608-054610', accountType: 'Personal', enabled: true, logoUrl: '/roketpay.png' },
      upay: { number: '01608-054610', accountType: 'Personal', enabled: true, logoUrl: '/upay.png' },
    }
  );
  const [savingPayments, setSavingPayments] = useState(false);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      const threads = await getAdminChatThreadsAction();
      if (active && Array.isArray(threads)) {
        setChatThreads(threads);
      }
    };
    poll();
    const intervalMs = activeTab === 'chat' ? 2500 : 6000;
    const timer = setInterval(poll, intervalMs);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [activeTab]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productForm, setProductForm] = useState(emptyProductForm);

  const availableCategories = Array.from(
    new Set([
      ...defaultCategories,
      ...products.map((p) => p.category).filter(Boolean),
    ])
  );

  const showNotice = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 2800);
  };

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;
  const filteredOrders =
    orderFilter === 'all' ? orders : orders.filter((o) => o.status === orderFilter);

  const handleLogoFileUpload = (key, file) => {
    if (!file) return;
    if (file.size > 500 * 1024) {
      showNotice('Please upload a logo image smaller than 500KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPaymentSettings((prev) => ({
          ...prev,
          [key]: { ...prev[key], logoUrl: reader.result },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePaymentSettings = async (e) => {
    e.preventDefault();
    setSavingPayments(true);
    const res = await updatePaymentSettingsAction(paymentSettings);
    setSavingPayments(false);
    if (res?.success) {
      setPaymentSettings(res.settings);
      showNotice('Payment numbers saved! Checkout will now show your updated numbers.');
    } else {
      showNotice(res?.error || 'Failed to save payment settings');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
    const res = await updateOrderStatusAction(orderId, newStatus);
    if (res.success) {
      if (newStatus === 'approved') {
        showNotice(
          res.invoiceEmailSent
            ? 'Order approved & invoice sent to customer email!'
            : 'Order approved! (Configure SMTP in .env to email invoice)'
        );
      } else {
        showNotice(`Order status updated to "${newStatus}"`);
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o._id !== orderId));
    const res = await deleteOrderAction(orderId);
    if (res.success) {
      showNotice('Order deleted');
    }
  };

  const handleSendAdminReply = async (e) => {
    e.preventDefault();
    const targetId = selectedThreadId || chatThreads[0]?.conversationId;
    if (!targetId || !chatReply.trim() || sendingReply) return;
    const msg = chatReply.trim();
    setChatReply('');
    setSendingReply(true);
    const res = await sendChatMessageAction({
      text: msg,
      targetConversationId: targetId,
    });
    setSendingReply(false);
    if (res?.success) {
      const threads = await getAdminChatThreadsAction();
      setChatThreads(threads || []);
    }
  };

  const openAddProductForm = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setShowProductForm((prev) => (editingProductId ? true : !prev));
  };

  const openEditProductForm = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name || '',
      category: product.category || 'backpack',
      customCategory: '',
      price: product.price ?? '',
      oldPrice: product.oldPrice ?? '',
      imagesText: Array.isArray(product.images) ? product.images.join(', ') : '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      material: product.material || '',
      sku: product.sku || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      keyFeaturesText: Array.isArray(product.keyFeatures)
        ? product.keyFeatures.join('\n')
        : '',
      highlightsText:
        Array.isArray(product.highlights) && product.highlights.length > 0
          ? product.highlights.map((h) => `${h.title} | ${h.subtitle || ''}`).join('\n')
          : 'Spacious | প্রচুর জায়গা\nDurable | টেকসই ফ্যাব্রিক\nEasy Carry | মজবুত হ্যান্ডেল\nSmart Zips | সহজে খোলা-বন্ধ',
      inStock: product.inStock !== undefined ? Boolean(product.inStock) : true,
      isNewArrival: Boolean(product.isNewArrival),
    });
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) return;
    setSavingProduct(true);

    if (editingProductId) {
      const res = await updateProductAction(editingProductId, productForm);
      setSavingProduct(false);
      if (res.success && res.product) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProductId ? res.product : p))
        );
        setShowProductForm(false);
        setEditingProductId(null);
        setProductForm(emptyProductForm);
        showNotice('Product updated successfully!');
      }
    } else {
      const res = await createProductAction(productForm);
      setSavingProduct(false);
      if (res.success && res.product) {
        setProducts((prev) => [res.product, ...prev]);
        setShowProductForm(false);
        setProductForm(emptyProductForm);
        showNotice('Product added to database!');
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    const res = await deleteProductAction(productId);
    if (res.success) {
      showNotice('Product deleted');
    }
  };

  const handleRoleToggle = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setUsers((prev) =>
      prev.map((u) => (u._id === targetUser._id ? { ...u, role: nextRole } : u))
    );
    const res = await updateUserRoleAction(targetUser._id, nextRole);
    if (res.success) {
      showNotice(`${targetUser.name || targetUser.email} is now ${nextRole}`);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.email?.toLowerCase() === user?.email?.toLowerCase()) {
      showNotice('You cannot delete your own admin account');
      return;
    }
    const res = await deleteUserAction(targetUser._id);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u._id !== targetUser._id));
      showNotice(`Deleted user ${targetUser.name || targetUser.email}`);
    } else if (res.error) {
      showNotice(res.error);
    }
  };

  const unreadChatCount = chatThreads.filter((t) => {
    const last = t.messages?.[t.messages.length - 1];
    return last && last.senderRole === 'user';
  }).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'orders', label: `Orders (${orders.length})`, icon: FiPackage },
    { id: 'products', label: `Products (${products.length})`, icon: FiShoppingBag },
    { id: 'users', label: `Users (${users.length})`, icon: FiUsers },
    {
      id: 'chat',
      label: unreadChatCount > 0 ? `Live Chat (${unreadChatCount})` : 'Live Chat',
      icon: FiMessageSquare,
    },
    { id: 'payments', label: 'Payment Numbers', icon: FiCreditCard },
  ];

  const activeThread =
    chatThreads.find((t) => t.conversationId === selectedThreadId) || chatThreads[0] || null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-accent text-[11px] font-bold uppercase tracking-wider mb-1.5">
              Admin Control Panel
            </span>
            <h1 className="font-heading font-extrabold text-3xl text-primary">
              BagBazar Admin Dashboard
            </h1>
          </div>

          {feedback && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-card-in">
              <FiCheckCircle />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4 sticky top-24">
              <div className="pb-4 border-b border-gray-100">
                <p className="font-bold text-sm text-primary">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted truncate">{user?.email}</p>
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
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                      }`}
                    >
                      <Icon className={isActive ? 'text-accent' : ''} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <FiLogOut />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted">Total Revenue</span>
                      <FiDollarSign className="text-emerald-600 text-lg" />
                    </div>
                    <p className="font-heading font-extrabold text-2xl text-primary">
                      ৳{totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted mt-1">
                      Excludes cancelled orders{cancelledOrders > 0 ? ` (${cancelledOrders} cancelled)` : ''}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted">Total Orders</span>
                      <FiPackage className="text-accent text-lg" />
                    </div>
                    <p className="font-heading font-extrabold text-2xl text-primary">
                      {orders.length}
                    </p>
                    <p className="text-[11px] text-amber-600 font-semibold mt-1">
                      {pendingOrders} pending
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted">Products</span>
                      <FiShoppingBag className="text-blue-600 text-lg" />
                    </div>
                    <p className="font-heading font-extrabold text-2xl text-primary">
                      {products.length}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted">Registered Users</span>
                      <FiUsers className="text-purple-600 text-lg" />
                    </div>
                    <p className="font-heading font-extrabold text-2xl text-primary">
                      {users.length}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-bold text-lg text-primary">Recent Orders</h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                    >
                      Manage all orders
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <p className="text-sm text-muted py-6 text-center">No orders yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-100 text-muted">
                            <th className="py-2.5 pr-4">Order ID</th>
                            <th className="py-2.5 pr-4">Customer</th>
                            <th className="py-2.5 pr-4">Payment</th>
                            <th className="py-2.5 pr-4">Total</th>
                            <th className="py-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.slice(0, 5).map((o) => (
                            <tr key={o._id}>
                              <td className="py-3 pr-4 font-bold text-primary">#{o.orderId}</td>
                              <td className="py-3 pr-4">{o.name}</td>
                              <td className="py-3 pr-4">{o.paymentName}</td>
                              <td className="py-3 pr-4 font-bold">
                                ৳{Number(o.total || 0).toLocaleString()}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${
                                    statusColors[o.status] || statusColors.pending
                                  }`}
                                >
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-heading font-bold text-xl text-primary">Manage Orders</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {['all', ...orderStatuses].map((st) => {
                      const count =
                        st === 'all' ? orders.length : orders.filter((o) => o.status === st).length;
                      const isActive = orderFilter === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOrderFilter(st)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition cursor-pointer ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {st} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
                {filteredOrders.length === 0 ? (
                  <p className="text-sm text-muted py-8 text-center">No orders found.</p>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <div
                        key={order._id}
                        className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 space-y-3"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm text-primary">
                                #{order.orderId}
                              </span>
                              <span className="text-muted">• {order.paymentName}</span>
                              {order.trxId && (
                                <span className="px-2 py-0.5 rounded bg-white border border-gray-200 font-mono text-[11px]">
                                  TrxID: {order.trxId}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 font-medium">
                              {order.name} ({order.phone}) — {order.address}
                            </p>
                            <p className="text-muted">
                              {order.items?.length || 0} item(s) • Total:{' '}
                              <strong className="text-accent">
                                ৳{Number(order.total || 0).toLocaleString()}
                              </strong>
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <InvoiceActions order={order} compact />
                            {order.status !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order._id, 'approved')}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                              >
                                <FiCheck />
                                <span>Approve</span>
                              </button>
                            )}

                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-primary focus:border-accent focus:outline-none cursor-pointer capitalize"
                            >
                              {orderStatuses.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order._id)}
                              aria-label={`Delete order ${order.orderId}`}
                              className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </div>

                        {order.items?.length > 0 && (
                          <div className="pt-2.5 border-t border-gray-200/70 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {order.items.map((item, idx) => {
                              const imgSrc = item.image || item.images?.[0];
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2.5 bg-white rounded-lg p-2 border border-gray-100 text-xs"
                                >
                                  {imgSrc ? (
                                    <img
                                      src={imgSrc}
                                      alt={item.name}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 rounded-md object-cover border border-gray-200 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                      <FiPackage />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-primary truncate">{item.name}</p>
                                    <p className="text-[11px] text-muted">
                                      Qty: {item.quantity || 1}
                                      {item.selectedColor ? ` • ${item.selectedColor}` : ''}
                                      {item.selectedSize ? ` • ${item.selectedSize}` : ''}
                                    </p>
                                  </div>
                                  <span className="font-bold text-gray-800 shrink-0">
                                    ৳{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-bold text-xl text-primary">Manage Products</h2>
                  <button
                    type="button"
                    onClick={openAddProductForm}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:opacity-90 text-white text-xs font-bold transition cursor-pointer"
                  >
                    <FiPlus />
                    <span>{showProductForm && !editingProductId ? 'Close Form' : 'Add Product'}</span>
                  </button>
                </div>

                {showProductForm && (
                  <form
                    onSubmit={handleSaveProduct}
                    className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 animate-card-in"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                      <h3 className="font-heading font-bold text-sm text-primary">
                        {editingProductId ? 'Edit Product' : 'Add New Product'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProductId(null);
                        }}
                        className="text-xs font-semibold text-gray-500 hover:text-primary cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Product Name"
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm({ ...productForm, name: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Category *
                        </label>
                        <select
                          value={productForm.category}
                          onChange={(e) =>
                            setProductForm({ ...productForm, category: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        >
                          {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                            </option>
                          ))}
                          <option value="__new__">+ Add New Category</option>
                        </select>
                      </div>

                      {productForm.category === '__new__' && (
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-accent mb-1">
                            New Category Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Laptop Bag, Messenger Bag"
                            value={productForm.customCategory}
                            onChange={(e) =>
                              setProductForm({ ...productForm, customCategory: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-orange-300 bg-white text-sm"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Price (৳) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="Price"
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm({ ...productForm, price: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Old Price (৳)
                        </label>
                        <input
                          type="number"
                          placeholder="Optional"
                          value={productForm.oldPrice}
                          onChange={(e) =>
                            setProductForm({ ...productForm, oldPrice: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Colors (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="Black, Navy, Grey"
                          value={productForm.colors}
                          onChange={(e) =>
                            setProductForm({ ...productForm, colors: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Sizes (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="Standard, 40L, M, L"
                          value={productForm.sizes}
                          onChange={(e) =>
                            setProductForm({ ...productForm, sizes: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Material
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Water-resistant Polyester"
                          value={productForm.material}
                          onChange={(e) =>
                            setProductForm({ ...productForm, material: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          SKU
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. TB-001"
                          value={productForm.sku}
                          onChange={(e) =>
                            setProductForm({ ...productForm, sku: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Image URLs (comma or new line separated)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="https://i.ibb.co/..., https://i.ibb.co/..."
                          value={productForm.imagesText}
                          onChange={(e) =>
                            setProductForm({ ...productForm, imagesText: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Short Description
                        </label>
                        <input
                          type="text"
                          placeholder="Short summary for product cards"
                          value={productForm.shortDescription}
                          onChange={(e) =>
                            setProductForm({ ...productForm, shortDescription: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Key Features (one per line or comma separated)
                        </label>
                        <textarea
                          rows={3}
                          placeholder={"Water-resistant fabric\nPadded 15.6-inch laptop compartment\nUSB charging port"}
                          value={productForm.keyFeaturesText}
                          onChange={(e) =>
                            setProductForm({ ...productForm, keyFeaturesText: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Product Highlights (Title | Subtitle, one per line)
                        </label>
                        <textarea
                          rows={4}
                          placeholder={"Spacious | প্রচুর জায়গা\nDurable | টেকসই ফ্যাব্রিক\nEasy Carry | মজবুত হ্যান্ডেল\nSmart Zips | সহজে খোলা-বন্ধ"}
                          value={productForm.highlightsText}
                          onChange={(e) =>
                            setProductForm({ ...productForm, highlightsText: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Full Description
                        </label>
                        <textarea
                          rows={5}
                          placeholder="Detailed product description (supports line breaks & emojis)..."
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm({ ...productForm, description: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-1">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.inStock}
                          onChange={(e) =>
                            setProductForm({ ...productForm, inStock: e.target.checked })
                          }
                          className="rounded accent-orange-500"
                        />
                        <span>In Stock</span>
                      </label>

                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isNewArrival}
                          onChange={(e) =>
                            setProductForm({ ...productForm, isNewArrival: e.target.checked })
                          }
                          className="rounded accent-orange-500"
                        />
                        <span>New Arrival</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={savingProduct}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 cursor-pointer"
                    >
                      {savingProduct ? (
                        <>
                          <FiLoader className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>{editingProductId ? 'Update Product' : 'Save Product'}</span>
                      )}
                    </button>
                  </form>
                )}

                <div className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <div
                      key={p._id}
                      className="py-3 flex items-center justify-between gap-4 text-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {p.images?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-primary truncate">{p.name}</p>
                          <p className="text-xs text-muted">
                            {p.category} • ৳{Number(p.price || 0).toLocaleString()} •{' '}
                            <span className={p.inStock ? 'text-emerald-600' : 'text-rose-500'}>
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditProductForm(p)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-primary hover:border-accent hover:text-accent text-xs font-semibold transition cursor-pointer"
                          aria-label={`Edit ${p.name}`}
                        >
                          <FiEdit2 className="text-xs" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p._id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          aria-label={`Delete ${p.name}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
                <h2 className="font-heading font-bold text-xl text-primary">Manage Users</h2>
                <div className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      className="py-3 flex flex-wrap items-center justify-between gap-3 text-sm"
                    >
                      <div>
                        <p className="font-bold text-primary">{u.name || 'Unnamed User'}</p>
                        <p className="text-xs text-muted">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-primary text-accent'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {u.role || 'user'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRoleToggle(u)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-accent hover:text-accent text-xs font-semibold transition cursor-pointer"
                        >
                          Make {u.role === 'admin' ? 'User' : 'Admin'}
                        </button>
                        {u.email?.toLowerCase() === user?.email?.toLowerCase() ? (
                          <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-400 text-xs font-semibold">
                            Current Admin
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            aria-label={`Delete ${u.name || u.email}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                          >
                            <FiTrash2 className="text-xs" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'chat' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
                <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-gray-100 p-4 space-y-2">
                  <h2 className="font-heading font-bold text-base text-primary px-2 pb-2 border-b border-gray-100">
                    Customer Chats
                  </h2>
                  {chatThreads.length === 0 ? (
                    <p className="text-xs text-muted p-4 text-center">No customer messages yet.</p>
                  ) : (
                    chatThreads.map((thread) => {
                      const isSelected = activeThread?.conversationId === thread.conversationId;
                      const lastMsg = thread.messages?.[thread.messages.length - 1];
                      return (
                        <button
                          key={thread.conversationId}
                          type="button"
                          onClick={() => setSelectedThreadId(thread.conversationId)}
                          className={`w-full text-left p-3 rounded-xl transition cursor-pointer ${
                            isSelected
                              ? 'bg-orange-50 border border-orange-200'
                              : 'hover:bg-gray-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-xs text-primary truncate">
                              {thread.customerName}
                            </p>
                            {lastMsg?.senderRole === 'user' && (
                              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-muted truncate">{thread.customerEmail}</p>
                          {lastMsg && (
                            <p className="text-xs text-gray-600 truncate mt-1">{lastMsg.text}</p>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="md:col-span-8 flex flex-col">
                  {activeThread ? (
                    <>
                      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70">
                        <p className="font-bold text-sm text-primary">
                          {activeThread.customerName}
                        </p>
                        <p className="text-xs text-muted">{activeThread.customerEmail}</p>
                      </div>

                      <div className="flex-1 p-5 space-y-3 overflow-y-auto max-h-80 bg-gray-50/40">
                        {activeThread.messages?.map((m, idx) => {
                          const isAdminMsg = m.senderRole === 'admin';
                          return (
                            <div
                              key={m._id || idx}
                              className={`flex flex-col ${
                                isAdminMsg ? 'items-end' : 'items-start'
                              }`}
                            >
                              <span className="text-[10px] text-muted mb-0.5 px-1">
                                {isAdminMsg ? 'Admin' : activeThread.customerName}
                              </span>
                              <div
                                className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed shadow-xs ${
                                  isAdminMsg
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                }`}
                              >
                                {m.text}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <form
                        onSubmit={handleSendAdminReply}
                        className="p-3.5 border-t border-gray-100 flex items-center gap-2 bg-white"
                      >
                        <input
                          type="text"
                          value={chatReply}
                          onChange={(e) => setChatReply(e.target.value)}
                          placeholder="Reply to customer..."
                          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-accent focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={sendingReply || !chatReply.trim()}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer"
                        >
                          {sendingReply ? <FiLoader className="animate-spin" /> : <FiSend />}
                          <span>Send</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-10 text-sm text-muted">
                      Select a conversation to reply live.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-5">
                <div>
                  <h2 className="font-heading font-bold text-xl text-primary">
                    Mobile Payment Numbers
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Add your real bKash, Nagad, Rocket, and Upay numbers here. Customers will see
                    these exact numbers at checkout to send payment directly to you.
                  </p>
                </div>

                <form onSubmit={handleSavePaymentSettings} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['bkash', 'nagad', 'rocket', 'upay'].map((key) => {
                      const cfg = paymentSettings[key] || {
                        number: '',
                        accountType: 'Personal',
                        enabled: true,
                      };
                      return (
                        <div
                          key={key}
                          className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <PaymentMethodLogo id={key} logoUrl={cfg.logoUrl} size="md" />
                            <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={cfg.enabled !== false}
                                onChange={(e) =>
                                  setPaymentSettings((prev) => ({
                                    ...prev,
                                    [key]: { ...prev[key], enabled: e.target.checked },
                                  }))
                                }
                                className="rounded border-gray-300 text-accent focus:ring-accent"
                              />
                              <span>Enabled</span>
                            </label>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Admin Number
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="01XXXXXXXXX"
                              value={cfg.number}
                              onChange={(e) =>
                                setPaymentSettings((prev) => ({
                                  ...prev,
                                  [key]: { ...prev[key], number: e.target.value },
                                }))
                              }
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:border-accent focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Account Type
                            </label>
                            <select
                              value={cfg.accountType || 'Personal'}
                              onChange={(e) =>
                                setPaymentSettings((prev) => ({
                                  ...prev,
                                  [key]: { ...prev[key], accountType: e.target.value },
                                }))
                              }
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:border-accent focus:outline-none"
                            >
                              <option value="Personal">Personal (Send Money)</option>
                              <option value="Merchant">Merchant (Payment)</option>
                              <option value="Agent">Agent (Cash Out)</option>
                            </select>
                          </div>

                          <div className="space-y-2 pt-1 border-t border-gray-200/80">
                            <label className="block text-[11px] font-semibold text-gray-600">
                              Custom Logo Image (Upload or URL)
                            </label>
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-accent text-xs font-semibold text-gray-700 transition cursor-pointer">
                                <span>Upload Logo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    handleLogoFileUpload(key, e.target.files?.[0]);
                                    e.target.value = '';
                                  }}
                                  className="hidden"
                                />
                              </label>
                              {cfg.logoUrl && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPaymentSettings((prev) => ({
                                      ...prev,
                                      [key]: { ...prev[key], logoUrl: '' },
                                    }))
                                  }
                                  className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                                >
                                  Reset Logo
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Or paste logo image URL (https://...)"
                              value={cfg.logoUrl?.startsWith('data:') ? '' : cfg.logoUrl || ''}
                              onChange={(e) =>
                                setPaymentSettings((prev) => ({
                                  ...prev,
                                  [key]: { ...prev[key], logoUrl: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs focus:border-accent focus:outline-none"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="submit"
                    disabled={savingPayments}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:opacity-90 disabled:opacity-60 text-white text-sm font-bold transition cursor-pointer"
                  >
                    {savingPayments ? <FiLoader className="animate-spin" /> : <FiCheck />}
                    <span>{savingPayments ? 'Saving...' : 'Save Payment Numbers'}</span>
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
