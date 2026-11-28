'use server';

import { collections, dbConnect } from '@/lib/dbConnect';
import { getAuthSession } from '@/lib/getAuthSession';
import { getSessionId } from '@/lib/session';

async function resolveUserConversation(createIfMissing = false) {
  const authSession = await getAuthSession();
  const userEmail = authSession?.user?.email?.trim().toLowerCase();

  if (userEmail) {
    return {
      authSession,
      conversationId: userEmail,
      senderName: authSession.user.name || userEmail,
      userEmail,
    };
  }

  const sessionId = await getSessionId(createIfMissing);
  if (!sessionId) {
    return { authSession, conversationId: null, senderName: 'Guest Visitor', userEmail: 'Guest' };
  }

  return {
    authSession,
    conversationId: `guest:${sessionId}`,
    senderName: 'Guest Visitor',
    userEmail: 'Guest Visitor',
  };
}

export async function getUserChatMessagesAction() {
  try {
    const { conversationId } = await resolveUserConversation(false);
    if (!conversationId) return [];

    const messages = await dbConnect(collections.CHAT)
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .toArray();

    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
}

export async function sendChatMessageAction({ text, guestName, targetConversationId }) {
  try {
    const cleanText = text?.trim();
    if (!cleanText) return { success: false, error: 'Message cannot be empty' };

    const authSession = await getAuthSession();
    const isAdmin = authSession?.user?.role === 'admin' && Boolean(targetConversationId);

    let conversationId;
    let senderName;
    let userEmail;

    if (isAdmin) {
      conversationId = targetConversationId;
      senderName = authSession.user.name || 'BagBazar Admin';
      userEmail = targetConversationId;
    } else {
      const resolved = await resolveUserConversation(true);
      conversationId = resolved.conversationId;
      senderName =
        authSession?.user?.email
          ? resolved.senderName
          : guestName?.trim() || resolved.senderName;
      userEmail = resolved.userEmail;
    }

    if (!conversationId) {
      return { success: false, error: 'Could not start chat session.' };
    }

    const doc = {
      conversationId,
      senderRole: isAdmin ? 'admin' : 'user',
      senderName,
      userEmail,
      text: cleanText,
      createdAt: new Date(),
    };

    await dbConnect(collections.CHAT).insertOne(doc);

    const messages = await dbConnect(collections.CHAT)
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .toArray();

    return {
      success: true,
      messages: JSON.parse(JSON.stringify(messages)),
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

export async function getAdminChatThreadsAction() {
  try {
    const authSession = await getAuthSession();
    if (authSession?.user?.role !== 'admin') {
      return [];
    }

    const allMessages = await dbConnect(collections.CHAT)
      .find()
      .sort({ createdAt: 1 })
      .toArray();

    const threadsMap = {};
    allMessages.forEach((msg) => {
      const cid = msg.conversationId;
      if (!cid) return;
      if (!threadsMap[cid]) {
        threadsMap[cid] = {
          conversationId: cid,
          customerName: msg.senderRole === 'user' ? msg.senderName : 'Customer',
          customerEmail: msg.userEmail || cid,
          messages: [],
          lastMessageAt: msg.createdAt,
        };
      }
      if (msg.senderRole === 'user' && msg.senderName) {
        threadsMap[cid].customerName = msg.senderName;
      }
      threadsMap[cid].messages.push(msg);
      threadsMap[cid].lastMessageAt = msg.createdAt;
    });

    const threads = Object.values(threadsMap).sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
    );

    return JSON.parse(JSON.stringify(threads));
  } catch (error) {
    console.error('Error loading admin chat threads:', error);
    return [];
  }
}
