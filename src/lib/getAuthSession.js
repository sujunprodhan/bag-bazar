import { cookies, headers } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collections, dbConnect } from '@/lib/dbConnect';

export async function getAuthSession() {
  try {
    let user = null;

    try {
      const cookieStore = await cookies();
      const headerStore = await headers();

      const cookieMap = Object.fromEntries(
        cookieStore.getAll().map((c) => [c.name, c.value])
      );
      const headerMap = Object.fromEntries(headerStore.entries());

      const token = await getToken({
        req: { headers: headerMap, cookies: cookieMap },
        secret: authOptions.secret,
      });

      if (token) {
        user = {
          id: token.id || token.sub,
          name: token.name,
          email: token.email,
          role: token.role || 'user',
          image: token.image || token.picture || null,
        };
      }
    } catch {
    }

    if (!user) {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        user = { ...session.user };
      }
    }

    if (!user) return null;

    if (user.email) {
      try {
        const email = user.email.trim().toLowerCase();
        const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const dbUser = await dbConnect(collections.USER).findOne(
          { email: { $regex: new RegExp(`^${escaped}$`, 'i') } },
          { projection: { role: 1, name: 1, image: 1 } }
        );
        if (!dbUser) {
          return null;
        }
        user.role = dbUser.role || user.role || 'user';
        if (dbUser.name) user.name = dbUser.name;
        if (dbUser.image) user.image = dbUser.image;
      } catch {
      }
    }

    return { user };
  } catch (error) {
    console.error('Error reading auth session:', error);
    return null;
  }
}
