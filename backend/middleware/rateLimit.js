const WINDOW = 10 * 1000; // 10 seconds
// const WINDOW = 15 * 60 * 1000; // 15 minutes
const LIMIT = 5;
const CLEANUP_INTERVAL = 1000;

const ipTracker = {};

// Periodically remove expired windows so stale IP entries do not accumulate.
setInterval(() => {
  const now = Date.now();

  for (const clientIp of Object.keys(ipTracker)) {
    if (now - ipTracker[clientIp].start > WINDOW) {
      delete ipTracker[clientIp];
    }
  }
}, CLEANUP_INTERVAL);

export const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!ipTracker[ip]) {
    ipTracker[ip] = { count: 1, start: now };
    return next();
  }

  const record = ipTracker[ip];
  // Reset counter after the configured window.
  if (now - record.start > WINDOW) {
    delete ipTracker[ip];
    ipTracker[ip] = { count: 1, start: now };
    return next();
  }

  record.count++;

  if (record.count > LIMIT) {
    const remaining = Math.ceil(
      (record.start + WINDOW - now) / 1000
    );

    return res.status(429).json({
      message: "Too many requests",
      retry_after: remaining,
    });
  }

  next();
};