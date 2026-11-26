'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
} from 'react-icons/fi';
import Container from '@/layout/Container';

const contactCards = [
  {
    icon: FiPhone,
    title: 'Phone & WhatsApp',
    detail: '+880 1700-000000',
    sub: 'Sat–Thu, 9:00 AM – 9:00 PM',
  },
  {
    icon: FiMail,
    title: 'Email Support',
    detail: 'support@bagbazar.com',
    sub: 'We reply within 24 hours',
  },
  {
    icon: FiMapPin,
    title: 'Flagship Store',
    detail: 'House 24, Road 11, Banani, Dhaka',
    sub: 'Visit us for in-store pickup',
  },
  {
    icon: FiClock,
    title: 'Business Hours',
    detail: '10:00 AM – 9:00 PM',
    sub: 'Open 7 days a week',
  },
];

const Contact = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;
    setSubmitted(true);
    setName('');
    setContact('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative overflow-hidden bg-primary text-white py-16 sm:py-20">
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <Container>
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-accent">Contact Us</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl leading-tight">
              We&apos;d Love to Hear From You
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Have a question about an order, bulk corporate bags, or product sizing? Reach out to
              our support team anytime.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {contactCards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50 text-accent flex items-center justify-center text-xl mb-4">
                    <Icon />
                  </div>
                  <h3 className="font-heading font-bold text-sm text-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="font-semibold text-sm text-gray-900">{item.detail}</p>
                  <p className="text-xs text-muted mt-1">{item.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-7 sm:p-9 shadow-xs">
              <h2 className="font-heading font-extrabold text-2xl text-primary mb-1">
                Send Us a Message
              </h2>
              <p className="text-muted text-sm mb-6">
                Fill out the form below and our team will get back to you shortly.
              </p>

              {submitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-3 animate-card-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                    <FiCheckCircle />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Thank you for contacting BagBazar. We will reply to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-90 transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Phone or Email *
                      </label>
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="01XXXXXXXXX or email"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Order inquiry, product question..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-accent focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent hover:opacity-90 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <FiSend />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-xs space-y-4">
                <h3 className="font-heading font-bold text-xl text-primary">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="border-b border-gray-100 pb-3">
                    <p className="font-bold text-gray-900 mb-1">
                      How long does delivery take?
                    </p>
                    <p className="text-muted text-xs leading-relaxed">
                      Inside Dhaka takes 24–48 hours. Outside Dhaka takes 2–4 working days via
                      steadfast courier.
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-3">
                    <p className="font-bold text-gray-900 mb-1">
                      What payment methods are accepted?
                    </p>
                    <p className="text-muted text-xs leading-relaxed">
                      Cash on Delivery (COD), bKash, Nagad, Rocket, and Upay are all supported.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">
                      Can I exchange a product?
                    </p>
                    <p className="text-muted text-xs leading-relaxed">
                      Yes, unused items in original condition can be exchanged within 7 days of
                      delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
