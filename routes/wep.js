const express = require("express");
const TaskController = require("../controllers/TaskController ");
const StudentController = require("../controllers/StudentController");
const AdminController = require("../controllers/AdminController");
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
const PasswordReset = require("../vendor/Authenticate/PasswordReset");
const {
  signedResetToken,
} = require("../vendor/Authenticate/middlewares/signedResetToken");
const Admin = require("../models/admin");
// const { authorize } = require("../middlewares/authorize/authorize");//تنقل مكانها على ملف الفيندور
// const { Json } = require("sequelize/types/utils");//ايررور لما افعلها

router.get("password/reset", (req, res) => {
  //1
  //show the reset view to enter email and perform '/password/reset' POST request
  // The user visits this route to enter their email.
  // The frontend will show a form where the user provides their email address.
});

router.post("password/reset", (req, res) => {
  //do the request here to genereate the reset URL//2
  //  The user submits their email via a form.
  // The system calls PasswordReset.instance.forEmail("isaac@email.com").requestReset();, which generates a reset link.
  // This reset link usually contains a token and an email query (e.g., /password/token?email=isaac@email.com).
  PasswordReset.instance.forEmail("isaac@email.com").requestReset(); //moved to the wep
});

router.get("/password/:token", signedResetToken, (req, res) => {
  //3 //التحقق من الرابط ثم // redirect to reset screen and reset password
  // The user clicks on the reset link received via email.
  // The server extracts:
  // req.params.token: The token from the URL.
  // req.query.email: The email passed as a query parameter.
  // Logs the token and email to the console for debugging.
  // The system should verify if the token is valid.
  // (Missing in Code): If valid, redirect the user to a frontend reset form.
  console.log(`Token : ${req.params.token} :: Email:${req.query.email}`); //query //المتغير الي بعد علامة الاستفهام في الرابط
  console.log("redirect to reset screen and reset password");
  // res.redirect('')
});

router.post("/password/reset", (req, res) => {
  //4
  //perform reset operations
  // The user submits a new password and confirmation password.
  // Verifies the provided email.
  // Ensures the passwords match.
  // Updates the user’s password in the database.
  // Saves the changes.
  PasswordReset.instance
    .broker("user") //لو بدون بروكر كان اشتغل على الديفولت //student
    .resetPassword(
      "email",
      "password",
      "password_confirmation",
      (user, password) => {
        user.password = password;
        user.save();
      }
    );
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
        return value === "student" || value === "admin";
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
      .custom((value, { req }) => {
        if (req.session.guard === "student") {
          return Student.count({ where: { email: value } }).then((count) => {
            if (count == 0) return Promise.reject("Email is not registerd");
          });
        } else if (req.session.guard === "admin") {
          return Admin.count({ where: { email: value } }).then((count) => {
            if (count == 0) return Promise.reject("Email is not registerd");
          });
        }
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

router.get("/admins", authenticate, AdminController.index);
router.get("/admins/create", authenticate, AdminController.create); //عرض واجهة الانشاء
router.post(
  "/admins",
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
        let count = await Admin.count({ where: { email: value } });
        if (count > 0) {
          return Promise.reject("E_mail is aldeady used , use another one ");
        }
      }),
  ],
  authenticate,
  AdminController.store
);
router.get("/admins/:id", authenticate, AdminController.show);
router.get("/admins/:id/edit", authenticate, AdminController.edit);
router.put("/admins/:id", authenticate, AdminController.update);
router.delete("/admins/:id", authenticate, AdminController.destroy);

module.exports = router;
