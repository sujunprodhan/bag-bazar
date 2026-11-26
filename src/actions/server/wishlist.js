'use server';

import { collections, dbConnect } from '@/lib/dbConnect';
import { getSessionId } from '@/lib/session';

export async function getFavorites() {
  try {
    const sessionId = await getSessionId(false);
    if (!sessionId) return [];

    const docs = await dbConnect(collections.FAVORITE)
      .find({ sessionId })
      .sort({ createdAt: -1 })
      .toArray();
    return JSON.parse(JSON.stringify(docs.map((d) => d.product)));
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

export async function toggleFavoriteAction(product) {
  try {
    if (!product?._id) return await getFavorites();
    const sessionId = await getSessionId(true);
    const favCol = dbConnect(collections.FAVORITE);

    const existing = await favCol.findOne({ sessionId, productId: product._id });
    if (existing) {
      await favCol.deleteOne({ sessionId, productId: product._id });
    } else {
      await favCol.insertOne({
        sessionId,
        productId: product._id,
        product,
        createdAt: new Date(),
      });
    }

    const docs = await favCol.find({ sessionId }).sort({ createdAt: -1 }).toArray();
    return JSON.parse(JSON.stringify(docs.map((d) => d.product)));
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return [];
  }
}

export async function clearFavoritesAction() {
  try {
    const sessionId = await getSessionId(false);
    if (!sessionId) return [];

    await dbConnect(collections.FAVORITE).deleteMany({ sessionId });
    return [];
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return [];
  }
}
