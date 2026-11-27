'use server';

import { getAuthSession } from '@/lib/getAuthSession';
import { collections, dbConnect } from '@/lib/dbConnect';

const PAYMENT_SETTINGS_KEY = 'payment_settings';

const DEFAULT_PAYMENT_SETTINGS = {
  bkash: { number: '01608-054610', accountType: 'Personal', enabled: true, logoUrl: '/bkash.png' },
  nagad: { number: '01608-054610', accountType: 'Personal', enabled: true, logoUrl: '/nogad.jpg' },
  rocket: { number: '01608-054610', accountType: 'Personal', enabled: true, logoUrl: '/roketpay.png' },
  upay: { number: '01608-054610', accountType: 'Personal', enabled: true, logoUrl: '/upay.png' },
};

function normalizeSettings(doc) {
  const result = {};
  for (const key of ['bkash', 'nagad', 'rocket', 'upay']) {
    const incoming = doc?.[key] || {};
    const fallback = DEFAULT_PAYMENT_SETTINGS[key];
    result[key] = {
      number: typeof incoming.number === 'string' && incoming.number.trim() ? incoming.number.trim() : fallback.number,
      accountType: ['Personal', 'Merchant', 'Agent'].includes(incoming.accountType)
        ? incoming.accountType
        : fallback.accountType,
      enabled: typeof incoming.enabled === 'boolean' ? incoming.enabled : fallback.enabled,
      logoUrl:
        typeof incoming.logoUrl === 'string' && incoming.logoUrl.trim()
          ? incoming.logoUrl.trim()
          : fallback.logoUrl,
    };
  }
  return result;
}

export async function getPaymentSettingsAction() {
  try {
    const doc = await dbConnect(collections.SETTINGS).findOne({ key: PAYMENT_SETTINGS_KEY });
    return normalizeSettings(doc);
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return DEFAULT_PAYMENT_SETTINGS;
  }
}

export async function updatePaymentSettingsAction(payload) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }

    const normalized = normalizeSettings(payload);
    await dbConnect(collections.SETTINGS).updateOne(
      { key: PAYMENT_SETTINGS_KEY },
      {
        $set: {
          key: PAYMENT_SETTINGS_KEY,
          ...normalized,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return { success: true, settings: normalized };
  } catch (error) {
    console.error('Error updating payment settings:', error);
    return { success: false, error: 'Failed to save payment settings' };
  }
}
