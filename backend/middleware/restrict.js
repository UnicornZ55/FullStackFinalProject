// Role hierarchy: higher number = higher privilege
// Admin can always access any restricted route (hierarchy override).
// This middleware expects auth middleware (protect) to run first so req.user exists.
const roleRank = {
  admin: 100,
  manager: 80,
  editor: 60,
  user: 40,
};

const normalizeRole = (role) => (typeof role === "string" ? role.trim().toLowerCase() : "");

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userRole = normalizeRole(req.user.role);

    // Admin always allowed
    if (userRole === "admin") {
      return next();
    }

    const allowedRoles = roles.map(normalizeRole).filter((r) => r.length > 0);

    if (allowedRoles.length === 0) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Explicit allow
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    // Hierarchy: allow if user's role rank is at least as high as the highest required role.
    const userRank = roleRank[userRole] ?? 0;
    const maxAllowedRank = Math.max(...allowedRoles.map((role) => roleRank[role] ?? 0));

    if (userRank > 0 && userRank >= maxAllowedRank) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden" });
  };
};