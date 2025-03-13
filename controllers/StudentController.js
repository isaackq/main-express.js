const Student = require("../models/students");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Task = require("../models/Tasks");
const { validationResult } = require("express-validator");

/**
 * Has many
 * - getTasks()
 * - countTasks()
 * - hasTasks()
 * - addTasks()
 * - createTasks()
 * - removeTasks()
 */

exports.index = async (req, res) => {
  //لما تكون ترو يعني هات الي  السوفت ديليت تبعتو نل
  let result = await Student.findAll({
    paranoid: false,
    //Eager loading
    // include: [{ model: Task, as: "tasks" }], //with in laravel
  }); //يعني جيب المحذوف والمش  محذوف

  req.headers.accept === "application/json"
    ? res.send({ data: result })
    : res.render("layouts/students/read", {
        title: "ALL Students",
        data: result,
      });
  //انكلود عشان نعرض الستيودنت مع تاسكاته
  //
};
exports.show = async (req, res, next) => {
  // let result = await Student.findByPk(req.params.id);
  // let result = await Student.findAll({where : {id : req.params.id}})
  let result = await Student.findOne({
    //فايند اوول بنقدرش نعمل منها قيت للتاسكس
    where: { id: { [Op.eq]: req.params.id } },
    // paranoid :false//هيك صار يجيب المحذوف لما نطلبو بالرقم
  });

  //Lazy Loading
  let tasks = await result.getTasks(); //لو كان  الاستدعاء من جهة الستيودنت رح تكون قيت ستيودنت لانو العلاقة واحد ل واحد حسب التسمية

  if (Object.keys(result).length != 0) {
    return res.send({ data: result, tasks: tasks });
  }
  return res.send({ status: false, message: "item not found" });

  // let result = await Students.findAll({where :{ id: { /*[Op.gte]:7 ,*/ /*[Op.lte]:6 ,*/[Op.eq]:6  }}});
  //eq the defualt op
  //
};
exports.create = (req, res, next) => {
  // const errors = req.session.errors;
  // const old = req.session.old;//بدنا ننقلو على الميدل وير 
  // req.session.errors= null ;
  // req.session.old= null ;//تفريغ للسيشنز

  res.render("layouts/students/create", {
    title: "Create Studenet",
    // errors: errors,//  من بعد الميدل وير 
    // old: old,
  });

  //
};
exports.store = async (req, res, next) => {
  let error = validationResult(req);
  if (error.isEmpty()) {
    try {
      /// First way
      // let student = new Student();
      // student.fullName = req.body.fullName ;//off
      // student.firstName = req.body.firstName ;
      // student.lastName = req.body.lastName ;
      // student.email = req.body.email ;
      // student.password = bcrypt.hashSync(req.body.password, 10) ;//كم دورة هاش على الباسوورد الافتراضي 10
      // student.gender = req.body.gender;
      // const saved =await student.save();
      // res.send({status : saved , result : saved});

      ///Second way
      //اسم الكولومز لازم يكون نفس اسم الكييز
      //ولازم ميكنش في custamization on the data
      // let result = await Student.create(req.body); //صح بس  الباسورد لازمها تشفير
      // res.send({ status: true, data: result });

      let result = await Student.create({
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10),
      }); //صح بس  الباسورد لازمها تشفير
      // res.status(201).send({ status: true, data: result });


      //Level 2 
  //  if ( req.headers.accept != "application/json") //بدنا ننتقل عى لفل 3 باستخدام ويذ
  //  req.session.flashed = {message : "Created Successfully"}//ضفنا على  السيشن الفلاش 
    
      req.headers.accept === "application/json"
        ? res.status(201).send({ status: true, data: result })
        : res.with("message","Created Successfully").redirect("/cms/students");
    } catch (error) {
      // console.log(error);
      res.status(400).send({
        status: false,
        error:
          Object.keys(error).length > 0
            ? error.errors[0].message
            : "Somthing went wrong",
      });
    } //ضرورية عشان نتعامل مع الابجكت لما يكون فاضي
  } else {
    // req.headers.accept === 'application/json' ?  res.status(202).send({ status: false,messagee: error.array({ onlyFirstError: true })[0].msg})
    // : res.status(422).render("layouts/students/create",{title: "Create Studenet",errors:error.array()});

    // return res.status(202).send({
    //   status: false,
    //   messagee: error.array({ onlyFirstError: true })[0].msg, //يعني لو 3 اخطاء حصلت على مستوى الايميل بجيب خطا واحد بس
    // });
 

    //هيك الفلاشد في  حالة غير الستور رح تكون ان ديفايند 
    //Level 2 
    // req.session.flashed = {old:req.body , errors:error.array() };//عرفناه قبل عشان لو ضفنا عليه وهوا مش موجود رح يعمل ان ديفايند
    // req.session.old = req.body;//عشان بدنا نرجع على الكرييت لازم نكون محملين هادي البيانات 
    // req.session.errors = error.array();//Level 1
    res.with("old",req.body).with("errors",error.array()).redirect("/cms/admin/students/create"); //لما نعمل ريداركت بنكون مسحنا كل اشي من الريسبونس
  }

  //
};

exports.edit = (req, res, next) => {
  //
};

exports.update = async (req, res, next) => {
  let validator = validationResult(req);
  if (validator.isEmpty()) {
    let student = await Student.findByPk(req.params.id);
    // if (student != null) {//بطل الها لازمة بعد الفاليديتور
    try {
      //بنستخدم  هادي الطريقة في حال كنا بدنا نعدل على اشي ولازم نفحص البيانت ازا بنفع نعدل او لا عشان بنجيب كل العناصر
      // student.fullName = req.body.fullName ;
      // student.email = req.body.email ;
      // student.gender = req.body.gender ;
      // let saved =await student.save();  //ازا كان جاي من ريفرنس من الداتا بيز بكون ابديت اما ازا جديد انسيرت
      // return res.status(200).send({status : saved , result : saved});

      //دالة الابديت ستاتيك اما الوير بترجع اوبجكت
      //في هادي الحالة بلزمش اجيب الاوبجكت من الدالة الي فوق
      let [saved] = await Student.update(req.body, {
        where: { id: req.params.id }, //برجع ازا انعمل تعديل اول لا
      });
      return res
        .status(200)
        .send({ status: saved == 1, result: saved == 1 ? "yes" : "NO" });
    } catch (error) {
      return res.status(400).send({
        status: false,
        error:
          Object.keys(error).length > 0
            ? error.errors[0].message
            : "Somthing went wrong",
      });
    }
    // }
    // return res.status(404).send({ status: false, message: "NOT FOUND" });بطل الها لازمة بعد الفاليديتور
  } else {
    return res.status(400).send({
      status: false,
      messagee: validator.array({ onlyFirstError: true })[0].msg, //يعني لو 3 اخطاء حصلت على مستوى الايميل بجيب خطا واحد بس
    });
  }

  //
};

exports.destroy = async (req, res) => {
  //طريقة 1
  let result = await Student.destroy({
    where: { id: req.params.id },
    force: true,
  });
  // res.send({result : result});

  //طريقة 2
  // let student = await Student.findOne({ where: { id: req.params.id } });
  // // let student = await Student.findByPk(req.params.id);
  // if (student != null) {
  //   let result = await student.destroy({
  //     force: true /*لما يمحي بمحي بالكامل*/,
  //   });
  //   return res.send({ status: result });
  // }
  // return res.status(404).send({ status: false, message: "NOT FOUND" });
  req.headers.accept === "application/json"
    ? res.send({ result: result })
    : res.redirect("/cms/admin/students");

  //
};

exports.softDelete = async (req, res) => {
  //طريقة 1
  // let result = await  Student.destroy({where:{id : req.params.id}});
  // res.send({result : result});

  //طريقة 2
  let student = await Student.findOne({ where: { id: req.params.id } });
  // let student = await Student.findByPk(req.params.id);
  if (student != null) {
    let result = await student.destroy({ force: false });
    return res.send({ status: result });
  }
  return res.status(404).send({ status: false, message: "NOT FOUND" });
  //
};

exports.restore = async (req, res) => {
  // let result = await Student.restore({where :{id : req.params.id}});
  let result = await Student.findByPk(req.params.id, { paranoid: false }); //زي الي فوق
  try {
    if (result.isSoftDeleted()) {
      await result.restore();
      return res.send({ status: true, message: "Item restored" });
    } else {
      return res.send({
        status: false,
        message: " This item is not soft deleted",
      });
    }
  } catch (error) {
    return res.send({ error: "Item is full deleted" });
  }
};
