module.exports = function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden

  if (!(req.user.role === "CS" || req.user.role === "ADMIN"))
    return res.status(403).send({ error: "Access denied." });
  next();
};
