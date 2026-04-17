export const requireRole = (role) => {
  return (req, res, next) => {
    const userRole = req.headers["x-role"];

    if (!userRole) {
      return res.status(401).json({ error: "Role header missing" });
    }

    if (userRole !== role) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};