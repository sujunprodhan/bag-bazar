'use server';

import { ObjectId } from 'mongodb';
import { getAuthSession } from '@/lib/getAuthSession';
import { collections, dbConnect } from '@/lib/dbConnect';
import { getSessionId } from '@/lib/session';
import { sendOrderInvoiceEmail } from '@/lib/mailer';
import { sendOrderApprovedSms } from '@/lib/sms';
import { getAdminChatThreadsAction } from '@/actions/server/chat';
import { getPaymentSettingsAction } from '@/actions/server/settings';

async function requireAdmin() {
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function getUserDashboardData() {
  try {
    const session = await getAuthSession();
    if (!session?.user) return null;

    const sessionId = await getSessionId(false);
    const orFilters = [];
    if (session.user.email) orFilters.push({ userEmail: session.user.email });
    if (session.user.id) orFilters.push({ userId: session.user.id });
    if (sessionId) orFilters.push({ sessionId });

    const orders =
      orFilters.length > 0
        ? await dbConnect(collections.ORDER)
            .find({ $or: orFilters })
            .sort({ createdAt: -1 })
            .toArray()
        : [];

    const favorites = sessionId
      ? await dbConnect(collections.FAVORITE)
          .find({ sessionId })
          .sort({ createdAt: -1 })
          .toArray()
      : [];

    const cartItems = sessionId
      ? await dbConnect(collections.CART).find({ sessionId }).toArray()
      : [];

    const dbUser = session.user.email
      ? await dbConnect(collections.USER).findOne(
          { email: session.user.email.trim().toLowerCase() },
          { projection: { password: 1 } }
        )
      : null;

    return {
      orders: JSON.parse(JSON.stringify(orders)),
      favorites: JSON.parse(JSON.stringify(favorites.map((f) => f.product))),
      cartCount: cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0),
      hasPassword: Boolean(dbUser?.password),
    };
  } catch (error) {
    console.error('Error loading user dashboard:', error);
    return { orders: [], favorites: [], cartCount: 0 };
  }
}

export async function getAdminDashboardData() {
  try {
    await requireAdmin();

    const [orders, products, users, chatThreads, paymentSettings] = await Promise.all([
      dbConnect(collections.ORDER).find().sort({ createdAt: -1 }).toArray(),
      dbConnect(collections.PRODUCT).find().sort({ _id: -1 }).toArray(),
      dbConnect(collections.USER)
        .find({}, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .toArray(),
      getAdminChatThreadsAction(),
      getPaymentSettingsAction(),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;

    return {
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.length,
        totalUsers: users.length,
      },
      orders: JSON.parse(JSON.stringify(orders)),
      products: JSON.parse(JSON.stringify(products)),
      users: JSON.parse(JSON.stringify(users)),
      chatThreads: chatThreads || [],
      paymentSettings,
    };
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    return null;
  }
}

export async function updateOrderStatusAction(orderId, status) {
  try {
    await requireAdmin();
    const allowed = ['pending', 'approved', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return { success: false, error: 'Invalid status' };
    }

    const orderCol = dbConnect(collections.ORDER);
    await orderCol.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status, updatedAt: new Date() } }
    );

    let emailResult = null;
    let smsResult = null;
    if (status === 'approved') {
      const updatedOrder = await orderCol.findOne({ _id: new ObjectId(orderId) });
      if (updatedOrder) {
        [emailResult, smsResult] = await Promise.all([
          sendOrderInvoiceEmail(updatedOrder),
          sendOrderApprovedSms(updatedOrder),
        ]);
      }
    }

    return {
      success: true,
      invoiceEmailSent: Boolean(emailResult?.sent),
      smsSent: Boolean(smsResult?.sent),
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

export async function deleteOrderAction(orderId) {
  try {
    await requireAdmin();
    await dbConnect(collections.ORDER).deleteOne({ _id: new ObjectId(orderId) });
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    return { success: false, error: 'Failed to delete order' };
  }
}

function normalizeProductFields(data) {
  const name = data.name?.trim() || '';
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const rawCategory = (data.customCategory?.trim() || data.category || 'backpack')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const images = Array.isArray(data.images)
    ? data.images.filter(Boolean)
    : (data.imagesText || data.image || '')
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter(Boolean);

  const colors = Array.isArray(data.colors)
    ? data.colors.filter(Boolean)
    : (data.colors || '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

  const sizes = Array.isArray(data.sizes)
    ? data.sizes.filter(Boolean)
    : (data.sizes || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  const keyFeatures = Array.isArray(data.keyFeatures)
    ? data.keyFeatures.filter(Boolean)
    : (data.keyFeaturesText || '')
        .split(/\r?\n|,/)
        .map((f) => f.trim())
        .filter(Boolean);

  const highlights = Array.isArray(data.highlights)
    ? data.highlights.filter((h) => h?.title)
    : (data.highlightsText || '')
        .split(/\r?\n/)
        .map((line) => {
          const [title, ...rest] = line.split('|');
          const cleanTitle = title?.trim();
          const cleanSubtitle = rest.join('|').trim();
          return cleanTitle ? { title: cleanTitle, subtitle: cleanSubtitle } : null;
        })
        .filter(Boolean);

  return {
    name,
    slug,
    category: rawCategory || 'backpack',
    price: Number(data.price) || 0,
    oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
    images,
    colors: colors.length ? colors : ['Black'],
    sizes: sizes.length ? sizes : ['Standard'],
    keyFeatures,
    highlights,
    material: data.material?.trim() || '',
    sku: data.sku?.trim() || '',
    shortDescription: data.shortDescription?.trim() || data.description?.trim() || '',
    description: data.description?.trim() || data.shortDescription?.trim() || '',
    inStock: data.inStock !== undefined ? Boolean(data.inStock) : true,
    isNewArrival: Boolean(data.isNewArrival),
  };
}

export async function createProductAction(data) {
  try {
    await requireAdmin();
    const fields = normalizeProductFields(data);
    const doc = {
      ...fields,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await dbConnect(collections.PRODUCT).insertOne(doc);
    return {
      success: true,
      product: JSON.parse(JSON.stringify({ ...doc, _id: res.insertedId })),
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProductAction(productId, data) {
  try {
    await requireAdmin();
    const fields = normalizeProductFields(data);
    const updateDoc = {
      ...fields,
      updatedAt: new Date(),
    };

    const productCol = dbConnect(collections.PRODUCT);
    await productCol.updateOne(
      { _id: new ObjectId(productId) },
      { $set: updateDoc }
    );

    const updated = await productCol.findOne({ _id: new ObjectId(productId) });
    return {
      success: true,
      product: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProductAction(productId) {
  try {
    await requireAdmin();
    await dbConnect(collections.PRODUCT).deleteOne({ _id: new ObjectId(productId) });
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function updateUserRoleAction(userId, role) {
  try {
    await requireAdmin();
    if (!['user', 'admin'].includes(role)) {
      return { success: false, error: 'Invalid role' };
    }
    await dbConnect(collections.USER).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
}

export async function deleteUserAction(userId) {
  try {
    const session = await requireAdmin();
    const userCol = dbConnect(collections.USER);
    const target = await userCol.findOne({ _id: new ObjectId(userId) });

    if (!target) {
      return { success: false, error: 'User not found' };
    }

    if (target.email?.toLowerCase() === session.user.email?.toLowerCase()) {
      return { success: false, error: 'You cannot delete your own admin account' };
    }

    await userCol.deleteOne({ _id: new ObjectId(userId) });
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}
