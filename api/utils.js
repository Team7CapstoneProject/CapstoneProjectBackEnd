function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
      error: "MissingUserError",
    });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.is_admin === false) {
    res.status(403);
    next({
      name: "MissingAdminError",
      message: "You must be an admin to perform this action",
      error: "MissingAdminError",
    });
  }
  next();
}

module.exports = {
  requireUser,
  requireAdmin,
};
