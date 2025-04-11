const bcrypt = require("bcrypt");
const Student = require("../../models/students");
const { validationResult } = require("express-validator");
const Auth = require("../../services/Authenticate");
const { saveLog } = require("../../utils/logger");

exports.showlogin = (req, res, next) => {
  // console.log(req.query.e); //http://localhost:5000/cms/student/login?e=isaac
  const validator = validationResult(req);
  if (validator.isEmpty()) {
    req.session.guard = req.params.guard;
    res.render("layouts/auth/login", { title: "log in" });
  } else {
    // next(new Error("page Not Found"))
    // res.render("layouts/errors/404-error")
    // next();//رح تيجي صفحة الايرور لانو الرابط مش حيكون موجود
    throw new Error("INVALID URL"); //وبخلي الجينيرال هاندرلر يهندل الايرور
  }
};

exports.login = async (req, res, next) => {
  //قاري الستيودنت لانو ماخدها من الديفولت
  //نموذج اولي من الفاكتوري كلمة وحدة بتغير كل اللوجيك
  //يعني نمرر كلمة ستودنت يكون في كلاس تاني بشتغل معاها في الو دوال كاملة بس حاليا بنشتغل على مستوى الكلمة والدالة الوحدة
  // Auth.guard("student").attempt(req);

  const validator = validationResult(req);
  if (validator.isEmpty()) {
    let result = await Auth.guard(req.session.guard).attempt(req); //بنعمل ريستارت عشان نفرغ السيشن تاني
    // let result = Auth.attempt(req);//هيك بنكون مفعلين الديفولت
    if (result) {
      saveLog(`🗑️ ${req.session.guard}  ${req.session.user.email} loged in`);
      res.redirect("/cms");
      // res.send({ status: "shut the fuck up  " });
    } else {
      saveLog(`🗑️ ${req.session.guard}  loged in`);
      return res
        .with("errors", [{ msg: "Wrong credentials" }])
        .with("old", req.body)
        .redirect(`/cms/${req.session.guard}/login`);
    }
  } else {
    return res
      .with("errors", validator.array())
      .with("old", req.body)
      .redirect(`/cms/${req.session.guard}/login`);
  }
  // const validator = validationResult(req);
  // if (validator.isEmpty()) {
  //   const student = await Student.findOne({ where: { email: req.body.email } }); //تحققنا من وجود الايميل من الاول من الفاليديتور
  //   if (bcrypt.compareSync(req.body.password, student.password)) {//بتقارن الهاش بالهاش
  //     req.session.user = student;
  //     req.session.isAuthenticated = true;
  //     return res.redirect("/cms/admin");
  //   }else{        //الاولد عشان يضل الايميل لو كان الباسورد غلط
  //       return res.with("errors",[{"msg":"Wrong credentials"}]).with("old",req.body).redirect("/cms/admin/auth/login");
  //   }
  // } else {
  //   return res
  //     .with("errors",validator.array())
  //     .with("old", req.body)
  //     .redirect("/cms/admin/auth/login");
  // }

  //
};
exports.logout = (req, res, next) => {
  //Auth.guard('Student').logout();
  saveLog(`🚪${req.session.guard} ${req.session.user.email} logged out`);
  req.session.user = undefined;
  req.session.isAuthenticated = undefined;
  res.redirect(`/cms/${req.session.guard}/login`);
};
exports.forgotpassword = (req, res, next) => {};
exports.editpassword = (req, res, next) => {};
exports.updatepassword = (req, res, next) => {};
