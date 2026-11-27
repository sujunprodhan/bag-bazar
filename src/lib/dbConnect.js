import { MongoClient, ServerApiVersion } from 'mongodb';

export const collections = {
  PRODUCT: 'product',
  CART: 'cart',
  FAVORITE: 'favorite',
  ORDER: 'order',
  USER: 'user',
  CHAT: 'chat',
};

let client;

function getClient() {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  return client;
}

export const dbConnect = (cname) => {
  const dbName = process.env.DB_NAME || 'BagBazar';
  return getClient().db(dbName).collection(cname);
};
