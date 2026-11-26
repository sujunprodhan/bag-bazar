'use server';

import bcrypt from 'bcryptjs';
import { getAuthSession } from '@/lib/getAuthSession';
import { collections, dbConnect } from '@/lib/dbConnect';

export async function registerUserAction({ name, email, password }) {
  try {
    const cleanName = name?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Name must be at least 2 characters.' };
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const userCol = dbConnect(collections.USER);
    const escaped = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const emailQuery = { email: { $regex: new RegExp(`^${escaped}$`, 'i') } };
    const matched = await userCol.find(emailQuery).toArray();
    const existingWithPass = matched.find((u) => Boolean(u.password));

    const hashedPassword = await bcrypt.hash(password, 10);

    if (matched.length > 0) {
      if (!existingWithPass) {
        await userCol.updateMany(emailQuery, {
          $set: {
            email: cleanEmail,
            name: matched[0].name || cleanName,
            password: hashedPassword,
            updatedAt: new Date(),
          },
        });
        return {
          success: true,
          userId: matched[0]._id.toString(),
        };
      }
      return { success: false, error: 'An account with this email already exists.' };
    }

    const res = await userCol.insertOne({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      provider: 'credentials',
      role: 'user',
      createdAt: new Date(),
    });

    return {
      success: true,
      userId: res.insertedId.toString(),
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

export async function setUserPasswordAction({ password }) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const email = session.user.email.trim().toLowerCase();
    const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const hashedPassword = await bcrypt.hash(password, 10);

    await dbConnect(collections.USER).updateMany(
      { email: { $regex: new RegExp(`^${escaped}$`, 'i') } },
      { $set: { email, password: hashedPassword, updatedAt: new Date() } }
    );

    return { success: true };
  } catch (error) {
    console.error('Error setting password:', error);
    return { success: false, error: 'Failed to set password. Please try again.' };
  }
}
