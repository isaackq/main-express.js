const express = require("express");
const TaskController = require("../controllers/TaskController ");
const StudentController = require("../controllers/StudentController");
const DashboardController = require("../controllers/DashboardController");
const AuthController = require("../controllers/Auth/AuthController");
const { check, body, param } = require("express-validator");
const router = express.Router();
const Student = require("../models/students");
const { authenticate } = require("../middlewares/authenticate");
const { where } = require("sequelize");
const { guest } = require("../middlewares/guest");
const { auth } = require("../config/auth");
const { authorize } = require("../vendor/Auth/middlewares/authorize");
// const { authorize } = require("../middlewares/authorize/authorize");//تنقل مكانها على ملف الفيندور
// const { Json } = require("sequelize/types/utils");//ايررور لما افعلها

router.get("/password/:token", (req, res) => {
  console.log(`Token : ${req.params.token} :: Email:${req.query.email}`);//query //المتغير الي بعد علامة الاستفهام في الرابط 
});

router.get("/test", (req, res, next) => {
  //رابط استثنائي يكون فعال في لحظة المينتيننس
  //يعني مثلا النظام كان بتعرض لاختراق ف لازم نعملو اوف عشان نتبع اللوق ونشوف تسجيلات الدخول والخروج
  //يعني نخلي لوحة التحكم شغالة بس الموقع نازل
  res.send({
    status: true,
    message: "This is exceptional rout to be available during maintainance",
  });
});

//guard //idenfire //بعرف التايب اوف يوزر
router.get(
  "/:guard/login",
  [
    param("guard")
      .isString() //هالك
      .custom((value) => {
        // JSON.parse(value)  //parse عكس stringify
        // if (value !== "admin" && value !== "user") {
        //   // throw new Error("NOt found");
        //   return false ;
        // } else {
        //   return true;
        // }
        return value === "student" || value === "user";
        // return value in auth.guards[0];
        // return !(value  in ["admin", "student"])
      }),
  ],
  guest,
  AuthController.showlogin
); //راوت للقيستس فقط
router.post(
  "/auth/login",
  guest,
  [
    body("email")
      .isEmail()
      .custom((value) => {
        return Student.count({ where: { email: value } }).then((count) => {
          if (count == 0) return Promise.reject("Email is not registerd");
        });
      }),
    body("password").trim().notEmpty(),
  ],
  AuthController.login
);

router.get("/auth/logout", authenticate, AuthController.logout);

//مسؤولة  عن عرض محتويات الصفحة الرئيسية
router.get("/", authenticate, DashboardController.home); //content manegment system نظام ادارة المحتوى
//لازم نحط الاوثينتيكيت على كل وحدة منهم عشان نضمن انو ميدخلش الصفحة غير لما يكون مسجل دخول
router.get("/students", authenticate, StudentController.index);
router.get("/students/create", authenticate, StudentController.create); //عرض واجهة الانشاء
router.get("/students/:id", authenticate, StudentController.show);
router.get("/students/:id/edit", authenticate, StudentController.edit);
router.post(
  "/students",
  authenticate, //لازم قبل الفاليديشن
  [
    body("firstName")
      .trim()
      .isString()
      .isLength({ min: 3, max: 20 })
      .withMessage("Cheak first name"),
    body("email")
      .trim()
      .isEmail()
      .custom(async (value) => {
        let count = await Student.count({ where: { email: value } });
        if (count > 0) {
          return Promise.reject("E_mail is aldeady used , use another one ");
        }
      }),
  ],
  StudentController.store
);
router.put("/students/:id", authenticate, StudentController.update);
router.delete("/students/:id", authenticate, StudentController.destroy);

router.get(
  "/tasks",
  authenticate,
  authorize("Read-Task"),
  TaskController.index
);
router.get(
  "/tasks/create",
  authenticate,
  authorize("Create-Task"),
  TaskController.create
); //عرض واجهة الانشاء
router.get("/tasks/:id", authenticate, TaskController.show);
router.get("/tasks/:id/edit", authenticate, TaskController.edit);
router.post("/tasks", authenticate, TaskController.store);
router.put("/tasks/:id", authenticate, TaskController.update);
router.delete("/tasks/:id", authenticate, TaskController.destroy);

module.exports = router;
