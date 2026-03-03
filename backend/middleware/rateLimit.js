const ipTracker = {};

export const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!ipTracker[ip]) {
    ipTracker[ip] = { count: 1, start: now };
  } else {
    ipTracker[ip].count++;
  }

  if (ipTracker[ip].count > 5 && now - ipTracker[ip].start < 10000) {
    return res.status(429).json({ message: "Too many requests" });
  }

  if (now - ipTracker[ip].start > 10000) {
    ipTracker[ip] = { count: 1, start: now };
  }

  next();
};