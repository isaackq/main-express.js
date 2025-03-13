const Task  = require("../models/Tasks")
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Student = require("../models/students");
const { validationResult } = require("express-validator");

exports.index = async (req, res) => {
  let result = await Task.findAll({include : [{model : Student , as : "students"}]});
  // let result = await Task.findAll({include : [Student]});//في حال بدناش نغير الاسم
  // res.status(201).send({status : true , data : result})
  req.headers.accept === "application/json"
  ? res.status(201).send({status : true , data : result})
  : res.render("layouts/students/read", {
      title: "ALL Tasks",
      data: result,
    });
  //
};
exports.show = async (req, res, next) => {//بنضيف للستيودنت حسب الايدي تبع التاسك 
  let result =await Student.findByPk(req.body.student_id);
  let task = await Task.findByPk(req.params.id);//هان ببنجيب التاسك وبنضيفو على الستيودمنت في الستور بنكريت التاسك وبنضيفو على الستيودنت 
  await result.addTask(task);
res.send({status : true , data:result })
  //
};
exports.create = (req, res, next) => {
  res.render("layouts/tasks/create")
  //
};
exports.store = async (req, res, next) => {

let error = validationResult(req);
if (error.isEmpty()) {
    // let result =await  Task.create(req.body);
  // res.send({status : true , data: result})
 let student = await Student.findByPk(req.body.student_id)
 if (student) {
   //  let result = await student.createTask({title: req.body.title});//هادي مش راح تربط مع الستيودنت
  // let task = new Task();
  // task.title = req.body.title;
  // task.student_id = req.body.student_id;
  // task.save();
  let task =await  Task.create({title : req.body.title});//بتاخد اوبجكت وبتعمل انسرت على الستيودنت ريفيرنس 
  let result = await student.addTask(task);//هادي مش راح تربط مع الستيودنت
  //add بتاخد كرييتد اوبجكت على ستويدنت ريفيرنس نل في التيبل تبع التاسك وبتعملو ابديت في الستيودنت اي دي
  res.status(201).send({status : true , data: task})
 }
 return res.status(404).send({status : false , message : "Student NOT FOUND"})
}else{
  return res.status(404).send({status  : false , message : error.array({onlyFirstError: true})[0].msg})
}

  //
};
exports.edit = (req, res, next) => {
  //
};

exports.update = async (req, res, next) => {
  //
};

exports.destroy = async (req, res) => {
  //
};

exports.softDelete = async (req, res) => {
  //
};



exports.restore = async  (req , res )=>{
//
};
