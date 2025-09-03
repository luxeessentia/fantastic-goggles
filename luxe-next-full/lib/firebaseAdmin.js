// Firebase Admin helper (used by server API routes if you configure admin credentials in Vercel).
let admin;
export function initFirebaseAdmin() {
  if (admin) return admin;
  try {
    const adminSdk = require('firebase-admin');
    if (!adminSdk.apps.length) {
      if (process.env.FIREBASE_ADMIN_CONFIG) {
        const cfg = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);
        adminSdk.initializeApp({ credential: adminSdk.credential.cert(cfg) });
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        adminSdk.initializeApp();
      } else {
        return null;
      }
    }
    admin = adminSdk;
    return admin;
  } catch (e) {
    console.warn('firebase-admin not configured', e.message || e);
    return null;
  }
}