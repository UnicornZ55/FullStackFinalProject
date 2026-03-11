import jwt from "jsonwebtoken";

// In-memory blacklist for tokens that should no longer be accepted.
// Keys: token string; values: expiry timestamp (ms).
const blacklist = new Map();

// Periodically purge expired tokens to avoid memory growth.
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
setInterval(() => {
  const now = Date.now();
  for (const [token, expireAt] of blacklist.entries()) {
    if (expireAt <= now) {
      blacklist.delete(token);
    }
  }
}, CLEANUP_INTERVAL);

export const addTokenToBlacklist = (token) => {
  if (!token) return;

  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded !== "object" || !decoded.exp) return;

  // exp is in seconds
  const expireAt = decoded.exp * 1000;
  blacklist.set(token, expireAt);
};

export const isTokenBlacklisted = (token) => {
  if (!token) return false;
  const expireAt = blacklist.get(token);
  if (!expireAt) return false;

  if (Date.now() > expireAt) {
    blacklist.delete(token);
    return false;
  }

  return true;
};
