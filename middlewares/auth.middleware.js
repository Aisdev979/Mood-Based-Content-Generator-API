const authMiddleware = (req, res, next) => {
  // Temporary mock authentication
  req.user = { id: "mockUserId" };
  next();
};

export default authMiddleware;