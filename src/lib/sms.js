export function normalizeBdPhone(phone) {
  if (!phone || typeof phone !== 'string') return null;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('880') && digits.length >= 13) return digits;
  if (digits.startsWith('01') && digits.length === 11) return `88${digits}`;
  if (digits.startsWith('1') && digits.length === 10) return `880${digits}`;
  return digits;
}

async function sendSmsSafe({ to, message, logLabel }) {
  const normalized = normalizeBdPhone(to);
  if (!normalized) {
    return { sent: false, reason: 'Invalid or missing phone number' };
  }

  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) {
    console.log(`[SMS Preview - ${logLabel}] To: ${normalized} | Message: ${message}`);
    return { sent: false, reason: 'SMS gateway not configured' };
  }

  const apiUrl = process.env.SMS_API_URL || 'https://bulksmsbd.net/api/smsapi';
  const senderId = process.env.SMS_SENDER_ID || '8809617613541';

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      type: 'text',
      number: normalized,
      senderid: senderId,
      message,
    });

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`SMS API responded with status ${response.status}`);
    }

    return { sent: true };
  } catch (error) {
    console.error(`Error sending ${logLabel} SMS:`, error);
    return { sent: false, reason: error.message };
  }
}

export async function sendOrderConfirmationSms(order) {
  const to = order?.phone;
  const message = `BagBazar: আপনার অর্ডার #${order?.orderId} গ্রহণ করা হয়েছে। সর্বমোট: ৳${Number(order?.total || 0).toLocaleString()} (${order?.paymentName || 'COD'})। শীঘ্রই অ্যাপ্রুভ করে জানানো হবে।`;
  return sendSmsSafe({ to, message, logLabel: 'Order Confirmation' });
}

export async function sendOrderApprovedSms(order) {
  const to = order?.phone;
  const message = `BagBazar: আপনার অর্ডার #${order?.orderId} অ্যাপ্রুভ করা হয়েছে! সর্বমোট: ৳${Number(order?.total || 0).toLocaleString()}। ডেলিভারির জন্য প্রস্তুত করা হচ্ছে।`;
  return sendSmsSafe({ to, message, logLabel: 'Order Approved' });
}
