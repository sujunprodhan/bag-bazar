'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  FiCheckCircle,
  FiArrowLeft,
  FiTruck,
  FiSmartphone,
  FiShoppingBag,
  FiCopy,
  FiCheck,
  FiLock,
  FiLoader,
} from 'react-icons/fi';
import { useShop } from '@/context/ShopContext';
import Container from '@/layout/Container';
import InvoiceActions from '@/components/InvoiceActions';
import { PaymentMethodLogo } from '@/components/PaymentLogos';
import { createOrderAction } from '@/actions/server/order';
import { getPaymentSettingsAction } from '@/actions/server/settings';

const paymentMethods = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    desc: 'Pay in cash when your parcel arrives at your doorstep.',
    color: 'border-emerald-500 bg-emerald-50',
    badge: 'bg-emerald-500',
    accountNumber: null,
  },
  {
    id: 'bkash',
    name: 'bKash',
    desc: 'Send money to our bKash merchant/personal number.',
    color: 'border-pink-500 bg-pink-50',
    badge: 'bg-pink-600',
    accountNumber: '01608-054610 (Personal)',
    rawNumber: '01608-054610',
  },
  {
    id: 'nagad',
    name: 'Nagad',
    desc: 'Send money to our Nagad account and enter TrxID.',
    color: 'border-orange-500 bg-orange-50',
    badge: 'bg-orange-500',
    accountNumber: '01608-054610 (Personal)',
    rawNumber: '01608-054610',
  },
  {
    id: 'rocket',
    name: 'Rocket',
    desc: 'Send money via DBBL Rocket and enter TrxID.',
    color: 'border-purple-500 bg-purple-50',
    badge: 'bg-purple-600',
    accountNumber: '01608-054610 (Personal)',
    rawNumber: '01608-054610',
  },
  {
    id: 'upay',
    name: 'Upay',
    desc: 'Send money via Upay wallet and enter TrxID.',
    color: 'border-sky-500 bg-sky-50',
    badge: 'bg-sky-600',
    accountNumber: '01608-054610 (Personal)',
    rawNumber: '01608-054610',
  },
];

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, cartTotal, setCartDirect } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('dhaka');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  useEffect(() => {
    let active = true;
    getPaymentSettingsAction().then((settings) => {
      if (active && settings) {
        setPaymentSettings(settings);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const effectiveEmail = email !== null ? email : session?.user?.email || '';

  const resolvedPaymentMethods = paymentMethods
    .map((m) => {
      if (m.id === 'cod') return { ...m, enabled: true };
      const cfg = paymentSettings?.[m.id];
      if (!cfg) return { ...m, enabled: true };
      return {
        ...m,
        enabled: cfg.enabled !== false,
        accountNumber: `${cfg.number} (${cfg.accountType || 'Personal'})`,
        rawNumber: cfg.number,
        logoUrl: cfg.logoUrl || '',
      };
    })
    .filter((m) => m.enabled);

  const deliveryFee = area === 'dhaka' ? 60 : 120;
  const grandTotal = cartTotal + deliveryFee;
  const activePayment =
    resolvedPaymentMethods.find((m) => m.id === paymentMethod) || resolvedPaymentMethods[0];

  const handleCopyNumber = (num) => {
    if (!num || typeof navigator === 'undefined') return;
    navigator.clipboard?.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in your name, phone number, and delivery address.');
      return;
    }

    if (paymentMethod !== 'cod' && (!senderNumber.trim() || !trxId.trim())) {
      setError(`Please enter your ${activePayment.name} number and Transaction ID.`);
      return;
    }

    setSubmitting(true);
    const res = await createOrderAction({
      name,
      email: effectiveEmail,
      phone,
      address,
      note,
      area: area === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka',
      paymentMethod,
      paymentName: activePayment.name,
      senderNumber: paymentMethod === 'cod' ? null : senderNumber,
      trxId: paymentMethod === 'cod' ? null : trxId,
      items: cart,
      subtotal: cartTotal,
      deliveryFee,
      total: grandTotal,
    });
    setSubmitting(false);

    if (!res?.success) {
      setError(res?.error || 'Could not place order. Please try again.');
      return;
    }

    setCartDirect([]);
    setConfirmedOrder(res.order);
    setConfirmationEmailSent(Boolean(res.confirmationEmailSent));
  };

  if (confirmedOrder) {
    return (
      <div className="bg-gray-50 min-h-screen py-14">
        <Container>
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 text-center shadow-sm space-y-5 animate-card-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              <FiCheckCircle />
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
              Order Confirmed!
            </h1>
            <p className="text-gray-500 text-sm">
              Thank you, <strong>{confirmedOrder.name}</strong>! Your order{' '}
              <span className="font-bold text-orange-500">{confirmedOrder.orderId}</span> has been
              received.
              {confirmationEmailSent && confirmedOrder.userEmail && (
                <>
                  {' '}
                  A confirmation email has been sent to{' '}
                  <strong className="text-gray-700">{confirmedOrder.userEmail}</strong>.
                </>
              )}
            </p>

            <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-2 text-sm border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-semibold text-gray-900">{confirmedOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Area:</span>
                <span className="font-semibold text-gray-900">{confirmedOrder.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Address:</span>
                <span className="font-semibold text-gray-900 text-right max-w-xs">
                  {confirmedOrder.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-semibold text-orange-500">
                  {confirmedOrder.paymentName}
                </span>
              </div>
              {confirmedOrder.trxId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-semibold text-gray-900">{confirmedOrder.trxId}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-extrabold text-base text-gray-900">
                <span>Total Amount:</span>
                <span className="text-orange-500">
                  ৳{confirmedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <InvoiceActions order={confirmedOrder} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1 justify-center">
              <Link
                href="/product"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition shadow-sm"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-500 font-semibold text-sm transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="bg-gray-50 min-h-screen py-14 flex items-center justify-center">
        <Container>
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-xs space-y-3">
            <FiLoader className="text-3xl text-orange-500 animate-spin mx-auto" />
            <p className="text-sm font-medium text-gray-600">Checking your account...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="bg-gray-50 min-h-screen py-14">
        <Container>
          <div className="max-w-lg mx-auto bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 text-center shadow-sm space-y-5 animate-card-in">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto text-2xl">
              <FiLock />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-gray-900">
              Login or Register Required
            </h1>
            <p className="text-gray-500 text-sm">
              Please log in to your BagBazar account or create a new account before proceeding to
              checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <Link
                href="/login?callbackUrl=/checkout"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition shadow-sm"
              >
                Login to Continue
              </Link>
              <Link
                href="/register?callbackUrl=/checkout"
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-500 font-semibold text-sm transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-14">
        <Container>
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto text-2xl">
              <FiShoppingBag />
            </div>
            <h1 className="font-heading font-bold text-xl text-gray-900">
              No items to checkout
            </h1>
            <p className="text-gray-400 text-sm">
              Add some products to your cart before proceeding to checkout.
            </p>
            <Link
              href="/product"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              Explore Bags
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 transition mb-6"
        >
          <FiArrowLeft /> Back to Cart
        </Link>

        <h1 className="font-heading font-extrabold text-3xl text-gray-900 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
              <h2 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
                <FiTruck className="text-orange-500" />
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address (for Order Confirmation &amp; Invoice)
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={effectiveEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Delivery Area *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setArea('dhaka')}
                    className={`p-3 rounded-xl border-2 text-left text-sm transition cursor-pointer ${
                      area === 'dhaka'
                        ? 'border-orange-500 bg-orange-50 text-gray-900 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}
                  >
                    <p className="font-bold">Inside Dhaka</p>
                    <p className="text-xs text-gray-500">Delivery fee: ৳60</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setArea('outside')}
                    className={`p-3 rounded-xl border-2 text-left text-sm transition cursor-pointer ${
                      area === 'outside'
                        ? 'border-orange-500 bg-orange-50 text-gray-900 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}
                  >
                    <p className="font-bold">Outside Dhaka</p>
                    <p className="text-xs text-gray-500">Delivery fee: ৳120</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House, Road, Area, District..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Order Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Any special instruction..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
              <h2 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
                <FiSmartphone className="text-orange-500" />
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resolvedPaymentMethods.map((method) => {
                  const isActive = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition cursor-pointer ${
                        isActive
                          ? `${method.color} shadow-xs`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <PaymentMethodLogo id={method.id} logoUrl={method.logoUrl} />
                        <span
                          className={`w-3 h-3 rounded-full ${
                            isActive ? method.badge : 'bg-gray-200'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 leading-snug">{method.desc}</p>
                    </button>
                  );
                })}
              </div>

              {paymentMethod !== 'cod' && activePayment && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 animate-card-in">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Please send{' '}
                      <strong className="text-orange-500">৳{grandTotal.toLocaleString()}</strong> to{' '}
                      <strong className="text-gray-900">{activePayment.accountNumber}</strong> via{' '}
                      <strong>{activePayment.name}</strong> and provide the details below:
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyNumber(activePayment.rawNumber || activePayment.accountNumber)
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-orange-400 text-[11px] font-semibold text-gray-700 transition cursor-pointer shrink-0"
                    >
                      {copiedNumber ? (
                        <>
                          <FiCheck className="text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <FiCopy />
                          <span>Copy Number</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Your {activePayment.name} Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:border-orange-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Transaction ID (TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 9A7B6C5D"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:border-orange-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs sticky top-24 space-y-5">
              <h2 className="font-heading font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
                Order Summary ({cart.length} items)
              </h2>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} • {item.selectedColor} • {item.selectedSize}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0">
                      ৳{((item.price || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ৳{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-gray-900">৳{deliveryFee}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-orange-500">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {submitting ? 'Placing Order...' : `Confirm Order (৳${grandTotal.toLocaleString()})`}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
