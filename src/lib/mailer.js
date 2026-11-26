import nodemailer from 'nodemailer';

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user, pass },
  });
}

export async function sendAddToCartEmail({ to, userName, product, color, size, quantity }) {
  if (!to) return { sent: false, reason: 'No recipient email' };

  const transporter = getTransporter();
  const subject = `Added to Cart: ${product.name} | BagBazar`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
      <div style="background: #0F2A43; color: #fff; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 20px;">Bag<span style="color: #F26B21;">Bazar</span></h2>
        <p style="margin: 4px 0 0; font-size: 13px; color: #cbd5e1;">Item Added to Your Shopping Cart</p>
      </div>
      <div style="padding: 24px;">
        <p style="margin-top: 0; color: #1a1a1a;">Hi <strong>${userName || 'Customer'}</strong>,</p>
        <p style="color: #4b5563; font-size: 14px;">You just added the following item to your BagBazar cart:</p>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 6px; font-weight: bold; font-size: 16px; color: #0F2A43;">${product.name}</p>
          <p style="margin: 0; font-size: 13px; color: #6b7280;">
            Color: <strong>${color}</strong> &bull; Size: <strong>${size}</strong> &bull; Qty: <strong>${quantity}</strong>
          </p>
          <p style="margin: 10px 0 0; font-size: 16px; font-weight: bold; color: #F26B21;">
            Price: ৳${Number(product.price || 0).toLocaleString()}
          </p>
        </div>
        <p style="font-size: 13px; color: #6b7280;">
          Complete your order anytime from your Cart or Checkout page with Cash on Delivery, bKash, Nagad, Rocket, or Upay.
        </p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Preview - Add to Cart] To: ${to} | Subject: ${subject}`);
    return { sent: false, reason: 'SMTP not configured' };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"BagBazar" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (error) {
    console.error('Error sending Add to Cart email:', error);
    return { sent: false, reason: error.message };
  }
}

export async function sendOrderInvoiceEmail(order) {
  const to = order?.userEmail || order?.email;
  if (!to) return { sent: false, reason: 'No recipient email on order' };

  const transporter = getTransporter();
  const subject = `Order Approved & Invoice #${order.orderId} | BagBazar`;

  const itemsRows = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 13px;">
          <strong>${item.name}</strong><br/>
          <span style="color: #6b7280; font-size: 12px;">${item.selectedColor || ''} • ${item.selectedSize || ''}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 13px;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 13px;">৳${Number(item.price || 0).toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 13px; font-weight: bold;">৳${(Number(item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: #0F2A43; color: #fff; padding: 24px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="margin: 0; font-size: 22px;">Bag<span style="color: #F26B21;">Bazar</span> Invoice</h1>
          <p style="margin: 4px 0 0; font-size: 13px; color: #cbd5e1;">Order #${order.orderId} &bull; Status: <strong style="color: #34d399;">APPROVED</strong></p>
        </div>
      </div>
      <div style="padding: 24px;">
        <p style="margin-top: 0; font-size: 14px; color: #1f2937;">
          Hi <strong>${order.name}</strong>, your order has been <strong>approved</strong> by BagBazar and is now being prepared for delivery!
        </p>
        <div style="background: #f9fafb; border-radius: 10px; padding: 14px; margin: 16px 0; font-size: 13px; color: #374151;">
          <p style="margin: 0 0 4px;"><strong>Customer:</strong> ${order.name} (${order.phone})</p>
          <p style="margin: 0 0 4px;"><strong>Delivery Area:</strong> ${order.area}</p>
          <p style="margin: 0 0 4px;"><strong>Address:</strong> ${order.address}</p>
          <p style="margin: 0;"><strong>Payment:</strong> ${order.paymentName}${order.trxId ? ` (TrxID: ${order.trxId})` : ''}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: #f3f4f6; text-align: left; font-size: 12px; color: #4b5563;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div style="margin-top: 16px; text-align: right; font-size: 14px; color: #374151;">
          <p style="margin: 4px 0;">Subtotal: <strong>৳${Number(order.subtotal || 0).toLocaleString()}</strong></p>
          <p style="margin: 4px 0;">Delivery Charge: <strong>৳${Number(order.deliveryFee || 0).toLocaleString()}</strong></p>
          <p style="margin: 8px 0 0; font-size: 18px; color: #F26B21;"><strong>Grand Total: ৳${Number(order.total || 0).toLocaleString()}</strong></p>
        </div>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Preview - Order Invoice] To: ${to} | Subject: ${subject}`);
    return { sent: false, reason: 'SMTP not configured' };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"BagBazar" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (error) {
    console.error('Error sending Order Invoice email:', error);
    return { sent: false, reason: error.message };
  }
}
