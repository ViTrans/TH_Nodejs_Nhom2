const allowedRoles = (roles) => {
  return (req, res, next) => {
    if (!Array.isArray(roles)) {
      req.session.path = req.url;
      return res.render("403");
    }
    const roleUser = req.session.user.role;
    if (!roles.some((role) => role === roleUser)) {
      req.session.path = req.url;
      return res.render("403");
    }
    if (
      roleUser !== "admin" &&
      (req.body.username || req.params.username) !== req.session.user.username
    )
      return res.render("403");

    return next();
  };
};
const isLogin = (req, res, next) => {
  if (!req?.session?.user) {
    req.session.path = req.url;
    return res.redirect("/");
  }
  return next();
};
export { allowedRoles, isLogin };
