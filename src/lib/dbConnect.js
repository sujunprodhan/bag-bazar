import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'bagbzar';

export const collections = {
  PRODUCT: 'product',
  CART: 'cart',
  FAVORITE: 'favorite',
  ORDER: 'order',
  USER: 'user',
  CHAT: 'chat',
  SETTINGS: 'settings',
};

const client = uri
  ? new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
  : null;

export const dbConnect = (cname) => {
  if (!client) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  return client.db(dbName).collection(cname);
};

