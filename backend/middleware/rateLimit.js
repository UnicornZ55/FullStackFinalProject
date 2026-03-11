const WINDOW = 15 * 60 * 1000; // 15 minutes
const LIMIT = 5;

const ipTracker = {};

export const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!ipTracker[ip]) {
    ipTracker[ip] = { count: 1, start: now };
    return next();
  }

  const record = ipTracker[ip];
  // Function 3.3 C4
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