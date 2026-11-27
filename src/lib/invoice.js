function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildInvoiceDocumentHtml(order) {
  const orderId = escapeHtml(order?.orderId || 'N/A');
  const status = escapeHtml((order?.status || 'pending').toUpperCase());
  const dateStr = order?.createdAt
    ? new Date(order.createdAt).toLocaleString('en-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-BD');

  const itemsRows = (order?.items || [])
    .map((item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      const lineTotal = price * qty;
      const variant = [item.selectedColor, item.selectedSize].filter(Boolean).join(' • ');
      const rawImg = item.image || item.images?.[0];
      const imgUrl =
        rawImg && typeof rawImg === 'string'
          ? rawImg.startsWith('http') || rawImg.startsWith('data:')
            ? rawImg
            : `${typeof window !== 'undefined' ? window.location.origin : ''}${rawImg.startsWith('/') ? rawImg : `/${rawImg}`}`
          : null;
      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              ${imgUrl ? `<img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(item.name)}" style="width:42px;height:42px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb;flex-shrink:0;" />` : ''}
              <div>
                <div class="item-name">${escapeHtml(item.name)}</div>
                ${variant ? `<div class="item-meta">${escapeHtml(variant)}</div>` : ''}
              </div>
            </div>
          </td>
          <td class="center">${qty}</td>
          <td class="right">৳${price.toLocaleString()}</td>
          <td class="right bold">৳${lineTotal.toLocaleString()}</td>
        </tr>
      `;
    })
    .join('');

  const subtotal = Number(order?.subtotal) || 0;
  const deliveryFee = Number(order?.deliveryFee) || 0;
  const total = Number(order?.total) || subtotal + deliveryFee;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BagBazar Invoice #${orderId}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f3f4f6;
      color: #111827;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice {
      max-width: 720px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      overflow: hidden;
    }
    .header {
      background: #0F2A43;
      color: #ffffff;
      padding: 24px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .brand {
      font-size: 24px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .brand span { color: #F26B21; }
    .sub {
      margin: 4px 0 0;
      font-size: 12px;
      color: #cbd5e1;
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
      letter-spacing: 0.5px;
    }
    .body { padding: 28px; }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 22px;
      font-size: 13px;
      line-height: 1.55;
    }
    .grid p { margin: 0 0 4px; }
    .label { color: #6b7280; font-weight: 600; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      background: #f3f4f6;
      color: #374151;
      text-align: left;
      padding: 10px 12px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }
    .item-name { font-weight: 600; color: #111827; }
    .item-meta { font-size: 12px; color: #6b7280; margin-top: 2px; }
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: 700; }
    .totals {
      margin-top: 18px;
      margin-left: auto;
      max-width: 280px;
      font-size: 14px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      color: #374151;
    }
    .totals-grand {
      border-top: 2px solid #e5e7eb;
      margin-top: 8px;
      padding-top: 10px;
      font-size: 18px;
      font-weight: 800;
      color: #F26B21;
    }
    .footer {
      margin-top: 28px;
      padding-top: 16px;
      border-top: 1px dashed #d1d5db;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .invoice { border: none; border-radius: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div>
        <h1 class="brand">Bag<span>Bazar</span></h1>
        <p class="sub">Invoice #${orderId} &bull; ${escapeHtml(dateStr)}</p>
      </div>
      <div class="badge">${status}</div>
    </div>
    <div class="body">
      <div class="grid">
        <div>
          <p><span class="label">Customer:</span> ${escapeHtml(order?.name)}</p>
          <p><span class="label">Phone:</span> ${escapeHtml(order?.phone)}</p>
          ${order?.userEmail || order?.email ? `<p><span class="label">Email:</span> ${escapeHtml(order?.userEmail || order?.email)}</p>` : ''}
        </div>
        <div>
          <p><span class="label">Delivery Area:</span> ${escapeHtml(order?.area)}</p>
          <p><span class="label">Address:</span> ${escapeHtml(order?.address)}</p>
          <p><span class="label">Payment:</span> ${escapeHtml(order?.paymentName)}${order?.trxId ? ` (TrxID: ${escapeHtml(order.trxId)})` : ''}</p>
        </div>
      </div>

      ${order?.note ? `<p style="font-size: 13px; color: #4b5563; margin: 0 0 18px;"><strong>Note:</strong> ${escapeHtml(order.note)}</p>` : ''}

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th class="center">Qty</th>
            <th class="right">Price</th>
            <th class="right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>Subtotal</span>
          <strong>৳${subtotal.toLocaleString()}</strong>
        </div>
        <div class="totals-row">
          <span>Delivery Charge</span>
          <strong>৳${deliveryFee.toLocaleString()}</strong>
        </div>
        <div class="totals-row totals-grand">
          <span>Grand Total</span>
          <span>৳${total.toLocaleString()}</span>
        </div>
      </div>

      <div class="footer">
        Thank you for shopping with BagBazar! Keep this invoice for your records.
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function printOrderInvoice(order) {
  if (!order || typeof document === 'undefined') return;
  const html = buildInvoiceDocumentHtml(order);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  const cleanup = () => {
    setTimeout(() => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 1000);
  };

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      cleanup();
    }
  }, 150);
}

export function downloadOrderInvoice(order) {
  if (!order || typeof document === 'undefined') return;
  const html = buildInvoiceDocumentHtml(order);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `BagBazar-Invoice-${order.orderId || 'order'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
