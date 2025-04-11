const { validationResult } = require("express-validator");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { Where } = require("sequelize/lib/utils");
const path = require("path");

exports.index = async (req, res, next) => {
  //
  // Admin
  const data = await Admin.findAll();
  return res.render("layouts/admins/read", { data: data });
};
exports.show = async (req, res, next) => {
  //
};
exports.create = async (req, res, next) => {
  //
  return res.render("layouts/admins/create");
};
exports.store = async (req, res, next) => {
  //
  const validator = validationResult(req);
  if (validator.isEmpty()) {
    // console.log(req.file.path);

    try {
      const admin = await Admin.create({
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10), //10 : Salt rounds determine how many times the hashing algorithm runs — it controls how slow/strong the hash is.
        image: `\\${req.file.path}`, //عشان سلاش تلغي سلاش
      });
      if (admin) {
        return res
          .with("message", "Create Successfuly ")
          .redirect("/cms/admins/create");
      } else {
        return res
          .with("messeage", "Create Failed")
          .with("old", req.body)
          .redirect("cms/admin/create");
      }
    } catch (error) {
      res.status(400).send({
        status: false,
        error:
          Object.keys(error) > 0
            ? error.errors[0].message
            : "Some thing Went worong",
      });
    }
  } else {
    res
      .with("old", req.body)
      .with("errors", validator.array())
      .redirect("/cms/admins/create");
  }
};
exports.edit = async (req, res, next) => {
  //
};
exports.update = async (req, res, next) => {
  //
};
exports.destroy = async (req, res, next) => {
  //لو كان في بارانويد يعني سوفت ديليت لازم منحذفش الصورة
  let admin = await Admin.findByPk(req.params.id);
  await admin.destroy({
    //returns the number of destroyed rows
    // where: { id: req.params.id },
    force: true,
  });
  console.log(admin);
  console.log(admin.image != "" || undefined || null);

  if (admin.image != "" /*|| undefined || null*/) {
    fs.unlink(path.join(require.main.path, admin.image), (error) => {
      console.log("UnLink Error", error);
    });
  }
  req.headers.accept === "application/json"
    ? res.send({ result: result })
    : res.redirect("/cms/admins");
};
//gives the root of directory for the application
//require.main.filename
//path.join(__dirname, admin.image)  //هادي بتجيب المكان الي احنا فيه
