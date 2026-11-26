'use server';

import { collections, dbConnect } from '@/lib/dbConnect';
import { getSessionId } from '@/lib/session';
import { getAuthSession } from '@/lib/getAuthSession';
import { sendAddToCartEmail } from '@/lib/mailer';

export async function getCart() {
  try {
    const sessionId = await getSessionId(false);
    if (!sessionId) return [];
    const items = await dbConnect(collections.CART)
      .find({ sessionId })
      .sort({ createdAt: 1 })
      .toArray();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}

export async function addToCartAction(product, options = {}) {
  try {
    if (!product?._id) return await getCart();
    const sessionId = await getSessionId(true);
    const color = options.color || product.colors?.[0] || 'Default';
    const size = options.size || product.sizes?.[0] || 'Standard';
    const qty = Math.max(1, Number(options.quantity) || 1);
    const key = `${product._id}-${color}-${size}`;

    const cartCol = dbConnect(collections.CART);
    const existing = await cartCol.findOne({ sessionId, key });

    if (existing) {
      await cartCol.updateOne(
        { sessionId, key },
        {
          $inc: { quantity: qty },
          $set: { updatedAt: new Date() },
        }
      );
    } else {
      await cartCol.insertOne({
        sessionId,
        key,
        productId: product._id,
        name: product.name,
        price: product.price || 0,
        oldPrice: product.oldPrice || null,
        image: product.images?.[0] || null,
        category: product.category || 'bag',
        selectedColor: color,
        selectedSize: size,
        quantity: qty,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const authSession = await getAuthSession();
    if (authSession?.user?.email) {
      await sendAddToCartEmail({
        to: authSession.user.email,
        userName: authSession.user.name,
        product,
        color,
        size,
        quantity: qty,
      });
    }

    const items = await cartCol.find({ sessionId }).sort({ createdAt: 1 }).toArray();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error('Error adding to cart:', error);
    return [];
  }
}

export async function updateCartQtyAction(key, newQty) {
  try {
    if (newQty < 1) return await getCart();
    const sessionId = await getSessionId(false);
    if (!sessionId) return [];

    const cartCol = dbConnect(collections.CART);
    await cartCol.updateOne(
      { sessionId, key },
      { $set: { quantity: Number(newQty), updatedAt: new Date() } }
    );
    const items = await cartCol.find({ sessionId }).sort({ createdAt: 1 }).toArray();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return [];
  }
}

export async function removeFromCartAction(key) {
  try {
    const sessionId = await getSessionId(false);
    if (!sessionId) return [];

    const cartCol = dbConnect(collections.CART);
    await cartCol.deleteOne({ sessionId, key });
    const items = await cartCol.find({ sessionId }).sort({ createdAt: 1 }).toArray();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error('Error removing from cart:', error);
    return [];
  }
}

export async function clearCartAction() {
  try {
    const sessionId = await getSessionId(false);
    if (!sessionId) return [];

    await dbConnect(collections.CART).deleteMany({ sessionId });
    return [];
  } catch (error) {
    console.error('Error clearing cart:', error);
    return [];
  }
}
