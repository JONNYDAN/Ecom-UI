import admin from './firebaseAdmin';

export async function getAuthUser(req) {
  try {
    // 1. Kiểm tra header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    // 2. Kiểm tra định dạng Bearer token
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Invalid token format');
    }

    // 3. Xác thực với Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken || !decodedToken.uid) {
      throw new Error('Invalid token');
    }

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      name: decodedToken.name || ''
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}