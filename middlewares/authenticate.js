exports.authenticate = (req, res, next) => {
  if ("isAuthenticated" in req.session && "user" in req.session ) {
    if (req.session.isAuthenticated) {
      return next(); //لازم ريتيرن عشان النكست بتعملش لوكنق
    }
  }
  return res.redirect(`/cms/${req.session.guard}/login`)
};
