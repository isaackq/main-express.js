exports.guest = (req, res, next) => {
  if ("isAuthenticated" in req.session) {
    if (req.session.isAuthenticated) {
      return res.redirect("/cms"); //ازا كان اوثونتيكيتد وديه على الهوم وازا لا رجعو
    }
  }
  next();
};
