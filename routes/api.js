const express = require("express");
// const { index, show, create, store, edit, update, destroy, restore, softDelete } = require("../controllers/StudentController");
// const CategoryController = require("../controllers/StudentController")
const StudentController = require("../controllers/StudentController");
const TaskController = require("../controllers/TaskController ");
const { body, check, param, validationResult } = require("express-validator");
const Student = require("../models/students");
const { where } = require("sequelize");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  verifyToken,
} = require("../vendor/Authenticate/middlewares/verifyJwtToken");
const fs = require("fs");

//THE SAME AS WEP BUT WITHOUT EDIT AND CREATE

// router.get("/categories",index);
// router.get("/categories/:id",show);
// router.post("/categories",store);
// router.put("/categories/:id",update);
// router.delete("/categories/:id",destroy);

router.get("/students", StudentController.index);
router.get("/students/:id", StudentController.show);
router.post(
  "/students",
  [
    body("email")
      .trim()
      .normalizeEmail()
      .notEmpty()
      .withMessage("email should not be empty")
      .isEmail()
      .withMessage("You should enter email")
      // .isCurrency()//معاملات البنك
      // .custom(async (value)=>{
      //  let result = await Student.findOne({where :{email : value }})
      //   if (result) {
      //     return Promise.reject("E_mail is aldeady used , use another one ")
      //   }
      // })
      .custom(async (value) => {
        let count = await Student.count({ where: { email: value } });
        if (count > 0) {
          return Promise.reject("E_mail is aldeady used , use another one "); //الريتيرن زي الكاتش للايرور الي هو الريجكشن
        } //promis.reject= throu exiption
        //الريتيرن عشان نرجع الايرور على الكاتش بلوك تبع الفاليديشن روول
      }),
    body("gender")
      .trim()
      .notEmpty()
      .withMessage("Gender must not be empty value ")
      //   .isAlpha()//هالك
      //   .withMessage("gender must be char")
      .isIn(["M", "F"])
      .withMessage("gender can only be M or F"),
  ],
  StudentController.store
);
//في حالة الابديت غلط اعمل تشك فاليديتور ازا الايميل موجود او  لا لانو لو بدي  اعدل لنفس الايميبل رح يقول الايميل متكرر
router.put(
  "/students/:id",
  [
    param("id")
      .isNumeric({ no_symbols: true })
      .custom((value) => {
        return Student.count({ where: { id: value } }).then((count) => {
          //نفس الي فوق بس من غير اسنك و اويت
          if (count == 0) return Promise.reject("Student not found");
        }); //ريجكت عكسها ريسولف بس ما بنستخدمها لانو احنا بنتحقق من الاخطاء فش داعي يعني لو في ايررو اعمل ريجكت لو فش بنكمل
        //rejection من جوا البرومس
        //reject and resolve is 2 methods in the promis that tell the sucsiis or fail of the promis operation من جواة قالب الذين
      }),
  ],
  StudentController.update
);
router.delete("/students/:id", StudentController.destroy);
router.get("/students/:id/restore", StudentController.restore);
router.delete("/students/:id/softDelete", StudentController.softDelete);

router.get("/tasks", TaskController.index);
router.get("/tasks/:id", TaskController.show);
//is alpha عندها خصائص اكتر مثلا  لو بدنا نخليها حروف لغة معينة
//locate حروف من لغة معينة
router.post(
  "/tasks",
  body("title")
    .trim()
    .isAlpha()
    .withMessage("Titel must have chars only")
    .isLength({ min: 3, max: 10 })
    .withMessage("Title must be at least 3 "),
  TaskController.store
);
//يعني ميكنش في رموز في الرقم
router.put("/tasks/:id", TaskController.update);
router.delete("/tasks/:id", TaskController.destroy);
router.get("/tasks/:id/restore", TaskController.restore);
router.delete("/tasks/:id/softDelete", TaskController.softDelete);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is requierd")
      .isEmail()
      .withMessage("Email must be valid")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("password is requierd"),
    /*.isStrongPassword()*/
  ],
  async (req, res, next) => {
    const validator = validationResult(req);
    if (validator.isEmpty()) {
      const { email, password } = req.body;
      let student = await Student.findOne({
        where: { email: email },
      });
      if (student) {
        if (bcrypt.compareSync(password, student.password)) {
          const token = await student.createToken(`user-${student.id}`, true); //ازا بدنا يلغي التوكنز الي قبل بنحطها ترو اما ازا يضلو شغالات بنحطها فولس
          // student.setDataValue("token" ,token)
          student.dataValues.token = token; //add to this instance only
          return res.status(200).send({
            status: true,
            message: "Logged in successfully",
            data: student,
          });
        } else {
          return res // return is used to end the exution of the rest of the code
            .status(400)
            .send({ status: false, message: "Wrong Password" });
        }
      } else {
        res
          .status(400)
          .send({ status: false, message: "No Student with sent email " });
      }
    } else {
      res.status(400).send({
        status: false,
        message: validator.array({ onlyFirstError: true })[0].msg,
      });
    }
  }
);

router.get("/logout", verifyToken, async (req, res) => {
  console.log("Passed and Verifyed Token");
  // console.log(user.token);
  // user.token = req.token

  const user = req.user;
  const loggedOut = await user.logout(); // فش داعي لانو نحذف اليوزر من الريقويست //because the connection in the token is statless //لما تخلص العملية مش حتكون معرف
  //the sesstion is statfull
  // console.log("sdsdfsdfsdf", loggedOut);

  res.send({
    status: loggedOut,
    message: loggedOut ? "Logged Out Successfully" : "LogOut Failed",
    // user: req.user,
    // token: req.token,
  });
});

router.post("/image", verifyToken, (req, res, next) => {
  res.send({ status: true, message: "Success", image: req.file });
});

router.get("/image/:id", verifyToken, (req, res) => {
  //const image = awiat Image.findByBk(req.params.id)
  fs.unlink("/storge/image_name", (errro) => {});//detetes the folder from the file 
});
//البروتوتايب بكون على الكلاس مش على الاوبجكت
// await user.reload(); // removes temporary fields
// user.dataValues.token = "abc123";
// user.setDataValue('fullName', user.firstName + ' ' + user.lastName);

//normal compare only pause the function when useing async and  await but do not breake the eventloop
//compareSync breake the eventloop //Your whole function is paused ✅
// And the event loop itself is paused ❌

// normalizeEmail()
// Lowercases the email.
// Removes dots (.) and plus signs (+) in Gmail addresses.
// Helps standardize email formats before saving or comparing them.

module.exports = router;
