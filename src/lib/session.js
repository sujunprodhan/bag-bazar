import { cookies } from 'next/headers';

const SESSION_COOKIE = 'bagbazar_session_id';

export async function getSessionId(createIfMissing = false) {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId && createIfMissing) {
    sessionId = crypto.randomUUID();
    cookieStore.set(SESSION_COOKIE, sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  return sessionId || null;
}
