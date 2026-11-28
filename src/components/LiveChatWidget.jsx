'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FiHeadphones, FiX, FiSend, FiLoader } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getUserChatMessagesAction, sendChatMessageAction } from '@/actions/server/chat';

const RAW_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '880 1608-054610';
const WHATSAPP_NUMBER = RAW_WHATSAPP.replace(/\D/g, '');
const WHATSAPP_TEXT = encodeURIComponent('Hello BagBazar! I need help with a product.');

export default function LiveChatWidget() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const bottomRef = useRef(null);

  const isAdmin = session?.user?.role === 'admin';
  const isLoggedIn = status === 'authenticated' && Boolean(session?.user?.email);

  useEffect(() => {
    if (!open || isAdmin) return;
    let active = true;

    const load = async () => {
      const data = await getUserChatMessagesAction();
      if (active) setMessages(data || []);
    };
    load();

    const timer = setInterval(load, 3000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [open, isAdmin]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setChatError('');
    const msg = text.trim();
    setText('');
    setSending(true);
    const res = await sendChatMessageAction({ text: msg, guestName });
    setSending(false);
    if (res?.success && Array.isArray(res.messages)) {
      setMessages(res.messages);
    } else if (res?.error) {
      setChatError(res.error);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col animate-card-in">
          <div className="bg-primary text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="font-heading font-bold text-sm leading-tight">BagBazar Live Chat</p>
                <p className="text-[11px] text-white/70">
                  {isLoggedIn
                    ? `Chatting as ${session.user.name || session.user.email}`
                    : 'Online • Chat with Admin'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close live chat"
              className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <FiX className="text-base" />
            </button>
          </div>

          {isAdmin ? (
            <div className="p-6 text-center space-y-3 bg-gray-50">
              <p className="text-sm font-bold text-primary">You are signed in as Admin</p>
              <p className="text-xs text-muted">
                Reply to all customer messages from the Admin Dashboard Live Chat tab.
              </p>
              <Link
                href="/dashboard?view=admin"
                onClick={() => setOpen(false)}
                className="inline-block px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-bold"
              >
                Open Admin Dashboard
              </Link>
            </div>
          ) : (
            <>
              <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-xs text-muted py-6 space-y-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-primary">
                        Hello {isLoggedIn ? session.user.name : guestName || 'there'}!
                      </p>
                      <p>Send a message and our admin will reply live.</p>
                    </div>
                    {!isLoggedIn && (
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full max-w-[220px] mx-auto px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:border-accent focus:outline-none"
                      />
                    )}
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isUser = m.senderRole === 'user';
                    return (
                      <div
                        key={m._id || idx}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-muted mb-0.5 px-1">
                          {isUser ? m.senderName || 'You' : 'Admin'}
                        </span>
                        <div
                          className={`max-w-[82%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed shadow-xs ${
                            isUser
                              ? 'bg-accent text-white rounded-br-none'
                              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                          }`}
                        >
                          {m.text}
                        </div>
                        {m.createdAt && (
                          <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {chatError && (
                <p className="px-4 py-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 border-t border-rose-100">
                  {chatError}
                </p>
              )}

              <form
                onSubmit={handleSend}
                className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !text.trim()}
                  className="p-2.5 rounded-xl bg-accent hover:opacity-90 disabled:opacity-50 text-white transition cursor-pointer"
                  aria-label="Send message"
                >
                  {sending ? (
                    <FiLoader className="text-sm animate-spin" />
                  ) : (
                    <FiSend className="text-sm" />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0D1321] hover:bg-[#141c2f] text-white text-xs font-bold shadow-xl transition-all hover:scale-105 cursor-pointer"
        >
          <span className="relative flex items-center justify-center">
            <FiHeadphones className="text-base" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </span>
          <span>Live Support</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-semibold text-gray-300">
            Live
          </span>
        </button>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Connect on WhatsApp"
          className="w-12 h-12 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white flex items-center justify-center shadow-xl transition-all hover:scale-110"
        >
          <FaWhatsapp className="text-2xl" />
        </a>
      </div>
    </div>
  );
}
