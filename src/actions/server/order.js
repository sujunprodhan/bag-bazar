'use server';

import { getAuthSession } from '@/lib/getAuthSession';
import { collections, dbConnect } from '@/lib/dbConnect';
import { getSessionId } from '@/lib/session';
import { sendOrderConfirmationEmail } from '@/lib/mailer';
import { sendOrderConfirmationSms } from '@/lib/sms';

export async function createOrderAction(orderData) {
  try {
    const sessionId = await getSessionId(true);
    const authSession = await getAuthSession();
    const orderId = `BB-${Date.now().toString().slice(-6)}`;

    const doc = {
      orderId,
      sessionId,
      userId: authSession?.user?.id || null,
      userEmail: orderData.email?.trim() || authSession?.user?.email || null,
      name: orderData.name,
      phone: orderData.phone,
      area: orderData.area,
      address: orderData.address,
      note: orderData.note || '',
      paymentMethod: orderData.paymentMethod,
      paymentName: orderData.paymentName,
      senderNumber: orderData.senderNumber || null,
      trxId: orderData.trxId || null,
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      deliveryFee: orderData.deliveryFee || 0,
      total: orderData.total || 0,
      status: 'pending',
      createdAt: new Date(),
    };

    await dbConnect(collections.ORDER).insertOne(doc);
    await dbConnect(collections.CART).deleteMany({ sessionId });

    const [emailResult, smsResult] = await Promise.all([
      sendOrderConfirmationEmail(doc),
      sendOrderConfirmationSms(doc),
    ]);

    return {
      success: true,
      order: JSON.parse(JSON.stringify(doc)),
      confirmationEmailSent: Boolean(emailResult?.sent),
      smsSent: Boolean(smsResult?.sent),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Failed to place order. Please try again.' };
  }
}

export async function getOrdersAction() {
  try {
    const sessionId = await getSessionId(false);
    if (!sessionId) return [];

    const orders = await dbConnect(collections.ORDER)
      .find({ sessionId })
      .sort({ createdAt: -1 })
      .toArray();
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
