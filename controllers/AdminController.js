const { validationResult } = require("express-validator");
const Admin = require("../models/admin");

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
  const validator = validationResult(req)
  if (validator.isEmpty()) {
   await Admin.create(req.body)
res.send({isaac:"adsasd"})
  }

};
exports.edit = async (req, res, next) => {
  //
};
exports.update = async (req, res, next) => {
  //
};
exports.destroy = async (req, res, next) => {
  //
};
//